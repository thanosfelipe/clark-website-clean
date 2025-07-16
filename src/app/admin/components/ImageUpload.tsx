'use client'

import { useState, useRef, useCallback } from 'react'
import { 
  CloudArrowUpIcon, 
  PhotoIcon, 
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { uploadMultipleImages, validateImageFile, type ImageUploadResult, type UploadProgress } from '@/lib/storage'

interface UploadFile {
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'completed' | 'error'
  progress: number
  error?: string
  result?: ImageUploadResult
}

interface ImageUploadProps {
  forkliftId?: number // Optional for new forklifts (will be set later)
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
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)



  const remainingSlots = Math.max(0, maxFiles - existingImagesCount - uploadFiles.length)
  const canAddMore = remainingSlots > 0 && !disabled

  // Create preview URL for file
  const createPreview = (file: File): string => {
    return URL.createObjectURL(file)
  }

  // Clean up preview URLs
  const cleanupPreviews = (files: UploadFile[]) => {
    files.forEach(uploadFile => {
      if (uploadFile.preview.startsWith('blob:')) {
        URL.revokeObjectURL(uploadFile.preview)
      }
    })
  }

  // Add files to upload queue
  const addFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const availableSlots = remainingSlots
    
    if (availableSlots <= 0) {
      onUploadError?.(`Μπορείτε να προσθέσετε μόνο ${maxFiles} εικόνες συνολικά`)
      return
    }

    const filesToAdd = fileArray.slice(0, availableSlots)
    const newUploadFiles: UploadFile[] = []

    for (const file of filesToAdd) {
      // Validate file
      const validation = validateImageFile(file)
      if (!validation.valid) {
        onUploadError?.(validation.error || 'Μη έγκυρη εικόνα')
        continue
      }

      // Check for duplicates
      const isDuplicate = uploadFiles.some(uf => 
        uf.file.name === file.name && uf.file.size === file.size
      )
      
      if (isDuplicate) {
        onUploadError?.(`Η εικόνα "${file.name}" έχει ήδη προστεθεί`)
        continue
      }

      newUploadFiles.push({
        file,
        preview: createPreview(file),
        status: 'pending',
        progress: 0
      })
    }

    if (newUploadFiles.length > 0) {
      setUploadFiles(prev => [...prev, ...newUploadFiles])
    }

    if (filesToAdd.length < fileArray.length) {
      onUploadError?.(`Προστέθηκαν μόνο ${filesToAdd.length} από ${fileArray.length} εικόνες λόγω ορίου`)
    }
  }, [uploadFiles, remainingSlots, maxFiles, onUploadError])

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (canAddMore) {
      setIsDragOver(true)
    }
  }, [canAddMore])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (!canAddMore) return

    const files = e.dataTransfer.files
    if (files.length > 0) {
      addFiles(files)
    }
  }, [canAddMore, addFiles])

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      addFiles(files)
    }
    // Reset input value
    e.target.value = ''
  }

  // Remove file from upload queue
  const removeFile = (index: number) => {
    setUploadFiles(prev => {
      const newFiles = [...prev]
      const removedFile = newFiles.splice(index, 1)[0]
      
      // Cleanup preview URL
      if (removedFile.preview.startsWith('blob:')) {
        URL.revokeObjectURL(removedFile.preview)
      }
      
      return newFiles
    })
  }

  // Upload all files
  const uploadAllFiles = async () => {
    if (!forkliftId) {
      onUploadError?.('Αποθηκεύστε πρώτα το κλαρκ για να ανεβάσετε εικόνες')
      return
    }

    if (uploadFiles.length === 0) return

    setIsUploading(true)
    onUploadStart?.()

    try {
      const filesToUpload = uploadFiles.filter(uf => uf.status === 'pending').map(uf => uf.file)
      
      // Update status to uploading
      setUploadFiles(prev => prev.map(uf => 
        uf.status === 'pending' ? { ...uf, status: 'uploading' as const } : uf
      ))

      const results = await uploadMultipleImages(
        filesToUpload,
        forkliftId,
        (fileIndex, progress) => {
          // Update progress for specific file
          setUploadFiles(prev => prev.map((uf, index) => {
            if (index === fileIndex && uf.status === 'uploading') {
              return { ...uf, progress: progress.percentage }
            }
            return uf
          }))
        }
      )

      // Update files with results
      setUploadFiles(prev => prev.map((uf, index) => {
        if (uf.status === 'uploading' && results[index]) {
          return {
            ...uf,
            status: 'completed' as const,
            progress: 100,
            result: results[index]
          }
        }
        return uf
      }))

      // Save metadata to database
      try {
        const imagePayload = {
          forklift_id: forkliftId,
          images: results.map((result, index) => ({
            image_url: result.url,
            alt_text: `Εικόνα ${existingImagesCount + index + 1}`,
            is_primary: false, // New images are not primary by default
            sort_order: existingImagesCount + index
          }))
        }

        const imageResponse = await fetch('/api/admin/forklift-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(imagePayload)
        })

        const imageResult = await imageResponse.json()
        
        if (imageResult.success) {
          onUploadComplete?.(results)
        } else {
          // Still call onUploadComplete so UI shows the images, but show warning
          onUploadComplete?.(results)
          onUploadError?.(`Προειδοποίηση: Οι εικόνες ανέβηκαν αλλά τα metadata δεν αποθηκεύτηκαν: ${imageResult.message}`)
        }
      } catch (error) {
        // Still call onUploadComplete so UI shows the images, but show warning
        onUploadComplete?.(results)
        onUploadError?.(`Προειδοποίηση: Οι εικόνες ανέβηκαν αλλά τα metadata δεν αποθηκεύτηκαν: ${error instanceof Error ? error.message : 'Άγνωστο σφάλμα'}`)
      }

      // Clear completed files after a delay
      setTimeout(() => {
        setUploadFiles(prev => {
          const completedFiles = prev.filter(uf => uf.status === 'completed')
          cleanupPreviews(completedFiles)
          return prev.filter(uf => uf.status !== 'completed')
        })
      }, 2000)

    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Σφάλμα ανεβάσματος εικόνων'
      
      // Mark files as error
      setUploadFiles(prev => prev.map(uf => 
        uf.status === 'uploading' ? { 
          ...uf, 
          status: 'error' as const, 
          error: errorMessage 
        } : uf
      ))

      onUploadError?.(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  // Clear all files
  const clearAll = () => {
    cleanupPreviews(uploadFiles)
    setUploadFiles([])
  }

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
          isDragOver && canAddMore
            ? 'border-violet-500 bg-violet-500/10' 
            : canAddMore
            ? 'border-neutral-600 hover:border-neutral-500' 
            : 'border-neutral-700 bg-neutral-800/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => canAddMore && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
          disabled={!canAddMore}
        />

        <div className="text-center">
          <CloudArrowUpIcon className={`mx-auto h-12 w-12 mb-4 ${
            canAddMore ? 'text-neutral-400' : 'text-neutral-600'
          }`} />
          
          {canAddMore ? (
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
                Διαθέσιμες θέσεις: {remainingSlots} από {maxFiles}
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-neutral-500 mb-2">
                Μέγιστος αριθμός εικόνων
              </h3>
              <p className="text-neutral-500">
                Έχετε φτάσει το όριο των {maxFiles} εικόνων
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
                   onClick={uploadAllFiles}
                   disabled={isUploading || !forkliftId}
                  className="px-3 py-1 bg-violet-500 hover:bg-violet-600 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
                >
                  {isUploading ? 'Ανέβασμα...' : 'Ανέβασμα όλων'}
                </button>
              )}
              <button
                type="button"
                onClick={clearAll}
                disabled={isUploading}
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
                    onClick={() => removeFile(index)}
                    className="flex-shrink-0 p-1 text-neutral-400 hover:text-red-400 transition-colors"
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