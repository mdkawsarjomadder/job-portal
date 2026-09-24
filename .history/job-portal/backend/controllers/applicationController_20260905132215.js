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
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-left">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-slate-150 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Applications</h1>
            <p className="text-sm text-slate-500 mt-1">
              Track the status of all jobs you have applied for.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 w-9 h-9 rounded-full flex items-center justify-center transition text-lg font-bold"
            title="Back to Dashboard"
          >
            ✕
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8">
          {error && (
            <div className="p-4 mb-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {applications.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg font-semibold text-slate-700">No applications found</p>
              <p className="text-sm mt-1">You haven't applied to any job circulars yet.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 border border-slate-200 rounded-xl bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition"
                >
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-slate-800">
                      {app.job?.title || 'Job Title Unavailable'}
                    </h2>

                    {/* Employer Info */}
                    {app.job?.employer && (
                      <p className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                        🏢 {app.job.employer.name} ({app.job.employer.email})
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      {app.job?.location && <span>📍 {app.job.location}</span>}
                      {app.job?.jobType && (
                        <>
                          <span>•</span>
                          <span>💼 {app.job.jobType}</span>
                        </>
                      )}
                      {app.job?.salary && (
                        <>
                          <span>•</span>
                          <span>💰 ${app.job.salary}</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 pt-1">
                      Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status || 'PENDING'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}