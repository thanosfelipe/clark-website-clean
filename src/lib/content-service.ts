import { contentQueries } from './admin-queries'
import type { ContentItem } from './admin-queries'

// Cache for content items to reduce database calls
let contentCache: Record<string, string> = {}
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 1000 // 5 seconds for development (reduced for testing)

// Track pending requests to prevent duplicate fetches
const pendingRequests: Record<string, Promise<string>> = {}

/**
 * Get content by key with fallback
 */
export async function getContent(key: string, fallback: string = ''): Promise<string> {
  try {
    // Check cache first
    const now = Date.now()
    if (cacheTimestamp && now - cacheTimestamp < CACHE_DURATION && contentCache[key]) {
      console.log(`Content cache hit for "${key}"`)
      return contentCache[key]
    }

    // Check if we're already fetching this key
    if (pendingRequests[key] !== undefined) {
      console.log(`Waiting for pending request for "${key}"`)
      return await pendingRequests[key]
    }

    // Create a new request
    console.log(`Fetching content from database for "${key}"`)
    const requestPromise = (async () => {
      const content = await contentQueries.getByKey(key)

      if (content && content.is_active) {
        contentCache[key] = content.content_value
        cacheTimestamp = now
        console.log(`Content loaded for "${key}":`, content.content_value.substring(0, 50) + '...')
        return content.content_value
      }

      console.log(`No active content found for "${key}", using fallback`)
      return fallback
    })()

    // Store the pending request
    pendingRequests[key] = requestPromise

    try {
      const result = await requestPromise
      return result
    } finally {
      // Clean up the pending request
      delete pendingRequests[key]
    }
  } catch (error) {
    console.error(`Error fetching content for key "${key}":`, error)
    return fallback
  }
}

/**
 * Get multiple content items by page
 */
export async function getContentByPage(page: string): Promise<Record<string, string>> {
  try {
    const items = await contentQueries.getByPage(page)
    const contentMap: Record<string, string> = {}

    items.forEach(item => {
      if (item.is_active) {
        contentMap[item.content_key] = item.content_value
      }
    })

    // Update cache
    Object.assign(contentCache, contentMap)
    cacheTimestamp = Date.now()

    return contentMap
  } catch (error) {
    console.error(`Error fetching content for page "${page}":`, error)
    return {}
  }
}

/**
 * Clear content cache (useful after updates)
 */
export function clearContentCache(): void {
  console.log('Clearing content cache')
  contentCache = {}
  cacheTimestamp = 0

  // Clear any pending requests as well
  Object.keys(pendingRequests).forEach(key => {
    delete pendingRequests[key]
  })
}

/**
 * Preload content for homepage to reduce initial load time
 */
export async function preloadHomepageContent(): Promise<void> {
  try {
    await getContentByPage('homepage')
  } catch (error) {
    console.error('Error preloading homepage content:', error)
  }
}