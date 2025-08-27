'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

interface BrandFormProps {
  initialData?: Brand
  isEditing?: boolean
  onSubmit: (data: BrandFormData) => Promise<void>
  isLoading?: boolean
}

export default function BrandForm({ 
  initialData, 
  isEditing = false, 
  onSubmit, 
  isLoading = false 
}: BrandFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    logo_url: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isCheckingUrl, setIsCheckingUrl] = useState(false)
  const [urlPreview, setUrlPreview] = useState<string | null>(null)

  // Initialize form data if editing
  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        name: initialData.name || '',
        logo_url: initialData.logo_url || ''
      })
      
      if (initialData.logo_url) {
        setUrlPreview(initialData.logo_url)
      }
    }
  }, [initialData, isEditing])

  // Preview logo URL
  useEffect(() => {
    if (formData.logo_url.trim()) {
      setUrlPreview(formData.logo_url.trim())
    } else {
      setUrlPreview(null)
    }
  }, [formData.logo_url])

  const handleInputChange = (field: keyof BrandFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Το όνομα μάρκας είναι υποχρεωτικό'
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Το όνομα μάρκας δεν μπορεί να υπερβαίνει τους 100 χαρακτήρες'
    }

    // Optional URL validation
    if (formData.logo_url.trim()) {
      const urlPattern = /^https?:\/\/.+/
      if (!urlPattern.test(formData.logo_url.trim())) {
        newErrors.logo_url = 'Το URL του logo πρέπει να ξεκινά με http:// ή https://'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Clean up data
    const submissionData: BrandFormData = {
      name: formData.name.trim(),
      logo_url: formData.logo_url.trim() || ''
    }

    await onSubmit(submissionData)
  }

  const handleCancel = () => {
    router.push('/admin/brands')
  }

  const handleImageError = () => {
    setUrlPreview(null)
  }

  const handleImageLoad = () => {
    // Image loaded successfully, preview is valid
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Brand Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
          Όνομα Μάρκας *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-3 py-2 bg-neutral-700 border rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
            errors.name ? 'border-red-500' : 'border-neutral-600'
          }`}
          placeholder="π.χ. Toyota, Mitsubishi, Linde"
          disabled={isLoading}
        />
        {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
      </div>

      {/* Logo URL */}
      <div>
        <label htmlFor="logo_url" className="block text-sm font-medium text-neutral-300 mb-2">
          URL Logo (Προαιρετικό)
        </label>
        <input
          type="url"
          id="logo_url"
          value={formData.logo_url}
          onChange={(e) => handleInputChange('logo_url', e.target.value)}
          className={`w-full px-3 py-2 bg-neutral-700 border rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
            errors.logo_url ? 'border-red-500' : 'border-neutral-600'
          }`}
          placeholder="https://example.com/logo.png"
          disabled={isLoading}
        />
        {errors.logo_url && <p className="mt-1 text-sm text-red-400">{errors.logo_url}</p>}
        <p className="mt-1 text-xs text-neutral-400">
          Προαιρετικό: Προσθέστε ένα URL εικόνας για το logo της μάρκας
        </p>
      </div>

      {/* Logo Preview */}
      {urlPreview && (
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Προεπισκόπηση Logo
          </label>
          <div className="bg-neutral-700 border border-neutral-600 rounded-md p-4">
            <div className="flex items-center justify-center w-24 h-24 bg-white rounded-md mx-auto">
              <img
                src={urlPreview}
                alt="Logo preview"
                className="max-w-full max-h-full object-contain"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            </div>
            <p className="text-center text-xs text-neutral-400 mt-2">
              Προεπισκόπηση του logo
            </p>
          </div>
        </div>
      )}

      {/* Timestamps (only shown when editing) */}
      {isEditing && initialData && (
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 space-y-2">
          <h3 className="text-sm font-medium text-neutral-300">Πληροφορίες Εγγραφής</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-neutral-500">Δημιουργήθηκε:</span>
              <p className="text-neutral-300">
                {initialData.created_at 
                  ? new Date(initialData.created_at).toLocaleDateString('el-GR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Μη διαθέσιμο'}
              </p>
            </div>
            <div>
              <span className="text-neutral-500">Τελευταία ενημέρωση:</span>
              <p className="text-neutral-300">
                {initialData.updated_at 
                  ? new Date(initialData.updated_at).toLocaleDateString('el-GR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Μη διαθέσιμο'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-neutral-700">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="px-6 py-2 border border-neutral-600 text-neutral-300 rounded-md hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-colors disabled:opacity-50"
        >
          Ακύρωση
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors flex items-center space-x-2"
        >
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isEditing ? 'Ενημέρωση' : 'Δημιουργία'}</span>
        </button>
      </div>
    </form>
  )
}