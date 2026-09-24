import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/jobs/my-applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load your applications.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'SHORTLISTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 text-lg font-medium">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-left">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden relative">
        
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 relative pr-16">
          <h1 className="text-3xl font-bold text-slate-800">My Applications</h1>
          <p className="text-base text-slate-500 mt-1.5">
            Track the status of all jobs you have applied for.
          </p>

          {/* Top Right Close (X) Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 w-10 h-10 rounded-full flex items-center justify-center transition text-xl font-bold"
            title="Back to Dashboard"
          >
            ✕
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8">
          {error && (
            <div className="p-4 mb-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-base font-medium">
              {error}
            </div>
          )}

          {applications.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-xl font-semibold text-slate-700">No applications found</p>
              <p className="text-base mt-1">You haven't applied to any job circulars yet.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-5 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-base font-semibold rounded-xl transition shadow-sm"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-6 border border-slate-200/80 rounded-2xl bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200"
                >
                  {/* Top Bar: Title & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">
                        {app.job?.title || 'Job Title Unavailable'}
                      </h2>
                      {app.job?.employer && (
                        <p className="text-base font-medium text-purple-600 mt-1">
                          🏢 {app.job.employer.name} <span className="text-slate-400 font-normal">({app.job.employer.email})</span>
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border self-start sm:self-center uppercase tracking-wider ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      ● {app.status || 'PENDING'}
                    </span>
                  </div>

                  {/* Information Grid with Larger Text */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-base text-slate-600 mb-6">
                    {app.job?.location && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">📍 Location:</span>
                        <span className="font-semibold text-slate-700">{app.job.location}</span>
                      </div>
                    )}
                    {app.job?.jobType && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">💼 Schedule:</span>
                        <span className="font-semibold text-slate-700">{app.job.jobType}</span>
                      </div>
                    )}
                    {app.job?.salary && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">💰 Salary:</span>
                        <span className="font-semibold text-slate-700">${Number(app.job.salary).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">📅 Applied On:</span>
                      <span className="font-semibold text-slate-700">{new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Bottom Bar: Action Button */}
                  {app.resumeUrl && (
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-sm text-slate-500 font-medium">Submitted Documents</span>
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-200 text-sm font-semibold rounded-xl transition"
                      >
                        📄 View Resume
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}