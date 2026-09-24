import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ApplicantDashboard from './ApplicantDashboard';
import EmployerDashboard from './EmployerDashboard'; // 1. EmployerDashboard import kora holo
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchLatestUser = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!token || !storedUser) {
        navigate('/login');
        return;
      }

      // ১. প্রারম্ভিক লোকাল স্টোরেজ ডাটা সেট করা
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.clear();
        navigate('/login');
        return;
      }

      // ২. ডাটাবেজ থেকে লেটেস্ট avatar সহ ইউজার প্রোফাইল ফেচ করা
      try {
        const res = await axios.get('http://localhost:5000/api/jobs/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data)); // লোকাল স্টোরেজ সিঙ্ক
        }
      } catch (err) {
        console.error("Failed to fetch fresh user profile:", err);
      }
    };

    fetchLatestUser();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  // Role-based Dashboard Render
  if (user.role === 'ADMIN') {
    return <AdminDashboard />;
  }

  if (user.role === 'APPLICANT') {
    return <ApplicantDashboard />;
  }

  if (user.role === 'EMPLOYER') {
    return <EmployerDashboard />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4 sm:p-8 text-left">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Welcome back, <span className="text-purple-600">{user.name}</span>!
            </h1>
            <p className="text-xs text-slate-500 mt-1">{user.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/home"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
            >
              Browse Home
            </Link>

            {/* Profile Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex flex-col items-center gap-1.5 p-1 transition focus:outline-none"
              >
                {/* Avatar (Image or Initial) */}
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-extrabold text-sm flex items-center justify-center overflow-hidden shrink-0">
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

                {/* User Name */}
                <span className="text-xs font-bold text-gray-700 max-w-[100px] truncate text-center">
                  {user?.name || 'Profile'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-extrabold text-sm flex items-center justify-center overflow-hidden shrink-0">
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
                      <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                      <p className="text-[11px] font-medium text-purple-600 truncate">
                        {user?.role}
                      </p>
                    </div>
                  </div>

                  <div className="px-1.5 py-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition flex items-center gap-2"
                    >
                      ✏️ Edit Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-2 mt-0.5"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* User Role Badge */}
        <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Account Type</span>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold border bg-purple-50 text-purple-700 border-purple-200">
            {user.role}
          </span>
        </div>

      </div>
    </div>
  );
}