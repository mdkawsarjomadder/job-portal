import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateJob() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    salary: '',
    jobType: 'Full-time'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('You must be logged in to post a job.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/jobs', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage(res.data?.message || 'Job posted successfully!');

      setTimeout(() => {
        setMessage('');
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Create Job Error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Error posting job');

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-4 md:p-6 text-left font-sans">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100">
        
        {/* Gradient Header Box */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-800 to-purple-900 text-white p-6 text-center">
          <h2 className="text-2xl font-bold">Post a New Job</h2>
          <p className="text-xs text-purple-200 mt-1">Fill out the form below to create a new career opportunity</p>
        </div>

        <div className="p-6 md:p-8 space-y-4">
          {message && (
            <p className={`p-3 rounded-xl text-sm font-semibold text-center ${
              message.toLowerCase().includes('success') 
                ? 'bg-emerald-100/80 text-emerald-700 border border-emerald-200' 
                : 'bg-rose-100/80 text-rose-700 border border-rose-200'
            }`}>
              {message}
            </p>
          )}

          <div>
            <label className="block text-slate-700 font-semibold text-sm mb-1">Job Title</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              placeholder="e.g. Frontend Developer" 
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 bg-white text-slate-800 text-sm"
              onChange={handleChange}
              required 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold text-sm mb-1">Category</label>
              <input 
                type="text" 
                name="category"
                value={formData.category}
                placeholder="e.g. Software" 
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 bg-white text-slate-800 text-sm"
                onChange={handleChange}
                required 
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold text-sm mb-1">Job Type</label>
              <select 
                name="jobType"
                value={formData.jobType}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 bg-white text-slate-800 text-sm"
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold text-sm mb-1">Location</label>
              <input 
                type="text" 
                name="location"
                value={formData.location}
                placeholder="e.g. Dhaka / Remote" 
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 bg-white text-slate-800 text-sm"
                onChange={handleChange}
                required 
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold text-sm mb-1">Salary</label>
              <input 
                type="text" 
                name="salary"
                value={formData.salary}
                placeholder="e.g. $50,000/year" 
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 bg-white text-slate-800 text-sm"
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold text-sm mb-1">Description</label>
            <textarea 
              rows="4" 
              name="description"
              value={formData.description}
              placeholder="Job requirements and details..." 
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 bg-white text-slate-800 text-sm"
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Action Buttons: Cancel on Left, Submit on Right */}
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2.5 rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Job'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}