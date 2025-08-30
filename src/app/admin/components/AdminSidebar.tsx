'use client'

import { useRouter, usePathname } from 'next/navigation'
import { logoutAdmin } from '@/lib/auth'
import {
  XMarkIcon,
  TruckIcon,
  TagIcon,
  RectangleStackIcon,
  CubeIcon,
  FireIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface AdminSidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<any>
  label: string
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon, label: 'Dashboard' },
  { name: 'Κλαρκ', href: '/admin/forklifts', icon: TruckIcon, label: 'Κλαρκ' },
  { name: 'Μάρκες', href: '/admin/brands', icon: TagIcon, label: 'Μάρκες' }
]

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await logoutAdmin()
    router.push('/admin/login')
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-screen w-16 lg:w-48 bg-neutral-800 border-r border-neutral-700 transform transition-all duration-300 ease-in-out flex flex-col
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-center lg:justify-start h-16 border-b border-neutral-700 flex-shrink-0">
          <div className={`flex items-center ${isOpen ? 'px-4' : 'lg:px-4 justify-center'}`}>
            <TruckIcon className="h-8 w-8 text-violet-500" />
            <span className={`ml-2 text-lg font-semibold text-white ${isOpen ? 'block' : 'hidden lg:block'}`}>
              Admin
            </span>
          </div>
          
          {/* Mobile close button */}
          {isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href + '/'))
            
            return (
              <div key={item.name} className="px-2">
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    w-full flex items-center h-12 rounded-lg transition-all duration-200 group
                    ${isActive 
                      ? 'bg-violet-500 text-white shadow-lg' 
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
                    }
                    ${isOpen ? 'px-3' : 'lg:px-3 justify-center'}
                  `}
                >
                  <Icon className={`
                    h-6 w-6 flex-shrink-0
                    ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'}
                  `} />
                  <span className={`ml-3 text-sm font-medium ${isOpen ? 'block' : 'hidden lg:block'}`}>
                    {item.label}
                  </span>
                </button>
              </div>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-neutral-700 p-2 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center h-12 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group
              ${isOpen ? 'px-3' : 'lg:px-3 justify-center'}
            `}
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6 flex-shrink-0" />
            <span className={`ml-3 text-sm font-medium ${isOpen ? 'block' : 'hidden lg:block'}`}>
              Αποσύνδεση
            </span>
          </button>
        </div>
      </div>
    </>
  )
} 