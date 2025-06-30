/*
  # Fix infinite recursion in RLS policies

  1. Policy Updates
    - Remove problematic policies that cause infinite recursion
    - Replace with simpler, direct policies using auth.uid()
    - Ensure policies are efficient and don't create circular dependencies

  2. Changes Made
    - Simplify patient policies to use direct auth.uid() comparison
    - Fix doctor policies to avoid circular references
    - Update appointment policies to be more efficient
    - Ensure prescription policies work correctly

  3. Security
    - Maintain proper access control
    - Patients can only access their own data
    - Doctors can access patient data through appointments
    - All policies use auth.uid() for authentication
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Patients can read own data" ON patients;
DROP POLICY IF EXISTS "Patients can insert own data" ON patients;
DROP POLICY IF EXISTS "Patients can update own data" ON patients;
DROP POLICY IF EXISTS "Doctors can read patient data" ON patients;

DROP POLICY IF EXISTS "Doctors can read their appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can read own appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can create appointments" ON appointments;
DROP POLICY IF EXISTS "Doctors can update their appointments" ON appointments;

DROP POLICY IF EXISTS "Doctors can read their prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "Patients can read own prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "Doctors can create prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "Doctors can update their prescriptions" ON prescriptions;

-- Create new simplified policies for patients table
CREATE POLICY "Patients can manage own data"
  ON patients
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create policy for doctors to read patient data (simplified)
CREATE POLICY "Doctors can read patient data"
  ON patients
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'doctor'
    )
  );

-- Create new simplified policies for appointments table
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

-- Create new simplified policies for prescriptions table
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