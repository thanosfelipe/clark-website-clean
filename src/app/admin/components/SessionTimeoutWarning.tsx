'use client'

import { useState, useEffect } from 'react'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { isSessionExpired, updateLastActivity, logoutAdmin } from '@/lib/auth'

interface SessionTimeoutWarningProps {
  onLogout: () => void
}

export default function SessionTimeoutWarning({ onLogout }: SessionTimeoutWarningProps) {
  const [showWarning, setShowWarning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (typeof window === 'undefined') return

      const lastActivity = localStorage.getItem('admin_last_activity')
      if (!lastActivity) return

      const lastAct = parseInt(lastActivity, 10)
      const now = Date.now()
      const sessionTimeout = 30 * 60 * 1000 // 30 minutes
      const warningTime = 5 * 60 * 1000 // Show warning 5 minutes before expiry
      
      const timeUntilExpiry = sessionTimeout - (now - lastAct)
      
      if (timeUntilExpiry <= 0) {
        // Session expired
        handleLogout()
        return
      }
      
      if (timeUntilExpiry <= warningTime && !showWarning) {
        // Show warning
        setShowWarning(true)
      }
      
      if (showWarning) {
        setTimeLeft(Math.ceil(timeUntilExpiry / 1000))
      }
      
    }, 1000) // Check every second when warning is shown

    return () => clearInterval(checkInterval)
  }, [showWarning])

  const handleLogout = async () => {
    setShowWarning(false)
    await logoutAdmin()
    onLogout()
  }

  const handleExtendSession = () => {
    updateLastActivity()
    setShowWarning(false)
    setTimeLeft(0)
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!showWarning) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-neutral-800 rounded-lg border border-orange-500/20 p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              Η συνεδρία σας λήγει σύντομα
            </h3>
            <p className="text-neutral-300 mb-4">
              Η συνεδρία σας θα λήξει σε <span className="font-mono text-orange-400">{formatTime(timeLeft)}</span>. 
              Θα αποσυνδεθείτε αυτόματα για λόγους ασφαλείας.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleExtendSession}
                className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                Επέκταση συνεδρίας
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-neutral-600 hover:bg-neutral-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500"
              >
                Αποσύνδεση τώρα
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setShowWarning(false)}
            className="text-neutral-400 hover:text-neutral-300 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}