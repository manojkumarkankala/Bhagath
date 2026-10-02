import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Github, Linkedin, Instagram, Youtube, Mail, MessageCircle, Download, FolderGit2, Phone, MapPin, Send } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useToast } from '@/hooks/useToast';
import { createMessage } from '@/services/dataService';
import { getAboutSections, getEducation, getSkills, getCertifications, getProjects, getWorkshops, getLocation } from '@/services/dataService';
import type { Profile, SocialLink, WebsiteSettings, AboutSection, Education, Skill, Certification, Project, Workshop, LocationInfo } from '@/types';

interface OutletContext {
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
  if (lower.includes('whatsapp')) return MessageCircle;
  return null;
}

export function PortfolioPage() {
  const { profile, socialLinks, settings } = useOutletContext<OutletContext>();
  const { showToast } = useToast();

  const [aboutSections, setAboutSections] = useState<AboutSection[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [location, setLocation] = useState<LocationInfo | null>(null);

  const [techFilter, setTechFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [videoPopup, setVideoPopup] = useState<string | null>(null);

  // Contact form state
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAboutSections().then(setAboutSections);
    getEducation().then(setEducation);
    getSkills().then(setSkills);
    getCertifications().then(setCertifications);
    getProjects().then(setProjects);
    getWorkshops().then(setWorkshops);
    getLocation().then(setLocation);
  }, []);

  const allTechnologies = Array.from(new Set(projects.flatMap((p) => p.technologies))).sort();
  const filteredProjects = projects.filter((p) => {
    const matchesTech = techFilter === 'all' || p.technologies.includes(techFilter);
    const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTech && matchesSearch;
  });

  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    setSubmitting(true);
    const { error } = await createMessage({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      subject: formData.subject,
      message: formData.message,
    });
    setSubmitting(false);
    if (error) {
      showToast('Failed to send message. Please try again.', 'error');
    } else {
      showToast('Message sent successfully! I will get back to you soon.', 'success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  };

  const whatsappNumber = profile?.phone?.replace(/[^0-9]/g, '') || '';

  return (
    <div className="overflow-x-hidden">
      {/* ===== HERO SECTION ===== */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 pb-12 grid-pattern">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 dark:bg-accent-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-primary-400/5 dark:bg-primary-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <div className="inline-block mb-4 animate-fade-in-up">
                <span className="px-4 py-2 rounded-full glass text-sm font-medium text-primary-600 dark:text-primary-400">
                  Welcome to my portfolio
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <span className="block text-slate-900 dark:text-white">Bhagath Raj</span>
                <span className="gradient-text">Ambedkar</span>
              </h1>
              <p className="mt-4 text-lg sm:text-xl font-semibold text-slate-700 dark:text-slate-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {profile?.professional_title}
              </p>
              <p className="mt-6 text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                {profile?.summary}
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <a href="#projects" className="btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  <FolderGit2 className="w-5 h-5" />
                  View My Projects
                </a>
                {profile?.resume_pdf_url && (
                  <a href={profile.resume_pdf_url} download className="btn-secondary" target="_blank" rel="noopener noreferrer">
                    <Download className="w-5 h-5" />
                    Download Resume
                  </a>
                )}
                <a href="#contact" className="btn-accent" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  <Mail className="w-5 h-5" />
                  Contact Me
                </a>
              </div>

              {/* Social icons */}
              <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  if (!Icon) return null;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl glass card-hover hover:text-primary-500"
                      aria-label={link.platform}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Profile image */}
            <div className="order-1 lg:order-2 flex justify-center animate-scale-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full blur-2xl opacity-30 animate-pulse" />
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
                  {profile?.profile_image_url ? (
                    <img src={profile.profile_image_url} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <span className="text-7xl font-bold text-white">BR</span>
                    </div>
                  )}
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-2 -right-2 glass rounded-2xl px-4 py-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Available for work</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="section-padding bg-white dark:bg-slate-900/50">
        <div className="container-max">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-sm font-bold text-primary-500 uppercase tracking-wider">Get to know me</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold">About Me</h2>
              <div className="mt-4 w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto" />
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutSections.map((section, i) => (
              <Reveal key={section.id} delay={i * 100}>
                <div className="glass-card p-6 h-full card-hover">
                  {section.image_url && (
                    <img src={section.image_url} alt={section.title} className="w-full h-48 object-cover rounded-xl mb-4" />
                  )}
                  <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">{section.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{section.content}</p>
                  {section.video_url && (
                    <button
                      onClick={() => setVideoPopup(section.video_url!)}
                      className="mt-4 text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center gap-2"
                    >
                      <Youtube className="w-4 h-4" /> Watch video
                    </button>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EDUCATION SECTION ===== */}
      <section id="education" className="section-padding">
        <div className="container-max">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-sm font-bold text-primary-500 uppercase tracking-wider">My academic journey</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Education</h2>
              <div className="mt-4 w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto" />
            </div>
          </Reveal>

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-accent-500 to-transparent -translate-x-1/2" />

            {education.map((edu, i) => (
              <Reveal key={edu.id} delay={i * 100}>
                <div className={`relative flex items-start gap-6 mb-8 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                  {/* Dot */}
                  <div className="absolute left-4 sm:left-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-white dark:border-slate-900 -translate-x-1/2 mt-6 z-10" />

                  {/* Content */}
                  <div className={`pl-12 sm:pl-0 sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'}`}>
                    <div className="glass-card p-6 card-hover">
                      <div className="flex items-center gap-3 mb-3 justify-start sm:justify-inherit ${i % 2 === 0 ? 'sm:justify-end' : ''}">
                        {edu.logo_url && (
                          <img src={edu.logo_url} alt={edu.institution} className="w-10 h-10 rounded-lg object-cover" />
                        )}
                        <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-bold">
                          {edu.start_year} – {edu.end_year}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{edu.degree}</h3>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{edu.institution}</p>
                      {edu.gpa && (
                        <p className="mt-2 text-sm font-semibold text-accent-600 dark:text-accent-400">GPA: {edu.gpa}</p>
                      )}
                      {edu.description && (
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{edu.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SKILLS SECTION ===== */}
      <section id="skills" className="section-padding bg-white dark:bg-slate-900/50">
        <div className="container-max">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-sm font-bold text-primary-500 uppercase tracking-wider">What I bring to the table</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Technical Skills</h2>
              <div className="mt-4 w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto" />
            </div>
          </Reveal>

          <div className="space-y-10">
            {Object.entries(skillsByCategory).map(([category, categorySkills], i) => (
              <Reveal key={category} delay={i * 100}>
                <div>
                  <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-200">{category}</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="glass-card p-5 card-hover">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400">
                              {skill.name.charAt(0)}
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{skill.name}</span>
                          </div>
                          {skill.proficiency > 0 && (
                            <span className="text-sm font-bold text-primary-500">{skill.proficiency}%</span>
                          )}
                        </div>
                        {skill.proficiency > 0 && (
                          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-1000"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CERTIFICATIONS SECTION ===== */}
      <section id="certifications" className="section-padding">
        <div className="container-max">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-sm font-bold text-primary-500 uppercase tracking-wider">My achievements</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Certifications</h2>
              <div className="mt-4 w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto" />
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, i) => (
              <Reveal key={cert.id} delay={i * 100}>
                <div className="glass-card p-6 h-full card-hover group">
                  {cert.image_url && (
                    <div className="relative overflow-hidden rounded-xl mb-4 cursor-pointer" onClick={() => setLightboxImage(cert.image_url!)}>
                      <img src={cert.image_url} alt={cert.title} className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">★</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 leading-snug">{cert.title}</h3>
                      <p className="text-sm text-primary-500 font-medium mt-1">{cert.organization}</p>
                    </div>
                  </div>
                  {cert.issue_date && <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Issued: {cert.issue_date}</p>}
                  {cert.description && <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{cert.description}</p>}
                  <div className="flex gap-3 flex-wrap">
                    {cert.certificate_url && (
                      <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary-500 hover:text-primary-600 flex items-center gap-1">
                        View Certificate
                      </a>
                    )}
                    {cert.pdf_url && (
                      <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-accent-500 hover:text-accent-600 flex items-center gap-1">
                        <Download className="w-4 h-4" /> PDF
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROJECTS SECTION ===== */}
      <section id="projects" className="section-padding bg-white dark:bg-slate-900/50">
        <div className="container-max">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-sm font-bold text-primary-500 uppercase tracking-wider">My work</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Projects</h2>
              <div className="mt-4 w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto" />
            </div>
          </Reveal>

          {/* Filters */}
          <Reveal>
            <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTechFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${techFilter === 'all' ? 'bg-primary-600 text-white' : 'glass hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                >
                  All
                </button>
                {allTechnologies.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => setTechFilter(tech)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${techFilter === tech ? 'bg-primary-600 text-white' : 'glass hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field max-w-xs"
              />
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredProjects.map((project, i) => (
              <Reveal key={project.id} delay={i * 100}>
                <div className="glass-card overflow-hidden h-full card-hover group">
                  {project.images.length > 0 && (
                    <div className="relative overflow-hidden cursor-pointer" onClick={() => setLightboxImage(project.images[0])}>
                      <img src={project.images[0]} alt={project.title} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" />
                      {project.video_url && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setVideoPopup(project.video_url!); }}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <div className="p-4 rounded-full bg-white/90">
                            <Youtube className="w-8 h-8 text-red-600" />
                          </div>
                        </button>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{project.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${project.status === 'completed' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{project.description}</p>
                    {project.features.length > 0 && (
                      <ul className="space-y-1.5 mb-4">
                        {project.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                            <span className="text-accent-500 mt-0.5">▸</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4 flex-wrap">
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-500 flex items-center gap-1.5">
                          <Github className="w-4 h-4" /> Code
                        </a>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-500 flex items-center gap-1.5">
                          <FolderGit2 className="w-4 h-4" /> Demo
                        </a>
                      )}
                      {project.pdf_url && (
                        <a href={project.pdf_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-500 flex items-center gap-1.5">
                          <Download className="w-4 h-4" /> PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <p>No projects found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== WORKSHOPS SECTION ===== */}
      <section id="workshops" className="section-padding">
        <div className="container-max">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-sm font-bold text-primary-500 uppercase tracking-wider">Continuous learning</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Workshops</h2>
              <div className="mt-4 w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto" />
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop, i) => (
              <Reveal key={workshop.id} delay={i * 100}>
                <div className="glass-card p-6 h-full card-hover">
                  {workshop.images.length > 0 && (
                    <img src={workshop.images[0]} alt={workshop.title} className="w-full h-40 object-cover rounded-xl mb-4" />
                  )}
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">{workshop.title}</h3>
                  {workshop.organizer && <p className="text-sm text-primary-500 font-medium mb-2">{workshop.organizer}</p>}
                  {workshop.date && <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{workshop.date}</p>}
                  {workshop.description && <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{workshop.description}</p>}
                  {workshop.certificate_url && (
                    <a href={workshop.certificate_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary-500 hover:text-primary-600 flex items-center gap-1.5">
                      <Download className="w-4 h-4" /> View Certificate
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact" className="section-padding bg-white dark:bg-slate-900/50">
        <div className="container-max">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-sm font-bold text-primary-500 uppercase tracking-wider">Let's connect</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Get In Touch</h2>
              <div className="mt-4 w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto" />
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact info */}
            <Reveal>
              <div className="space-y-6">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  I'm always open to discussing new opportunities, collaborations, or answering any questions you may have. Feel free to reach out!
                </p>

                <div className="space-y-4">
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-4 p-4 glass-card card-hover group">
                      <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center group-hover:bg-primary-500/25 transition-colors">
                        <Mail className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{profile.email}</p>
                      </div>
                    </a>
                  )}
                  {profile?.phone && (
                    <a href={`tel:${profile.phone}`} className="flex items-center gap-4 p-4 glass-card card-hover group">
                      <div className="w-12 h-12 rounded-xl bg-accent-500/15 flex items-center justify-center group-hover:bg-accent-500/25 transition-colors">
                        <Phone className="w-5 h-5 text-accent-500" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{profile.phone}</p>
                      </div>
                    </a>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-4 p-4 glass-card">
                      <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Location</p>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{profile.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick buttons */}
                <div className="flex flex-wrap gap-3">
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`} className="btn-primary">
                      <Mail className="w-4 h-4" /> Email
                    </a>
                  )}
                  {profile?.phone && (
                    <a href={`tel:${profile.phone}`} className="btn-secondary">
                      <Phone className="w-4 h-4" /> Call
                    </a>
                  )}
                  {whatsappNumber && (
                    <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn-accent">
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                  )}
                </div>

                {/* Map */}
                {location?.map_embed_url && (
                  <div className="glass-card overflow-hidden rounded-2xl">
                    <iframe
                      src={location.map_embed_url}
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      loading="lazy"
                      title="Location map"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            </Reveal>

            {/* Contact form */}
            <Reveal delay={100}>
              <form onSubmit={handleContactSubmit} className="glass-card p-6 sm:p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Name *</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Email *</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" placeholder="Your email" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Phone</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-field" placeholder="Your phone" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Subject *</label>
                    <input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="input-field" placeholder="Subject" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Message *</label>
                  <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="input-field resize-none" placeholder="Your message" />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
                  <Send className="w-4 h-4" />
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== LIGHTBOX ===== */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <img src={lightboxImage} alt="Lightbox" className="max-w-full max-h-full rounded-2xl shadow-2xl" />
          <button className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" aria-label="Close">
            <span className="text-2xl">✕</span>
          </button>
        </div>
      )}

      {/* ===== VIDEO POPUP ===== */}
      {videoPopup && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setVideoPopup(null)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <video src={videoPopup} controls autoPlay className="w-full rounded-2xl shadow-2xl" />
            <button onClick={() => setVideoPopup(null)} className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" aria-label="Close">
              <span className="text-2xl">✕</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
