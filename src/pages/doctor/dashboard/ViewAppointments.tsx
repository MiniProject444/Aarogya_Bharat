import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AppointmentService } from '../../../services/appointmentService';
import { PrescriptionService } from '../../../services/prescriptionService';
import { useAuth } from '../../../context/AuthContext';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  reasonForVisit: string;
}

const ViewAppointments: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState('');
  const [prescriptionSuccess, setPrescriptionSuccess] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
    advice: '',
    followUp: '',
  });
  
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      setLoading(true);
      const data = await AppointmentService.getDoctorAppointments(user.id);
      const mapped = (data || []).map((a: any) => ({
        id: a.id,
        patientId: a.patient_profile?.id || a.patient_id,
        patientName: a.patient_profile?.profiles?.name || 'Unknown',
        patientAge: a.patient_profile?.age || '',
        patientGender: a.patient_profile?.gender || '',
        date: a.appointment_date,
        time: a.appointment_time,
        status: a.status,
        reasonForVisit: a.reason_for_visit || '',
      }));
      setAppointments(mapped);
      setFilteredAppointments(mapped);
      setLoading(false);
    };
    fetchAppointments();
  }, [user]);

  // Filter appointments based on status and selected date
  useEffect(() => {
    let result = appointments;
    
    // Filter by status
    if (filter !== 'all') {
      result = result.filter(appointment => appointment.status === filter);
    }
    
    // Filter by date
    if (selectedDate) {
      result = result.filter(appointment => appointment.date === selectedDate);
    }
    
    setFilteredAppointments(result);
  }, [filter, selectedDate, appointments]);

  // Get unique dates from appointments
  const getUniqueDates = () => {
    const dates = appointments.map(appointment => appointment.date);
    return [...new Set(dates)].sort();
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const completeAppointment = async (id: string) => {
    await AppointmentService.updateAppointmentStatus(id, 'completed');
    // Refresh appointments from the database
    if (user) {
      setLoading(true);
      const data = await AppointmentService.getDoctorAppointments(user.id);
      const mapped = (data || []).map((a: any) => ({
        id: a.id,
        patientId: a.patient_profile?.id || a.patient_id,
        patientName: a.patient_profile?.profiles?.name || 'Unknown',
        patientAge: a.patient_profile?.age || '',
        patientGender: a.patient_profile?.gender || '',
        date: a.appointment_date,
        time: a.appointment_time,
        status: a.status,
        reasonForVisit: a.reason_for_visit || '',
      }));
      setAppointments(mapped);
      setFilteredAppointments(mapped);
      setLoading(false);
    }
  };

  const cancelAppointment = async (id: string) => {
    await AppointmentService.updateAppointmentStatus(id, 'cancelled');
    // Refresh appointments from the database
    if (user) {
      setLoading(true);
      const data = await AppointmentService.getDoctorAppointments(user.id);
      const mapped = (data || []).map((a: any) => ({
        id: a.id,
        patientId: a.patient_profile?.id || a.patient_id,
        patientName: a.patient_profile?.profiles?.name || 'Unknown',
        patientAge: a.patient_profile?.age || '',
        patientGender: a.patient_profile?.gender || '',
        date: a.appointment_date,
        time: a.appointment_time,
        status: a.status,
        reasonForVisit: a.reason_for_visit || '',
      }));
      setAppointments(mapped);
      setFilteredAppointments(mapped);
      setLoading(false);
    }
  };

  // Prescription modal handlers
  const openPrescriptionModal = (appointment: any) => {
    setSelectedAppointment(appointment);
    setPrescriptionForm({
      diagnosis: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
      advice: '',
      followUp: '',
    });
    setPrescriptionError('');
    setPrescriptionSuccess(false);
    setShowPrescriptionModal(true);
  };
  const closePrescriptionModal = () => {
    setShowPrescriptionModal(false);
    setSelectedAppointment(null);
    setPrescriptionError('');
    setPrescriptionSuccess(false);
  };
  const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrescriptionForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleMedicationChange = (index: number, field: string, value: string) => {
    setPrescriptionForm((prev) => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      ),
    }));
  };
  const addMedication = () => {
    setPrescriptionForm((prev) => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '' }],
    }));
  };
  const removeMedication = (index: number) => {
    setPrescriptionForm((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };
  const handlePrescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment || !user) return;
    setPrescriptionLoading(true);
    setPrescriptionError('');
    setPrescriptionSuccess(false);
    try {
      await PrescriptionService.createPrescription(user.id, {
        patientId: selectedAppointment.patientId,
        appointmentId: selectedAppointment.id,
        diagnosis: prescriptionForm.diagnosis,
        medications: prescriptionForm.medications,
        advice: prescriptionForm.advice,
        followUp: prescriptionForm.followUp,
      });
      setPrescriptionSuccess(true);
      setTimeout(() => {
        closePrescriptionModal();
      }, 1200);
    } catch (err: any) {
      setPrescriptionError('Failed to create prescription.');
    } finally {
      setPrescriptionLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="text-cyan-600 text-lg font-semibold">Loading...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Today's Stats */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Today's Appointments</h3>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Upcoming</h3>
              <p className="text-2xl font-bold text-blue-600">
                {appointments.filter(a => a.status === 'upcoming').length}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Completed</h3>
              <p className="text-2xl font-bold text-green-600">
                {appointments.filter(a => a.status === 'completed').length}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Cancelled</h3>
              <p className="text-2xl font-bold text-red-600">
                {appointments.filter(a => a.status === 'cancelled').length}
              </p>
            </div>
          </div>
          
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0 md:space-x-4">
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
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                >
                  <option value="">All Dates</option>
                  {getUniqueDates().map((date) => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Appointments list */}
          <div className="space-y-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-0">
                      <div className="bg-cyan-50 p-3 rounded-full mr-4 mb-3 md:mb-0">
                        <User className="h-8 w-8 text-cyan-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{appointment.patientName}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span className="mr-3">{appointment.patientAge} years</span>
                          <span>{appointment.patientGender}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-3">
                            {new Date(appointment.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end">
                      <div className="flex items-center mb-2">
                        {getStatusIcon(appointment.status)}
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      
                      {appointment.status === 'upcoming' && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => completeAppointment(appointment.id)}
                            className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                          >
                            Complete
                          </button>
                          <button 
                            onClick={() => cancelAppointment(appointment.id)}
                            className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => openPrescriptionModal(appointment)}
                            className="text-sm bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded"
                          >
                            Generate Prescription
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Reason for Visit</h4>
                    <p className="text-gray-600">{appointment.reasonForVisit}</p>
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
                  {filter === 'all' && !selectedDate
                    ? "You don't have any appointments."
                    : `No ${filter} appointments${selectedDate ? ' on selected date' : ''}.`}
                </p>
              </div>
            )}
          </div>
        </>
      )}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-lg mx-2 sm:mx-0 relative overflow-y-auto max-h-[90vh]">
            <button onClick={closePrescriptionModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              <XCircle className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Generate Prescription</h2>
            <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Diagnosis</label>
                <textarea name="diagnosis" value={prescriptionForm.diagnosis} onChange={handlePrescriptionChange} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Medications</label>
                <div className="space-y-2">
                  {prescriptionForm.medications.map((med, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mb-2">
                      <input type="text" placeholder="Name" value={med.name} onChange={e => handleMedicationChange(idx, 'name', e.target.value)} className="border rounded p-1 flex-1 min-w-0" required />
                      <input type="text" placeholder="Dosage" value={med.dosage} onChange={e => handleMedicationChange(idx, 'dosage', e.target.value)} className="border rounded p-1 flex-1 min-w-0" required />
                      <input type="text" placeholder="Frequency" value={med.frequency} onChange={e => handleMedicationChange(idx, 'frequency', e.target.value)} className="border rounded p-1 flex-1 min-w-0" required />
                      <input type="text" placeholder="Duration" value={med.duration} onChange={e => handleMedicationChange(idx, 'duration', e.target.value)} className="border rounded p-1 flex-1 min-w-0" required />
                      {prescriptionForm.medications.length > 1 && (
                        <button type="button" onClick={() => removeMedication(idx)} className="text-red-500 ml-0 sm:ml-2">Remove</button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addMedication} className="text-cyan-600 mt-1">+ Add Medication</button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Advice</label>
                <textarea name="advice" value={prescriptionForm.advice} onChange={handlePrescriptionChange} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Follow Up</label>
                <input name="followUp" value={prescriptionForm.followUp} onChange={handlePrescriptionChange} className="w-full border rounded p-2" />
              </div>
              {prescriptionError && <div className="text-red-600 text-sm">{prescriptionError}</div>}
              {prescriptionSuccess && <div className="text-green-600 text-sm">Prescription created successfully!</div>}
              <div className="flex justify-end">
                <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded" disabled={prescriptionLoading}>
                  {prescriptionLoading ? 'Saving...' : 'Save Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAppointments;