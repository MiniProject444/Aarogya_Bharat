import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, ChevronDown, Activity } from 'lucide-react';

interface NavbarProps {
  onEmergencyClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onEmergencyClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Activity className="h-8 w-8 text-cyan-700" />
              <span className="ml-2 text-xl font-bold text-cyan-800">Aarogya Bharat</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/find-doctors" className="text-gray-600 hover:text-cyan-700 px-3 py-2 rounded-md text-sm font-medium">
              Find Doctors
            </Link>
            <Link to="/health-tips" className="text-gray-600 hover:text-cyan-700 px-3 py-2 rounded-md text-sm font-medium">
              Health Tips
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-cyan-700 px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link to="/services" className="text-gray-600 hover:text-cyan-700 px-3 py-2 rounded-md text-sm font-medium">
              Services
            </Link>
            <Link to="/help" className="text-gray-600 hover:text-cyan-700 px-3 py-2 rounded-md text-sm font-medium">
              Help
            </Link>
            
            <button
              onClick={onEmergencyClick}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
            >
              Emergency
            </button>
            
            {user ? (
              <div className="relative ml-3">
                <div>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    <span className="mr-2">{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link 
                      to={`/${user.role}/dashboard`} 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center px-4 py-2 border border-cyan-600 text-cyan-600 rounded-md hover:bg-cyan-50 transition duration-150 ease-in-out"
                >
                  <span>Get Started</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link to="/patient/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Patient Signup
                    </Link>
                    <Link to="/doctor/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Doctor Signup
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-cyan-700 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/find-doctors" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              Find Doctors
            </Link>
            <Link to="/health-tips" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              Health Tips
            </Link>
            <Link to="/about" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              About
            </Link>
            <Link to="/services" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              Services
            </Link>
            <Link to="/help" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              Help
            </Link>
            <button
              onClick={onEmergencyClick}
              className="w-full text-left block px-3 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Emergency
            </button>
            
            {user ? (
              <>
                <Link to={`/${user.role}/dashboard`} className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/patient/signup" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  Patient Signup
                </Link>
                <Link to="/doctor/signup" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  Doctor Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;