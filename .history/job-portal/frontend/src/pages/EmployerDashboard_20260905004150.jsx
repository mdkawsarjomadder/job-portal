import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobsWithApps, setJobsWithApps] = useState([]);

  // Modals state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [editingJob, setEditingJob] = useState(null); // holds job object being edited

  // Form state for editing job
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: '',
    location: '',
    salary: '',
    jobType: '',
    description: '',
  });

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

  // Status update for applications
  const handleStatusUpdate = async (applicationId, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(
        `http://localhost:5000/api/jobs/application-status/${applicationId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEmployerJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (job) => {
    setEditingJob(job);
    setEditFormData({
      title: job.title || '',
      category: job.category || '',
      location: job.location || '',
      salary: job.salary || '',
      jobType: job.jobType || '',
      description: job.description || '',
    });
  };

  // Submit Edit Job Form
  const handleUpdateJob = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/jobs/${editingJob.id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingJob(null);
      fetchEmployerJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update job');
    }
  };

  // Confirm Delete Job
  const handleConfirmDeleteJob = async () => {
    if (!deleteJobId) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${deleteJobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteJobId(null);
      fetchEmployerJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job');
    }
  };

  // Confirm Logout
  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Stats Calculations
  const totalJobs = jobsWithApps.length;
  const totalApplicants = jobsWithApps.reduce((acc, job) => acc + (job.applications?.length || 0), 0);
  const shortlistedCount = jobsWithApps.reduce(
    (acc, job) => acc + (job.applications?.filter((a) => a.status === 'SHORTLISTED').length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-left font-sans relative">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navbar Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-800 to-purple-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold text-xl rounded-xl flex items-center justify-center uppercase shadow-inner">
              {user?.name ? user.name[0] : 'E'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{user?.name || 'Employer'}</h1>
                <span className="px-2.5 py-0.5 bg-purple-500/30 border border-purple-300/30 text-purple-200 text-xs font-semibold rounded-full">
                  {user?.role || 'EMPLOYER'}
                </span>
              </div>
              <p className="text-sm text-purple-200/80 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              to="/create-job"
              className="flex-1 md:flex-initial text-center px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-medium text-sm rounded-xl transition-all shadow-md hover:shadow-lg border border-purple-400/30"
            >
              + Post New Job
            </Link>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 hover:text-white border border-rose-400/30 font-medium text-sm rounded-xl transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Analytics Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl text-2xl">📋</div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Posted Jobs</p>
              <p className="text-2xl font-bold text-slate-800">{totalJobs}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl text-2xl">👥</div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Applicants</p>
              <p className="text-2xl font-bold text-slate-800">{totalApplicants}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-2xl">✨</div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Shortlisted</p>
              <p className="text-2xl font-bold text-slate-800">{shortlistedCount}</p>
            </div>
          </div>
        </div>

        {/* Job List & Applications Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Job Applications</h2>
          </div>

          {jobsWithApps.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 shadow-sm">
              <p className="text-slate-400 font-medium">You haven't posted any jobs yet.</p>
            </div>
          ) : (
            jobsWithApps.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                
                {/* Job Info Banner with Edit & Delete Actions */}
                <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-800">{job.title}</h3>
                      <span className="px-3 py-0.5 bg-purple-100/70 text-purple-700 text-xs font-semibold rounded-lg">
                        {job.applications?.length || 0} Applicants
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500 mt-1">
                      <span>📍 {job.location}</span>
                      <span>•</span>
                      <span>💼 {job.category}</span>
                      <span>•</span>
                      <span>⏳ {job.jobType}</span>
                      {job.salary && (
                        <>
                          <span>•</span>
                          <span>💰 {job.salary}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 💡 Edit & Delete Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(job)}
                      className="px-3 py-1.5 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setDeleteJobId(job.id)}
                      className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {/* Applications Table */}
                {!job.applications || job.applications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-400 italic">
                    No applications received for this job yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white text-xs font-bold uppercase tracking-wider">
                        <tr>
                          <th className="py-3.5 px-6">Applicant</th>
                          <th className="py-3.5 px-6">Email</th>
                          <th className="py-3.5 px-6">Resume</th>
                          <th className="py-3.5 px-6">Status</th>
                          <th className="py-3.5 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {job.applications.map((app) => (
                          <tr key={app.id} className="hover:bg-purple-50/30 transition">
                            <td className="py-4 px-6 font-semibold text-slate-800">
                              {app.applicant?.name || 'N/A'}
                            </td>
                            <td className="py-4 px-6 text-slate-500">
                              {app.applicant?.email || 'N/A'}
                            </td>
                            <td className="py-4 px-6">
                              {app.resumeUrl ? (
                                <a
                                  href={app.resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-700 font-medium text-xs bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition"
                                >
                                  📄 View Resume
                                </a>
                              ) : (
                                <span className="text-slate-300 text-xs">Not Provided</span>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
                                  app.status === 'SHORTLISTED'
                                    ? 'bg-emerald-100/80 text-emerald-700'
                                    : app.status === 'REJECTED'
                                    ? 'bg-rose-100/80 text-rose-700'
                                    : 'bg-amber-100/80 text-amber-700'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    app.status === 'SHORTLISTED'
                                      ? 'bg-emerald-500'
                                      : app.status === 'REJECTED'
                                      ? 'bg-rose-500'
                                      : 'bg-amber-500'
                                  }`}
                                ></span>
                                {app.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED')}
                                  disabled={app.status === 'SHORTLISTED'}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition shadow-sm"
                                >
                                  Shortlist
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                                  disabled={app.status === 'REJECTED'}
                                  className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition shadow-sm"
                                >
                                  Reject
                                </button>
                              </div>
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

      {/* 💡 Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Edit Job Listing</h3>
              <button
                onClick={() => setEditingJob(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateJob} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Salary</label>
                  <input
                    type="text"
                    value={editFormData.salary}
                    onChange={(e) => setEditFormData({ ...editFormData, salary: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Type</label>
                  <select
                    value={editFormData.jobType}
                    onChange={(e) => setEditFormData({ ...editFormData, jobType: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
                ></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 💡 Delete Confirmation Modal */}
      {deleteJobId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center border border-slate-100">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              🗑️
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Delete Job Listing?</h3>
              <p className="text-sm text-slate-500 mt-1">
                Are you sure you want to delete this job? All applications linked to this job will also be removed.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteJobId(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteJob}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-xl transition shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center border border-slate-100">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              🚪
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Confirm Logout</h3>
              <p className="text-sm text-slate-500 mt-1">Are you sure you want to log out of your employer account?</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-xl transition shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}