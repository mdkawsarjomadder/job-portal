import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ApplicantDashboard from './pages/ApplicantDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import MyApplications from './pages/MyApplications';
import CreateJob from './pages/CreateJob';
import Home from './pages/Home';
import Profile from './pages/Profile';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/dashboard" element={<ApplicantDashboard />} />
        <Route path="/employerdashboard" element={<EmployerDashboard />} />
        <Route path="/create-job" element={<CreateJob />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;