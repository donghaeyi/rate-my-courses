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

app.get("/account", (req, res) => {
  res.render("pages/account", {
  });
});

app.post("/account", (req, res) => {
  const username = req.body.username;
  const query = "SELECT * FROM users WHERE username = ?";
});

app.listen(3000);
console.log("Server is listening on port 3000");
