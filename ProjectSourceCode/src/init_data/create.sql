/*Each course should have exactly one row in the courses table. */
DROP TABLE IF EXISTS courses;
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY, /* Since not every course ID is unique for different department classes (MATH 1300 VS CSCI 1300), I thought it would be easiest to just have a unique id attached to every course*/
  course_id SMALLINT,
  course_tag CHAR(4), /*Refers to the 4 letter tag along with the course number (i.e CSCI) */
  course_name VARCHAR(500) NOT NULL,
  credit_hours NUMERIC NOT NULL, /*Credit hours aren't really necessary but nice to have */
  description VARCHAR(2000) /* course description listed on the course catalog */
);

/*If the user is not in the users table, then they must register to write a review. Each review must be associated with a user in the users table. */
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(100) NOT NULL, /*display name for review, can have repeat usernames */
  password CHAR(60) NOT NULL
);
DROP TABLE IF EXISTS reviews;
/* I was going to add date posted as an attribute, but we can query the date posted by the id number of the review (later posts will have a higher id number)
 *review, course name, and user id should not be optional. Also made review VARCHAR(8000) so they can write as much as they want*/
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    course_id int NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    user_id int NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    review VARCHAR(8000) NOT NULL, 
    overall_rating DECIMAL NOT NULL /* if we want to add more statistics, we can make this rating an average of all of them, just put it as one attribute here so we can decide on thsoe details later on */
    
);
/*
If we want to add the rate my professors feature, we can add this table to keep track of them. We would have to make it so
each review also references a professor, and also so that each professor has courses that they are associated with. 
I think the easiest way to connect professors to courses would be through a courses_to_professors table since a professor can have multiple courses that they teach
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS professors (
    professor_id SERIAL PRIMARY KEY NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    years_teaching int
);
*/