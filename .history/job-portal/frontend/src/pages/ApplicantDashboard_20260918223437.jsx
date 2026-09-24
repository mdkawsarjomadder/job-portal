import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ApplicantDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Application Form States
  const [resumeFile, setResumeFile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    experienceYears: '',
    currentCompany: '',
    currentDesignation: '',
    skills: '',
    noticePeriod: 'Immediately',
    expectedJoiningDate: '',
    negotiatedJoinPeriod: '',
    currentSalary: '',
    expectedSalary: '',
    currentLocation: '',
    preferredLocation: '',
    workMode: 'On-site',
    portfolioUrl: '',
    linkedinUrl: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Profile Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Loading & Toast Notification States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchLatestProfile();
    fetchJobs();
    fetchMyApplications();
  }, []);

  const fetchLatestProfile = async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData(prev => ({
        ...prev,
        fullName: parsedUser.name || '',
        email: parsedUser.email || ''
      }));
    }

    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/jobs/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        setFormData(prev => ({
          ...prev,
          fullName: res.data.name || '',
          email: res.data.email || ''
        }));
      }
    } catch (err) {
      console.error('Error fetching fresh profile:', err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleApplyClick = (job) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Please login to apply', 'error');
      return;
    }
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      showToast('Please select a PDF resume file first!', 'error');
      return;
    }

    const token = localStorage.getItem('token');
    
    const submitData = new FormData();
    submitData.append('jobId', selectedJob.id);
    submitData.append('resume', resumeFile);
    
    // Append all form text inputs
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    setIsSubmitting(true);

    try {
      const res = await axios.post('http://localhost:5000/api/jobs/apply', submitData, {
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

      showToast(res.data.message || 'Application submitted successfully!', 'success');

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
      
      {/* Toast Notification */}
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

          {/* User Profile Dropdown Section */}
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex flex-col items-center justify-center p-1 rounded-xl hover:bg-gray-50 transition focus:outline-none"
            >
              <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-bold text-base flex items-center justify-center overflow-hidden border-2 border-purple-200 shadow-sm shrink-0">
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
              <span className="text-xs font-semibold text-gray-700 mt-1 max-w-[120px] truncate">
                {user?.name || 'Profile'}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50">
                <div className="flex items-center gap-3 p-2 border-b border-gray-100 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center overflow-hidden shrink-0">
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
                    <p className="text-[10px] font-bold text-purple-600 uppercase">
                      {user?.role || 'APPLICANT'}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition flex items-center gap-2"
                  >
                    ✏️ Edit Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-2"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
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

      {/* Full Detailed Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-xl text-gray-800">
                Apply for <span className="text-purple-600">{selectedJob?.title}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs sm:text-sm">
              
              {/* 1. Resume Upload */}
              <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
                <label className="block font-bold text-gray-800 mb-2">
                  Upload Resume (PDF format) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 border border-gray-300 bg-white rounded-lg p-1.5 cursor-pointer"
                  required
                />
              </div>

              {/* 2. Personal Information */}
              <div>
                <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide border-b pb-1">
                  1. Personal Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Md. Rahim Hossain"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Primary Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+8801700000000"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">WhatsApp Number</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="+8801700000000"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Experience & Skills */}
              <div>
                <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide border-b pb-1">
                  2. Experience & Tech Stack
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Total Experience (Years)</label>
                    <input
                      type="text"
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleInputChange}
                      placeholder="e.g. 2 Years / Fresher"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Current Company</label>
                    <input
                      type="text"
                      name="currentCompany"
                      value={formData.currentCompany}
                      onChange={handleInputChange}
                      placeholder="e.g. ABC Tech Ltd."
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Current Role / Designation</label>
                    <input
                      type="text"
                      name="currentDesignation"
                      value={formData.currentDesignation}
                      onChange={handleInputChange}
                      placeholder="e.g. Software Engineer"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Key Skills / Tech Stack</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="React, Node.js, Tailwind"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 4. Joining & Notice Period */}
              <div>
                <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide border-b pb-1">
                  3. Notice & Joining
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Notice Period</label>
                    <select
                      name="noticePeriod"
                      value={formData.noticePeriod}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                    >
                      <option value="Immediately">Immediately</option>
                      <option value="15 Days">15 Days</option>
                      <option value="1 Month">1 Month</option>
                      <option value="2 Months">2 Months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Expected Joining Date</label>
                    <input
                      type="date"
                      name="expectedJoiningDate"
                      value={formData.expectedJoiningDate}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Negotiated Joining Note</label>
                    <input
                      type="text"
                      name="negotiatedJoinPeriod"
                      value={formData.negotiatedJoinPeriod}
                      onChange={handleInputChange}
                      placeholder="Can join earlier if required"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Compensation & Preference */}
              <div>
                <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide border-b pb-1">
                  4. Salary & Work Location Preference
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Current CTC (Salary)</label>
                    <input
                      type="text"
                      name="currentSalary"
                      value={formData.currentSalary}
                      onChange={handleInputChange}
                      placeholder="e.g. 40,000 BDT"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Expected CTC (Salary)</label>
                    <input
                      type="text"
                      name="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={handleInputChange}
                      placeholder="e.g. 60,000 BDT"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Current Location</label>
                    <input
                      type="text"
                      name="currentLocation"
                      value={formData.currentLocation}
                      onChange={handleInputChange}
                      placeholder="e.g. Dhaka, Bangladesh"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Preferred Location</label>
                    <input
                      type="text"
                      name="preferredLocation"
                      value={formData.preferredLocation}
                      onChange={handleInputChange}
                      placeholder="e.g. Remote / Dhaka"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-600 font-semibold mb-1">Preferred Work Mode</label>
                    <select
                      name="workMode"
                      value={formData.workMode}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                    >
                      <option value="On-site">On-site</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 6. Links */}
              <div>
                <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide border-b pb-1">
                  5. Portfolio & Social Links
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Portfolio / Website Link</label>
                    <input
                      type="url"
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      placeholder="https://myportfolio.com"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">LinkedIn Profile</label>
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold transition shadow-md ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}