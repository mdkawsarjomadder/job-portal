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
    avatar: '',
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState('');
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
        avatar: res.data.avatar || '',
      };
      setFormData(data);
      setInitialData(data);
      setPreviewAvatar(res.data.avatar || '');
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Profile Image Selection & Preview Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Check if form or image has changed
    const isUnchanged = JSON.stringify(formData) === JSON.stringify(initialData) && !avatarFile;
    if (isUnchanged) {
      setMessage({ type: 'info', text: 'Profile is already saved and up to date!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    setMessage({ type: '', text: '' });

    // FormData used for sending both Text and File payload
    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    data.append('skills', formData.skills);
    data.append('resumeUrl', formData.resumeUrl);
    if (avatarFile) {
      data.append('avatar', avatarFile);
    }

    try {
      const res = await axios.put('http://localhost:5000/api/jobs/profile', data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedAvatar = res.data.user?.avatar || res.data.avatar || formData.avatar;

      // 🔄 localStorage আপডেট করে ড্যাশবোর্ডে নতুন নাম ও ছবি পাঠানো
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { 
        ...storedUser, 
        name: formData.name, 
        avatar: updatedAvatar 
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setInitialData({ ...formData, avatar: updatedAvatar });
      setAvatarFile(null);

      setTimeout(() => {
        setMessage({ type: '', text: '' });
        navigate('/dashboard');
      }, 1500);
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
      
      {/* Toast Alert */}
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
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden my-6">
        
        {/* Header */}
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
            Manage your personal details and upload profile picture.
          </p>
        </div>

        {/* Form */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center justify-center gap-3 pb-2">
              <div className="relative w-24 h-24 rounded-full bg-purple-100 border-2 border-purple-600 flex items-center justify-center overflow-hidden shadow-md group">
                {previewAvatar ? (
                  <img src={previewAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-extrabold text-purple-700">
                    {formData.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>

              <label className="cursor-pointer bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-xs px-4 py-2 rounded-xl border border-purple-200 transition flex items-center gap-1.5">
                📷 Change Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
              </label>
            </div>

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
              <label className="block font-semibold text-slate-700 mb-1">Skills (Comma Separated)</label>
              <input
                type="text"
                placeholder="JavaScript, React, Node.js, Tailwind CSS"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-purple-600 focus:bg-white transition"
              />
            </div>


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
                  isSubmitting ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
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