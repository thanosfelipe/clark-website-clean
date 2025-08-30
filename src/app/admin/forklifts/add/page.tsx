'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ForkliftForm from '../../components/ForkliftForm'
import { uploadMultipleImages } from '@/lib/storage'
import type { SelectedImageFile } from '../../components/ImageSelector'

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

export default function AddForkliftPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (formData: ForkliftFormData) => {
    setIsLoading(true)
    setError('')

    try {
      // Step 1: Create the forklift
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

      console.log('Creating forklift with payload:', payload)

      const response = await fetch('/api/admin/forklifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.message || 'Σφάλμα κατά την προσθήκη του κλαρκ')
        return
      }

      const createdForklift = result.data
      console.log('Forklift created:', createdForklift)

      // Step 2: Upload images if any were selected
      let imageUploadSuccess = true
      if (formData.selectedImages && formData.selectedImages.length > 0) {
        console.log(`Starting upload of ${formData.selectedImages.length} images for forklift ID ${createdForklift.id}`)
        
        try {
          const files = formData.selectedImages.map(img => img.file)
          
          // Upload images to storage
          const uploadResults = await uploadMultipleImages(
            files,
            createdForklift.id,
            (fileIndex, progress) => {
              console.log(`Upload progress for file ${fileIndex}: ${progress.percentage}%`)
            }
          )

          console.log('Images uploaded to storage successfully:', uploadResults.length)

          // Save image metadata to database
          const imagePayload = {
            forklift_id: createdForklift.id,
            images: uploadResults.map((result, index) => ({
              image_url: result.url,
              alt_text: `${formData.title} - Εικόνα ${index + 1}`,
              is_primary: formData.selectedImages![index].is_primary,
              sort_order: formData.selectedImages![index].sort_order
            }))
          }

          console.log('Saving image metadata to database:', imagePayload)

          const imageResponse = await fetch('/api/admin/forklift-images', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(imagePayload)
          })

          if (!imageResponse.ok) {
            throw new Error(`HTTP ${imageResponse.status}: ${imageResponse.statusText}`)
          }

          const imageResult = await imageResponse.json()
          console.log('Image metadata save result:', imageResult)
          
          if (!imageResult.success) {
            console.warn('Warning: Images uploaded but metadata could not be saved:', imageResult.message)
            imageUploadSuccess = false
          } else {
            console.log('All image operations completed successfully')
          }

        } catch (imageError) {
          console.error('Error in image upload process:', imageError)
          imageUploadSuccess = false
          // Don't fail the entire operation - forklift was created successfully
        }
        
        // Clean up object URLs regardless of success/failure
        try {
          formData.selectedImages.forEach(img => {
            if (img.preview && img.preview.startsWith('blob:')) {
              URL.revokeObjectURL(img.preview)
            }
          })
        } catch (cleanupError) {
          console.warn('Error cleaning up object URLs:', cleanupError)
        }
      } else {
        console.log('No images selected for upload')
      }

      // Navigate back to list with appropriate message
      const message = imageUploadSuccess 
        ? 'Το κλαρκ προστέθηκε επιτυχώς μαζί με τις εικόνες'
        : formData.selectedImages && formData.selectedImages.length > 0
          ? 'Το κλαρκ προστέθηκε επιτυχώς αλλά υπήρξε πρόβλημα με τις εικόνες'
          : 'Το κλαρκ προστέθηκε επιτυχώς'
      
      console.log('Redirecting to forklift list with message:', message)
      router.push(`/admin/forklifts?message=${encodeURIComponent(message)}`)

    } catch (err) {
      console.error('Error creating forklift:', err)
      setError('Σφάλμα σύνδεσης. Παρακαλώ δοκιμάστε ξανά.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Προσθήκη Νέου Κλαρκ
        </h1>
        <p className="text-neutral-400">
          Συμπληρώστε τα παρακάτω στοιχεία για να προσθέσετε ένα νέο κλαρκ στη βάση δεδομένων.
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
        <ForkliftForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
} 