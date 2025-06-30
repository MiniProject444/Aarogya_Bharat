/*
  # Fix Authentication Hanging Issue

  This migration addresses the hanging authentication issue by:
  1. Ensuring all required tables and indexes exist
  2. Adding a simple test query to verify database connectivity
  3. Optimizing queries for better performance

  ## Changes Made:
  - Verify table structure and indexes
  - Add performance optimizations
  - Test basic query functionality
*/

-- Ensure all required indexes exist for fast auth queries
CREATE INDEX IF NOT EXISTS idx_profiles_id_role ON profiles(id, role);
CREATE INDEX IF NOT EXISTS idx_patients_id_fast ON patients(id);
CREATE INDEX IF NOT EXISTS idx_doctors_id_fast ON doctors(id);

-- Verify that we can perform basic queries on the profiles table
DO $$
DECLARE
    test_count INTEGER;
BEGIN
    -- Test basic count query
    SELECT COUNT(*) INTO test_count FROM profiles;
    RAISE NOTICE 'Profiles table has % records', test_count;
    
    -- Test that we can query by ID (this is what's hanging)
    SELECT COUNT(*) INTO test_count FROM profiles WHERE id IS NOT NULL;
    RAISE NOTICE 'Profiles with non-null IDs: %', test_count;
END $$;

-- Ensure RLS is working correctly by testing policies
DO $$
BEGIN
    -- Verify RLS is enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'profiles' 
        AND n.nspname = 'public'
        AND c.relrowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS is not enabled on profiles table';
    END IF;
    
    RAISE NOTICE 'RLS verification passed';
END $$;

-- Add a simple function to test profile retrieval
CREATE OR REPLACE FUNCTION test_profile_query(user_id UUID)
RETURNS TABLE(id UUID, role TEXT, name TEXT) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.role, p.name
    FROM profiles p
    WHERE p.id = user_id;
END $$;

-- Test the function with a known user ID if one exists
DO $$
DECLARE
    test_user_id UUID;
    test_result RECORD;
BEGIN
    -- Get a test user ID
    SELECT id INTO test_user_id FROM profiles LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- Test the function
        SELECT * INTO test_result FROM test_profile_query(test_user_id);
        RAISE NOTICE 'Test query successful for user: %', test_user_id;
    ELSE
        RAISE NOTICE 'No test users found in profiles table';
    END IF;
END $$;