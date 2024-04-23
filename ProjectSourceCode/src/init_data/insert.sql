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