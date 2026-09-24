import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ApplicantDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Loading & Toast Notification States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

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

  // ৪ সেকেন্ডের জন্য টোস্ট অ্যালার্ট দেখানোর হেলপার ফাংশন
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);

    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // ১. Apply Now বাটনে ক্লিক করলে ফাইল আপলোডের মোডাল ওপেন হবে
  const handleApplyClick = (job) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Please login to apply', 'error');
      return;
    }
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // ২. ফাইলসহ ফর্ম সাবমিট করার ফাংশন
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      showToast('Please select a PDF resume file first!', 'error');
      return;
    }

    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('jobId', selectedJob.id);
    formData.append('resume', resumeFile);

    setIsSubmitting(true);

    try {
      const res = await axios.post('http://localhost:5000/api/jobs/apply', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsSubmitting(false);
      setIsModalOpen(false);
      setResumeFile(null);
      setSelectedJob(null);
      fetchMyApplications();

      // ৪ সেকেন্ডের অটো-ক্লোজিং টোস্ট কল করা
      showToast(res.data.message || 'Applied successfully with uploaded resume!', 'success');

    } catch (err) {
      setIsSubmitting(false);
      console.error('Application Error:', err);
      showToast(err.response?.data?.message || 'Failed to apply', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Search & Category Filter Logic
  const filteredJobs = jobs.filter((job) => {
    const query = searchTerm.trim().toLowerCase();

    const titleMatch = job?.title ? job.title.toLowerCase().includes(query) : false;
    const locationMatch = job?.location ? job.location.toLowerCase().includes(query) : false;
    const categoryMatch = job?.category ? job.category.toLowerCase().includes(query) : false;

    const matchesSearch = query === '' || titleMatch || locationMatch || categoryMatch;

    const matchesCategoryDropdown =
      selectedCategory === 'All' ||
      (job?.category && job.category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategoryDropdown;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-left relative">
      
      {/* 💡 Custom 4-Second Auto Closing Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div
            className={`px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold flex items-center gap-2 ${
              toastType === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            <span>{toastType === 'success' ? '✓' : '✕'}</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

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

            {/* Search Bar & Category Select */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <input
                type="text"
                placeholder="Search by job title, location, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="All">All Categories</option>
                <option value="IT">IT / Software</option>
                <option value="Dev Developer">Dev Developer</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <h2 className="text-xl font-bold text-gray-800">Available Job Openings</h2>
            
            {filteredJobs.length === 0 ? (
              <div className="bg-white p-8 text-center text-gray-500 rounded-xl border border-gray-200">
                No matching jobs found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredJobs.map((job) => (
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
                      onClick={() => handleApplyClick(job)}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* File Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-gray-800">
                Apply for <span className="text-purple-600">{selectedJob?.title}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Your Resume (PDF format)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 border border-gray-300 rounded-lg p-1.5"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium transition ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
                  }`}
                >
                  {isSubmitting ? 'Uploading...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}