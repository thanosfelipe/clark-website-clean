'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BrandForm from '../components/BrandForm'

interface BrandFormData {
  name: string
  logo_url: string
}

export default function AddBrandPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (formData: BrandFormData) => {
    setIsLoading(true)
    setError('')

    try {
      // Clean up the data
      const payload = {
        name: formData.name,
        logo_url: formData.logo_url || null
      }

      console.log('Creating brand with payload:', payload)

      const response = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.message || 'Σφάλμα κατά την προσθήκη της μάρκας')
        return
      }

      console.log('Brand created successfully:', result.data)

      // Navigate back to list with success message
      router.push('/admin/brands?message=' + encodeURIComponent('Η μάρκα προστέθηκε επιτυχώς'))

    } catch (err) {
      console.error('Error creating brand:', err)
      setError('Σφάλμα σύνδεσης. Παρακαλώ δοκιμάστε ξανά.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Προσθήκη Νέας Μάρκας
        </h1>
        <p className="text-neutral-400">
          Συμπληρώστε τα παρακάτω στοιχεία για να προσθέσετε μια νέα μάρκα στη βάση δεδομένων.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
        <BrandForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}