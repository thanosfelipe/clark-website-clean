import { supabase } from './supabase'

// Storage bucket for forklift images
const BUCKET_NAME = 'forklift-images'

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface ImageUploadResult {
  url: string
  path: string
  size: number
}

// Utility function to compress and resize image
export const compressImage = (file: File, maxWidth = 1200, maxHeight = 800, quality = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img
      
      if (width > maxWidth || height > maxHeight) {
        const widthRatio = maxWidth / width
        const heightRatio = maxHeight / height
        const ratio = Math.min(widthRatio, heightRatio)
        
        width *= ratio
        height *= ratio
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            resolve(file)
          }
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => resolve(file)
    img.src = URL.createObjectURL(file)
  })
}

// Validate image file
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Μόνο εικόνες JPEG, PNG και WebP επιτρέπονται'
    }
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Το μέγεθος της εικόνας δεν μπορεί να υπερβαίνει τα 10MB'
    }
  }

  return { valid: true }
}

// Generate unique file path
export const generateImagePath = (forkliftId: number, fileName: string): string => {
  const timestamp = Date.now()
  const extension = fileName.split('.').pop()
  const sanitizedName = fileName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9]/g, '_') // Replace special chars
    .toLowerCase()
  
  return `forklifts/${forkliftId}/${timestamp}_${sanitizedName}.${extension}`
}

// Upload image to Supabase Storage
export const uploadImage = async (
  file: File,
  forkliftId: number,
  onProgress?: (progress: UploadProgress) => void
): Promise<ImageUploadResult> => {
  try {
    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    // Compress image
    const compressedFile = await compressImage(file)
    
    // Generate path
    const filePath = generateImagePath(forkliftId, file.name)

    // Upload with progress tracking
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw new Error(`Σφάλμα ανεβάσματος: ${error.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      throw new Error('Σφάλμα στη δημιουργία URL εικόνας')
    }

    return {
      url: urlData.publicUrl,
      path: filePath,
      size: compressedFile.size
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

// Delete image from Supabase Storage
export const deleteImage = async (imagePath: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([imagePath])

    if (error) {
      throw new Error(`Σφάλμα διαγραφής εικόνας: ${error.message}`)
    }
  } catch (error) {
    console.error('Delete error:', error)
    throw error
  }
}

// Delete multiple images
export const deleteImages = async (imagePaths: string[]): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(imagePaths)

    if (error) {
      throw new Error(`Σφάλμα διαγραφής εικόνων: ${error.message}`)
    }
  } catch (error) {
    console.error('Delete multiple images error:', error)
    throw error
  }
}

// Get image URL from path
export const getImageUrl = (imagePath: string): string => {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(imagePath)
  
  return data?.publicUrl || ''
}

// Extract storage path from full URL
export const extractStoragePath = (imageUrl: string): string => {
  try {
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/')
    const bucketIndex = pathParts.findIndex(part => part === BUCKET_NAME)
    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      return pathParts.slice(bucketIndex + 1).join('/')
    }
    return ''
  } catch {
    return ''
  }
}

// Create storage bucket if it doesn't exist (for admin setup)
export const initializeStorage = async (): Promise<void> => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME)

    if (!bucketExists) {
      // Create bucket
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        fileSizeLimit: 10485760 // 10MB
      })

      if (error) {
        console.error('Error creating storage bucket:', error)
      } else {
        console.log('Storage bucket created successfully')
      }
    }
  } catch (error) {
    console.error('Storage initialization error:', error)
  }
}

// Batch upload multiple images
export const uploadMultipleImages = async (
  files: File[],
  forkliftId: number,
  onProgress?: (fileIndex: number, progress: UploadProgress) => void
): Promise<ImageUploadResult[]> => {
  const results: ImageUploadResult[] = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    try {
      const result = await uploadImage(file, forkliftId, (progress) => {
        onProgress?.(i, progress)
      })
      results.push(result)
    } catch (error) {
      console.error(`Error uploading file ${i}:`, error)
      throw error
    }
  }
  
  return results
} 