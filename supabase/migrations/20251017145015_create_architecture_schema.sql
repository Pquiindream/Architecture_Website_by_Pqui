/*
  # Architecture Portfolio Database Schema

  ## Overview
  Complete database schema for an architecture portfolio website with projects, team members, blog posts, and contact submissions.

  ## New Tables
  
  ### 1. `projects`
  Stores architecture projects with details and images
  - `id` (uuid, primary key) - Unique project identifier
  - `title` (text) - Project name
  - `description` (text) - Project description
  - `category` (text) - Project category (residential, commercial, institutional, urban)
  - `location` (text) - Project location
  - `year` (integer) - Completion year
  - `area` (text) - Project area/size
  - `status` (text) - Project status (completed, ongoing, concept)
  - `featured_image` (text) - Main project image URL
  - `images` (jsonb) - Array of additional project images
  - `is_featured` (boolean) - Whether project is featured on homepage
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### 2. `team_members`
  Stores information about team members
  - `id` (uuid, primary key) - Unique member identifier
  - `name` (text) - Full name
  - `role` (text) - Job title/role
  - `bio` (text) - Biography
  - `photo` (text) - Profile photo URL
  - `email` (text) - Contact email
  - `linkedin` (text) - LinkedIn profile URL
  - `order_position` (integer) - Display order
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `blog_posts`
  Stores blog articles and news
  - `id` (uuid, primary key) - Unique post identifier
  - `title` (text) - Post title
  - `slug` (text) - URL-friendly slug
  - `excerpt` (text) - Short summary
  - `content` (text) - Full post content
  - `category` (text) - Post category
  - `featured_image` (text) - Post cover image URL
  - `author_id` (uuid) - Reference to team member
  - `published` (boolean) - Publication status
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### 4. `contact_submissions`
  Stores contact form submissions
  - `id` (uuid, primary key) - Unique submission identifier
  - `name` (text) - Submitter name
  - `email` (text) - Submitter email
  - `phone` (text) - Phone number (optional)
  - `subject` (text) - Inquiry subject
  - `message` (text) - Inquiry message
  - `status` (text) - Submission status (new, reviewed, responded)
  - `created_at` (timestamptz) - Submission timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for projects, team_members, and published blog_posts
  - Contact submissions are write-only for public users
  - Admin operations require authentication (for future admin panel)

  ## Indexes
  - Index on project category and status for filtering
  - Index on blog post slug for fast lookups
  - Index on contact submission status for admin dashboard
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'residential',
  location text NOT NULL,
  year integer NOT NULL,
  area text,
  status text NOT NULL DEFAULT 'completed',
  featured_image text NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text NOT NULL,
  photo text NOT NULL,
  email text,
  linkedin text,
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'news',
  featured_image text NOT NULL,
  author_id uuid REFERENCES team_members(id),
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects (public read)
CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for team_members (public read)
CREATE POLICY "Anyone can view team members"
  ON team_members FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for blog_posts (public read published posts only)
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- RLS Policies for contact_submissions (public insert only)
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Insert sample data for projects
INSERT INTO projects (title, description, category, location, year, area, status, featured_image, images, is_featured)
VALUES 
  ('Modern Riverside Residence', 'A contemporary residential project featuring sustainable design principles and panoramic river views. The design integrates indoor and outdoor spaces through floor-to-ceiling glass walls and expansive terraces.', 'residential', 'Portland, Oregon', 2023, '3,500 sq ft', 'completed', 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200', '["https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb, true),
  ('Downtown Tech Hub', 'A cutting-edge commercial office building designed for a major technology company. Features include collaborative workspaces, rooftop gardens, and state-of-the-art sustainability systems.', 'commercial', 'San Francisco, California', 2024, '85,000 sq ft', 'completed', 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1200', '["https://images.pexels.com/photos/2412609/pexels-photo-2412609.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb, true),
  ('Greenwood Community Center', 'A vibrant community center serving as a cultural hub for the neighborhood. The design emphasizes accessibility, natural light, and flexible multi-purpose spaces.', 'institutional', 'Seattle, Washington', 2023, '12,000 sq ft', 'completed', 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=1200', '["https://images.pexels.com/photos/2097628/pexels-photo-2097628.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb, false),
  ('Skyline Luxury Apartments', 'High-rise residential complex offering premium living spaces with breathtaking city views. Amenities include a fitness center, pool deck, and landscaped gardens.', 'residential', 'Miami, Florida', 2025, '150,000 sq ft', 'ongoing', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200', '["https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb, false),
  ('Harbor Plaza Mixed-Use', 'Innovative urban development combining retail, office, and residential spaces. The design promotes walkability and creates vibrant street-level experiences.', 'urban', 'Boston, Massachusetts', 2024, '200,000 sq ft', 'ongoing', 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=1200', '["https://images.pexels.com/photos/2467285/pexels-photo-2467285.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb, true),
  ('Eco Learning Academy', 'Sustainable educational facility designed with biophilic principles. Features include green roofs, natural ventilation, and interactive outdoor learning environments.', 'institutional', 'Austin, Texas', 2023, '45,000 sq ft', 'completed', 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1200', '[]'::jsonb, false);

-- Insert sample data for team members
INSERT INTO team_members (name, role, bio, photo, email, linkedin, order_position)
VALUES
  ('Sarah Chen', 'Principal Architect & Founder', 'With over 20 years of experience, Sarah leads our design vision with a focus on sustainable and innovative architecture. She holds a Master of Architecture from MIT and has received numerous design awards.', 'https://images.pexels.com/photos/3783725/pexels-photo-3783725.jpeg?auto=compress&cs=tinysrgb&w=400', 'sarah@architecture.com', 'https://linkedin.com/in/sarachen', 1),
  ('Michael Rodriguez', 'Senior Architect', 'Michael specializes in commercial and institutional projects. His expertise in sustainable design and building systems brings technical excellence to every project.', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', 'michael@architecture.com', 'https://linkedin.com/in/mrodriguez', 2),
  ('Emily Thompson', 'Design Director', 'Emily leads our residential design studio with a passion for creating spaces that enhance daily living. Her work has been featured in numerous architecture publications.', 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=400', 'emily@architecture.com', 'https://linkedin.com/in/ethompson', 3),
  ('David Park', 'Project Manager', 'David ensures our projects are delivered on time and within budget. His attention to detail and client communication skills make every project run smoothly.', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400', 'david@architecture.com', 'https://linkedin.com/in/davidpark', 4);

-- Insert sample data for blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, category, featured_image, author_id, published)
VALUES
  ('Sustainable Design Trends for 2025', 'sustainable-design-trends-2025', 'Exploring the latest innovations in green architecture and how they shape our approach to sustainable building design.', 'As we move into 2025, sustainable architecture continues to evolve with new technologies and methodologies. From carbon-neutral materials to smart building systems, discover how modern architecture is addressing climate challenges while creating beautiful, functional spaces.', 'insights', 'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=800', (SELECT id FROM team_members WHERE name = 'Sarah Chen'), true),
  ('Project Spotlight: Downtown Tech Hub', 'project-spotlight-downtown-tech-hub', 'A behind-the-scenes look at our award-winning commercial project in San Francisco.', 'The Downtown Tech Hub represents a new paradigm in workplace design. Our team worked closely with the client to create an environment that fosters innovation, collaboration, and employee wellbeing. Learn about the design process and innovative solutions we implemented.', 'projects', 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800', (SELECT id FROM team_members WHERE name = 'Michael Rodriguez'), true),
  ('The Importance of Biophilic Design', 'importance-of-biophilic-design', 'How incorporating nature into architecture improves wellbeing and productivity.', 'Biophilic design principles connect building occupants with nature through direct and indirect elements. Research shows that these connections significantly improve mental health, productivity, and overall satisfaction. Discover how we integrate these principles into our projects.', 'insights', 'https://images.pexels.com/photos/1694360/pexels-photo-1694360.jpeg?auto=compress&cs=tinysrgb&w=800', (SELECT id FROM team_members WHERE name = 'Emily Thompson'), true);
