'use client'

import React, { useEffect, useState } from 'react'
import { useScrollAnimation, animationVariants } from '../hooks/useScrollAnimation'

interface AnimatedSectionProps {
  children: React.ReactNode
  animation?: keyof typeof animationVariants
  delay?: number
  className?: string
  threshold?: number
  rootMargin?: string
  pageId?: string
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  className = '',
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  pageId
}) => {
  const [hasAnimated, setHasAnimated] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Generate unique key for this animation
  const animationKey = pageId ? `animation_${pageId}_${animation}_${delay}` : null
  
  useEffect(() => {
    if (typeof window !== 'undefined' && animationKey) {
      const hasPlayedBefore = sessionStorage.getItem(animationKey) === 'true'
      setHasAnimated(hasPlayedBefore)
    }
  }, [animationKey])

  const { elementRef, isVisible } = useScrollAnimation({ 
    threshold, 
    rootMargin, 
    triggerOnce: true 
  })

  // Mark animation as played when it becomes visible
  useEffect(() => {
    if (isVisible && !hasAnimated && typeof window !== 'undefined' && animationKey) {
      sessionStorage.setItem(animationKey, 'true')
      setHasAnimated(true)
    }
  }, [isVisible, hasAnimated, animationKey])

  const variant = animationVariants[animation]
  
  // If mobile, always show final state (no animations)
  if (isMobile) {
    return (
      <div
        ref={elementRef}
        className={`${variant.animate} ${className}`}
      >
        {children}
      </div>
    )
  }
  
  // If animation has already played, show final state immediately
  const shouldAnimate = animationKey ? (isVisible && !hasAnimated) : isVisible
  const showFinalState = animationKey ? hasAnimated : false
  
  const animationClasses = `
    ${variant.transition}
    ${shouldAnimate || showFinalState ? variant.animate : variant.initial}
  `.trim()

  const delayStyle = (delay > 0 && !showFinalState) ? { 
    transitionDelay: `${delay}ms` 
  } : {}

  return (
    <div
      ref={elementRef}
      className={`${animationClasses} ${className}`}
      style={delayStyle}
    >
      {children}
    </div>
  )
}

export default AnimatedSection 