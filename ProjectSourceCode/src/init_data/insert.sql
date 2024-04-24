-- Insert courses
INSERT INTO courses
(course_id, course_tag, course_name, credit_hours, description)
VALUES
(1300, 'CSCI', 'Introduction to Programming', 4, 'Teaches techniques for writing computer programs in higher level programming languages to solve problems of interest in a range of application domains. Appropriate for students with little to no experience in computing or programming.'),
(2270, 'CSCI','Data Structures', 4, 'Studies data abstractions (e.g., stacks, queues, lists, trees, graphs, heaps, hash tables, priority queues) and their representation techniques (e.g., linking, arrays). Introduces concepts used in algorithm design and analysis including criteria for selecting data structures to fit their applications. Knowledge OF C++ is highly recommended.'),
(2400, 'CSCI','Computer Systems', 4, 'Covers how programs are represented and executed by modern computers, including low-level machine representations of programs and data, an understanding of how computer components and the memory hierarchy influence performance.'),
(3104, 'CSCI', 'Algorithms', 4, 'Covers the fundamentals of algorithms and various algorithmic strategies, including time and space complexity, sorting algorithms, recurrence relations, divide and conquer algorithms, greedy algorithms, dynamic programming, linear programming, graph algorithms, problems in P and NP, and approximation algorithms.'),
(3308, 'CSCI','Software Development Methods and Tools', 3, 'Covers tools and techniques for successful software development with a strong focus on best practices used in industry. Students work in small teams to complete a semester-long application development project. Students learn front-end design and construction using HTML & CSS, back-end database design and construction, and full-stack integration. Students gain exposure to agile methodologies, web services, distributed version control, requirements definition, automated integration testing, and cloud-based application deployment.');

-- Insert sample users
INSERT INTO users 
(user_id, username, password)
VALUES /* Password is 'test' for all of them */
(9000, 'Josh',     '$2b$10$3EHVQST8IftPVwslRSy.du7Sx..rDoljNRV0dqlvsCgZbLR1mlpOG'),
(9001, 'Jax',      '$2b$10$3EHVQST8IftPVwslRSy.du7Sx..rDoljNRV0dqlvsCgZbLR1mlpOG'),
(9002, 'Joey',     '$2b$10$3EHVQST8IftPVwslRSy.du7Sx..rDoljNRV0dqlvsCgZbLR1mlpOG'),
(9003, 'Johnson',  '$2b$10$3EHVQST8IftPVwslRSy.du7Sx..rDoljNRV0dqlvsCgZbLR1mlpOG'),
(9004, 'Joshler',  '$2b$10$3EHVQST8IftPVwslRSy.du7Sx..rDoljNRV0dqlvsCgZbLR1mlpOG'),
(9999, 'TestUser', '$2b$10$3EHVQST8IftPVwslRSy.du7Sx..rDoljNRV0dqlvsCgZbLR1mlpOG')
ON CONFLICT DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews 
(course_id, year_taken, term_taken, user_id, review, overall_rating, homework_rating, enjoyability_rating, usefulness_rating, difficulty_rating) 
VALUES
(1, 2024, 'Spring', 9000, 'Great introductory course to programming and problem-solving.', 2, 3, 4, 1, 6),  -- 1300
(1, 2023, 'Fall', 9001, 'Challenging course but very rewarding. Learned a lot about data structures.', 1, 2, 3, 4, 5),  
(1, 2022, 'Spring', 9002, 'Tough class with lots of hands-on learning on computer systems.', 7, 8, 6, 8, 8),    
(1, 2021, 'Fall', 9003, 'Fascinating insights into different programming languages.', 8, 7, 9, 9, 6),   
(1, 2020, 'Spring', 9004, 'This class was not bad.', 7, 4, 6, 10, 1),    
(1, 2019, 'Fall', 9999, 'whatever', 4, 4, 5, 9, 6),   
(2, 2024, 'Spring', 9000, 'meh.', 7, 6, 6, 5, 6),  -- 2270
(2, 2023, 'Fall', 9001, 'AMAZING !!!', 10, 10, 10, 10, 10),  
(2, 2022, 'Spring', 9002, 'TERRIBLE !!!', 0, 0, 0, 0, 0),    
(2, 2021, 'Fall', 9003, 'I liked this class', 8, 7, 9, 9, 6),   
(2, 2020, 'Spring', 9004, 'yep', 6, 8, 6, 8, 8),    
(2, 2019, 'Fall', 9999, 'Whats up brother', 8, 7, 9, 7, 7), 
(3, 2024, 'Spring', 9000, 'ehhhhhhhhhhh', 3, 2, 4, 3, 3),  -- 2400
(3, 2023, 'Fall', 9001, 'Challenging course but very rewarding. Learned a lot about data structures.', 2, 2, 7, 9, 7),  
(3, 2022, 'Spring', 9002, 'alright', 7, 8, 7, 5, 4),    
(3, 2021, 'Fall', 9003, 'if u have to u have to', 3, 4, 2, 3, 5),   
(3, 2020, 'Spring', 9004, 'yeppers', 8, 8, 9, 8, 8),    
(3, 2019, 'Fall', 9999, 'great.', 8, 7, 8, 7, 8),  
(4, 2024, 'Spring', 9000, 'good', 8, 7, 8, 9, 8),  -- 3104
(4, 2023, 'Fall', 9001, 'useless.', 3, 5, 5, 6, 0),  
(4, 2022, 'Spring', 9002, 'YESSIR', 9, 9, 9, 9, 8),    
(4, 2021, 'Fall', 9003, 'nah', 8, 7, 9, 9, 6),   
(4, 2020, 'Spring', 9004, 'Tough class with lots of hands-on learning on computer systems.', 8, 8, 6, 8, 8),    
(4, 2019, 'Fall', 9999, 'BLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH', 7, 7, 7, 9, 6),
(5, 2024, 'Spring', 9000, '-_-', 3, 5, 2, 7, 5),  -- 3308
(5, 2023, 'Fall', 9001, 'banana', 9, 8, 7, 9, 7),  
(5, 2022, 'Spring', 9002, 'abcdefghijklmnopqrstuvwxyz', 7, 8, 6, 8, 8),    
(5, 2021, 'Fall', 9003, '0123456789', 4, 6, 4, 6, 6),   
(5, 2020, 'Spring', 9004, 'something', 7, 4, 6, 8, 8),    
(5, 2019, 'Fall', 9999, 'nice !', 9, 7, 9, 9, 7); 

-- Insert sample votes
INSERT INTO votes 
(user_id, review_id, vote_amount) 
VALUES
-- 1300
(9000, 1, 145), -- Josh
(9001, 2, 10),   -- Jax
(9002, 3, -20),  -- Joey
(9003, 4, 3),   -- Johnson
(9004, 5, -39), -- Joshler
(9999, 6, 16),  -- TestUser
-- 2270
(9000, 7, 173), -- Josh
(9001, 8, 5),   -- Jax
(9002, 9, -2),  -- Joey
(9003, 10, 0),   -- Johnson
(9004, 11, -37), -- Joshler
(9999, 12, 15),  -- TestUser
-- 2400
(9000, 13, -1), -- Josh
(9001, 14, 4),   -- Jax
(9002, 15, -88),  -- Joey
(9003, 16, 2),   -- Johnson
(9004, 17, 37), -- Joshler
(9999, 18, 1),  -- TestUser
-- 3104
(9000, 19, 17), -- Josh
(9001, 20, 52),   -- Jax
(9002, 21, -22),  -- Joey
(9003, 22, 43),   -- Johnson
(9004, 23, -7), -- Joshler
(9999, 24, 5),  -- TestUser
-- 3308
(9000, 25, 1), -- Josh
(9001, 26, 2),   -- Jax
(9002, 27, 3),  -- Joey
(9003, 28, 4),   -- Johnson
(9004, 29, 5), -- Joshler
(9999, 30, 6);  -- TestUser
