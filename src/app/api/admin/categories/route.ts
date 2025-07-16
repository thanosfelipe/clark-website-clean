import { NextRequest, NextResponse } from 'next/server'
import { categoryQueries, validation, DatabaseError } from '@/lib/admin-queries'

// GET /api/admin/categories - Get all categories
export async function GET() {
  try {
    const categories = await categoryQueries.getAll()
    
    return NextResponse.json({
      success: true,
      data: categories,
      message: 'Οι κατηγορίες ανακτήθηκαν επιτυχώς'
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    
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
      message: 'Αποτυχία ανάκτησης κατηγοριών'
    }, { status: 500 })
  }
}

// POST /api/admin/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validationErrors = validation.validateCategory(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Μη έγκυρα δεδομένα',
        details: validationErrors
      }, { status: 400 })
    }
    
    // Check if category name already exists
    const nameExists = await categoryQueries.nameExists(body.name)
    if (nameExists) {
      return NextResponse.json({
        success: false,
        error: 'Duplicate name',
        message: 'Η κατηγορία με αυτό το όνομα υπάρχει ήδη'
      }, { status: 409 })
    }
    
    // Create the category
    const newCategory = await categoryQueries.create({
      name: body.name.trim(),
      description: body.description?.trim() || null
    })
    
    return NextResponse.json({
      success: true,
      data: newCategory,
      message: 'Η κατηγορία δημιουργήθηκε επιτυχώς'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating category:', error)
    
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
      message: 'Αποτυχία δημιουργίας κατηγορίας'
    }, { status: 500 })
  }
}

// PUT /api/admin/categories - Update category (expects ID in body)
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
    const validationErrors = validation.validateCategory(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Μη έγκυρα δεδομένα',
        details: validationErrors
      }, { status: 400 })
    }
    
    // Check if category exists
    const existingCategory = await categoryQueries.getById(body.id)
    if (!existingCategory) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Η κατηγορία δεν βρέθηκε'
      }, { status: 404 })
    }
    
    // Check if new name conflicts with other categories
    if (body.name && body.name !== existingCategory.name) {
      const nameExists = await categoryQueries.nameExists(body.name, body.id)
      if (nameExists) {
        return NextResponse.json({
          success: false,
          error: 'Duplicate name',
          message: 'Άλλη κατηγορία με αυτό το όνομα υπάρχει ήδη'
        }, { status: 409 })
      }
    }
    
    // Update the category
    const updatedCategory = await categoryQueries.update(body.id, {
      name: body.name?.trim(),
      description: body.description?.trim() || null
    })
    
    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Η κατηγορία ενημερώθηκε επιτυχώς'
    })
    
  } catch (error) {
    console.error('Error updating category:', error)
    
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
      message: 'Αποτυχία ενημέρωσης κατηγορίας'
    }, { status: 500 })
  }
}

// DELETE /api/admin/categories - Delete category (expects ID in query params)
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
    
    const categoryId = parseInt(id)
    if (isNaN(categoryId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID',
        message: 'Μη έγκυρο ID'
      }, { status: 400 })
    }
    
    // Check if category exists
    const existingCategory = await categoryQueries.getById(categoryId)
    if (!existingCategory) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Η κατηγορία δεν βρέθηκε'
      }, { status: 404 })
    }
    
    // Delete the category
    await categoryQueries.delete(categoryId)
    
    return NextResponse.json({
      success: true,
      message: 'Η κατηγορία διαγράφηκε επιτυχώς'
    })
    
  } catch (error) {
    console.error('Error deleting category:', error)
    
    if (error instanceof DatabaseError) {
      // Check if it's a foreign key constraint error
      if (error.code === '23503') {
        return NextResponse.json({
          success: false,
          error: 'Constraint violation',
          message: 'Δεν μπορείτε να διαγράψετε την κατηγορία γιατί χρησιμοποιείται από υποκατηγορίες ή κλαρκ'
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
      message: 'Αποτυχία διαγραφής κατηγορίας'
    }, { status: 500 })
  }
} 