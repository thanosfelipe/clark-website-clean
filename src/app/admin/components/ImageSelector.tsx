'use client'

import { useState, useRef } from 'react'
import { PhotoIcon, XMarkIcon, EyeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'
import Image from 'next/image'

export interface SelectedImageFile {
  file: File
  preview: string
  is_primary: boolean
  sort_order: number
}

interface ImageSelectorProps {
  selectedImages: SelectedImageFile[]
  onImagesChange: (images: SelectedImageFile[]) => void
  maxFiles?: number
  disabled?: boolean
}

export default function ImageSelector({
  selectedImages,
  onImagesChange,
  maxFiles = 3,
  disabled = false
}: ImageSelectorProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files || disabled) return

    const newFiles = Array.from(files).filter(file => {
      // Check file type
      if (!file.type.startsWith('image/')) return false
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) return false
      
      return true
    })

    // Check total count
    const remainingSlots = maxFiles - selectedImages.length
    const filesToAdd = newFiles.slice(0, remainingSlots)

    const newImageFiles: SelectedImageFile[] = filesToAdd.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      is_primary: selectedImages.length === 0 && index === 0, // First image is primary if no existing images
      sort_order: selectedImages.length + index
    }))

    onImagesChange([...selectedImages, ...newImageFiles])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleRemoveImage = (index: number) => {
    const imageToRemove = selectedImages[index]
    
    // Clean up object URL
    URL.revokeObjectURL(imageToRemove.preview)
    
    const updatedImages = selectedImages.filter((_, i) => i !== index)
    
    // If we removed the primary image, make the first remaining image primary
    if (imageToRemove.is_primary && updatedImages.length > 0) {
      updatedImages[0].is_primary = true
    }
    
    // Update sort orders
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      sort_order: i
    }))
    
    onImagesChange(reorderedImages)
  }

  const handleSetPrimary = (index: number) => {
    const updatedImages = selectedImages.map((img, i) => ({
      ...img,
      is_primary: i === index
    }))
    onImagesChange(updatedImages)
  }

  const handleViewImage = (preview: string) => {
    window.open(preview, '_blank')
  }

  const canAddMore = selectedImages.length < maxFiles

  return (
    <div className="space-y-4">
      {/* Selected Images Preview */}
      {selectedImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedImages.map((imageFile, index) => (
            <div key={index} className="relative bg-neutral-700 rounded-lg overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src={imageFile.preview}
                  alt={`Selected image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Primary badge */}
                {imageFile.is_primary && (
                  <div className="absolute top-2 left-2">
                    <div className="flex items-center bg-violet-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                      <CheckCircleIconSolid className="w-3 h-3 mr-1" />
                      Κύρια
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    type="button"
                    onClick={() => handleViewImage(imageFile.preview)}
                    className="p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-md transition-colors"
                    disabled={disabled}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-1.5 bg-black/50 hover:bg-red-600 text-white rounded-md transition-colors"
                    disabled={disabled}
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions bar */}
              <div className="p-3 border-t border-neutral-600">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">
                    {(imageFile.file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                  {!imageFile.is_primary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(index)}
                      className="flex items-center text-xs text-violet-400 hover:text-violet-300 transition-colors"
                      disabled={disabled}
                    >
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Ορισμός ως κύρια
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-violet-500 bg-violet-500/10'
              : disabled
              ? 'border-neutral-600 bg-neutral-800/50'
              : 'border-neutral-600 hover:border-neutral-500 bg-neutral-800'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <PhotoIcon className="mx-auto h-12 w-12 text-neutral-400" />
          <div className="mt-4">
            <p className="text-sm text-neutral-300">
              {selectedImages.length > 0 
                ? `Προσθέστε άλλες ${maxFiles - selectedImages.length} εικόνες`
                : 'Σύρετε εικόνες εδώ ή κάντε κλικ για επιλογή'
              }
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              PNG, JPG, JPEG μέχρι 5MB το καθένα
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-neutral-600 text-white rounded-md transition-colors text-sm"
          >
            Επιλογή αρχείων
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={disabled}
          />
        </div>
      )}

      {/* Image count info */}
      <div className="text-xs text-neutral-500 text-center">
        {selectedImages.length} από {maxFiles} εικόνες επιλεγμένες
      </div>
    </div>
  )
} 