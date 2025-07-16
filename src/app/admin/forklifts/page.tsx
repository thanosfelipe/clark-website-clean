'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ViewColumnsIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import ForkliftCard from '../components/ForkliftCard'
import type { ForkliftWithDetails } from '@/lib/admin-queries'

export default function ForkliftsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [forklifts, setForklifts] = useState<ForkliftWithDetails[]>([])
  const [filteredForklifts, setFilteredForklifts] = useState<ForkliftWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    brand: '',
    condition: '',
    availability: '',
    minPrice: '',
    maxPrice: ''
  })
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Load forklifts
  const loadForklifts = async () => {
    try {
      setIsLoading(true)
      setError('')
      console.log('Loading forklifts from API...')
      
      const response = await fetch('/api/admin/forklifts', {
        cache: 'no-store' // Ensure fresh data
      })
      const result = await response.json()
      
      console.log('Forklifts API response:', result)
      
      if (result.success) {
        setForklifts(result.data || [])
        console.log(`Loaded ${(result.data || []).length} forklifts`)
      } else {
        setError(result.message || 'Σφάλμα φόρτωσης κλαρκ')
      }
    } catch (err) {
      console.error('Error loading forklifts:', err)
      setError('Σφάλμα σύνδεσης')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadForklifts()
  }, [])

  // Handle URL parameters for success messages
  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setSuccessMessage(message)
      
      // Refresh data when coming back from creation/editing
      loadForklifts()
      
      // Clear the message from URL after a delay
      setTimeout(() => {
        setSuccessMessage('')
        const url = new URL(window.location.href)
        url.searchParams.delete('message')
        window.history.replaceState({}, '', url.toString())
      }, 5000)
    }
  }, [searchParams])

  // Apply filters and search
  useEffect(() => {
    let filtered = [...forklifts]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(forklift => 
        forklift.title.toLowerCase().includes(term) ||
        forklift.product_code?.toLowerCase().includes(term) ||
        forklift.brand?.name.toLowerCase().includes(term) ||
        forklift.description?.toLowerCase().includes(term)
      )
    }

    // Brand filter
    if (filters.brand) {
      filtered = filtered.filter(forklift => 
        forklift.brand?.name === filters.brand
      )
    }

    // Condition filter
    if (filters.condition) {
      filtered = filtered.filter(forklift => 
        forklift.condition === filters.condition
      )
    }

    // Availability filter
    if (filters.availability) {
      const isAvailable = filters.availability === 'available'
      filtered = filtered.filter(forklift => 
        forklift.is_available === isAvailable
      )
    }

    // Price filters
    if (filters.minPrice && !isNaN(Number(filters.minPrice))) {
      filtered = filtered.filter(forklift => 
        forklift.price && forklift.price >= Number(filters.minPrice)
      )
    }
    
    if (filters.maxPrice && !isNaN(Number(filters.maxPrice))) {
      filtered = filtered.filter(forklift => 
        forklift.price && forklift.price <= Number(filters.maxPrice)
      )
    }

    setFilteredForklifts(filtered)
  }, [forklifts, searchTerm, filters])

  const handleAddNew = () => {
    router.push('/admin/forklifts/add')
  }

  const handleDeleteForklift = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/forklifts?id=${id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Remove from local state
        setForklifts(prev => prev.filter(f => f.id !== id))
      } else {
        alert(result.message || 'Σφάλμα διαγραφής')
      }
    } catch (error) {
      console.error('Error deleting forklift:', error)
      alert('Σφάλμα σύνδεσης')
    }
  }

  const clearFilters = () => {
    setFilters({
      brand: '',
      condition: '',
      availability: '',
      minPrice: '',
      maxPrice: ''
    })
    setSearchTerm('')
  }

  // Get unique brands for filter
  const uniqueBrands = Array.from(
    new Set(forklifts.map(f => f.brand?.name).filter(Boolean))
  ).sort()

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 flex items-center space-x-3">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
          <div>
            <h3 className="text-lg font-semibold text-red-400">Σφάλμα</h3>
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => loadForklifts()}
              className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              Επανάληψη
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Διαχείριση Κλαρκ</h1>
          <p className="text-neutral-400">
            Συνολικά {filteredForklifts.length} από {forklifts.length} κλαρκ
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => loadForklifts()}
            disabled={isLoading}
            className="flex items-center px-3 py-2 bg-neutral-700 hover:bg-neutral-600 disabled:bg-neutral-800 text-white rounded-lg transition-colors"
            title="Ανανέωση δεδομένων"
          >
            <div className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}>
              🔄
            </div>
            {isLoading ? 'Φόρτωση...' : 'Ανανέωση'}
          </button>
          
          <button
            onClick={handleAddNew}
            className="flex items-center px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Προσθήκη Κλαρκ
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircleIcon className="h-6 w-6 text-green-400" />
          <div className="flex-1">
            <p className="text-green-300">{successMessage}</p>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            className="p-1 text-green-400 hover:text-green-300 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Αναζήτηση κλαρκ (τίτλος, κωδικός, μάρκα)..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-violet-500 text-white' 
                : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
            }`}
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Φίλτρα
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
            className="flex items-center px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 rounded-lg transition-colors"
            title={viewMode === 'grid' ? 'Προβολή λίστας' : 'Προβολή grid'}
          >
            <ViewColumnsIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Μάρκα
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">Όλες οι μάρκες</option>
                  {uniqueBrands.map(brand => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Κατάσταση
                </label>
                <select
                  value={filters.condition}
                  onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">Όλες οι καταστάσεις</option>
                  <option value="Καινούργιο">Καινούργιο</option>
                  <option value="Μεταχειρισμένο">Μεταχειρισμένο</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Διαθεσιμότητα
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">Όλα</option>
                  <option value="available">Διαθέσιμα</option>
                  <option value="unavailable">Μη διαθέσιμα</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Ελάχιστη τιμή (€)
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Μέγιστη τιμή (€)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  placeholder="∞"
                  min="0"
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 rounded-md transition-colors"
              >
                Καθαρισμός φίλτρων
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
        </div>
      ) : filteredForklifts.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-white mb-2">
              {forklifts.length === 0 ? 'Δεν υπάρχουν κλαρκ' : 'Δεν βρέθηκαν αποτελέσματα'}
            </h3>
            <p className="text-neutral-400 mb-4">
              {forklifts.length === 0 
                ? 'Προσθέστε το πρώτο κλαρκ στη βάση δεδομένων'
                : 'Δοκιμάστε να αλλάξετε τα κριτήρια αναζήτησης ή φιλτραρίσματος'
              }
            </p>
            {forklifts.length === 0 && (
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-md transition-colors"
              >
                Προσθήκη πρώτου κλαρκ
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredForklifts.map((forklift) => (
                <ForkliftCard
                  key={forklift.id}
                  forklift={forklift}
                  onDelete={handleDeleteForklift}
                />
              ))}
            </div>
          ) : (
            // Table View
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-700">
                  <thead className="bg-neutral-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                        Κλαρκ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                        Μάρκα
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                        Κατάσταση
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                        Ανυψωτική
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                        Τιμή
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                        Κατάσταση
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider">
                        Ενέργειες
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-neutral-800 divide-y divide-neutral-700">
                    {filteredForklifts.map((forklift) => (
                      <tr key={forklift.id} className="hover:bg-neutral-750">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-white">
                                {forklift.title}
                              </div>
                              <div className="text-sm text-neutral-400">
                                {forklift.product_code}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                          {forklift.brand?.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                          {forklift.condition}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                          {forklift.lifting_capacity_kg}kg
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                          {forklift.price 
                            ? new Intl.NumberFormat('el-GR', { 
                                style: 'currency', 
                                currency: 'EUR',
                                minimumFractionDigits: 0
                              }).format(forklift.price)
                            : '-'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            forklift.is_available 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {forklift.is_available ? 'Διαθέσιμο' : 'Μη διαθέσιμο'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => router.push(`/admin/forklifts/edit/${forklift.id}`)}
                              className="text-violet-400 hover:text-violet-300"
                            >
                              Επεξεργασία
                            </button>
                            <button
                              onClick={() => handleDeleteForklift(forklift.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Διαγραφή
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
} 