/*
  # Fix Missing Doctor Profiles

  This migration identifies and fixes the core issue: doctors exist but their profiles are missing.
  
  ## Problem:
  - 5 doctors exist in the doctors table
  - 0 profiles exist for these doctors in the profiles table
  - The join fails because profiles are missing
  
  ## Solution:
  1. Create profiles for all existing doctors
  2. Ensure auth.users entries exist
  3. Verify the fix works
*/

-- First, let's see what we're working with
DO $$
DECLARE
    doctor_count INTEGER;
    profile_count INTEGER;
    auth_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO doctor_count FROM doctors;
    SELECT COUNT(*) INTO profile_count FROM profiles WHERE role = 'doctor';
    SELECT COUNT(*) INTO auth_count FROM auth.users WHERE id IN (SELECT id FROM doctors);
    
    RAISE NOTICE 'Before fix - Doctors: %, Profiles: %, Auth users: %', doctor_count, profile_count, auth_count;
END $$;

-- Create auth.users entries for all doctors that don't have them
INSERT INTO auth.users (
    id, 
    instance_id, 
    aud, 
    role, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    created_at, 
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
)
SELECT 
    d.id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    CASE d.id
        WHEN '11111111-1111-1111-1111-111111111111' THEN 'dr.sharma@example.com'
        WHEN '22222222-2222-2222-2222-222222222222' THEN 'dr.patel@example.com'
        WHEN '33333333-3333-3333-3333-333333333333' THEN 'dr.kumar@example.com'
        ELSE 'doctor.' || SUBSTRING(d.id::text, 1, 8) || '@example.com'
    END,
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
FROM doctors d
LEFT JOIN auth.users au ON d.id = au.id
WHERE au.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Create profiles for all doctors that don't have them
INSERT INTO profiles (id, role, name, phone, created_at, updated_at)
SELECT 
    d.id,
    'doctor' as role,
    CASE d.id
        WHEN '11111111-1111-1111-1111-111111111111' THEN 'Dr. Aditya Sharma'
        WHEN '22222222-2222-2222-2222-222222222222' THEN 'Dr. Priya Patel'
        WHEN '33333333-3333-3333-3333-333333333333' THEN 'Dr. Raj Kumar'
        ELSE 'Dr. ' || SUBSTRING(d.id::text, 1, 8)
    END as name,
    CASE d.id
        WHEN '11111111-1111-1111-1111-111111111111' THEN '+91 98765 12345'
        WHEN '22222222-2222-2222-2222-222222222222' THEN '+91 98765 12346'
        WHEN '33333333-3333-3333-3333-333333333333' THEN '+91 98765 12347'
        ELSE '+91 98765 00000'
    END as phone,
    NOW() as created_at,
    NOW() as updated_at
FROM doctors d
LEFT JOIN profiles p ON d.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    updated_at = NOW();

-- Verify the fix worked
DO $$
DECLARE
    doctor_count INTEGER;
    profile_count INTEGER;
    auth_count INTEGER;
    missing_profiles INTEGER;
    test_join_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO doctor_count FROM doctors;
    SELECT COUNT(*) INTO profile_count FROM profiles WHERE role = 'doctor';
    SELECT COUNT(*) INTO auth_count FROM auth.users WHERE id IN (SELECT id FROM doctors);
    
    -- Count doctors without profiles
    SELECT COUNT(*) INTO missing_profiles 
    FROM doctors d 
    LEFT JOIN profiles p ON d.id = p.id 
    WHERE p.id IS NULL;
    
    -- Test the join that was failing
    SELECT COUNT(*) INTO test_join_count
    FROM doctors d
    INNER JOIN profiles p ON d.id = p.id
    WHERE d.status = 'active';
    
    RAISE NOTICE 'After fix - Doctors: %, Profiles: %, Auth users: %, Missing profiles: %, Join result: %', 
                 doctor_count, profile_count, auth_count, missing_profiles, test_join_count;
    
    IF missing_profiles = 0 AND test_join_count > 0 THEN
        RAISE NOTICE 'SUCCESS: All doctors now have profiles and join works!';
    ELSE
        RAISE NOTICE 'PROBLEM: Fix did not work completely';
    END IF;
END $$;

-- Test the exact query that DoctorService uses
DO $$
DECLARE
    result_count INTEGER;
    sample_doctor RECORD;
BEGIN
    -- This is the exact query from DoctorService.getAllDoctors()
    SELECT COUNT(*) INTO result_count
    FROM doctors d
    INNER JOIN profiles p ON d.id = p.id
    WHERE d.status = 'active';
    
    RAISE NOTICE 'DoctorService query result count: %', result_count;
    
    -- Get a sample result
    SELECT d.specialty, p.name, d.rating INTO sample_doctor
    FROM doctors d
    INNER JOIN profiles p ON d.id = p.id
    WHERE d.status = 'active'
    LIMIT 1;
    
    IF FOUND THEN
        RAISE NOTICE 'Sample doctor: % - % (Rating: %)', sample_doctor.name, sample_doctor.specialty, sample_doctor.rating;
    END IF;
END $$;