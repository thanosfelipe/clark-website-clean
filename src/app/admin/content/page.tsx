'use client'

import { useState, useEffect } from 'react'
import { contentQueries, type ContentItem } from '@/lib/admin-queries'
import { clearContentCache } from '@/lib/content-service'
import {
  PencilIcon,
  EyeIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  CheckIcon,
  XMarkIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'

export default function AdminContentPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Filter states
  const [selectedPage, setSelectedPage] = useState<string>('all')
  const [selectedContentType, setSelectedContentType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadContentItems()
  }, [])

  // Helper functions for filtering and grouping
  const getFilteredItems = () => {
    return contentItems.filter(item => {
      const matchesPage = selectedPage === 'all' || item.page === selectedPage
      const matchesContentType = selectedContentType === 'all' || item.content_type === selectedContentType
      const matchesSearch = !searchTerm ||
        item.content_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content_value.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesPage && matchesContentType && matchesSearch
    })
  }

  const getGroupedItems = () => {
    const filtered = getFilteredItems()
    const groups: Record<string, ContentItem[]> = {}

    filtered.forEach(item => {
      const category = getCategoryFromContentKey(item.content_key)
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(item)
    })

    return groups
  }

  const getCategoryFromContentKey = (key: string): string => {
    if (key.startsWith('hero_')) return 'Hero Section'
    if (key.startsWith('features_card')) return 'Features Cards'
    if (key.startsWith('unique_section_')) return 'What Makes Us Unique'
    if (key.startsWith('clark_advantage')) return 'Clark Advantages'
    if (key.startsWith('traditional_')) return 'Traditional Companies'
    if (key.startsWith('contact_')) return 'Contact Page'
    if (key.startsWith('about_')) return 'About Us Page'
    if (key.startsWith('footer_')) return 'Footer'
    return 'Other'
  }

  const getUniquePages = () => {
    const pages = [...new Set(contentItems.map(item => item.page).filter(Boolean))] as string[]
    return pages.sort()
  }

  const getUniqueContentTypes = () => {
    const types = [...new Set(contentItems.map(item => item.content_type).filter(Boolean))] as string[]
    return types.sort()
  }

  const toggleSection = (category: string) => {
    const newCollapsed = new Set(collapsedSections)
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category)
    } else {
      newCollapsed.add(category)
    }
    setCollapsedSections(newCollapsed)
  }

  const loadContentItems = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Loading content items...')
      const items = await contentQueries.getAll()
      console.log('Loaded content items:', items)
      setContentItems(items)
    } catch (err) {
      console.error('Error loading content items:', err)
      setError(`Σφάλμα φόρτωσης περιεχομένου: ${err instanceof Error ? err.message : 'Άγνωστο σφάλμα'}`)
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (item: ContentItem) => {
    setEditingItem(item.id)
    setEditValue(item.content_value)
  }

  const cancelEditing = () => {
    setEditingItem(null)
    setEditValue('')
  }

  const saveEdit = async (itemId: number) => {
    const originalValue = editValue // Store the value we're trying to save

    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      console.log('Saving content for item:', itemId, 'with value:', originalValue)

      // Perform the update
      const updatedItem = await contentQueries.update(itemId, { content_value: originalValue })
      console.log('Content saved successfully:', updatedItem)

      // Clear content cache to force refresh on other pages
      clearContentCache()

      // Reload content items to ensure we have the latest data
      await loadContentItems()

      // Clear editing state
      setEditingItem(null)
      setEditValue('')

      // Show success message
      setSuccessMessage('Το περιεχόμενο αποθηκεύτηκε επιτυχώς!')

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)

    } catch (err) {
      console.error('Error saving content:', err)
      setError(`Σφάλμα αποθήκευσης: ${err instanceof Error ? err.message : 'Άγνωστο σφάλμα'}`)

      // Reset to original state on error
      const originalItem = contentItems.find(item => item.id === itemId)
      if (originalItem) {
        setEditValue(originalItem.content_value)
      }
    } finally {
      setSaving(false)
    }
  }

  const getContentTypeIcon = (contentType: string | null | undefined) => {
    switch (contentType) {
      case 'html':
        return <DocumentTextIcon className="h-4 w-4 text-orange-500" />
      case 'text':
      default:
        return <DocumentTextIcon className="h-4 w-4 text-blue-500" />
    }
  }

  const getPageIcon = (page: string | null | undefined) => {
    return <GlobeAltIcon className="h-4 w-4 text-green-500" />
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-700 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-neutral-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500/10 to-violet-600/10 border border-violet-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Διαχείριση Περιεχομένου 📝
            </h1>
            <p className="text-neutral-300">
              Επεξεργαστείτε το περιεχόμενο της ιστοσελίδας σας από εδώ.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                clearContentCache()
                loadContentItems()
              }}
              className="px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 transition-colors"
            >
              Ανανέωση Cache
            </button>
            <div className="hidden lg:block">
              <DocumentTextIcon className="h-16 w-16 text-violet-500/50" />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center">
            <XMarkIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-300">{error}</span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center">
            <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-green-300">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FunnelIcon className="h-5 w-5 text-violet-400" />
          <h3 className="text-lg font-semibold text-white">Φίλτρα</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Αναζήτηση
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Αναζήτηση σε κλειδιά, περιγραφές, περιεχόμενο..."
                className="pl-9 w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Page Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Σελίδα
            </label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="all">Όλες οι σελίδες</option>
              {getUniquePages().map(page => (
                <option key={page} value={page}>{page}</option>
              ))}
            </select>
          </div>

          {/* Content Type Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Τύπος Περιεχομένου
            </label>
            <select
              value={selectedContentType}
              onChange={(e) => setSelectedContentType(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="all">Όλοι οι τύποι</option>
              {getUniqueContentTypes().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-400">
            Εμφάνιση {getFilteredItems().length} από {contentItems.length} στοιχεία
          </span>
          <button
            onClick={() => {
              setSelectedPage('all')
              setSelectedContentType('all')
              setSearchTerm('')
            }}
            className="text-violet-400 hover:text-violet-300 transition-colors"
          >
            Επαναφορά φίλτρων
          </button>
        </div>
      </div>

      {/* Grouped Content Items */}
      {Object.entries(getGroupedItems()).map(([category, items]) => (
        <div key={category} className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden mb-6">
          <div
            className="p-6 border-b border-neutral-700 cursor-pointer hover:bg-neutral-750 transition-colors"
            onClick={() => toggleSection(category)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-white">{category}</h3>
                <span className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded">
                  {items.length} στοιχεία
                </span>
              </div>
              {collapsedSections.has(category) ? (
                <ChevronDownIcon className="h-5 w-5 text-neutral-400" />
              ) : (
                <ChevronUpIcon className="h-5 w-5 text-neutral-400" />
              )}
            </div>
          </div>

          {!collapsedSections.has(category) && (
            <div className="divide-y divide-neutral-700">
              {items.map((item) => (
                <div key={item.id} className="p-6 hover:bg-neutral-750 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {getContentTypeIcon(item.content_type)}
                        <h4 className="font-semibold text-white text-sm truncate">
                          {item.content_key}
                        </h4>
                        <div className="flex items-center gap-1 px-2 py-1 bg-neutral-700 rounded text-xs text-neutral-300">
                          {getPageIcon(item.page)}
                          <span>{item.page || 'Unknown'}</span>
                        </div>
                        {!item.is_active && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                            Ανενεργό
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-neutral-400 text-sm mb-3">
                          {item.description}
                        </p>
                      )}

                      {editingItem === item.id ? (
                        <div className="space-y-3">
                          {item.content_type === 'html' ? (
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                              rows={4}
                              placeholder="Εισάγετε HTML περιεχόμενο..."
                            />
                          ) : (
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                              rows={3}
                              placeholder="Εισάγετε κείμενο..."
                            />
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(item.id)}
                              disabled={saving || !editValue.trim()}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 border border-green-700 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <CheckIcon className="h-4 w-4 mr-1" />
                              {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
                            </button>
                            <button
                              onClick={cancelEditing}
                              disabled={saving}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-400 bg-neutral-700 border border-neutral-600 rounded-lg hover:bg-neutral-600 hover:text-white transition-colors"
                            >
                              <XMarkIcon className="h-4 w-4 mr-1" />
                              Ακύρωση
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-neutral-700 border border-neutral-600 rounded-lg p-3">
                          <div
                            className="text-neutral-200 text-sm whitespace-pre-wrap"
                            dangerouslySetInnerHTML={
                              item.content_type === 'html'
                                ? { __html: item.content_value }
                                : undefined
                            }
                          >
                            {item.content_type !== 'html' ? item.content_value : undefined}
                          </div>
                        </div>
                      )}
                    </div>

                    {editingItem !== item.id && (
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => startEditing(item)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-violet-400 bg-violet-500/10 border border-violet-500/30 rounded-lg hover:bg-violet-500/20 transition-colors"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Επεξεργασία
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Empty State */}
      {contentItems.length === 0 && !loading && (
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-12 text-center">
          <DocumentTextIcon className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Δεν βρέθηκαν στοιχεία περιεχομένου
          </h3>
          <p className="text-neutral-400">
            Τα στοιχεία περιεχομένου θα εμφανιστούν εδώ όταν προστεθούν στη βάση δεδομένων.
          </p>
        </div>
      )}

      {/* No Results State */}
      {contentItems.length > 0 && getFilteredItems().length === 0 && (
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-12 text-center">
          <MagnifyingGlassIcon className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Δεν βρέθηκαν αποτελέσματα
          </h3>
          <p className="text-neutral-400 mb-4">
            Δοκιμάστε να αλλάξετε τα φίλτρα ή τον όρο αναζήτησης.
          </p>
          <button
            onClick={() => {
              setSelectedPage('all')
              setSelectedContentType('all')
              setSearchTerm('')
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-violet-700 rounded-lg hover:bg-violet-700 transition-colors"
          >
            Επαναφορά φίλτρων
          </button>
        </div>
      )}
    </div>
  )
}