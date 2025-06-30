import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star } from 'lucide-react';
import { DoctorService } from '../services/doctorService';
import type { DoctorWithProfile } from '../lib/supabase';

const FindDoctors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [doctors, setDoctors] = useState<DoctorWithProfile[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const doctorsData = await DoctorService.getAllDoctors();
      setDoctors(doctorsData);
      setFilteredDoctors(doctorsData);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let results = doctors;

    if (searchTerm) {
      results = results.filter(doctor =>
        doctor.profiles.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specialtyFilter) {
      results = results.filter(doctor => doctor.specialty === specialtyFilter);
    }

    setFilteredDoctors(results);
  }, [searchTerm, specialtyFilter, doctors]);

  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Doctors</h1>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by doctor name or specialty"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative md:w-64">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
            >
              <option value="">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 text-xl font-bold">
                  {doctor.profiles.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-lg text-gray-900">{doctor.profiles.name}</h3>
                  <p className="text-cyan-600">{doctor.specialty}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">{doctor.experience} years exp.</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="ml-1 text-gray-600">{doctor.rating}/5</span>
                </div>
              </div>
              
              {doctor.qualifications && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Qualifications</p>
                  <p className="text-sm text-gray-700">{doctor.qualifications}</p>
                </div>
              )}
              
              {doctor.doctor_availability && doctor.doctor_availability.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Available on:</p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.doctor_availability.map((availability) => (
                      <span key={availability.id} className="px-2 py-1 bg-cyan-50 text-cyan-700 rounded text-xs">
                        {availability.day_of_week}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
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

      {filteredDoctors.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default FindDoctors;