import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  role: 'patient' | 'doctor'
  name: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  age?: number
  gender?: string
  blood_group?: string
  allergies?: string
  chronic_conditions?: string
  emergency_contact?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface Doctor {
  id: string
  specialty: string
  experience: number
  qualifications?: string
  registration_number?: string
  clinic_address?: string
  status: 'active' | 'inactive'
  rating: number
  created_at: string
  updated_at: string
}

export interface DoctorAvailability {
  id: string
  doctor_id: string
  day_of_week: string
  start_time: string
  end_time: string
  created_at: string
}

export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  appointment_date: string
  appointment_time: string
  status: 'upcoming' | 'completed' | 'cancelled'
  reason_for_visit?: string
  created_at: string
  updated_at: string
}

export interface Prescription {
  id: string
  patient_id: string
  doctor_id: string
  appointment_id?: string
  diagnosis: string
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
  }>
  advice?: string
  follow_up?: string
  created_at: string
}

export interface EmergencyRequest {
  id: string
  patient_name: string
  age: number
  gender: string
  location: string
  contact: string
  description?: string
  status: 'pending' | 'dispatched' | 'completed'
  created_at: string
}

// Extended types with joined data
export interface DoctorWithProfile extends Doctor {
  profiles: Profile | null
  doctor_availability: DoctorAvailability[]
}

export interface AppointmentWithDetails extends Appointment {
  doctor_profile: Profile
  patient_profile: Profile
  doctor: Doctor
}

export interface PrescriptionWithDetails extends Prescription {
  doctor_profile: Profile
  patient_profile: Profile
}