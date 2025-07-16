import { NextRequest, NextResponse } from 'next/server'
import { subcategoryQueries, categoryQueries, validation, DatabaseError } from '@/lib/admin-queries'

// GET /api/admin/subcategories - Get all subcategories with category info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category_id')
    
    let subcategories
    if (categoryId) {
      // Get subcategories for specific category
      const parsedCategoryId = parseInt(categoryId)
      if (isNaN(parsedCategoryId)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid category ID',
          message: 'Μη έγκυρο ID κατηγορίας'
        }, { status: 400 })
      }
      subcategories = await subcategoryQueries.getByCategoryId(parsedCategoryId)
    } else {
      // Get all subcategories with category info
      subcategories = await subcategoryQueries.getAll()
    }
    
    return NextResponse.json({
      success: true,
      data: subcategories,
      message: 'Οι υποκατηγορίες ανακτήθηκαν επιτυχώς'
    })
  } catch (error) {
    console.error('Error fetching subcategories:', error)
    
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
      message: 'Αποτυχία ανάκτησης υποκατηγοριών'
    }, { status: 500 })
  }
}

// POST /api/admin/subcategories - Create new subcategory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validationErrors = validation.validateSubcategory(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Μη έγκυρα δεδομένα',
        details: validationErrors
      }, { status: 400 })
    }
    
    // Check if parent category exists
    const parentCategory = await categoryQueries.getById(body.category_id)
    if (!parentCategory) {
      return NextResponse.json({
        success: false,
        error: 'Parent category not found',
        message: 'Η γονική κατηγορία δεν βρέθηκε'
      }, { status: 400 })
    }
    
    // Create the subcategory
    const newSubcategory = await subcategoryQueries.create({
      name: body.name.trim(),
      description: body.description?.trim() || null,
      category_id: body.category_id
    })
    
    return NextResponse.json({
      success: true,
      data: newSubcategory,
      message: 'Η υποκατηγορία δημιουργήθηκε επιτυχώς'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating subcategory:', error)
    
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
      message: 'Αποτυχία δημιουργίας υποκατηγορίας'
    }, { status: 500 })
  }
}

// PUT /api/admin/subcategories - Update subcategory (expects ID in body)
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
    const validationErrors = validation.validateSubcategory(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Μη έγκυρα δεδομένα',
        details: validationErrors
      }, { status: 400 })
    }
    
    // Check if subcategory exists
    const existingSubcategory = await subcategoryQueries.getById(body.id)
    if (!existingSubcategory) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Η υποκατηγορία δεν βρέθηκε'
      }, { status: 404 })
    }
    
    // Check if parent category exists (if being changed)
    if (body.category_id && body.category_id !== existingSubcategory.category_id) {
      const parentCategory = await categoryQueries.getById(body.category_id)
      if (!parentCategory) {
        return NextResponse.json({
          success: false,
          error: 'Parent category not found',
          message: 'Η γονική κατηγορία δεν βρέθηκε'
        }, { status: 400 })
      }
    }
    
    // Update the subcategory
    const updatedSubcategory = await subcategoryQueries.update(body.id, {
      name: body.name?.trim(),
      description: body.description?.trim() || null,
      category_id: body.category_id
    })
    
    return NextResponse.json({
      success: true,
      data: updatedSubcategory,
      message: 'Η υποκατηγορία ενημερώθηκε επιτυχώς'
    })
    
  } catch (error) {
    console.error('Error updating subcategory:', error)
    
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
      message: 'Αποτυχία ενημέρωσης υποκατηγορίας'
    }, { status: 500 })
  }
}

// DELETE /api/admin/subcategories - Delete subcategory (expects ID in query params)
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
    
    const subcategoryId = parseInt(id)
    if (isNaN(subcategoryId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID',
        message: 'Μη έγκυρο ID'
      }, { status: 400 })
    }
    
    // Check if subcategory exists
    const existingSubcategory = await subcategoryQueries.getById(subcategoryId)
    if (!existingSubcategory) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Η υποκατηγορία δεν βρέθηκε'
      }, { status: 404 })
    }
    
    // Delete the subcategory
    await subcategoryQueries.delete(subcategoryId)
    
    return NextResponse.json({
      success: true,
      message: 'Η υποκατηγορία διαγράφηκε επιτυχώς'
    })
    
  } catch (error) {
    console.error('Error deleting subcategory:', error)
    
    if (error instanceof DatabaseError) {
      // Check if it's a foreign key constraint error
      if (error.code === '23503') {
        return NextResponse.json({
          success: false,
          error: 'Constraint violation',
          message: 'Δεν μπορείτε να διαγράψετε την υποκατηγορία γιατί χρησιμοποιείται από κλαρκ'
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
      message: 'Αποτυχία διαγραφής υποκατηγορίας'
    }, { status: 500 })
  }
} 