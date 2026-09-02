import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');  
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData); 
      
      // লোকাল স্টোরেজে টোকেন ও ইউজার অবজেক্ট সেভ করা
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setMessage('Login Successful!');

      setTimeout(() => {
        setMessage('');
        navigate('/dashboard'); 
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid credentials');
      setTimeout(() => setMessage(''), 2000);
    }
  };  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">       
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login to Account</h2>
        {message && (
          <p className={`mb-4 text-sm text-center font-semibold ${
            message === 'Login Successful!' ? 'text-green-600' : 'text-red-500'
          }`}>
            {message}
          </p>
        )}
        
        <input 
          type="email" 
          placeholder="Email Address" 
          className="w-full mb-4 p-2 border border-gray-300 rounded bg-white text-gray-800 focus:outline-blue-500"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required 
        />

        <div className="relative mb-6">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:outline-blue-500 pr-10"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required 
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition duration-200">
          Login
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
}