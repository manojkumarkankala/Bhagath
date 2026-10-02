import { supabase } from '@/lib/supabase';
import type {
  Profile, AboutSection, Education, Skill, Certification,
  Project, Workshop, SocialLink, ContactMessage, MediaItem,
  WebsiteSettings, LocationInfo,
} from '@/types';

// ============ PROFILE ============
export async function getProfile(): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('*').order('created_at').limit(1).maybeSingle();
  return data;
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('profiles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function createProfile(profile: Partial<Profile>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('profiles').insert(profile);
  return { error: error?.message ?? null };
}

// ============ ABOUT ============
export async function getAboutSections(): Promise<AboutSection[]> {
  const { data } = await supabase.from('about_sections').select('*').order('sort_order');
  return data ?? [];
}

export async function createAbout(section: Partial<AboutSection>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('about_sections').insert(section);
  return { error: error?.message ?? null };
}

export async function updateAbout(id: string, updates: Partial<AboutSection>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('about_sections').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteAbout(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('about_sections').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ============ EDUCATION ============
export async function getEducation(): Promise<Education[]> {
  const { data } = await supabase.from('education').select('*').order('sort_order');
  return data ?? [];
}

export async function createEducation(edu: Partial<Education>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('education').insert(edu);
  return { error: error?.message ?? null };
}

export async function updateEducation(id: string, updates: Partial<Education>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('education').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteEducation(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('education').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ============ SKILLS ============
export async function getSkills(): Promise<Skill[]> {
  const { data } = await supabase.from('skills').select('*').order('sort_order');
  return data ?? [];
}

export async function createSkill(skill: Partial<Skill>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('skills').insert(skill);
  return { error: error?.message ?? null };
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('skills').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteSkill(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('skills').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ============ CERTIFICATIONS ============
export async function getCertifications(): Promise<Certification[]> {
  const { data } = await supabase.from('certifications').select('*').order('sort_order');
  return data ?? [];
}

export async function createCertification(cert: Partial<Certification>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('certifications').insert(cert);
  return { error: error?.message ?? null };
}

export async function updateCertification(id: string, updates: Partial<Certification>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('certifications').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteCertification(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('certifications').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ============ PROJECTS ============
export async function getProjects(): Promise<Project[]> {
  const { data } = await supabase.from('projects').select('*').order('sort_order');
  return data ?? [];
}

export async function createProject(project: Partial<Project>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('projects').insert(project);
  return { error: error?.message ?? null };
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('projects').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteProject(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ============ WORKSHOPS ============
export async function getWorkshops(): Promise<Workshop[]> {
  const { data } = await supabase.from('workshops').select('*').order('sort_order');
  return data ?? [];
}

export async function createWorkshop(workshop: Partial<Workshop>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('workshops').insert(workshop);
  return { error: error?.message ?? null };
}

export async function updateWorkshop(id: string, updates: Partial<Workshop>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('workshops').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteWorkshop(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('workshops').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ============ SOCIAL LINKS ============
export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data } = await supabase.from('social_links').select('*').order('sort_order');
  return data ?? [];
}

export async function createSocialLink(link: Partial<SocialLink>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('social_links').insert(link);
  return { error: error?.message ?? null };
}

export async function updateSocialLink(id: string, updates: Partial<SocialLink>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('social_links').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteSocialLink(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('social_links').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ============ CONTACT MESSAGES ============
export async function getMessages(): Promise<ContactMessage[]> {
  const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  return data ?? [];
}

export async function createMessage(msg: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('contact_messages').insert(msg);
  return { error: error?.message ?? null };
}

export async function markMessageRead(id: string, isRead: boolean): Promise<{ error: string | null }> {
  const { error } = await supabase.from('contact_messages').update({ is_read: isRead }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteMessage(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ============ MEDIA ============
export async function getMedia(): Promise<MediaItem[]> {
  const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
  return data ?? [];
}

export async function createMedia(item: Partial<MediaItem>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('media').insert(item);
  return { error: error?.message ?? null };
}

export async function deleteMedia(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('media').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ============ WEBSITE SETTINGS ============
export async function getSettings(): Promise<WebsiteSettings | null> {
  const { data } = await supabase.from('website_settings').select('*').order('created_at').limit(1).maybeSingle();
  return data;
}

export async function updateSettings(id: string, updates: Partial<WebsiteSettings>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('website_settings').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function createSettings(settings: Partial<WebsiteSettings>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('website_settings').insert(settings);
  return { error: error?.message ?? null };
}

// ============ LOCATION ============
export async function getLocation(): Promise<LocationInfo | null> {
  const { data } = await supabase.from('location_info').select('*').order('created_at').limit(1).maybeSingle();
  return data;
}

export async function updateLocation(id: string, updates: Partial<LocationInfo>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('location_info').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function createLocation(loc: Partial<LocationInfo>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('location_info').insert(loc);
  return { error: error?.message ?? null };
}
