import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobsWithApps, setJobsWithApps] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchEmployerJobs();
  }, []);

  const fetchEmployerJobs = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/jobs/employer-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobsWithApps(res.data);
    } catch (err) {
      console.error('Error fetching employer jobs:', err);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    const token = localStorage.getItem('token');

    try {
      await axios.patch(
        `http://localhost:5000/api/jobs/application-status/${applicationId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Application marked as ${status}`);
      fetchEmployerJobs(); // ডাটাবেজ আপডেট হওয়ার পর পেজ রিফ্রেশ না করে ডাটা রিলোড
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
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
        
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Employer Dashboard - <span className="text-purple-600">{user?.name || 'User'}</span>
            </h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/create-job"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-lg transition"
            >
              + Post New Job
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium text-sm rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Posted Jobs and Applicants List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Posted Jobs & Received Applications</h2>

          {jobsWithApps.length === 0 ? (
            <div className="bg-white p-8 text-center text-gray-500 rounded-xl border border-gray-200">
              You haven't posted any jobs yet.
            </div>
          ) : (
            jobsWithApps.map((job) => (
              <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start border-b pb-4 border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.location} • {job.category} • {job.jobType}</p>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 font-semibold rounded-full">
                    {job.applications.length} Applicants
                  </span>
                </div>

                {/* Applicants Table */}
                {job.applications.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No applicants for this job yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b">
                          <th className="p-3">Applicant Name</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Resume</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 text-sm">
                        {job.applications.map((app) => (
                          <tr key={app.id}>
                            <td className="p-3 font-semibold text-gray-800">{app.applicant?.name}</td>
                            <td className="p-3 text-gray-600">{app.applicant?.email}</td>
                            <td className="p-3">
                              <a
                                href={app.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-purple-600 hover:underline text-xs font-semibold"
                              >
                                View Resume
                              </a>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                  app.status === 'SHORTLISTED'
                                    ? 'bg-green-100 text-green-700'
                                    : app.status === 'REJECTED'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {app.status}
                              </span>
                            </td>
                            <td className="p-3 flex gap-2">
                              <button
                                onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED')}
                                className="px-2.5 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                              >
                                Shortlist
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                                className="px-2.5 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}