-- Add isAdmin column to users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- Create admin account
INSERT INTO "users" (id, email, password, name, role, company, "isAdmin", "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'medomoust@gmail.com',
  '$2b$10$bVnQwvvb10DkcBl5i/PlOODS/RUrSeRLPy7QwTHNJLCQzpYi7MA.u',
  'Admin User',
  'recruiter',
  'GOOGLE',
  true,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET "isAdmin" = true;
