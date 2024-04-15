/*Each course should have exactly one row in the courses table. */
DROP TABLE IF EXISTS courses;
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY, /* Since not every course ID is unique for different department classes (MATH 1300 VS CSCI 1300), I thought it would be easiest to just have a unique id attached to every course*/
  course_number SMALLINT,
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

/* Table to keep track of all of the professors listed on our interface. */
DROP TABLE IF EXISTS professors;
CREATE TABLE IF NOT EXISTS professors (
    professor_id SERIAL PRIMARY KEY NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department VARCHAR(50), /* department that the professor is currently in */
    years_teaching SMALLINT /* How many years the professor has been teaching for, could make this more specific to how many years they've taught at CU, how many years they've taught in this department, etc. */
);

/* table to connect professors to the courses they teach */
DROP TABLE IF EXISTS courses_to_professors;
CREATE TABLE IF NOT EXISTS courses_to_professors (
    course_id INT NOT NULL,
    professor_id INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses (course_id) ON DELETE CASCADE,
    FOREIGN KEY (professor_id) REFERENCES professors (professor_id) ON DELETE CASCADE
);

/* For the actual rate my professors side of this interface, we might need a separate reviews table that is specific to rating a professor 
(would have different metrics like how engaging the professor is, how much the student learned, etc.) */

DROP TABLE IF EXISTS reviews;
/* I was going to add date posted as an attribute, but we can query the date posted by the id number of the review (later posts will have a higher id number)
 *review, course name, and user id should not be optional. Also made review VARCHAR(8000) so they can write as much as they want*/
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    /* could potentially be easier to sort the reviews by their timestamp (exactly when they were posted) but I'm not sure if that will overcomplicate things, we can still identify when the reviews was writen by its primary key */
    course_id INT NOT NULL, 
    /* identify when exactly the user took the course */
    year_taken SMALLINT NOT NULL,
    term_taken VARCHAR(6) CHECK (term_taken in ('Fall', 'Spring', 'Summer')),  
    /* Each review is associated with exactly one course and one user */
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE, 
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    review VARCHAR(8000) NOT NULL, 
    overall_rating DECIMAL NOT NULL CHECK (overall_rating between 0 and 10), /*We can make this rating be an average of all of the ratings metrics or leave the overall rating up to the user, right now I left it as just an overall rating out of 10*/
    /* rating metrics - can add more later on*/
    homework_rating DECIMAL CHECK (homework_rating between 0 and 10), /* prompt them to indicate how much time they spent outside of the class on assignments */
    enjoyability_rating DECIMAL CHECK (enjoyability_rating between 0 and 10), /* How much the user enjoyed the course, did they find it interesting or boring */
    usefulness_rating DECIMAL CHECK (usefulness_rating between 0 and 10), /* how useful this course is to the user, i.e is the content in this course often used in this industry? does it apply to everday life? is it necessary to take to understand more useful classes later on? */
    difficulty_rating DECIMAL CHECK (difficulty_rating between 0 and 10), /* generally how difficult they thought this course was */
    /* grading metrics - grading breakdown of course, what was the student mainly graded on */
    /*
    grade_recieved CHAR(2) NOT NULL CHECK (grade_recieved in ('A', 'A-', ... )) don't know if check necessary if grade recieved is a drop down menu
    grading_difficulty VARCHAR(1000) /*Allow users to provide an explanation into the grade they recieved, prompt them to explain the difficulty of grading and how hard they worked to recieve the grade they have (i.e was this class an easy A? did I work really hard for a B? were grade averages low?) */ 
    attendance_required BOOL NOT NULL, /* Was attendence required/needed to get a good grade */
    /* have user check one grading catagory */
    exam_based BOOL, /* grade was mostly determined by exams */
    project_based BOOL, /* grade was mostly determined by large assignments/projects */
    combination_based BOOL, /* grading breakdown does not fall in exam_based or project_based catagories, grade was determined by many different things and wasn't majority based on one catagory */
    */
    /* Tag each course review to a professor */
    professor_id INT NOT NULL, /* not sure how to do this efficently, maybe for each course we could have a dropdown list of professors */
    FOREIGN KEY (professor_id) REFERENCES professors(professor_id) ON DELETE CASCADE /* Each review should have exactly 1 professor associated with it*/
);




