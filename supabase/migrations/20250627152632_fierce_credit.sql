/*
  # Fix Database Schema and RLS Policy Issues

  1. Fix infinite recursion in RLS policies for patients table
  2. Add missing foreign key relationships between doctors/patients and profiles
  3. Simplify RLS policies to avoid circular dependencies

  ## Changes Made:
  - Drop and recreate problematic RLS policies for patients
  - Add foreign key constraints for proper table relationships
  - Simplify doctor access policies to avoid recursion
*/

-- First, drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Doctors can read patient data for appointments" ON patients;
DROP POLICY IF EXISTS "Patients can read own data" ON patients;
DROP POLICY IF EXISTS "Patients can insert own data" ON patients;
DROP POLICY IF EXISTS "Patients can update own data" ON patients;

-- Create corrected RLS policies for patients table
CREATE POLICY "Patients can read own data"
  ON patients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Patients can insert own data"
  ON patients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Patients can update own data"
  ON patients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create a simpler policy for doctors to read patient data
-- This avoids the complex EXISTS subquery that was causing recursion
CREATE POLICY "Doctors can read patient data"
  ON patients
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.patient_id = patients.id 
      AND a.doctor_id = auth.uid()
    )
  );

-- Add missing foreign key relationship between doctors and profiles
-- This will allow the implicit join syntax to work
DO $$
BEGIN
  -- Check if the foreign key doesn't already exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'doctors_id_profiles_fkey'
    AND table_name = 'doctors'
  ) THEN
    -- Add the foreign key constraint
    ALTER TABLE doctors 
    ADD CONSTRAINT doctors_id_profiles_fkey 
    FOREIGN KEY (id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Also ensure patients table has the same relationship if it doesn't exist
DO $$
BEGIN
  -- Check if the foreign key doesn't already exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'patients_id_profiles_fkey'
    AND table_name = 'patients'
  ) THEN
    -- Add the foreign key constraint
    ALTER TABLE patients 
    ADD CONSTRAINT patients_id_profiles_fkey 
    FOREIGN KEY (id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;