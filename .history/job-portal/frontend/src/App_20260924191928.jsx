import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ApplicantDashboard from './pages/ApplicantDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import MyApplications from './pages/MyApplications';
import CreateJob from './pages/CreateJob';
import Home from './pages/Home';
import Profile from './pages/Profile';
import JobDetails from './pages/JobDetails';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './pages/Footer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/job/:jobId" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applicantdashboard" element={<ApplicantDashboard />} />
        <Route path="/employerdashboard" element={<EmployerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/create-job" element={<CreateJob />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/footer"  element={<Footer/>}/>
      </Routes>
    </Router>
  );
}

export default App;