'use client'

import React from 'react'
import { useContent } from '@/hooks/useContent'

interface DynamicContentProps {
  contentKey: string
  fallback: string
  className?: string
  as?: React.ElementType
  isHtml?: boolean
  loadingClassName?: string
}

/**
 * Component that renders dynamic content from the CMS
 */
export default function DynamicContent({
  contentKey,
  fallback,
  className = '',
  as: Component = 'div',
  isHtml = false,
  loadingClassName = ''
}: DynamicContentProps) {
  const { content, loading } = useContent(contentKey, fallback)

  if (loading) {
    return (
      <Component className={loadingClassName || className}>
        <span className="animate-pulse bg-neutral-700 rounded text-transparent">
          {fallback}
        </span>
      </Component>
    )
  }

  if (isHtml) {
    return (
      <Component
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  return (
    <Component className={className}>
      {content}
    </Component>
  )
}