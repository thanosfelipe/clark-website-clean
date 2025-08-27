import { NextRequest, NextResponse } from 'next/server'
import { brandQueries, validation, DatabaseError } from '@/lib/admin-queries'

// GET /api/admin/brands - Get all brands OR get single brand by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      // Get single brand by ID
      const brandId = parseInt(id)
      if (isNaN(brandId)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid ID',
          message: 'Μη έγκυρο ID'
        }, { status: 400 })
      }
      
      const brand = await brandQueries.getById(brandId)
      if (!brand) {
        return NextResponse.json({
          success: false,
          error: 'Not found',
          message: 'Η μάρκα δεν βρέθηκε'
        }, { status: 404 })
      }
      
      return NextResponse.json({
        success: true,
        data: brand,
        message: 'Η μάρκα ανακτήθηκε επιτυχώς'
      })
    } else {
      // Get all brands
      const brands = await brandQueries.getAll()
      
      return NextResponse.json({
        success: true,
        data: brands,
        message: 'Οι μάρκες ανακτήθηκαν επιτυχώς'
      })
    }
  } catch (error) {
    console.error('Error fetching brands:', error)
    
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
      message: 'Αποτυχία ανάκτησης μαρκών'
    }, { status: 500 })
  }
}

// POST /api/admin/brands - Create new brand
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validationErrors = validation.validateBrand(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Μη έγκυρα δεδομένα',
        details: validationErrors
      }, { status: 400 })
    }
    
    // Check if brand name already exists
    const nameExists = await brandQueries.nameExists(body.name)
    if (nameExists) {
      return NextResponse.json({
        success: false,
        error: 'Duplicate name',
        message: 'Η μάρκα με αυτό το όνομα υπάρχει ήδη'
      }, { status: 409 })
    }
    
    // Create the brand
    const newBrand = await brandQueries.create({
      name: body.name.trim(),
      logo_url: body.logo_url?.trim() || null
    })
    
    return NextResponse.json({
      success: true,
      data: newBrand,
      message: 'Η μάρκα δημιουργήθηκε επιτυχώς'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating brand:', error)
    
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
      message: 'Αποτυχία δημιουργίας μάρκας'
    }, { status: 500 })
  }
}

// PUT /api/admin/brands - Update brand (expects ID in query params)
export async function PUT(request: NextRequest) {
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
    
    const brandId = parseInt(id)
    if (isNaN(brandId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID',
        message: 'Μη έγκυρο ID'
      }, { status: 400 })
    }
    
    const body = await request.json()
    
    // Validate input data
    const validationErrors = validation.validateBrand(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Μη έγκυρα δεδομένα',
        details: validationErrors
      }, { status: 400 })
    }
    
    // Check if brand exists
    const existingBrand = await brandQueries.getById(brandId)
    if (!existingBrand) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Η μάρκα δεν βρέθηκε'
      }, { status: 404 })
    }
    
    // Check if new name conflicts with other brands
    if (body.name && body.name !== existingBrand.name) {
      const nameExists = await brandQueries.nameExists(body.name, brandId)
      if (nameExists) {
        return NextResponse.json({
          success: false,
          error: 'Duplicate name',
          message: 'Άλλη μάρκα με αυτό το όνομα υπάρχει ήδη'
        }, { status: 409 })
      }
    }
    
    // Update the brand
    const updatedBrand = await brandQueries.update(brandId, {
      name: body.name?.trim(),
      logo_url: body.logo_url?.trim() || null
    })
    
    return NextResponse.json({
      success: true,
      data: updatedBrand,
      message: 'Η μάρκα ενημερώθηκε επιτυχώς'
    })
    
  } catch (error) {
    console.error('Error updating brand:', error)
    
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
      message: 'Αποτυχία ενημέρωσης μάρκας'
    }, { status: 500 })
  }
}

// DELETE /api/admin/brands - Delete brand (expects ID in query params)
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
    
    const brandId = parseInt(id)
    if (isNaN(brandId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID',
        message: 'Μη έγκυρο ID'
      }, { status: 400 })
    }
    
    // Check if brand exists
    const existingBrand = await brandQueries.getById(brandId)
    if (!existingBrand) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Η μάρκα δεν βρέθηκε'
      }, { status: 404 })
    }
    
    // Delete the brand
    await brandQueries.delete(brandId)
    
    return NextResponse.json({
      success: true,
      message: 'Η μάρκα διαγράφηκε επιτυχώς'
    })
    
  } catch (error) {
    console.error('Error deleting brand:', error)
    
    if (error instanceof DatabaseError) {
      // Check if it's a foreign key constraint error
      if (error.code === '23503') {
        return NextResponse.json({
          success: false,
          error: 'Constraint violation',
          message: 'Δεν μπορείτε να διαγράψετε τη μάρκα γιατί χρησιμοποιείται από κλαρκ'
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
      message: 'Αποτυχία διαγραφής μάρκας'
    }, { status: 500 })
  }
} 