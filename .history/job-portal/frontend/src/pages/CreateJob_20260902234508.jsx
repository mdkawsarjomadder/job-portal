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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:5000/api/jobs', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage('Job posted successfully!');

      // ২ সেকেন্ড নোটিফিকেশন দেখাবে, তারপর ড্যাশবোর্ডে রিডাইরেক্ট করবে
      setTimeout(() => {
        setMessage('');
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      setMessage(err.response?.data?.message || 'Error posting job');

      // এরর মেসেজটিও ২ সেকেন্ড পর মুছে যাবে
      setTimeout(() => {
        setMessage('');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Post a New Job</h2>
        
        {message && (
          <p className={`mb-4 text-center font-semibold ${
            message.includes('successfully') ? 'text-green-600' : 'text-red-500'
          }`}>
            {message}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Job Title</label>
          <input 
            type="text" 
            placeholder="e.g. Frontend Developer" 
            className="w-full p-2 border rounded focus:outline-blue-500 bg-white text-gray-800"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Category</label>
            <input 
              type="text" 
              placeholder="e.g. Software" 
              className="w-full p-2 border rounded focus:outline-blue-500 bg-white text-gray-800"
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Job Type</label>
            <select 
              className="w-full p-2 border rounded focus:outline-blue-500 bg-white text-gray-800"
              onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
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
              placeholder="e.g. Dhaka / Remote" 
              className="w-full p-2 border rounded focus:outline-blue-500 bg-white text-gray-800"
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Salary</label>
            <input 
              type="text" 
              placeholder="e.g. $50,000/year" 
              className="w-full p-2 border rounded focus:outline-blue-500 bg-white text-gray-800"
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              required 
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea 
            rows="4" 
            placeholder="Job requirements and details..." 
            className="w-full p-2 border rounded focus:outline-blue-500 bg-white text-gray-800"
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          ></textarea>
        </div>

        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition">
          Publish Job
        </button>
      </form>
    </div>
  );
}