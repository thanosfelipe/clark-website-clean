import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface RequestBody {
  forklift_id: number
  primary_image_url: string
}

export async function PUT(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()
    const { forklift_id, primary_image_url } = body

    if (!forklift_id || !primary_image_url) {
      return NextResponse.json({
        success: false,
        message: 'Το ID του κλαρκ και το URL της εικόνας είναι υποχρεωτικά'
      }, { status: 400 })
    }

    // First, set all images for this forklift to non-primary
    const { error: resetError } = await supabase
      .from('forklift_images')
      .update({ is_primary: false })
      .eq('forklift_id', forklift_id)

    if (resetError) {
      console.error('Error resetting primary images:', resetError)
      throw new Error(`Σφάλμα βάσης δεδομένων: ${resetError.message}`)
    }

    // Then, set the specified image as primary
    const { data, error: setPrimaryError } = await supabase
      .from('forklift_images')
      .update({ is_primary: true })
      .eq('forklift_id', forklift_id)
      .eq('image_url', primary_image_url)
      .select()

    if (setPrimaryError) {
      console.error('Error setting primary image:', setPrimaryError)
      throw new Error(`Σφάλμα βάσης δεδομένων: ${setPrimaryError.message}`)
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Η εικόνα δεν βρέθηκε για αυτό το κλαρκ'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Η κύρια εικόνα ενημερώθηκε επιτυχώς',
      data: data[0]
    })

  } catch (error) {
    console.error('Error setting primary image:', error)
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Σφάλμα κατά την ενημέρωση της κύριας εικόνας'
    }, { status: 500 })
  }
} 