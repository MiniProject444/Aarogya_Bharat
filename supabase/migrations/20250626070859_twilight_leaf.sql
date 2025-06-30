/*
  # Healthcare Platform Database Schema

  This migration creates all the necessary tables for the Aarogya Bharat healthcare platform.

  ## Tables Created:
  1. profiles - User profiles (extends auth.users)
  2. patients - Patient-specific information
  3. doctors - Doctor profiles and credentials
  4. doctor_availability - Doctor working hours
  5. appointments - Appointment bookings
  6. prescriptions - Digital prescriptions
  7. emergency_requests - Emergency assistance requests

  ## Security:
  - Row Level Security (RLS) enabled on all tables
  - Policies for authenticated users
  - Role-based access control
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('patient', 'doctor')),
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  blood_group TEXT,
  allergies TEXT,
  chronic_conditions TEXT,
  emergency_contact TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  specialty TEXT NOT NULL,
  experience INTEGER DEFAULT 0,
  qualifications TEXT,
  registration_number TEXT UNIQUE,
  clinic_address TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  rating DECIMAL(2,1) DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create doctor_availability table
CREATE TABLE IF NOT EXISTS doctor_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, day_of_week)
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  reason_for_visit TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  diagnosis TEXT NOT NULL,
  medications JSONB NOT NULL DEFAULT '[]',
  advice TEXT,
  follow_up TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create emergency_requests table
CREATE TABLE IF NOT EXISTS emergency_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  location TEXT NOT NULL,
  contact TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'dispatched', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for patients
CREATE POLICY "Patients can read own data"
  ON patients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Patients can update own data"
  ON patients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Patients can insert own data"
  ON patients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Doctors can read patient data for appointments"
  ON patients
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      WHERE a.patient_id = patients.id
      AND d.id = auth.uid()
    )
  );

-- Create RLS policies for doctors
CREATE POLICY "Anyone can read active doctors"
  ON doctors
  FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Doctors can update own data"
  ON doctors
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Doctors can insert own data"
  ON doctors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for doctor_availability
CREATE POLICY "Anyone can read doctor availability"
  ON doctor_availability
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Doctors can manage own availability"
  ON doctor_availability
  FOR ALL
  TO authenticated
  USING (auth.uid() = doctor_id)
  WITH CHECK (auth.uid() = doctor_id);

-- Create RLS policies for appointments
CREATE POLICY "Patients can read own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = appointments.patient_id
      AND p.id = auth.uid()
    )
  );

CREATE POLICY "Doctors can read their appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors d
      WHERE d.id = appointments.doctor_id
      AND d.id = auth.uid()
    )
  );

CREATE POLICY "Patients can create appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = appointments.patient_id
      AND p.id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update their appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors d
      WHERE d.id = appointments.doctor_id
      AND d.id = auth.uid()
    )
  );

-- Create RLS policies for prescriptions
CREATE POLICY "Patients can read own prescriptions"
  ON prescriptions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = prescriptions.patient_id
      AND p.id = auth.uid()
    )
  );

CREATE POLICY "Doctors can read their prescriptions"
  ON prescriptions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors d
      WHERE d.id = prescriptions.doctor_id
      AND d.id = auth.uid()
    )
  );

CREATE POLICY "Doctors can create prescriptions"
  ON prescriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM doctors d
      WHERE d.id = prescriptions.doctor_id
      AND d.id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update their prescriptions"
  ON prescriptions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors d
      WHERE d.id = prescriptions.doctor_id
      AND d.id = auth.uid()
    )
  );

-- Create RLS policies for emergency_requests
CREATE POLICY "Anyone can create emergency requests"
  ON emergency_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read emergency requests"
  ON emergency_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_status ON doctors(status);
CREATE INDEX IF NOT EXISTS idx_doctor_availability_doctor_id ON doctor_availability(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_emergency_requests_status ON emergency_requests(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
    BEFORE UPDATE ON doctors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample doctors for testing
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'dr.sharma@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'dr.patel@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'dr.kumar@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, role, name, phone)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'doctor', 'Dr. Aditya Sharma', '+91 98765 12345'),
  ('22222222-2222-2222-2222-222222222222', 'doctor', 'Dr. Priya Patel', '+91 98765 12346'),
  ('33333333-3333-3333-3333-333333333333', 'doctor', 'Dr. Raj Kumar', '+91 98765 12347')
ON CONFLICT (id) DO NOTHING;

INSERT INTO doctors (id, specialty, experience, qualifications, registration_number, clinic_address, rating)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Cardiology', 15, 'MBBS, MD (Cardiology), DM (Cardiology)', 'MCI-12345', 'Aarogya Bharat Clinic, Mumbai', 4.8),
  ('22222222-2222-2222-2222-222222222222', 'Neurology', 10, 'MBBS, MD (Neurology), DNB (Neurology)', 'MCI-12346', 'Neurology Center, Delhi', 4.7),
  ('33333333-3333-3333-3333-333333333333', 'Orthopedics', 12, 'MBBS, MS (Orthopedics)', 'MCI-12347', 'Bone & Joint Clinic, Bangalore', 4.5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Monday', '09:00', '17:00'),
  ('11111111-1111-1111-1111-111111111111', 'Tuesday', '09:00', '17:00'),
  ('11111111-1111-1111-1111-111111111111', 'Wednesday', '09:00', '17:00'),
  ('11111111-1111-1111-1111-111111111111', 'Thursday', '09:00', '17:00'),
  ('11111111-1111-1111-1111-111111111111', 'Friday', '09:00', '17:00'),
  ('22222222-2222-2222-2222-222222222222', 'Monday', '10:00', '18:00'),
  ('22222222-2222-2222-2222-222222222222', 'Wednesday', '10:00', '18:00'),
  ('22222222-2222-2222-2222-222222222222', 'Friday', '10:00', '18:00'),
  ('33333333-3333-3333-3333-333333333333', 'Tuesday', '09:00', '17:00'),
  ('33333333-3333-3333-3333-333333333333', 'Thursday', '09:00', '17:00'),
  ('33333333-3333-3333-3333-333333333333', 'Saturday', '09:00', '13:00')
ON CONFLICT (doctor_id, day_of_week) DO NOTHING;