//  Import dependencies
const express = require("express");
const app = express(); // Create Express app
const session = require('express-session');
const bodyParser = require("body-parser");

const handlebars = require("express-handlebars");
const bodyParser = require('body-parser');
const session = require('express-session');

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

// Middleware

const auth = (req, res, next) => {
  // redirect to login if not logged in
  if (!req.session.username) {
    return res.redirect('/login');
  }
  next();
}

// Begin routes

// dummy route for testing
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

app.get("/", (req, res) => {
  res.redirect('login') // Set to res.redirect('home') when nav is complete.
}); 

app.get("/home", (req, res) => {
  res.render('pages/home')
});

app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.post('/login', async (req, res) => {
  const username = req.body.username || '';
  const password = req.body.password || '';

  if (!authentication.handleInputtedUserDetailsCheck(username, password, 'pages/login', res)) {
    return
  }

  let user = await authentication.getUserFromDatabase(username, db)

  if (user) { // User found!
    bcrypt.compare(password, user.password, (err, bcryptRes) => {
      if (err) { // bcrypt Error
        res.statusCode = statusCodes.BCRYPT_ERROR;
        return console.log(err)
      }
      if (bcryptRes) { // Password matches!
        res.statusCode = statusCodes.SUCCESSFUL_LOGIN;
        authentication.login(user, req, res)
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
});



// Route to delete reviews
// Code Inspired by Lab 6
// Waiting to be tested until the account page is made
app.delete('/deleteReview', async (req, res) => {
  const query0 = "SELECT user_id FROM users WHERE username = $1;";
  user = req.session.username;
  const sessionUser = await db.one(query0, user);
  const query1 = "SELECT user_id FROM reviews WHERE review_id = $1;";
  const reviewUser = await db.one(query1, req.body.review_id);
  if (sessionUser == reviewUser) {
  const query2 = "DELETE FROM reviews WHERE review_id = $1;";
  db.any(query2, [req.body.review_id])
    .then(function (data) {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'review deleted successfully',
      });
    })
    .catch(function (err) {
      return console.log(err);
    });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.render('pages/logout');
  })
})

module.exports = app.listen(3000);
console.log("Server is listening on port 3000");
