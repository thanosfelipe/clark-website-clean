import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Supabase configuration
const supabaseUrl = 'https://aifgbbgclcukazrwezwk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZmdiYmdjbGN1a2F6cndlendrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTEzMTQsImV4cCI6MjA2NzY2NzMxNH0.HyjW5fgF6H1NjoOUJUX87NOUdWSG6c9C5Y4DTjvLyZQ'

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper types for the gallery (based on actual database structure)
export interface ForkliftListing {
  id: number
  product_code: string
  title: string
  brand_name: string
  category_name: string
  subcategory_name: string
  condition: string
  model_year: number
  fuel_type: string
  lifting_capacity_kg: number
  mast_type: string
  mast_visibility: string
  max_lift_height_mm: number
  description: string | null
  price: string // Price is stored as decimal/string in database
  stock_quantity: number
  is_available: boolean
  primary_image: string | null
  total_images: number
  created_at: string
  updated_at: string
}

export interface SearchFilters {
  search_term?: string
  brand_ids?: number[]
  condition_filter?: string
  fuel_type_ids?: number[]
  mast_type_ids?: number[]
  min_capacity?: number
  max_capacity?: number
  min_height?: number
  max_height?: number
  limit_count?: number
  offset_count?: number
}

// Fetch all forklifts using the view
export async function getAllForklifts(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('forklift_listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching forklifts:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in getAllForklifts:', error)
    throw error
  }
}

// Search forklifts using the stored function
export async function searchForklifts(filters: SearchFilters): Promise<any[]> {
  try {
    const { data, error } = await supabase.rpc('search_forklifts', {
      search_term: filters.search_term || undefined,
      brand_ids: filters.brand_ids || undefined,
      condition_filter: filters.condition_filter || undefined,
      fuel_type_ids: filters.fuel_type_ids || undefined,
      mast_type_ids: filters.mast_type_ids || undefined,
      min_capacity: filters.min_capacity || undefined,
      max_capacity: filters.max_capacity || undefined,
      min_height: filters.min_height || undefined,
      max_height: filters.max_height || undefined,
      limit_count: filters.limit_count || 50,
      offset_count: filters.offset_count || 0
    })

    if (error) {
      console.error('Error searching forklifts:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in searchForklifts:', error)
    throw error
  }
}

// Fetch filter options - ONLY show options that exist in available forklifts
export async function getBrands() {
  const { data, error } = await (supabase as any).rpc('get_available_brands')
  
  if (error) {
    // Fallback to regular query if function doesn't exist
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('brands')
      .select('id, name')
      .order('name')
    
    if (fallbackError) throw fallbackError
    return fallbackData || []
  }
  
  return data || []
}

export async function getFuelTypes() {
  const { data, error } = await (supabase as any).rpc('get_available_fuel_types')
  
  if (error) {
    // Fallback to regular query if function doesn't exist
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('fuel_types')
      .select('id, name')
      .order('name')
    
    if (fallbackError) throw fallbackError
    return fallbackData || []
  }
  
  return data || []
}

export async function getMastTypes() {
  const { data, error } = await (supabase as any).rpc('get_available_mast_types')
  
  if (error) {
    // Fallback to regular query if function doesn't exist
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('mast_types')
      .select('id, name')
      .order('name')
    
    if (fallbackError) throw fallbackError
    return fallbackData || []
  }
  
  return data || []
}

// Get dynamic capacity range from available forklifts
export async function getCapacityRange() {
  const { data, error } = await (supabase as any).rpc('get_available_capacity_range')
  
  if (error) {
    console.warn('Failed to get dynamic capacity range:', error)
    // Fallback to static range
    return { min_capacity: 1000, max_capacity: 10000 }
  }
  
  return data?.[0] || { min_capacity: 1000, max_capacity: 10000 }
}

// Get dynamic height range from available forklifts  
export async function getHeightRange() {
  const { data, error } = await (supabase as any).rpc('get_available_height_range')
  
  if (error) {
    console.warn('Failed to get dynamic height range:', error)
    // Fallback to static range
    return { min_height: 3000, max_height: 8000 }
  }
  
  return data?.[0] || { min_height: 3000, max_height: 8000 }
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')
  
  if (error) throw error
  return data || []
}

export async function getSubcategories() {
  const { data, error } = await supabase
    .from('subcategories')
    .select('id, name, category_id')
    .order('name')
  
  if (error) throw error
  return data || []
} 