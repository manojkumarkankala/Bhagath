import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { PortfolioPage } from '@/pages/PortfolioPage';
import { AdminLogin } from '@/pages/AdminLogin';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminDashboard } from '@/admin/AdminDashboard';
import { AdminProfile } from '@/admin/AdminProfile';
import { AdminAbout } from '@/admin/AdminAbout';
import { AdminEducation } from '@/admin/AdminEducation';
import { AdminSkills } from '@/admin/AdminSkills';
import { AdminCertifications } from '@/admin/AdminCertifications';
import { AdminProjects } from '@/admin/AdminProjects';
import { AdminWorkshops } from '@/admin/AdminWorkshops';
import { AdminMessages } from '@/admin/AdminMessages';
import { AdminMedia } from '@/admin/AdminMedia';
import { AdminSocialLinks } from '@/admin/AdminSocialLinks';
import { AdminLocation } from '@/admin/AdminLocation';
import { AdminSettings } from '@/admin/AdminSettings';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PortfolioPage />} />
        </Route>

        {/* Admin login (no layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="education" element={<AdminEducation />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="certifications" element={<AdminCertifications />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="workshops" element={<AdminWorkshops />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="social-links" element={<AdminSocialLinks />} />
          <Route path="location" element={<AdminLocation />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
