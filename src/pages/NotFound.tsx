import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 grid-pattern bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="text-center">
        <h1 className="text-8xl sm:text-9xl font-bold gradient-text">404</h1>
        <p className="mt-4 text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-300">
          Page Not Found
        </p>
        <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link to="/" className="btn-primary">
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary">
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
