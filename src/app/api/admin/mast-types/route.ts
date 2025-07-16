import { NextRequest, NextResponse } from 'next/server'
import { mastTypeQueries, validation, DatabaseError } from '@/lib/admin-queries'

// GET /api/admin/mast-types - Get all mast types
export async function GET() {
  try {
    const mastTypes = await mastTypeQueries.getAll()
    
    return NextResponse.json({
      success: true,
      data: mastTypes,
      message: 'Οι τύποι ιστού ανακτήθηκαν επιτυχώς'
    })
  } catch (error) {
    console.error('Error fetching mast types:', error)
    
    if (error instanceof DatabaseError) {
      return NextResponse.json({
        success: false,
        error: 'Database error',
        message: error.message
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Αποτυχία ανάκτησης τύπων ιστού'
    }, { status: 500 })
  }
}

// POST /api/admin/mast-types - Create new mast type
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validationErrors = validation.validateMastType(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Μη έγκυρα δεδομένα',
        details: validationErrors
      }, { status: 400 })
    }
    
    // Check if mast type name already exists
    const nameExists = await mastTypeQueries.nameExists(body.name)
    if (nameExists) {
      return NextResponse.json({
        success: false,
        error: 'Duplicate name',
        message: 'Ο τύπος ιστού με αυτό το όνομα υπάρχει ήδη'
      }, { status: 409 })
    }
    
    // Create the mast type
    const newMastType = await mastTypeQueries.create({
      name: body.name.trim()
    })
    
    return NextResponse.json({
      success: true,
      data: newMastType,
      message: 'Ο τύπος ιστού δημιουργήθηκε επιτυχώς'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating mast type:', error)
    
    if (error instanceof DatabaseError) {
      return NextResponse.json({
        success: false,
        error: 'Database error',
        message: error.message
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Αποτυχία δημιουργίας τύπου ιστού'
    }, { status: 500 })
  }
}

// PUT /api/admin/mast-types - Update mast type (expects ID in body)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json({
        success: false,
        error: 'Missing ID',
        message: 'Το ID είναι υποχρεωτικό'
      }, { status: 400 })
    }
    
    // Validate input data
    const validationErrors = validation.validateMastType(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Μη έγκυρα δεδομένα',
        details: validationErrors
      }, { status: 400 })
    }
    
    // Check if mast type exists
    const existingMastType = await mastTypeQueries.getById(body.id)
    if (!existingMastType) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Ο τύπος ιστού δεν βρέθηκε'
      }, { status: 404 })
    }
    
    // Check if new name conflicts with other mast types
    if (body.name && body.name !== existingMastType.name) {
      const nameExists = await mastTypeQueries.nameExists(body.name, body.id)
      if (nameExists) {
        return NextResponse.json({
          success: false,
          error: 'Duplicate name',
          message: 'Άλλος τύπος ιστού με αυτό το όνομα υπάρχει ήδη'
        }, { status: 409 })
      }
    }
    
    // Update the mast type
    const updatedMastType = await mastTypeQueries.update(body.id, {
      name: body.name?.trim()
    })
    
    return NextResponse.json({
      success: true,
      data: updatedMastType,
      message: 'Ο τύπος ιστού ενημερώθηκε επιτυχώς'
    })
    
  } catch (error) {
    console.error('Error updating mast type:', error)
    
    if (error instanceof DatabaseError) {
      return NextResponse.json({
        success: false,
        error: 'Database error',
        message: error.message
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Αποτυχία ενημέρωσης τύπου ιστού'
    }, { status: 500 })
  }
}

// DELETE /api/admin/mast-types - Delete mast type (expects ID in query params)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing ID',
        message: 'Το ID είναι υποχρεωτικό'
      }, { status: 400 })
    }
    
    const mastTypeId = parseInt(id)
    if (isNaN(mastTypeId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID',
        message: 'Μη έγκυρο ID'
      }, { status: 400 })
    }
    
    // Check if mast type exists
    const existingMastType = await mastTypeQueries.getById(mastTypeId)
    if (!existingMastType) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Ο τύπος ιστού δεν βρέθηκε'
      }, { status: 404 })
    }
    
    // Delete the mast type
    await mastTypeQueries.delete(mastTypeId)
    
    return NextResponse.json({
      success: true,
      message: 'Ο τύπος ιστού διαγράφηκε επιτυχώς'
    })
    
  } catch (error) {
    console.error('Error deleting mast type:', error)
    
    if (error instanceof DatabaseError) {
      // Check if it's a foreign key constraint error
      if (error.code === '23503') {
        return NextResponse.json({
          success: false,
          error: 'Constraint violation',
          message: 'Δεν μπορείτε να διαγράψετε τον τύπο ιστού γιατί χρησιμοποιείται από κλαρκ'
        }, { status: 409 })
      }
      
      return NextResponse.json({
        success: false,
        error: 'Database error',
        message: error.message
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Αποτυχία διαγραφής τύπου ιστού'
    }, { status: 500 })
  }
} 