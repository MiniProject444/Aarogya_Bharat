import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { User, Mail, Phone, Award, MapPin, Clock, Save } from 'lucide-react';

const DoctorProfile: React.FC = () => {
  const { user } = useAuth();
  
  // This would normally come from the user context, but we'll mock it for now
  const [profile, setProfile] = useState({
    name: user?.name || 'Dr. Sarah Smith',
    email: user?.email || 'doctor@example.com',
    phone: '+91 98765 43210',
    specialty: 'Cardiology',
    experience: '15',
    qualifications: 'MBBS, MD (Cardiology), DM (Cardiology)',
    registrationNumber: 'MCI-12345',
    address: '123 Medical Center, Healthcare Street, Mumbai, India',
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00' },
    ]
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAvailabilityChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to update the user profile
    setProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        )}
      </div>
      
      {saveSuccess && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Profile updated successfully!
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-700 px-6 py-12 text-white">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-white text-cyan-600 flex items-center justify-center mb-4">
              <User className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="mt-1 text-cyan-100">{profile.specialty}</p>
          </div>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                  Specialty
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Award className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="specialty"
                    id="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (years)
                </label>
                <input
                  type="number"
                  name="experience"
                  id="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              
              <div>
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className="block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-1">
                  Qualifications
                </label>
                <textarea
                  name="qualifications"
                  id="qualifications"
                  rows={2}
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  className="block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Clinic/Hospital Address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="address"
                    id="address"
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  ></textarea>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Availability
                </label>
                
                {formData.availability.map((item, index) => (
                  <div key={index} className="flex flex-wrap items-center mb-3 gap-3">
                    <div className="w-32">
                      <input
                        type="text"
                        value={item.day}
                        onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
                        className="block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex items-center">
                      <span className="mx-2 text-gray-500">From</span>
                      <input
                        type="time"
                        value={item.startTime}
                        onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                        className="block border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                      />
                      <span className="mx-2 text-gray-500">To</span>
                      <input
                        type="time"
                        value={item.endTime}
                        onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                        className="block border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(false);
                }}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Save className="h-5 w-5 mr-1" />
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{profile.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Professional Details</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Registration Number</p>
                    <p className="font-medium text-gray-900">{profile.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium text-gray-900">{profile.experience} years</p>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Qualifications</h3>
                <p className="font-medium text-gray-900">{profile.qualifications}</p>
              </div>
              
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Clinic/Hospital Address</h3>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                  <p className="font-medium text-gray-900">{profile.address}</p>
                </div>
              </div>
              
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Availability</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.availability.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="font-medium text-gray-900">{item.day}</p>
                        <p className="text-sm text-gray-500">
                          {item.startTime} - {item.endTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;