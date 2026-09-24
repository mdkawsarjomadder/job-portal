import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  Users,
  Briefcase,
  FileText,
  CheckCircle2,
  Trash2,
  ShieldAlert,
  Search,
  UserCheck,
  Building,
  TrendingUp,
  ExternalLink,
  Crown
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, jobs, applications
  const [loading, setLoading] = useState(true);

  // Stats Data
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEmployers: 0,
    totalApplicants: 0,
    totalJobs: 0,
    totalApplications: 0,
    shortlistedCount: 0,
    recentUsers: [],
    recentJobs: [],
  });

  // Users Data
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');

  // Jobs Data
  const [jobs, setJobs] = useState([]);
  const [jobSearch, setJobSearch] = useState('');

  // Applications Data
  const [applications, setApplications] = useState([]);

  // Modals & Actions
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', id: '', name: '' });
  const [roleModal, setRoleModal] = useState({ open: false, userId: '', currentRole: '', userName: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }

    fetchStats();
    fetchUsers();
    fetchJobs();
    fetchApplications();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats', getHeaders());
      setStats(res.data);
    } catch (err) {
      console.error('Fetch Stats Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        ...getHeaders(),
        params: { search: userSearch, role: userRoleFilter },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Fetch Users Error:', err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/jobs', {
        ...getHeaders(),
        params: { search: jobSearch },
      });
      setJobs(res.data);
    } catch (err) {
      console.error('Fetch Jobs Error:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/applications', getHeaders());
      setApplications(res.data);
    } catch (err) {
      console.error('Fetch Applications Error:', err);
    }
  };

  // Re-fetch users on filter change
  useEffect(() => {
    fetchUsers();
  }, [userRoleFilter, userSearch]);

  // Re-fetch jobs on search change
  useEffect(() => {
    fetchJobs();
  }, [jobSearch]);

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    const { type, id } = deleteModal;
    try {
      if (type === 'user') {
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`, getHeaders());
        showToast('User and associated data deleted successfully');
        fetchUsers();
        fetchStats();
      } else if (type === 'job') {
        await axios.delete(`http://localhost:5000/api/admin/jobs/${id}`, getHeaders());
        showToast('Job listing removed successfully');
        fetchJobs();
        fetchStats();
      }
      setDeleteModal({ open: false, type: '', id: '', name: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete operation failed', 'error');
    }
  };

  // Change user role handler
  const handleRoleChangeSubmit = async (newRole) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/users/${roleModal.userId}/role`,
        { role: newRole },
        getHeaders()
      );
      showToast(`User role updated to ${newRole}`);
      setRoleModal({ open: false, userId: '', currentRole: '', userName: '' });
      fetchUsers();
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update role', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">
        Loading Super Admin Control Center...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16 text-left">
      {/* Navbar */}
      <Navbar />

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div
            className={`px-5 py-3 rounded-2xl shadow-xl text-white text-xs sm:text-sm font-bold flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
            }`}
          >
            <span>{toast.type === 'success' ? '✓' : '✕'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Admin Hero Header */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-purple-950 text-white py-10 px-4 sm:px-8 mb-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-amber-300 border border-white/20 shadow-inner">
              <Crown size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">Super Admin Control Center</h1>
                <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase rounded-full border border-amber-300/30">
                  Full Access
                </span>
              </div>
              <p className="text-xs text-purple-200/90 mt-0.5">
                Oversee platform metrics, manage employers, candidates, and job circulars.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs font-semibold px-3 py-1 bg-white/10 rounded-xl border border-white/15 text-purple-200">
              ⚡ Platform Live
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Metric Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">{stats.totalUsers}</p>
              <p className="text-[11px] text-purple-600 font-semibold mt-1">
                {stats.totalEmployers} Employers • {stats.totalApplicants} Seekers
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Posted Jobs</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">{stats.totalJobs}</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                Active Circulars Listed
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Applications</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">{stats.totalApplications}</p>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">
                CVs Submitted
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Shortlisted</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">{stats.shortlistedCount}</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                Candidate Approvals
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={22} />
            </div>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-4 sm:px-6 rounded-2xl shadow-sm gap-2 sm:gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            📊 Analytics & Overview
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            👥 Manage Users ({stats.totalUsers})
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-4 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            💼 Manage Jobs ({stats.totalJobs})
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`py-4 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === 'applications'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            📋 Applications Feed ({stats.totalApplications})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Jobs */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Briefcase size={18} className="text-purple-600" />
                  Latest Posted Jobs
                </h3>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="text-xs font-semibold text-purple-600 hover:underline"
                >
                  View All →
                </button>
              </div>

              {stats.recentJobs.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No jobs created yet.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {stats.recentJobs.map((j) => (
                    <div key={j.id} className="py-3 flex justify-between items-center gap-2">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{j.title}</p>
                        <p className="text-xs text-slate-500">{j.employer?.name} • {j.location}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold">
                        {j._count?.applications || 0} applicants
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Users */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Users size={18} className="text-indigo-600" />
                  Latest Registered Users
                </h3>
                <button
                  onClick={() => setActiveTab('users')}
                  className="text-xs font-semibold text-purple-600 hover:underline"
                >
                  View All →
                </button>
              </div>

              {stats.recentUsers.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No users found.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {stats.recentUsers.map((u) => (
                    <div key={u.id} className="py-3 flex justify-between items-center gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'ADMIN'
                            ? 'bg-amber-100 text-amber-800'
                            : u.role === 'EMPLOYER'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: MANAGE USERS */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-6">
            
            {/* Filters Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-600 bg-slate-50"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-500">Filter Role:</span>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium bg-white focus:outline-none focus:border-purple-600"
                >
                  <option value="ALL">All Roles</option>
                  <option value="APPLICANT">Applicants</option>
                  <option value="EMPLOYER">Employers</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Activity</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">
                        No matching users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          <div>
                            <p className="font-bold text-slate-800">{u.name}</p>
                            <p className="text-xs text-slate-400 font-normal">{u.email}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              u.role === 'ADMIN'
                                ? 'bg-amber-100 text-amber-800'
                                : u.role === 'EMPLOYER'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 text-xs">
                          {u.role === 'EMPLOYER' ? `${u._count?.jobs || 0} jobs posted` : `${u._count?.applications || 0} applied`}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-xs">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setRoleModal({ open: true, userId: u.id, currentRole: u.role, userName: u.name })}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                            >
                              Change Role
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteModal({ open: true, type: 'user', id: u.id, name: u.name })}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: MANAGE JOBS */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-6">
            
            {/* Search Header */}
            <div className="flex justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by job title or location..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-600 bg-slate-50"
                />
              </div>
            </div>

            {/* Jobs Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold">
                    <th className="py-3 px-4">Job Title</th>
                    <th className="py-3 px-4">Employer / Company</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Applicants</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                        No jobs found.
                      </td>
                    </tr>
                  ) : (
                    jobs.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {j.title}
                          <span className="block text-xs font-normal text-slate-400">{j.jobType}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          <p className="font-semibold">{j.employer?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-400">{j.employer?.email}</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{j.location}</td>
                        <td className="py-3.5 px-4 text-slate-600">{j.category}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 font-bold text-xs rounded-full">
                            {j._count?.applications || 0}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setDeleteModal({ open: true, type: 'job', id: j.id, name: j.title })}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs rounded-lg transition"
                          >
                            Delete Spam Job
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 4: ALL APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Global Applications Overview</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Applied For Job</th>
                    <th className="py-3 px-4">Employer</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Interview Schedule</th>
                    <th className="py-3 px-4 text-right">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                        No applications in the system yet.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {app.applicant?.name || 'Candidate'}
                          <p className="text-xs font-normal text-slate-400">{app.applicant?.email}</p>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {app.job?.title || 'Job Title'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {app.job?.employer?.name || 'Company'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              app.status === 'SHORTLISTED'
                                ? 'bg-emerald-100 text-emerald-700'
                                : app.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          {app.interviewDate ? (
                            <span className="font-semibold text-purple-700">
                              📅 {app.interviewDate} {app.interviewTime}
                            </span>
                          ) : (
                            <span className="text-slate-400">Not Scheduled</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {app.resumeUrl ? (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold rounded-lg transition"
                            >
                              View PDF
                            </a>
                          ) : (
                            <span className="text-slate-400 text-xs">None</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Delete {deleteModal.type === 'user' ? 'User Account' : 'Job Listing'}?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <span className="font-bold text-slate-700">{deleteModal.name}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ open: false, type: '', id: '', name: '' })}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {roleModal.open && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <h3 className="text-lg font-bold text-slate-800">Change User Role</h3>
            <p className="text-xs text-slate-500">
              Select new role for <span className="font-bold text-slate-700">{roleModal.userName}</span>:
            </p>

            <div className="space-y-2 pt-2 text-xs font-bold">
              {['APPLICANT', 'EMPLOYER', 'ADMIN'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChangeSubmit(r)}
                  className={`w-full py-2.5 rounded-xl border transition ${
                    roleModal.currentRole === r
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {r === 'ADMIN' ? '👑 ' : ''}{r} {roleModal.currentRole === r ? '(Current)' : ''}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setRoleModal({ open: false, userId: '', currentRole: '', userName: '' })}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
