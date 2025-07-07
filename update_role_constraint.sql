-- Update the role constraint to include SUPERVISOR
-- Run this script to fix the registration error

-- Drop the existing constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add the new constraint with SUPERVISOR
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('STUDENT', 'SUPERVISOR', 'ADMIN'));

-- Verify the constraint was updated
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'users'::regclass AND contype = 'c'; 