import React, { useState } from 'react';
import { X } from 'lucide-react';
import { EmergencyService } from '../../services/emergencyService';

interface EmergencyModalProps {
  onClose: () => void;
}

const EmergencyModal: React.FC<EmergencyModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    location: '',
    contact: '',
    description: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.age || !formData.gender || !formData.location || !formData.contact) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const emergencyRequest = await EmergencyService.createEmergencyRequest({
        patientName: formData.patientName,
        age: parseInt(formData.age),
        gender: formData.gender,
        location: formData.location,
        contact: formData.contact,
        description: formData.description,
      });

      if (emergencyRequest) {
        setShowConfirmation(true);
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        alert('Failed to submit emergency request. Please try again.');
      }
    } catch (error) {
      console.error('Emergency request error:', error);
      alert('Failed to submit emergency request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
        {/* Red header */}
        <div className="bg-red-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-xl">Emergency Assistance</h2>
          <button onClick={onClose} className="text-white hover:text-red-100">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {showConfirmation ? (
          <div className="p-6 text-center">
            <div className="mb-4 text-green-600 text-5xl">✓</div>
            <h3 className="text-xl font-semibold mb-2">Emergency Alert Sent!</h3>
            <p className="text-gray-600 mb-4">
              An ambulance has been dispatched to your location. Please stay calm and follow any instructions provided by emergency services.
            </p>
            <p className="text-sm text-gray-500">This window will close automatically...</p>
          </div>
        ) : (
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Please provide accurate information for immediate emergency assistance. An ambulance will be dispatched to your location.
            </p>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Name*
                  </label>
                  <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age*
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender*
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number*
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location*
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter full address"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Briefly describe the emergency situation"
                ></textarea>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  type="button"
                >
                  {isSubmitting ? 'Submitting...' : 'Request Emergency Assistance'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyModal;