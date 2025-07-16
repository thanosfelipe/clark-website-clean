import { NextRequest, NextResponse } from 'next/server'

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
  const hasAuthCookie = request.cookies.has('sb-aifgbbgclcukazrwezwk-auth-token') || 
                       request.cookies.has('supabase-auth-token') ||
                       request.cookies.has('sb-access-token')

  if (!hasAuthCookie) {
    // No auth cookie found, redirect to login
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // For now, allow access if auth cookie exists
  // The actual authentication verification will happen in the page components
  return NextResponse.next()
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