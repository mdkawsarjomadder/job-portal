import { useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Eye, EyeOff} from 'lucide-react';;


export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'APPLICANT' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage('Registration Successful! Please Login.');
      setTimeout(() =>{
        setMessage('');
      },2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
      setTimeout(() =>{
        setMessage('');
      },2000);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Create Account</h2>
        {message && <p className="mb-4 text-sm text-center text-blue-500 font-semibold">{message}</p>}
        
        <input 
          type="text" 
          placeholder="Full Name" 
          className="w-full mb-4 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:outline-blue-500"
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required 
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          className="w-full mb-4 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:outline-blue-500"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full mb-4 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:outline-blue-500"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required 
        />
        <select 
          className="w-full mb-6 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:outline-blue-500"
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