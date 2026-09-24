import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ApplicantDashboard from './ApplicantDashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  // 🟢 APPLICANT হলে সরাসরি ApplicantDashboard কম্পোনেন্ট রেন্ডার হবে
  if (user.role === 'APPLICANT') {
    return <ApplicantDashboard />;
  }

  // 🟣 EMPLOYER বা অন্য রিক্রুটারের জন্য ড্যাশবোর্ড ভিউ
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
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs rounded-xl border border-rose-200 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* User Role Badge */}
        <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Account Type</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
              user.role === 'EMPLOYER'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
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