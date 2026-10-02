import { useEffect, useState } from 'react';
import { AdminPageHeader, AdminCard, FormField, SaveButton, ImageUpload, FileUpload } from './AdminComponents';
import { useToast } from '@/hooks/useToast';
import { getProfile, updateProfile, createProfile } from '@/services/dataService';
import { uploadFile } from '@/lib/storage';
import type { Profile } from '@/types';

export function AdminProfile() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    professional_title: '',
    summary: '',
    phone: '',
    email: '',
    location: '',
    profile_image_url: '',
    resume_pdf_url: '',
  });

  useEffect(() => {
    getProfile().then((p) => {
      if (p) {
        setProfile(p);
        setForm({
          name: p.name,
          professional_title: p.professional_title,
          summary: p.summary,
          phone: p.phone || '',
          email: p.email || '',
          location: p.location || '',
          profile_image_url: p.profile_image_url || '',
          resume_pdf_url: p.resume_pdf_url || '',
        });
      }
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (profile) {
      const { error } = await updateProfile(profile.id, form);
      setSaving(false);
      showToast(error ? 'Failed to save' : 'Profile updated successfully', error ? 'error' : 'success');
    } else {
      const { error } = await createProfile(form);
      setSaving(false);
      showToast(error ? 'Failed to create' : 'Profile created successfully', error ? 'error' : 'success');
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const { url, error } = await uploadFile(file, 'portfolio-images', 'profile');
    setUploading(false);
    if (error) {
      showToast('Upload failed', 'error');
    } else {
      setForm({ ...form, profile_image_url: url });
      showToast('Image uploaded', 'success');
    }
  };

  const handleResumeUpload = async (file: File) => {
    setUploading(true);
    const { url, error } = await uploadFile(file, 'portfolio-documents', 'documents');
    setUploading(false);
    if (error) {
      showToast('Upload failed', 'error');
    } else {
      setForm({ ...form, resume_pdf_url: url });
      showToast('Resume uploaded', 'success');
    }
  };

  return (
    <div>
      <AdminPageHeader title="Profile Management" description="Edit your personal information and profile details" />
      <AdminCard>
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <FormField label="Name" required>
              <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </FormField>
            <FormField label="Professional Title" required>
              <input className="input-field" value={form.professional_title} onChange={(e) => setForm({ ...form, professional_title: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Summary" required>
            <textarea rows={4} className="input-field resize-none" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </FormField>
          <div className="grid sm:grid-cols-3 gap-5">
            <FormField label="Phone">
              <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </FormField>
            <FormField label="Email">
              <input className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </FormField>
            <FormField label="Location">
              <input className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </FormField>
          </div>
          <ImageUpload label="Profile Image" currentUrl={form.profile_image_url} uploading={uploading} onUpload={handleImageUpload} />
          <FileUpload label="Resume PDF" currentUrl={form.resume_pdf_url} uploading={uploading} accept=".pdf" onUpload={handleResumeUpload} />
          <div className="flex justify-end">
            <SaveButton onClick={handleSave} saving={saving} />
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
