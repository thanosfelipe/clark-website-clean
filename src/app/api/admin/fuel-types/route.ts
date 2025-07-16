import { NextRequest, NextResponse } from 'next/server'
import { fuelTypeQueries, validation, DatabaseError } from '@/lib/admin-queries'

// GET /api/admin/fuel-types - Get all fuel types
export async function GET() {
  try {
    const fuelTypes = await fuelTypeQueries.getAll()
    
    return NextResponse.json({
      success: true,
      data: fuelTypes,
      message: 'Οι τύποι καυσίμου ανακτήθηκαν επιτυχώς'
    })
  } catch (error) {
    console.error('Error fetching fuel types:', error)
    
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
      message: 'Αποτυχία ανάκτησης τύπων καυσίμου'
    }, { status: 500 })
  }
}

// POST /api/admin/fuel-types - Create new fuel type
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validationErrors = validation.validateFuelType(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Μη έγκυρα δεδομένα',
        details: validationErrors
      }, { status: 400 })
    }
    
    // Check if fuel type name already exists
    const nameExists = await fuelTypeQueries.nameExists(body.name)
    if (nameExists) {
      return NextResponse.json({
        success: false,
        error: 'Duplicate name',
        message: 'Ο τύπος καυσίμου με αυτό το όνομα υπάρχει ήδη'
      }, { status: 409 })
    }
    
    // Create the fuel type
    const newFuelType = await fuelTypeQueries.create({
      name: body.name.trim()
    })
    
    return NextResponse.json({
      success: true,
      data: newFuelType,
      message: 'Ο τύπος καυσίμου δημιουργήθηκε επιτυχώς'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating fuel type:', error)
    
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
      message: 'Αποτυχία δημιουργίας τύπου καυσίμου'
    }, { status: 500 })
  }
}

// PUT /api/admin/fuel-types - Update fuel type (expects ID in body)
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
    const validationErrors = validation.validateFuelType(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Μη έγκυρα δεδομένα',
        details: validationErrors
      }, { status: 400 })
    }
    
    // Check if fuel type exists
    const existingFuelType = await fuelTypeQueries.getById(body.id)
    if (!existingFuelType) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Ο τύπος καυσίμου δεν βρέθηκε'
      }, { status: 404 })
    }
    
    // Check if new name conflicts with other fuel types
    if (body.name && body.name !== existingFuelType.name) {
      const nameExists = await fuelTypeQueries.nameExists(body.name, body.id)
      if (nameExists) {
        return NextResponse.json({
          success: false,
          error: 'Duplicate name',
          message: 'Άλλος τύπος καυσίμου με αυτό το όνομα υπάρχει ήδη'
        }, { status: 409 })
      }
    }
    
    // Update the fuel type
    const updatedFuelType = await fuelTypeQueries.update(body.id, {
      name: body.name?.trim()
    })
    
    return NextResponse.json({
      success: true,
      data: updatedFuelType,
      message: 'Ο τύπος καυσίμου ενημερώθηκε επιτυχώς'
    })
    
  } catch (error) {
    console.error('Error updating fuel type:', error)
    
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
      message: 'Αποτυχία ενημέρωσης τύπου καυσίμου'
    }, { status: 500 })
  }
}

// DELETE /api/admin/fuel-types - Delete fuel type (expects ID in query params)
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
    
    const fuelTypeId = parseInt(id)
    if (isNaN(fuelTypeId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID',
        message: 'Μη έγκυρο ID'
      }, { status: 400 })
    }
    
    // Check if fuel type exists
    const existingFuelType = await fuelTypeQueries.getById(fuelTypeId)
    if (!existingFuelType) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Ο τύπος καυσίμου δεν βρέθηκε'
      }, { status: 404 })
    }
    
    // Delete the fuel type
    await fuelTypeQueries.delete(fuelTypeId)
    
    return NextResponse.json({
      success: true,
      message: 'Ο τύπος καυσίμου διαγράφηκε επιτυχώς'
    })
    
  } catch (error) {
    console.error('Error deleting fuel type:', error)
    
    if (error instanceof DatabaseError) {
      // Check if it's a foreign key constraint error
      if (error.code === '23503') {
        return NextResponse.json({
          success: false,
          error: 'Constraint violation',
          message: 'Δεν μπορείτε να διαγράψετε τον τύπο καυσίμου γιατί χρησιμοποιείται από κλαρκ'
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
      message: 'Αποτυχία διαγραφής τύπου καυσίμου'
    }, { status: 500 })
  }
} 