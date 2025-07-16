'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import ForkliftForm from '../../../components/ForkliftForm'
import type { ForkliftWithDetails } from '@/lib/admin-queries'
import type { SelectedImageFile } from '../../../components/ImageSelector'

interface ForkliftFormData {
  title: string
  brand_id: number | ''
  category_id: number | ''
  subcategory_id: number | ''
  condition: 'Καινούργιο' | 'Μεταχειρισμένο' | ''
  model_year: number | ''
  fuel_type_id: number | ''
  lifting_capacity_kg: number | ''
  mast_type_id: number | ''
  mast_visibility: string
  max_lift_height_mm: number | ''
  description: string
  price: number | ''
  stock_quantity: number | ''
  is_available: boolean
  selectedImages?: SelectedImageFile[]
}

export default function EditForkliftPage() {
  const router = useRouter()
  const params = useParams()
  const forkliftId = params.id as string
  
  const [forklift, setForklift] = useState<ForkliftWithDetails | null>(null)
  const [isLoadingForklift, setIsLoadingForklift] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Load forklift data
  useEffect(() => {
    const loadForklift = async () => {
      if (!forkliftId || isNaN(Number(forkliftId))) {
        setError('Μη έγκυρο ID κλαρκ')
        setIsLoadingForklift(false)
        return
      }

      try {
        const response = await fetch(`/api/admin/forklifts?id=${forkliftId}`)
        const result = await response.json()

        if (result.success && result.data) {
          setForklift(result.data)
        } else {
          setError(result.message || 'Το κλαρκ δεν βρέθηκε')
        }
      } catch (err) {
        console.error('Error loading forklift:', err)
        setError('Σφάλμα φόρτωσης δεδομένων')
      } finally {
        setIsLoadingForklift(false)
      }
    }

    loadForklift()
  }, [forkliftId])

  const handleSubmit = async (formData: ForkliftFormData) => {
    setIsSubmitting(true)
    setSubmitError('')
    setSuccessMessage('')

    try {
      // Convert empty strings to null for optional numeric fields
      const payload = {
        title: formData.title,
        brand_id: formData.brand_id || null,
        category_id: formData.category_id || null,
        subcategory_id: formData.subcategory_id || null,
        condition: formData.condition || null,
        model_year: formData.model_year || null,
        fuel_type_id: formData.fuel_type_id || null,
        lifting_capacity_kg: formData.lifting_capacity_kg || null,
        mast_type_id: formData.mast_type_id || null,
        mast_visibility: formData.mast_visibility || null,
        max_lift_height_mm: formData.max_lift_height_mm || null,
        description: formData.description || null,
        price: formData.price || null,
        stock_quantity: formData.stock_quantity || 0,
        is_available: formData.is_available
      }

      const response = await fetch(`/api/admin/forklifts?id=${forkliftId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.success) {
        // Reload forklift data to show updated information and images
        const response = await fetch(`/api/admin/forklifts?id=${forkliftId}`)
        const reloadResult = await response.json()

        if (reloadResult.success && reloadResult.data) {
          setForklift(reloadResult.data)
          setSuccessMessage('Το κλαρκ ενημερώθηκε επιτυχώς!')
          setSubmitError('')
          
          // Clear success message after 5 seconds
          setTimeout(() => {
            setSuccessMessage('')
          }, 5000)
        }
      } else {
        setSubmitError(result.message || 'Σφάλμα κατά την ενημέρωση του κλαρκ')
      }
    } catch (err) {
      console.error('Error updating forklift:', err)
      setSubmitError('Σφάλμα σύνδεσης. Παρακαλώ δοκιμάστε ξανά.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state
  if (isLoadingForklift) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 flex items-center space-x-3">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
          <div>
            <h3 className="text-lg font-semibold text-red-400">Σφάλμα</h3>
            <p className="text-red-300">{error}</p>
            <div className="mt-4 space-x-3">
              <button
                onClick={() => router.push('/admin/forklifts')}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors"
              >
                Επιστροφή στη λίστα
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              >
                Επανάληψη
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show form if forklift data is loaded
  if (!forklift) {
    return (
      <div className="p-6">
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Το κλαρκ δεν βρέθηκε
          </h3>
          <p className="text-neutral-400 mb-4">
            Το κλαρκ που ζητήσατε δεν υπάρχει ή έχει διαγραφεί.
          </p>
          <button
            onClick={() => router.push('/admin/forklifts')}
            className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-md transition-colors"
          >
            Επιστροφή στη λίστα
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Επεξεργασία Κλαρκ
        </h1>
        <p className="text-neutral-400">
          Επεξεργαστείτε τα στοιχεία του κλαρκ "{forklift.title}" ({forklift.product_code}).
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Submit Error Message */}
      {submitError && (
        <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{submitError}</p>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
        <ForkliftForm
          initialData={forklift}
          isEditing={true}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  )
} 