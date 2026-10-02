export interface Profile {
  id: string;
  name: string;
  professional_title: string;
  summary: string;
  phone: string | null;
  email: string | null;
  location: string | null;
  profile_image_url: string | null;
  resume_pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AboutSection {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  start_year: string;
  end_year: string;
  gpa: string | null;
  logo_url: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  title: string;
  organization: string;
  issue_date: string | null;
  description: string | null;
  image_url: string | null;
  pdf_url: string | null;
  certificate_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  images: string[];
  video_url: string | null;
  github_url: string | null;
  live_url: string | null;
  pdf_url: string | null;
  project_date: string | null;
  features: string[];
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Workshop {
  id: string;
  title: string;
  organizer: string | null;
  date: string | null;
  description: string | null;
  images: string[];
  video_url: string | null;
  certificate_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface MediaItem {
  id: string;
  file_name: string;
  file_type: string;
  file_url: string;
  file_size: number | null;
  category: string;
  created_at: string;
}

export interface WebsiteSettings {
  id: string;
  site_title: string;
  logo_url: string | null;
  favicon_url: string | null;
  meta_description: string;
  meta_keywords: string;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  footer_text: string;
  theme: string;
  created_at: string;
  updated_at: string;
}

export interface LocationInfo {
  id: string;
  location_name: string;
  address: string | null;
  google_maps_url: string | null;
  latitude: string | null;
  longitude: string | null;
  map_embed_url: string | null;
  created_at: string;
  updated_at: string;
}
