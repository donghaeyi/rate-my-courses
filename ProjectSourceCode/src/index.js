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



app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.render('pages/logout');
  })
});

// *****************************************************
// <!-- Review routes -->
// *****************************************************

//route to render the review form, pass data from tables so user doesn't select options that aren't in the database
app.get('/review', (req, res) => {
  /* Implemented when we have a button to write a review, make sure user is logged in
  if (!req.session.user) {
    // Default to login page if user not logged in
    return res.redirect('/login');
  }else{
    res.render('pages/review');
  }*/

  //queries to get all courses and professors, we can narrow down this search later (specifically to have the professors listed match the course requested)
  const all_courses = 'SELECT * FROM courses;';
  const all_professors = 'SELECT * FROM professors;';
  db.task('get-everything', task => {
    return task.batch([task.any(all_courses), task.any(all_professors)]);
  })
  .then(results => {
    res.render('pages/review', {
      courses: results[0], 
      professors: results[1],
      message: "success",
    });
  })
  .catch(err => {
    res.render('pages/review', {
      courses: [],
      professors: [],
      message: err,
    });
  });
  
});

//Write a new review (adds review to reviews table)
//assuming that the user can press a button on the nav bar to write a review about a class (or we could have this built into the course page)
app.post('/addReview', async function (req, res) {
  try{
    //user won't be able to access the review form if they are not logged in, this route takes care of the submit review action
    const user_id = parseInt(req.session.user.user_id);
    //if the user can only select courses from a drop down menu, we can ensure that we get a course id from each request
    const course_id = await db.one('SELECT course_id FROM courses WHERE course_name = ($1);',[req.body.course_name]);
    //query professors by a dropdown menu listing all of the professors for matched course
    let input_professor = req.body.professor; //since professor was displayed as first name and last name combined in the drop down, need to split into first name and last name to query the table
    let split_name = input_professor.split(" ");
    const first_name = split_name[0];
    const last_name = split_name[1];
    const professor_id = await db.one('SELECT professor_id FROM professors WHERE first_name = ($1) AND last_name = ($2);', [first_name, last_name]); //name 
    
    //need to make different routes so that the user can add metrics, this might be hard to accomodate all combinations
    
    const review = await db.one(`INSERT INTO reviews (course_id, year_taken, term_taken, user_id, review, overall_rating, professor_id) values ($1, $2, $3, $4, $5, $6, $7) returning review_id;`, 
    [course_id, 
    parseInt(req.body.year_taken), 
    req.body.term_taken, 
    user_id, 
    req.body.review,
    parseInt(req.body.overall_rating),
    professor_id
    ]);
    res.status(201).json({
      status: "success",
      review_id: review,
      message: "Data added successfully"
    });
    
  }catch(error){
    console.log(error);
    res.status(500).send();
  }
    
});

module.exports = app.listen(3000);
console.log("Server is listening on port 3000");
