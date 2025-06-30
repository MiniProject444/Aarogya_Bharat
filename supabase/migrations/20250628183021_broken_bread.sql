/*
  # Fix Sample Doctors Data

  This migration ensures that sample doctors are properly set up in the database
  with correct relationships and data.
*/

-- First, let's check if we have any doctors and clean up if needed
DO $$
BEGIN
  -- Check if sample doctors exist
  IF NOT EXISTS (SELECT 1 FROM doctors WHERE id = '11111111-1111-1111-1111-111111111111') THEN
    -- Insert sample auth users if they don't exist
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES 
      ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.sharma@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '', '', '', ''),
      ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.patel@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '', '', '', ''),
      ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.kumar@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '', '', '', '')
    ON CONFLICT (id) DO NOTHING;

    -- Insert profiles
    INSERT INTO profiles (id, role, name, phone)
    VALUES 
      ('11111111-1111-1111-1111-111111111111', 'doctor', 'Dr. Aditya Sharma', '+91 98765 12345'),
      ('22222222-2222-2222-2222-222222222222', 'doctor', 'Dr. Priya Patel', '+91 98765 12346'),
      ('33333333-3333-3333-3333-333333333333', 'doctor', 'Dr. Raj Kumar', '+91 98765 12347')
    ON CONFLICT (id) DO NOTHING;

    -- Insert doctors
    INSERT INTO doctors (id, specialty, experience, qualifications, registration_number, clinic_address, status, rating)
    VALUES 
      ('11111111-1111-1111-1111-111111111111', 'Cardiology', 15, 'MBBS, MD (Cardiology), DM (Cardiology)', 'MCI-12345', 'Aarogya Bharat Clinic, Mumbai', 'active', 4.8),
      ('22222222-2222-2222-2222-222222222222', 'Neurology', 10, 'MBBS, MD (Neurology), DNB (Neurology)', 'MCI-12346', 'Neurology Center, Delhi', 'active', 4.7),
      ('33333333-3333-3333-3333-333333333333', 'Orthopedics', 12, 'MBBS, MS (Orthopedics)', 'MCI-12347', 'Bone & Joint Clinic, Bangalore', 'active', 4.5)
    ON CONFLICT (id) DO NOTHING;

    -- Insert doctor availability
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

    RAISE NOTICE 'Sample doctors inserted successfully';
  ELSE
    RAISE NOTICE 'Sample doctors already exist';
  END IF;
END $$;

-- Verify the data was inserted correctly
DO $$
DECLARE
    doctor_count INTEGER;
    profile_count INTEGER;
    availability_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO doctor_count FROM doctors WHERE status = 'active';
    SELECT COUNT(*) INTO profile_count FROM profiles WHERE role = 'doctor';
    SELECT COUNT(*) INTO availability_count FROM doctor_availability;
    
    RAISE NOTICE 'Active doctors: %, Doctor profiles: %, Availability records: %', 
                 doctor_count, profile_count, availability_count;
END $$;