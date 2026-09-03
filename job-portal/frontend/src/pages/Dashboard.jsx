import { useNavigate } from 'react-router-dom';
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
  
  if (user.role === 'APPLICANT') {
    return <ApplicantDashboard />;
  }
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Top Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* User Role Badge */}
        <div className="mb-6">
          <span className="text-sm font-semibold text-gray-600">Account Type: </span>
          <span className={`px-3 py-1 rounded text-sm font-bold ${
            user.role === 'EMPLOYER' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
          }`}>
            {user.role}
          </span>
        </div>

        {/* Role-Based Content Area */}
        {user.role === 'EMPLOYER' ? (
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h2 className="text-xl font-semibold text-purple-900 mb-2">Employer Panel</h2>
            <p className="text-purple-700 mb-4">You can post new jobs and view job applications here.</p>
            <button 
              onClick={() => navigate('/create-job')}
              className="bg-purple-600 text-white px-4 py-2 rounded font-medium hover:bg-purple-700 transition"
            >
              + Post a New Job
            </button>
          </div>
        ) : (
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-xl font-semibold text-green-900 mb-2">Applicant Panel</h2>
            <p className="text-green-700 mb-4">Browse available job posts and apply for positions.</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 transition">
              Browse Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}