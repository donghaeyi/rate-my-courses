# Rate My Courses
*Rate My Courses* is a spinoff of the popular Rate My Professors but aims to provide students with a platform for sharing their opinions about classes instead of people–how much homework will I get every week? How is the course structured? What content do we actually learn? How do we learn that content? All of these questions can be answered through the collective feedback of students who have taken the course and Rate My Courses provides a place to collect and access that information.
FCQs are offered by the school but have no way for students to freely express opinions, warnings, or advice for other students to see. Rate My Courses has users rate courses by metrics but also has a place for users to write comments without restriction. Reviews are then self-moderated by other users with a rating system that ensures malicious or hateful comments are quickly hidden from the view of others. The user can additionally sort through reviews on the course page (filter reviews by most votes, year the review was written for, or by ascending/descending overall rating) to easily find the reviews that are most relevant to them. All in all, Rate My Courses is a platform for students, by students, and aims to deliver important information to guide students in taking the courses that will resonate with them most.  

## Contributors
- Madison Jones: [@madisonpj](https://github.com/madisonpj), majo8117@colorado.edu
- Dalton Prokosch: [@garthable](https://github.com/garthable), dapr8102@colorado.edu
- Matt Harper: [@matt-harp](https://github.com/matt-harp), maha6576@colorado.edu
- Ori Grushka: [@origrushka](https://github.com/origrushka), orgr9499@colorado.edu
- Maddie Kloud: [@maddiekloud](https://github.com/maddiekloud), makl2991@colorado.edu
- Donghae Yi: [@DonghaeYi](https://github.com/DonghaeYi), doyi9623@colorado.edu

## Demo Video
![image](https://github.com/madisonpj/CSCI3308-Final-Project/assets/132002675/0082e827-dcbe-4411-8dfe-0988d24b7a73)
- YouTube video link: [https://youtu.be/cdr9eSnpycM](https://youtu.be/cdr9eSnpycM)

## Technology
- Frontend: HTML, CSS (Bootstrap), JavaScript
- Backend: Express.js, Postgres

## Running Locally
### Dependencies
- Node
- Docker

### Setup
- Set up your `.env`:
```
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="pwd"
POSTGRES_DB="ratings_db"

SESSION_SECRET="super secret"
```

### Deployment
- Clone the repository
- Setup .env file
- Change directory: ~/CSCI3308-Final-Project/ProjectSourceCode$
- Type ‘docker-compose up -d’ in the terminal
- Visit localhost:3000 on your favorite browser!

## Testing
### Full website test case:
#### Start Conditions:
- User starts on course search page logged out.
#### Prompt:
- “Write a review for Computer Science 2: Data Structures, downvote every other review for that course and upvote the review you just wrote. Then delete the review you just wrote.”
#### Ideal steps taken by user:
- User searches for a course.
- User tries to write a review but is redirected to login.
- User does not have an account so they register.
- User searches for a course.
- User writes review for course
- User downvotes all of the other reviews. 
- User upvotes their own review.
- User deletes review just made.
#### Expected Results:
- The website successfully ran and all tasks/functions were successful.
