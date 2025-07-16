'use client'

import { useRouter } from 'next/navigation'
import {
  TruckIcon,
  TagIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

export default function AdminDashboard() {
  const router = useRouter()

  const quickActions = [
    {
      name: 'Προσθήκη Κλαρκ',
      description: 'Προσθέστε νέο κλαρκ στη βάση δεδομένων',
      href: '/admin/forklifts/add',
      icon: PlusIcon,
      color: 'violet'
    },
    {
      name: 'Διαχείριση Μαρκών',
      description: 'Προσθέστε ή επεξεργαστείτε μάρκες',
      href: '/admin/brands',
      icon: TagIcon,
      color: 'blue'
    },
    {
      name: 'Προβολή Gallery',
      description: 'Δείτε πώς φαίνονται τα κλαρκ στο frontend',
      href: '/gallery',
      icon: EyeIcon,
      color: 'green'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-violet-500/10 to-violet-600/10 border border-violet-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Καλώς ήρθατε στο Dashboard! 👋
            </h1>
            <p className="text-neutral-300">
              Παρακολουθήστε την απόδοση και διαχειριστείτε το σύστημά σας από εδώ.
            </p>
          </div>
          <div className="hidden lg:block">
            <TruckIcon className="h-16 w-16 text-violet-500/50" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Γρήγορες Ενέργειες</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <div
                key={action.name}
                onClick={() => router.push(action.href)}
                className="bg-neutral-700 border border-neutral-600 rounded-lg p-6 hover:bg-neutral-650 cursor-pointer transition-colors group"
              >
                <div className={`inline-flex p-3 rounded-lg bg-${action.color}-500/10 mb-4`}>
                  <Icon className={`h-6 w-6 text-${action.color}-500`} />
                </div>
                <h4 className="text-white font-medium mb-2 group-hover:text-violet-400 transition-colors">
                  {action.name}
                </h4>
                <p className="text-neutral-400 text-sm">
                  {action.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 