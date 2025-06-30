import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Users, User, LogOut, Menu, X, FileText } from 'lucide-react';

// Doctor dashboard sub-pages
import ViewAppointments from './dashboard/ViewAppointments';
import ManagePatients from './dashboard/ManagePatients';
import DoctorProfile from './dashboard/DoctorProfile';
import ViewPrescriptions from './dashboard/ViewPrescriptions';

const DoctorDashboard: React.FC = () => {
  const { user, signOut } = useAuth(); // Changed from logout to signOut
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(); // Changed from logout() to signOut()
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    // Redirect to login if not authenticated
    navigate('/doctor/login');
    return null;
  }

  const menuItems = [
    { path: '/doctor/dashboard', icon: <Calendar className="h-5 w-5" />, label: 'Appointments' },
    { path: '/doctor/dashboard/patients', icon: <Users className="h-5 w-5" />, label: 'Patients' },
    { path: '/doctor/dashboard/profile', icon: <User className="h-5 w-5" />, label: 'My Profile' },
    { path: '/doctor/dashboard/prescriptions', icon: <FileText className="h-5 w-5" />, label: 'My Prescriptions' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="bg-cyan-700 text-white md:hidden flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <span className="text-lg font-semibold">Doctor Dashboard</span>
        </div>
        <button 
          onClick={toggleSidebar}
          className="focus:outline-none"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Sidebar - Desktop: always visible, Mobile: toggleable */}
      <aside 
        className={`bg-cyan-800 text-white w-full md:w-64 md:min-h-screen md:flex md:flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="p-4 border-b border-cyan-700">
          <div className="flex items-center justify-center md:justify-start">
            <User className="h-10 w-10 bg-cyan-600 text-white p-2 rounded-full" />
            <div className="ml-3">
              <p className="font-semibold">{user.name}</p>
              <p className="text-cyan-200 text-sm">{user.email}</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6 px-4 flex-grow">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors duration-150 ${
                    location.pathname === item.path
                      ? 'bg-cyan-700 text-white'
                      : 'text-cyan-100 hover:bg-cyan-700 hover:text-white'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-cyan-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-cyan-100 hover:bg-cyan-700 hover:text-white rounded-md transition-colors duration-150"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-grow">
        <div className="p-6">
          <Routes>
            <Route index element={<ViewAppointments />} />
            <Route path="patients" element={<ManagePatients />} />
            <Route path="profile" element={<DoctorProfile />} />
            <Route path="prescriptions" element={<ViewPrescriptions />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;