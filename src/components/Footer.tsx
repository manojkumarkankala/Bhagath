import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import type { Profile, SocialLink, WebsiteSettings } from '@/types';

interface FooterProps {
  profile: Profile | null;
  socialLinks: SocialLink[];
  settings: WebsiteSettings | null;
}

function getSocialIcon(platform: string) {
  const lower = platform.toLowerCase();
  if (lower.includes('github')) return Github;
  if (lower.includes('linkedin')) return Linkedin;
  if (lower.includes('instagram')) return Instagram;
  if (lower.includes('youtube')) return Youtube;
  if (lower.includes('mail') || lower.includes('email')) return Mail;
  return null;
}

export function Footer({ profile, socialLinks, settings }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-lg">
                BR
              </span>
              <span className="font-bold text-lg gradient-text">Bhagath Raj Ambedkar</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {profile?.professional_title}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">Contact</h3>
            <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-primary-500 transition-colors">
                  <Mail className="w-4 h-4" /> {profile.email}
                </a>
              )}
              {profile?.phone && (
                <a href={`tel:${profile.phone}`} className="flex items-center gap-2 hover:text-primary-500 transition-colors">
                  <Phone className="w-4 h-4" /> {profile.phone}
                </a>
              )}
              {profile?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {profile.location}
                </div>
              )}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform);
                if (!Icon) return null;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl glass card-hover hover:text-primary-500"
                    aria-label={link.platform}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
            {settings?.footer_text || '© 2025 Bhagath Raj Ambedkar. All rights reserved.'}
          </p>
          <Link to="/admin/login" className="text-sm text-slate-400 hover:text-primary-500 transition-colors">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
