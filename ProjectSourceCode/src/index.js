//  Import dependencies
const express = require("express");
const app = express(); // Create Express app
const session = require('express-session');
const bodyParser = require("body-parser");

const handlebars = require("express-handlebars");

const path = require("path");

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
  secret: `Super-Secret`,
  username: undefined 
}))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

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
  db.oneOrNone(query, values)
    .then(user => {
      if (user) {
        bcrypt.compare(password, user.password, (err, bcryptRes) => {
          if (err){
            return console.log(err)
          }
          if (bcryptRes) {
            req.session.username = username;
            res.redirect('home');
          } else {
            res.redirect('login');
          }
        });
      }
      else { // User not found!
        res.redirect('login');
      }
    })
    .catch(err => { // Queury Error!
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
  .then(async user => {
    if (user) { // User exists!
      res.redirect('register');
    }
    else { // User does not exist!
      const hash = await bcrypt.hash(password, 10)
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
