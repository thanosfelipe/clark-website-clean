'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ForkliftWithDetails } from '@/lib/admin-queries'
import ImageUpload from './ImageUpload'
import EnhancedImagePreview from './EnhancedImagePreview'
import ImageSelector, { type SelectedImageFile } from './ImageSelector'
import { type ImageUploadResult } from '@/lib/storage'
import type { ImageData } from '../../hooks/useImageManager'

interface Brand {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
}

interface Subcategory {
  id: number
  name: string
  category_id: number
}

interface FuelType {
  id: number
  name: string
}

interface MastType {
  id: number
  name: string
}

interface ForkliftFormData {
  title: string
  brand_id: number | ''
  category_id: number | ''
  subcategory_id: number | ''
  condition: 'Καινούργιο' | 'Μεταχειρισμένο' | ''
  model_year: number | ''
  fuel_type_id: number | ''
  lifting_capacity_kg: number | ''
  mast_type_id: number | ''
  mast_visibility: string
  max_lift_height_mm: number | ''
  description: string
  price: number | ''
  stock_quantity: number | ''
  is_available: boolean
}

// Extended form data that includes selected images for creation
interface ForkliftFormSubmissionData extends ForkliftFormData {
  selectedImages?: SelectedImageFile[]
}

interface ForkliftFormProps {
  initialData?: ForkliftWithDetails
  isEditing?: boolean
  onSubmit: (data: ForkliftFormSubmissionData) => Promise<void>
  isLoading?: boolean
}

export default function ForkliftForm({ 
  initialData, 
  isEditing = false, 
  onSubmit, 
  isLoading = false 
}: ForkliftFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<ForkliftFormData>({
    title: '',
    brand_id: '',
    category_id: '',
    subcategory_id: '',
    condition: '',
    model_year: '',
    fuel_type_id: '',
    lifting_capacity_kg: '',
    mast_type_id: '',
    mast_visibility: '',
    max_lift_height_mm: '',
    description: '',
    price: '',
    stock_quantity: '',
    is_available: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoadingOptions, setIsLoadingOptions] = useState(true)
  
  // For editing: existing uploaded images (will be passed to EnhancedImagePreview)
  const [images, setImages] = useState<ImageData[]>([])

  // For creation: locally selected images
  const [selectedImages, setSelectedImages] = useState<SelectedImageFile[]>([])

  const [options, setOptions] = useState({
    brands: [] as Brand[],
    categories: [] as Category[],
    subcategories: [] as Subcategory[],
    fuelTypes: [] as FuelType[],
    mastTypes: [] as MastType[]
  })
  
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([])

  // Load form options (brands, categories, etc.)
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setIsLoadingOptions(true)
        
        const [brands, categories, subcategories, fuelTypes, mastTypes] = await Promise.all([
          fetch('/api/admin/brands'),
          fetch('/api/admin/categories'),
          fetch('/api/admin/subcategories'),
          fetch('/api/admin/fuel-types'),
          fetch('/api/admin/mast-types')
        ])

        const [brandsData, categoriesData, subcategoriesData, fuelTypesData, mastTypesData] = await Promise.all([
          brands.json(),
          categories.json(),
          subcategories.json(),
          fuelTypes.json(),
          mastTypes.json()
        ])

        setOptions({
          brands: brandsData.data || [],
          categories: categoriesData.data || [],
          subcategories: subcategoriesData.data || [],
          fuelTypes: fuelTypesData.data || [],
          mastTypes: mastTypesData.data || []
        })
      } catch (error) {
        console.error('Error loading options:', error)
      } finally {
        setIsLoadingOptions(false)
      }
    }

    loadOptions()
  }, [])

  // Initialize form data if editing
  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        title: initialData.title || '',
        brand_id: initialData.brand_id || '',
        category_id: initialData.category_id || '',
        subcategory_id: initialData.subcategory_id || '',
        condition: initialData.condition as 'Καινούργιο' | 'Μεταχειρισμένο' || '',
        model_year: initialData.model_year || '',
        fuel_type_id: initialData.fuel_type_id || '',
        lifting_capacity_kg: initialData.lifting_capacity_kg || '',
        mast_type_id: initialData.mast_type_id || '',
        mast_visibility: initialData.mast_visibility || '',
        max_lift_height_mm: initialData.max_lift_height_mm || '',
        description: initialData.description || '',
        price: initialData.price || '',
        stock_quantity: initialData.stock_quantity || 0,
        is_available: initialData.is_available !== false
      })
      
      // Load existing images if editing
      console.log('ForkliftForm Debug - initialData:', initialData, 'isEditing:', isEditing)
      console.log('ForkliftForm Debug - initialData.images:', initialData.images)
      if (initialData.images) {
        const imageData: ImageData[] = initialData.images.map((img, index) => ({
          id: img.id,
          image_url: img.image_url,
          alt_text: img.alt_text || undefined,
          is_primary: img.is_primary || false,
          sort_order: img.sort_order || index
        }))
        setImages(imageData)
      }
    }
  }, [initialData, isEditing])

  // Set up filtered subcategories to use fuel types values
  useEffect(() => {
    // Use fuel types as subcategory options instead of actual subcategories
    setFilteredSubcategories(
      options.fuelTypes.map(fuelType => ({
        id: fuelType.id,
        name: fuelType.name,
        category_id: 1 // Dummy category ID since we're using fuel types
      }))
    )
  }, [options.fuelTypes])

  // Sync fuel type with subcategory selection
  useEffect(() => {
    if (formData.subcategory_id) {
      // When subcategory changes, automatically set the same fuel type
      // Since subcategories are now based on fuel types, they have the same ID
      setFormData(prev => ({ 
        ...prev, 
        fuel_type_id: prev.subcategory_id 
      }))
    } else {
      // Clear fuel type when subcategory is cleared
      setFormData(prev => ({ 
        ...prev, 
        fuel_type_id: '' 
      }))
    }
  }, [formData.subcategory_id])

  // Auto-select "Κλαρκ" category if it exists
  useEffect(() => {
    if (options.categories.length > 0 && !isEditing) {
      const clarkCategory = options.categories.find(cat => cat.name === 'Κλαρκ')
      if (clarkCategory && !formData.category_id) {
        setFormData(prev => ({ ...prev, category_id: clarkCategory.id }))
      }
    }
  }, [options.categories, formData.category_id, isEditing])

  const handleInputChange = (
    field: keyof ForkliftFormData, 
    value: string | number | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Ο τίτλος είναι υποχρεωτικός'
    }
    if (!formData.brand_id) {
      newErrors.brand_id = 'Η μάρκα είναι υποχρεωτική'
    }
    // Category validation - should be auto-selected to "Κλαρκ"
    if (!formData.category_id) {
      // Try to auto-select "Κλαρκ" category if it exists
      const clarkCategory = options.categories.find(cat => cat.name === 'Κλαρκ')
      if (clarkCategory) {
        setFormData(prev => ({ ...prev, category_id: clarkCategory.id }))
      } else {
        newErrors.category_id = 'Η κατηγορία "Κλαρκ" δεν βρέθηκε στη βάση δεδομένων'
      }
    }
    if (!formData.subcategory_id) {
      newErrors.subcategory_id = 'Η υποκατηγορία είναι υποχρεωτική'
    }
    if (!formData.condition) {
      newErrors.condition = 'Η κατάσταση είναι υποχρεωτική'
    }
    if (!formData.lifting_capacity_kg) {
      newErrors.lifting_capacity_kg = 'Η ανυψωτική ικανότητα είναι υποχρεωτική'
    }
    if (!formData.max_lift_height_mm) {
      newErrors.max_lift_height_mm = 'Το μέγιστο ύψος ανύψωσης είναι υποχρεωτικό'
    }

    // Validation for numeric fields
    if (formData.model_year && (Number(formData.model_year) < 1950 || Number(formData.model_year) > new Date().getFullYear() + 1)) {
      newErrors.model_year = 'Μη έγκυρο έτος μοντέλου'
    }
    if (formData.lifting_capacity_kg && Number(formData.lifting_capacity_kg) <= 0) {
      newErrors.lifting_capacity_kg = 'Η ανυψωτική ικανότητα πρέπει να είναι θετική'
    }
    if (formData.max_lift_height_mm && Number(formData.max_lift_height_mm) <= 0) {
      newErrors.max_lift_height_mm = 'Το μέγιστο ύψος πρέπει να είναι θετικό'
    }
    if (formData.price && Number(formData.price) < 0) {
      newErrors.price = 'Η τιμή δεν μπορεί να είναι αρνητική'
    }
    if (formData.stock_quantity && Number(formData.stock_quantity) < 0) {
      newErrors.stock_quantity = 'Η ποσότητα αποθέματος δεν μπορεί να είναι αρνητική'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Include selectedImages for creation flow
    const submissionData: ForkliftFormSubmissionData = {
      ...formData,
      selectedImages: isEditing ? undefined : selectedImages
    }

    await onSubmit(submissionData)
  }

  const handleCancel = () => {
    // Clean up object URLs when canceling
    selectedImages.forEach(img => URL.revokeObjectURL(img.preview))
    router.push('/admin/forklifts')
  }

  // Image management handlers for editing mode

  const handleImagesChange = (updatedImages: ImageData[]) => {
    setImages(updatedImages)
  }

  const handleImageOperationComplete = async () => {
    // Reload forklift data to get updated images after delete operations
    if (initialData?.id) {
      try {
        const response = await fetch(`/api/admin/forklifts?id=${initialData.id}`)
        const result = await response.json()
        
        if (result.success && result.data && result.data.images) {
          const imageData: ImageData[] = result.data.images.map((img: any, index: number) => ({
            id: img.id,
            image_url: img.image_url,
            alt_text: img.alt_text || undefined,
            is_primary: img.is_primary || false,
            sort_order: img.sort_order || index
          }))
          setImages(imageData)
        }
      } catch (error) {
        console.error('Error reloading forklift data:', error)
      }
    }
  }

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      selectedImages.forEach(img => URL.revokeObjectURL(img.preview))
    }
  }, [])

  if (isLoadingOptions) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-300 mb-2">
          Τίτλος *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-3 py-2 bg-neutral-700 border rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
            errors.title ? 'border-red-500' : 'border-neutral-600'
          }`}
          placeholder="π.χ. TOYOTA 7FG25 Diesel Forklift"
          disabled={isLoading}
        />
        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
      </div>

      {/* Brand and Category Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand */}
        <div>
          <label htmlFor="brand_id" className="block text-sm font-medium text-neutral-300 mb-2">
            Μάρκα *
          </label>
          <select
            id="brand_id"
            value={formData.brand_id}
            onChange={(e) => handleInputChange('brand_id', e.target.value ? Number(e.target.value) : '')}
            className={`w-full px-3 py-2 bg-neutral-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
              errors.brand_id ? 'border-red-500' : 'border-neutral-600'
            }`}
            disabled={isLoading}
          >
            <option value="">Επιλέξτε μάρκα</option>
            {options.brands.map(brand => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          {errors.brand_id && <p className="mt-1 text-sm text-red-400">{errors.brand_id}</p>}
        </div>

        {/* Category - Fixed to "Κλαρκ" */}
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-neutral-300 mb-2">
            Κατηγορία *
          </label>
          <div className="w-full px-3 py-2 bg-neutral-600 border border-neutral-500 rounded-md text-white">
            Κλαρκ
          </div>
          <p className="mt-1 text-xs text-neutral-400">Η κατηγορία είναι προεπιλεγμένη για τη διαχείριση κλαρκ</p>
          {errors.category_id && <p className="mt-1 text-sm text-red-400">{errors.category_id}</p>}
        </div>
      </div>

      {/* Subcategory - Uses Fuel Types values */}
      <div>
        <label htmlFor="subcategory_id" className="block text-sm font-medium text-neutral-300 mb-2">
          Υποκατηγορία * (Τύπος Καυσίμου)
        </label>
        <select
          id="subcategory_id"
          value={formData.subcategory_id}
          onChange={(e) => handleInputChange('subcategory_id', e.target.value ? Number(e.target.value) : '')}
          className={`w-full px-3 py-2 bg-neutral-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
            errors.subcategory_id ? 'border-red-500' : 'border-neutral-600'
          }`}
          disabled={isLoading}
        >
          <option value="">Επιλέξτε υποκατηγορία</option>
          {filteredSubcategories.map(subcategory => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
        {errors.subcategory_id && <p className="mt-1 text-sm text-red-400">{errors.subcategory_id}</p>}
        <p className="mt-1 text-xs text-neutral-400">Οι υποκατηγορίες βασίζονται στους τύπους καυσίμου</p>
      </div>

      {/* Condition and Model Year Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Condition */}
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-neutral-300 mb-2">
            Κατάσταση *
          </label>
          <select
            id="condition"
            value={formData.condition}
            onChange={(e) => handleInputChange('condition', e.target.value as 'Καινούργιο' | 'Μεταχειρισμένο')}
            className={`w-full px-3 py-2 bg-neutral-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
              errors.condition ? 'border-red-500' : 'border-neutral-600'
            }`}
            disabled={isLoading}
          >
            <option value="">Επιλέξτε κατάσταση</option>
            <option value="Καινούργιο">Καινούργιο</option>
            <option value="Μεταχειρισμένο">Μεταχειρισμένο</option>
          </select>
          {errors.condition && <p className="mt-1 text-sm text-red-400">{errors.condition}</p>}
        </div>

        {/* Model Year */}
        <div>
          <label htmlFor="model_year" className="block text-sm font-medium text-neutral-300 mb-2">
            Έτος Μοντέλου
          </label>
          <input
            type="number"
            id="model_year"
            value={formData.model_year}
            onChange={(e) => handleInputChange('model_year', e.target.value ? Number(e.target.value) : '')}
            min="1950"
            max={new Date().getFullYear() + 1}
            className={`w-full px-3 py-2 bg-neutral-700 border rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
              errors.model_year ? 'border-red-500' : 'border-neutral-600'
            }`}
            placeholder="π.χ. 2020"
            disabled={isLoading}
          />
          {errors.model_year && <p className="mt-1 text-sm text-red-400">{errors.model_year}</p>}
        </div>
      </div>

      {/* Fuel Type and Lifting Capacity Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fuel Type - Auto-synced with Subcategory */}
        <div>
          <label htmlFor="fuel_type_id" className="block text-sm font-medium text-neutral-300 mb-2">
            Τύπος Καυσίμου
          </label>
          <div className={`w-full px-3 py-2 rounded-md text-white ${
            formData.fuel_type_id 
              ? 'bg-neutral-600 border border-neutral-500' 
              : 'bg-neutral-700 border border-neutral-600'
          }`}>
            {formData.fuel_type_id ? (
              options.fuelTypes.find(ft => ft.id === Number(formData.fuel_type_id))?.name || 'Δεν βρέθηκε'
            ) : (
              <span className="text-neutral-400">Επιλέξτε πρώτα υποκατηγορία</span>
            )}
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Ο τύπος καυσίμου ορίζεται αυτόματα βάσει της υποκατηγορίας
          </p>
        </div>

        {/* Lifting Capacity */}
        <div>
          <label htmlFor="lifting_capacity_kg" className="block text-sm font-medium text-neutral-300 mb-2">
            Ανυψωτική Ικανότητα (kg) *
          </label>
          <input
            type="number"
            id="lifting_capacity_kg"
            value={formData.lifting_capacity_kg}
            onChange={(e) => handleInputChange('lifting_capacity_kg', e.target.value ? Number(e.target.value) : '')}
            min="0"
            className={`w-full px-3 py-2 bg-neutral-700 border rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
              errors.lifting_capacity_kg ? 'border-red-500' : 'border-neutral-600'
            }`}
            placeholder="π.χ. 2500"
            disabled={isLoading}
          />
          {errors.lifting_capacity_kg && <p className="mt-1 text-sm text-red-400">{errors.lifting_capacity_kg}</p>}
        </div>
      </div>

      {/* Mast Type and Max Lift Height Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mast Type */}
        <div>
          <label htmlFor="mast_type_id" className="block text-sm font-medium text-neutral-300 mb-2">
            Τύπος Ιστού
          </label>
          <select
            id="mast_type_id"
            value={formData.mast_type_id}
            onChange={(e) => handleInputChange('mast_type_id', e.target.value ? Number(e.target.value) : '')}
            className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
            disabled={isLoading}
          >
            <option value="">Επιλέξτε τύπο ιστού</option>
            {options.mastTypes.map(mastType => (
              <option key={mastType.id} value={mastType.id}>
                {mastType.name}
              </option>
            ))}
          </select>
        </div>

        {/* Max Lift Height */}
        <div>
          <label htmlFor="max_lift_height_mm" className="block text-sm font-medium text-neutral-300 mb-2">
            Μέγιστο Ύψος Ανύψωσης (mm) *
          </label>
          <input
            type="number"
            id="max_lift_height_mm"
            value={formData.max_lift_height_mm}
            onChange={(e) => handleInputChange('max_lift_height_mm', e.target.value ? Number(e.target.value) : '')}
            min="0"
            className={`w-full px-3 py-2 bg-neutral-700 border rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
              errors.max_lift_height_mm ? 'border-red-500' : 'border-neutral-600'
            }`}
            placeholder="π.χ. 4500"
            disabled={isLoading}
          />
          {errors.max_lift_height_mm && <p className="mt-1 text-sm text-red-400">{errors.max_lift_height_mm}</p>}
        </div>
      </div>

      {/* Mast Visibility */}
      <div>
        <label htmlFor="mast_visibility" className="block text-sm font-medium text-neutral-300 mb-2">
          Ορατότητα Ιστού
        </label>
        <input
          type="text"
          id="mast_visibility"
          value={formData.mast_visibility}
          onChange={(e) => handleInputChange('mast_visibility', e.target.value)}
          className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
          placeholder="π.χ. Full-View"
          disabled={isLoading}
        />
      </div>

      {/* Price and Stock Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-neutral-300 mb-2">
            Τιμή (€)
          </label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value ? Number(e.target.value) : '')}
            min="0"
            step="0.01"
            className={`w-full px-3 py-2 bg-neutral-700 border rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
              errors.price ? 'border-red-500' : 'border-neutral-600'
            }`}
            placeholder="π.χ. 18500.00"
            disabled={isLoading}
          />
          {errors.price && <p className="mt-1 text-sm text-red-400">{errors.price}</p>}
        </div>

        {/* Stock Quantity */}
        <div>
          <label htmlFor="stock_quantity" className="block text-sm font-medium text-neutral-300 mb-2">
            Ποσότητα Αποθέματος
          </label>
          <input
            type="number"
            id="stock_quantity"
            value={formData.stock_quantity}
            onChange={(e) => handleInputChange('stock_quantity', e.target.value ? Number(e.target.value) : '')}
            min="0"
            className={`w-full px-3 py-2 bg-neutral-700 border rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
              errors.stock_quantity ? 'border-red-500' : 'border-neutral-600'
            }`}
            placeholder="π.χ. 1"
            disabled={isLoading}
          />
          {errors.stock_quantity && <p className="mt-1 text-sm text-red-400">{errors.stock_quantity}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-300 mb-2">
          Περιγραφή
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors resize-none"
          placeholder="Περιγραφή προϊόντος..."
          disabled={isLoading}
        />
      </div>

      {/* Image Management */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-white mb-4">
            Εικόνες Κλαρκ
          </h3>

          {isEditing ? (
            // Editing mode: Show uploaded images + upload new ones
            <>
              {/* Existing images with enhanced management */}
              {images.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-neutral-300 mb-3">Υπάρχουσες εικόνες</h4>
                  <EnhancedImagePreview
                    forkliftId={initialData?.id}
                    initialImages={images}
                    maxImages={3}
                    disabled={isLoading}
                    onImagesChange={handleImagesChange}
                    onOperationComplete={handleImageOperationComplete}
                  />
                </div>
              )}

              {/* Upload new images */}
              <div>
                <h4 className="text-sm font-medium text-neutral-300 mb-3">
                  {images.length > 0 ? 'Προσθήκη νέων εικόνων' : 'Ανέβασμα εικόνων'}
                </h4>
                <ImageUpload
                  forkliftId={initialData?.id}
                  maxFiles={3}
                  existingImagesCount={images.length}
                  onUploadComplete={handleImageOperationComplete}
                  disabled={isLoading}
                />
              </div>
            </>
          ) : (
            // Creation mode: Select images locally
            <div>
              <p className="text-sm text-neutral-400 mb-4">
                Επιλέξτε εικόνες για το κλαρκ. Θα ανέβουν αυτόματα μετά τη δημιουργία του.
              </p>
              <ImageSelector
                selectedImages={selectedImages}
                onImagesChange={setSelectedImages}
                maxFiles={3}
                disabled={isLoading}
              />
            </div>
          )}
        </div>
      </div>

      {/* Availability */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="is_available"
          checked={formData.is_available}
          onChange={(e) => handleInputChange('is_available', e.target.checked)}
          className="h-4 w-4 text-violet-500 focus:ring-violet-500 border-neutral-600 rounded"
          disabled={isLoading}
        />
        <label htmlFor="is_available" className="text-sm font-medium text-neutral-300">
          Διαθέσιμο για πώληση
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-neutral-700">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="px-6 py-2 border border-neutral-600 text-neutral-300 rounded-md hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-colors disabled:opacity-50"
        >
          Ακύρωση
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors flex items-center space-x-2"
        >
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isEditing ? 'Ενημέρωση' : 'Δημιουργία'}</span>
        </button>
      </div>
    </form>
  )
} 