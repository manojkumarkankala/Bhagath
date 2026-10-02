import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/#about' },
  { label: 'Education', path: '/#education' },
  { label: 'Skills', path: '/#skills' },
  { label: 'Certifications', path: '/#certifications' },
  { label: 'Projects', path: '/#projects' },
  { label: 'Workshops', path: '/#workshops' },
  { label: 'Contact', path: '/#contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleNavClick = (path: string) => {
    setMobileOpen(false);
    if (path.includes('#')) {
      const [, hash] = path.split('#');
      if (location.pathname !== '/') {
        window.location.href = `/#${hash}`;
      } else {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg shadow-slate-900/5'
          : 'bg-transparent'
      }`}
    >
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm shadow-lg">
              BR
            </span>
            <span className="hidden sm:inline gradient-text">Bhagath Raj</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className="nav-link"
              >
                {item.label}
              </button>
            ))}
            <Link to="/admin/login" className="nav-link flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              Admin
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden glass rounded-2xl mt-2 mb-4 p-4 animate-fade-in-down">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.path)}
                  className="text-left py-2 px-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors font-medium text-slate-700 dark:text-slate-300"
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/admin/login"
                className="text-left py-2 px-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
