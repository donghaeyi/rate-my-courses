-- Insert sample users
INSERT INTO users 
(user_id, username, password)
VALUES /* Password is 1 for all of them */
(9000, 'Josh',     '$2b$10$VVrKAA6wNzIK4LJP0zFQge9AcLy1I50/40cadl3yxswFf3gAMFBZS'),
(9001, 'Jax',      '$2b$10$VVrKAA6wNzIK4LJP0zFQge9AcLy1I50/40cadl3yxswFf3gAMFBZS'),
(9002, 'Joey',     '$2b$10$VVrKAA6wNzIK4LJP0zFQge9AcLy1I50/40cadl3yxswFf3gAMFBZS'),
(9003, 'Johnson',  '$2b$10$VVrKAA6wNzIK4LJP0zFQge9AcLy1I50/40cadl3yxswFf3gAMFBZS'),
(9004, 'Joshler',  '$2b$10$VVrKAA6wNzIK4LJP0zFQge9AcLy1I50/40cadl3yxswFf3gAMFBZS'),
(9999, 'TestUser', '$2b$10$VVrKAA6wNzIK4LJP0zFQge9AcLy1I50/40cadl3yxswFf3gAMFBZS')
ON CONFLICT DO NOTHING;

-- -- Insert sample reviews
-- INSERT INTO reviews 
-- (course_id, year_taken, term_taken, user_id, review, overall_rating, homework_rating, enjoyability_rating, usefulness_rating, difficulty_rating) VALUES
-- (1300, 2022, 'Spring', 9000, 'Great introductory course to programming and problem-solving.', 8, 7, 8, 9, 6),
-- (2240, 2021, 'Fall', 9001, 'Challenging course but very rewarding. Learned a lot about data structures.', 9, 8, 7, 9, 7),
-- (2400, 2022, 'Spring', 9002, 'Tough class with lots of hands-on learning on computer systems.', 7, 8, 6, 8, 8),
-- (3155, 2021, 'Fall', 9003, 'Fascinating insights into different programming languages.', 8, 7, 9, 9, 6),
-- (2400, 2022, 'Spring', 9004, 'Tough class with lots of hands-on learning on computer systems.', 7, 8, 6, 8, 8),
-- (3155, 2021, 'Fall', 9999, 'Fascinating insights into different programming languages.', 8, 7, 9, 9, 6);

-- -- Insert sample votes
-- INSERT INTO votes 
-- (user_id, review_id, vote_amount) VALUES
-- (9000, 1, 10),
-- (9001, 2, 5),
-- (9002, 3, -2),
-- (9003, 4, 3),
-- (9004, 5, -5),
-- (9999, 6, 15);
