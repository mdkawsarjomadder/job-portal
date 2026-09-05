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
  const [initialData, setInitialData] = useState({});
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
      setInitialData(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

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

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setInitialData(formData);

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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-left relative flex justify-center items-center">
      
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
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
        
        {/* 🟣 Header Section: Gradient Background & Centered Title */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-white p-6 md:p-8 text-center relative">
          <button
            onClick={() => navigate('/dashboard')}
            className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition text-base font-bold"
            title="Close Profile"
          >
            ✕
          </button>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Applicant Profile</h1>
          <p className="text-xs sm:text-sm text-purple-200/90 mt-1.5 max-w-md mx-auto">
            Manage your personal details and resume details for job applications.
          </p>
        </div>

        {/* ⚪ Form Section */}
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

            {/* Action Buttons: Cancel on Left, Save on Right */}
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-2.5 font-semibold rounded-xl transition shadow-md text-white ${
                  isSubmitting
                    ? 'bg-purple-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}