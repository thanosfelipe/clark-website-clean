'use client'

import { useState, useEffect, useRef } from 'react'
import { getContent, getContentByPage } from '@/lib/content-service'

/**
 * Hook to get a single content item by key
 */
export function useContent(key: string, fallback: string = '') {
  const [content, setContent] = useState<string>(fallback)
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    let isMounted = true

    const fetchContent = async () => {
      try {
        setLoading(true)
        const value = await getContent(key, fallback)

        if (isMounted) {
          setContent(value)
          console.log(`useContent loaded "${key}":`, value.substring(0, 50) + '...')
        }
      } catch (error) {
        console.error(`Error loading content for key "${key}":`, error)
        if (isMounted) {
          setContent(fallback)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchContent()

    return () => {
      isMounted = false
    }
  }, [key, fallback, refreshTrigger])

  // Function to manually refresh content
  const refresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return { content, loading, refresh }
}

/**
 * Hook to get multiple content items by page
 */
export function usePageContent(page: string) {
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchContent = async () => {
      try {
        setLoading(true)
        const contentMap = await getContentByPage(page)

        if (isMounted) {
          setContent(contentMap)
        }
      } catch (error) {
        console.error(`Error loading content for page "${page}":`, error)
        if (isMounted) {
          setContent({})
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchContent()

    return () => {
      isMounted = false
    }
  }, [page])

  const getContent = (key: string, fallback: string = ''): string => {
    return content[key] || fallback
  }

  return { content, loading, getContent }
}