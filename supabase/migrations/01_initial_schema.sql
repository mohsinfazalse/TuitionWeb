-- supabase/migrations/01_initial_schema.sql

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  role text CHECK (role IN ('student','tutor','admin')) NOT NULL,
  full_name text,
  phone text,
  city text,
  age int,
  location text,
  profile_picture_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Tutor profile
CREATE TABLE tutor_profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  intro_video_url text,
  education_details jsonb,
  education_doc_url text,
  available_time jsonb,
  hourly_rate numeric,
  weekly_rate numeric,
  verification_status text CHECK (verification_status IN ('pending','approved','rejected')) DEFAULT 'pending',
  avg_rating numeric DEFAULT 0,
  total_reviews int DEFAULT 0
);

-- Student profile
CREATE TABLE student_profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  education_details jsonb,
  available_time jsonb
);

-- Student requests
CREATE TABLE student_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  tutor_id uuid REFERENCES users(id) ON DELETE CASCADE,
  message text,
  status text CHECK (status IN ('pending','accepted','declined')) DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);

-- Reviews
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  tutor_id uuid REFERENCES users(id) ON DELETE CASCADE,
  request_id uuid UNIQUE REFERENCES student_requests(id) ON DELETE CASCADE,
  stars smallint CHECK (stars >= 1 AND stars <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now()
);

-- Row Level Security policies (example for students)

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies
-- Students can read/write their own profile
CREATE POLICY "students can manage own profile" ON users
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "students can manage own student profile" ON student_profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Tutors can read/write their own tutor profile and requests addressed to them
CREATE POLICY "tutors can manage own tutor profile" ON tutor_profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tutors can view requests for them" ON student_requests
  FOR SELECT USING (auth.uid() = tutor_id);
CREATE POLICY "tutors can update request status for them" ON student_requests
  FOR UPDATE USING (auth.uid() = tutor_id);

-- Admin can read/write everything
CREATE POLICY "admin full access" ON users
  FOR ALL TO public USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
-- (similar admin policies would be added for other tables)

-- Trigger to keep avg_rating and total_reviews up to date
CREATE OR REPLACE FUNCTION calc_tutor_rating() RETURNS trigger AS $$
BEGIN
  UPDATE tutor_profiles
  SET 
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE tutor_id = NEW.tutor_id),
    avg_rating = (SELECT AVG(stars) FROM reviews WHERE tutor_id = NEW.tutor_id)
  WHERE user_id = NEW.tutor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER review_insert_update
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION calc_tutor_rating();
