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
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Status Update Modal State
  const [statusModalData, setStatusModalData] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Interview Modal States
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewPhone, setInterviewPhone] = useState('');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState({
    date: '',
    time: '',
    type: 'In-Person',
    locationOrLink: '',
  });

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

  const handleOpenStatusModal = (applicationId, status, applicantName) => {
    setStatusModalData({ applicationId, status, applicantName });
  };

  const handleConfirmStatusUpdate = async () => {
    if (!statusModalData) return;
    const { applicationId, status } = statusModalData;
    const token = localStorage.getItem('token');
    setIsUpdatingStatus(true);

    try {
      await axios.patch(
        `http://localhost:5000/api/jobs/application-status/${applicationId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatusModalData(null);
      fetchEmployerJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } 
     finally {
      setIsUpdatingStatus(false);
    }
  };

  // Fixed Interview Modal Opener
  const handleOpenInterviewModal = (appData, jobTitle = '') => {
    console.log('Selected Application Object:', appData);
    
    // Automatically find phone number from all possible nested properties
    const phone =
      appData?.phone ||
      appData?.applicant?.phone ||
      appData?.applicant?.mobile ||
      appData?.applicant?.contactNumber ||
      '';

    setSelectedApplicant({ ...appData, jobTitle });
    setInterviewPhone(phone);
    if (appData?.interviewDate) {
      setInterviewDetails({
        date: appData.interviewDate || '',
        time: appData.interviewTime || '',
        type: appData.interviewType || 'In-Person',
        locationOrLink: appData.interviewLocation || '',
      });
    } else {
      setInterviewDetails({ date: '', time: '', type: 'In-Person', locationOrLink: '' });
    }
    setIsInterviewModalOpen(true);
  };

  // Fixed Send SMS Handler
  const handleSendInterviewCall = async (e) => {
    e.preventDefault();

    if (!interviewPhone || interviewPhone.trim() === '') {
      alert('Please enter a candidate phone number!');
      return;
    }

    setIsSendingSms(true);
    const token = localStorage.getItem('token');

    // Handle both relational DB ID and MongoDB _id
    const appId = selectedApplicant?.id || selectedApplicant?._id;

    const payload = {
      applicationId: appId,
      phone: interviewPhone.trim(),
      applicantName: selectedApplicant?.applicant?.name || selectedApplicant?.applicantName || 'Candidate',
      jobTitle: selectedApplicant?.jobTitle || selectedApplicant?.job?.title || 'Job Position',
      date: interviewDetails.date,
      time: interviewDetails.time,
      type: interviewDetails.type,
      locationOrLink: interviewDetails.locationOrLink,
    };

    console.log('Sending Interview Payload:', payload);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/jobs/schedule-interview',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data?.message || 'Interview scheduled successfully and saved to database!');
      setIsInterviewModalOpen(false);
      // Reset form fields and refresh table
      setInterviewDetails({ date: '', time: '', type: 'In-Person', locationOrLink: '' });
      fetchEmployerJobs();
    } catch (err) {
      console.error('SMS Send Error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to send Interview SMS. Please check server logs.');
    } finally {
      setIsSendingSms(false);
    }
  };

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

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const jobId = editingJob.id || editingJob._id;

    try {
      await axios.put(`http://localhost:5000/api/jobs/${jobId}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingJob(null);
      fetchEmployerJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update job');
    }
  };

  const handleConfirmDeleteJob = async () => {
    if (!deleteJobId) return;
    const token = localStorage.getItem('token');
    setIsDeleting(true);

    try {
      await axios.delete(`http://localhost:5000/api/jobs/${deleteJobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteJobId(null);
      fetchEmployerJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const totalJobs = jobsWithApps.length;
  const totalApplicants = jobsWithApps.reduce((acc, job) => acc + (job.applications?.length || 0), 0);
  const shortlistedCount = jobsWithApps.reduce(
    (acc, job) => acc + (job.applications?.filter((a) => a.status === 'SHORTLISTED').length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-left font-sans relative">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navbar Header Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-800 to-purple-900 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold text-2xl rounded-2xl flex items-center justify-center uppercase shadow-inner shrink-0">
              {user?.name ? user.name[0] : 'E'}
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-snug mb-1">
              {user?.name || 'Employer Dashboard'}
            </h1>
            <span className="px-3 py-0.5 bg-purple-500/30 border border-purple-300/30 text-purple-200 text-xs font-semibold rounded-full uppercase tracking-wider">
              {user?.role || 'EMPLOYER'}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-center">
            <Link
              to="/create-job"
              className="flex-1 sm:flex-initial text-center px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg border border-purple-400/40 whitespace-nowrap"
            >
              + Post New Job
            </Link>
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 hover:text-white border border-rose-400/30 font-semibold text-sm rounded-xl transition-all flex items-center gap-2 backdrop-blur-sm shrink-0"
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
          <h2 className="text-lg font-bold text-slate-800">Job Applications</h2>

          {jobsWithApps.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 shadow-sm">
              <p className="text-slate-400 font-medium">You haven't posted any jobs yet.</p>
            </div>
          ) : (
            jobsWithApps.map((job) => {
              const jobId = job.id || job._id;
              return (
                <div key={jobId} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
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

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(job)}
                        className="px-3 py-1.5 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteJobId(jobId)}
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


              <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-sm bg-white">
                <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
                  {/* Table Header with Fixed Column Widths & Borders */}
                  <thead>
                    <tr className="bg-purple-700 text-white text-xs font-bold uppercase tracking-wider divide-x divide-purple-600">
                      <th className="py-3.5 px-4 w-[12%] text-left">Applicant</th>
                      <th className="py-3.5 px-4 w-[15%] text-left">Email</th>
                      <th className="py-3.5 px-4 w-[15%] text-center">Resume</th>
                      <th className="py-3.5 px-4 w-[15%] text-center">Status</th>
                      <th className="py-3.5 px-4 w-[15%] text-center">Interview Details</th>
                      <th className="py-3.5 px-5 w-[15%] text-center">Actions</th>
                    </tr>
                  </thead>

                  {/* Table Body with Clear Row & Column Borders */}
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                    {job.applications?.map((app) => {
                      const appId = app.id || app._id;
                      return (
                        <tr key={appId} className="hover:bg-slate-50 transition-colors divide-x divide-slate-200">
                          {/* 1. APPLICANT */}
                          <td className="py-3.5 px-4 font-semibold text-slate-900 truncate">
                            {app.applicant?.name || app.applicantName || 'N/A'}
                          </td>

                          {/* 2. EMAIL */}
                          <td className="py-3.5 px-4 text-slate-600 truncate">
                            {app.applicant?.email || app.applicantEmail || 'N/A'}
                          </td>

                          {/* 3. RESUME */}
                          <td className="py-3.5 px-4 text-center">
                            {app.resumeUrl ? (
                              <a
                                href={app.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 font-medium rounded-lg transition text-[11px]"
                              >
                                📄 View Resume
                              </a>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">No Resume</span>
                            )}
                          </td>

                          {/* 4. STATUS */}
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                app.status === 'SHORTLISTED'
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                  : app.status === 'REJECTED'
                                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                  : 'bg-amber-100 text-amber-700 border border-amber-200'
                              }`}
                            >
                              ● {app.status || 'PENDING'}
                            </span>
                          </td>

                          {/* 5. INTERVIEW DETAILS */}
                          <td className="py-3.5 px-4 text-center">
                            {app.interviewDate ? (
                              <div className="flex flex-col text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-100 p-1.5 rounded-lg">
                                <span className="font-bold">📅 {app.interviewDate} {app.interviewTime}</span>
                                <span className="text-[10px] text-slate-500 font-medium truncate mt-0.5" title={app.interviewLocation}>
                                  📍 {app.interviewLocation}
                                </span>
                              </div>
                            ) : app.status === 'SHORTLISTED' ? (
                              <button
                                type="button"
                                onClick={() => handleOpenInterviewModal(app, job.title)}
                                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-medium rounded-lg transition shadow-sm inline-flex items-center justify-center gap-1"
                              >
                                ✉️ Interview SMS
                              </button>
                            ) : (
                              <span className="text-slate-400 text-[11px] italic">Not Scheduled</span>
                            )}
                          </td>

                          {/* 6. ACTIONS (Perfectly Centered & Aligned) */}
                          <td className="py-3.5 px-4 text-center">
                            <select
                              value=""
                              onChange={(e) => {
                                const selectedValue = e.target.value;
                                if (selectedValue === 'SHORTLISTED' || selectedValue === 'REJECTED') {
                                  handleOpenStatusModal(appId, selectedValue, app.applicant?.name);
                                } else if (selectedValue === 'INTERVIEW') {
                                  handleOpenInterviewModal(app, job.title);
                                }
                              }}
                              className="w-full max-w-[140px] px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer transition-all mx-auto"
                            >
                              <option value="" disabled>
                                ⚙️ Select Action
                              </option>
                              
                              <option
                                value="SHORTLISTED"
                                disabled={app.status === 'SHORTLISTED'}
                              >
                                ✨ Shortlist
                              </option>
                              
                              <option
                                value="REJECTED"
                                disabled={app.status === 'REJECTED'}
                              >
                                🚫 Reject
                              </option>

                              {app.status === 'SHORTLISTED' && (
                                <option value="INTERVIEW">
                                  {app.interviewDate ? '🔄 Edit Interview' : '✉️ Send Interview SMS'}
                                </option>
                              )}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {isInterviewModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !isSendingSms && setIsInterviewModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-800 border-b pb-3">
              Call Interview for <span className="text-purple-600">{selectedApplicant?.applicant?.name || selectedApplicant?.applicantName || 'Candidate'}</span>
            </h3>

            <form onSubmit={handleSendInterviewCall} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Candidate Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 01700000000"
                  value={interviewPhone}
                  onChange={(e) => setInterviewPhone(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Interview Date</label>
                <input
                  type="date"
                  required
                  value={interviewDetails.date}
                  onChange={(e) => setInterviewDetails({ ...interviewDetails, date: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Interview Time</label>
                <input
                  type="time"
                  required
                  value={interviewDetails.time}
                  onChange={(e) => setInterviewDetails({ ...interviewDetails, time: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Interview Mode</label>
                <select
                  value={interviewDetails.type}
                  onChange={(e) => setInterviewDetails({ ...interviewDetails, type: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-sm bg-white"
                >
                  <option value="In-Person">In-Person (Office)</option>
                  <option value="Online">Online (Google Meet / Zoom)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  {interviewDetails.type === 'In-Person' ? 'Office Location Address' : 'Meeting Link'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={interviewDetails.type === 'In-Person' ? 'e.g. Room 202, Mirpur 1, Dhaka' : 'https://meet.google.com/xyz'}
                  value={interviewDetails.locationOrLink}
                  onChange={(e) => setInterviewDetails({ ...interviewDetails, locationOrLink: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInterviewModalOpen(false)}
                  disabled={isSendingSms}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-medium rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingSms}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-xl text-sm shadow-sm transition flex items-center justify-center gap-2"
                >
                  {isSendingSms ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending SMS...</span>
                    </>
                  ) : (
                    'Send Call SMS'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Update Confirmation Modal */}
      {statusModalData && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !isUpdatingStatus && setStatusModalData(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold ${
                statusModalData.status === 'SHORTLISTED'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-rose-100 text-rose-600'
              }`}
            >
              {statusModalData.status === 'SHORTLISTED' ? '✨' : '🚫'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Update Status to {statusModalData.status}?
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Are you sure you want to mark <span className="font-semibold text-slate-700">{statusModalData.applicantName || 'this candidate'}</span> as{' '}
                <span className="font-semibold">{statusModalData.status}</span>?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStatusModalData(null)}
                disabled={isUpdatingStatus}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-medium text-sm rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusUpdate}
                disabled={isUpdatingStatus}
                className={`flex-1 py-2.5 text-white font-medium text-sm rounded-xl transition shadow-sm disabled:opacity-50 ${
                  statusModalData.status === 'SHORTLISTED'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isUpdatingStatus ? 'Updating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {editingJob && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setEditingJob(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Edit Job Listing</h3>
              <button
                type="button"
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
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 bg-white"
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

      {/* Delete Confirmation Modal */}
      {deleteJobId && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !isDeleting && setDeleteJobId(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
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
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteJobId(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-medium text-sm rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDeleteJob}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowLogoutModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              🚪
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Confirm Logout</h3>
              <p className="text-sm text-slate-500 mt-1">Are you sure you want to log out of your employer account?</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
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