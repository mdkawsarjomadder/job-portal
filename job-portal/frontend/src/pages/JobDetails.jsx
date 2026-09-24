import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Application Modal States
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.phone) setPhone(parsed.phone);
      } catch (e) {
        localStorage.clear();
      }
    }
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
      setJob(res.data);
    } catch (err) {
      console.error('Error fetching job details:', err);
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setFeedback({ type: 'error', message: 'Please upload a PDF resume file.' });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setFeedback({ type: '', message: '' });

    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('resume', resumeFile);
    if (phone) formData.append('phone', phone);

    try {
      const res = await axios.post('http://localhost:5000/api/jobs/apply', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setFeedback({ type: 'success', message: res.data?.message || 'Applied successfully!' });
      setTimeout(() => {
        setIsApplyModalOpen(false);
        navigate('/my-applications');
      }, 1500);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to submit application.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">
        Loading job details...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Job Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">
          The job listing you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl transition"
        >
          Back to All Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Sticky Global Navbar */}
      <Navbar />

      {/* Sub-Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-white py-8 px-4 sm:px-8 mb-8 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="text-white/80 hover:text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition"
          >
            ← Back to All Jobs
          </Link>
          <span className="text-xs text-purple-200/90 font-medium hidden sm:inline">
            Job Details & Application
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Top Title & Employer info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">{job.title}</h1>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-100">
                  {job.jobType}
                </span>
              </div>
              <p className="text-sm font-semibold text-purple-600 mt-1">
                Posted by: {job.employer?.name || 'Company'}
              </p>
            </div>

            {user?.role === 'EMPLOYER' ? (
              <span className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl">
                Viewing as Employer
              </span>
            ) : user ? (
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition shadow-md"
              >
                Apply for this Job
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition shadow-md"
              >
                Login to Apply
              </button>
            )}
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50/70 rounded-xl border border-slate-100 text-sm">
            <div>
              <p className="text-xs text-slate-400 font-medium">Category</p>
              <p className="font-semibold text-slate-700 mt-0.5">{job.category}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Location</p>
              <p className="font-semibold text-slate-700 mt-0.5">{job.location}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Salary</p>
              <p className="font-semibold text-slate-700 mt-0.5">{job.salary || 'Negotiable'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Posted Date</p>
              <p className="font-semibold text-slate-700 mt-0.5">
                {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 pt-2">
            <h2 className="text-lg font-bold text-slate-800">Job Description</h2>
            <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-white">
              {job.description}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition"
            >
              ← Back to Listings
            </Link>

            {user?.role !== 'EMPLOYER' && (
              <button
                type="button"
                onClick={() => (user ? setIsApplyModalOpen(true) : navigate('/login'))}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition shadow-sm"
              >
                {user ? 'Apply Now' : 'Login to Apply'}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-800">
                Apply for <span className="text-purple-600">{job.title}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {feedback.message && (
              <div
                className={`p-3 rounded-xl text-sm font-semibold ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Upload Resume (PDF format) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 border border-slate-200 bg-slate-50 rounded-xl p-2 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +8801700000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
