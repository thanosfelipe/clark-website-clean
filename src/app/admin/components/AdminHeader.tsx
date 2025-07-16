'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline'
import { AdminUser } from '@/lib/auth'

interface AdminHeaderProps {
  user: AdminUser | null
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

interface BreadcrumbItem {
  name: string
  href?: string
}

const getPageInfo = (pathname: string): { title: string; breadcrumbs: BreadcrumbItem[] } => {
  if (pathname === '/admin' || pathname === '/admin/') {
    return {
      title: 'Dashboard',
      breadcrumbs: [{ name: 'Dashboard' }]
    }
  }

  if (pathname.startsWith('/admin/forklifts')) {
    if (pathname === '/admin/forklifts') {
      return {
        title: 'Διαχείριση Κλαρκ',
        breadcrumbs: [
          { name: 'Dashboard', href: '/admin' },
          { name: 'Κλαρκ' }
        ]
      }
    }
    if (pathname === '/admin/forklifts/add') {
      return {
        title: 'Προσθήκη Κλαρκ',
        breadcrumbs: [
          { name: 'Dashboard', href: '/admin' },
          { name: 'Κλαρκ', href: '/admin/forklifts' },
          { name: 'Προσθήκη' }
        ]
      }
    }
    if (pathname.includes('/edit/')) {
      return {
        title: 'Επεξεργασία Κλαρκ',
        breadcrumbs: [
          { name: 'Dashboard', href: '/admin' },
          { name: 'Κλαρκ', href: '/admin/forklifts' },
          { name: 'Επεξεργασία' }
        ]
      }
    }
  }

  if (pathname === '/admin/brands') {
    return {
      title: 'Διαχείριση Μαρκών',
      breadcrumbs: [
        { name: 'Dashboard', href: '/admin' },
        { name: 'Μάρκες' }
      ]
    }
  }

  if (pathname === '/admin/categories') {
    return {
      title: 'Διαχείριση Κατηγοριών',
      breadcrumbs: [
        { name: 'Dashboard', href: '/admin' },
        { name: 'Κατηγορίες' }
      ]
    }
  }

  if (pathname === '/admin/subcategories') {
    return {
      title: 'Διαχείριση Υποκατηγοριών',
      breadcrumbs: [
        { name: 'Dashboard', href: '/admin' },
        { name: 'Υποκατηγορίες' }
      ]
    }
  }

  if (pathname === '/admin/fuel-types') {
    return {
      title: 'Τύποι Καυσίμου',
      breadcrumbs: [
        { name: 'Dashboard', href: '/admin' },
        { name: 'Τύποι Καυσίμου' }
      ]
    }
  }

  if (pathname === '/admin/mast-types') {
    return {
      title: 'Τύποι Ιστού',
      breadcrumbs: [
        { name: 'Dashboard', href: '/admin' },
        { name: 'Τύποι Ιστού' }
      ]
    }
  }

  if (pathname === '/admin/analytics') {
    return {
      title: 'Analytics',
      breadcrumbs: [
        { name: 'Dashboard', href: '/admin' },
        { name: 'Analytics' }
      ]
    }
  }

  return {
    title: 'Admin Panel',
    breadcrumbs: [{ name: 'Admin Panel' }]
  }
}

export default function AdminHeader({ user, sidebarOpen, setSidebarOpen }: AdminHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { title, breadcrumbs } = getPageInfo(pathname)

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (item.href) {
      router.push(item.href)
    }
  }

  return (
    <header className="bg-neutral-800 border-b border-neutral-700 px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu button + Page title */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Page title */}
          <div>
            <h1 className="text-xl font-semibold text-white">{title}</h1>
            {breadcrumbs.length > 1 && (
              <nav className="flex items-center space-x-2 text-sm mt-1">
                {breadcrumbs.map((item, index) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    {index > 0 && (
                      <svg
                        className="h-3 w-3 text-neutral-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {item.href ? (
                      <button
                        onClick={() => handleBreadcrumbClick(item)}
                        className="text-neutral-500 hover:text-neutral-300 cursor-pointer transition-colors"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <span className="text-neutral-300">
                        {item.name}
                      </span>
                    )}
                  </div>
                ))}
              </nav>
            )}
          </div>
        </div>

        {/* Right side - User info */}
        <div className="flex items-center space-x-3">
          {user && (
            <div className="flex items-center space-x-3 bg-neutral-700 rounded-lg px-3 py-2">
              <UserCircleIcon className="h-8 w-8 text-violet-400" />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-neutral-400 capitalize">{user.role}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
} 