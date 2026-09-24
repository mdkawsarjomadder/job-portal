import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  useEffect(() => {
    // Check logged in user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.clear();
      }
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [search, category, location, jobType]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/jobs', {
        params: { search, category, location, jobType },
      });

      if (Array.isArray(res.data)) {
        setJobs(res.data);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setJobs([]);
    } 
    finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setLocation('');
    setJobType('');
  };

  // 🎯 Smart Application Handler based on Auth State
  const handleApplyClick = (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate(`/job/${jobId}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-left pb-12">
      {/* Sticky Global Navbar */}
      <Navbar />

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-white py-16 px-4 sm:px-8 mb-8 relative overflow-hidden text-center shadow-inner">
        <div className="max-w-4xl mx-auto relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-purple-200 text-xs font-semibold rounded-full border border-white/15 backdrop-blur-sm">
            ✨ Explore verified career opportunities
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Find Your <span className="text-purple-300">Dream Job</span> Today
          </h1>
          <p className="text-purple-200/90 text-sm sm:text-base max-w-xl mx-auto">
            Explore thousands of job opportunities from top companies and kickstart your career now.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Search & Filter Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-800">Filter Opportunities</h2>
            {(search || category || location || jobType) && (
              <button
                onClick={handleClearFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition"
              >
                Clear All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Search job title or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-sm"
            />

            <input
              type="text"
              placeholder="Category (e.g., Software)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-sm"
            />

            <input
              type="text"
              placeholder="Location (e.g., Remote, Dhaka)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-sm"
            />

            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-sm text-slate-700 bg-white"
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        {/* Job Listings Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">
              Available Positions {jobs && jobs.length > 0 && <span className="text-purple-600">({jobs.length})</span>}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 font-medium">
              Loading available jobs...
            </div>
          ) : !jobs || jobs.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <p className="text-slate-700 font-semibold text-lg">No jobs found</p>
              <p className="text-slate-400 text-sm">
                Try adjusting your search criteria or clearing filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{job.title}</h3>
                        <p className="text-xs font-semibold text-purple-600 mt-0.5">
                          {job.employer?.name || 'Company'}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-100/80 shrink-0">
                        {job.jobType}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium">
                    <div className="flex flex-wrap gap-3">
                      <span>📍 {job.location}</span>
                      <span>💼 {job.category}</span>
                      {job.salary && <span>💰 {job.salary}</span>}
                    </div>

                    <button
                      onClick={() => handleApplyClick(job.id)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs rounded-xl transition shadow-sm"
                    >
                      Apply Now
                    </button>
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