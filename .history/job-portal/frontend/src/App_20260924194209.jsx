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
import AboutTitle from './pages/AboutTitle';
import Footer from './pages/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Main Content Area */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<AboutTitle />} />
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
            
            {/* Catch-all Wildcard Route for 404 / Unknown Paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Sticky Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;