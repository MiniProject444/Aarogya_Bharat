import { supabase } from '../lib/supabase'
import type { Profile, Patient, Doctor } from '../lib/supabase'

export interface SignUpData {
  email: string
  password: string
  name: string
  role: 'patient' | 'doctor'
  phone?: string
  // Patient specific
  age?: number
  gender?: string
  // Doctor specific
  specialty?: string
  experience?: number
  qualifications?: string
  registrationNumber?: string
  address?: string
}

export interface SignInData {
  email: string
  password: string
}

// Helper function to add timeout to promises - increased timeout duration
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ])
}

export class AuthService {
  static async signUp(data: SignUpData) {
    try {
      console.log('AuthService: Starting signup for:', data.email)
      
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        console.error('AuthService: Auth signup error:', authError)
        throw authError
      }
      if (!authData.user) {
        console.error('AuthService: No user returned from signup')
        throw new Error('User creation failed')
      }

      console.log('AuthService: User created:', authData.user.id)

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          role: data.role,
          name: data.name,
          phone: data.phone,
        })

      if (profileError) {
        console.error('AuthService: Profile creation error:', profileError)
        throw profileError
      }

      console.log('AuthService: Profile created successfully')

      // Create role-specific record
      if (data.role === 'patient') {
        const { error: patientError } = await supabase
          .from('patients')
          .insert({
            id: authData.user.id,
            age: data.age,
            gender: data.gender,
          })

        if (patientError) {
          console.error('AuthService: Patient creation error:', patientError)
          throw patientError
        }
        console.log('AuthService: Patient record created successfully')
      } else if (data.role === 'doctor') {
        const { error: doctorError } = await supabase
          .from('doctors')
          .insert({
            id: authData.user.id,
            specialty: data.specialty!,
            experience: data.experience || 0,
            qualifications: data.qualifications,
            registration_number: data.registrationNumber,
            clinic_address: data.address,
            status: 'active', // Explicitly set status to active for new doctors
          })

        if (doctorError) {
          console.error('AuthService: Doctor creation error:', doctorError)
          throw doctorError
        }
        console.log('AuthService: Doctor record created successfully')
      }

      return { user: authData.user, session: authData.session }
    } catch (error) {
      console.error('AuthService: Sign up error:', error)
      throw error
    }
  }

  static async signIn(data: SignInData) {
    try {
      console.log('AuthService: Starting signin for:', data.email)
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        console.error('AuthService: Signin error:', error)
        throw error
      }

      console.log('AuthService: Signin successful for:', authData.user?.id)
      return { user: authData.user, session: authData.session }
    } catch (error) {
      console.error('AuthService: Sign in error:', error)
      throw error
    }
  }

  static async signOut() {
    try {
      console.log('AuthService: Signing out...')
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      console.log('AuthService: Signout successful')
    } catch (error) {
      console.error('AuthService: Sign out error:', error)
      throw error
    }
  }

  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (error) {
      // Check if this is the expected "Auth session missing!" error for unauthenticated users
      if (error instanceof Error && error.message === 'Auth session missing!') {
        console.log('AuthService: No active session found (user not authenticated)')
      } else {
        console.error('AuthService: Get current user error:', error)
      }
      return null
    }
  }

  static async getUserProfile(userId: string): Promise<Profile | null> {
    try {
      console.log('AuthService: Getting profile for user:', userId)
      
      const { data, error } = await withTimeout(
        supabase
          .from('profiles')
          .select('id, role, name, phone, created_at, updated_at')
          .eq('id', userId)
          .maybeSingle(), // Use maybeSingle instead of single to handle no results gracefully
        30000 // Increased timeout to 30 seconds
      )

      if (error) {
        console.error('AuthService: Profile query error:', error)
        throw error
      }
      
      if (!data) {
        console.log('AuthService: No profile found for user:', userId)
        return null
      }
      
      console.log('AuthService: Profile retrieved successfully:', data)
      return data
      
    } catch (error) {
      console.error('AuthService: Get user profile error:', error)
      return null
    }
  }

  static async getPatientData(userId: string): Promise<Patient | null> {
    try {
      console.log('AuthService: Getting patient data for user:', userId)
      
      const { data, error } = await withTimeout(
        supabase
          .from('patients')
          .select('*')
          .eq('id', userId)
          .maybeSingle(),
        30000 // Increased timeout to 30 seconds
      )

      if (error) {
        console.error('AuthService: Get patient data error:', error)
        return null
      }
      
      console.log('AuthService: Patient data retrieved:', data)
      return data
    } catch (error) {
      console.error('AuthService: Get patient data error:', error)
      return null
    }
  }

  static async getDoctorData(userId: string): Promise<Doctor | null> {
    try {
      console.log('AuthService: Getting doctor data for user:', userId)
      
      const { data, error } = await withTimeout(
        supabase
          .from('doctors')
          .select('*')
          .eq('id', userId)
          .maybeSingle(),
        30000 // Increased timeout to 30 seconds
      )

      if (error) {
        console.error('AuthService: Get doctor data error:', error)
        return null
      }
      
      console.log('AuthService: Doctor data retrieved:', data)
      return data
    } catch (error) {
      console.error('AuthService: Get doctor data error:', error)
      return null
    }
  }

  static async getAllPatientsWithProfiles() {
    try {
      console.log('AuthService: Getting all patients with profiles')
      
      const { data, error } = await withTimeout(
        supabase
          .from('profiles')
          .select(`
            id,
            name,
            phone,
            patients (
              age,
              gender,
              blood_group,
              allergies,
              chronic_conditions,
              emergency_contact,
              address
            )
          `)
          .eq('role', 'patient'),
        30000 // Increased timeout to 30 seconds
      )

      if (error) {
        console.error('AuthService: Get all patients error:', error)
        throw error
      }
      
      // Transform the data to match the expected format
      const transformedData = data?.map(profile => ({
        id: profile.id,
        name: profile.name,
        age: profile.patients?.[0]?.age || 0,
        gender: profile.patients?.[0]?.gender || 'Unknown',
        bloodGroup: profile.patients?.[0]?.blood_group || 'Unknown',
        contact: profile.phone || 'No contact',
        medicalHistory: profile.patients?.[0]?.chronic_conditions || 'No medical history recorded.',
      })) || []
      
      console.log('AuthService: All patients retrieved:', transformedData)
      return transformedData
    } catch (error) {
      console.error('AuthService: Get all patients error:', error)
      return []
    }
  }

  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}