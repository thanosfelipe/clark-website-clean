'use client'

import { useState, useRef } from 'react'

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const navigationItems = [
    { title: 'ΑΡΧΙΚΗ', href: '/' },
    { 
      title: 'ΚΛΑΡΚ', 
      href: '/gallery',
      dropdown: {
        sections: [
          {
            title: 'Τύποι Κλαρκ',
            items: [
              { title: 'Όλα τα Κλαρκ', href: '/gallery' },
              { title: 'Ηλεκτροκίνητο', href: '/gallery?fuelType=Ηλεκτροκίνητο' },
              { title: 'Πετρελαιοκίνητο', href: '/gallery?fuelType=Πετρελαιοκίνητο' },
              { title: 'Υγραεριοκίνητο', href: '/gallery?fuelType=Υγραεριοκίνητο' },
              { title: 'Duplex', href: '/gallery?mastType=Duplex' },
              { title: 'Triplex', href: '/gallery?mastType=Triplex' }
            ]
          },
          {
            title: 'Μάρκες & Κατάσταση',
            items: [
              { title: 'CLARK', href: '/gallery?brand=CLARK' },
              { title: 'NISSAN', href: '/gallery?brand=NISSAN' },
              { title: 'CATERPILLAR', href: '/gallery?brand=CATERPILLAR' },
              { title: 'TOYOTA', href: '/gallery?brand=TOYOTA' },
              { title: 'Καινούργιο', href: '/gallery?condition=Καινούργιο' },
              { title: 'Μεταχειρισμένο', href: '/gallery?condition=Μεταχειρισμένο' }
            ]
          }
        ]
      }
    },
    { title: 'ΑΝΤΑΛΛΑΚΤΙΚΑ', href: '/parts' },
    { title: 'ΕΤΑΙΡΕΙΑ', href: '/aboutUs' },
    { title: 'ΕΠΙΚΟΙΝΩΝΙΑ', href: '/contact' }
  ]

  const handleMouseEnter = (title: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    const item = navigationItems.find(item => item.title === title)
    if (item?.dropdown) {
      setActiveDropdown(title)
    }
  }

  const handleMouseLeave = () => {
    // Add a delay before hiding the dropdown
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150) // 150ms delay
  }

  const handleDropdownMouseEnter = () => {
    // Clear the timeout if user enters the dropdown
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const handleDropdownMouseLeave = () => {
    // Add delay when leaving the dropdown as well
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-indigo-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="font-open-sans font-semibold text-xl text-white hover:text-indigo-300 transition-colors duration-200">
                Κλαρκ
              </a>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-8 relative">
              {navigationItems.map((item) => (
                <div
                  key={item.title}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.title)}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href={item.href}
                    className="font-open-sans text-sm text-gray-300 hover:text-white transition-colors duration-200 py-2 flex items-center"
                  >
                    {item.title}
                    {item.dropdown && (
                      <svg 
                        className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === item.title ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </a>

                  {/* Dropdown Menu */}
                  {item.dropdown && (
                    <div 
                      className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-96 bg-gray-900/95 backdrop-blur-lg border border-indigo-800/30 rounded-lg shadow-2xl transition-all duration-300 ease-out ${
                        activeDropdown === item.title 
                          ? 'opacity-100 translate-y-0 pointer-events-auto' 
                          : 'opacity-0 translate-y-2 pointer-events-none'
                      }`}
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                    >
                      <div className="p-6">
                        <div className="grid grid-cols-1 gap-6">
                          {item.dropdown.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex}>
                              <h3 className="font-open-sans font-semibold text-white text-sm mb-3 text-gray-400 uppercase tracking-wide">
                                {section.title}
                              </h3>
                              <div className="space-y-2">
                                {section.items.map((subItem, subIndex) => (
                                  <a
                                    key={subIndex}
                                    href={subItem.href}
                                    className="font-open-sans text-gray-300 hover:text-white hover:bg-indigo-900/30 transition-all duration-200 block py-2 px-3 rounded-md text-sm"
                                  >
                                    {subItem.title}
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Bottom accent */}
                        <div className="mt-6 pt-4 border-t border-indigo-800/30">
                          <p className="font-open-sans text-xs text-gray-500 text-center">
                            Εξειδικευμένες λύσεις για κάθε ανάγκη
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Search Icon */}
              <button className="text-gray-300 hover:text-white transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* CTA Button */}
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-open-sans text-sm transition-colors duration-200">
                Επικοινωνήστε
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50">
        {/* Mobile Header */}
        <div className="bg-black/80 backdrop-blur-md border-b border-indigo-800/30">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Logo */}
            <a href="/" className="font-open-sans font-semibold text-xl text-white hover:text-indigo-300 transition-colors duration-200">
              Κλαρκ
            </a>
            
            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors duration-200 p-2"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`bg-gray-900/95 backdrop-blur-lg border-b border-indigo-800/30 transition-all duration-300 ease-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-6 py-4 space-y-4">
            {navigationItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="font-open-sans text-white block py-2 text-lg border-b border-gray-700/50"
              >
                {item.title}
              </a>
            ))}
            
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-open-sans text-lg w-full mt-4 transition-colors duration-200">
              Επικοινωνήστε
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Navigation 