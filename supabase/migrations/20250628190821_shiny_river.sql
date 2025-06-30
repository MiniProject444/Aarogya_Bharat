/*
  # Fix Missing Doctor Profiles

  This migration ensures that all doctors have corresponding profiles in the profiles table.
  The issue is that doctors exist but their profiles are missing, causing the join to fail.

  ## Changes Made:
  1. Check for doctors without profiles
  2. Create missing profiles for existing doctors
  3. Verify data integrity
*/

-- First, let's see what we have
DO $$
DECLARE
    doctor_count INTEGER;
    profile_count INTEGER;
    missing_profiles INTEGER;
BEGIN
    SELECT COUNT(*) INTO doctor_count FROM doctors;
    SELECT COUNT(*) INTO profile_count FROM profiles WHERE role = 'doctor';
    
    RAISE NOTICE 'Total doctors: %, Doctor profiles: %', doctor_count, profile_count;
    
    -- Count doctors without profiles
    SELECT COUNT(*) INTO missing_profiles 
    FROM doctors d 
    LEFT JOIN profiles p ON d.id = p.id 
    WHERE p.id IS NULL;
    
    RAISE NOTICE 'Doctors missing profiles: %', missing_profiles;
END $$;

-- Create profiles for doctors that don't have them
INSERT INTO profiles (id, role, name, phone, created_at, updated_at)
SELECT 
    d.id,
    'doctor' as role,
    COALESCE(
        CASE d.id
            WHEN '11111111-1111-1111-1111-111111111111' THEN 'Dr. Aditya Sharma'
            WHEN '22222222-2222-2222-2222-222222222222' THEN 'Dr. Priya Patel'
            WHEN '33333333-3333-3333-3333-333333333333' THEN 'Dr. Raj Kumar'
            ELSE 'Dr. ' || SUBSTRING(d.id::text, 1, 8)
        END,
        'Unknown Doctor'
    ) as name,
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

-- Also ensure auth.users entries exist for the sample doctors
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
VALUES 
    (
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'dr.sharma@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'dr.patel@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'dr.kumar@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    )
ON CONFLICT (id) DO NOTHING;

-- Verify the fix
DO $$
DECLARE
    doctor_count INTEGER;
    profile_count INTEGER;
    missing_profiles INTEGER;
    sample_doctor RECORD;
BEGIN
    SELECT COUNT(*) INTO doctor_count FROM doctors;
    SELECT COUNT(*) INTO profile_count FROM profiles WHERE role = 'doctor';
    
    -- Count doctors without profiles
    SELECT COUNT(*) INTO missing_profiles 
    FROM doctors d 
    LEFT JOIN profiles p ON d.id = p.id 
    WHERE p.id IS NULL;
    
    RAISE NOTICE 'After fix - Total doctors: %, Doctor profiles: %, Missing profiles: %', 
                 doctor_count, profile_count, missing_profiles;
    
    -- Test a sample join
    SELECT d.specialty, p.name INTO sample_doctor
    FROM doctors d
    JOIN profiles p ON d.id = p.id
    WHERE d.id = '11111111-1111-1111-1111-111111111111';
    
    IF FOUND THEN
        RAISE NOTICE 'Sample join successful: % - %', sample_doctor.name, sample_doctor.specialty;
    ELSE
        RAISE NOTICE 'Sample join failed - this indicates a problem';
    END IF;
END $$;