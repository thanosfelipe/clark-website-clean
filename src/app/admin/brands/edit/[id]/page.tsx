'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import BrandForm from '../../components/BrandForm'

interface Brand {
  id: number
  name: string
  logo_url: string | null
  created_at: string | null
  updated_at: string | null
}

interface BrandFormData {
  name: string
  logo_url: string
}

export default function EditBrandPage() {
  const router = useRouter()
  const params = useParams()
  const brandId = params.id as string
  
  const [brand, setBrand] = useState<Brand | null>(null)
  const [isLoadingBrand, setIsLoadingBrand] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Load brand data
  useEffect(() => {
    const loadBrand = async () => {
      if (!brandId || isNaN(Number(brandId))) {
        setError('Μη έγκυρο ID μάρκας')
        setIsLoadingBrand(false)
        return
      }

      try {
        const response = await fetch(`/api/admin/brands?id=${brandId}`)
        const result = await response.json()

        if (result.success && result.data) {
          setBrand(result.data)
        } else {
          setError(result.message || 'Η μάρκα δεν βρέθηκε')
        }
      } catch (err) {
        console.error('Error loading brand:', err)
        setError('Σφάλμα φόρτωσης δεδομένων')
      } finally {
        setIsLoadingBrand(false)
      }
    }

    loadBrand()
  }, [brandId])

  const handleSubmit = async (formData: BrandFormData) => {
    setIsSubmitting(true)
    setSubmitError('')
    setSuccessMessage('')

    try {
      // Clean up the data
      const payload = {
        name: formData.name,
        logo_url: formData.logo_url || null
      }

      const response = await fetch(`/api/admin/brands?id=${brandId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.success) {
        // Reload brand data to show updated information
        const reloadResponse = await fetch(`/api/admin/brands?id=${brandId}`)
        const reloadResult = await reloadResponse.json()

        if (reloadResult.success && reloadResult.data) {
          setBrand(reloadResult.data)
          setSuccessMessage('Η μάρκα ενημερώθηκε επιτυχώς!')
          setSubmitError('')
          
          // Clear success message after 5 seconds
          setTimeout(() => {
            setSuccessMessage('')
          }, 5000)
        }
      } else {
        setSubmitError(result.message || 'Σφάλμα κατά την ενημέρωση της μάρκας')
      }
    } catch (err) {
      console.error('Error updating brand:', err)
      setSubmitError('Σφάλμα σύνδεσης. Παρακαλώ δοκιμάστε ξανά.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state
  if (isLoadingBrand) {
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
                onClick={() => router.push('/admin/brands')}
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

  // Show form if brand data is loaded
  if (!brand) {
    return (
      <div className="p-6">
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Η μάρκα δεν βρέθηκε
          </h3>
          <p className="text-neutral-400 mb-4">
            Η μάρκα που ζητήσατε δεν υπάρχει ή έχει διαγραφεί.
          </p>
          <button
            onClick={() => router.push('/admin/brands')}
            className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-md transition-colors"
          >
            Επιστροφή στη λίστα
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Επεξεργασία Μάρκας
        </h1>
        <p className="text-neutral-400">
          Επεξεργαστείτε τα στοιχεία της μάρκας "{brand.name}" (ID: {brand.id}).
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
        <BrandForm
          initialData={brand}
          isEditing={true}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  )
}