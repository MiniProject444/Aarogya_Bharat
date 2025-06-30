// Mock data for doctors
export const mockDoctorsData = [
  {
    id: 'doc1',
    name: 'Dr. Aditya Sharma',
    specialty: 'Cardiology',
    experience: 15,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  {
    id: 'doc2',
    name: 'Dr. Priya Patel',
    specialty: 'Neurology',
    experience: 10,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=400',
    availability: ['Monday', 'Wednesday', 'Friday']
  },
  {
    id: 'doc3',
    name: 'Dr. Raj Kumar',
    specialty: 'Orthopedics',
    experience: 12,
    rating: 4.5,
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
    availability: ['Tuesday', 'Thursday', 'Saturday']
  },
  {
    id: 'doc4',
    name: 'Dr. Sneha Gupta',
    specialty: 'Pediatrics',
    experience: 8,
    rating: 4.9,
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  {
    id: 'doc5',
    name: 'Dr. Amit Verma',
    specialty: 'Dermatology',
    experience: 9,
    rating: 4.6,
    image: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=400',
    availability: ['Monday', 'Wednesday', 'Friday']
  },
  {
    id: 'doc6',
    name: 'Dr. Meera Desai',
    specialty: 'Gynecology',
    experience: 14,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=400',
    availability: ['Tuesday', 'Thursday', 'Saturday']
  }
];

// Mock data for appointments (patient view)
export const mockAppointmentsData = [
  {
    id: 'apt1',
    patientId: 'p1',
    doctorName: 'Dr. Aditya Sharma',
    doctorSpecialty: 'Cardiology',
    date: '2025-03-15',
    time: '09:30 AM',
    status: 'upcoming',
    location: 'Aarogya Bharat Clinic, Mumbai'
  },
  {
    id: 'apt2',
    patientId: 'p1',
    doctorName: 'Dr. Priya Patel',
    doctorSpecialty: 'Neurology',
    date: '2025-02-28',
    time: '11:00 AM',
    status: 'completed',
    location: 'Neurology Center, Delhi'
  },
  {
    id: 'apt3',
    patientId: 'p1',
    doctorName: 'Dr. Raj Kumar',
    doctorSpecialty: 'Orthopedics',
    date: '2025-01-12',
    time: '02:30 PM',
    status: 'cancelled',
    location: 'Bone & Joint Clinic, Bangalore'
  },
  {
    id: 'apt4',
    patientId: 'p2',
    doctorName: 'Dr. Sneha Gupta',
    doctorSpecialty: 'Pediatrics',
    date: '2025-03-20',
    time: '10:00 AM',
    status: 'upcoming',
    location: 'Children\'s Hospital, Chennai'
  }
];

// Mock data for prescriptions
export const mockPrescriptionsData = [
  {
    id: 'presc1',
    patientId: 'p1',
    date: '2025-02-28',
    doctorName: 'Dr. Priya Patel',
    doctorSpecialty: 'Neurology',
    diagnosis: 'Migraine with aura',
    medications: [
      {
        name: 'Sumatriptan',
        dosage: '50mg',
        frequency: 'As needed for migraine, not to exceed 200mg in 24 hours',
        duration: '3 months'
      },
      {
        name: 'Propranolol',
        dosage: '40mg',
        frequency: 'Once daily',
        duration: '3 months'
      }
    ],
    advice: 'Avoid triggers like bright lights and excessive caffeine. Maintain regular sleep schedule. Stay hydrated.',
    followUp: 'After 3 months'
  },
  {
    id: 'presc2',
    patientId: 'p1',
    date: '2025-01-05',
    doctorName: 'Dr. Aditya Sharma',
    doctorSpecialty: 'Cardiology',
    diagnosis: 'Mild hypertension',
    medications: [
      {
        name: 'Amlodipine',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: '6 months'
      },
      {
        name: 'Aspirin',
        dosage: '75mg',
        frequency: 'Once daily',
        duration: '6 months'
      }
    ],
    advice: 'Low sodium diet. Regular exercise for 30 minutes daily. Avoid stress. Quit smoking.',
    followUp: 'After 1 month'
  },
  {
    id: 'presc3',
    patientId: 'p2',
    date: '2025-02-15',
    doctorName: 'Dr. Sneha Gupta',
    doctorSpecialty: 'Pediatrics',
    diagnosis: 'Upper respiratory tract infection',
    medications: [
      {
        name: 'Paracetamol Syrup',
        dosage: '5ml',
        frequency: 'Three times daily',
        duration: '5 days'
      },
      {
        name: 'Cetirizine Syrup',
        dosage: '2.5ml',
        frequency: 'Once at night',
        duration: '5 days'
      }
    ],
    advice: 'Plenty of fluids. Steam inhalation twice daily. Rest.',
    followUp: 'As needed'
  }
];

// Mock data for doctors (doctor view)
export const mockDoctorAppointmentsData = [
  {
    id: 'apt101',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    date: '2025-03-15',
    time: '09:30 AM',
    status: 'upcoming',
    reasonForVisit: 'Chest pain and shortness of breath'
  },
  {
    id: 'apt102',
    patientName: 'Ananya Singh',
    patientAge: 35,
    patientGender: 'Female',
    date: '2025-03-15',
    time: '10:30 AM',
    status: 'upcoming',
    reasonForVisit: 'Follow-up for hypertension'
  },
  {
    id: 'apt103',
    patientName: 'Vikram Mehta',
    patientAge: 50,
    patientGender: 'Male',
    date: '2025-03-14',
    time: '11:00 AM',
    status: 'completed',
    reasonForVisit: 'Annual heart checkup'
  },
  {
    id: 'apt104',
    patientName: 'Priti Sharma',
    patientAge: 28,
    patientGender: 'Female',
    date: '2025-03-14',
    time: '12:00 PM',
    status: 'cancelled',
    reasonForVisit: 'Palpitations'
  },
  {
    id: 'apt105',
    patientName: 'Rajesh Kumar',
    patientAge: 42,
    patientGender: 'Male',
    date: '2025-03-16',
    time: '09:00 AM',
    status: 'upcoming',
    reasonForVisit: 'High blood pressure monitoring'
  }
];

// Mock data for patients
export const mockPatientsData = [
  {
    id: 'p1',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    bloodGroup: 'B+',
    contact: '+91 98765 43210',
    medicalHistory: 'Hypertension since 2020. No allergies. Previous surgery: Appendectomy (2015).'
  },
  {
    id: 'p2',
    name: 'Ananya Singh',
    age: 35,
    gender: 'Female',
    bloodGroup: 'O+',
    contact: '+91 98765 43211',
    medicalHistory: 'Migraine with aura. Allergic to penicillin.'
  },
  {
    id: 'p3',
    name: 'Vikram Mehta',
    age: 50,
    gender: 'Male',
    bloodGroup: 'A+',
    contact: '+91 98765 43212',
    medicalHistory: 'Type 2 diabetes since 2018. Cholesterol. No known allergies.'
  },
  {
    id: 'p4',
    name: 'Priti Sharma',
    age: 28,
    gender: 'Female',
    bloodGroup: 'AB-',
    contact: '+91 98765 43213',
    medicalHistory: 'Asthma since childhood. Allergic to dust and pollen.'
  },
  {
    id: 'p5',
    name: 'Rajesh Kumar',
    age: 42,
    gender: 'Male',
    bloodGroup: 'O-',
    contact: '+91 98765 43214',
    medicalHistory: 'Hypertension. No known allergies.'
  }
];

// Mock data for doctors (admin view)
export const mockDoctorsDataAdmin = [
  {
    id: 'doc1',
    name: 'Dr. Aditya Sharma',
    email: 'aditya.sharma@aarogyabharat.com',
    specialty: 'Cardiology',
    experience: 15,
    qualifications: 'MBBS, MD (Cardiology), DM (Cardiology)',
    phone: '+91 98765 12345',
    address: 'Aarogya Bharat Clinic, Mumbai',
    registrationNumber: 'MCI-12345',
    status: 'active',
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00' }
    ]
  },
  {
    id: 'doc2',
    name: 'Dr. Priya Patel',
    email: 'priya.patel@aarogyabharat.com',
    specialty: 'Neurology',
    experience: 10,
    qualifications: 'MBBS, MD (Neurology), DNB (Neurology)',
    phone: '+91 98765 12346',
    address: 'Neurology Center, Delhi',
    registrationNumber: 'MCI-12346',
    status: 'active',
    availability: [
      { day: 'Monday', startTime: '10:00', endTime: '18:00' },
      { day: 'Wednesday', startTime: '10:00', endTime: '18:00' },
      { day: 'Friday', startTime: '10:00', endTime: '18:00' }
    ]
  },
  {
    id: 'doc3',
    name: 'Dr. Raj Kumar',
    email: 'raj.kumar@aarogyabharat.com',
    specialty: 'Orthopedics',
    experience: 12,
    qualifications: 'MBBS, MS (Orthopedics)',
    phone: '+91 98765 12347',
    address: 'Bone & Joint Clinic, Bangalore',
    registrationNumber: 'MCI-12347',
    status: 'active',
    availability: [
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'Saturday', startTime: '09:00', endTime: '13:00' }
    ]
  },
  {
    id: 'doc4',
    name: 'Dr. Sneha Gupta',
    email: 'sneha.gupta@aarogyabharat.com',
    specialty: 'Pediatrics',
    experience: 8,
    qualifications: 'MBBS, MD (Pediatrics)',
    phone: '+91 98765 12348',
    address: 'Children\'s Hospital, Chennai',
    registrationNumber: 'MCI-12348',
    status: 'active',
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00' }
    ]
  },
  {
    id: 'doc5',
    name: 'Dr. Amit Verma',
    email: 'amit.verma@aarogyabharat.com',
    specialty: 'Dermatology',
    experience: 9,
    qualifications: 'MBBS, MD (Dermatology)',
    phone: '+91 98765 12349',
    address: 'Skin Care Clinic, Hyderabad',
    registrationNumber: 'MCI-12349',
    status: 'inactive',
    availability: [
      { day: 'Monday', startTime: '10:00', endTime: '18:00' },
      { day: 'Wednesday', startTime: '10:00', endTime: '18:00' },
      { day: 'Friday', startTime: '10:00', endTime: '18:00' }
    ]
  }
];

// Mock data for patients (admin view)
export const mockPatientsDataAdmin = [
  {
    id: 'p1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 45,
    gender: 'Male',
    phone: '+91 98765 43210',
    bloodGroup: 'B+',
    registrationDate: '2023-01-15',
    address: '123 Main Street, Mumbai, Maharashtra, India',
    emergencyContact: 'Jane Doe - +91 98765 43211',
    appointmentsCount: 5
  },
  {
    id: 'p2',
    name: 'Ananya Singh',
    email: 'ananya.singh@example.com',
    age: 35,
    gender: 'Female',
    phone: '+91 98765 43211',
    bloodGroup: 'O+',
    registrationDate: '2023-02-20',
    address: '456 Park Avenue, Delhi, India',
    emergencyContact: 'Rohit Singh - +91 98765 43212',
    appointmentsCount: 3
  },
  {
    id: 'p3',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@example.com',
    age: 50,
    gender: 'Male',
    phone: '+91 98765 43212',
    bloodGroup: 'A+',
    registrationDate: '2023-03-10',
    address: '789 Lake View, Bangalore, Karnataka, India',
    emergencyContact: 'Neha Mehta - +91 98765 43213',
    appointmentsCount: 7
  },
  {
    id: 'p4',
    name: 'Priti Sharma',
    email: 'priti.sharma@example.com',
    age: 28,
    gender: 'Female',
    phone: '+91 98765 43213',
    bloodGroup: 'AB-',
    registrationDate: '2023-04-05',
    address: '101 Hill Road, Chennai, Tamil Nadu, India',
    emergencyContact: 'Amit Sharma - +91 98765 43214',
    appointmentsCount: 2
  },
  {
    id: 'p5',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    age: 42,
    gender: 'Male',
    phone: '+91 98765 43214',
    bloodGroup: 'O-',
    registrationDate: '2023-05-12',
    address: '202 River View, Hyderabad, Telangana, India',
    emergencyContact: 'Sunita Kumar - +91 98765 43215',
    appointmentsCount: 4
  },
  {
    id: 'p6',
    name: 'Deepa Nair',
    email: 'deepa.nair@example.com',
    age: 38,
    gender: 'Female',
    phone: '+91 98765 43215',
    bloodGroup: 'B-',
    registrationDate: '2023-06-18',
    address: '303 Beach Road, Kochi, Kerala, India',
    emergencyContact: 'Arjun Nair - +91 98765 43216',
    appointmentsCount: 1
  },
  {
    id: 'p7',
    name: 'Sanjay Patel',
    email: 'sanjay.patel@example.com',
    age: 55,
    gender: 'Male',
    phone: '+91 98765 43216',
    bloodGroup: 'A-',
    registrationDate: '2023-07-21',
    address: '404 Gandhi Road, Ahmedabad, Gujarat, India',
    emergencyContact: 'Meera Patel - +91 98765 43217',
    appointmentsCount: 6
  },
  {
    id: 'p8',
    name: 'Meena Reddy',
    email: 'meena.reddy@example.com',
    age: 30,
    gender: 'Female',
    phone: '+91 98765 43217',
    bloodGroup: 'O+',
    registrationDate: '2023-08-14',
    address: '505 Jubilee Hills, Hyderabad, Telangana, India',
    emergencyContact: 'Krishna Reddy - +91 98765 43218',
    appointmentsCount: 3
  }
];