'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  TrashIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

export interface ImageData {
  id?: number
  image_url: string
  alt_text?: string
  is_primary: boolean
  sort_order?: number
}

interface ImagePreviewProps {
  images: ImageData[]
  onSetPrimary: (imageUrl: string) => Promise<void>
  onDelete: (imageUrl: string) => Promise<void>
  onView?: (imageUrl: string) => void
  maxImages?: number
  isLoading?: boolean
  disabled?: boolean
}

export default function ImagePreview({
  images = [],
  onSetPrimary,
  onDelete,
  onView,
  maxImages = 3,
  isLoading = false,
  disabled = false
}: ImagePreviewProps) {
  const [deleteModalImage, setDeleteModalImage] = useState<string | null>(null)
  const [isDeletingImage, setIsDeletingImage] = useState(false)
  const [isSettingPrimary, setIsSettingPrimary] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null)

  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => new Set(prev).add(imageUrl))
  }

  const handleImageLoad = (imageUrl: string) => {
    setImageErrors(prev => {
      const newSet = new Set(prev)
      newSet.delete(imageUrl)
      return newSet
    })
  }

  const handleDeleteClick = (imageUrl: string) => {
    setDeleteModalImage(imageUrl)
  }

  const handleDeleteConfirm = async () => {
    if (deleteModalImage && !isDeletingImage) {
      setIsDeletingImage(true)
      try {
        await onDelete(deleteModalImage)
      } finally {
        setIsDeletingImage(false)
        setDeleteModalImage(null)
      }
    }
  }

  const handleSetPrimary = async (imageUrl: string) => {
    if (!disabled && !isLoading && !isSettingPrimary) {
      setIsSettingPrimary(true)
      try {
        await onSetPrimary(imageUrl)
      } finally {
        setIsSettingPrimary(false)
      }
    }
  }

  const handleView = (imageUrl: string) => {
    if (onView) {
      onView(imageUrl)
    }
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-neutral-700 border-2 border-dashed border-neutral-600 rounded-lg p-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-neutral-600 rounded-lg flex items-center justify-center mb-4">
              <EyeIcon className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-300 mb-2">
              Δεν υπάρχουν εικόνες
            </h3>
            <p className="text-neutral-400 text-sm">
              Προσθέστε εικόνες για να τις δείτε εδώ
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* Images count info */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-400">
            {images.length} από {maxImages} εικόνες
          </p>
          {images.length >= maxImages && (
            <p className="text-sm text-amber-400">
              Μέγιστος αριθμός εικόνων
            </p>
          )}
        </div>

        {/* Images grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => {
            const hasError = imageErrors.has(image.image_url)
            
            return (
              <div
                key={image.image_url}
                className={`relative group bg-neutral-700 rounded-lg overflow-hidden border-2 transition-all ${
                  image.is_primary 
                    ? 'border-violet-500 shadow-lg shadow-violet-500/20' 
                    : 'border-neutral-600 hover:border-neutral-500'
                } ${disabled ? 'opacity-50' : ''}`}
              >
                {/* Image container with fixed aspect ratio */}
                <div className="relative aspect-[4/3] bg-neutral-700">
                  {hasError ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <ExclamationTriangleIcon className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <p className="text-xs text-red-400">Σφάλμα φόρτωσης</p>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || `Εικόνα ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={() => handleImageError(image.image_url)}
                      onLoad={() => handleImageLoad(image.image_url)}
                    />
                  )}

                  {/* Primary badge */}
                  {image.is_primary && (
                    <div className="absolute top-2 left-2">
                      <div className="flex items-center bg-violet-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                        <CheckCircleIconSolid className="w-3 h-3 mr-1" />
                        Κύρια
                      </div>
                    </div>
                  )}

                  {/* Loading overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}

                  {/* 3-dot menu for mobile */}
                  <div className="absolute top-2 right-2 sm:hidden z-20">
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(mobileMenuOpen === image.image_url ? null : image.image_url)}
                      className="p-2 bg-black/60 rounded-full hover:bg-black/80 focus:outline-none"
                      aria-label="Ενέργειες εικόνας"
                    >
                      <DotsHorizontalIcon width={20} height={20} className="text-white" />
                    </button>
                  </div>
                  {/* Action buttons overlay (desktop hover, or mobile menu open) */}
                  {!disabled && !isLoading && (
                    <div
                      className={`absolute inset-0 bg-black/50 flex items-center justify-center space-x-2 transition-opacity z-10
                        ${
                          // Show on desktop hover, or if mobile menu for this image is open
                          'opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100' +
                          (mobileMenuOpen === image.image_url ? ' opacity-100' : '')
                        }
                      `}
                    >
                      {/* View button */}
                      {onView && (
                        <button
                          type="button"
                          onClick={() => { handleView(image.image_url); setMobileMenuOpen(null); }}
                          className="p-2 bg-neutral-800/80 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                          title="Προβολή εικόνας"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      )}
                      {/* Set as primary button */}
                      {!image.is_primary && (
                        <button
                          type="button"
                          onClick={() => { handleSetPrimary(image.image_url); setMobileMenuOpen(null); }}
                          disabled={isSettingPrimary || isLoading}
                          className="p-2 bg-violet-500/80 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
                          title="Ορισμός ως κύρια εικόνα"
                        >
                          {isSettingPrimary ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <CheckCircleIcon className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => { handleDeleteClick(image.image_url); setMobileMenuOpen(null); }}
                        className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors"
                        title="Διαγραφή εικόνας"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Image info */}
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-300">
                      Εικόνα {index + 1}
                    </span>
                    {image.is_primary && (
                      <span className="text-xs text-violet-400 font-medium">
                        Κύρια εικόνα
                      </span>
                    )}
                  </div>
                  {image.alt_text && (
                    <p className="text-xs text-neutral-400 mt-1 truncate">
                      {image.alt_text}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Help text */}
        <div className="text-xs text-neutral-500 space-y-1">
          <p>• Κάντε κλικ στο εικονίδιο ✓ για να ορίσετε μια εικόνα ως κύρια</p>
          <p>• Η κύρια εικόνα θα εμφανίζεται πρώτη στη λίστα κλαρκ</p>
          <p>• Μέγιστος αριθμός εικόνων: {maxImages}</p>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteModalImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
              <h3 className="text-lg font-semibold text-white">
                Επιβεβαίωση Διαγραφής
              </h3>
            </div>
            
            <p className="text-neutral-300 mb-6">
              Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την εικόνα; 
              Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
            </p>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => !isDeletingImage && setDeleteModalImage(null)}
                disabled={isDeletingImage}
                className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors"
              >
                Ακύρωση
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeletingImage}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center justify-center space-x-2"
              >
                {isDeletingImage && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>Διαγραφή</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 