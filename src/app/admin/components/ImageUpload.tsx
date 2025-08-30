'use client'

import { useRef } from 'react'
import { 
  CloudArrowUpIcon, 
  PhotoIcon, 
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useImageManager } from '../../hooks/useImageManager'
import type { ImageUploadResult } from '@/lib/storage'

interface ImageUploadProps {
  forkliftId?: number
  maxFiles?: number
  disabled?: boolean
  onUploadComplete?: (results: ImageUploadResult[]) => void
  onUploadStart?: () => void
  onUploadError?: (error: string) => void
  existingImagesCount?: number
}

export default function ImageUpload({
  forkliftId,
  maxFiles = 3,
  disabled = false,
  onUploadComplete,
  onUploadStart,
  onUploadError,
  existingImagesCount = 0
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    uploadFiles,
    isUploading,
    isDragOver,
    error,
    availableSlots,
    canAddMore,
    addFiles,
    removeUploadFile,
    clearUploadFiles,
    uploadAllFiles,
    setDragOver,
    clearError
  } = useImageManager({
    forkliftId,
    maxFiles,
    existingImagesCount,
    onUploadComplete: (results) => {
      onUploadComplete?.(results)
    },
    onUploadError: (error) => {
      onUploadError?.(error)
    }
  })

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (canAddMore && !disabled) {
      setDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)

    if (!canAddMore || disabled) return

    const files = e.dataTransfer.files
    if (files.length > 0) {
      addFiles(files)
    }
  }

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      addFiles(files)
    }
    // Reset input value
    e.target.value = ''
  }

  const effectiveCanAddMore = canAddMore && !disabled

  return (
    <div className="space-y-4">
      {/* Error display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={clearError}
                className="text-red-300 hover:text-red-200 text-xs mt-1"
              >
                Απόκρυψη
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
          isDragOver && effectiveCanAddMore
            ? 'border-violet-500 bg-violet-500/10' 
            : effectiveCanAddMore
            ? 'border-neutral-600 hover:border-neutral-500' 
            : 'border-neutral-700 bg-neutral-800/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : effectiveCanAddMore ? 'cursor-pointer' : 'cursor-default'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => effectiveCanAddMore && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
          disabled={!effectiveCanAddMore}
        />

        <div className="text-center">
          <CloudArrowUpIcon className={`mx-auto h-12 w-12 mb-4 ${
            effectiveCanAddMore ? 'text-neutral-400' : 'text-neutral-600'
          }`} />
          
          {effectiveCanAddMore ? (
            <>
              <h3 className="text-lg font-medium text-white mb-2">
                Ανεβάστε εικόνες κλαρκ
              </h3>
              <p className="text-neutral-400 mb-4">
                Σύρετε και αφήστε εικόνες εδώ ή κάντε κλικ για επιλογή
              </p>
              <p className="text-sm text-neutral-500">
                Υποστηρίζονται: JPEG, PNG, WebP • Μέγιστο μέγεθος: 10MB
              </p>
              <p className="text-sm text-violet-400 mt-2">
                Διαθέσιμες θέσεις: {availableSlots} από {maxFiles}
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-neutral-500 mb-2">
                {disabled ? 'Ανενεργό' : 'Μέγιστος αριθμός εικόνων'}
              </h3>
              <p className="text-neutral-500">
                {disabled ? 'Η λειτουργία είναι ανενεργή' : `Έχετε φτάσει το όριο των ${maxFiles} εικόνων`}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Upload queue */}
      {uploadFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white">
              Εικόνες προς ανέβασμα ({uploadFiles.length})
            </h4>
            <div className="flex space-x-2">
              {uploadFiles.some(uf => uf.status === 'pending') && (
                <button
                  type="button"
                  onClick={() => {
                    if (onUploadStart) onUploadStart()
                    uploadAllFiles()
                  }}
                  disabled={isUploading || !forkliftId || disabled}
                  className="px-3 py-1 bg-violet-500 hover:bg-violet-600 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
                >
                  {isUploading ? 'Ανέβασμα...' : 'Ανέβασμα όλων'}
                </button>
              )}
              <button
                type="button"
                onClick={clearUploadFiles}
                disabled={isUploading || disabled}
                className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 text-white text-sm rounded transition-colors"
              >
                Καθαρισμός
              </button>
            </div>
          </div>

          {/* Files list */}
          <div className="space-y-2">
            {uploadFiles.map((uploadFile, index) => (
              <div
                key={`${uploadFile.file.name}-${index}`}
                className="flex items-center space-x-4 bg-neutral-800 border border-neutral-700 rounded-lg p-3"
              >
                {/* Preview */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-700 flex-shrink-0">
                  <img
                    src={uploadFile.preview}
                    alt={uploadFile.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {uploadFile.file.name}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  {/* Progress bar */}
                  {uploadFile.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="w-full bg-neutral-700 rounded-full h-2">
                        <div
                          className="bg-violet-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadFile.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        {Math.round(uploadFile.progress)}%
                      </p>
                    </div>
                  )}

                  {/* Error message */}
                  {uploadFile.status === 'error' && uploadFile.error && (
                    <p className="text-xs text-red-400 mt-1">
                      {uploadFile.error}
                    </p>
                  )}
                </div>

                {/* Status icon */}
                <div className="flex-shrink-0">
                  {uploadFile.status === 'pending' && (
                    <PhotoIcon className="w-5 h-5 text-neutral-400" />
                  )}
                  {uploadFile.status === 'uploading' && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-violet-500" />
                  )}
                  {uploadFile.status === 'completed' && (
                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  )}
                  {uploadFile.status === 'error' && (
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                  )}
                </div>

                {/* Remove button */}
                {uploadFile.status !== 'uploading' && (
                  <button
                    type="button"
                    onClick={() => removeUploadFile(index)}
                    disabled={disabled}
                    className="flex-shrink-0 p-1 text-neutral-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    title="Αφαίρεση"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!forkliftId && uploadFiles.length > 0 && (
        <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-amber-400">Προσοχή</h4>
              <p className="text-sm text-amber-300 mt-1">
                Αποθηκεύστε πρώτα το κλαρκ για να ανεβάσετε τις εικόνες.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}