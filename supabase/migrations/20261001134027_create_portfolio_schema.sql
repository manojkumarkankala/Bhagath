/*
# Portfolio Website Schema for Bhagath Raj Ambedkar

Creates all tables needed for a professional portfolio + CMS admin dashboard.

## Tables Created
1. profiles - Admin profile (name, title, summary, contact, images)
2. about_sections - Editable about section content
3. education - Education timeline records
4. skills - Technical skills with categories and proficiency
5. certifications - Professional certifications
6. projects - Portfolio projects with images, videos, links
7. workshops - Workshop attendance records
8. social_links - Social media links (editable)
9. contact_messages - Messages from contact form (with read/unread)
10. media - Central media library (images, videos, PDFs)
11. website_settings - SEO, branding, theme settings
12. location_info - Location and map settings

## Security (RLS)
- Public (anon) can READ all content tables and INSERT contact messages
- Only authenticated admin can INSERT/UPDATE/DELETE content
- Contact messages can only be read/modified by authenticated admin
- Media library: public read, admin write
- Storage buckets: public read, authenticated write

## Auth
- Admin user created with email admin@bhagathraj.com
- Password is hashed via crypt() - never stored in frontend
*/

-- ============================================================
-- 1. PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Bhagath Raj Ambedkar',
  professional_title text NOT NULL DEFAULT 'Computer Science Professional | Programmer | Machine Learning & Cybersecurity Enthusiast',
  summary text NOT NULL DEFAULT 'Dedicated and results-driven professional with strong communication skills and the ability to present complex concepts in a clear and structured manner, with a passion for creating positive learning environments and delivering high-quality instruction.',
  phone text DEFAULT '+91-83094 19083',
  email text DEFAULT 'yerpulabhagthrajambedkar@gmail.com',
  location text DEFAULT 'Hyderabad',
  profile_image_url text,
  resume_pdf_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_profiles" ON profiles;
CREATE POLICY "public_read_profiles" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_profiles" ON profiles;
CREATE POLICY "admin_insert_profiles" ON profiles FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_profiles" ON profiles;
CREATE POLICY "admin_update_profiles" ON profiles FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_profiles" ON profiles;
CREATE POLICY "admin_delete_profiles" ON profiles FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 2. ABOUT_SECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS about_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  video_url text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE about_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_about" ON about_sections;
CREATE POLICY "public_read_about" ON about_sections FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_about" ON about_sections;
CREATE POLICY "admin_insert_about" ON about_sections FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_about" ON about_sections;
CREATE POLICY "admin_update_about" ON about_sections FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_about" ON about_sections;
CREATE POLICY "admin_delete_about" ON about_sections FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 3. EDUCATION
-- ============================================================
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree text NOT NULL,
  institution text NOT NULL,
  start_year text NOT NULL,
  end_year text NOT NULL,
  gpa text,
  logo_url text,
  description text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_education" ON education;
CREATE POLICY "public_read_education" ON education FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_education" ON education;
CREATE POLICY "admin_insert_education" ON education FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_education" ON education;
CREATE POLICY "admin_update_education" ON education FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_education" ON education;
CREATE POLICY "admin_delete_education" ON education FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 4. SKILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Programming',
  proficiency int DEFAULT 0,
  icon text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_skills" ON skills;
CREATE POLICY "public_read_skills" ON skills FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_skills" ON skills;
CREATE POLICY "admin_insert_skills" ON skills FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_skills" ON skills;
CREATE POLICY "admin_update_skills" ON skills FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_skills" ON skills;
CREATE POLICY "admin_delete_skills" ON skills FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 5. CERTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text NOT NULL,
  issue_date text,
  description text,
  image_url text,
  pdf_url text,
  certificate_url text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_certs" ON certifications;
CREATE POLICY "public_read_certs" ON certifications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_certs" ON certifications;
CREATE POLICY "admin_insert_certs" ON certifications FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_certs" ON certifications;
CREATE POLICY "admin_update_certs" ON certifications FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_certs" ON certifications;
CREATE POLICY "admin_delete_certs" ON certifications FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 6. PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  technologies text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  video_url text,
  github_url text,
  live_url text,
  pdf_url text,
  project_date text,
  features text[] DEFAULT '{}',
  status text DEFAULT 'completed',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_projects" ON projects;
CREATE POLICY "admin_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_projects" ON projects;
CREATE POLICY "admin_update_projects" ON projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_projects" ON projects;
CREATE POLICY "admin_delete_projects" ON projects FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 7. WORKSHOPS
-- ============================================================
CREATE TABLE IF NOT EXISTS workshops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organizer text,
  date text,
  description text,
  images text[] DEFAULT '{}',
  video_url text,
  certificate_url text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_workshops" ON workshops;
CREATE POLICY "public_read_workshops" ON workshops FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_workshops" ON workshops;
CREATE POLICY "admin_insert_workshops" ON workshops FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_workshops" ON workshops;
CREATE POLICY "admin_update_workshops" ON workshops FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_workshops" ON workshops;
CREATE POLICY "admin_delete_workshops" ON workshops FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 8. SOCIAL_LINKS
-- ============================================================
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_social" ON social_links;
CREATE POLICY "public_read_social" ON social_links FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_social" ON social_links;
CREATE POLICY "admin_insert_social" ON social_links FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_social" ON social_links;
CREATE POLICY "admin_update_social" ON social_links FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_social" ON social_links;
CREATE POLICY "admin_delete_social" ON social_links FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 9. CONTACT_MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_messages" ON contact_messages;
CREATE POLICY "public_insert_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_messages" ON contact_messages;
CREATE POLICY "admin_read_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_messages" ON contact_messages;
CREATE POLICY "admin_update_messages" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_messages" ON contact_messages;
CREATE POLICY "admin_delete_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 10. MEDIA
-- ============================================================
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_url text NOT NULL,
  file_size bigint,
  category text DEFAULT 'images',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_media" ON media;
CREATE POLICY "public_read_media" ON media FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_media" ON media;
CREATE POLICY "admin_insert_media" ON media FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_media" ON media;
CREATE POLICY "admin_update_media" ON media FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_media" ON media;
CREATE POLICY "admin_delete_media" ON media FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 11. WEBSITE_SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS website_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title text NOT NULL DEFAULT 'Bhagath Raj Ambedkar | Portfolio',
  logo_url text,
  favicon_url text,
  meta_description text DEFAULT 'Professional portfolio of Bhagath Raj Ambedkar - Computer Science Professional, Programmer, Machine Learning & Cybersecurity Enthusiast.',
  meta_keywords text DEFAULT 'Bhagath Raj Ambedkar, Computer Science, Machine Learning, Cybersecurity, Programming, Portfolio',
  og_title text,
  og_description text,
  og_image_url text,
  canonical_url text,
  footer_text text DEFAULT '© 2025 Bhagath Raj Ambedkar. All rights reserved.',
  theme text DEFAULT 'dark',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON website_settings;
CREATE POLICY "public_read_settings" ON website_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_settings" ON website_settings;
CREATE POLICY "admin_insert_settings" ON website_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_settings" ON website_settings;
CREATE POLICY "admin_update_settings" ON website_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_settings" ON website_settings;
CREATE POLICY "admin_delete_settings" ON website_settings FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 12. LOCATION_INFO
-- ============================================================
CREATE TABLE IF NOT EXISTS location_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_name text NOT NULL DEFAULT 'Hyderabad',
  address text,
  google_maps_url text,
  latitude text,
  longitude text,
  map_embed_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE location_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_location" ON location_info;
CREATE POLICY "public_read_location" ON location_info FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_location" ON location_info;
CREATE POLICY "admin_insert_location" ON location_info FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_location" ON location_info;
CREATE POLICY "admin_update_location" ON location_info FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_location" ON location_info;
CREATE POLICY "admin_delete_location" ON location_info FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Default profile
INSERT INTO profiles (name, professional_title, summary, phone, email, location)
VALUES (
  'Bhagath Raj Ambedkar',
  'Computer Science Professional | Programmer | Machine Learning & Cybersecurity Enthusiast',
  'Dedicated and results-driven professional with strong communication skills and the ability to present complex concepts in a clear and structured manner, with a passion for creating positive learning environments and delivering high-quality instruction.',
  '+91-83094 19083',
  'yerpulabhagthrajambedkar@gmail.com',
  'Hyderabad'
) ON CONFLICT DO NOTHING;

-- Default website settings
INSERT INTO website_settings (site_title, meta_description)
VALUES (
  'Bhagath Raj Ambedkar | Computer Science Portfolio',
  'Professional portfolio of Bhagath Raj Ambedkar - Computer Science Professional, Programmer, Machine Learning & Cybersecurity Enthusiast.'
) ON CONFLICT DO NOTHING;

-- Default location
INSERT INTO location_info (location_name)
VALUES ('Hyderabad') ON CONFLICT DO NOTHING;

-- Education records
INSERT INTO education (degree, institution, start_year, end_year, gpa, sort_order) VALUES
('Bachelor of Technology in Computer Science and Engineering', 'Vignan Institute of Technology and Science, JNTUH', '2021', '2025', '7.1/10', 0),
('Intermediate (MPC)', 'Narayana Junior College', '2019', '2021', '9.6/10', 1),
('Secondary School Education', 'New Chaitanya High School', '2019', '2019', '9.5/10', 2)
ON CONFLICT DO NOTHING;

-- Skills
INSERT INTO skills (name, category, proficiency, sort_order) VALUES
('C', 'Programming Languages', 0, 0),
('C++', 'Programming Languages', 0, 1),
('Java', 'Programming Languages', 0, 2),
('Python', 'Programming Languages', 0, 3),
('Communication', 'Soft Skills', 0, 4),
('Team Management', 'Soft Skills', 0, 5),
('Leadership', 'Soft Skills', 0, 6)
ON CONFLICT DO NOTHING;

-- Certifications
INSERT INTO certifications (title, organization, sort_order) VALUES
('Programming Essentials in Python', 'CISCO Networking Academy', 0),
('Programming Essentials in C++', 'CISCO Networking Academy', 1),
('JavaScript Essentials 1 (JSE)', 'CISCO Networking Academy', 2),
('IT Essentials: PC Hardware and Software', 'CISCO Networking Academy', 3)
ON CONFLICT DO NOTHING;

-- Projects
INSERT INTO projects (title, description, technologies, features, status, sort_order) VALUES
(
  'Unsupervised Machine Learning to Screen Compounds and Molecules',
  'Developed an unsupervised machine learning model to accelerate drug discovery by virtually screening large libraries of chemical compounds.',
  ARRAY['Python', 'Machine Learning', 'Data Science'],
  ARRAY[
    'Applied clustering techniques to identify molecular similarities',
    'Prioritized promising compounds for experimental validation',
    'Enhanced efficiency of virtual screening in pharmaceutical research'
  ],
  'completed',
  0
),
(
  'Intrusion Detection Using Machine Learning',
  'Built a machine learning-based intrusion detection system capable of identifying both internal and external threats.',
  ARRAY['Python', 'Machine Learning', 'Cybersecurity'],
  ARRAY[
    'Analyzed network traffic and user activity to detect anomalies and potential security breaches',
    'Applied anomaly detection techniques to flag suspicious behavior',
    'Trained models on labeled datasets to distinguish between normal and malicious activity',
    'Improved system reliability by reducing false positives and enhancing threat response accuracy'
  ],
  'completed',
  1
)
ON CONFLICT DO NOTHING;

-- Workshops
INSERT INTO workshops (title, organizer, description, sort_order) VALUES
(
  'AI Workshop based on ChatGPT',
  'Vignan Institute of Technology and Science in collaboration with Pantech e-learning',
  'Participated in a two-day workshop on AI based on ChatGPT organized by Vignan Institute of Technology and Science in collaboration with Pantech e-learning.',
  0
)
ON CONFLICT DO NOTHING;

-- About sections
INSERT INTO about_sections (title, content, sort_order) VALUES
(
  'Professional Introduction',
  'Dedicated and results-driven professional with strong communication skills and the ability to present complex concepts in a clear and structured manner. Passionate about creating positive learning environments and delivering high-quality instruction.',
  0
),
(
  'Teaching Interest',
  'Strong interest in teaching and technical education, with a focus on making complex computer science concepts accessible and engaging for learners at all levels.',
  1
),
(
  'Technical Background',
  'Computer Science and Engineering graduate with hands-on experience in programming, machine learning, and cybersecurity. Skilled in C, C++, Java, and Python with practical project experience in drug discovery ML models and intrusion detection systems.',
  2
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- ADMIN USER (auth.users)
-- ============================================================
-- Create admin user with bcrypt-hashed password
-- Email: admin@bhagathraj.com
-- Password: ambedkar@8309419083 (hashed via crypt() - never in frontend)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'admin@bhagathraj.com',
  crypt('ambedkar@8309419083', gen_salt('bf')),
  now(),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin"}',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('portfolio-images', 'portfolio-images', true),
  ('portfolio-videos', 'portfolio-videos', true),
  ('portfolio-documents', 'portfolio-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated write
DROP POLICY IF EXISTS "public_read_portfolio_images" ON storage.objects;
CREATE POLICY "public_read_portfolio_images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "admin_write_portfolio_images" ON storage.objects;
CREATE POLICY "admin_write_portfolio_images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "admin_update_portfolio_images" ON storage.objects;
CREATE POLICY "admin_update_portfolio_images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "admin_delete_portfolio_images" ON storage.objects;
CREATE POLICY "admin_delete_portfolio_images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "public_read_portfolio_videos" ON storage.objects;
CREATE POLICY "public_read_portfolio_videos" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'portfolio-videos');

DROP POLICY IF EXISTS "admin_write_portfolio_videos" ON storage.objects;
CREATE POLICY "admin_write_portfolio_videos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-videos');

DROP POLICY IF EXISTS "admin_update_portfolio_videos" ON storage.objects;
CREATE POLICY "admin_update_portfolio_videos" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-videos');

DROP POLICY IF EXISTS "admin_delete_portfolio_videos" ON storage.objects;
CREATE POLICY "admin_delete_portfolio_videos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'portfolio-videos');

DROP POLICY IF EXISTS "public_read_portfolio_documents" ON storage.objects;
CREATE POLICY "public_read_portfolio_documents" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'portfolio-documents');

DROP POLICY IF EXISTS "admin_write_portfolio_documents" ON storage.objects;
CREATE POLICY "admin_write_portfolio_documents" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-documents');

DROP POLICY IF EXISTS "admin_update_portfolio_documents" ON storage.objects;
CREATE POLICY "admin_update_portfolio_documents" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-documents');

DROP POLICY IF EXISTS "admin_delete_portfolio_documents" ON storage.objects;
CREATE POLICY "admin_delete_portfolio_documents" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'portfolio-documents');
