import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, X } from 'lucide-react';
import { PrescriptionService } from '../../../services/prescriptionService';
import { useAuth } from '../../../context/AuthContext';

interface Prescription {
  id: string;
  date: string;
  doctorName: string;
  doctorSpecialty: string;
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

const ViewPrescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!user) return;
      setLoading(true);
      const data = await PrescriptionService.getPatientPrescriptions(user.id);
      const mapped = (data || []).map((p: any) => ({
        id: p.id,
        date: p.created_at,
        doctorName: p.doctor_profile?.profiles?.name || 'Unknown',
        doctorSpecialty: p.doctor_profile?.specialty || 'Unknown',
        diagnosis: p.diagnosis,
        medications: p.medications || [],
        advice: p.advice || '',
        followUp: p.follow_up || '',
      }));
      setPrescriptions(mapped);
      setLoading(false);
    };
    fetchPrescriptions();
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Prescriptions</h1>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="text-cyan-600 text-lg font-semibold">Loading...</span>
        </div>
      ) : (
        <>
          {selectedPrescription ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Prescription Details</h2>
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {new Date(selectedPrescription.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Doctor</p>
                    <p className="font-medium">{selectedPrescription.doctorName}</p>
                    <p className="text-sm text-cyan-600">{selectedPrescription.doctorSpecialty}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Diagnosis</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedPrescription.diagnosis}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Medications</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Medication
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dosage
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Frequency
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPrescription.medications.map((medication, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {medication.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {medication.dosage}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {medication.frequency}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {medication.duration}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Doctor's Advice</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedPrescription.advice}
                </p>
              </div>
              
              {selectedPrescription.followUp && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Follow-up</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                    {selectedPrescription.followUp}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md">
                  Download PDF
                </button>
              </div>
            </div>
          ) : (
            <>
              {prescriptions.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Doctor
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Diagnosis
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {prescriptions.map((prescription) => (
                          <tr key={prescription.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(prescription.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{prescription.doctorName}</div>
                              <div className="text-sm text-cyan-600">{prescription.doctorSpecialty}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 truncate max-w-xs">
                                {prescription.diagnosis}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => setSelectedPrescription(prescription)}
                                className="text-cyan-600 hover:text-cyan-900"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <FileText className="h-12 w-12 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No prescriptions found</h3>
                  <p className="text-gray-500">You don't have any prescriptions yet.</p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ViewPrescriptions;