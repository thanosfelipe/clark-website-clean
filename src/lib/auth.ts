import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Create Supabase client for authentication
const supabaseUrl = 'https://aifgbbgclcukazrwezwk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZmdiYmdjbGN1a2F6cndlendrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTEzMTQsImV4cCI6MjA2NzY2NzMxNH0.HyjW5fgF6H1NjoOUJUX87NOUdWSG6c9C5Y4DTjvLyZQ'

export const supabaseAuth = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Auth types
export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  is_active: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: AdminUser
  error?: string
}

// Login function
export async function loginAdmin(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabaseAuth.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (authError) {
      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      return { success: false, error: 'Αποτυχία εισόδου' }
    }

    // Verify user exists in admin_users table
    const { data: adminUser, error: dbError } = await supabaseAuth
      .from('admin_users')
      .select('id, email, name, role, is_active')
      .eq('email', credentials.email)
      .eq('is_active', true)
      .single()

    if (dbError || !adminUser) {
      // Sign out from auth if not an admin
      await supabaseAuth.auth.signOut()
      return { success: false, error: 'Δεν έχετε δικαίωμα πρόσβασης στο admin panel' }
    }

    return { 
      success: true, 
      user: {
        id: adminUser.id.toString(),
        email: adminUser.email,
        name: adminUser.name || '',
        role: adminUser.role || 'admin',
        is_active: adminUser.is_active || false
      }
    }
  } catch (error) {
    return { success: false, error: 'Σφάλμα σύνδεσης' }
  }
}

// Logout function
export async function logoutAdmin(): Promise<void> {
  await supabaseAuth.auth.signOut()
}

// Get current session
export async function getCurrentUser(): Promise<AdminUser | null> {
  try {
    const { data: { session } } = await supabaseAuth.auth.getSession()
    
    if (!session?.user) {
      return null
    }

    // Verify user is still active admin
    const { data: adminUser, error } = await supabaseAuth
      .from('admin_users')
      .select('id, email, name, role, is_active')
      .eq('email', session.user.email || '')
      .eq('is_active', true)
      .single()

    if (error || !adminUser) {
      await logoutAdmin()
      return null
    }

    return {
      id: adminUser.id.toString(),
      email: adminUser.email,
      name: adminUser.name || '',
      role: adminUser.role || 'admin',
      is_active: adminUser.is_active || false
    }
  } catch {
    return null
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

// Client-side session management
export function onAuthStateChange(callback: (user: AdminUser | null) => void) {
  return supabaseAuth.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const user = await getCurrentUser()
      callback(user)
    } else if (event === 'SIGNED_OUT') {
      callback(null)
    }
  })
} 