import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateJob from './pages/CreateJob'; // <--- Import করুন

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-job" element={<CreateJob />} /> {/* <--- Route যোগ করুন */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;