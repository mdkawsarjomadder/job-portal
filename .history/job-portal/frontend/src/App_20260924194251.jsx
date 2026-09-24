import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import Navbar from './components/Navbar';
import Footer from './pages/Footer';

// Layout Wrapper Component
const Layout = ({ children }) => {
  const location = useLocation();

  // যেসব রাউটে Main Navbar & Footer দেখাতে চান না
  const hideNavbarFooterRoutes = [
    '/dashboard',
    '/applicantdashboard',
    '/employerdashboard',
    '/admin',
    '/admindashboard',
    '/create-job'
  ];

  const shouldHide = hideNavbarFooterRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dashboard রাউটগুলোতে Main Navbar লুকাবে */}
      {!shouldHide && <Navbar />}

      <main className="flex-grow">{children}</main>

      {/* Dashboard রাউটগুলোতে Main Footer লুকাবে */}
      {!shouldHide && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutTitle />} />
          <Route path="/job/:jobId" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-applications" element={<MyApplications />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applicantdashboard" element={<ApplicantDashboard />} />
          <Route path="/employerdashboard" element={<EmployerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/create-job" element={<CreateJob />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;