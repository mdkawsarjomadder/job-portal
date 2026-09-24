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
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6 text-left">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Post a New Job</h2>
        
        {message && (
          <p className={`mb-4 text-center font-semibold p-2 rounded ${
            message.toLowerCase().includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
          }`}>
            {message}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Job Title</label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            placeholder="e.g. Frontend Developer" 
            className="w-full p-2 border rounded focus:outline-purple-500 bg-white text-gray-800"
            onChange={handleChange}
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Category</label>
            <input 
              type="text" 
              name="category"
              value={formData.category}
              placeholder="e.g. Software" 
              className="w-full p-2 border rounded focus:outline-purple-500 bg-white text-gray-800"
              onChange={handleChange}
              required 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Job Type</label>
            <select 
              name="jobType"
              value={formData.jobType}
              className="w-full p-2 border rounded focus:outline-purple-500 bg-white text-gray-800"
              onChange={handleChange}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Remote">Remote</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Location</label>
            <input 
              type="text" 
              name="location"
              value={formData.location}
              placeholder="e.g. Dhaka / Remote" 
              className="w-full p-2 border rounded focus:outline-purple-500 bg-white text-gray-800"
              onChange={handleChange}
              required 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Salary</label>
            <input 
              type="text" 
              name="salary"
              value={formData.salary}
              placeholder="e.g. $50,000/year" 
              className="w-full p-2 border rounded focus:outline-purple-500 bg-white text-gray-800"
              onChange={handleChange}
              required 
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea 
            rows="4" 
            name="description"
            value={formData.description}
            placeholder="Job requirements and details..." 
            className="w-full p-2 border rounded focus:outline-purple-500 bg-white text-gray-800"
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish Job'}
        </button>
      </form>
    </div>
  );
}