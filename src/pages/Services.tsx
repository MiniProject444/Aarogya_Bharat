import React from 'react';
import { 
  Stethoscope, 
  Calendar, 
  Pill, 
  Ambulance, 
  FileText, 
  Activity,
  Clock,
  Video
} from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: <Calendar className="h-8 w-8 text-cyan-600" />,
      title: "Online Appointment Booking",
      description: "Book appointments with top doctors instantly through our platform. Choose your preferred time slot and doctor specialization."
    },
    {
      icon: <Video className="h-8 w-8 text-cyan-600" />,
      title: "Video Consultations",
      description: "Connect with doctors remotely through secure video calls. Get expert medical advice from the comfort of your home."
    },
    {
      icon: <Pill className="h-8 w-8 text-cyan-600" />,
      title: "E-Prescriptions",
      description: "Receive digital prescriptions and medical recommendations. Access your prescription history anytime, anywhere."
    },
    {
      icon: <Ambulance className="h-8 w-8 text-cyan-600" />,
      title: "Emergency Services",
      description: "24/7 emergency support with quick ambulance dispatch services. Get immediate medical attention when needed."
    },
    {
      icon: <FileText className="h-8 w-8 text-cyan-600" />,
      title: "Digital Health Records",
      description: "Maintain your complete medical history digitally. Access past prescriptions, reports, and doctor visits easily."
    },
    {
      icon: <Activity className="h-8 w-8 text-cyan-600" />,
      title: "Health Monitoring",
      description: "Track your health vitals and receive personalized health insights and recommendations."
    },
    {
      icon: <Stethoscope className="h-8 w-8 text-cyan-600" />,
      title: "Specialist Consultation",
      description: "Access to a wide network of specialist doctors across various medical fields and specializations."
    },
    {
      icon: <Clock className="h-8 w-8 text-cyan-600" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist you with any queries or concerns about our services."
    }
  ];

  const specialties = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
    "Dermatology",
    "Ophthalmology",
    "Dentistry",
    "Psychiatry",
    "Oncology"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive healthcare services designed to provide you with the best medical care and support.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
            <div className="mb-4">
              {service.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>

      {/* Specialties Section */}
      <div className="bg-cyan-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Medical Specialties</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {specialties.map((specialty, index) => (
            <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-cyan-600 font-medium">{specialty}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Choose Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Accessibility</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                Book appointments 24/7
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                User-friendly mobile interface
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                Quick emergency response
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Care</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                Verified healthcare providers
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                Personalized treatment plans
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                Regular follow-ups
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Security</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                Encrypted patient data
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                Secure payment gateway
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                Privacy compliance
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-cyan-700 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
          Join thousands of satisfied users who trust our healthcare services. Book your first appointment today!
        </p>
        <button className="bg-white text-cyan-700 px-8 py-3 rounded-md font-medium hover:bg-cyan-50 transition duration-150">
          Book an Appointment
        </button>
      </div>
    </div>
  );
};

export default Services;