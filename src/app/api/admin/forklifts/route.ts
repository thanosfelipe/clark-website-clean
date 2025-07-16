import { NextRequest, NextResponse } from 'next/server'
import { 
  forkliftQueries, 
  forkliftImageQueries, 
  brandQueries,
  categoryQueries,
  subcategoryQueries,
  fuelTypeQueries,
  mastTypeQueries,
  validation, 
  DatabaseError 
} from '@/lib/admin-queries'

// GET /api/admin/forklifts - Get all forklifts or single forklift by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      // Get single forklift by ID
      const forkliftId = parseInt(id)
      if (isNaN(forkliftId)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid ID',
          message: 'Μη έγκυρο ID'
        }, { status: 400 })
      }
      
      const forklift = await forkliftQueries.getById(forkliftId)
      if (!forklift) {
        return NextResponse.json({
          success: false,
          error: 'Not found',
          message: 'Το κλαρκ δεν βρέθηκε'
        }, { status: 404 })
      }
      
      return NextResponse.json({
        success: true,
        data: forklift,
        message: 'Το κλαρκ ανακτήθηκε επιτυχώς'
      })
    } else {
      // Get all forklifts
      const forklifts = await forkliftQueries.getAll()
      
      return NextResponse.json({
        success: true,
        data: forklifts,
        message: 'Τα κλαρκ ανακτήθηκαν επιτυχώς'
      })
    }
  } catch (error) {
    console.error('Error fetching forklifts:', error)
    
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
      message: 'Αποτυχία ανάκτησης κλαρκ'
    }, { status: 500 })
  }
}

// POST /api/admin/forklifts - Create new forklift with images
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate forklift data
    const validationErrors = validation.validateForklift(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Μη έγκυρα δεδομένα',
        details: validationErrors
      }, { status: 400 })
    }
    
    // Validate foreign key references
    const validationPromises = []
    
    if (body.brand_id) {
      validationPromises.push(
        brandQueries.getById(body.brand_id).then(result => 
          result ? null : 'Η μάρκα δεν βρέθηκε'
        )
      )
    }
    
    if (body.category_id) {
      validationPromises.push(
        categoryQueries.getById(body.category_id).then(result => 
          result ? null : 'Η κατηγορία δεν βρέθηκε'
        )
      )
    }
    
    if (body.subcategory_id) {
      validationPromises.push(
        subcategoryQueries.getById(body.subcategory_id).then(result => 
          result ? null : 'Η υποκατηγορία δεν βρέθηκε'
        )
      )
    }
    
    if (body.fuel_type_id) {
      validationPromises.push(
        fuelTypeQueries.getById(body.fuel_type_id).then(result => 
          result ? null : 'Ο τύπος καυσίμου δεν βρέθηκε'
        )
      )
    }
    
    if (body.mast_type_id) {
      validationPromises.push(
        mastTypeQueries.getById(body.mast_type_id).then(result => 
          result ? null : 'Ο τύπος ιστού δεν βρέθηκε'
        )
      )
    }
    
    const foreignKeyErrors = (await Promise.all(validationPromises)).filter(Boolean)
    if (foreignKeyErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Foreign key validation error',
        message: 'Μη έγκυρες αναφορές',
        details: foreignKeyErrors
      }, { status: 400 })
    }
    
    // Check if product code already exists (if provided)
    if (body.product_code) {
      const codeExists = await forkliftQueries.productCodeExists(body.product_code)
      if (codeExists) {
        return NextResponse.json({
          success: false,
          error: 'Duplicate product code',
          message: 'Κλαρκ με αυτόν τον κωδικό προϊόντος υπάρχει ήδη'
        }, { status: 409 })
      }
    }
    
    // Prepare forklift data
    const forkliftData = {
      product_code: body.product_code?.trim() || undefined, // Will be auto-generated if not provided
      title: body.title.trim(),
      brand_id: body.brand_id || null,
      category_id: body.category_id || null,
      subcategory_id: body.subcategory_id || null,
      condition: body.condition,
      model_year: body.model_year || null,
      fuel_type_id: body.fuel_type_id || null,
      lifting_capacity_kg: body.lifting_capacity_kg,
      mast_type_id: body.mast_type_id || null,
      mast_visibility: body.mast_visibility?.trim() || null,
      max_lift_height_mm: body.max_lift_height_mm,
      description: body.description?.trim() || null,
      price: body.price || null,
      stock_quantity: body.stock_quantity || 0,
      is_available: body.is_available !== undefined ? body.is_available : true
    }
    
    // Prepare images data
    const imagesData = (body.images || []).map((img: any, index: number) => ({
      image_url: img.image_url,
      alt_text: img.alt_text?.trim() || null,
      is_primary: img.is_primary || false,
      sort_order: img.sort_order !== undefined ? img.sort_order : index
    }))
    
    // Create forklift with images in a transaction
    const newForklift = await forkliftQueries.createWithImages(forkliftData, imagesData)
    
    return NextResponse.json({
      success: true,
      data: newForklift,
      message: 'Το κλαρκ δημιουργήθηκε επιτυχώς'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating forklift:', error)
    
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
      message: 'Αποτυχία δημιουργίας κλαρκ'
    }, { status: 500 })
  }
}

// PUT /api/admin/forklifts - Update forklift (expects ID in URL or body)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const forkliftId = searchParams.get('id') || body.id
    
    if (!forkliftId) {
      return NextResponse.json({
        success: false,
        error: 'Missing ID',
        message: 'Το ID είναι υποχρεωτικό'
      }, { status: 400 })
    }
    
    // Validate forklift data
    const validationErrors = validation.validateForklift(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Μη έγκυρα δεδομένα',
        details: validationErrors
      }, { status: 400 })
    }
    
    // Check if forklift exists
    const existingForklift = await forkliftQueries.getById(forkliftId)
    if (!existingForklift) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Το κλαρκ δεν βρέθηκε'
      }, { status: 404 })
    }
    
    // Validate foreign key references (only if they're being changed)
    const validationPromises = []
    
    if (body.brand_id && body.brand_id !== existingForklift.brand_id) {
      validationPromises.push(
        brandQueries.getById(body.brand_id).then(result => 
          result ? null : 'Η μάρκα δεν βρέθηκε'
        )
      )
    }
    
    if (body.category_id && body.category_id !== existingForklift.category_id) {
      validationPromises.push(
        categoryQueries.getById(body.category_id).then(result => 
          result ? null : 'Η κατηγορία δεν βρέθηκε'
        )
      )
    }
    
    if (body.subcategory_id && body.subcategory_id !== existingForklift.subcategory_id) {
      validationPromises.push(
        subcategoryQueries.getById(body.subcategory_id).then(result => 
          result ? null : 'Η υποκατηγορία δεν βρέθηκε'
        )
      )
    }
    
    if (body.fuel_type_id && body.fuel_type_id !== existingForklift.fuel_type_id) {
      validationPromises.push(
        fuelTypeQueries.getById(body.fuel_type_id).then(result => 
          result ? null : 'Ο τύπος καυσίμου δεν βρέθηκε'
        )
      )
    }
    
    if (body.mast_type_id && body.mast_type_id !== existingForklift.mast_type_id) {
      validationPromises.push(
        mastTypeQueries.getById(body.mast_type_id).then(result => 
          result ? null : 'Ο τύπος ιστού δεν βρέθηκε'
        )
      )
    }
    
    const foreignKeyErrors = (await Promise.all(validationPromises)).filter(Boolean)
    if (foreignKeyErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Foreign key validation error',
        message: 'Μη έγκυρες αναφορές',
        details: foreignKeyErrors
      }, { status: 400 })
    }
    
    // Check if product code conflicts (if being changed)
    if (body.product_code && body.product_code !== existingForklift.product_code) {
      const codeExists = await forkliftQueries.productCodeExists(body.product_code, forkliftId)
      if (codeExists) {
        return NextResponse.json({
          success: false,
          error: 'Duplicate product code',
          message: 'Άλλο κλαρκ με αυτόν τον κωδικό προϊόντος υπάρχει ήδη'
        }, { status: 409 })
      }
    }
    
    // Prepare update data (only include provided fields)
    const updateData: any = {}
    if (body.product_code !== undefined) updateData.product_code = body.product_code?.trim()
    if (body.title !== undefined) updateData.title = body.title.trim()
    if (body.brand_id !== undefined) updateData.brand_id = body.brand_id
    if (body.category_id !== undefined) updateData.category_id = body.category_id
    if (body.subcategory_id !== undefined) updateData.subcategory_id = body.subcategory_id
    if (body.condition !== undefined) updateData.condition = body.condition
    if (body.model_year !== undefined) updateData.model_year = body.model_year
    if (body.fuel_type_id !== undefined) updateData.fuel_type_id = body.fuel_type_id
    if (body.lifting_capacity_kg !== undefined) updateData.lifting_capacity_kg = body.lifting_capacity_kg
    if (body.mast_type_id !== undefined) updateData.mast_type_id = body.mast_type_id
    if (body.mast_visibility !== undefined) updateData.mast_visibility = body.mast_visibility?.trim()
    if (body.max_lift_height_mm !== undefined) updateData.max_lift_height_mm = body.max_lift_height_mm
    if (body.description !== undefined) updateData.description = body.description?.trim()
    if (body.price !== undefined) updateData.price = body.price
    if (body.stock_quantity !== undefined) updateData.stock_quantity = body.stock_quantity
    if (body.is_available !== undefined) updateData.is_available = body.is_available
    
    // Update the forklift
    const updatedForklift = await forkliftQueries.update(forkliftId, updateData)
    
    return NextResponse.json({
      success: true,
      data: updatedForklift,
      message: 'Το κλαρκ ενημερώθηκε επιτυχώς'
    })
    
  } catch (error) {
    console.error('Error updating forklift:', error)
    
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
      message: 'Αποτυχία ενημέρωσης κλαρκ'
    }, { status: 500 })
  }
}

// DELETE /api/admin/forklifts - Delete forklift (expects ID in query params)
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
    
    const forkliftId = parseInt(id)
    if (isNaN(forkliftId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID',
        message: 'Μη έγκυρο ID'
      }, { status: 400 })
    }
    
    // Check if forklift exists
    const existingForklift = await forkliftQueries.getById(forkliftId)
    if (!existingForklift) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Το κλαρκ δεν βρέθηκε'
      }, { status: 404 })
    }
    
    // Delete the forklift (images will be cascade deleted)
    await forkliftQueries.delete(forkliftId)
    
    return NextResponse.json({
      success: true,
      message: 'Το κλαρκ διαγράφηκε επιτυχώς'
    })
    
  } catch (error) {
    console.error('Error deleting forklift:', error)
    
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
      message: 'Αποτυχία διαγραφής κλαρκ'
    }, { status: 500 })
  }
} 