import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { AuthService } from '../services/authService'
import type { Profile, Patient, Doctor } from '../lib/supabase'

export type UserRole = 'patient' | 'doctor'

interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  profile?: Profile
  patientData?: Patient
  doctorData?: Doctor
}

interface SignUpResult {
  success: boolean
  error?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signUp: (data: any) => Promise<SignUpResult>
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUserData = async (authUser: User) => {
    try {
      console.log('Loading user data for:', authUser.id)
      
      // Set a maximum time limit for the entire operation - increased to 30 seconds
      const loadingTimeout = setTimeout(() => {
        console.error('User data loading timed out after 30 seconds')
        setLoading(false)
      }, 30000)
      
      const profile = await AuthService.getUserProfile(authUser.id)
      
      // Clear the timeout since we got a response
      clearTimeout(loadingTimeout)
      
      if (!profile) {
        console.log('No profile found for user:', authUser.id)
        setLoading(false)
        return null
      }

      console.log('Profile loaded:', profile)

      let userData: AuthUser = {
        id: authUser.id,
        email: authUser.email || '',
        name: profile.name,
        role: profile.role,
        profile
      }

      // Load role-specific data with longer timeouts and better error handling
      try {
        if (profile.role === 'patient') {
          const patientData = await AuthService.getPatientData(authUser.id)
          userData.patientData = patientData || undefined
          console.log('Patient data loaded:', patientData)
        } else if (profile.role === 'doctor') {
          const doctorData = await AuthService.getDoctorData(authUser.id)
          userData.doctorData = doctorData || undefined
          console.log('Doctor data loaded:', doctorData)
        }
      } catch (roleDataError) {
        console.error('Error loading role-specific data:', roleDataError)
        // Continue without role-specific data - it's optional
      }

      return userData
    } catch (error) {
      console.error('Error loading user data:', error)
      setLoading(false)
      return null
    }
  }

  const refreshUserData = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser()
      if (currentUser) {
        const userData = await loadUserData(currentUser)
        setUser(userData)
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...')
        const currentUser = await AuthService.getCurrentUser()
        if (currentUser) {
          console.log('Current user found:', currentUser.id)
          const userData = await loadUserData(currentUser)
          setUser(userData)
        } else {
          console.log('No current user found')
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id)
        
        if (event === 'SIGNED_IN' && session?.user) {
          setLoading(true)
          const userData = await loadUserData(session.user)
          setUser(userData)
          setLoading(false)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (data: any): Promise<SignUpResult> => {
    try {
      setLoading(true)
      console.log('Starting signup process...')
      
      const result = await AuthService.signUp(data)
      if (result.user) {
        console.log('User created successfully:', result.user.id)
        const userData = await loadUserData(result.user)
        setUser(userData)
        return { success: true }
      }
      return { success: false, error: 'Failed to create account. Please try again.' }
    } catch (error: any) {
      console.error('Sign up error:', error)
      
      // Extract specific error message from Supabase error
      let errorMessage = 'An error occurred. Please try again.'
      
      if (error?.message) {
        if (error.message.includes('User already registered') || error.message.includes('user_already_exists')) {
          errorMessage = 'An account with this email already exists. Please try signing in instead.'
        } else {
          errorMessage = error.message
        }
      }
      
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      console.log('Starting signin process for:', email)
      
      const result = await AuthService.signIn({ email, password })
      if (result.user) {
        console.log('User signed in successfully:', result.user.id)
        const userData = await loadUserData(result.user)
        if (userData) {
          setUser(userData)
          console.log('User data loaded and set:', userData)
          return true
        } else {
          console.error('Failed to load user data after signin')
          return false
        }
      }
      console.error('No user returned from signin')
      return false
    } catch (error) {
      console.error('Sign in error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      await AuthService.signOut()
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      refreshUserData,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}