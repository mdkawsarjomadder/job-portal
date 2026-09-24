import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    resumeUrl: '',
  });
  const [initialData, setInitialData] = useState({}); // 👈 ডাটা পরিবর্তন চেক করার জন্য
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/jobs/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = {
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        skills: res.data.skills || '',
        resumeUrl: res.data.resumeUrl || '',
      };
      setFormData(data);
      setInitialData(data); // 👈 অরিজিনাল ডাটা সেভ রাখা হলো
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // 🔴 ডাটা পরিবর্তন না হলে সেকেন্ড টাইম অ্যালার্ট দেখাবে
    const isUnchanged = JSON.stringify(formData) === JSON.stringify(initialData);
    if (isUnchanged) {
      setMessage({ type: 'info', text: 'Profile is already saved and up to date!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    setMessage({ type: '', text: '' });

    try {
      await axios.put('http://localhost:5000/api/jobs/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🟢 ফার্স্ট টাইম সফল আপডেট
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setInitialData(formData); // 👈 নতুন ডাটা সেভ হলো

      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile',
      });

      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500 font-medium">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-left relative">
      
      {/* 🔴 Top Floating Toast Alert */}
      {message.text && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div
            className={`px-6 py-3 rounded-2xl text-sm font-semibold shadow-xl border flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : message.type === 'info'
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-rose-600 text-white border-rose-500'
            }`}
          >
            <span>{message.type === 'success' ? '✅' : message.type === 'info' ? 'ℹ️' : '⚠️'}</span>
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        
        {/* 🟡 FIRST DIV: Header Section */}
        <div className="p-6 md:p-8 border-b border-slate-150 bg-slate-50/50 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Applicant Profile</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your personal details and resume details for job applications.
            </p>
          </div>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 w-9 h-9 rounded-full flex items-center justify-center transition text-lg font-bold shrink-0 ml-4"
            title="Close Profile"
          >
            ✕
          </button>
        </div>

        {/* 🔴 SECOND DIV: Form Section */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-purple-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+8801700000000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-purple-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Skills (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="JavaScript, React, Node.js, Tailwind CSS"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-purple-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Resume URL (Google Drive / Cloudinary Link)
              </label>
              <input
                type="url"
                placeholder="https://drive.google.com/your-resume-link"
                value={formData.resumeUrl}
                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-purple-600 focus:bg-white transition"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 font-semibold rounded-xl transition shadow-sm text-white ${
                  isSubmitting
                    ? 'bg-purple-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isSubmitting ? 'Updating Profile...' : 'Save'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}