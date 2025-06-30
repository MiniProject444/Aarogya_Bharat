import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, UserPlus, ClipboardCheck, Clock, Shield } from 'lucide-react';

const Homepage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-700 to-cyan-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Book Medical Appointments with Top Doctors
              </h1>
              <p className="text-cyan-100 text-lg mb-8 max-w-lg">
                Aarogya Bharat connects you with the best healthcare professionals. Book appointments, view medical records, and manage your health, all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/patient/login')}
                  className="bg-white text-cyan-700 hover:bg-cyan-50 px-6 py-3 rounded-full font-medium shadow-lg transition duration-150 ease-in-out transform hover:scale-105"
                >
                  Book an Appointment
                </button>
                <button
                  onClick={() => navigate('/doctor/login')}
                  className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-cyan-700 px-6 py-3 rounded-full font-medium transition duration-150 ease-in-out"
                >
                  Doctor Login
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Doctor with patient" 
                className="w-full max-w-md rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Aarogya Bharat Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides a seamless experience for managing your healthcare needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-cyan-50 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300 ease-in-out">
              <div className="bg-cyan-100 inline-block p-3 rounded-full text-cyan-700 mb-4">
                <UserPlus className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Account</h3>
              <p className="text-gray-600">Sign up as a patient to access all healthcare services or as a doctor to manage patients.</p>
            </div>
            
            <div className="bg-cyan-50 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300 ease-in-out">
              <div className="bg-cyan-100 inline-block p-3 rounded-full text-cyan-700 mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Appointment</h3>
              <p className="text-gray-600">Search for doctors by specialty or name and book appointments with just a few clicks.</p>
            </div>
            
            <div className="bg-cyan-50 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300 ease-in-out">
              <div className="bg-cyan-100 inline-block p-3 rounded-full text-cyan-700 mb-4">
                <ClipboardCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Manage Health</h3>
              <p className="text-gray-600">Access your medical records, prescriptions, and appointment history anytime, anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-12 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-red-600 text-white p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Emergency Services</h2>
                <p className="mb-6 text-red-100">
                  Need immediate medical attention? Our emergency services ensure you get help as quickly as possible.
                </p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-start">
                    <Clock className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>24/7 ambulance availability</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>Trained medical professionals</span>
                  </li>
                </ul>
                <button 
                  onClick={() => navigate('/')}
                  className="bg-white text-red-600 hover:bg-red-50 px-6 py-3 rounded-md font-medium shadow-md transition duration-150 ease-in-out"
                >
                  Call Emergency
                </button>
              </div>
              <div className="md:w-1/2 p-8 md:p-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Emergency Response</h3>
                <p className="text-gray-600 mb-6">
                  Aarogya Bharat's emergency services connect you with nearby hospitals and ambulance services in critical situations.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-red-100 h-10 w-10 rounded-full flex items-center justify-center text-red-600 font-bold">1</div>
                    <span className="ml-4 text-gray-700">Request emergency assistance through our platform</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-red-100 h-10 w-10 rounded-full flex items-center justify-center text-red-600 font-bold">2</div>
                    <span className="ml-4 text-gray-700">Provide location and basic patient information</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-red-100 h-10 w-10 rounded-full flex items-center justify-center text-red-600 font-bold">3</div>
                    <span className="ml-4 text-gray-700">Ambulance dispatched to your location immediately</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Specialist Doctors</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Consult with top healthcare professionals across various specialties.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Doctor cards would be dynamically generated in a real app */}
            {[
              {
                name: "Dr. Aditya Sharma",
                specialty: "Cardiology",
                image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400"
              },
              {
                name: "Dr. Priya Patel",
                specialty: "Neurology",
                image: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400"
              },
              {
                name: "Dr. Raj Kumar",
                specialty: "Orthopedics",
                image: "https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=400"
              },
              {
                name: "Dr. Sneha Gupta",
                specialty: "Pediatrics",
                image: "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400"
              }
            ].map((doctor, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900">{doctor.name}</h3>
                  <p className="text-cyan-600 mb-4">{doctor.specialty}</p>
                  <button 
                    onClick={() => navigate('/patient/login')}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-md transition duration-150 ease-in-out"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button 
              onClick={() => navigate('/patient/login')}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-md font-medium transition duration-150 ease-in-out"
            >
              View All Doctors
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from patients who have used Aarogya Bharat for their healthcare needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Ananya Singh",
                text: "Booking appointments with Aarogya Bharat has made managing my family's healthcare so much easier. The interface is intuitive and I love getting reminders for upcoming appointments."
              },
              {
                name: "Vikram Mehta",
                text: "As someone with a chronic condition, I need regular check-ups. This platform has simplified the process and helps me keep track of all my prescriptions and medical history in one place."
              },
              {
                name: "Sunita Kapoor",
                text: "The emergency service was a lifesaver when my father had a heart attack. An ambulance was dispatched within minutes of making the request. Truly grateful for this service."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex-1">
                  <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
                  <p className="font-medium text-gray-900">{testimonial.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-cyan-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to manage your healthcare?</h2>
          <p className="text-cyan-100 max-w-2xl mx-auto mb-8">
            Join thousands of users who trust Aarogya Bharat for their healthcare needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/patient/signup')}
              className="bg-white text-cyan-700 hover:bg-cyan-50 px-6 py-3 rounded-full font-medium shadow-lg transition duration-150 ease-in-out"
            >
              Sign Up as Patient
            </button>
            <button
              onClick={() => navigate('/doctor/signup')}
              className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-cyan-700 px-6 py-3 rounded-full font-medium transition duration-150 ease-in-out"
            >
              Join as Doctor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;