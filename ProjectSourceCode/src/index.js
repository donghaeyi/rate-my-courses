//  Import dependencies
const express = require("express");
const app = express(); // Create Express app

const handlebars = require("express-handlebars");
const session = require('express-session');

const path = require("path");

const bodyParser = require('body-parser');

const bcrypt = require('bcrypt'); 
const pgp = require('pg-promise')();

const dbConfig = {
  host: 'db',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};

const db = pgp(dbConfig);

//  Setup Handlebars and link with Express
const hbs = handlebars.create({
  extname: "hbs",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// User data
app.use(session({
  secret: `7afca760099ef37f98ba3ce7ee6e5b65
  d961fbd1c995ef78c0bd5257622540a4
  9c1de46186bce144a88a6d0d5061ff23
  350ad7c3cbb18490ebc7e89503fabf19
  a3161f68756cce9229fde2ffabda596c
  a10a4ef4655e908e6b393af5f407e6b7
  629dfa6fcd9c410c35c471382bdf9803
  744701ea9e733b149134bf9ec38c9b06
  2c5280d3fdf1206b08d71761c24dce2b
  57119acee7b6adcb3f73738605543182`,
  username: undefined 
}))

// Begin routes

app.get("/", (req, res) => {
  if (req.session.username) {
    res.redirect('home')
  }
  else {
    res.redirect('login');
  }
});

app.get("/home", (req, res) => {
  if (req.session.username) {
    res.render('pages/home')
  }
  else {
    res.redirect('login');
  }
});

app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username.length > 100) { //Username input too large
    return;
  }

  const query = `SELECT * FROM Users 
                  WHERE
                    $1 = username 
                  LIMIT 1`;
  const values = [username];
  db.one(query, values)
    .then(data => {
      bcrypt.compare(password, data.password)
        .then(hash => { // Login successful!
          req.session.username = username;
          res.redirect('home');
        })
        .catch(err => { // Password incorrect!
          res.redirect('login');
          return console.log(err)
        });
    })
    .catch(err => { // User not found!
      res.redirect('login');
      return console.log(err)
    })
});

app.get('/register', (req, res) => {
  res.render('pages/register');
});

app.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username.length > 100) { // Username too large!
    return;
  }
  const queryDoesUserExist = `SELECT * FROM Users 
                                WHERE
                                  $1 = username 
                                LIMIT 1`;
  const valuesDoesUserExist = [username];
  db.oneOrNone(queryDoesUserExist, valuesDoesUserExist)
  .then(user => { // User exists!
    if (user) {
      res.redirect('register');
    }
    else { // User does not exist!
      const hash = bcrypt.hash(password, 10)
      const query = `INSERT INTO users 
                      (username, password)
                     VALUES
                      ($1, $2)`;
      const values = [username, hash]
      db.any(query, values) 
        .then(function (data) { // User successfully added!
          req.session.username = username;
          res.redirect('home');
        })
        .catch(function (err) { // Failed to add user!
          res.redirect('register');
          return console.log(err)
        });
    }
  })
  .catch(err => { // Query Error!
    return console.log(err)
  });
});

app.get('/logout', (req, res) => {
  req.session.username = undefined
  res.render('pages/logout');
})

app.listen(3000);
console.log("Server is listening on port 3000");
