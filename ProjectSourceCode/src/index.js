//  Import dependencies
const express = require("express");
const app = express(); // Create Express app

const handlebars = require("express-handlebars");

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

// Begin routes
app.get("/", (req, res) => {
  res.render("pages/home", {
    text: "Hello world!",
  });
});

// Route to delete reviews
// Code Inspired by Lab 6
app.delete('/deleteReview', function (req, res) {
  const query = "DELETE FROM reviews WHERE review_id = $1;";
  db.any(query, [req.body.review_id])
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
});

app.listen(3000);
console.log("Server is listening on port 3000");
