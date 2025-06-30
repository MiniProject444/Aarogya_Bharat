import { supabase } from '../lib/supabase'
import type { Appointment, AppointmentWithDetails } from '../lib/supabase'

export interface CreateAppointmentData {
  doctorId: string
  appointmentDate: string
  appointmentTime: string
  reasonForVisit?: string
}

export class AppointmentService {
  static async createAppointment(
    patientId: string,
    data: CreateAppointmentData
  ): Promise<Appointment | null> {
    try {
      const { data: appointment, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: patientId,
          doctor_id: data.doctorId,
          appointment_date: data.appointmentDate,
          appointment_time: data.appointmentTime,
          reason_for_visit: data.reasonForVisit,
        })
        .select()
        .single()

      if (error) throw error
      return appointment
    } catch (error) {
      console.error('Create appointment error:', error)
      return null
    }
  }

  static async getPatientAppointments(patientId: string): Promise<AppointmentWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctor_profile:doctors!inner(
            profiles!inner(*)
          ),
          doctor:doctors!inner(*)
        `)
        .eq('patient_id', patientId)
        .order('appointment_date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get patient appointments error:', error)
      return []
    }
  }

  static async getDoctorAppointments(doctorId: string): Promise<AppointmentWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient_profile:patients!inner(
            profiles!inner(*)
          )
        `)
        .eq('doctor_id', doctorId)
        .order('appointment_date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get doctor appointments error:', error)
      return []
    }
  }

  static async updateAppointmentStatus(
    appointmentId: string,
    status: 'upcoming' | 'completed' | 'cancelled'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Update appointment status error:', error)
      return false
    }
  }

  static async getAppointmentById(appointmentId: string): Promise<AppointmentWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctor_profile:doctors!inner(
            profiles!inner(*)
          ),
          patient_profile:patients!inner(
            profiles!inner(*)
          ),
          doctor:doctors!inner(*)
        `)
        .eq('id', appointmentId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Get appointment by ID error:', error)
      return null
    }
  }
}