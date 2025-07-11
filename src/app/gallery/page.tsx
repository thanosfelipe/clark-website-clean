'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { FunnelIcon } from '@heroicons/react/24/outline'
import AnimatedSection from '../components/AnimatedSection'
import Navigation from '../components/Navigation'
import { Particles } from '../components/ui/particles'
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '../components/ui/breadcrumb'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { getAllForklifts, getBrands, getFuelTypes, getMastTypes, getCapacityRange, getHeightRange } from '@/lib/supabase'
import { GallerySkeleton } from '../components/ui/skeleton'

// Μoving interfaces to the top for better organization
interface FilterState {
  search: string
  brands: string[]
  conditions: string[]
  fuelTypes: string[]
  mastTypes: string[]
  minCapacity: number
  maxCapacity: number
  minHeight: number
  maxHeight: number
}

interface CapacityRange {
  min_capacity: number
  max_capacity: number
}

interface HeightRange {
  min_height: number
  max_height: number
}

interface ForkliftData {
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
  price: string
  stock_quantity: number
  primary_image: string | null
  is_available: boolean
  total_images: number
}

// Main Gallery component that uses useSearchParams
function GalleryContent() {
  const searchParams = useSearchParams()
  
  const [allForklifts, setAllForklifts] = useState<any[]>([])
  const [filteredForklifts, setFilteredForklifts] = useState<any[]>([])
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(false) // Start closed, will be set based on screen size
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Dynamic filter options from database
  const [brands, setBrands] = useState<any[]>([])
  const [fuelTypes, setFuelTypes] = useState<any[]>([])
  const [mastTypes, setMastTypes] = useState<any[]>([])
  
  const conditions = ["Καινούργιο", "Μεταχειρισμένο"]
  
  // Set initial sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024 // lg breakpoint
      setSidebarOpen(!isMobile) // Open on desktop, closed on mobile
    }
    
    // Set initial state
    handleResize()
    
    // Listen for window resize
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Get initial filters from URL parameters
  const getInitialFilters = (): FilterState => {
    const urlFuelType = searchParams.get('fuelType')
    const urlMastType = searchParams.get('mastType')
    const urlBrand = searchParams.get('brand')
    const urlCondition = searchParams.get('condition')
    
    return {
      search: '',
      brands: urlBrand ? [urlBrand] : [],
      conditions: urlCondition ? [urlCondition] : [],
      fuelTypes: urlFuelType ? [urlFuelType] : [],
      mastTypes: urlMastType ? [urlMastType] : [],
      minCapacity: 0,
      maxCapacity: 10000,
      minHeight: 0,
      maxHeight: 10000
    }
  }
  
  const [filters, setFilters] = useState<FilterState>(getInitialFilters())

  // Update filters when URL parameters change
  useEffect(() => {
    const urlFuelType = searchParams.get('fuelType')
    const urlMastType = searchParams.get('mastType')
    const urlBrand = searchParams.get('brand')
    const urlCondition = searchParams.get('condition')
    
    setFilters(prev => ({
      ...prev,
      brands: urlBrand ? [urlBrand] : [],
      conditions: urlCondition ? [urlCondition] : [],
      fuelTypes: urlFuelType ? [urlFuelType] : [],
      mastTypes: urlMastType ? [urlMastType] : []
    }))
  }, [searchParams])

  // Load data from database on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Load forklifts and filter options in parallel
        const [forkliftData, brandsData, fuelTypesData, mastTypesData, capacityRange, heightRange] = await Promise.all([
          getAllForklifts(),
          getBrands(),
          getFuelTypes(),
          getMastTypes(),
          getCapacityRange(),
          getHeightRange()
        ])
        
        setAllForklifts(forkliftData)
        setFilteredForklifts(forkliftData)
        setBrands(brandsData)
        setFuelTypes(fuelTypesData)
        setMastTypes(mastTypesData)
        
        // Update filters with dynamic ranges but preserve URL-based filters
        setFilters(prev => ({
          ...prev,
          minCapacity: (capacityRange as CapacityRange).min_capacity,
          maxCapacity: (capacityRange as CapacityRange).max_capacity,
          minHeight: (heightRange as HeightRange).min_height,
          maxHeight: (heightRange as HeightRange).max_height
        }))
        
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Σφάλμα φόρτωσης δεδομένων')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Filter logic
  useEffect(() => {
    if (allForklifts.length === 0) return
    
    let filtered = allForklifts.filter((forklift: any) => {
      const matchesSearch = !filters.search || 
        forklift.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        forklift.brand_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        forklift.product_code?.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesBrand = filters.brands.length === 0 || filters.brands.includes(forklift.brand_name)
      const matchesCondition = filters.conditions.length === 0 || filters.conditions.includes(forklift.condition)
      const matchesFuelType = filters.fuelTypes.length === 0 || filters.fuelTypes.includes(forklift.fuel_type)
      const matchesMastType = filters.mastTypes.length === 0 || filters.mastTypes.includes(forklift.mast_type)
      const matchesCapacity = forklift.lifting_capacity_kg >= filters.minCapacity && forklift.lifting_capacity_kg <= filters.maxCapacity
      const matchesHeight = forklift.max_lift_height_mm >= filters.minHeight && forklift.max_lift_height_mm <= filters.maxHeight

      return matchesSearch && matchesBrand && matchesCondition && matchesFuelType && matchesMastType && matchesCapacity && matchesHeight
    })
    
    setFilteredForklifts(filtered)
  }, [filters, allForklifts])

  const toggleCard = (id: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleFilter = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentArray = prev[filterType] as string[]
      return {
        ...prev,
        [filterType]: currentArray.includes(value) 
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      }
    })
  }

  // Show skeleton loading while data is being fetched
  if (loading) {
    return (
      <>
        <Navigation />
        <GallerySkeleton />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-open-sans relative">
      {/* Navigation */}
      <Navigation />
      
      {/* Particles Background */}
      <Particles
        className="absolute inset-0 -z-10"
        quantity={80}
        ease={80}
        color="#ffffff"
        staticity={50}
        size={1.2}
      />

      <div className="flex h-screen mt-16">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Filter Sidebar */}
        <div className={`
          ${sidebarOpen ? 'w-80' : 'w-16'} 
          transition-all duration-300 bg-neutral-800/50 border-r border-neutral-800 backdrop-blur-sm overflow-y-auto
          lg:relative lg:z-auto
          fixed lg:static top-16 left-0 bottom-0 z-50
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            {/* Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`
                flex items-center justify-center w-full mb-6 p-3 bg-violet-500 rounded-lg hover:bg-violet-600 transition-colors
                ${!sidebarOpen ? 'lg:w-auto lg:h-10 lg:aspect-square' : ''}
              `}
            >
              {/* Filter Icon */}
              <FunnelIcon className="w-5 h-5 text-white" />
              {sidebarOpen && <span className="ml-2 font-medium">Φίλτρα</span>}
            </button>

            {sidebarOpen && (
              <AnimatedSection animation="fadeIn" className="space-y-6" pageId="gallery">
                {/* Search */}
                <div>
                  <label className="block text-lg font-medium mb-3 text-violet-300">
                    Αναζήτηση
                  </label>
                                      <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 fill-current" viewBox="0 0 24 24">
                      <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      placeholder="Αναζήτηση κλαρκ..."
                      className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-violet-500 text-sm"
                    />
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-lg font-medium mb-3 text-violet-300">
                    Μάρκα
                  </label>
                  <div className="space-y-2">
                    {brands.map((brand: any) => (
                      <label key={brand.id} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand.name)}
                          onChange={() => toggleFilter('brands', brand.name)}
                          className="rounded border-neutral-600 text-violet-500 focus:ring-violet-500 focus:ring-offset-0"
                        />
                        <span className="ml-3 text-sm">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-lg font-medium mb-3 text-violet-300">
                    Κατάσταση
                  </label>
                  <div className="space-y-2">
                    {conditions.map(condition => (
                      <label key={condition} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.conditions.includes(condition)}
                          onChange={() => toggleFilter('conditions', condition)}
                          className="rounded border-neutral-600 text-violet-500 focus:ring-violet-500 focus:ring-offset-0"
                        />
                        <span className="ml-3 text-sm">{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Fuel Type Filter */}
                <div>
                  <label className="block text-lg font-medium mb-3 text-violet-300">
                    Τύπος Καυσίμου
                  </label>
                  <div className="space-y-2">
                    {fuelTypes.map((fuelType: any) => (
                      <label key={fuelType.id} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.fuelTypes.includes(fuelType.name)}
                          onChange={() => toggleFilter('fuelTypes', fuelType.name)}
                          className="rounded border-neutral-600 text-violet-500 focus:ring-violet-500 focus:ring-offset-0"
                        />
                        <span className="ml-3 text-sm">{fuelType.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mast Type Filter */}
                <div>
                  <label className="block text-lg font-medium mb-3 text-violet-300">
                    Τύπος Ιστού
                  </label>
                  <div className="space-y-2">
                    {mastTypes.map((mastType: any) => (
                      <label key={mastType.id} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.mastTypes.includes(mastType.name)}
                          onChange={() => toggleFilter('mastTypes', mastType.name)}
                          className="rounded border-neutral-600 text-violet-500 focus:ring-violet-500 focus:ring-offset-0"
                        />
                        <span className="ml-3 text-sm">{mastType.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Capacity Range */}
                <div>
                  <label className="block text-lg font-medium mb-3 text-violet-300">
                    Ανυψωτική Ικανότητα (kg)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={filters.maxCapacity}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) }))}
                      className="w-full accent-violet-500"
                    />
                    <div className="flex justify-between text-sm text-neutral-400">
                      <span>0kg</span>
                      <span className="text-violet-300">{filters.maxCapacity}kg</span>
                      <span>10,000kg</span>
                    </div>
                  </div>
                </div>

                {/* Height Range */}
                <div>
                  <label className="block text-lg font-medium mb-3 text-violet-300">
                    Μέγιστο Ύψος (mm)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={filters.maxHeight}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxHeight: parseInt(e.target.value) }))}
                      className="w-full accent-violet-500"
                    />
                    <div className="flex justify-between text-sm text-neutral-400">
                      <span>0mm</span>
                      <span className="text-violet-300">{filters.maxHeight}mm</span>
                      <span>10,000mm</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto w-full lg:w-auto">
          <div className="p-8">
            {/* Header */}
            <AnimatedSection animation="fadeIn" className="mb-8" pageId="gallery">
              <h1 className="text-4xl font-regular mb-4 text-violet-300">
                Συλλογή Κλαρκ
              </h1>
              <p className="text-xl text-neutral-300 mb-6">
                Ανακαλύψτε την εκτενή συλλογή μας από κλαρκ υψηλής ποιότητας
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-400">
                  Βρέθηκαν {filteredForklifts.length} προϊόντα
                </p>
                <Breadcrumb>
                  <BreadcrumbList className="font-open-sans text-neutral-400">
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/" className="text-neutral-400 hover:text-violet-300 transition-colors">
                        ΑΡΧΙΚΗ
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-neutral-500">
                      <ChevronRightIcon className="w-4 h-4" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-violet-300 font-medium">
                        ΚΛΑΡΚ
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </AnimatedSection>



            {/* Error State */}
            {error && (
              <AnimatedSection animation="fadeIn" className="text-center py-16" pageId="gallery">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-medium mb-4 text-red-400">
                  Σφάλμα
                </h3>
                <p className="text-neutral-400 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
                >
                  Δοκιμάστε ξανά
                </button>
              </AnimatedSection>
            )}

            {/* Gallery Grid */}
            {!loading && !error && (
              <AnimatedSection animation="fadeIn" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" pageId="gallery">
                {filteredForklifts.map((forklift: any) => (
                <div
                  key={forklift.id}
                  className="bg-neutral-800/50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-neutral-800"
                >
                  {/* Image */}
                  <div className="relative h-64 bg-neutral-700">
                    <Image
                      src={forklift.primary_image || '/clark2.png'}
                      alt={forklift.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        forklift.condition === 'Καινούργιο' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}>
                        {forklift.condition}
                      </span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-violet-500/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {forklift.product_code}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title & Price */}
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-2 text-white line-clamp-2">
                        {forklift.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-violet-300">
                          €{parseFloat(forklift.price).toLocaleString()}
                        </span>
                        <span className="text-sm text-neutral-400">
                          {forklift.brand_name}
                        </span>
                      </div>
                    </div>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div>
                        <span className="text-neutral-400">Ανυψωτική:</span>
                        <div className="text-white font-medium">{forklift.lifting_capacity_kg}kg</div>
                      </div>
                      <div>
                        <span className="text-neutral-400">Ύψος:</span>
                        <div className="text-white font-medium">{forklift.max_lift_height_mm}mm</div>
                      </div>
                      <div>
                        <span className="text-neutral-400">Καύσιμο:</span>
                        <div className="text-white font-medium">{forklift.fuel_type}</div>
                      </div>
                      <div>
                        <span className="text-neutral-400">Έτος:</span>
                        <div className="text-white font-medium">{forklift.model_year}</div>
                      </div>
                    </div>

                    {/* Accordion Button */}
                    <button
                      onClick={() => toggleCard(forklift.id)}
                      className="w-full flex items-center justify-between p-4 bg-neutral-700/50 rounded-lg hover:bg-neutral-700 transition-colors border border-neutral-600"
                    >
                      <span className="font-medium text-violet-300">Χαρακτηριστικά</span>
                      {expandedCards.has(forklift.id) ? (
                        <svg className="w-5 h-5 text-violet-300 fill-current" viewBox="0 0 24 24">
                          <path d="M7.41 15.41L12 10.83L16.59 15.41L18 14L12 8L6 14L7.41 15.41Z"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-violet-300 fill-current" viewBox="0 0 24 24">
                          <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z"/>
                        </svg>
                      )}
                    </button>

                    {/* Accordion Content */}
                    {expandedCards.has(forklift.id) && (
                      <div className="mt-4 p-4 bg-neutral-900/50 rounded-lg border border-neutral-700 space-y-3 animate-fade-in">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-violet-500/20 rounded flex items-center justify-center mr-3">
                            <div className="w-3 h-3 bg-violet-500 rounded"></div>
                          </div>
                          <span className="text-sm">{forklift.subcategory_name}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center mr-3">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                          </div>
                          <span className="text-sm">Τύπος Ιστού: {forklift.mast_type}</span>
                        </div>

                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center mr-3">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          </div>
                          <span className="text-sm">Ορατότητα: {forklift.mast_visibility}</span>
                        </div>

                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-orange-500/20 rounded flex items-center justify-center mr-3">
                            <div className="w-3 h-3 bg-orange-500 rounded"></div>
                          </div>
                          <span className="text-sm">Απόθεμα: {forklift.stock_quantity} τεμάχια</span>
                        </div>

                        {forklift.description && (
                          <div className="pt-3 border-t border-neutral-700">
                            <p className="text-sm text-neutral-300 leading-relaxed">
                              {forklift.description}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </AnimatedSection>
            )}

            {/* No Results */}
            {!loading && !error && filteredForklifts.length === 0 && (
              <AnimatedSection animation="fadeIn" className="text-center py-16" pageId="gallery">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-medium mb-4 text-neutral-300">
                  Δεν βρέθηκαν αποτελέσματα
                </h3>
                <p className="text-neutral-400 mb-6">
                  Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης
                </p>
                <button
                  onClick={() => setFilters({
                    search: '',
                    brands: [],
                    conditions: [],
                    fuelTypes: [],
                    mastTypes: [],
                    minCapacity: 0,
                    maxCapacity: 10000,
                    minHeight: 0,
                    maxHeight: 10000
                  })}
                  className="px-6 py-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
                >
                  Καθαρισμός Φίλτρων
                </button>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Floating Filter Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-6 right-6 lg:hidden z-50 w-14 h-14 bg-violet-500 rounded-full shadow-lg flex items-center justify-center hover:bg-violet-600 transition-colors"
        >
          <FunnelIcon className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  )
}

// Main Gallery component with Suspense boundary
export default function Gallery() {
  return (
    <Suspense fallback={<GallerySkeleton />}>
      <GalleryContent />
    </Suspense>
  )
}