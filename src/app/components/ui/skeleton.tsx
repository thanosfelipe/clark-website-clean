'use client'

import { cn } from "@/lib/utils"
import { Particles } from "./particles"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

function GallerySkeleton() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white font-open-sans relative">
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
        {/* Sidebar Skeleton */}
        <div className="w-80 bg-neutral-800/50 backdrop-blur-sm border-r border-neutral-700">
          <div className="p-6">
            {/* Filter Button Skeleton */}
            <div className="h-12 bg-neutral-700/50 rounded-lg mb-6 animate-pulse"></div>
            
            {/* Filter Sections Skeleton */}
            <div className="space-y-6">
              {/* Search Skeleton */}
              <div>
                <div className="h-6 bg-neutral-700/50 rounded w-24 mb-3 animate-pulse"></div>
                <div className="h-12 bg-neutral-700/50 rounded-lg animate-pulse"></div>
              </div>
              
              {/* Brand Filter Skeleton */}
              <div>
                <div className="h-6 bg-neutral-700/50 rounded w-16 mb-3 animate-pulse"></div>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-4 h-4 bg-neutral-700/50 rounded mr-3 animate-pulse"></div>
                      <div className="h-5 bg-neutral-700/50 rounded w-20 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Other Filter Sections */}
              {Array.from({ length: 3 }).map((_, sectionIndex) => (
                <div key={sectionIndex}>
                  <div className="h-6 bg-neutral-700/50 rounded w-32 mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-4 h-4 bg-neutral-700/50 rounded mr-3 animate-pulse"></div>
                        <div className="h-5 bg-neutral-700/50 rounded w-24 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Range Sliders Skeleton */}
              <div>
                <div className="h-6 bg-neutral-700/50 rounded w-40 mb-3 animate-pulse"></div>
                <div className="h-6 bg-neutral-700/50 rounded-full mb-2 animate-pulse"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-neutral-700/50 rounded w-8 animate-pulse"></div>
                  <div className="h-4 bg-neutral-700/50 rounded w-12 animate-pulse"></div>
                  <div className="h-4 bg-neutral-700/50 rounded w-12 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="h-12 bg-neutral-700/50 rounded w-64 mb-4 animate-pulse"></div>
              <div className="h-6 bg-neutral-700/50 rounded w-96 mb-6 animate-pulse"></div>
              <div className="flex items-center justify-between">
                <div className="h-5 bg-neutral-700/50 rounded w-32 animate-pulse"></div>
                <div className="h-5 bg-neutral-700/50 rounded w-24 animate-pulse"></div>
              </div>
            </div>

            {/* Gallery Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="bg-neutral-800/50 rounded-xl overflow-hidden backdrop-blur-sm border border-neutral-800">
                  {/* Image Skeleton */}
                  <div className="relative h-64 bg-neutral-700/50 animate-pulse">
                    <div className="absolute top-4 right-4 w-20 h-6 bg-neutral-600/50 rounded-full animate-pulse"></div>
                    <div className="absolute top-4 left-4 w-16 h-6 bg-neutral-600/50 rounded-full animate-pulse"></div>
                  </div>

                  {/* Content Skeleton */}
                  <div className="p-6">
                    {/* Title & Price */}
                    <div className="mb-4">
                      <div className="h-6 bg-neutral-700/50 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-8 bg-neutral-700/50 rounded w-20 animate-pulse"></div>
                        <div className="h-5 bg-neutral-700/50 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>

                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {Array.from({ length: 4 }).map((_, specIndex) => (
                        <div key={specIndex}>
                          <div className="h-4 bg-neutral-700/50 rounded w-16 mb-1 animate-pulse"></div>
                          <div className="h-5 bg-neutral-700/50 rounded w-12 animate-pulse"></div>
                        </div>
                      ))}
                    </div>

                    {/* Accordion Button Skeleton */}
                    <div className="h-12 bg-neutral-700/50 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Skeleton, GallerySkeleton } 