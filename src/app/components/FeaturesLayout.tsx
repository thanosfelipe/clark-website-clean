'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SpotlightCard from './SpotlightCard/SpotlightCard'
import AnimatedSection from './AnimatedSection'
import { GlowingEffect } from './ui/glowing-effect'
import { ShoppingCart, Wrench } from 'lucide-react'

const FeaturesLayout = () => {
  const router = useRouter()

  const handleSalesClick = () => {
    router.push('/gallery')
  }

  const handlePartsServiceClick = () => {
    // Add your desired link here when the page is created
    console.log('Parts/Service clicked')
  }

  return (
    <section className="w-full flex items-start justify-center bg-transparent px-6 sm:px-12 lg:px-16 xl:px-20 pt-8 sm:pt-12 lg:pt-16 pb-2 sm:pb-12 lg:pb-16">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Title */}
        <AnimatedSection animation="fadeIn" className="text-center mb-16" pageId="home">
          <h2 className="font-open-sans font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
            Οι Υπηρεσίες μας
          </h2>
          <p className="font-open-sans text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto">
            Ανακαλύψτε τις κύριες κατηγορίες προϊόντων και υπηρεσιών που προσφέρουμε
          </p>
        </AnimatedSection>

        {/* Two Column Layout */}
        <AnimatedSection animation="fadeIn" delay={200} pageId="home">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Sales/Πωλήσεις */}
            <div onClick={handleSalesClick} className="cursor-pointer group">
              <div className="relative h-96 rounded-3xl border-[0.75px] border-indigo-800/50 p-2 overflow-hidden transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-indigo-500/20">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={2}
                  variant="default"
                  blur={0}
                  movementDuration={1.5}
                />
                <div className="relative flex h-full flex-col justify-end overflow-hidden rounded-xl border-[0.75px] border-indigo-800/50 backdrop-blur-sm shadow-sm group">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.8) 100%), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
                    }}
                  />
                  
                  {/* Content positioned at bottom left */}
                  <div className="relative z-10 p-8">
                    {/* Title */}
                    <h3 className="font-open-sans font-bold text-4xl lg:text-5xl text-white mb-6 transition-all duration-300 group-hover:text-indigo-200">
                      Πωλήσεις
                    </h3>

                    {/* Call to Action */}
                    <div>
                      <span className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-indigo-500/20 border border-indigo-400/50 rounded-lg hover:bg-indigo-500/40 hover:border-indigo-300/90 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 backdrop-blur-sm transform hover:translate-y-[-2px] group-hover:bg-indigo-500/30">
                        Δείτε τα προϊόντα
                        <svg className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Parts/Service */}
            <div onClick={handlePartsServiceClick} className="cursor-pointer group">
              <div className="relative h-96 rounded-3xl border-[0.75px] border-indigo-800/50 p-2 overflow-hidden transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-indigo-500/20">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={2}
                  variant="default"
                  blur={0}
                  movementDuration={1.5}
                />
                <div className="relative flex h-full flex-col justify-end overflow-hidden rounded-xl border-[0.75px] border-indigo-800/50 backdrop-blur-sm shadow-sm group">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.8) 100%), url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
                    }}
                  />
                  
                  {/* Content positioned at bottom left */}
                  <div className="relative z-10 p-8">
                    {/* Title */}
                    <h3 className="font-open-sans font-bold text-4xl lg:text-5xl text-white mb-6 transition-all duration-300 group-hover:text-indigo-200">
                      Ανταλλακτικά/Service
                    </h3>

                    {/* Call to Action */}
                    <div>
                      <span className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-indigo-500/20 border border-indigo-400/50 rounded-lg hover:bg-indigo-500/40 hover:border-indigo-300/90 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 backdrop-blur-sm transform hover:translate-y-[-2px] group-hover:bg-indigo-500/30">
                        Μάθετε περισσότερα
                        <svg className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default FeaturesLayout 