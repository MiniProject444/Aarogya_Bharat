import { supabase } from '../lib/supabase'
import type { EmergencyRequest } from '../lib/supabase'

export interface CreateEmergencyRequestData {
  patientName: string
  age: number
  gender: string
  location: string
  contact: string
  description?: string
}

export class EmergencyService {
  static async createEmergencyRequest(data: CreateEmergencyRequestData): Promise<EmergencyRequest | null> {
    try {
      const { data: emergency, error } = await supabase
        .from('emergency_requests')
        .insert({
          patient_name: data.patientName,
          age: data.age,
          gender: data.gender,
          location: data.location,
          contact: data.contact,
          description: data.description,
        })
        .select()
        .single()

      if (error) throw error
      return emergency
    } catch (error) {
      console.error('Create emergency request error:', error)
      return null
    }
  }

  static async getAllEmergencyRequests(): Promise<EmergencyRequest[]> {
    try {
      const { data, error } = await supabase
        .from('emergency_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get all emergency requests error:', error)
      return []
    }
  }

  static async updateEmergencyStatus(
    requestId: string,
    status: 'pending' | 'dispatched' | 'completed'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('emergency_requests')
        .update({ status })
        .eq('id', requestId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Update emergency status error:', error)
      return false
    }
  }
}