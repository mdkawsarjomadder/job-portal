import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'APPLICANT' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage('Registration Successful! Redirecting to login...');
      setTimeout(() => {
        setMessage('');
        navigate('/login');
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
      setTimeout(() => {
        setMessage('');
      }, 2000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Create Account</h2>
        {message && (
          <p className={`mb-4 text-sm text-center font-semibold ${
            message.includes('Successful') ? 'text-green-600' : 'text-red-500'
          }`}>
            {message}
          </p>
        )}
        
        <input 
          type="text" 
          placeholder="Full Name" 
          className="w-full mb-4 p-2.5 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-blue-500 text-sm"
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required 
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          className="w-full mb-4 p-2.5 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-blue-500 text-sm"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required 
        />
        <div className="relative mb-4">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-blue-500 pr-10 text-sm"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required 
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <select 
          className="w-full mb-6 p-2.5 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-blue-500 text-sm"
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        >
          <option value="APPLICANT">Job Seeker (Applicant)</option>
          <option value="EMPLOYER">Employer</option>
        </select>
        
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition duration-200">
          Register
        </button>
        <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}