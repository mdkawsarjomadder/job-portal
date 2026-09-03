import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ApplicantDashboard from './pages/ApplicantDashboard';
import EmployerDashboard from './pages/EmployerDashboard'; // ১. ইম্পোর্ট নিশ্চিত করুন
import CreateJob from './pages/CreateJob';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ApplicantDashboard />} />
        
        {/* ২. সঠিকভাবে রুট মাউন্ট করুন */}
        <Route path="/employerdashboard" element={<EmployerDashboard />} />
        <Route path="/create-job" element={<CreateJob />} />
        
        {/* ডিফল্ট রুট */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;