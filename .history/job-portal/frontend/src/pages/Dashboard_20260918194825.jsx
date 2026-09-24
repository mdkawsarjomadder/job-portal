import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import ApplicantDashboard from './ApplicantDashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !storedUser) {
      navigate('/login');
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.clear();
        navigate('/login');
      }
    }
  }, [navigate]);

  // Dropdown-এর বাইরে ক্লিক করলে মেনু বন্ধ করার জন্য
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

  // 🟢 APPLICANT হলে সরাসরি ApplicantDashboard লোড হবে
  if (user.role === 'APPLICANT') {
    return <ApplicantDashboard />;
  }

  // 🟣 EMPLOYER এর জন্য ড্যাশবোর্ড ভিউ
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
            
            {/* 👤 User Profile Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full transition focus:outline-none"
              >
                <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate">
                  {user.name}
                </span>
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name?.charAt(0).toUpperCase()
                  )}
                </div>
              </button>

              {/* 🔽 Dropdown Menu Options */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-extrabold text-sm flex items-center justify-center shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-[11px] font-medium text-purple-600 truncate">
                        {user.position || user.role}
                      </p>
                    </div>
                  </div>

                  <div className="px-1.5 py-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/profile/edit');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition flex items-center gap-2"
                    >
                      ✏️ Edit Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition flex items-center gap-2 mt-0.5"
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

        {/* Employer Panel Card */}
        {user.role === 'EMPLOYER' && (
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-8 rounded-2xl shadow-md relative overflow-hidden space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Employer Panel</h2>
              <p className="text-purple-200/90 text-sm mt-1 max-w-lg">
                Manage your posted jobs, review applicant resumes, and hire the best talent for your organization.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/create-job')}
                className="px-5 py-2.5 bg-white hover:bg-purple-50 text-purple-900 font-bold text-xs sm:text-sm rounded-xl transition shadow-sm"
              >
                + Post a New Job
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}