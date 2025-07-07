-- Create faculty users for testing
-- Password is 'faculty123' (BCrypt encoded)

INSERT INTO users (username, email, password, first_name, last_name, faculty, role, created_at, updated_at) VALUES
('faculty1', 'faculty1@university.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Dr. Sarah', 'Smith', 'Computer Science', 'SUPERVISOR', NOW(), NOW()),
('faculty2', 'faculty2@university.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Dr. John', 'Doe', 'Engineering', 'SUPERVISOR', NOW(), NOW()),
('faculty3', 'faculty3@university.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Dr. Mary', 'Johnson', 'Business', 'SUPERVISOR', NOW(), NOW()),
('supervisor1', 'supervisor1@university.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Prof. Robert', 'Wilson', 'Computer Science', 'SUPERVISOR', NOW(), NOW()),
('supervisor2', 'supervisor2@university.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Prof. Lisa', 'Brown', 'Engineering', 'SUPERVISOR', NOW(), NOW());

-- Note: The password 'faculty123' is BCrypt encoded
-- You can use these credentials to login:
-- Username: faculty1, Password: faculty123
-- Username: faculty2, Password: faculty123
-- Username: faculty3, Password: faculty123
-- Username: supervisor1, Password: faculty123
-- Username: supervisor2, Password: faculty123 