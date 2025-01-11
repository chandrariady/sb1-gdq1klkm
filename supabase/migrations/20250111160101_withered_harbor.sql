/*
  # Initial Schema for Mining Mentoring Platform

  1. New Tables
    - `profiles`
      - Stores user profile information for mentors and mentees
      - Links to Supabase auth.users
    - `roles`
      - Defines user roles (superadmin, mentor, mentee)
    - `certifications`
      - Stores user certifications and achievements
    - `skills`
      - Manages user skills and expertise
    - `curriculums`
      - Stores learning paths and course content
    - `modules`
      - Individual learning units within curriculums
    - `user_progress`
      - Tracks user progress through modules
    - `mentorship_matches`
      - Records mentor-mentee relationships
    
  2. Security
    - Enable RLS on all tables
    - Policies for role-based access control
*/

-- Roles enum
CREATE TYPE user_role AS ENUM ('superadmin', 'mentor', 'mentee');

-- Profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role user_role NOT NULL DEFAULT 'mentee',
  full_name text,
  bio text,
  company text,
  position text,
  years_experience integer,
  industry_focus text[],
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Certifications table
CREATE TABLE certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  name text NOT NULL,
  issuer text,
  issue_date date,
  expiry_date date,
  verification_url text,
  created_at timestamptz DEFAULT now()
);

-- Skills table
CREATE TABLE skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text
);

-- User skills junction table
CREATE TABLE user_skills (
  user_id uuid REFERENCES profiles(id),
  skill_id uuid REFERENCES skills(id),
  proficiency_level integer CHECK (proficiency_level BETWEEN 1 AND 5),
  PRIMARY KEY (user_id, skill_id)
);

-- Curriculums table
CREATE TABLE curriculums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  industry_focus text[],
  created_by uuid REFERENCES profiles(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Modules table
CREATE TABLE modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  curriculum_id uuid REFERENCES curriculums(id),
  title text NOT NULL,
  description text,
  content_type text NOT NULL,
  content_url text,
  duration interval,
  sequence_order integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User progress table
CREATE TABLE user_progress (
  user_id uuid REFERENCES profiles(id),
  module_id uuid REFERENCES modules(id),
  status text NOT NULL DEFAULT 'not_started',
  completion_date timestamptz,
  score numeric,
  PRIMARY KEY (user_id, module_id)
);

-- Mentorship matches table
CREATE TABLE mentorship_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid REFERENCES profiles(id),
  mentee_id uuid REFERENCES profiles(id),
  status text NOT NULL DEFAULT 'pending',
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE (mentor_id, mentee_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculums ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_matches ENABLE ROW LEVEL SECURITY;

-- Policies

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Certifications policies
CREATE POLICY "Users can view their own certifications"
  ON certifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own certifications"
  ON certifications FOR ALL
  USING (auth.uid() = user_id);

-- Skills policies
CREATE POLICY "Skills are viewable by everyone"
  ON skills FOR SELECT
  USING (true);

-- User skills policies
CREATE POLICY "Users can view their own skills"
  ON user_skills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own skills"
  ON user_skills FOR ALL
  USING (auth.uid() = user_id);

-- Curriculums policies
CREATE POLICY "Curriculums are viewable by everyone"
  ON curriculums FOR SELECT
  USING (is_active = true);

CREATE POLICY "Superadmins and mentors can manage curriculums"
  ON curriculums FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('superadmin', 'mentor')
    )
  );

-- Modules policies
CREATE POLICY "Modules are viewable by everyone"
  ON modules FOR SELECT
  USING (true);

-- Progress tracking policies
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR ALL
  USING (auth.uid() = user_id);

-- Mentorship matches policies
CREATE POLICY "Users can view their mentorship matches"
  ON mentorship_matches FOR SELECT
  USING (
    auth.uid() = mentor_id OR
    auth.uid() = mentee_id
  );

CREATE POLICY "Users can manage their mentorship matches"
  ON mentorship_matches FOR ALL
  USING (
    auth.uid() = mentor_id OR
    auth.uid() = mentee_id
  );