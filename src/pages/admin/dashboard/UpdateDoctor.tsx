import React, { useState, useEffect } from 'react';
import { Search, Award, Edit, User, Mail, Phone, Calendar, Save } from 'lucide-react';
import { mockDoctorsDataAdmin } from '../../../data/mockData';

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  experience: number;
  qualifications: string;
  phone: string;
  address: string;
  registrationNumber: string;
  status: 'active' | 'inactive';
  availability: { day: string; startTime: string; endTime: string }[];
}

const UpdateDoctor: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [editedDoctor, setEditedDoctor] = useState<Doctor | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
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
  
  useEffect(() => {
    // In a real app, this would be an API call
    setDoctors(mockDoctorsDataAdmin);
    setFilteredDoctors(mockDoctorsDataAdmin);
  }, []);
  
  useEffect(() => {
    // Filter doctors based on search term
    if (searchTerm) {
      const results = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(results);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [searchTerm, doctors]);
  
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setEditedDoctor({ ...doctor });
    setUpdateSuccess(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editedDoctor) return;
    
    const { name, value } = e.target;
    setEditedDoctor({ ...editedDoctor, [name]: value });
  };
  
  const handleAvailabilityChange = (index: number, field: string, value: string) => {
    if (!editedDoctor) return;
    
    const updatedAvailability = editedDoctor.availability.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    
    setEditedDoctor({ ...editedDoctor, availability: updatedAvailability });
  };
  
  const handleStatusChange = (status: 'active' | 'inactive') => {
    if (!editedDoctor) return;
    setEditedDoctor({ ...editedDoctor, status });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editedDoctor) return;
    
    // In a real app, this would be an API call to update the doctor
    const updatedDoctors = doctors.map((doctor) =>
      doctor.id === editedDoctor.id ? editedDoctor : doctor
    );
    
    setDoctors(updatedDoctors);
    setFilteredDoctors(updatedDoctors);
    setSelectedDoctor(editedDoctor);
    
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 3000);
  };
  
  const handleCancel = () => {
    if (selectedDoctor) {
      setEditedDoctor({ ...selectedDoctor });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Doctor</h1>
      
      {selectedDoctor ? (
        <div>
          <button
            onClick={() => {
              setSelectedDoctor(null);
              setEditedDoctor(null);
            }}
            className="text-cyan-600 hover:text-cyan-700 mb-4 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to doctors
          </button>
          
          {updateSuccess && (
            <div className="bg-green-50 text-green-800 p-4 rounded-md mb-6">
              Doctor information updated successfully!
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">{selectedDoctor.name}</h2>
                <p className="text-cyan-100">{selectedDoctor.specialty}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                selectedDoctor.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedDoctor.status.charAt(0).toUpperCase() + selectedDoctor.status.slice(1)}
              </div>
            </div>
            
            {editedDoctor && (
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                        id="name"
                        name="name"
                        value={editedDoctor.name}
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
                        id="email"
                        name="email"
                        value={editedDoctor.email}
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
                      <select
                        id="specialty"
                        name="specialty"
                        value={editedDoctor.specialty}
                        onChange={handleInputChange}
                        className="pl-10 block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                      >
                        {specialties.map(specialty => (
                          <option key={specialty} value={specialty}>{specialty}</option>
                        ))}
                      </select>
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
                        type="tel"
                        id="phone"
                        name="phone"
                        value={editedDoctor.phone}
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
                      id="experience"
                      name="experience"
                      value={editedDoctor.experience}
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
                      id="registrationNumber"
                      name="registrationNumber"
                      value={editedDoctor.registrationNumber}
                      onChange={handleInputChange}
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
                      value={editedDoctor.qualifications}
                      onChange={handleInputChange}
                      rows={2}
                      className="block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Clinic/Hospital Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={editedDoctor.address}
                      onChange={handleInputChange}
                      rows={2}
                      className="block w-full border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Doctor Status
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        id="status-active"
                        name="status"
                        type="radio"
                        checked={editedDoctor.status === 'active'}
                        onChange={() => handleStatusChange('active')}
                        className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300"
                      />
                      <label htmlFor="status-active" className="ml-2 block text-sm text-gray-700">
                        Active
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="status-inactive"
                        name="status"
                        type="radio"
                        checked={editedDoctor.status === 'inactive'}
                        onChange={() => handleStatusChange('inactive')}
                        className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300"
                      />
                      <label htmlFor="status-inactive" className="ml-2 block text-sm text-gray-700">
                        Inactive
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Availability
                  </label>
                  
                  <div className="space-y-3">
                    {editedDoctor.availability.map((item, index) => (
                      <div key={item.day} className="flex flex-wrap items-center gap-3">
                        <div className="w-32">
                          <span className="block text-sm font-medium text-gray-900">{item.day}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">From</span>
                          <input
                            type="time"
                            value={item.startTime}
                            onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                            className="block border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                          />
                          <span className="text-sm text-gray-500 mx-2">To</span>
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
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
                  >
                    Reset Changes
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
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors by name, email, or specialty"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Doctors list */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialty
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                            {doctor.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                            <div className="text-xs text-gray-500">ID: {doctor.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.specialty}</div>
                        <div className="text-xs text-gray-500">{doctor.experience} years exp.</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.email}</div>
                        <div className="text-xs text-gray-500">{doctor.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          doctor.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDoctorSelect(doctor)}
                          className="text-cyan-600 hover:text-cyan-900 flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No doctors found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default UpdateDoctor;