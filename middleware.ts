import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase client for middleware
const supabaseUrl = 'https://aifgbbgclcukazrwezwk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZmdiYmdjbGN1a2F6cndlendrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTEzMTQsImV4cCI6MjA2NzY2NzMxNH0.HyjW5fgF6H1NjoOUJUX87NOUdWSG6c9C5Y4DTjvLyZQ'

// Session timeout configuration (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds

function isSessionExpired(lastActivityHeader: string | null): boolean {
  if (!lastActivityHeader) return true
  
  const lastActivity = parseInt(lastActivityHeader, 10)
  if (isNaN(lastActivity)) return true
  
  const now = Date.now()
  return (now - lastActivity) > SESSION_TIMEOUT
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for non-admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow access to login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check for auth session cookies (Supabase auth cookies)
  const authCookie = request.cookies.get('sb-aifgbbgclcukazrwezwk-auth-token') || 
                    request.cookies.get('supabase-auth-token') ||
                    request.cookies.get('sb-access-token')

  if (!authCookie) {
    // No auth cookie found, redirect to login
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Check session expiry using custom header (set by client)
  const lastActivity = request.headers.get('x-admin-last-activity')
  if (lastActivity && isSessionExpired(lastActivity)) {
    // Session expired, redirect to login
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    // Clear the expired session cookie
    response.cookies.delete('sb-aifgbbgclcukazrwezwk-auth-token')
    response.cookies.delete('supabase-auth-token')
    response.cookies.delete('sb-access-token')
    return response
  }

  // Verify the session with Supabase (server-side check)
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${authCookie.value}`,
        },
      },
    })

    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      // Invalid session, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verify user is in admin_users table
    const { data: adminUser, error: dbError } = await supabase
      .from('admin_users')
      .select('id, is_active')
      .eq('email', user.email || '')
      .eq('is_active', true)
      .single()

    if (dbError || !adminUser) {
      // User not authorized as admin, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Valid session and admin user, allow access
    return NextResponse.next()
    
  } catch (error) {
    // Error verifying session, redirect to login for safety
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all admin routes except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/admin/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 