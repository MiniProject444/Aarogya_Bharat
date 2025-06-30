/*
  # Healthcare Platform Database Schema

  1. New Tables
    - `profiles` - User profiles extending auth.users
    - `patients` - Patient-specific information
    - `doctors` - Doctor profiles and credentials
    - `doctor_availability` - Doctor working schedules
    - `appointments` - Appointment bookings
    - `prescriptions` - Digital prescriptions
    - `emergency_requests` - Emergency assistance requests

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access
    - Ensure patients can only see their own data
    - Allow doctors to see patient data for their appointments

  3. Features
    - Automatic timestamp updates
    - Data validation constraints
    - Proper foreign key relationships
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role text NOT NULL CHECK (role IN ('patient', 'doctor')),
  name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  age integer,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  blood_group text,
  allergies text,
  chronic_conditions text,
  emergency_contact text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  specialty text NOT NULL,
  experience integer DEFAULT 0,
  qualifications text,
  registration_number text UNIQUE,
  clinic_address text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  rating decimal(3,2) DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctor availability table
CREATE TABLE IF NOT EXISTS doctor_availability (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  day_of_week text NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(doctor_id, day_of_week)
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  reason_for_visit text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  appointment_id uuid REFERENCES appointments(id) ON DELETE SET NULL,
  diagnosis text NOT NULL,
  medications jsonb NOT NULL DEFAULT '[]',
  advice text,
  follow_up text,
  created_at timestamptz DEFAULT now()
);

-- Create emergency requests table
CREATE TABLE IF NOT EXISTS emergency_requests (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_name text NOT NULL,
  age integer NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  location text NOT NULL,
  contact text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'dispatched', 'completed')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Patients policies
CREATE POLICY "Patients can view own data" ON patients
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Patients can update own data" ON patients
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Patients can insert own data" ON patients
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Doctors can view patient data for appointments" ON patients
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.patient_id = patients.id
      AND a.doctor_id = auth.uid()
    )
  );

-- Doctors policies
CREATE POLICY "Anyone can view active doctors" ON doctors
  FOR SELECT TO authenticated
  USING (status = 'active');

CREATE POLICY "Doctors can update own data" ON doctors
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Doctors can insert own data" ON doctors
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Doctor availability policies
CREATE POLICY "Anyone can view doctor availability" ON doctor_availability
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Doctors can manage own availability" ON doctor_availability
  FOR ALL TO authenticated
  USING (auth.uid() = doctor_id)
  WITH CHECK (auth.uid() = doctor_id);

-- Appointments policies
CREATE POLICY "Patients can view own appointments" ON appointments
  FOR SELECT TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view own appointments" ON appointments
  FOR SELECT TO authenticated
  USING (auth.uid() = doctor_id);

CREATE POLICY "Patients can create appointments" ON appointments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update own appointments" ON appointments
  FOR UPDATE TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can update appointments" ON appointments
  FOR UPDATE TO authenticated
  USING (auth.uid() = doctor_id);

-- Prescriptions policies
CREATE POLICY "Patients can view own prescriptions" ON prescriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view own prescriptions" ON prescriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can create prescriptions" ON prescriptions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update own prescriptions" ON prescriptions
  FOR UPDATE TO authenticated
  USING (auth.uid() = doctor_id);

-- Emergency requests policies
CREATE POLICY "Anyone can create emergency requests" ON emergency_requests
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view emergency requests" ON emergency_requests
  FOR SELECT TO authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();