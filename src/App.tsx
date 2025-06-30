import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Homepage from './pages/Homepage';
import PatientLogin from './pages/patient/PatientLogin';
import PatientSignup from './pages/patient/PatientSignup';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorLogin from './pages/doctor/DoctorLogin';
import DoctorSignup from './pages/doctor/DoctorSignup';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import FindDoctors from './pages/FindDoctors';
import HealthTips from './pages/HealthTips';
import About from './pages/About';
import Help from './pages/Help';
import Services from './pages/Services';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Homepage />} />
            <Route path="patient/login" element={<PatientLogin />} />
            <Route path="patient/signup" element={<PatientSignup />} />
            <Route path="patient/dashboard/*" element={<PatientDashboard />} />
            <Route path="doctor/login" element={<DoctorLogin />} />
            <Route path="doctor/signup" element={<DoctorSignup />} />
            <Route path="doctor/dashboard/*" element={<DoctorDashboard />} />
            <Route path="find-doctors" element={<FindDoctors />} />
            <Route path="health-tips" element={<HealthTips />} />
            <Route path="about" element={<About />} />
            <Route path="help" element={<Help />} />
            <Route path="services" element={<Services />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;