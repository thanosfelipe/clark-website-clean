'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  ExclamationTriangleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import type { ForkliftWithDetails } from '@/lib/admin-queries'

interface ForkliftCardProps {
  forklift: ForkliftWithDetails
  onDelete: (id: number) => void
}

export default function ForkliftCard({ forklift, onDelete }: ForkliftCardProps) {
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Get primary image URL
  const primaryImage = forklift.images?.find(img => img.is_primary)?.image_url || 
                      forklift.images?.[0]?.image_url

  // Debug logging
  console.log('ForkliftCard Debug:', {
    forkliftId: forklift.id,
    title: forklift.title,
    images: forklift.images,
    primaryImage: primaryImage
  })

  const handleEdit = () => {
    router.push(`/admin/forklifts/edit/${forklift.id}`)
  }

  const handleView = () => {
    // Could navigate to a detailed view or open modal
    console.log('View forklift:', forklift.id)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await onDelete(forklift.id)
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Error deleting forklift:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatPrice = (price: number | null) => {
    if (!price) return 'Χωρίς τιμή'
    return new Intl.NumberFormat('el-GR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getStatusColor = (isAvailable: boolean) => {
    return isAvailable 
      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
      : 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  const getStatusText = (isAvailable: boolean) => {
    return isAvailable ? 'Διαθέσιμο' : 'Μη Διαθέσιμο'
  }

  return (
    <>
      <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden hover:bg-neutral-750 transition-colors group">
        {/* Image Section */}
        <div className="relative h-40 sm:h-48 bg-neutral-700">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={forklift.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <PhotoIcon className="h-12 w-12 sm:h-16 sm:w-16 text-neutral-500" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(forklift.is_available || false)}`}>
              {getStatusText(forklift.is_available || false)}
            </span>
          </div>

          {/* Product Code */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-900/80 text-neutral-300 border border-neutral-600">
              {forklift.product_code}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 sm:p-4">
          {/* Title and Brand */}
          <div className="mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-violet-400 transition-colors line-clamp-2 mb-1">
              {forklift.title}
            </h3>
            <p className="text-sm text-neutral-400">
              {forklift.brand?.name || 'Άγνωστη μάρκα'}
            </p>
          </div>

          {/* Specifications - More compact on mobile */}
          <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-neutral-400">Κατάσταση:</span>
              <span className="text-white font-medium">{forklift.condition}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-neutral-400">Ανυψωτική:</span>
              <span className="text-white font-medium">{forklift.lifting_capacity_kg}kg</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-neutral-400">Μέγιστο ύψος:</span>
              <span className="text-white font-medium">{forklift.max_lift_height_mm}mm</span>
            </div>
            {forklift.fuel_type && (
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-neutral-400">Καύσιμο:</span>
                <span className="text-white font-medium">{forklift.fuel_type.name}</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mb-3 sm:mb-4">
            <span className="text-lg sm:text-xl font-bold text-violet-400">
              {formatPrice(forklift.price)}
            </span>
          </div>

          {/* Action Buttons - Stack on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={handleView}
              className="flex items-center justify-center px-3 py-2.5 sm:py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 hover:text-white rounded-md transition-colors touch-manipulation"
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Προβολή</span>
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center justify-center px-3 py-2.5 sm:py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-md transition-colors touch-manipulation"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Επεξεργασία</span>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center justify-center px-3 py-2.5 sm:py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-md transition-colors touch-manipulation sm:w-auto"
            >
              <TrashIcon className="h-4 w-4 sm:mr-0 mr-2" />
              <span className="text-sm font-medium sm:hidden">Διαγραφή</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal - Mobile optimized */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-4 sm:p-6 max-w-md w-full mx-4">
            <div className="flex items-start space-x-3 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                  Επιβεβαίωση Διαγραφής
                </h3>
                <p className="text-sm sm:text-base text-neutral-300">
                  Είστε σίγουροι ότι θέλετε να διαγράψετε το κλαρκ "{forklift.title}"? 
                  Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 sm:py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors disabled:opacity-50 text-sm font-medium touch-manipulation"
              >
                Ακύρωση
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors disabled:opacity-50 text-sm font-medium touch-manipulation"
              >
                {isDeleting ? 'Διαγραφή...' : 'Διαγραφή'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 