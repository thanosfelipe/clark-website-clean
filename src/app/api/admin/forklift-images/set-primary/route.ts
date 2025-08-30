import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface RequestBody {
  forklift_id: number
  primary_image_url: string
}

// Utility function for consistent error responses
function createErrorResponse(message: string, status = 500, details?: any) {
  console.error('Set Primary API Error:', { message, status, details })
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

export async function PUT(request: NextRequest) {
  try {
    // Parse request body with error handling
    let body: RequestBody
    try {
      body = await request.json()
    } catch (parseError) {
      return createErrorResponse('Μη έγκυρα δεδομένα JSON', 400, parseError)
    }

    const { forklift_id, primary_image_url } = body

    console.log('Set Primary Image API - Received request:', { 
      forklift_id, 
      primary_image_url,
      timestamp: new Date().toISOString()
    })

    // Enhanced validation
    if (!forklift_id) {
      return createErrorResponse('Το ID του κλαρκ είναι υποχρεωτικό', 400, { field: 'forklift_id' })
    }

    if (!Number.isInteger(forklift_id) || forklift_id <= 0) {
      return createErrorResponse('Το ID του κλαρκ πρέπει να είναι θετικός ακέραιος αριθμός', 400, { 
        field: 'forklift_id', 
        value: forklift_id 
      })
    }

    if (!primary_image_url) {
      return createErrorResponse('Το URL της εικόνας είναι υποχρεωτικό', 400, { field: 'primary_image_url' })
    }

    if (typeof primary_image_url !== 'string' || !primary_image_url.trim()) {
      return createErrorResponse('Μη έγκυρο URL εικόνας', 400, { 
        field: 'primary_image_url', 
        value: primary_image_url 
      })
    }

    // Validate URL format
    try {
      new URL(primary_image_url)
    } catch (urlError) {
      return createErrorResponse('Μη έγκυρη μορφή URL', 400, { 
        field: 'primary_image_url', 
        value: primary_image_url 
      })
    }

    // Check if the image exists for this forklift before making changes
    const { data: existingImage, error: checkError } = await supabase
      .from('forklift_images')
      .select('id, is_primary')
      .eq('forklift_id', forklift_id)
      .eq('image_url', primary_image_url)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing image:', checkError)
      return createErrorResponse('Σφάλμα ελέγχου υπάρχουσας εικόνας', 500, {
        databaseError: checkError.message,
        code: checkError.code
      })
    }

    if (!existingImage) {
      return createErrorResponse('Η εικόνα δεν βρέθηκε για αυτό το κλαρκ', 404, { 
        forklift_id,
        primary_image_url
      })
    }

    if (existingImage.is_primary) {
      return createSuccessResponse(existingImage, 'Η εικόνα είναι ήδη κύρια')
    }

    console.log('Starting primary image update transaction')

    // First, set all images for this forklift to non-primary
    const { error: resetError } = await supabase
      .from('forklift_images')
      .update({ is_primary: false })
      .eq('forklift_id', forklift_id)

    if (resetError) {
      console.error('Error resetting primary images:', resetError)
      
      if (resetError.code === '23503') {
        return createErrorResponse('Σφάλμα ακεραιότητας κατά την επαναφορά', 409, { 
          databaseError: resetError.message,
          code: resetError.code
        })
      }
      
      return createErrorResponse(`Σφάλμα επαναφοράς κύριων εικόνων: ${resetError.message}`, 500, {
        databaseError: resetError.message,
        code: resetError.code,
        step: 'reset_primary'
      })
    }

    console.log('Successfully reset all primary images, setting new primary')

    // Then, set the specified image as primary
    const { data, error: setPrimaryError } = await supabase
      .from('forklift_images')
      .update({ is_primary: true })
      .eq('forklift_id', forklift_id)
      .eq('image_url', primary_image_url)
      .select()

    if (setPrimaryError) {
      console.error('Error setting primary image:', setPrimaryError)
      
      if (setPrimaryError.code === '23503') {
        return createErrorResponse('Σφάλμα ακεραιότητας κατά τον ορισμό κύριας εικόνας', 409, { 
          databaseError: setPrimaryError.message,
          code: setPrimaryError.code
        })
      }
      
      return createErrorResponse(`Σφάλμα ορισμού κύριας εικόνας: ${setPrimaryError.message}`, 500, {
        databaseError: setPrimaryError.message,
        code: setPrimaryError.code,
        step: 'set_primary'
      })
    }

    if (!data || data.length === 0) {
      return createErrorResponse('Η εικόνα δεν βρέθηκε μετά την ενημέρωση', 500, { 
        forklift_id,
        primary_image_url,
        step: 'verify_update'
      })
    }

    const updatedImage = data[0]
    console.log('Primary image updated successfully:', { 
      id: updatedImage.id,
      forklift_id: updatedImage.forklift_id,
      image_url: updatedImage.image_url,
      is_primary: updatedImage.is_primary,
      timestamp: new Date().toISOString()
    })

    return createSuccessResponse(updatedImage, 'Η κύρια εικόνα ενημερώθηκε επιτυχώς')

  } catch (error) {
    console.error('Error setting primary image:', error)
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('connection')) {
        return createErrorResponse('Σφάλμα σύνδεσης με τη βάση δεδομένων', 503, { error: error.message })
      }
      
      return createErrorResponse(error.message, 500, { originalError: error.message })
    }
    
    return createErrorResponse('Άγνωστο σφάλμα κατά την ενημέρωση της κύριας εικόνας', 500)
  }
} 