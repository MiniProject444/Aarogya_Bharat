import React, { useState } from 'react';
import { User, Mail, Lock, Phone, Award, MapPin, Calendar } from 'lucide-react';

const AddDoctor: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialty: '',
    experience: '',
    qualifications: '',
    address: '',
  });
  
  const [availability, setAvailability] = useState([
    { day: 'Monday', selected: false, startTime: '09:00', endTime: '17:00' },
    { day: 'Tuesday', selected: false, startTime: '09:00', endTime: '17:00' },
    { day: 'Wednesday', selected: false, startTime: '09:00', endTime: '17:00' },
    { day: 'Thursday', selected: false, startTime: '09:00', endTime: '17:00' },
    { day: 'Friday', selected: false, startTime: '09:00', endTime: '17:00' },
    { day: 'Saturday', selected: false, startTime: '09:00', endTime: '13:00' },
    { day: 'Sunday', selected: false, startTime: '00:00', endTime: '00:00' },
  ]);
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const specialties = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Obstetrics & Gynecology',
    'Oncology',
    'Ophthalmology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Pulmonology',
    'Radiology',
    'Urology'
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAvailabilityCheck = (index: number) => {
    setAvailability(prev => 
      prev.map((day, i) => 
        i === index ? { ...day, selected: !day.selected } : day
      )
    );
  };
  
  const handleAvailabilityTimeChange = (index: number, field: string, value: string) => {
    setAvailability(prev => 
      prev.map((day, i) => 
        i === index ? { ...day, [field]: value } : day
      )
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.specialty) {
      setError('Please fill all required fields');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    // In a real app, this would make an API call to create a new doctor
    setSuccess(true);
    setError(null);
    
    // Reset form after success
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialty: '',
        experience: '',
        qualifications: '',
        address: '',
      });
      
      setAvailability(prev => 
        prev.map(day => ({ ...day, selected: false }))
      );
      
      setSuccess(false);
    }, 3000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Doctor</h1>
      
      {success && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md mb-6">
          Doctor account created successfully!
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-cyan-600 text-white">
          <h2 className="text-lg font-semibold">Doctor Information</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name*
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Dr. John Doe"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address*
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="doctor@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password*
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="••••••"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
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
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="+91 12345 67890"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                Specialty*
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Award className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  required
                >
                  <option value="">Select specialty</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Experience (years)
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                min="0"
                className="block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-1">
                Qualifications
              </label>
              <textarea
                id="qualifications"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleInputChange}
                rows={2}
                className="block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="MBBS, MD, MS, etc."
              />
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
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Availability
            </label>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availability.map((day, index) => (
                  <div key={day.day} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={`day-${day.day}`}
                        type="checkbox"
                        checked={day.selected}
                        onChange={() => handleAvailabilityCheck(index)}
                        className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 flex-grow">
                      <label htmlFor={`day-${day.day}`} className="text-sm font-medium text-gray-700">
                        {day.day}
                      </label>
                      
                      {day.selected && (
                        <div className="mt-2 flex items-center space-x-2">
                          <input
                            type="time"
                            value={day.startTime}
                            onChange={(e) => handleAvailabilityTimeChange(index, 'startTime', e.target.value)}
                            className="block w-24 text-sm border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={day.endTime}
                            onChange={(e) => handleAvailabilityTimeChange(index, 'endTime', e.target.value)}
                            className="block w-24 text-sm border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Add Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;