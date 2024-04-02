//  Import dependencies
const express = require("express");
const app = express(); // Create Express app
const axios = require("axios").default;

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

// API route to return the appropriate class suggestions from a keyword search
// Request: requires query parameter "keyword" which represents user search terms
//              e.g. "CSCI 2270" or "robotics" or "ASEN"
// Returns: list of matching courses, each an object with title and code
app.get("/search", async (req, res) => {
  let data = JSON.stringify({
    "other": {
      "srcdb": "2247" //todo get current term for use
    },
    "criteria": [
      {
        "field": "keyword",
        "value": req.query.keyword
      }
    ]
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://classes.colorado.edu/api/?page=fose&route=search&keyword=${req.query.keyword}`,
    headers: { 
      'Content-Type': 'application/json'
    },
    data: data
  };
  
  axios.request(config)
  .then((response) => {
    const apidata = response.data.results

    let data = []
    for (const datum of apidata) {
      if(!data.some(d => d.title == datum.title)) data.push({
        title: datum.title,
        code: datum.code
      })
    }

    res.send(data)
  })
  .catch((error) => {
    console.log(error);
  });
});

app.listen(3000);
console.log("Server is listening on port 3000");
