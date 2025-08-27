'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PlusIcon, PencilIcon, TrashIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { brandQueries } from '@/lib/admin-queries'

interface Brand {
  id: number
  name: string
  logo_url: string | null
  created_at: string | null
  updated_at: string | null
}

export default function BrandsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Load brands on mount
  useEffect(() => {
    loadBrands()
    
    // Check for success message from URL params
    const message = searchParams.get('message')
    if (message) {
      setSuccessMessage(decodeURIComponent(message))
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000)
    }
  }, [searchParams])

  const loadBrands = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const response = await fetch('/api/admin/brands')
      const result = await response.json()

      if (result.success) {
        setBrands(result.data || [])
      } else {
        setError(result.message || 'Σφάλμα φόρτωσης μαρκών')
      }
    } catch (err) {
      console.error('Error loading brands:', err)
      setError('Σφάλμα σύνδεσης κατά τη φόρτωση των μαρκών')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (brandId: number, brandName: string) => {
    if (!confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε τη μάρκα "${brandName}";`)) {
      return
    }

    try {
      setDeletingId(brandId)
      setDeleteError('')

      const response = await fetch(`/api/admin/brands?id=${brandId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        setBrands(prev => prev.filter(brand => brand.id !== brandId))
        setSuccessMessage('Η μάρκα διαγράφηκε επιτυχώς')
        setTimeout(() => setSuccessMessage(''), 5000)
      } else {
        setDeleteError(result.message || 'Σφάλμα διαγραφής μάρκας')
      }
    } catch (err) {
      console.error('Error deleting brand:', err)
      setDeleteError('Σφάλμα σύνδεσης κατά τη διαγραφή')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Μη διαθέσιμο'
    
    try {
      return new Date(dateString).toLocaleDateString('el-GR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Μη έγκυρη ημερομηνία'
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Διαχείριση Μαρκών
          </h1>
          <p className="text-neutral-400">
            Διαχειριστείτε τις μάρκες που χρησιμοποιούνται στα κλαρκ
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/brands/add')}
          className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Προσθήκη Μάρκας</span>
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Delete Error */}
      {deleteError && (
        <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{deleteError}</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Σφάλμα</h3>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={loadBrands}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          >
            Επανάληψη
          </button>
        </div>
      )}

      {/* Empty State */}
      {!error && brands.length === 0 && (
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-8 text-center">
          <BuildingOfficeIcon className="h-16 w-16 text-neutral-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Δεν υπάρχουν μάρκες
          </h3>
          <p className="text-neutral-400 mb-6">
            Δεν έχουν προστεθεί μάρκες ακόμη. Προσθέστε την πρώτη μάρκα για να ξεκινήσετε.
          </p>
          <button
            onClick={() => router.push('/admin/brands/add')}
            className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Προσθήκη Πρώτης Μάρκας</span>
          </button>
        </div>
      )}

      {/* Brands Grid */}
      {!error && brands.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 hover:border-neutral-600 transition-colors"
            >
              {/* Brand Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-neutral-400">
                    ID: {brand.id}
                  </p>
                </div>
                {brand.logo_url && (
                  <div className="w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center ml-4">
                    <img
                      src={brand.logo_url}
                      alt={`${brand.name} logo`}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Brand Details */}
              <div className="space-y-2 mb-4">
                <div>
                  <span className="text-xs text-neutral-500">Δημιουργήθηκε:</span>
                  <p className="text-sm text-neutral-300">{formatDate(brand.created_at)}</p>
                </div>
                <div>
                  <span className="text-xs text-neutral-500">Τελευταία ενημέρωση:</span>
                  <p className="text-sm text-neutral-300">{formatDate(brand.updated_at)}</p>
                </div>
                {brand.logo_url && (
                  <div>
                    <span className="text-xs text-neutral-500">Logo URL:</span>
                    <p className="text-sm text-neutral-300 truncate" title={brand.logo_url}>
                      {brand.logo_url}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => router.push(`/admin/brands/edit/${brand.id}`)}
                  className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-2"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span>Επεξεργασία</span>
                </button>
                <button
                  onClick={() => handleDelete(brand.id, brand.name)}
                  disabled={deletingId === brand.id}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-2"
                >
                  {deletingId === brand.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <TrashIcon className="h-4 w-4" />
                  )}
                  <span>{deletingId === brand.id ? 'Διαγραφή...' : 'Διαγραφή'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {!error && brands.length > 0 && (
        <div className="mt-8 bg-neutral-800 border border-neutral-700 rounded-lg p-4">
          <p className="text-neutral-400 text-center">
            Σύνολο μαρκών: <span className="text-white font-semibold">{brands.length}</span>
          </p>
        </div>
      )}
    </div>
  )
}