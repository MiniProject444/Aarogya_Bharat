import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { AppointmentService } from '../../../services/appointmentService';
import { useAuth } from '../../../context/AuthContext';

interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  location: string;
}

const ViewAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const fetchAppointments = async () => {
    if (!user) return;
    setLoading(true);
    const data = await AppointmentService.getPatientAppointments(user.id);
    const mapped = (data || []).map((a: any) => ({
      id: a.id,
      doctorName: a.doctor_profile?.profiles?.name || 'Unknown',
      doctorSpecialty: a.doctor?.specialty || 'Unknown',
      date: a.appointment_date,
      time: a.appointment_time,
      status: a.status,
      location: a.doctor?.clinic_address || '',
    }));
    setAppointments(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
    // Auto-refresh on window focus
    const onFocus = () => fetchAppointments();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [user]);
  
  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-between">
        My Appointments
        <button
          onClick={fetchAppointments}
          className="ml-4 px-3 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-sm"
          disabled={loading}
        >
          Refresh
        </button>
      </h1>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="text-cyan-600 text-lg font-semibold">Loading...</span>
        </div>
      ) : (
        <>
          {/* Filter tabs */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex space-x-2 overflow-x-auto">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'all' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'upcoming' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('upcoming')}
              >
                Upcoming
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'completed' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'cancelled' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('cancelled')}
              >
                Cancelled
              </button>
            </div>
          </div>
          
          {/* Appointments list */}
          <div className="space-y-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="mb-4 md:mb-0">
                      <h3 className="font-semibold text-lg text-gray-900">{appointment.doctorName}</h3>
                      <p className="text-cyan-600 text-sm">{appointment.doctorSpecialty}</p>
                      
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center text-gray-600 text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            {new Date(appointment.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{appointment.time}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end space-y-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                      
                      {appointment.status === 'upcoming' && (
                        <div className="flex space-x-2">
                          <button className="text-sm text-cyan-600 hover:text-cyan-700">
                            Reschedule
                          </button>
                          <button className="text-sm text-red-600 hover:text-red-700">
                            Cancel
                          </button>
                        </div>
                      )}
                      
                      {appointment.status === 'completed' && (
                        <button className="text-sm text-cyan-600 hover:text-cyan-700">
                          View Prescription
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="flex justify-center mb-4">
                  <Calendar className="h-12 w-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments found</h3>
                <p className="text-gray-500">
                  {filter === 'all'
                    ? "You don't have any appointments yet."
                    : `You don't have any ${filter} appointments.`}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewAppointments;