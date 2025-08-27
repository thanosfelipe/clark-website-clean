'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getCurrentUser, onAuthStateChange, updateLastActivity, type AdminUser } from '@/lib/auth'
import AdminSidebar from './components/AdminSidebar'
import AdminHeader from './components/AdminHeader'
import SessionTimeoutWarning from './components/SessionTimeoutWarning'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Skip auth check for login page
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoginPage) {
        setIsLoading(false)
        return
      }

      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/admin/login')
          return
        }
        setUser(currentUser)
      } catch (error) {
        router.push('/admin/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Set up auth state change listener with automatic logout
    const { data: authListener } = onAuthStateChange((user) => {
      if (!user && !isLoginPage) {
        setUser(null)
        router.push('/admin/login')
      } else if (user) {
        setUser(user)
      }
    })

    // Clean up listener on unmount
    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [router, isLoginPage])

  // Track activity for session timeout
  useEffect(() => {
    if (!isLoginPage && user) {
      // Update activity on mount
      updateLastActivity()

      // Set up activity tracking
      const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
      
      const handleActivity = () => {
        updateLastActivity()
      }

      // Add event listeners
      activityEvents.forEach(event => {
        document.addEventListener(event, handleActivity, true)
      })

      // Clean up event listeners
      return () => {
        activityEvents.forEach(event => {
          document.removeEventListener(event, handleActivity, true)
        })
      }
    }
  }, [isLoginPage, user])

  // Show loading screen while checking authentication
  if (isLoading && !isLoginPage) {
    return (
      <div className="h-screen bg-neutral-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
          <p className="text-neutral-400">Έλεγχος πρόσβασης...</p>
        </div>
      </div>
    )
  }

  // Render login page without layout
  if (isLoginPage) {
    return <>{children}</>
  }

  // Render admin layout for authenticated users
  if (!user) {
    return null
  }

  return (
    <div className="h-screen bg-neutral-900 flex overflow-hidden">
      {/* Session timeout warning */}
      <SessionTimeoutWarning onLogout={() => {
        setUser(null)
        router.push('/admin/login')
      }} />
      
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:pl-48">
        {/* Header */}
        <AdminHeader 
          user={user} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-neutral-900">
          {children}
        </main>
      </div>
    </div>
  )
} 