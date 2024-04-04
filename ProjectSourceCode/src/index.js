//  Import dependencies
const express = require("express");
const app = express(); // Create Express app
const session = require('express-session');
const bodyParser = require("body-parser");

const handlebars = require("express-handlebars");

const path = require("path");

const bcrypt = require('bcrypt'); 
const pgp = require('pg-promise')();

const statusCodes = require('./statusCodes.js');
const authentication = require('./authentication.js');

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
// Session stores client data.
// Data accessible via: req.session.varname
app.use(session({
  secret: `Super-Secret`,
  username: undefined,
  // Example of how to add more data:
  // varname: undefined
}))

// Used by register and login to login.
function login(req, res, user) {
  req.session.username = user.username
  res.redirect('home');
}

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
  res.redirect('login') // Set to res.redirect('home') when nav is complete.
}); 

app.get("/home", (req, res) => {
  res.render('pages/home')
});

app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username.length > 100) { // Username input too large for database
    let errorMsg = "Enter a username shorter than 100 characters.";
    res.render('pages/login', {username, password, errorMsg});
    res.statusCode = statusCodes.USERNAME_TOO_LARGE;
    return;
  }
  else if (username.length == 0) { // No username submitted
    let errorMsg = "Enter a username";
    res.render('pages/login', {password, errorMsg});
    res.statusCode = statusCodes.EMPTY_USERNAME;
    return;
  }
  else if (password.length == 0) { // No password submitted
    let errorMsg = "Enter a password";
    res.render('pages/login', {username, errorMsg});
    res.statusCode = statusCodes.EMPTY_PASSWORD;
    return;
  }

  const query = `SELECT * FROM Users 
                  WHERE
                    $1 = username 
                  LIMIT 1`;
  const values = [username];
  db.oneOrNone(query, values)
    .then(user => {
      if (user) { // User found!
        bcrypt.compare(password, user.password, (err, bcryptRes) => {
          if (err) { // bcrypt Error
            res.statusCode = statusCodes.BCRYPT_ERROR;
            return console.log(err)
          }
          if (bcryptRes) { // Password matches!
            res.statusCode = statusCodes.SUCCESSFUL_LOGIN;
            login(req, res, user)
          } 
          else { // Password does not match!
            let errorMsg = `Incorrect password!`
            res.statusCode = statusCodes.PASSWORD_DIDNT_MATCH;
            res.render('pages/login', {username, errorMsg});
          }
        });
      }
      else { // User not found!
        let errorMsg = `Couldnt find your account!`
        res.statusCode = statusCodes.USER_NOT_FOUND;
        res.render('pages/login', {username, errorMsg});
      }
    })
    .catch(err => { // Queury Error!
      res.statusCode = statusCodes.QUEURY_ERROR;
      return console.log(err)
    })
});

function loginRegistration(req, res, username) {
  const query = `SELECT * FROM Users 
                  WHERE
                    $1 = username 
                  LIMIT 1`;
  const values = [username]
  db.one(query, values)
    .then(user => {
      login(req, res, user)
    })
    .catch(err => { // User not found error
      res.statusCode = statusCodes.QUEURY_ERROR;
      return console.log(err)
    })
}

app.get('/register', (req, res) => {
  res.render('pages/register');
});

app.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username.length > 100) { // Username too large for database
    let errorMsg = "Choose a username shorter than 100 characters.";
    res.render('pages/register', {username, password, errorMsg});
    res.statusCode = statusCodes.USERNAME_TOO_LARGE;
    return;
  }
  else if (username.length == 0) { // Empty username
    let errorMsg = "Enter a username.";
    res.render('pages/register', {password, errorMsg});
    res.statusCode = statusCodes.EMPTY_USERNAME;
    return;
  }
  else if (password.length == 0) { // Empty password
    let errorMsg = "Enter a password.";
    res.render('pages/register', {username, errorMsg});
    res.statusCode = statusCodes.EMPTY_PASSWORD;
    return;
  }
  const queryDoesUserExist = `SELECT * FROM Users 
                                WHERE
                                  $1 = username 
                                LIMIT 1`;
  const valuesDoesUserExist = [username];
  db.oneOrNone(queryDoesUserExist, valuesDoesUserExist)
  .then(async user => {
    if (user) { // User already exists
      let errorMsg = `Username already exists.`;
      res.render('pages/register', {username, errorMsg});
      res.statusCode = statusCodes.USER_ALREADY_EXISTS;
    }
    else { // User does not yet exist
      const hash = await bcrypt.hash(password, 10)
      const query = `INSERT INTO users 
                      (username, password)
                     VALUES
                      ($1, $2)`;
      const values = [username, hash]
      db.any(query, values) 
        .then(function (data) { // User successfully added!
          res.statusCode = statusCodes.SUCCESSFUL_REGISTARTION;
          loginRegistration(req, res, username)
        })
        .catch(function (err) { // Failed to add user!
          res.statusCode = statusCodes.FAILED_TO_ADD_USER;
          return console.log(err)
        });
    }
  })
  .catch(err => { // Query Error!
    res.statusCode = statusCodes.QUEURY_ERROR;
    return console.log(err)
  });
});

app.get('/logout', (req, res) => {
  req.session.username = undefined
  res.render('pages/logout');
})

app.listen(3000);
console.log("Server is listening on port 3000");
