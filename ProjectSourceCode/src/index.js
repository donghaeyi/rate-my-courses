//  Import dependencies
const express = require("express");
const app = express(); // Create Express app

const handlebars = require("express-handlebars");
const bodyParser = require('body-parser');
const session = require('express-session');

const path = require("path");

//  Setup Handlebars and link with Express
const hbs = handlebars.create({
  extname: "hbs",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

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
  res.render("pages/home", {
    text: "Hello world!",
  });
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

app.listen(3000);
console.log("Server is listening on port 3000");
