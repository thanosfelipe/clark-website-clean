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
        {/* Sidebar Skeleton - Hidden on mobile */}
        <div className="hidden lg:block w-80 bg-neutral-800/50 backdrop-blur-sm border-r border-neutral-700">
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
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Mobile Filter Button - Only visible on mobile */}
            <div className="lg:hidden mb-6">
              <div className="h-12 bg-neutral-700/50 rounded-lg animate-pulse"></div>
            </div>

            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="h-8 sm:h-10 lg:h-12 bg-neutral-700/50 rounded w-48 sm:w-64 mb-4 animate-pulse"></div>
              <div className="h-5 sm:h-6 bg-neutral-700/50 rounded w-full sm:w-96 mb-6 animate-pulse"></div>
              <div className="flex items-center justify-between">
                <div className="h-4 sm:h-5 bg-neutral-700/50 rounded w-24 sm:w-32 animate-pulse"></div>
                <div className="h-4 sm:h-5 bg-neutral-700/50 rounded w-20 sm:w-24 animate-pulse"></div>
              </div>
            </div>

            {/* Gallery Grid Skeleton - Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="bg-neutral-800/50 rounded-xl overflow-hidden backdrop-blur-sm border border-neutral-800">
                  {/* Image Skeleton */}
                  <div className="relative h-48 sm:h-56 lg:h-64 bg-neutral-700/50 animate-pulse">
                    <div className="absolute top-4 right-4 w-16 sm:w-20 h-6 bg-neutral-600/50 rounded-full animate-pulse"></div>
                    <div className="absolute top-4 left-4 w-12 sm:w-16 h-6 bg-neutral-600/50 rounded-full animate-pulse"></div>
                  </div>

                  {/* Content Skeleton */}
                  <div className="p-4 sm:p-6">
                    {/* Title & Price */}
                    <div className="mb-4">
                      <div className="h-5 sm:h-6 bg-neutral-700/50 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-6 sm:h-8 bg-neutral-700/50 rounded w-16 sm:w-20 animate-pulse"></div>
                        <div className="h-4 sm:h-5 bg-neutral-700/50 rounded w-12 sm:w-16 animate-pulse"></div>
                      </div>
                    </div>

                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {Array.from({ length: 4 }).map((_, specIndex) => (
                        <div key={specIndex}>
                          <div className="h-3 sm:h-4 bg-neutral-700/50 rounded w-12 sm:w-16 mb-1 animate-pulse"></div>
                          <div className="h-4 sm:h-5 bg-neutral-700/50 rounded w-8 sm:w-12 animate-pulse"></div>
                        </div>
                      ))}
                    </div>

                    {/* Accordion Button Skeleton */}
                    <div className="h-10 sm:h-12 bg-neutral-700/50 rounded-lg animate-pulse"></div>
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

function PartsPageSkeleton() {
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
      
      {/* Header Section */}
      <section className="pt-24 pb-20 px-6 sm:px-12 lg:px-16 xl:px-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            {/* Main Title Skeleton - Updated for mobile */}
            <div className="relative inline-block mb-8">
              <div className="h-12 sm:h-16 lg:h-20 bg-neutral-700/50 rounded w-80 sm:w-96 lg:w-[600px] mx-auto mb-2 animate-pulse"></div>
              <div className="h-12 sm:h-16 lg:h-20 bg-neutral-700/50 rounded w-72 sm:w-80 lg:w-[500px] mx-auto animate-pulse"></div>
            </div>

            {/* Description Skeleton */}
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="h-6 lg:h-8 bg-neutral-700/50 rounded w-full animate-pulse"></div>
              <div className="h-6 lg:h-8 bg-neutral-700/50 rounded w-4/5 mx-auto animate-pulse"></div>
              <div className="h-6 lg:h-8 bg-neutral-700/50 rounded w-full animate-pulse"></div>
              <div className="h-6 lg:h-8 bg-neutral-700/50 rounded w-3/4 mx-auto animate-pulse"></div>
            </div>

            {/* Stats Section Skeleton */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-neutral-800/50 backdrop-blur-lg rounded-2xl p-8 border border-neutral-700/50">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-neutral-700/50 rounded-xl mx-auto mb-4 animate-pulse"></div>
                    <div className="h-12 bg-neutral-700/50 rounded w-20 mx-auto mb-2 animate-pulse"></div>
                    <div className="h-5 bg-neutral-700/50 rounded w-32 mx-auto animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action Button Skeleton */}
            <div className="mt-12 flex justify-center">
              <div className="h-12 bg-neutral-700/50 rounded-xl w-48 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section Skeleton */}
      <section className="pb-20 px-6 sm:px-12 lg:px-16 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Side - Images Skeleton */}
            <div className="space-y-8">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="w-full h-64 bg-neutral-700/50 rounded-lg animate-pulse"></div>
              ))}
            </div>

            {/* Right Side - Categories Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50 min-h-[300px]">
                  {/* Icon Skeleton */}
                  <div className="w-12 h-12 bg-neutral-700/50 rounded-xl mb-6 animate-pulse"></div>
                  
                  {/* Title Skeleton */}
                  <div className="h-6 bg-neutral-700/50 rounded w-3/4 mb-4 animate-pulse"></div>
                  
                  {/* Content Skeleton */}
                  <div className="space-y-2">
                    <div className="h-4 bg-neutral-700/50 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-neutral-700/50 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-neutral-700/50 rounded w-4/5 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export { Skeleton, GallerySkeleton, PartsPageSkeleton } 