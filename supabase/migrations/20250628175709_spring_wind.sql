/*
  # Fix RLS policies for user data access

  1. Security Policy Updates
    - Fix `profiles` table policies to use correct `auth.uid()` function
    - Fix `patients` table policies to use correct `auth.uid()` function  
    - Fix `doctors` table policies to use correct `auth.uid()` function
    - Ensure all policies allow users to access their own data

  2. Changes Made
    - Drop existing policies that use incorrect `uid()` function
    - Create new policies using correct `auth.uid()` function
    - Maintain same security model but with working authentication
*/

-- Fix profiles table policies
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

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

-- Fix patients table policies
DROP POLICY IF EXISTS "Patients can manage own data" ON patients;
DROP POLICY IF EXISTS "Doctors can read patient data" ON patients;

CREATE POLICY "Patients can manage own data"
  ON patients
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Doctors can read patient data"
  ON patients
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'doctor'
    )
  );

-- Fix doctors table policies
DROP POLICY IF EXISTS "Doctors can insert own data" ON doctors;
DROP POLICY IF EXISTS "Doctors can update own data" ON doctors;
DROP POLICY IF EXISTS "Anyone can read active doctors" ON doctors;

CREATE POLICY "Doctors can insert own data"
  ON doctors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Doctors can update own data"
  ON doctors
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can read active doctors"
  ON doctors
  FOR SELECT
  TO authenticated
  USING (status = 'active');

-- Fix doctor_availability table policies
DROP POLICY IF EXISTS "Doctors can manage own availability" ON doctor_availability;

CREATE POLICY "Doctors can manage own availability"
  ON doctor_availability
  FOR ALL
  TO authenticated
  USING (auth.uid() = doctor_id)
  WITH CHECK (auth.uid() = doctor_id);

-- Fix appointments table policies
DROP POLICY IF EXISTS "Patients can manage own appointments" ON appointments;
DROP POLICY IF EXISTS "Doctors can manage their appointments" ON appointments;

CREATE POLICY "Patients can manage own appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Doctors can manage their appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (auth.uid() = doctor_id)
  WITH CHECK (auth.uid() = doctor_id);

-- Fix prescriptions table policies
DROP POLICY IF EXISTS "Patients can read own prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "Doctors can manage their prescriptions" ON prescriptions;

CREATE POLICY "Patients can read own prescriptions"
  ON prescriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can manage their prescriptions"
  ON prescriptions
  FOR ALL
  TO authenticated
  USING (auth.uid() = doctor_id)
  WITH CHECK (auth.uid() = doctor_id);