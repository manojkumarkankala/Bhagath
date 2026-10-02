import { useEffect, useState } from 'react';
import { AdminPageHeader, AdminCard, FormField, SaveButton, ImageUpload, FileUpload } from './AdminComponents';
import { useToast } from '@/hooks/useToast';
import { getSettings, updateSettings, createSettings } from '@/services/dataService';
import { uploadFile } from '@/lib/storage';
import type { WebsiteSettings } from '@/types';

export function AdminSettings() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    site_title: '',
    logo_url: '',
    favicon_url: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image_url: '',
    canonical_url: '',
    footer_text: '',
    theme: 'dark',
  });

  useEffect(() => {
    getSettings().then((s) => {
      if (s) {
        setSettings(s);
        setForm({
          site_title: s.site_title,
          logo_url: s.logo_url || '',
          favicon_url: s.favicon_url || '',
          meta_description: s.meta_description,
          meta_keywords: s.meta_keywords,
          og_title: s.og_title || '',
          og_description: s.og_description || '',
          og_image_url: s.og_image_url || '',
          canonical_url: s.canonical_url || '',
          footer_text: s.footer_text,
          theme: s.theme,
        });
      }
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (settings) {
      const { error } = await updateSettings(settings.id, form);
      setSaving(false);
      showToast(error ? 'Failed to save' : 'Settings updated', error ? 'error' : 'success');
    } else {
      const { error } = await createSettings(form);
      setSaving(false);
      showToast(error ? 'Failed to save' : 'Settings saved', error ? 'error' : 'success');
    }
  };

  const handleImageUpload = async (file: File, field: 'logo_url' | 'favicon_url' | 'og_image_url') => {
    setUploading(true);
    const { url, error } = await uploadFile(file, 'portfolio-images', 'settings');
    setUploading(false);
    if (error) { showToast('Upload failed', 'error'); return; }
    setForm({ ...form, [field]: url });
    showToast('Image uploaded', 'success');
  };

  return (
    <div>
      <AdminPageHeader title="Website Settings" description="Manage SEO, branding, and general settings" />
      <div className="space-y-6">
        <AdminCard>
          <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-200">Branding</h3>
          <div className="space-y-5">
            <FormField label="Website Title" required>
              <input className="input-field" value={form.site_title} onChange={(e) => setForm({ ...form, site_title: e.target.value })} />
            </FormField>
            <ImageUpload label="Logo" currentUrl={form.logo_url} uploading={uploading} onUpload={(f) => handleImageUpload(f, 'logo_url')} />
            <ImageUpload label="Favicon" currentUrl={form.favicon_url} uploading={uploading} onUpload={(f) => handleImageUpload(f, 'favicon_url')} />
            <FormField label="Footer Text">
              <input className="input-field" value={form.footer_text} onChange={(e) => setForm({ ...form, footer_text: e.target.value })} />
            </FormField>
            <FormField label="Default Theme">
              <select className="input-field" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </FormField>
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-200">SEO Settings</h3>
          <div className="space-y-5">
            <FormField label="Meta Description">
              <textarea rows={3} className="input-field resize-none" value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />
            </FormField>
            <FormField label="Meta Keywords">
              <input className="input-field" value={form.meta_keywords} onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })} placeholder="Comma-separated keywords" />
            </FormField>
            <FormField label="Canonical URL">
              <input className="input-field" value={form.canonical_url} onChange={(e) => setForm({ ...form, canonical_url: e.target.value })} placeholder="https://yourdomain.com" />
            </FormField>
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-200">Open Graph (Social Sharing)</h3>
          <div className="space-y-5">
            <FormField label="OG Title">
              <input className="input-field" value={form.og_title} onChange={(e) => setForm({ ...form, og_title: e.target.value })} />
            </FormField>
            <FormField label="OG Description">
              <textarea rows={2} className="input-field resize-none" value={form.og_description} onChange={(e) => setForm({ ...form, og_description: e.target.value })} />
            </FormField>
            <ImageUpload label="OG Image" currentUrl={form.og_image_url} uploading={uploading} onUpload={(f) => handleImageUpload(f, 'og_image_url')} />
          </div>
        </AdminCard>

        <div className="flex justify-end">
          <SaveButton onClick={handleSave} saving={saving} label="Save All Settings" />
        </div>
      </div>
    </div>
  );
}
