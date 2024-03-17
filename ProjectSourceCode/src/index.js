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

app.listen(3000);
console.log("Server is listening on port 3000");
