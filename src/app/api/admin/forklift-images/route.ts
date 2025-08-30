import { NextRequest, NextResponse } from 'next/server'
import { createForkliftImages } from '@/lib/admin-queries'
import { supabase } from '@/lib/supabase'

interface ImageData {
  image_url: string
  alt_text?: string
  is_primary: boolean
  sort_order: number
}

interface RequestBody {
  forklift_id: number
  images: ImageData[]
}

// Utility function for consistent error responses
function createErrorResponse(message: string, status = 500, details?: any) {
  console.error('API Error:', { message, status, details })
  return NextResponse.json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
    ...(details && { details })
  }, { status })
}

// Utility function for consistent success responses
function createSuccessResponse(data: any, message?: string) {
  return NextResponse.json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  let forklift_id: number | undefined
  
  try {
    // Parse request body with error handling
    let body: RequestBody
    try {
      body = await request.json()
    } catch (parseError) {
      return createErrorResponse('Μη έγκυρα δεδομένα JSON', 400, parseError)
    }

    const { forklift_id: bodyForkliftId, images } = body
    forklift_id = bodyForkliftId

    console.log('Forklift Images API - Received request:', { 
      forklift_id, 
      imageCount: images?.length,
      timestamp: new Date().toISOString()
    })

    // Enhanced validation
    if (!forklift_id) {
      return createErrorResponse('Το ID του κλαρκ είναι υποχρεωτικό', 400, { field: 'forklift_id' })
    }

    if (!Number.isInteger(forklift_id) || forklift_id <= 0) {
      return createErrorResponse('Το ID του κλαρκ πρέπει να είναι θετικός ακέραιος αριθμός', 400, { field: 'forklift_id', value: forklift_id })
    }

    if (!images) {
      return createErrorResponse('Τα δεδομένα εικόνων είναι υποχρεωτικά', 400, { field: 'images' })
    }

    if (!Array.isArray(images)) {
      return createErrorResponse('Τα δεδομένα εικόνων πρέπει να είναι πίνακας', 400, { field: 'images', type: typeof images })
    }

    if (images.length === 0) {
      return createErrorResponse('Δεν βρέθηκαν εικόνες για αποθήκευση', 400, { imageCount: 0 })
    }

    if (images.length > 10) {
      return createErrorResponse('Μέγιστος αριθμός εικόνων: 10', 400, { imageCount: images.length, maxImages: 10 })
    }

    // Validate each image data with detailed error information
    const validationErrors: string[] = []
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      const imageIndex = i + 1

      if (!image.image_url) {
        validationErrors.push(`Εικόνα ${imageIndex}: Απαιτείται URL`)
      } else if (typeof image.image_url !== 'string' || !image.image_url.trim()) {
        validationErrors.push(`Εικόνα ${imageIndex}: Μη έγκυρο URL`)
      }

      if (image.alt_text !== undefined && (typeof image.alt_text !== 'string' && image.alt_text !== null)) {
        validationErrors.push(`Εικόνα ${imageIndex}: Μη έγκυρο alt_text`)
      }

      if (typeof image.is_primary !== 'boolean') {
        validationErrors.push(`Εικόνα ${imageIndex}: Το πεδίο is_primary πρέπει να είναι boolean`)
      }

      if (!Number.isInteger(image.sort_order) || image.sort_order < 0) {
        validationErrors.push(`Εικόνα ${imageIndex}: Μη έγκυρη σειρά ταξινόμησης`)
      }
    }

    if (validationErrors.length > 0) {
      return createErrorResponse('Σφάλματα επικύρωσης δεδομένων εικόνων', 400, { validationErrors })
    }

    // Check for duplicate URLs
    const urls = images.map(img => img.image_url)
    const uniqueUrls = new Set(urls)
    if (urls.length !== uniqueUrls.size) {
      return createErrorResponse('Βρέθηκαν διπλότυπα URLs εικόνων', 400, { duplicateCount: urls.length - uniqueUrls.size })
    }

    // Check for multiple primary images
    const primaryImages = images.filter(img => img.is_primary)
    if (primaryImages.length > 1) {
      return createErrorResponse('Μόνο μία εικόνα μπορεί να είναι κύρια', 400, { primaryImageCount: primaryImages.length })
    }

    console.log('Validation passed, calling createForkliftImages')
    const result = await createForkliftImages(forklift_id, images)
    
    console.log('createForkliftImages success:', { 
      resultCount: result?.length || 0,
      timestamp: new Date().toISOString()
    })

    return createSuccessResponse(
      result,
      `Αποθηκεύτηκαν επιτυχώς ${images.length} εικόνες`
    )

  } catch (error) {
    console.error('Error creating forklift images:', error)
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('foreign key')) {
        return createErrorResponse('Το κλαρκ δεν βρέθηκε', 404, { forklift_id })
      }
      if (error.message.includes('duplicate')) {
        return createErrorResponse('Διπλότυπη εγγραφή εικόνας', 409, { error: error.message })
      }
      if (error.message.includes('network') || error.message.includes('connection')) {
        return createErrorResponse('Σφάλμα σύνδεσης με τη βάση δεδομένων', 503, { error: error.message })
      }
      
      return createErrorResponse(error.message, 500, { originalError: error.message })
    }
    
    return createErrorResponse('Άγνωστο σφάλμα κατά την αποθήκευση των εικόνων', 500)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Parse request body with error handling
    let body: { image_url?: string }
    try {
      body = await request.json()
    } catch (parseError) {
      return createErrorResponse('Μη έγκυρα δεδομένα JSON', 400, parseError)
    }

    const { image_url } = body

    console.log('Forklift Images API - Delete request:', { 
      image_url,
      timestamp: new Date().toISOString()
    })

    // Enhanced validation
    if (!image_url) {
      return createErrorResponse('Το URL της εικόνας είναι υποχρεωτικό', 400, { field: 'image_url' })
    }

    if (typeof image_url !== 'string' || !image_url.trim()) {
      return createErrorResponse('Μη έγκυρο URL εικόνας', 400, { field: 'image_url', value: image_url })
    }

    // Validate URL format
    try {
      new URL(image_url)
    } catch (urlError) {
      return createErrorResponse('Μη έγκυρη μορφή URL', 400, { field: 'image_url', value: image_url })
    }

    // Delete from forklift_images table with enhanced error handling
    const { data, error } = await supabase
      .from('forklift_images')
      .delete()
      .eq('image_url', image_url)
      .select()

    if (error) {
      console.error('Database error during delete:', error)
      
      if (error.code === '23503') {
        return createErrorResponse('Η εικόνα δεν μπορεί να διαγραφεί λόγω εξαρτήσεων', 409, { 
          databaseError: error.message,
          code: error.code
        })
      }
      
      if (error.code === '42P01') {
        return createErrorResponse('Σφάλμα σχήματος βάσης δεδομένων', 500, { 
          databaseError: error.message,
          code: error.code
        })
      }
      
      return createErrorResponse(`Σφάλμα βάσης δεδομένων: ${error.message}`, 500, {
        databaseError: error.message,
        code: error.code
      })
    }

    if (!data || data.length === 0) {
      return createErrorResponse('Η εικόνα δεν βρέθηκε στη βάση δεδομένων', 404, { 
        image_url,
        searchAttempted: true
      })
    }

    const deletedImage = data[0]
    console.log('Image metadata deleted successfully:', { 
      id: deletedImage.id,
      image_url: deletedImage.image_url,
      forklift_id: deletedImage.forklift_id,
      timestamp: new Date().toISOString()
    })

    return createSuccessResponse(
      { 
        deletedImage: {
          id: deletedImage.id,
          image_url: deletedImage.image_url,
          forklift_id: deletedImage.forklift_id
        }
      },
      'Η εικόνα διαγράφηκε επιτυχώς'
    )

  } catch (error) {
    console.error('Error deleting forklift image:', error)
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('connection')) {
        return createErrorResponse('Σφάλμα σύνδεσης με τη βάση δεδομένων', 503, { error: error.message })
      }
      
      return createErrorResponse(error.message, 500, { originalError: error.message })
    }
    
    return createErrorResponse('Άγνωστο σφάλμα κατά τη διαγραφή της εικόνας', 500)
  }
} 