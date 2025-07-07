-- Create admin user
-- Password will be encoded using BCrypt
-- Default password: admin123

INSERT INTO users (username, email, password, first_name, last_name, role, created_at, updated_at) 
VALUES (
    'admin',
    'admin@university.edu',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', -- password: admin123
    'Admin',
    'User',
    'ADMIN',
    NOW(),
    NOW()
);

-- Verify the admin user was created
SELECT id, username, email, role FROM users WHERE username = 'admin'; 