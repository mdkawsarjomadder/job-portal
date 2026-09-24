import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Column 1: Brand Info (Spans 2 cols on LG) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-purple-500/20">
                J
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Job<span className="text-purple-500">Portal</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Connecting top talent with world-class employers. Streamline your hiring process or discover your next career breakthrough.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-400 hover:text-white flex items-center justify-center transition-all text-xs border border-slate-700/50">
                🌐
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-400 hover:text-white flex items-center justify-center transition-all text-xs border border-slate-700/50">
                📘
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-400 hover:text-white flex items-center justify-center transition-all text-xs border border-slate-700/50">
                💼
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-400 hover:text-white flex items-center justify-center transition-all text-xs border border-slate-700/50">
                🐦
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 inline-block">
              For Job Seekers
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="/jobs" className="hover:text-purple-400 transition-colors">Browse Jobs</a></li>
              <li><a href="/categories" className="hover:text-purple-400 transition-colors">Job Categories</a></li>
              <li><a href="/saved-jobs" className="hover:text-purple-400 transition-colors">Saved Jobs</a></li>
              <li><a href="/applications" className="hover:text-purple-400 transition-colors">My Applications</a></li>
            </ul>
          </div>

          {/* Column 3: For Employers */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 inline-block">
              For Employers
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="/post-job" className="hover:text-purple-400 transition-colors">Post a Job</a></li>
              <li><a href="/dashboard" className="hover:text-purple-400 transition-colors">Employer Dashboard</a></li>
              <li><a href="/applicants" className="hover:text-purple-400 transition-colors">Manage Applicants</a></li>
              <li><a href="/pricing" className="hover:text-purple-400 transition-colors">Pricing Plans</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 inline-block">
              Newsletter
            </h3>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Subscribe to get the latest job updates directly in your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg transition-all shadow-md shadow-purple-600/20 active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar / Copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} JobPortal Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="/contact" className="hover:text-slate-300 transition-colors">Contact Us</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;