import React from 'react';
import { Activity, Users, Shield, Clock } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Aarogya Bharat</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transforming healthcare accessibility in India through technology and innovation.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600">
            To make quality healthcare accessible to every Indian citizen through a seamless digital platform that connects patients with the best healthcare professionals.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
          <p className="text-gray-600">
            To become India's most trusted healthcare platform, revolutionizing the way healthcare services are accessed and delivered across the nation.
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-cyan-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Activity className="h-8 w-8 text-cyan-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Doctors</h3>
            <p className="text-gray-600">Access to verified and experienced healthcare professionals</p>
          </div>
          <div className="text-center">
            <div className="bg-cyan-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Clock className="h-8 w-8 text-cyan-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Service</h3>
            <p className="text-gray-600">Round-the-clock emergency support and assistance</p>
          </div>
          <div className="text-center">
            <div className="bg-cyan-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-cyan-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
            <p className="text-gray-600">Your health data is protected with top-tier security</p>
          </div>
          <div className="text-center">
            <div className="bg-cyan-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-cyan-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Large Network</h3>
            <p className="text-gray-600">Extensive network of healthcare providers across India</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-cyan-700 rounded-lg p-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">1000+</div>
            <div className="text-cyan-100">Doctors</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">50K+</div>
            <div className="text-cyan-100">Patients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">100K+</div>
            <div className="text-cyan-100">Appointments</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">20+</div>
            <div className="text-cyan-100">Cities</div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Dr. Rajesh Kumar",
              position: "Chief Executive Officer",
              image: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
              name: "Dr. Priya Sharma",
              position: "Chief Medical Officer",
              image: "https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
              name: "Amit Patel",
              position: "Chief Technology Officer",
              image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
            }
          ].map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-cyan-600">{member.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;