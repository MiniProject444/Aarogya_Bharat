import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { User, Mail, Phone, Calendar, Shield, Save } from 'lucide-react';

const PatientProfile: React.FC = () => {
  const { user } = useAuth();
  
  // This would normally come from the user context, but we'll mock it for now
  const [profile, setProfile] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+91 98765 43210',
    age: '35',
    gender: 'Male',
    bloodGroup: 'O+',
    allergies: 'None',
    chronicConditions: 'Hypertension',
    emergencyContact: 'Jane Doe - +91 98765 43211'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
            <p className="mt-1 text-cyan-100">Patient ID: {user?.id || 'P12345'}</p>
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
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="age"
                    id="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <input
                  type="text"
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              
              <div>
                <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Group
                </label>
                <input
                  type="text"
                  name="bloodGroup"
                  id="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies
                </label>
                <textarea
                  name="allergies"
                  id="allergies"
                  rows={2}
                  value={formData.allergies}
                  onChange={handleInputChange}
                  className="block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="chronicConditions" className="block text-sm font-medium text-gray-700 mb-1">
                  Chronic Conditions
                </label>
                <textarea
                  name="chronicConditions"
                  id="chronicConditions"
                  rows={2}
                  value={formData.chronicConditions}
                  onChange={handleInputChange}
                  className="block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                />
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
                <h3 className="text-sm font-medium text-gray-500 mb-1">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium text-gray-900">{profile.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium text-gray-900">{profile.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Blood Group</p>
                    <p className="font-medium text-gray-900">{profile.bloodGroup}</p>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Medical Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Allergies</p>
                    <p className="font-medium text-gray-900">{profile.allergies || 'None reported'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Chronic Conditions</p>
                    <p className="font-medium text-gray-900">{profile.chronicConditions || 'None reported'}</p>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Emergency Contact</h3>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="font-medium text-gray-900">{profile.emergencyContact}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;