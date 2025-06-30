import React, { useState, useEffect } from 'react';
import { Search, FileText, Clipboard, PlusCircle, X } from 'lucide-react';
import { AuthService } from '../../../services/authService';
import { supabase } from '../../../lib/supabase';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  contact: string;
  medicalHistory: string;
}

interface Prescription {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  advice: string;
  followUp?: string;
}

const ManagePatients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientPrescriptions, setPatientPrescriptions] = useState<Prescription[]>([]);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPrescription, setNewPrescription] = useState<{
    diagnosis: string;
    medications: { name: string; dosage: string; frequency: string; duration: string }[];
    advice: string;
    followUp: string;
  }>({
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
    advice: '',
    followUp: '',
  });
  const [prescriptionSuccess, setPrescriptionSuccess] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const patientsData = await AuthService.getAllPatientsWithProfiles();
      setPatients(patientsData);
      setFilteredPatients(patientsData);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Filter patients based on search term
    if (searchTerm) {
      const results = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(results);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchTerm, patients]);

  const handlePatientSelect = async (patient: Patient) => {
    setSelectedPatient(patient);
    
    try {
      // Fetch real prescriptions from Supabase
      const { data: prescriptions, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('patient_id', patient.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching prescriptions:', error);
        setPatientPrescriptions([]);
      } else {
        // Transform the data to match the expected format
        const transformedPrescriptions = prescriptions?.map(prescription => ({
          id: prescription.id,
          patientId: prescription.patient_id,
          date: prescription.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          diagnosis: prescription.diagnosis,
          medications: Array.isArray(prescription.medications) ? prescription.medications : [],
          advice: prescription.advice || '',
          followUp: prescription.follow_up || '',
        })) || [];
        
        setPatientPrescriptions(transformedPrescriptions);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setPatientPrescriptions([]);
    }
    
    // Reset prescription form
    setShowPrescriptionForm(false);
    setPrescriptionSuccess(false);
  };

  const handleAddMedication = () => {
    setNewPrescription((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: '', dosage: '', frequency: '', duration: '' },
      ],
    }));
  };

  const handleRemoveMedication = (index: number) => {
    if (newPrescription.medications.length > 1) {
      setNewPrescription((prev) => ({
        ...prev,
        medications: prev.medications.filter((_, i) => i !== index),
      }));
    }
  };

  const handleMedicationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setNewPrescription((prev) => ({
      ...prev,
      medications: prev.medications.map((medication, i) =>
        i === index ? { ...medication, [field]: value } : medication
      ),
    }));
  };

  const handlePrescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewPrescription((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient) return;

    try {
      // Get current user to use as doctor_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return;
      }

      // Save prescription to Supabase
      const { data: newPrescriptionData, error } = await supabase
        .from('prescriptions')
        .insert({
          patient_id: selectedPatient.id,
          doctor_id: user.id,
          diagnosis: newPrescription.diagnosis,
          medications: newPrescription.medications,
          advice: newPrescription.advice,
          follow_up: newPrescription.followUp || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating prescription:', error);
        return;
      }

      // Transform and add the new prescription to the list
      const transformedPrescription = {
        id: newPrescriptionData.id,
        patientId: newPrescriptionData.patient_id,
        date: newPrescriptionData.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        diagnosis: newPrescriptionData.diagnosis,
        medications: newPrescriptionData.medications,
        advice: newPrescriptionData.advice || '',
        followUp: newPrescriptionData.follow_up || '',
      };
      
      setPatientPrescriptions((prev) => [transformedPrescription, ...prev]);
      
      // Show success message
      setPrescriptionSuccess(true);
      
      // Reset form
      setNewPrescription({
        diagnosis: '',
        medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
        advice: '',
        followUp: '',
      });
      
      // Hide form after success
      setTimeout(() => {
        setShowPrescriptionForm(false);
        setPrescriptionSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error submitting prescription:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Patients</h1>
      
      {selectedPatient ? (
        <div>
          <button
            onClick={() => setSelectedPatient(null)}
            className="text-cyan-600 hover:text-cyan-700 mb-4 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to patients
          </button>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 px-6 py-4 flex items-center justify-between">
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-white">{selectedPatient.name}</h2>
                <div className="flex flex-wrap gap-x-4 text-sm text-cyan-100 mt-1">
                  <span>Age: {selectedPatient.age}</span>
                  <span>Gender: {selectedPatient.gender}</span>
                  <span>Blood Group: {selectedPatient.bloodGroup}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPrescriptionForm(true);
                  setPrescriptionSuccess(false);
                }}
                className="bg-white text-cyan-700 px-3 py-1 rounded-md flex items-center text-sm font-medium hover:bg-cyan-50"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                New Prescription
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h3>
                  <p className="font-medium text-gray-900">{selectedPatient.contact}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Patient ID</h3>
                  <p className="font-medium text-gray-900">{selectedPatient.id}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Medical History</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedPatient.medicalHistory || 'No medical history recorded.'}
                </p>
              </div>
            </div>
          </div>
          
          {showPrescriptionForm ? (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">New Prescription</h3>
                <button
                  onClick={() => setShowPrescriptionForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {prescriptionSuccess ? (
                <div className="bg-green-50 p-4 rounded-md text-center">
                  <div className="flex justify-center mb-2">
                    <div className="rounded-full bg-green-100 p-2">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-1">Prescription Created</h4>
                  <p className="text-gray-600">The prescription has been successfully created.</p>
                </div>
              ) : (
                <form onSubmit={handlePrescriptionSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                        Diagnosis
                      </label>
                      <textarea
                        id="diagnosis"
                        name="diagnosis"
                        rows={2}
                        required
                        value={newPrescription.diagnosis}
                        onChange={handlePrescriptionChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                      ></textarea>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Medications
                        </label>
                        <button
                          type="button"
                          onClick={handleAddMedication}
                          className="text-sm text-cyan-600 hover:text-cyan-700"
                        >
                          + Add Medication
                        </button>
                      </div>
                      
                      {newPrescription.medications.map((medication, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md mb-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Medication Name
                              </label>
                              <input
                                type="text"
                                required
                                value={medication.name}
                                onChange={(e) =>
                                  handleMedicationChange(index, 'name', e.target.value)
                                }
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Dosage
                              </label>
                              <input
                                type="text"
                                required
                                value={medication.dosage}
                                onChange={(e) =>
                                  handleMedicationChange(index, 'dosage', e.target.value)
                                }
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Frequency
                              </label>
                              <input
                                type="text"
                                required
                                value={medication.frequency}
                                onChange={(e) =>
                                  handleMedicationChange(index, 'frequency', e.target.value)
                                }
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Duration
                              </label>
                              <input
                                type="text"
                                required
                                value={medication.duration}
                                onChange={(e) =>
                                  handleMedicationChange(index, 'duration', e.target.value)
                                }
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                              />
                            </div>
                          </div>
                          
                          {newPrescription.medications.length > 1 && (
                            <div className="flex justify-end mt-2">
                              <button
                                type="button"
                                onClick={() => handleRemoveMedication(index)}
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <label htmlFor="advice" className="block text-sm font-medium text-gray-700 mb-1">
                        Doctor's Advice
                      </label>
                      <textarea
                        id="advice"
                        name="advice"
                        rows={2}
                        required
                        value={newPrescription.advice}
                        onChange={handlePrescriptionChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="followUp" className="block text-sm font-medium text-gray-700 mb-1">
                        Follow-up (if needed)
                      </label>
                      <input
                        type="text"
                        id="followUp"
                        name="followUp"
                        value={newPrescription.followUp}
                        onChange={handlePrescriptionChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                        placeholder="e.g., After 2 weeks"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md"
                    >
                      Create Prescription
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : null}
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Patient Prescriptions</h3>
            </div>
            
            {patientPrescriptions.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {patientPrescriptions.map((prescription) => (
                  <li key={prescription.id} className="p-6 hover:bg-gray-50">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <div className="flex items-center mb-2">
                          <FileText className="h-5 w-5 text-cyan-600 mr-2" />
                          <h4 className="font-medium text-gray-900">
                            {new Date(prescription.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h4>
                        </div>
                        <p className="text-gray-700 mb-2">
                          <span className="font-medium">Diagnosis:</span> {prescription.diagnosis}
                        </p>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Medications:</span>{' '}
                          {prescription.medications.map((med) => med.name).join(', ')}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <button className="text-cyan-600 hover:text-cyan-700">
                          View Details
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center">
                <Clipboard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No prescriptions yet</h3>
                <p className="text-gray-500">This patient doesn't have any prescriptions.</p>
              </div>
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
                placeholder="Search patients by name"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Patients list */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age/Gender
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Group
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                            {patient.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                            <div className="text-sm text-gray-500">ID: {patient.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.age} years</div>
                        <div className="text-sm text-gray-500">{patient.gender}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          {patient.bloodGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.contact}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handlePatientSelect(patient)}
                          className="text-cyan-600 hover:text-cyan-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      {loading ? 'Loading patients...' : 'No patients found matching your search.'}
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

export default ManagePatients;