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
  Sparkles,
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
    // Listen to storage changes (e.g. login/logout in other tabs or actions)
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

  // Sample dynamic notifications
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
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* 1. Left: Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-black text-sm px-2.5 py-1.5 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                JP
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
                Job<span className="text-purple-400">Portal</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  location.pathname === '/' || location.pathname === '/home'
                    ? 'text-white bg-white/15 shadow-sm'
                    : 'text-purple-200/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Home
              </Link>

              {user && (
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                    location.pathname === '/dashboard' || location.pathname === '/employerdashboard'
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

              {isEmployer && (
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                    location.pathname === '/employerdashboard'
                      ? 'text-white bg-white/15 shadow-sm'
                      : 'text-purple-200/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Briefcase size={15} />
                  Manage Jobs
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
          </div>

          {/* 2. Right: Action Buttons & User Menu */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Employer: Post a Job CTA */}
            {isEmployer && (
              <Link
                to="/create-job"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-purple-500/25 transition-all flex items-center gap-1.5 border border-purple-400/30"
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
                  title="Notifications"
                >
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                </button>

                {/* Notifications Popover */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100 text-left">
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

                    <div className="px-4 pt-2 border-t border-slate-100 text-center">
                      <Link
                        to={isApplicant ? '/my-applications' : '/dashboard'}
                        onClick={() => setIsNotificationOpen(false)}
                        className="text-[11px] font-bold text-purple-600 hover:text-purple-700 hover:underline"
                      >
                        View all activity →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile Dropdown or Auth Buttons */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition focus:outline-none"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center overflow-hidden shadow-sm shrink-0 border border-white/20">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>

                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-white max-w-[110px] truncate leading-tight">
                      {user.name || 'User'}
                    </p>
                    <span className="text-[10px] text-purple-300 font-medium leading-none">
                      {user.role}
                    </span>
                  </div>

                  <ChevronDown size={14} className="text-purple-300 mr-1" />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 text-slate-800 z-50 text-left">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold text-sm flex items-center justify-center overflow-hidden shrink-0">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          user?.name?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        <span className={`inline-block mt-0.5 px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${
                          isAdmin ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {isAdmin ? '👑 Super Admin' : user.role}
                        </span>
                      </div>
                    </div>

                    <div className="p-1.5 space-y-0.5 text-xs font-semibold text-slate-700">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-900 font-bold hover:bg-amber-100 transition"
                        >
                          <ShieldAlert size={15} className="text-amber-600" />
                          Admin Panel
                        </Link>
                      )}

                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        <LayoutDashboard size={15} />
                        Dashboard
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        <User size={15} />
                        Edit Profile
                      </Link>

                      {isApplicant && (
                        <Link
                          to="/my-applications"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition"
                        >
                          <FileText size={15} />
                          My Applications
                        </Link>
                      )}

                      {isEmployer && (
                        <Link
                          to="/create-job"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition"
                        >
                          <PlusCircle size={15} />
                          Post a New Job
                        </Link>
                      )}

                      <div className="pt-1 border-t border-slate-100 mt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition"
                        >
                          <LogOut size={15} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl backdrop-blur-md border border-white/20 transition shadow-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md hover:shadow-purple-600/30"
                >
                  Register
                </Link>
              </div>
            )}

          </div>

          {/* 3. Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            {isEmployer && (
              <Link
                to="/create-job"
                className="p-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow"
                title="Post Job"
              >
                <PlusCircle size={18} />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* 4. Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-purple-950/98 border-t border-purple-800/40 px-4 pt-3 pb-6 space-y-3">
          {user ? (
            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl border border-white/10 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <span className={`text-[10px] font-bold uppercase ${isAdmin ? 'text-amber-300' : 'text-purple-300'}`}>
                  {isAdmin ? '👑 Super Admin' : user.role}
                </span>
              </div>
            </div>
          ) : null}

          <div className="space-y-1 text-sm font-semibold">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl hover:bg-white/10 transition"
            >
              Home
            </Link>

            {user && (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold transition flex items-center gap-2"
                  >
                    <ShieldAlert size={16} className="text-amber-400" />
                    Admin Panel
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-white/10 transition"
                >
                  Dashboard
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-white/10 transition"
                >
                  Profile
                </Link>

                {isApplicant && (
                  <Link
                    to="/my-applications"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-white/10 transition"
                  >
                    My Applications
                  </Link>
                )}

                {isEmployer && (
                  <Link
                    to="/create-job"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl bg-purple-600 text-white transition"
                  >
                    + Post a Job
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/20 transition flex items-center gap-2 mt-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}

            {!user && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2.5 bg-white/10 rounded-xl text-white font-semibold transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2.5 bg-purple-600 text-white font-bold rounded-xl shadow transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
