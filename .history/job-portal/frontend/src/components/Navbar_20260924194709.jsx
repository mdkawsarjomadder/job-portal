import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Briefcase, 
  User, 
  LogOut, 
  Bell, 
  PlusCircle, 
  Menu, 
  X, 
  ChevronDown, 
  LayoutDashboard,
  FileText,
  ShieldAlert
} from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [location.pathname]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const isEmployer = user?.role === 'EMPLOYER';
  const isApplicant = user?.role === 'APPLICANT';
  const isAdmin = user?.role === 'ADMIN';

  const notifications = [
    {
      id: 1,
      title: isEmployer ? 'Candidate applied for job' : 'Application under review',
      time: 'Just now',
      unread: true,
    },
    {
      id: 2,
      title: 'Welcome to JobPortal platform!',
      time: '1 hour ago',
      unread: false,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-950/95 backdrop-blur-md border-b border-purple-800/40 text-white shadow-lg transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 sm:h-18">
          
          {/* 1. Left: Brand Logo */}
          <div className="flex items-center gap-2 z-10">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-black text-sm px-2.5 py-1.5 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                JP
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
                Job<span className="text-purple-400">Portal</span>
              </span>
            </Link>
          </div>

          {/* 2. Center: Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <Link
              to="/home"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                location.pathname === '/' || location.pathname === '/home'
                  ? 'text-white bg-white/15 shadow-sm'
                  : 'text-purple-200/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                location.pathname === '/jobs'
                  ? 'text-white bg-white/15 shadow-sm'
                  : 'text-purple-200/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Jobs
            </Link>
            <Link
              to="/companies"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                location.pathname === '/companies'
                  ? 'text-white bg-white/15 shadow-sm'
                  : 'text-purple-200/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Companies
            </Link>
            <Link
              to="/about"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                location.pathname === '/about'
                  ? 'text-white bg-white/15 shadow-sm'
                  : 'text-purple-200/80 hover:text-white hover:bg-white/10'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                location.pathname === '/contact'
                  ? 'text-white bg-white/15 shadow-sm'
                  : 'text-purple-200/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Contact
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  location.pathname === '/dashboard'
                    ? 'text-white bg-white/15 shadow-sm'
                    : 'text-purple-200/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            )}

            {isApplicant && (
              <Link
                to="/my-applications"
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  location.pathname === '/my-applications'
                    ? 'text-white bg-white/15 shadow-sm'
                    : 'text-purple-200/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <FileText size={15} />
                My Applications
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                  location.pathname === '/admin' || location.pathname === '/admindashboard'
                    ? 'text-amber-300 bg-amber-400/20 border border-amber-400/30 shadow-sm'
                    : 'text-amber-300/90 hover:text-amber-200 hover:bg-white/10'
                }`}
              >
                <ShieldAlert size={15} className="text-amber-400" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* 3. Right: Action Buttons & User Menu */}
          <div className="hidden md:flex items-center gap-3 z-10">
            {isEmployer && (
              <Link
                to="/create-job"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 border border-purple-400/30"
              >
                <PlusCircle size={16} />
                Post a Job
              </Link>
            )}

            {/* Notification Bell */}
            {user && (
              <div className="relative" ref={notificationRef}>
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="p-2 text-purple-200/80 hover:text-white hover:bg-white/10 rounded-xl transition relative"
                >
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 text-slate-800 z-50 text-left">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Notifications</p>
                      <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">New</span>
                    </div>
                    <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-3 hover:bg-slate-50 transition cursor-pointer text-xs">
                          <p className="font-semibold text-slate-800">{n.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Menu / Login Buttons */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-white max-w-[110px] truncate leading-tight">{user.name || 'User'}</p>
                    <span className="text-[10px] text-purple-300 font-medium leading-none">{user.role}</span>
                  </div>
                  <ChevronDown size={14} className="text-purple-300 mr-1" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 text-slate-800 z-50 text-left">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="p-1.5 space-y-0.5 text-xs font-semibold text-slate-700">
                      <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition">
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition">
                        <User size={15} /> Edit Profile
                      </Link>
                      <div className="pt-1 border-t border-slate-100 mt-1">
                        <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition">
                          <LogOut size={15} /> Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link to="/login" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm rounded-xl transition">Register</Link>
              </div>
            )}
          </div>

          {/* 4. Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2 z-10">
            <button type="button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-xl bg-white/10 text-white">
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}