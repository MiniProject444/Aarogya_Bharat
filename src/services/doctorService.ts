import { supabase } from '../lib/supabase'
import type { DoctorWithProfile, DoctorAvailability } from '../lib/supabase'

export class DoctorService {
  static async getAllDoctors(): Promise<DoctorWithProfile[]> {
    try {
      console.log('DoctorService: Fetching all doctors...')
      
      // First, let's check if there are any doctors at all
      const { data: doctorCount, error: countError } = await supabase
        .from('doctors')
        .select('id', { count: 'exact' })
      
      console.log('DoctorService: Total doctors in database:', doctorCount?.length || 0)
      
      // Check active doctors specifically
      const { data: activeDoctorCount, error: activeCountError } = await supabase
        .from('doctors')
        .select('id', { count: 'exact' })
        .eq('status', 'active')
      
      console.log('DoctorService: Active doctors in database:', activeDoctorCount?.length || 0)
      
      // Fetch doctors first
      const { data: doctors, error: doctorsError } = await supabase
        .from('doctors')
        .select('*')
        .eq('status', 'active')
        .order('rating', { ascending: false })

      if (doctorsError) {
        console.error('DoctorService: Error fetching doctors:', doctorsError)
        throw doctorsError
      }

      console.log('DoctorService: Fetched doctors:', doctors?.length || 0)

      if (!doctors || doctors.length === 0) {
        console.log('DoctorService: No doctors found')
        return []
      }

      // Get doctor IDs
      const doctorIds = doctors.map(d => d.id)
      console.log('DoctorService: Doctor IDs to fetch profiles for:', doctorIds)

      // Fetch profiles for these specific doctor IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', doctorIds)

      if (profilesError) {
        console.error('DoctorService: Error fetching profiles:', profilesError)
        // Don't throw here, continue without profiles
      }

      console.log('DoctorService: Fetched profiles:', profiles?.length || 0)
      console.log('DoctorService: Profile data sample:', profiles?.[0])

      // If no profiles found, let's check if profiles exist at all for doctors
      if (!profiles || profiles.length === 0) {
        console.log('DoctorService: No profiles found, checking all profiles...')
        
        const { data: allProfiles, error: allProfilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'doctor')

        console.log('DoctorService: All doctor profiles in database:', allProfiles?.length || 0)
        
        if (allProfiles && allProfiles.length > 0) {
          console.log('DoctorService: Sample profile:', allProfiles[0])
          // Use all doctor profiles if they exist
          const matchingProfiles = allProfiles.filter(p => doctorIds.includes(p.id))
          console.log('DoctorService: Matching profiles found:', matchingProfiles.length)
        }
      }

      // Fetch availability for all doctors (optional)
      const { data: availability, error: availabilityError } = await supabase
        .from('doctor_availability')
        .select('*')
        .in('doctor_id', doctorIds)

      if (availabilityError) {
        console.error('DoctorService: Error fetching availability:', availabilityError)
        // Don't throw here, availability is optional
      }

      console.log('DoctorService: Fetched availability records:', availability?.length || 0)

      // Manually join the data
      const doctorsWithProfiles: DoctorWithProfile[] = doctors.map(doctor => {
        const profile = profiles?.find(p => p.id === doctor.id) || null
        const doctorAvailability = availability?.filter(a => a.doctor_id === doctor.id) || []
        
        console.log(`DoctorService: Doctor ${doctor.id} - Profile found: ${profile ? 'Yes' : 'No'}`)
        
        return {
          ...doctor,
          profiles: profile,
          doctor_availability: doctorAvailability
        }
      })

      // For debugging, let's return all doctors even without profiles for now
      // but log which ones are missing profiles
      const validDoctors = doctorsWithProfiles.filter(doctor => doctor.profiles !== null)
      const invalidDoctors = doctorsWithProfiles.filter(doctor => doctor.profiles === null)
      
      console.log('DoctorService: Valid doctors with profiles:', validDoctors.length)
      console.log('DoctorService: Doctors without profiles:', invalidDoctors.length)
      
      if (invalidDoctors.length > 0) {
        console.log('DoctorService: Doctors missing profiles:', invalidDoctors.map(d => d.id))
      }
      
      console.log('DoctorService: Successfully fetched doctors:', validDoctors.length)
      console.log('DoctorService: Doctor data sample:', validDoctors[0])
      
      return validDoctors
    } catch (error) {
      console.error('DoctorService: Get all doctors error:', error)
      return []
    }
  }

  static async getDoctorsBySpecialty(specialty: string): Promise<DoctorWithProfile[]> {
    try {
      console.log('DoctorService: Fetching doctors by specialty:', specialty)
      
      // Use the same manual join approach
      const { data: doctors, error: doctorsError } = await supabase
        .from('doctors')
        .select('*')
        .eq('status', 'active')
        .eq('specialty', specialty)
        .order('rating', { ascending: false })

      if (doctorsError) {
        console.error('DoctorService: Error fetching doctors by specialty:', doctorsError)
        throw doctorsError
      }

      if (!doctors || doctors.length === 0) {
        return []
      }

      const doctorIds = doctors.map(d => d.id)
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', doctorIds)

      if (profilesError) {
        console.error('DoctorService: Error fetching profiles:', profilesError)
      }

      const { data: availability, error: availabilityError } = await supabase
        .from('doctor_availability')
        .select('*')
        .in('doctor_id', doctorIds)

      if (availabilityError) {
        console.error('DoctorService: Error fetching availability:', availabilityError)
      }

      const doctorsWithProfiles: DoctorWithProfile[] = doctors.map(doctor => {
        const profile = profiles?.find(p => p.id === doctor.id) || null
        const doctorAvailability = availability?.filter(a => a.doctor_id === doctor.id) || []
        
        return {
          ...doctor,
          profiles: profile,
          doctor_availability: doctorAvailability
        }
      })

      const validDoctors = doctorsWithProfiles.filter(doctor => doctor.profiles !== null)
      
      console.log('DoctorService: Successfully fetched doctors by specialty:', validDoctors.length)
      return validDoctors
    } catch (error) {
      console.error('DoctorService: Get doctors by specialty error:', error)
      return []
    }
  }

  static async searchDoctors(query: string): Promise<DoctorWithProfile[]> {
    try {
      console.log('DoctorService: Searching doctors with query:', query)
      
      // Search doctors by specialty
      const { data: doctors, error: doctorsError } = await supabase
        .from('doctors')
        .select('*')
        .eq('status', 'active')
        .ilike('specialty', `%${query}%`)
      
      if (doctorsError) {
        console.error('DoctorService: Error searching doctors:', doctorsError)
        throw doctorsError
      }
      
      // Also search by doctor name in profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'doctor')
        .ilike('name', `%${query}%`)
      
      if (profilesError) {
        console.error('DoctorService: Error searching profiles:', profilesError)
        throw profilesError
      }
      
      // Get unique doctor IDs from both searches
      const doctorIds = new Set([
        ...(doctors || []).map(d => d.id),
        ...(profiles || []).map(p => p.id)
      ])
      
      // Fetch complete data for matching doctors
      const { data: allDoctors, error: allDoctorsError } = await supabase
        .from('doctors')
        .select('*')
        .eq('status', 'active')
        .in('id', Array.from(doctorIds))
        .order('rating', { ascending: false })

      if (allDoctorsError) {
        console.error('DoctorService: Error fetching search results:', allDoctorsError)
        throw allDoctorsError
      }

      if (!allDoctors || allDoctors.length === 0) {
        return []
      }

      // Fetch all profiles for the matching doctors
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', Array.from(doctorIds))

      if (allProfilesError) {
        console.error('DoctorService: Error fetching profiles for search:', allProfilesError)
      }

      const { data: availability, error: availabilityError } = await supabase
        .from('doctor_availability')
        .select('*')
        .in('doctor_id', Array.from(doctorIds))

      if (availabilityError) {
        console.error('DoctorService: Error fetching availability for search:', availabilityError)
      }

      const doctorsWithProfiles: DoctorWithProfile[] = allDoctors.map(doctor => {
        const profile = allProfiles?.find(p => p.id === doctor.id) || null
        const doctorAvailability = availability?.filter(a => a.doctor_id === doctor.id) || []
        
        return {
          ...doctor,
          profiles: profile,
          doctor_availability: doctorAvailability
        }
      })

      const validDoctors = doctorsWithProfiles.filter(doctor => doctor.profiles !== null)
      
      console.log('DoctorService: Successfully searched doctors:', validDoctors.length)
      return validDoctors
    } catch (error) {
      console.error('DoctorService: Search doctors error:', error)
      return []
    }
  }

  static async getDoctorAvailability(doctorId: string): Promise<DoctorAvailability[]> {
    try {
      console.log('DoctorService: Fetching availability for doctor:', doctorId)
      
      const { data, error } = await supabase
        .from('doctor_availability')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('day_of_week')

      if (error) {
        console.error('DoctorService: Error fetching doctor availability:', error)
        throw error
      }
      
      console.log('DoctorService: Successfully fetched doctor availability:', data?.length || 0)
      return data || []
    } catch (error) {
      console.error('DoctorService: Get doctor availability error:', error)
      return []
    }
  }

  static async updateDoctorAvailability(
    doctorId: string,
    availability: Omit<DoctorAvailability, 'id' | 'doctor_id'>[]
  ): Promise<boolean> {
    try {
      console.log('DoctorService: Updating availability for doctor:', doctorId)
      
      // Delete existing availability
      const { error: deleteError } = await supabase
        .from('doctor_availability')
        .delete()
        .eq('doctor_id', doctorId)

      if (deleteError) {
        console.error('DoctorService: Error deleting existing availability:', deleteError)
        throw deleteError
      }

      // Insert new availability
      const availabilityData = availability.map(item => ({
        ...item,
        doctor_id: doctorId,
      }))

      const { error: insertError } = await supabase
        .from('doctor_availability')
        .insert(availabilityData)

      if (insertError) {
        console.error('DoctorService: Error inserting new availability:', insertError)
        throw insertError
      }

      console.log('DoctorService: Successfully updated doctor availability')
      return true
    } catch (error) {
      console.error('DoctorService: Update doctor availability error:', error)
      return false
    }
  }

  static async updateDoctorProfile(
    doctorId: string,
    profileData: Partial<{ name: string; phone: string }>,
    doctorData: Partial<{
      specialty: string
      experience: number
      qualifications: string
      registration_number: string
      clinic_address: string
    }>
  ): Promise<boolean> {
    try {
      console.log('DoctorService: Updating profile for doctor:', doctorId)
      
      // Update profile
      if (Object.keys(profileData).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', doctorId)

        if (profileError) {
          console.error('DoctorService: Error updating profile:', profileError)
          throw profileError
        }
      }

      // Update doctor data
      if (Object.keys(doctorData).length > 0) {
        const { error: doctorError } = await supabase
          .from('doctors')
          .update(doctorData)
          .eq('id', doctorId)

        if (doctorError) {
          console.error('DoctorService: Error updating doctor data:', doctorError)
          throw doctorError
        }
      }

      console.log('DoctorService: Successfully updated doctor profile')
      return true
    } catch (error) {
      console.error('DoctorService: Update doctor profile error:', error)
      return false
    }
  }
}