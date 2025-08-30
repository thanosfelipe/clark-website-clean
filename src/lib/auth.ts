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

    // Initialize session tracking
    setLoginTime()
    updateLastActivity()

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
  stopActivityMonitoring()
  clearSessionStorage()
  await supabaseAuth.auth.signOut()
}

// Get current session
export async function getCurrentUser(): Promise<AdminUser | null> {
  try {
    const { data: { session } } = await supabaseAuth.auth.getSession()
    
    if (!session?.user) {
      console.log('No session found')
      return null
    }

    // Check if session has expired
    if (isSessionExpired()) {
      console.log('Session expired, logging out')
      // Clear storage immediately but don't call full logout to avoid loops
      clearSessionStorage()
      await supabaseAuth.auth.signOut()
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
      console.log('User not found in admin_users or not active:', error?.message)
      // Clear storage and sign out
      clearSessionStorage()
      await supabaseAuth.auth.signOut()
      return null
    }

    // Update activity on successful auth check
    updateLastActivity()

    return {
      id: adminUser.id.toString(),
      email: adminUser.email,
      name: adminUser.name || '',
      role: adminUser.role || 'admin',
      is_active: adminUser.is_active || false
    }
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

// Session timeout configuration (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
const ACTIVITY_CHECK_INTERVAL = 60 * 1000 // Check every minute
const LOCAL_STORAGE_KEYS = {
  LAST_ACTIVITY: 'admin_last_activity',
  LOGIN_TIME: 'admin_login_time'
}

// Activity tracking
let activityCheckInterval: NodeJS.Timeout | null = null
let lastActivity = Date.now()

// Update last activity timestamp
export function updateLastActivity(): void {
  lastActivity = Date.now()
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_ACTIVITY, lastActivity.toString())
  }
}

// Get last activity timestamp
function getLastActivity(): number {
  if (typeof window === 'undefined') return Date.now()
  
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_ACTIVITY)
  return stored ? parseInt(stored, 10) : Date.now()
}

// Check if session has expired
export function isSessionExpired(): boolean {
  // If we're on the server side or localStorage is not available, don't consider it expired
  if (typeof window === 'undefined') return false
  
  const lastAct = getLastActivity()
  const now = Date.now()
  return (now - lastAct) > SESSION_TIMEOUT
}

// Set login timestamp
function setLoginTime(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEYS.LOGIN_TIME, Date.now().toString())
  }
}

// Clear session storage
function clearSessionStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.LAST_ACTIVITY)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.LOGIN_TIME)
  }
}

// Start activity monitoring
function startActivityMonitoring(onTimeout: () => void): void {
  if (activityCheckInterval) {
    clearInterval(activityCheckInterval)
  }

  activityCheckInterval = setInterval(() => {
    if (isSessionExpired()) {
      stopActivityMonitoring()
      onTimeout()
    }
  }, ACTIVITY_CHECK_INTERVAL)

  // Track user activity
  if (typeof window !== 'undefined') {
    const activities = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    const handleActivity = () => {
      updateLastActivity()
    }

    activities.forEach(activity => {
      document.addEventListener(activity, handleActivity, true)
    })
  }
}

// Stop activity monitoring
function stopActivityMonitoring(): void {
  if (activityCheckInterval) {
    clearInterval(activityCheckInterval)
    activityCheckInterval = null
  }
}

// Client-side session management with timeout
export function onAuthStateChange(callback: (user: AdminUser | null) => void) {
  return supabaseAuth.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const user = await getCurrentUser()
      if (user) {
        setLoginTime()
        updateLastActivity()
        startActivityMonitoring(async () => {
          await logoutAdmin()
          callback(null)
        })
      }
      callback(user)
    } else if (event === 'SIGNED_OUT') {
      stopActivityMonitoring()
      clearSessionStorage()
      callback(null)
    }
  })
} 