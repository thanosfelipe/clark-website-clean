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

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()
    const { forklift_id, images } = body

    console.log('Forklift Images API - Received request:', { forklift_id, imageCount: images?.length })

    if (!forklift_id || !images || !Array.isArray(images)) {
      console.log('Validation failed: Missing forklift_id or images')
      return NextResponse.json({
        success: false,
        message: 'Απαιτούνται το ID του κλαρκ και τα δεδομένα εικόνων'
      }, { status: 400 })
    }

    if (images.length === 0) {
      console.log('Validation failed: Empty images array')
      return NextResponse.json({
        success: false,
        message: 'Δεν βρέθηκαν εικόνες για αποθήκευση'
      }, { status: 400 })
    }

    // Validate each image data
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      if (!image.image_url) {
        console.log(`Validation failed: Image ${i + 1} has no URL`)
        return NextResponse.json({
          success: false,
          message: `Η εικόνα ${i + 1} δεν έχει έγκυρο URL`
        }, { status: 400 })
      }
    }

    console.log('Calling createForkliftImages with:', { forklift_id, images })
    const result = await createForkliftImages(forklift_id, images)
    console.log('createForkliftImages result:', result)

    return NextResponse.json({
      success: true,
      data: result,
      message: `Αποθηκεύτηκαν επιτυχώς ${images.length} εικόνες`
    })

  } catch (error) {
    console.error('Error creating forklift images:', error)
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Σφάλμα κατά την αποθήκευση των εικόνων'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { image_url } = body

    console.log('Forklift Images API - Delete request:', { image_url })

    if (!image_url) {
      return NextResponse.json({
        success: false,
        message: 'Το URL της εικόνας είναι υποχρεωτικό'
      }, { status: 400 })
    }

    // Delete from forklift_images table
    const { data, error } = await supabase
      .from('forklift_images')
      .delete()
      .eq('image_url', image_url)
      .select()

    if (error) {
      console.error('Database error:', error)
      throw new Error(`Σφάλμα βάσης δεδομένων: ${error.message}`)
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Η εικόνα δεν βρέθηκε στη βάση δεδομένων'
      }, { status: 404 })
    }

    console.log('Image metadata deleted successfully:', data[0])

    return NextResponse.json({
      success: true,
      message: 'Η εικόνα διαγράφηκε επιτυχώς'
    })

  } catch (error) {
    console.error('Error deleting forklift image:', error)
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Σφάλμα κατά τη διαγραφή της εικόνας'
    }, { status: 500 })
  }
} 