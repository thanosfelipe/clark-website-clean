'use client'

import Image from "next/image";
import Navigation from "../components/Navigation";
import AnimatedSection from "../components/AnimatedSection";
import SpotlightCard from "../components/SpotlightCard/SpotlightCard";
import { Particles } from "../components/ui/particles";

import { 
  Cog, 
  Thermometer, 
  Disc, 
  Filter, 
  Droplets, 
  Zap, 
  RotateCcw, 
  Car, 
  Package, 
  Link, 
  Settings, 
  Palette,
  Lightbulb,
  Gamepad2,
  Truck
} from "lucide-react";

export default function PartsPage() {
  const categories = [
    {
      title: "Κινητήρας",
      icon: Cog,
      spotlightColor: "rgba(239, 68, 68, 0.25)", // Red
      items: ["Βάσεις Κινητήρα", "Πιστόνια", "Εμβολα"]
    },
    {
      title: "Σύστημα Ψύξης", 
      icon: Thermometer,
      spotlightColor: "rgba(59, 130, 246, 0.25)", // Blue
      items: ["Θερμοστάτες", "Βάση Θερμοστάτη", "Αντλίες Νερού", "Κολάρα, Φτερωτές", "Ψυγεία"]
    },
    {
      title: "Ταμπούχες",
      icon: Disc,
      spotlightColor: "rgba(168, 85, 247, 0.25)", // Purple
      items: ["Ταμπούχα Μουανιέ", "Ταμπούχα Υδραυλικού", "Ταμπούχα Στροφάλου", "Ταμπούχων Αντλίας"]
    },
    {
      title: "Φίλτρα",
      icon: Filter,
      spotlightColor: "rgba(34, 197, 94, 0.25)", // Green
      items: ["Φίλτρα Αέρος", "Φίλτρα Βενζίνης", "Φίλτρα Λαδιού", "Φίλτρα Πετρελαίου", "Φίλτρα Σασμάν", "Φίλτρα Υδραυλικού", "Φίλτρα Αναθυμιάσεων", "Φίλτρα Καμπίνας"]
    },
    {
      title: "Λιπαντικά",
      icon: Droplets,
      spotlightColor: "rgba(245, 158, 11, 0.25)", // Amber
      items: ["Λάδι Κινητήρα", "Λάδι Υδραυλικού", "Λάδι Σασμάν", "Βαλβολίνη", "Εξειδικευμένα Λάδια"]
    },
    {
      title: "Ηλεκτρικά",
      icon: Zap,
      spotlightColor: "rgba(236, 72, 153, 0.25)", // Pink
      items: ["Ρελέ, Μπαταρίες", "Φορτιστές Πρίζες", "Ασφάλειες, Λάμπες", "Μίζες, Δυναμό", "Εγκέφαλος", "Ηλεκτρομαγνητικό - Solenoid, Αισθητήρες"]
    },
    {
      title: "Αντλίες",
      icon: RotateCcw,
      spotlightColor: "rgba(6, 182, 212, 0.25)", // Cyan
      items: ["Αντλία Νερού", "Αντλία Υδραυλικού", "Αντλία Σασμάν"]
    },
    {
      title: "Φρένα", 
      icon: Car,
      spotlightColor: "rgba(239, 68, 68, 0.25)", // Red
      items: ["Αντλίες Φρένων", "Κυλινδράκια", "Σιαγόνες Φρένων", "Ντίζα Χειρόφρενου"]
    },
    {
      title: "Αναλώσιμα",
      icon: Package,
      spotlightColor: "rgba(168, 85, 247, 0.25)", // Purple
      items: ["Σετ Στεγανά, Ίμαντας"]
    },
    {
      title: "Ανταλλακτικά Ιστού",
      icon: Link,
      spotlightColor: "rgba(34, 197, 94, 0.25)", // Green
      items: ["Αλυσίδες", "Ρουλεμάν Αλυσίδας", "Ρουλεμάν Ιστού"]
    },
    {
      title: "Ανταλλακτικά Μηχανής",
      icon: Settings,
      spotlightColor: "rgba(245, 158, 11, 0.25)", // Amber
      items: ["Σετ Φλάντζες", "Στρόφαλος", "Μπιέλα", "Καπάκι Μηχανής (Κεφαλάρι)"]
    },
    {
      title: "Ανταλλακτικά Σασμάν",
      icon: Cog,
      spotlightColor: "rgba(236, 72, 153, 0.25)", // Pink
      items: ["Σετ Επισκευής", "Σετ Φλάντζες", "Converter (κελώνα)", "Δίσκος Σασμάν"]
    },
    {
      title: "Φώτα & Σήμανση",
      icon: Lightbulb,
      spotlightColor: "rgba(234, 179, 8, 0.25)", // Yellow
      items: ["Φώτα Σήμανσης", "Φάροι", "Προειδοποιητικά Φώτα", "Προειδοποιητικά Τρίγωνα"]
    },
    {
      title: "Εσωτερικό & Χειριστήρια",
      icon: Gamepad2,
      spotlightColor: "rgba(139, 69, 19, 0.25)", // Brown
      items: ["Πεντάλ", "Μπουτών", "Χειριστήρια", "Βομβητές", "Καθίσματα", "Ζώνες Ασφαλείας", "Καλοριφέρ", "Κλιματισμός"]
    },
    {
      title: "Ελαστικά & Τροχοί",
      icon: Truck,
      spotlightColor: "rgba(75, 85, 99, 0.25)", // Gray
      items: ["Ελαστικά", "Ζάντες", "Τροχοί", "Ροδάκια"]
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900/20 to-transparent text-white relative">
        {/* Particles Background */}
        <Particles
          className="absolute inset-0 -z-10"
          quantity={120}
          ease={80}
          color="#ffffff"
          staticity={50}
          size={1.2}
        />

        {/* Header Section */}
        <section className="pt-24 pb-20 px-6 sm:px-12 lg:px-16 xl:px-20 relative overflow-hidden">
          
          <div className="max-w-7xl mx-auto relative">
            <AnimatedSection animation="scaleIn" delay={200} pageId="parts">
              <div className="text-center mb-16">
                {/* Main Title with enhanced styling */}
                <div className="relative inline-block mb-8">
                  <h1 className="font-open-sans font-regular text-4xl sm:text-4xl lg:text-7xl text-white mb-2 text-center">
                    ΑΝΤΑΛΛΑΚΤΙΚΑ &
                    <br />
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
                      ΑΝΑΛΩΣΙΜΑ
                    </span>
                  </h1>
                </div>

                {/* Enhanced description with better spacing */}
                <div className="space-y-6 max-w-5xl mx-auto">
                  <p className="font-open-sans text-2xl lg:text-3xl text-neutral-200 leading-relaxed">
                    Στην αποθήκη μας διαθέτουμε{' '}
                    <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                      μεγάλο stock
                    </span>{' '}
                    σε γνήσια ανταλλακτικά κινήσιμα αλλά και εξειδικευμένα ανταλλακτικά και αναλώσιμα για κάθε μάρκα και κάθε τύπο σημειώματος.
                  </p>
                  
                  <p className="font-open-sans text-xl lg:text-2xl text-neutral-300">
                    Έτσι, μπορούμε να σας προσφέρουμε{' '}
                    <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                      άμεσα διαθέσιμα ανταλλακτικά
                    </span>{' '}
                    με δυνατότητα αποστολής σε ολόκληρη την Ελλάδα.
                  </p>
                </div>

                {/* Stats Section */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <AnimatedSection animation="scaleIn" delay={600} pageId="parts">
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg rounded-2xl p-8 border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300 group hover:scale-105">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                          <Package className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                          5000+
                        </div>
                        <p className="text-neutral-300 font-open-sans">Διαθέσιμα Προϊόντα</p>
                      </div>
                    </div>
                  </AnimatedSection>

                  <AnimatedSection animation="scaleIn" delay={800} pageId="parts">
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg rounded-2xl p-8 border border-green-500/20 hover:border-green-400/40 transition-all duration-300 group hover:scale-105">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                          <Truck className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                          24h
                        </div>
                        <p className="text-neutral-300 font-open-sans">Άμεση Αποστολή</p>
                      </div>
                    </div>
                  </AnimatedSection>

                  <AnimatedSection animation="scaleIn" delay={1000} pageId="parts">
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg rounded-2xl p-8 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 group hover:scale-105">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                          <Settings className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                          15+
                        </div>
                        <p className="text-neutral-300 font-open-sans">Κατηγορίες Προϊόντων</p>
                      </div>
                    </div>
                  </AnimatedSection>
                </div>

                {/* Call to Action Button */}
                <div className="mt-12 flex justify-center">
                  <AnimatedSection animation="scaleIn" delay={1200} pageId="parts">
                    <a 
                      href="/gallery"
                      className="inline-flex items-center justify-center px-8 py-4 text-white bg-gradient-to-br from-slate-900/95 to-slate-950/95 border border-slate-700/50 rounded-xl shadow-2xl hover:border-slate-600/50 transition-all duration-300 hover:scale-105 font-medium"
                    >
                      <Car className="w-4 h-4 mr-2" />
                      Δείτε τα Κλαρκ μας
                    </a>
                  </AnimatedSection>
                </div>

              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="pb-20 px-6 sm:px-12 lg:px-16 xl:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              
              {/* Left Side - Images */}
              <div className="space-y-8">
                <AnimatedSection animation="scaleIn" delay={400} pageId="parts">
                  <Image
                    src="/fourthpicParts.png"
                    alt="Ανταλλακτικά Κλαρκ"
                    width={500}
                    height={400}
                    className="w-full h-auto rounded-lg"
                  />
                </AnimatedSection>

                <AnimatedSection animation="scaleIn" delay={600} pageId="parts">
                  <Image
                    src="/secondpicPart.png"
                    alt="Ανταλλακτικά & Αναλώσιμα"
                    width={500}
                    height={400}
                    className="w-full h-auto rounded-lg"
                  />
                </AnimatedSection>

                <AnimatedSection animation="scaleIn" delay={800} pageId="parts">
                  <Image
                    src="/thirdpicParts.png"
                    alt="Ποιότητα Προϊόντων"
                    width={500}
                    height={300}
                    className="w-full h-auto rounded-lg"
                  />
                </AnimatedSection>

                <AnimatedSection animation="scaleIn" delay={1000} pageId="parts">
                  <Image
                    src="/fourthpicParts.png"
                    alt="Ανταλλακτικά & Εξαρτήματα"
                    width={500}
                    height={400}
                    className="w-full h-auto rounded-lg"
                  />
                </AnimatedSection>

                <AnimatedSection animation="scaleIn" delay={1200} pageId="parts">
                  <Image
                    src="/fourthpicParts.png"
                    alt="Προϊόντα Υψηλής Ποιότητας"
                    width={500}
                    height={400}
                    className="w-full h-auto rounded-lg"
                  />
                </AnimatedSection>
              </div>

              {/* Right Side - Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {categories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <AnimatedSection 
                      key={index} 
                      animation="scaleIn" 
                      delay={400 + (index * 50)}
                      pageId="parts"
                    >
                      <SpotlightCard 
                        className="h-full min-h-[300px] flex flex-col bg-gradient-to-br from-slate-900/95 to-slate-950/95 border border-slate-700/50 shadow-2xl"
                        spotlightColor={category.spotlightColor as `rgba(${number}, ${number}, ${number}, ${number})`}
                      >
                        {/* Icon */}
                        <div className="mb-6 flex-shrink-0">
                          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-indigo-400" />
                          </div>
                        </div>
                        
                        {/* Title */}
                        <h3 className="font-open-sans font-medium text-xl text-white mb-4 flex-shrink-0">
                          {category.title}
                        </h3>
                        
                        {/* Content */}
                        {category.items.length > 0 && (
                          <div className="flex-grow">
                            <p className="font-open-sans text-base text-neutral-300 leading-relaxed">
                              {category.items.join(' · ')}
                            </p>
                          </div>
                        )}
                      </SpotlightCard>
                    </AnimatedSection>
                  );
                })}
              </div>
            </div>
          </div>
        </section>


      </div>
    </>
  );
} 