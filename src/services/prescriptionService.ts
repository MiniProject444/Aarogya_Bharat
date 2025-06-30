import { supabase } from '../lib/supabase'
import type { Prescription, PrescriptionWithDetails } from '../lib/supabase'

export interface CreatePrescriptionData {
  patientId: string
  appointmentId?: string
  diagnosis: string
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
  }>
  advice?: string
  followUp?: string
}

export class PrescriptionService {
  static async createPrescription(
    doctorId: string,
    data: CreatePrescriptionData
  ): Promise<Prescription | null> {
    try {
      const { data: prescription, error } = await supabase
        .from('prescriptions')
        .insert({
          doctor_id: doctorId,
          patient_id: data.patientId,
          appointment_id: data.appointmentId,
          diagnosis: data.diagnosis,
          medications: data.medications,
          advice: data.advice,
          follow_up: data.followUp,
        })
        .select()
        .single()

      if (error) throw error
      return prescription
    } catch (error) {
      console.error('Create prescription error:', error)
      return null
    }
  }

  static async getPatientPrescriptions(patientId: string): Promise<PrescriptionWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          doctor_profile:doctors!inner(
            profiles!inner(*)
          )
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get patient prescriptions error:', error)
      return []
    }
  }

  static async getDoctorPrescriptions(doctorId: string): Promise<PrescriptionWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          patient_profile:patients!inner(
            profiles!inner(*)
          )
        `)
        .eq('doctor_id', doctorId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get doctor prescriptions error:', error)
      return []
    }
  }

  static async getPrescriptionById(prescriptionId: string): Promise<PrescriptionWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          doctor_profile:doctors!inner(
            profiles!inner(*)
          ),
          patient_profile:patients!inner(
            profiles!inner(*)
          )
        `)
        .eq('id', prescriptionId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Get prescription by ID error:', error)
      return null
    }
  }

  static async updatePrescription(
    prescriptionId: string,
    data: Partial<CreatePrescriptionData>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('prescriptions')
        .update({
          diagnosis: data.diagnosis,
          medications: data.medications,
          advice: data.advice,
          follow_up: data.followUp,
        })
        .eq('id', prescriptionId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Update prescription error:', error)
      return false
    }
  }
}