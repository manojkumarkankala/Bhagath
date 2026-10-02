import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import type { Profile, SocialLink, WebsiteSettings } from '@/types';
import { getProfile, getSocialLinks, getSettings } from '@/services/dataService';

export function PublicLayout() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    getProfile().then(setProfile);
    getSocialLinks().then(setSocialLinks);
    getSettings().then(setSettings);
  }, []);

  useEffect(() => {
    if (settings?.site_title) {
      document.title = settings.site_title;
    }
    if (settings?.meta_description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', settings.meta_description);
    }
  }, [settings]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet context={{ profile, socialLinks, settings }} />
      </main>
      <Footer profile={profile} socialLinks={socialLinks} settings={settings} />
      <BackToTop />
    </div>
  );
}
