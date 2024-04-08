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

app.get('/register', (req, res) => {
  res.render('pages/register');
});

app.post('/register', async (req, res) => {
  const username = req.body.username || '';
  const password = req.body.password || '';
  if (!authentication.handleInputtedUserDetailsCheck(username, password, 'pages/register', res)) {
    return
  }
  let user = await authentication.getUserFromDatabase(username, db)
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
      .then(async function (data) { // User successfully added!
        res.statusCode = statusCodes.SUCCESSFUL_REGISTRATION;
        user = await authentication.getUserFromDatabase(username, db)
        if (user) {
          authentication.login(user, req, res)
        }
        else {
          res.statusCode = statusCodes.QUERY_ERROR;
          throw new Error("Registration did not add user")
        }
      })
      .catch(function (err) { // Failed to add user!
        res.statusCode = statusCodes.FAILED_TO_ADD_USER;
        return console.log(err)
      });
  }
});

app.get("/account", (req, res) => {
  res.render("pages/account", {
  });
});

app.get("/account", async (req, res) => {
  try {
    const query = `
      SELECT users.username, reviews.review, reviews.overall_rating
      FROM reviews
      JOIN users ON reviews.user_id = users.user_id;
    `;
    const { rows } = await db.query(query);
    res.render("pages/account", {
      reviews: rows,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.send("Error fetching reviews");
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.render('pages/logout');
  })
})

module.exports = app.listen(3000);
console.log("Server is listening on port 3000");
