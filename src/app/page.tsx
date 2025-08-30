'use client'

import Image from "next/image";
import Navigation from "./components/Navigation";
import AnimatedSection from "./components/AnimatedSection";
import { Footer } from "./components/Footer";
import GradientText from './components/GradientText';
import FeaturesLayout from './components/FeaturesLayout';
import { Particles } from "./components/ui/particles";
import { 
  Wrench, 
  Truck, 
  Phone, 
  MapPin, 
  Clock, 
  Mail,
  Settings,
  Shield,
  Award,
  FileText,
  Users,
  HelpCircle
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900/20 to-transparent pt-16 relative">
        {/* Particles Background Effect */}
        <Particles
          className="absolute inset-0 -z-10"
          quantity={160}
          ease={80}
          color="#ffffff"
          staticity={50}
          size={1.5}
        />
        {/* Split Hero Section */}
        <section className="min-h-screen w-full flex flex-col lg:flex-row">
          {/* Left Content Section */}
          <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16 xl:px-20 py-12 lg:py-0 order-2 lg:order-1">
            <div className="max-w-2xl w-full">
              {/* Website Builder Agency Badge */}
              <AnimatedSection animation="slideInUp" delay={200} pageId="home">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-500/20 border border-indigo-800 shadow-md mb-8">
                  <GradientText
                    colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                    animationSpeed={3}
                    showBorder={false}
                    className="font-medium"
                  >
                    Εταιρεία Ανταλλακτικών
                  </GradientText>
                </span>
              </AnimatedSection>

              {/* Main Heading */}
              <AnimatedSection animation="slideInLeft" delay={400} pageId="home">
                <h1 className="font-open-sans font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight text-white mb-6">
                  Μετατρέψτε την
                  <br />
                  Επιχείρησή σας
                  <br />
                  <span className="text-indigo-400">με Κλαρκ</span>
                </h1>
              </AnimatedSection>

              {/* Subheading */}
              <AnimatedSection animation="slideInLeft" delay={600} pageId="home">
                <p className="font-open-sans text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
                  Προσφέρουμε ποιοτικά ανταλλακτικά που οδηγούν σε αποτελέσματα. Από εξειδικευμένη 
                  τεχνική υποστήριξη έως γρήγορη παράδοση, βοηθάμε τις επιχειρήσεις να 
                  αντιμετωπίσουν κάθε πρόκληση.
                </p>
              </AnimatedSection>

              {/* CTA Buttons */}
              <AnimatedSection animation="slideInLeft" delay={800} pageId="home">
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="/gallery"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-indigo-500 border border-indigo-800 rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    Δείτε τα προϊόντα
                    <img src="/forklift.png" alt="Forklift" className="ml-2 w-6 h-6" />
                  </a>
                  <a 
                    href="/aboutUs"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-300 bg-transparent border border-indigo-800 rounded-lg shadow-md hover:bg-indigo-900/30 transition-all duration-300"
                  >
                    Μάθετε περισσότερα
                  </a>
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Right Visual Section */}
          <div className="hidden lg:flex flex-1 items-center justify-center p-6 sm:p-12 lg:p-16 pb-12 lg:pb-16 order-1 lg:order-2">
            <AnimatedSection animation="slideInRight" delay={400} className="relative max-w-2xl w-full" pageId="home">
              <div className="flex items-center justify-center">
                <img 
                  src="/clark2.png" 
                  alt="Clark Forklift" 
                  className="w-full h-auto max-w-xl drop-shadow-2xl"
                />
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* New Features Layout */}
        <FeaturesLayout />

        {/* Features Section */}
        <section className="w-full flex items-start justify-center pt-8 sm:pt-12 lg:pt-16 pb-20 px-6 sm:px-12 lg:px-16 xl:px-20">
          <div className="max-w-7xl mx-auto w-full">
            {/* Section Title */}
          
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Feature Card 1 */}
              <AnimatedSection animation="slideInLeft" delay={200} pageId="home">
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-indigo-800/50 rounded-2xl shadow-2xl p-8 backdrop-blur-sm hover:border-indigo-600/50 transition-all duration-300">
                  {/* Tag */}
                  <div className="mb-8">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 border border-indigo-800">
                      <GradientText
                        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                        animationSpeed={3}
                        showBorder={false}
                        className="font-medium"
                      >
                        Ανταλλακτικά
                      </GradientText>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-open-sans font-bold text-3xl lg:text-4xl text-white mb-4">
                    Ποιοτικά<br />Ανταλλακτικά!
                  </h3>

                  {/* Subtitle */}
                  <p className="font-open-sans text-gray-400 mb-8 text-lg">
                    Προσφέρουμε τα καλύτερα ανταλλακτικά για κάθε ανάγκη.
                  </p>

                  {/* Features */}
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-open-sans font-semibold text-white text-base mb-1">Γρήγορη παράδοση</h4>
                        <p className="font-open-sans text-gray-400 text-sm">Παραδίδουμε γρήγορα και αξιόπιστα.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-open-sans font-semibold text-white text-base mb-1">Εγγυημένη ποιότητα</h4>
                        <p className="font-open-sans text-gray-400 text-sm">Όλα τα προϊόντα μας είναι πιστοποιημένα.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-open-sans font-semibold text-white text-base mb-1">Καλύτερες τιμές</h4>
                        <p className="font-open-sans text-gray-400 text-sm">Προσφέρουμε ανταγωνιστικές τιμές.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Feature Card 2 */}
              <AnimatedSection animation="slideInUp" delay={400} pageId="home">
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-indigo-800/50 rounded-2xl shadow-2xl p-8 backdrop-blur-sm hover:border-indigo-600/50 transition-all duration-300">
                  {/* Tag */}
                  <div className="mb-8">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 border border-indigo-800">
                      <GradientText
                        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                        animationSpeed={3}
                        showBorder={false}
                        className="font-medium"
                      >
                        Υπηρεσίες
                      </GradientText>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-open-sans font-bold text-3xl lg:text-4xl text-white mb-4">
                    Εξειδικευμένη<br />Τεχνική Υποστήριξη!
                  </h3>

                  {/* Subtitle */}
                  <p className="font-open-sans text-gray-400 mb-8 text-lg">
                    Η ομάδα μας παρέχει εξειδικευμένη τεχνική βοήθεια.
                  </p>

                  {/* Features */}
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-open-sans font-semibold text-white text-base mb-1">24/7 Υποστήριξη</h4>
                        <p className="font-open-sans text-gray-400 text-sm">Είμαστε διαθέσιμοι όλο το 24ωρο.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-open-sans font-semibold text-white text-base mb-1">Εξειδικευμένο προσωπικό</h4>
                        <p className="font-open-sans text-gray-400 text-sm">Ομάδα με χρόνια εμπειρίας.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-open-sans font-semibold text-white text-base mb-1">Άμεση απάντηση</h4>
                        <p className="font-open-sans text-gray-400 text-sm">Γρήγορη και αποτελεσματική εξυπηρέτηση.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Feature Card 3 */}
              <AnimatedSection animation="slideInRight" delay={600} pageId="home">
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-indigo-800/50 rounded-2xl shadow-2xl p-8 backdrop-blur-sm hover:border-indigo-600/50 transition-all duration-300">
                  {/* Tag */}
                  <div className="mb-8">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 border border-indigo-800">
                      <GradientText
                        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                        animationSpeed={3}
                        showBorder={false}
                        className="font-medium"
                      >
                        Εταιρεία
                      </GradientText>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-open-sans font-bold text-3xl lg:text-4xl text-white mb-4">
                    Αξιόπιστη<br />Συνεργασία!
                  </h3>

                  {/* Subtitle */}
                  <p className="font-open-sans text-gray-400 mb-8 text-lg">
                    Χτίζουμε μακροπρόθεσμες σχέσεις εμπιστοσύνης.
                  </p>

                  {/* Features */}
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-open-sans font-semibold text-white text-base mb-1">Χρόνια εμπειρίας</h4>
                        <p className="font-open-sans text-gray-400 text-sm">Έμπειρη ομάδα στο χώρο.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-open-sans font-semibold text-white text-base mb-1">Εξατομικευμένη εξυπηρέτηση</h4>
                        <p className="font-open-sans text-gray-400 text-sm">Λύσεις προσαρμοσμένες στις ανάγκες σας.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-open-sans font-semibold text-white text-base mb-1">Πανελλήνια κάλυψη</h4>
                        <p className="font-open-sans text-gray-400 text-sm">Εξυπηρετούμε σε όλη την Ελλάδα.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* What Makes Us Unique Section */}
        <section className="flex items-start justify-center pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 px-6 sm:px-12 lg:px-16 xl:px-20">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection animation="slideInUp" className="text-center mb-16" pageId="home">
              <h2 className="font-open-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
                Τι μας κάνει μοναδικούς
              </h2>
              <p className="font-open-sans text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                Δεν προσφέρουμε απλά ανταλλακτικά - δημιουργούμε αξιόπιστες λύσεις που οδηγούν την επιχείρησή σας στην επιτυχία
              </p>
            </AnimatedSection>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Κλαρκ Advantage */}
              <AnimatedSection animation="slideInLeft" delay={200} pageId="home">
                <div className="bg-gradient-to-br from-indigo-900/20 to-transparent border border-indigo-800 rounded-2xl p-8 shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-open-sans font-bold text-2xl text-white">Πλεονεκτήματα Κλαρκ</h3>
                    </div>
                    {/* Quality Icon */}
                    <img 
                      src="/quality.png" 
                      alt="Quality Icon" 
                      className="w-12 h-12 opacity-80"
                    />
                  </div>
                  <ul className="space-y-4 font-open-sans text-gray-300">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Εξατομικευμένες λύσεις για κάθε ανάγκη
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Άριστη ποιότητα από την πρώτη μέρα
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Γρήγορη και αξιόπιστη εξυπηρέτηση
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Κορυφαία απόδοση και αποτελεσματικότητα
          </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Αφοσιωμένη ομάδα υποστήριξης
          </li>
                  </ul>
                </div>
              </AnimatedSection>

              {/* Παραδοσιακές Εταιρείες */}
              <AnimatedSection animation="slideInRight" delay={400} pageId="home">
                <div className="bg-gradient-to-br from-gray-800/20 to-transparent border border-gray-700 rounded-2xl p-8 shadow-md">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="font-open-sans font-bold text-2xl text-gray-300">Παραδοσιακές Εταιρείες</h3>
                  </div>
                  <ul className="space-y-4 font-open-sans text-gray-400">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Γενικές λύσεις χωρίς εξειδίκευση
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Βασική ποιότητα προϊόντων
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Περιορισμένη τεχνική υποστήριξη
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Αργοί χρόνοι παράδοσης
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Ελάχιστη εξυπηρέτηση μετά την πώληση
                    </li>
                  </ul>
                </div>
              </AnimatedSection>
            </div>
        </div>
        </section>

        {/* Footer */}
        <AnimatedSection animation="fadeIn" pageId="home">
          <Footer
            brand={{
              name: "Κλαρκ",
              description: "Η κορυφαία εταιρεία ανταλλακτικών και υπηρεσιών κλαρκ στην Ελλάδα. Προσφέρουμε ποιοτικά ανταλλακτικά, τεχνική υποστήριξη και αξιόπιστες λύσεις για κάθε επιχειρηματική ανάγκη."
            }}
            socialLinks={[
              {
                name: "Facebook",
                href: "https://facebook.com/clark-parts"
              },
              {
                name: "LinkedIn", 
                href: "https://linkedin.com/company/clark-parts"
              },
              {
                name: "YouTube",
                href: "https://youtube.com/clark-parts"
              }
            ]}
            columns={[
              {
                title: "Προϊόντα & Υπηρεσίες",
                links: [
                  {
                    name: "Κλαρκ",
                    Icon: Wrench,
                    href: "/gallery"
                  },
                  {
                    name: "Ανταλλακτικά Κλαρκ", 
                    Icon: Settings,
                    href: "#ανταλλακτικα"
                  },
                  {
                    name: "Υπηρεσίες Επισκευών",
                    Icon: Award,
                    href: "#επισκευες"
                  },
                  {
                    name: "Τεχνική Υποστήριξη",
                    Icon: HelpCircle,
                    href: "#υποστηριξη"
                  }
                ]
              },
              {
                title: "Εταιρεία",
                links: [
                  {
                    name: "Σχετικά με εμάς",
                    Icon: Users,
                    href: "/aboutUs"
                  },
                  {
                    name: "Η Ιστορία μας",
                    Icon: FileText,
                    href: "/aboutUs"
                  },
                  {
                    name: "Πιστοποιήσεις",
                    Icon: Shield,
                    href: "#πιστοποιησεις"
                  },
                  {
                    name: "Καριέρα",
                    Icon: Award,
                    href: "#καριερα"
                  }
                ]
              },
              {
                title: "Επικοινωνία",
                links: [
                  {
                    name: "Επικοινωνήστε μαζί μας",
                    Icon: Phone,
                    href: "/contact"
                  },
                  {
                    name: "Βρείτε μας",
                    Icon: MapPin,
                    href: "/contact"
                  },
                  {
                    name: "Ώρες Λειτουργίας",
                    Icon: Clock,
                    href: "/contact"
                  },
                  {
                    name: "Email",
                    Icon: Mail,
                    href: "/contact"
                  }
                ]
              }
            ]}
            copyright="© 2025 Κλαρκ Ανταλλακτικά. Όλα τα δικαιώματα διατηρούνται."
          />
        </AnimatedSection>
      </div>
    </>
  );
}
