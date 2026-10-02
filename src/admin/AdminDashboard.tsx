import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, Award, Code2, GraduationCap, MessageSquare, Calendar, TrendingUp } from 'lucide-react';
import { getProjects, getCertifications, getSkills, getEducation, getMessages, getWorkshops } from '@/services/dataService';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    certifications: 0,
    skills: 0,
    education: 0,
    messages: 0,
    workshops: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    Promise.all([
      getProjects(),
      getCertifications(),
      getSkills(),
      getEducation(),
      getMessages(),
      getWorkshops(),
    ]).then(([projects, certifications, skills, education, messages, workshops]) => {
      setStats({
        projects: projects.length,
        certifications: certifications.length,
        skills: skills.length,
        education: education.length,
        messages: messages.length,
        workshops: workshops.length,
        unreadMessages: messages.filter((m) => !m.is_read).length,
      });
    });
  }, []);

  const cards = [
    { label: 'Projects', value: stats.projects, icon: FolderGit2, path: '/admin/projects', color: 'from-blue-500 to-blue-600' },
    { label: 'Certifications', value: stats.certifications, icon: Award, path: '/admin/certifications', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Skills', value: stats.skills, icon: Code2, path: '/admin/skills', color: 'from-amber-500 to-amber-600' },
    { label: 'Education', value: stats.education, icon: GraduationCap, path: '/admin/education', color: 'from-purple-500 to-purple-600' },
    { label: 'Workshops', value: stats.workshops, icon: Calendar, path: '/admin/workshops', color: 'from-pink-500 to-pink-600' },
    { label: 'Messages', value: stats.messages, icon: MessageSquare, path: '/admin/messages', color: 'from-cyan-500 to-cyan-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Welcome back! Here's an overview of your portfolio.</p>
      </div>

      {stats.unreadMessages > 0 && (
        <Link to="/admin/messages" className="block mb-6 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20 hover:bg-primary-500/15 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-primary-700 dark:text-primary-300">You have {stats.unreadMessages} unread message{stats.unreadMessages > 1 ? 's' : ''}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Click to view and respond</p>
            </div>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.path}
              className="glass-card p-5 sm:p-6 card-hover group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{card.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-bold">Quick Actions</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link to="/admin/profile" className="px-4 py-3 rounded-xl glass hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium">Edit Profile</Link>
          <Link to="/admin/projects" className="px-4 py-3 rounded-xl glass hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium">Add Project</Link>
          <Link to="/admin/certifications" className="px-4 py-3 rounded-xl glass hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium">Add Certification</Link>
          <Link to="/admin/skills" className="px-4 py-3 rounded-xl glass hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium">Add Skill</Link>
          <Link to="/admin/media" className="px-4 py-3 rounded-xl glass hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium">Upload Media</Link>
          <Link to="/admin/settings" className="px-4 py-3 rounded-xl glass hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium">Website Settings</Link>
        </div>
      </div>
    </div>
  );
}
