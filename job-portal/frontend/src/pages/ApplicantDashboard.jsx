import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ApplicantDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');

  useEffect(() => {
    // ১. ইউজার ডাটা ফেচ
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // ২. জব এবং অ্যাপ্লিকেশন লোড
    fetchJobs();
    fetchMyApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const fetchMyApplications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/jobs/my-applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppliedJobs(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const handleApply = async (job) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login to apply');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/jobs/apply',
        {
          jobId: job.id,
          resumeUrl: 'https://example.com/my-resume.pdf',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      fetchMyApplications(); // আবেদন সফল হলে সাথে সাথে তালিকা রিফ্রেশ হবে
    } catch (err) {
      console.error('Application Error:', err);
      alert(err.response?.data?.message || 'Failed to apply');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-left">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Profile Header Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, <span className="text-purple-600">{user?.name || 'User'}</span>!
            </h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
              Account Type: {user?.role || 'APPLICANT'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium text-sm rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 bg-white px-6 rounded-t-xl">
          <button
            onClick={() => setActiveTab('browse')}
            className={`py-4 px-4 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'browse'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Browse Jobs
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-4 px-4 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'applications'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            My Applications ({appliedJobs.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'browse' ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Available Job Openings</h2>
            {jobs.length === 0 ? (
              <div className="bg-white p-8 text-center text-gray-500 rounded-xl border border-gray-200">
                No jobs posted yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{job.title}</h3>
                        <p className="text-sm text-gray-500 font-medium">{job.employer?.name || 'Company'}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md">
                        {job.jobType}
                      </span>
                    </div>

                    <div className="mt-4 text-sm text-gray-600 space-y-1">
                      <p>📍 {job.location}</p>
                      <p>💼 {job.category}</p>
                      <p>💰 {job.salary}</p>
                    </div>

                    <button
                      onClick={() => handleApply(job)}
                      className="mt-5 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition duration-200"
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Applied Jobs</h2>
            {appliedJobs.length === 0 ? (
              <div className="bg-white p-8 text-center text-gray-500 rounded-xl border border-gray-200">
                You haven't applied to any jobs yet.
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                      <th className="p-4">Job Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Applied Date</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {appliedJobs.map((app) => (
                      <tr key={app.id}>
                        <td className="p-4 font-semibold text-gray-800">{app.job?.title}</td>
                        <td className="p-4 text-gray-600">{app.job?.category}</td>
                        <td className="p-4 text-gray-500">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}