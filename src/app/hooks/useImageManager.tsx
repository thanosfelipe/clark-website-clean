'use client'

import { useReducer, useCallback, useRef, useEffect } from 'react'
import { uploadMultipleImages, deleteImage as deleteImageFromStorage, extractStoragePath, validateImageFile } from '@/lib/storage'
import type { ImageUploadResult } from '@/lib/storage'

// Types
export interface ImageData {
  id?: number
  image_url: string
  alt_text?: string
  is_primary: boolean
  sort_order: number
}

export interface UploadFile {
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'completed' | 'error'
  progress: number
  error?: string
  result?: ImageUploadResult
}

interface ImageManagerState {
  // Existing images (for edit mode)
  images: ImageData[]
  // Files queued for upload
  uploadFiles: UploadFile[]
  // Operation states
  isUploading: boolean
  isDeleting: boolean
  isSettingPrimary: boolean
  // Error states
  error: string | null
  // Success states
  successMessage: string | null
  // Drag state
  isDragOver: boolean
}

type ImageManagerAction =
  | { type: 'SET_IMAGES'; payload: ImageData[] }
  | { type: 'ADD_UPLOAD_FILES'; payload: UploadFile[] }
  | { type: 'REMOVE_UPLOAD_FILE'; payload: number }
  | { type: 'UPDATE_UPLOAD_FILE'; payload: { index: number; updates: Partial<UploadFile> } }
  | { type: 'CLEAR_UPLOAD_FILES' }
  | { type: 'SET_UPLOADING'; payload: boolean }
  | { type: 'SET_DELETING'; payload: boolean }
  | { type: 'SET_SETTING_PRIMARY'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SUCCESS'; payload: string | null }
  | { type: 'SET_DRAG_OVER'; payload: boolean }
  | { type: 'SET_PRIMARY_IMAGE'; payload: string }
  | { type: 'REMOVE_IMAGE'; payload: string }
  | { type: 'RESET_STATE' }

const initialState: ImageManagerState = {
  images: [],
  uploadFiles: [],
  isUploading: false,
  isDeleting: false,
  isSettingPrimary: false,
  error: null,
  successMessage: null,
  isDragOver: false
}

function imageManagerReducer(state: ImageManagerState, action: ImageManagerAction): ImageManagerState {
  switch (action.type) {
    case 'SET_IMAGES':
      return { ...state, images: action.payload }
    
    case 'ADD_UPLOAD_FILES':
      return { ...state, uploadFiles: [...state.uploadFiles, ...action.payload], error: null }
    
    case 'REMOVE_UPLOAD_FILE':
      return {
        ...state,
        uploadFiles: state.uploadFiles.filter((_, index) => index !== action.payload)
      }
    
    case 'UPDATE_UPLOAD_FILE':
      return {
        ...state,
        uploadFiles: state.uploadFiles.map((file, index) =>
          index === action.payload.index ? { ...file, ...action.payload.updates } : file
        )
      }
    
    case 'CLEAR_UPLOAD_FILES':
      return { ...state, uploadFiles: [] }
    
    case 'SET_UPLOADING':
      return { ...state, isUploading: action.payload }
    
    case 'SET_DELETING':
      return { ...state, isDeleting: action.payload }
    
    case 'SET_SETTING_PRIMARY':
      return { ...state, isSettingPrimary: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, successMessage: null }
    
    case 'SET_SUCCESS':
      return { ...state, successMessage: action.payload, error: null }
    
    case 'SET_DRAG_OVER':
      return { ...state, isDragOver: action.payload }
    
    case 'SET_PRIMARY_IMAGE':
      return {
        ...state,
        images: state.images.map(img => ({
          ...img,
          is_primary: img.image_url === action.payload
        }))
      }
    
    case 'REMOVE_IMAGE':
      return {
        ...state,
        images: state.images.filter(img => img.image_url !== action.payload)
      }
    
    case 'RESET_STATE':
      return { ...initialState }
    
    default:
      return state
  }
}

export interface UseImageManagerOptions {
  forkliftId?: number
  maxFiles?: number
  existingImagesCount?: number
  onUploadComplete?: (results: ImageUploadResult[]) => void
  onUploadError?: (error: string) => void
  onDeleteComplete?: () => void
  onSetPrimaryComplete?: () => void
}

export function useImageManager({
  forkliftId,
  maxFiles = 3,
  existingImagesCount = 0,
  onUploadComplete,
  onUploadError,
  onDeleteComplete,
  onSetPrimaryComplete
}: UseImageManagerOptions = {}) {
  const [state, dispatch] = useReducer(imageManagerReducer, initialState)
  
  // Cleanup refs
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const successTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Cleanup function for object URLs
  const cleanupPreviews = useCallback((files: UploadFile[]) => {
    files.forEach(uploadFile => {
      if (uploadFile.preview.startsWith('blob:')) {
        URL.revokeObjectURL(uploadFile.preview)
      }
    })
  }, [])

  // Initialize images
  const setImages = useCallback((images: ImageData[]) => {
    dispatch({ type: 'SET_IMAGES', payload: images })
  }, [])

  // Add files to upload queue
  const addFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const currentAvailableSlots = Math.max(0, maxFiles - existingImagesCount - state.uploadFiles.length)
    
    if (currentAvailableSlots <= 0) {
      dispatch({ type: 'SET_ERROR', payload: `Μπορείτε να προσθέσετε μόνο ${maxFiles} εικόνες συνολικά` })
      return
    }

    const filesToAdd = fileArray.slice(0, currentAvailableSlots)
    const newUploadFiles: UploadFile[] = []

    for (const file of filesToAdd) {
      // Validate file
      const validation = validateImageFile(file)
      if (!validation.valid) {
        dispatch({ type: 'SET_ERROR', payload: validation.error || 'Μη έγκυρη εικόνα' })
        continue
      }

      // Check for duplicates
      const isDuplicate = state.uploadFiles.some(uf => 
        uf.file.name === file.name && uf.file.size === file.size
      )
      
      if (isDuplicate) {
        dispatch({ type: 'SET_ERROR', payload: `Η εικόνα "${file.name}" έχει ήδη προστεθεί` })
        continue
      }

      newUploadFiles.push({
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
        progress: 0
      })
    }

    if (newUploadFiles.length > 0) {
      dispatch({ type: 'ADD_UPLOAD_FILES', payload: newUploadFiles })
    }

    if (filesToAdd.length < fileArray.length) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: `Προστέθηκαν μόνο ${filesToAdd.length} από ${fileArray.length} εικόνες λόγω ορίου` 
      })
    }
  }, [maxFiles, existingImagesCount, state.uploadFiles])

  // Remove file from upload queue
  const removeUploadFile = useCallback((index: number) => {
    const fileToRemove = state.uploadFiles[index]
    if (fileToRemove?.preview.startsWith('blob:')) {
      URL.revokeObjectURL(fileToRemove.preview)
    }
    dispatch({ type: 'REMOVE_UPLOAD_FILE', payload: index })
  }, [state.uploadFiles])

  // Clear all upload files
  const clearUploadFiles = useCallback(() => {
    cleanupPreviews(state.uploadFiles)
    dispatch({ type: 'CLEAR_UPLOAD_FILES' })
  }, [state.uploadFiles, cleanupPreviews])

  // Upload all pending files
  const uploadAllFiles = useCallback(async () => {
    if (!forkliftId) {
      dispatch({ type: 'SET_ERROR', payload: 'Αποθηκεύστε πρώτα το κλαρκ για να ανεβάσετε εικόνες' })
      return
    }

    dispatch({ type: 'SET_UPLOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      // Get current state snapshot to avoid stale closures
      const currentUploadFiles = state.uploadFiles
      const pendingFiles = currentUploadFiles.filter(uf => uf.status === 'pending')
      
      if (pendingFiles.length === 0) {
        dispatch({ type: 'SET_UPLOADING', payload: false })
        return
      }

      console.log('Starting upload for', pendingFiles.length, 'files')
      
      const filesToUpload = pendingFiles.map(uf => uf.file)
      
      // Update all pending files to uploading status
      currentUploadFiles.forEach((uf, index) => {
        if (uf.status === 'pending') {
          dispatch({
            type: 'UPDATE_UPLOAD_FILE',
            payload: { index, updates: { status: 'uploading', progress: 0 } }
          })
        }
      })

      const results = await uploadMultipleImages(
        filesToUpload,
        forkliftId,
        (fileIndex, progress) => {
          // Progress update during upload
          console.log(`Upload progress for file ${fileIndex}: ${progress.percentage}%`)
          // For now, we'll update progress globally rather than per file
          // since the state management is complex with async operations
        }
      )

      console.log('Upload completed, results:', results.length)

      // Mark all uploading files as completed
      // Since we're doing batch upload, we'll mark all uploading files as completed
      currentUploadFiles.forEach((uf, index) => {
        if (uf.status === 'uploading' || uf.status === 'pending') {
          dispatch({
            type: 'UPDATE_UPLOAD_FILE',
            payload: {
              index,
              updates: {
                status: 'completed',
                progress: 100
              }
            }
          })
        }
      })

      // Save metadata to database
      try {
        const imagePayload = {
          forklift_id: forkliftId,
          images: results.map((result, index) => ({
            image_url: result.url,
            alt_text: `Εικόνα ${existingImagesCount + index + 1}`,
            is_primary: existingImagesCount === 0 && index === 0, // First image is primary if no existing images
            sort_order: existingImagesCount + index
          }))
        }

        console.log('Saving image metadata:', imagePayload)

        const response = await fetch('/api/admin/forklift-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(imagePayload)
        })

        const imageResult = await response.json()
        console.log('Metadata save result:', imageResult)
        
        if (imageResult.success) {
          dispatch({ type: 'SET_SUCCESS', payload: `Αποθηκεύτηκαν επιτυχώς ${results.length} εικόνες` })
          onUploadComplete?.(results)
        } else {
          dispatch({ 
            type: 'SET_ERROR', 
            payload: `Προειδοποίηση: Οι εικόνες ανέβηκαν αλλά τα metadata δεν αποθηκεύτηκαν: ${imageResult.message}` 
          })
          onUploadComplete?.(results)
        }
      } catch (error) {
        console.error('Metadata save error:', error)
        dispatch({ 
          type: 'SET_ERROR', 
          payload: `Προειδοποίηση: Οι εικόνες ανέβηκαν αλλά τα metadata δεν αποθηκεύτηκαν: ${error instanceof Error ? error.message : 'Άγνωστο σφάλμα'}` 
        })
        onUploadComplete?.(results)
      }

      // Clear completed files after delay
      cleanupTimeoutRef.current = setTimeout(() => {
        dispatch({ type: 'CLEAR_UPLOAD_FILES' })
      }, 2000)

    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Σφάλμα ανεβάσματος εικόνων'
      
      // Mark all uploading/pending files as error
      const currentUploadFiles = state.uploadFiles
      currentUploadFiles.forEach((uf, index) => {
        if (uf.status === 'uploading' || uf.status === 'pending') {
          dispatch({
            type: 'UPDATE_UPLOAD_FILE',
            payload: {
              index,
              updates: {
                status: 'error',
                error: errorMessage
              }
            }
          })
        }
      })
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      onUploadError?.(errorMessage)
    } finally {
      dispatch({ type: 'SET_UPLOADING', payload: false })
    }
  }, [forkliftId, state.uploadFiles, existingImagesCount, onUploadComplete, onUploadError])

  // Delete image
  const deleteImageHandler = useCallback(async (imageUrl: string) => {
    dispatch({ type: 'SET_DELETING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      // Delete from database first
      const response = await fetch('/api/admin/forklift-images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl })
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message || 'Σφάλμα διαγραφής metadata εικόνας')
      }
      
      // Then delete from storage
      const storagePath = extractStoragePath(imageUrl)
      if (storagePath) {
        await deleteImageFromStorage(storagePath)
      }
      
      // Update local state
      dispatch({ type: 'REMOVE_IMAGE', payload: imageUrl })
      
      // If deleted image was primary, make first remaining image primary
      const remainingImages = state.images.filter(img => img.image_url !== imageUrl)
      if (remainingImages.length > 0 && !remainingImages.some(img => img.is_primary)) {
        dispatch({ type: 'SET_PRIMARY_IMAGE', payload: remainingImages[0].image_url })
      }
      
      dispatch({ type: 'SET_SUCCESS', payload: 'Η εικόνα διαγράφηκε επιτυχώς' })
      onDeleteComplete?.()
      
    } catch (error) {
      console.error('Error deleting image:', error)
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Σφάλμα διαγραφής εικόνας' 
      })
    } finally {
      dispatch({ type: 'SET_DELETING', payload: false })
    }
  }, [state.images, onDeleteComplete])

  // Set primary image
  const setPrimaryImage = useCallback(async (imageUrl: string) => {
    if (!forkliftId) return

    dispatch({ type: 'SET_SETTING_PRIMARY', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      const response = await fetch('/api/admin/forklift-images/set-primary', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          forklift_id: forkliftId,
          primary_image_url: imageUrl
        })
      })

      const result = await response.json()
      
      if (result.success) {
        dispatch({ type: 'SET_PRIMARY_IMAGE', payload: imageUrl })
        dispatch({ type: 'SET_SUCCESS', payload: 'Η κύρια εικόνα ενημερώθηκε επιτυχώς' })
        onSetPrimaryComplete?.()
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.message || 'Σφάλμα ενημέρωσης κύριας εικόνας' })
      }
    } catch (error) {
      console.error('Error setting primary image:', error)
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Σφάλμα σύνδεσης κατά την ενημέρωση κύριας εικόνας' 
      })
    } finally {
      dispatch({ type: 'SET_SETTING_PRIMARY', payload: false })
    }
  }, [forkliftId, onSetPrimaryComplete])

  // Drag handlers
  const setDragOver = useCallback((dragOver: boolean) => {
    dispatch({ type: 'SET_DRAG_OVER', payload: dragOver })
  }, [])

  // Clear messages
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null })
  }, [])

  const clearSuccess = useCallback(() => {
    dispatch({ type: 'SET_SUCCESS', payload: null })
  }, [])

  // Auto-clear success messages
  useEffect(() => {
    if (state.successMessage) {
      successTimeoutRef.current = setTimeout(() => {
        dispatch({ type: 'SET_SUCCESS', payload: null })
      }, 5000)
    }
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [state.successMessage])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupPreviews(state.uploadFiles)
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current)
      }
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [state.uploadFiles, cleanupPreviews])

  // Calculate available slots using existingImagesCount instead of state.images.length
  // This is important for ImageUpload component which doesn't manage existing images
  const availableSlots = Math.max(0, maxFiles - existingImagesCount - state.uploadFiles.length)
  const canAddMore = availableSlots > 0

  return {
    // State
    images: state.images,
    uploadFiles: state.uploadFiles,
    isUploading: state.isUploading,
    isDeleting: state.isDeleting,
    isSettingPrimary: state.isSettingPrimary,
    error: state.error,
    successMessage: state.successMessage,
    isDragOver: state.isDragOver,
    availableSlots,
    canAddMore,
    
    // Actions
    setImages,
    addFiles,
    removeUploadFile,
    clearUploadFiles,
    uploadAllFiles,
    deleteImage: deleteImageHandler,
    setPrimaryImage,
    setDragOver,
    clearError,
    clearSuccess
  }
}