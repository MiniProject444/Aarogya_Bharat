import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cyan-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-cyan-300" />
              <span className="ml-2 text-xl font-bold">Aarogya Bharat</span>
            </div>
            <p className="text-cyan-200 text-sm">
              Empowering health services through technology. Connect with top doctors and manage your healthcare journey with ease.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-cyan-200 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-cyan-200 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-cyan-200 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-cyan-200 hover:text-white text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-cyan-200 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-cyan-200 hover:text-white text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-cyan-200 hover:text-white text-sm">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">For Patients</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/patient/login" className="text-cyan-200 hover:text-white text-sm">
                  Patient Login
                </Link>
              </li>
              <li>
                <Link to="/patient/signup" className="text-cyan-200 hover:text-white text-sm">
                  Register as Patient
                </Link>
              </li>
              <li>
                <Link to="/find-doctors" className="text-cyan-200 hover:text-white text-sm">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/health-tips" className="text-cyan-200 hover:text-white text-sm">
                  Health Tips
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-cyan-200 text-sm">
                <Phone className="h-4 w-4 mr-2" />
                <span>+91 12345 67890</span>
              </li>
              <li className="flex items-center text-cyan-200 text-sm">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@aarogyabharat.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-cyan-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-cyan-300">
            &copy; {new Date().getFullYear()} Aarogya Bharat. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/terms" className="text-sm text-cyan-300 hover:text-white">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-cyan-300 hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;