import { supabase } from './supabase'
import type { Database } from './database.types'

// TypeScript types from database
type Tables = Database['public']['Tables']
type Brand = Tables['brands']['Row']
type BrandInsert = Tables['brands']['Insert']
type BrandUpdate = Tables['brands']['Update']

type Category = Tables['categories']['Row']
type CategoryInsert = Tables['categories']['Insert']
type CategoryUpdate = Tables['categories']['Update']

type Subcategory = Tables['subcategories']['Row']
type SubcategoryInsert = Tables['subcategories']['Insert']
type SubcategoryUpdate = Tables['subcategories']['Update']

type FuelType = Tables['fuel_types']['Row']
type FuelTypeInsert = Tables['fuel_types']['Insert']
type FuelTypeUpdate = Tables['fuel_types']['Update']

type MastType = Tables['mast_types']['Row']
type MastTypeInsert = Tables['mast_types']['Insert']
type MastTypeUpdate = Tables['mast_types']['Update']

type Forklift = Tables['forklifts']['Row']
type ForkliftInsert = Tables['forklifts']['Insert']
type ForkliftUpdate = Tables['forklifts']['Update']

type ForkliftImage = Tables['forklift_images']['Row']
type ForkliftImageInsert = Tables['forklift_images']['Insert']
type ForkliftImageUpdate = Tables['forklift_images']['Update']

export type ContentItem = Tables['content_items']['Row']
export type ContentItemInsert = Tables['content_items']['Insert']
export type ContentItemUpdate = Tables['content_items']['Update']

// Extended types for joined data
export interface ForkliftWithDetails extends Forklift {
  brand?: Brand | null
  category?: Category | null
  subcategory?: Subcategory | null
  fuel_type?: FuelType | null
  mast_type?: MastType | null
  images?: ForkliftImage[] | null
}

export interface SubcategoryWithCategory extends Subcategory {
  category?: Category | null
}

// Error types
export class DatabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

// Utility function for error handling
function handleDatabaseError(error: any): never {
  console.error('Database error:', error)
  throw new DatabaseError(
    error.message || 'Database operation failed',
    error.code
  )
}

// ============================================================================
// BRANDS QUERIES
// ============================================================================

export const brandQueries = {
  // Get all brands
  async getAll(): Promise<Brand[]> {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name')
    
    if (error) handleDatabaseError(error)
    return data || []
  },

  // Get brand by ID
  async getById(id: number): Promise<Brand | null> {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') handleDatabaseError(error)
    return data || null
  },

  // Create brand
  async create(brand: BrandInsert): Promise<Brand> {
    const { data, error } = await supabase
      .from('brands')
      .insert(brand)
      .select()
      .single()
    
    if (error) handleDatabaseError(error)
    return data
  },

  // Update brand
  async update(id: number, updates: BrandUpdate): Promise<Brand> {
    const { data, error } = await supabase
      .from('brands')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) handleDatabaseError(error)
    return data
  },

  // Delete brand
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id)
    
    if (error) handleDatabaseError(error)
  },

  // Check if brand name exists
  async nameExists(name: string, excludeId?: number): Promise<boolean> {
    let query = supabase
      .from('brands')
      .select('id')
      .eq('name', name)
    
    if (excludeId) {
      query = query.neq('id', excludeId)
    }
    
    const { data, error } = await query
    
    if (error) handleDatabaseError(error)
    return (data?.length || 0) > 0
  }
}

// ============================================================================
// CATEGORIES QUERIES
// ============================================================================

export const categoryQueries = {
  // Get all categories
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) handleDatabaseError(error)
    return data || []
  },

  // Get category by ID
  async getById(id: number): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') handleDatabaseError(error)
    return data || null
  },

  // Create category
  async create(category: CategoryInsert): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single()
    
    if (error) handleDatabaseError(error)
    return data
  },

  // Update category
  async update(id: number, updates: CategoryUpdate): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) handleDatabaseError(error)
    return data
  },

  // Delete category
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    
    if (error) handleDatabaseError(error)
  },

  // Check if category name exists
  async nameExists(name: string, excludeId?: number): Promise<boolean> {
    let query = supabase
      .from('categories')
      .select('id')
      .eq('name', name)
    
    if (excludeId) {
      query = query.neq('id', excludeId)
    }
    
    const { data, error } = await query
    
    if (error) handleDatabaseError(error)
    return (data?.length || 0) > 0
  }
}

// ============================================================================
// SUBCATEGORIES QUERIES
// ============================================================================

export const subcategoryQueries = {
  // Get all subcategories with category info
  async getAll(): Promise<SubcategoryWithCategory[]> {
    const { data, error } = await supabase
      .from('subcategories')
      .select(`
        *,
        category:categories(*)
      `)
      .order('name')
    
    if (error) handleDatabaseError(error)
    return data as SubcategoryWithCategory[] || []
  },

  // Get subcategories by category ID
  async getByCategoryId(categoryId: number): Promise<Subcategory[]> {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*')
      .eq('category_id', categoryId)
      .order('name')
    
    if (error) handleDatabaseError(error)
    return data || []
  },

  // Get subcategory by ID
  async getById(id: number): Promise<SubcategoryWithCategory | null> {
    const { data, error } = await supabase
      .from('subcategories')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') handleDatabaseError(error)
    return data as SubcategoryWithCategory || null
  },

  // Create subcategory
  async create(subcategory: SubcategoryInsert): Promise<Subcategory> {
    const { data, error } = await supabase
      .from('subcategories')
      .insert(subcategory)
      .select()
      .single()
    
    if (error) handleDatabaseError(error)
    return data
  },

  // Update subcategory
  async update(id: number, updates: SubcategoryUpdate): Promise<Subcategory> {
    const { data, error } = await supabase
      .from('subcategories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) handleDatabaseError(error)
    return data
  },

  // Delete subcategory
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', id)
    
    if (error) handleDatabaseError(error)
  }
}

// ============================================================================
// FUEL TYPES QUERIES
// ============================================================================

export const fuelTypeQueries = {
  // Get all fuel types
  async getAll(): Promise<FuelType[]> {
    const { data, error } = await supabase
      .from('fuel_types')
      .select('*')
      .order('name')
    
    if (error) handleDatabaseError(error)
    return data || []
  },

  // Get fuel type by ID
  async getById(id: number): Promise<FuelType | null> {
    const { data, error } = await supabase
      .from('fuel_types')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') handleDatabaseError(error)
    return data || null
  },

  // Create fuel type
  async create(fuelType: FuelTypeInsert): Promise<FuelType> {
    const { data, error } = await supabase
      .from('fuel_types')
      .insert(fuelType)
      .select()
      .single()
    
    if (error) handleDatabaseError(error)
    return data
  },

  // Update fuel type
  async update(id: number, updates: FuelTypeUpdate): Promise<FuelType> {
    const { data, error } = await supabase
      .from('fuel_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) handleDatabaseError(error)
    return data
  },

  // Delete fuel type
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('fuel_types')
      .delete()
      .eq('id', id)
    
    if (error) handleDatabaseError(error)
  },

  // Check if fuel type name exists
  async nameExists(name: string, excludeId?: number): Promise<boolean> {
    let query = supabase
      .from('fuel_types')
      .select('id')
      .eq('name', name)
    
    if (excludeId) {
      query = query.neq('id', excludeId)
    }
    
    const { data, error } = await query
    
    if (error) handleDatabaseError(error)
    return (data?.length || 0) > 0
  }
}

// ============================================================================
// MAST TYPES QUERIES
// ============================================================================

export const mastTypeQueries = {
  // Get all mast types
  async getAll(): Promise<MastType[]> {
    const { data, error } = await supabase
      .from('mast_types')
      .select('*')
      .order('name')
    
    if (error) handleDatabaseError(error)
    return data || []
  },

  // Get mast type by ID
  async getById(id: number): Promise<MastType | null> {
    const { data, error } = await supabase
      .from('mast_types')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') handleDatabaseError(error)
    return data || null
  },

  // Create mast type
  async create(mastType: MastTypeInsert): Promise<MastType> {
    const { data, error } = await supabase
      .from('mast_types')
      .insert(mastType)
      .select()
      .single()
    
    if (error) handleDatabaseError(error)
    return data
  },

  // Update mast type
  async update(id: number, updates: MastTypeUpdate): Promise<MastType> {
    const { data, error } = await supabase
      .from('mast_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) handleDatabaseError(error)
    return data
  },

  // Delete mast type
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('mast_types')
      .delete()
      .eq('id', id)
    
    if (error) handleDatabaseError(error)
  },

  // Check if mast type name exists
  async nameExists(name: string, excludeId?: number): Promise<boolean> {
    let query = supabase
      .from('mast_types')
      .select('id')
      .eq('name', name)
    
    if (excludeId) {
      query = query.neq('id', excludeId)
    }
    
    const { data, error } = await query
    
    if (error) handleDatabaseError(error)
    return (data?.length || 0) > 0
  }
}

// ============================================================================
// FORKLIFT IMAGES QUERIES
// ============================================================================

export const forkliftImageQueries = {
  // Get images for a forklift
  async getByForkliftId(forkliftId: number): Promise<ForkliftImage[]> {
    const { data, error } = await supabase
      .from('forklift_images')
      .select('*')
      .eq('forklift_id', forkliftId)
      .order('sort_order')
    
    if (error) handleDatabaseError(error)
    return data || []
  },

  // Add image to forklift
  async create(image: ForkliftImageInsert): Promise<ForkliftImage> {
    const { data, error } = await supabase
      .from('forklift_images')
      .insert(image)
      .select()
      .single()
    
    if (error) handleDatabaseError(error)
    return data
  },

  // Update image
  async update(id: number, updates: ForkliftImageUpdate): Promise<ForkliftImage> {
    const { data, error } = await supabase
      .from('forklift_images')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) handleDatabaseError(error)
    return data
  },

  // Delete image
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('forklift_images')
      .delete()
      .eq('id', id)
    
    if (error) handleDatabaseError(error)
  },

  // Set primary image (unsets others)
  async setPrimary(forkliftId: number, imageId: number): Promise<void> {
    // Start transaction to ensure consistency
    const { error: resetError } = await supabase
      .from('forklift_images')
      .update({ is_primary: false })
      .eq('forklift_id', forkliftId)
    
    if (resetError) handleDatabaseError(resetError)
    
    const { error: setPrimaryError } = await supabase
      .from('forklift_images')
      .update({ is_primary: true })
      .eq('id', imageId)
    
    if (setPrimaryError) handleDatabaseError(setPrimaryError)
  },

  // Delete all images for a forklift
  async deleteByForkliftId(forkliftId: number): Promise<void> {
    const { error } = await supabase
      .from('forklift_images')
      .delete()
      .eq('forklift_id', forkliftId)
    
    if (error) handleDatabaseError(error)
  },

  // Create multiple images for a forklift
  async createMultiple(forkliftId: number, images: Array<{
    image_url: string
    alt_text?: string
    is_primary: boolean
    sort_order: number
  }>): Promise<ForkliftImage[]> {
    const imageInserts: ForkliftImageInsert[] = images.map(image => ({
      forklift_id: forkliftId,
      image_url: image.image_url,
      alt_text: image.alt_text || null,
      is_primary: image.is_primary,
      sort_order: image.sort_order
    }))

    const { data, error } = await supabase
      .from('forklift_images')
      .insert(imageInserts)
      .select()
    
    if (error) handleDatabaseError(error)
    return data || []
  }
}

// ============================================================================
// FORKLIFTS QUERIES
// ============================================================================

export const forkliftQueries = {
  // Get all forklifts with related data
  async getAll(): Promise<ForkliftWithDetails[]> {
    const { data, error } = await supabase
      .from('forklifts')
      .select(`
        *,
        brand:brands(*),
        category:categories(*),
        subcategory:subcategories(*),
        fuel_type:fuel_types(*),
        mast_type:mast_types(*),
        images:forklift_images(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) handleDatabaseError(error)
    return data as ForkliftWithDetails[] || []
  },

  // Get forklift by ID with all related data
  async getById(id: number): Promise<ForkliftWithDetails | null> {
    const { data, error } = await supabase
      .from('forklifts')
      .select(`
        *,
        brand:brands(*),
        category:categories(*),
        subcategory:subcategories(*),
        fuel_type:fuel_types(*),
        mast_type:mast_types(*),
        images:forklift_images(*)
      `)
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') handleDatabaseError(error)
    return data as ForkliftWithDetails || null
  },

  // Create forklift with images (transaction)
  async createWithImages(
    forklift: ForkliftInsert,
    images: ForkliftImageInsert[] = []
  ): Promise<ForkliftWithDetails> {
    // Generate product code if not provided
    if (!forklift.product_code) {
      const nextId = await this.getNextId()
      forklift.product_code = `PID_${String(nextId).padStart(4, '0')}`
    }

    // Insert forklift
    const { data: newForklift, error: forkliftError } = await supabase
      .from('forklifts')
      .insert(forklift)
      .select()
      .single()
    
    if (forkliftError) handleDatabaseError(forkliftError)

    // Insert images if provided
    if (images.length > 0) {
      const imagesWithForkliftId = images.map((img, index) => ({
        ...img,
        forklift_id: newForklift.id,
        sort_order: img.sort_order ?? index,
        is_primary: img.is_primary ?? (index === 0) // First image is primary by default
      }))

      const { error: imagesError } = await supabase
        .from('forklift_images')
        .insert(imagesWithForkliftId)
      
      if (imagesError) {
        // Rollback: delete the forklift if images failed
        await supabase.from('forklifts').delete().eq('id', newForklift.id)
        handleDatabaseError(imagesError)
      }
    }

    // Return the complete forklift with all relations
    return await this.getById(newForklift.id) as ForkliftWithDetails
  },

  // Update forklift
  async update(id: number, updates: ForkliftUpdate): Promise<ForkliftWithDetails> {
    const { data, error } = await supabase
      .from('forklifts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) handleDatabaseError(error)

    // Return the complete forklift with all relations
    return await this.getById(id) as ForkliftWithDetails
  },

  // Delete forklift (images cascade automatically)
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('forklifts')
      .delete()
      .eq('id', id)
    
    if (error) handleDatabaseError(error)
  },

  // Get next ID for product code generation
  async getNextId(): Promise<number> {
    const { data, error } = await supabase
      .from('forklifts')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
    
    if (error) handleDatabaseError(error)
    return (data?.[0]?.id || 0) + 1
  },

  // Check if product code exists
  async productCodeExists(productCode: string, excludeId?: number): Promise<boolean> {
    let query = supabase
      .from('forklifts')
      .select('id')
      .eq('product_code', productCode)
    
    if (excludeId) {
      query = query.neq('id', excludeId)
    }
    
    const { data, error } = await query
    
    if (error) handleDatabaseError(error)
    return (data?.length || 0) > 0
  }
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export const validation = {
  // Validate brand data
  validateBrand(data: Partial<BrandInsert>): string[] {
    const errors: string[] = []
    
    if (!data.name?.trim()) {
      errors.push('Το όνομα μάρκας είναι υποχρεωτικό')
    } else if (data.name.length > 100) {
      errors.push('Το όνομα μάρκας δεν μπορεί να υπερβαίνει τους 100 χαρακτήρες')
    }
    
    return errors
  },

  // Validate category data
  validateCategory(data: Partial<CategoryInsert>): string[] {
    const errors: string[] = []
    
    if (!data.name?.trim()) {
      errors.push('Το όνομα κατηγορίας είναι υποχρεωτικό')
    } else if (data.name.length > 100) {
      errors.push('Το όνομα κατηγορίας δεν μπορεί να υπερβαίνει τους 100 χαρακτήρες')
    }
    
    return errors
  },

  // Validate subcategory data
  validateSubcategory(data: Partial<SubcategoryInsert>): string[] {
    const errors: string[] = []
    
    if (!data.name?.trim()) {
      errors.push('Το όνομα υποκατηγορίας είναι υποχρεωτικό')
    } else if (data.name.length > 100) {
      errors.push('Το όνομα υποκατηγορίας δεν μπορεί να υπερβαίνει τους 100 χαρακτήρες')
    }
    
    if (!data.category_id) {
      errors.push('Η κατηγορία είναι υποχρεωτική')
    }
    
    return errors
  },

  // Validate fuel type data
  validateFuelType(data: Partial<FuelTypeInsert>): string[] {
    const errors: string[] = []
    
    if (!data.name?.trim()) {
      errors.push('Το όνομα τύπου καυσίμου είναι υποχρεωτικό')
    } else if (data.name.length > 50) {
      errors.push('Το όνομα τύπου καυσίμου δεν μπορεί να υπερβαίνει τους 50 χαρακτήρες')
    }
    
    return errors
  },

  // Validate mast type data
  validateMastType(data: Partial<MastTypeInsert>): string[] {
    const errors: string[] = []
    
    if (!data.name?.trim()) {
      errors.push('Το όνομα τύπου ιστού είναι υποχρεωτικό')
    } else if (data.name.length > 50) {
      errors.push('Το όνομα τύπου ιστού δεν μπορεί να υπερβαίνει τους 50 χαρακτήρες')
    }
    
    return errors
  },

  // Validate forklift data
  validateForklift(data: Partial<ForkliftInsert>): string[] {
    const errors: string[] = []
    
    if (!data.title?.trim()) {
      errors.push('Ο τίτλος είναι υποχρεωτικός')
    } else if (data.title.length > 200) {
      errors.push('Ο τίτλος δεν μπορεί να υπερβαίνει τους 200 χαρακτήρες')
    }
    
    if (!data.condition) {
      errors.push('Η κατάσταση είναι υποχρεωτική')
    } else if (!['Καινούργιο', 'Μεταχειρισμένο'].includes(data.condition)) {
      errors.push('Η κατάσταση πρέπει να είναι "Καινούργιο" ή "Μεταχειρισμένο"')
    }
    
    if (!data.lifting_capacity_kg || data.lifting_capacity_kg <= 0) {
      errors.push('Η ανυψωτική ικανότητα πρέπει να είναι θετικός αριθμός')
    }
    
    if (!data.max_lift_height_mm || data.max_lift_height_mm <= 0) {
      errors.push('Το μέγιστο ύψος ανύψωσης πρέπει να είναι θετικός αριθμός')
    }
    
    if (data.model_year && (data.model_year < 1900 || data.model_year > new Date().getFullYear() + 1)) {
      errors.push('Το έτος μοντέλου δεν είναι έγκυρο')
    }
    
    if (data.price && data.price < 0) {
      errors.push('Η τιμή δεν μπορεί να είναι αρνητική')
    }
    
    if (data.stock_quantity && data.stock_quantity < 0) {
      errors.push('Η ποσότητα αποθέματος δεν μπορεί να είναι αρνητική')
    }
    
    return errors
  }
}

// ============================================================================
// CONTENT ITEMS QUERIES
// ============================================================================

export const contentQueries = {
  // Get all content items
  async getAll(): Promise<ContentItem[]> {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .order('page', { ascending: true })
      .order('content_key', { ascending: true })

    if (error) handleDatabaseError(error)
    return data || []
  },

  // Get content items by page
  async getByPage(page: string): Promise<ContentItem[]> {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('page', page)
      .eq('is_active', true)
      .order('content_key')

    if (error) handleDatabaseError(error)
    return data || []
  },

  // Get content item by key
  async getByKey(contentKey: string): Promise<ContentItem | null> {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('content_key', contentKey)
      .single()

    if (error && error.code !== 'PGRST116') handleDatabaseError(error)
    return data || null
  },

  // Get content item by ID
  async getById(id: number): Promise<ContentItem | null> {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') handleDatabaseError(error)
    return data || null
  },

  // Create content item
  async create(content: ContentItemInsert): Promise<ContentItem> {
    const { data, error } = await supabase
      .from('content_items')
      .insert(content)
      .select()
      .single()

    if (error) handleDatabaseError(error)
    return data
  },

  // Update content item
  async update(id: number, updates: ContentItemUpdate): Promise<ContentItem> {
    const { data, error } = await supabase
      .from('content_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) handleDatabaseError(error)
    return data
  },

  // Update content by key
  async updateByKey(contentKey: string, contentValue: string): Promise<ContentItem> {
    const { data, error } = await supabase
      .from('content_items')
      .update({ content_value: contentValue, updated_at: new Date().toISOString() })
      .eq('content_key', contentKey)
      .select()
      .single()

    if (error) handleDatabaseError(error)
    return data
  },

  // Delete content item
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id)

    if (error) handleDatabaseError(error)
  },

  // Validation function
  validateContentItem(data: ContentItemInsert | ContentItemUpdate): string[] {
    const errors: string[] = []

    if ('content_key' in data && !data.content_key?.trim()) {
      errors.push('Το κλειδί περιεχομένου είναι υποχρεωτικό')
    }

    if ('content_key' in data && data.content_key && data.content_key.length > 255) {
      errors.push('Το κλειδί περιεχομένου δεν μπορεί να υπερβαίνει τους 255 χαρακτήρες')
    }

    if ('content_value' in data && !data.content_value?.trim()) {
      errors.push('Η τιμή περιεχομένου είναι υποχρεωτική')
    }

    if ('page' in data && data.page && data.page.length > 100) {
      errors.push('Η σελίδα δεν μπορεί να υπερβαίνει τους 100 χαρακτήρες')
    }

    if ('content_type' in data && data.content_type && data.content_type.length > 50) {
      errors.push('Ο τύπος περιεχομένου δεν μπορεί να υπερβαίνει τους 50 χαρακτήρες')
    }

    return errors
  }
}

// ============================================================================
// CONVENIENT EXPORTS
// ============================================================================

export const createForkliftImages = forkliftImageQueries.createMultiple 