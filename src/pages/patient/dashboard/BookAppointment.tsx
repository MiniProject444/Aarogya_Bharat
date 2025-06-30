import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, Star } from 'lucide-react';
import { DoctorService } from '../../../services/doctorService';
import { AppointmentService } from '../../../services/appointmentService';
import { useAuth } from '../../../context/AuthContext';
import type { DoctorWithProfile } from '../../../lib/supabase';

interface AppointmentFormData {
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  reasonForVisit: string;
}

const BookAppointment: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [doctors, setDoctors] = useState<DoctorWithProfile[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorWithProfile[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorWithProfile | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState<AppointmentFormData>({
    doctorId: '',
    doctorName: '',
    date: '',
    time: '',
    reasonForVisit: '',
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('BookAppointment: Loading doctors...');
      
      const doctorsData = await DoctorService.getAllDoctors();
      console.log('BookAppointment: Doctors loaded:', doctorsData.length);
      
      // Filter out doctors without profile data
      const validDoctors = doctorsData.filter(doctor => doctor.profiles !== null);
      console.log('BookAppointment: Valid doctors with profiles:', validDoctors.length);
      
      setDoctors(validDoctors);
      setFilteredDoctors(validDoctors);
    } catch (error) {
      console.error('BookAppointment: Error loading doctors:', error);
      setError('Failed to load doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let results = doctors;

    if (searchTerm) {
      results = results.filter(
        (doctor) =>
          doctor.profiles?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specialtyFilter) {
      results = results.filter(
        (doctor) => doctor.specialty === specialtyFilter
      );
    }

    setFilteredDoctors(results);
  }, [searchTerm, specialtyFilter, doctors]);

  const handleDoctorSelect = (doctor: DoctorWithProfile) => {
    setSelectedDoctor(doctor);
    setShowAppointmentForm(true);
    setAppointmentForm({
      doctorId: doctor.id,
      doctorName: doctor.profiles?.name || 'Unknown Doctor',
      date: '',
      time: '',
      reasonForVisit: '',
    });
    setBookingSuccess(false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAppointmentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to book an appointment');
      return;
    }

    setSubmitting(true);
    
    try {
      const appointment = await AppointmentService.createAppointment(user.id, {
        doctorId: appointmentForm.doctorId,
        appointmentDate: appointmentForm.date,
        appointmentTime: appointmentForm.time,
        reasonForVisit: appointmentForm.reasonForVisit,
      });

      if (appointment) {
        setBookingSuccess(true);
        setAppointmentForm({
          doctorId: selectedDoctor?.id || '',
          doctorName: selectedDoctor?.profiles?.name || 'Unknown Doctor',
          date: '',
          time: '',
          reasonForVisit: '',
        });
      } else {
        alert('Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToSearch = () => {
    setSelectedDoctor(null);
    setShowAppointmentForm(false);
    setBookingSuccess(false);
  };

  // Get available dates (next 7 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const formattedDate = date.toISOString().split('T')[0];
      dates.push(formattedDate);
    }
    
    return dates;
  };

  // Get available time slots
  const availableTimeSlots = [
    '09:00', '10:00', '11:00', 
    '14:00', '15:00', '16:00', 
    '17:00'
  ];

  const allSpecialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading doctors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md mx-auto">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadDoctors}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Book an Appointment</h1>
      
      {!showAppointmentForm ? (
        <>
          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
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
                  {allSpecialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Doctors List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 text-xl font-bold">
                        {doctor.profiles?.name?.charAt(0) || 'D'}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-lg text-gray-900">{doctor.profiles?.name || 'Unknown Doctor'}</h3>
                        <p className="text-cyan-600">{doctor.specialty}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mb-3">
                      <div>
                        <span className="text-sm text-gray-500">Experience</span>
                        <p className="text-gray-700">{doctor.experience} years</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Rating</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="ml-1 text-gray-700">{doctor.rating}/5</span>
                        </div>
                      </div>
                    </div>
                    
                    {doctor.qualifications && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500">Qualifications</span>
                        <p className="text-sm text-gray-700">{doctor.qualifications}</p>
                      </div>
                    )}
                    
                    {doctor.doctor_availability && doctor.doctor_availability.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500">Available on</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {doctor.doctor_availability.map((availability) => (
                            <span key={availability.id} className="text-xs bg-cyan-50 text-cyan-700 px-2 py-1 rounded">
                              {availability.day_of_week}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleDoctorSelect(doctor)}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-md transition duration-150 ease-in-out"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No doctors found matching your search criteria.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {bookingSuccess ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Appointment Confirmed!</h3>
              <p className="mt-2 text-gray-600">
                Your appointment with {selectedDoctor?.profiles?.name || 'the doctor'} has been booked successfully.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleBackToSearch}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Book Another Appointment
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={handleBackToSearch}
                className="text-cyan-600 hover:text-cyan-700 mb-4 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to search
              </button>
              
              <div className="flex flex-col md:flex-row md:items-center mb-6 pb-6 border-b border-gray-200">
                <div className="h-20 w-20 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 text-xl font-bold mb-4 md:mb-0 md:mr-6">
                  {selectedDoctor?.profiles?.name?.charAt(0) || 'D'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedDoctor?.profiles?.name || 'Unknown Doctor'}</h2>
                  <p className="text-cyan-600">{selectedDoctor?.specialty}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="ml-1">{selectedDoctor?.rating}/5</span>
                    <span className="mx-2">•</span>
                    <span>{selectedDoctor?.experience} years exp.</span>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-4">Book an Appointment</h3>
              
              <form onSubmit={handleAppointmentSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <select
                        name="date"
                        value={appointmentForm.date}
                        onChange={handleFormChange}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      >
                        <option value="">Select a date</option>
                        {getAvailableDates().map((date) => (
                          <option key={date} value={date}>
                            {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <select
                        name="time"
                        value={appointmentForm.time}
                        onChange={handleFormChange}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      >
                        <option value="">Select a time</option>
                        {availableTimeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Visit
                  </label>
                  <textarea
                    name="reasonForVisit"
                    value={appointmentForm.reasonForVisit}
                    onChange={handleFormChange}
                    rows={3}
                    className="block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Please describe your symptoms or reason for the visit"
                  />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Appointment Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Doctor:</span>
                      <p className="text-gray-900">{selectedDoctor?.profiles?.name || 'Unknown Doctor'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Specialty:</span>
                      <p className="text-gray-900">{selectedDoctor?.specialty}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Date:</span>
                      <p className="text-gray-900">
                        {appointmentForm.date
                          ? new Date(appointmentForm.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : '-'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Time:</span>
                      <p className="text-gray-900">{appointmentForm.time || '-'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white px-6 py-2 rounded-md transition duration-150 ease-in-out"
                  >
                    {submitting ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BookAppointment;