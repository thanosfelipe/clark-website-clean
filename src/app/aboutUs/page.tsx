'use client'

import Navigation from "../components/Navigation";
import AnimatedSection from "../components/AnimatedSection";
import { Footer } from "../components/Footer";
import GradientText from '../components/GradientText';
import { Particles } from "../components/ui/particles";
import DynamicContent from '@/components/DynamicContent';
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
  HelpCircle,
  Building,
  Heart,
  Target,
  Star,
  CheckCircle2
} from "lucide-react";

export default function AboutUs() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900/20 to-transparent pt-16 relative">
        {/* Particles Background Effect */}
        <Particles
          className="absolute inset-0 -z-10"
          quantity={120}
          ease={80}
          color="#ffffff"
          staticity={50}
          size={1.5}
        />

        {/* Hero Section */}
        <section className="min-h-[60vh] w-full flex items-center justify-center px-6 sm:px-12 lg:px-16 xl:px-20 py-20">
          <div className="max-w-4xl w-full text-center">
            <AnimatedSection animation="slideInUp" delay={200} pageId="aboutUs">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-500/20 border border-indigo-800 shadow-md mb-8">
                <GradientText
                  colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                  animationSpeed={3}
                  showBorder={false}
                  className="font-medium"
                >
                  <DynamicContent
                    contentKey="about_hero_badge"
                    fallback="Σχετικά με εμάς"
                    as="span"
                  />
                </GradientText>
              </span>
            </AnimatedSection>

            <AnimatedSection animation="slideInUp" delay={400} pageId="aboutUs">
              <DynamicContent
                contentKey="about_hero_title"
                fallback="Η Ιστορία του<br /><span class=&quot;text-indigo-400&quot;>Κλαρκ</span>"
                as="h1"
                className="font-open-sans font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-white mb-6"
                isHtml={true}
              />
            </AnimatedSection>

            <AnimatedSection animation="slideInUp" delay={600} pageId="aboutUs">
              <DynamicContent
                contentKey="about_hero_subtitle"
                fallback="Από το 1995 στην υπηρεσία των επιχειρήσεων, προσφέρουμε ποιοτικά ανταλλακτικά και αξιόπιστες λύσεις που στηρίζουν την ανάπτυξη και την επιτυχία των πελατών μας."
                as="p"
                className="font-open-sans text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto"
              />
            </AnimatedSection>
          </div>
        </section>

        {/* Company Values Section */}
        <section className="w-full py-20 px-6 sm:px-12 lg:px-16 xl:px-20">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection animation="slideInUp" className="text-center mb-16" pageId="aboutUs">
              <DynamicContent
                contentKey="about_values_title"
                fallback="Οι Αξίες μας"
                as="h2"
                className="font-open-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6"
              />
              <DynamicContent
                contentKey="about_values_subtitle"
                fallback="Καθοδηγούμαστε από αξίες που εμπνέουν την καθημερινή μας δουλειά και τη σχέση μας με τους πελάτες"
                as="p"
                className="font-open-sans text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto"
              />
            </AnimatedSection>

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Quality */}
              <AnimatedSection animation="slideInLeft" delay={200} pageId="aboutUs">
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-indigo-800/50 rounded-2xl shadow-2xl p-8 backdrop-blur-sm hover:border-indigo-600/50 transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <DynamicContent
                    contentKey="about_quality_title"
                    fallback="Ποιότητα"
                    as="h3"
                    className="font-open-sans font-bold text-2xl text-white mb-4"
                  />
                  <DynamicContent
                    contentKey="about_quality_desc"
                    fallback="Προσφέρουμε μόνο ανταλλακτικά άριστης ποιότητας που εγγυώνται μακροχρόνια απόδοση και αξιοπιστία."
                    as="p"
                    className="font-open-sans text-gray-300 leading-relaxed"
                  />
                </div>
              </AnimatedSection>

              {/* Trust */}
              <AnimatedSection animation="slideInUp" delay={400} pageId="aboutUs">
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-indigo-800/50 rounded-2xl shadow-2xl p-8 backdrop-blur-sm hover:border-indigo-600/50 transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-open-sans font-bold text-2xl text-white mb-4">
                    Εμπιστοσύνη
                  </h3>
                  <p className="font-open-sans text-gray-300 leading-relaxed">
                    Χτίζουμε μακροπρόθεσμες σχέσεις βασισμένες στην εμπιστοσύνη, 
                    τη διαφάνεια και την αξιοπιστία.
                  </p>
                </div>
              </AnimatedSection>

              {/* Innovation */}
              <AnimatedSection animation="slideInRight" delay={600} pageId="aboutUs">
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-indigo-800/50 rounded-2xl shadow-2xl p-8 backdrop-blur-sm hover:border-indigo-600/50 transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-open-sans font-bold text-2xl text-white mb-4">
                    Καινοτομία
                  </h3>
                  <p className="font-open-sans text-gray-300 leading-relaxed">
                    Αναζητούμε συνεχώς νέες τεχνολογίες και λύσεις για να παραμείνουμε 
                    πρωτοπόροι στον κλάδο μας.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Company History & Mission Section */}
        <section className="w-full py-20 px-6 sm:px-12 lg:px-16 xl:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Mission */}
              <AnimatedSection animation="slideInLeft" delay={200} pageId="aboutUs">
                <div className="bg-gradient-to-br from-indigo-900/20 to-transparent border border-indigo-800 rounded-2xl p-8 shadow-md">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mr-4">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-open-sans font-bold text-2xl text-white">Η Αποστολή μας</h3>
                  </div>
                  <p className="font-open-sans text-gray-300 mb-6 leading-relaxed">
                    Στοχεύουμε να παρέχουμε στους πελάτες μας τις καλύτερες λύσεις ανταλλακτικών, 
                    συνδυάζοντας άριστη ποιότητα, ανταγωνιστικές τιμές και εξαιρετική εξυπηρέτηση.
                  </p>
                  <ul className="space-y-3 font-open-sans text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-indigo-400 mt-0.5 mr-3 flex-shrink-0" />
                      Άμεση εξυπηρέτηση και γρήγορη παράδοση
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-indigo-400 mt-0.5 mr-3 flex-shrink-0" />
                      Εξατομικευμένες λύσεις για κάθε ανάγκη
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-indigo-400 mt-0.5 mr-3 flex-shrink-0" />
                      Συνεχής υποστήριξη και τεχνική καθοδήγηση
                    </li>
                  </ul>
                </div>
              </AnimatedSection>

              {/* Company Stats */}
              <AnimatedSection animation="slideInRight" delay={400} pageId="aboutUs">
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="font-open-sans font-bold text-3xl text-white mb-8">
                      Τα Επιτεύγματά μας
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-indigo-800/50 rounded-xl p-6 text-center">
                      <div className="font-open-sans font-bold text-4xl text-indigo-400 mb-2">30+</div>
                      <div className="font-open-sans text-gray-300">Χρόνια Εμπειρίας</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-indigo-800/50 rounded-xl p-6 text-center">
                      <div className="font-open-sans font-bold text-4xl text-indigo-400 mb-2">5K+</div>
                      <div className="font-open-sans text-gray-300">Ικανοποιημένοι Πελάτες</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-indigo-800/50 rounded-xl p-6 text-center">
                      <div className="font-open-sans font-bold text-4xl text-indigo-400 mb-2">10K+</div>
                      <div className="font-open-sans text-gray-300">Ανταλλακτικά στο Stock</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-indigo-800/50 rounded-xl p-6 text-center">
                      <div className="font-open-sans font-bold text-4xl text-indigo-400 mb-2">24/7</div>
                      <div className="font-open-sans text-gray-300">Υποστήριξη</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-20 px-6 sm:px-12 lg:px-16 xl:px-20">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection animation="slideInUp" className="text-center mb-16" pageId="aboutUs">
              <h2 className="font-open-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
                Η Ομάδα μας
              </h2>
              <p className="font-open-sans text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                Μια ομάδα εξειδικευμένων επαγγελματιών με κοινό στόχο την παροχή της καλύτερης εξυπηρέτησης
              </p>
            </AnimatedSection>

            <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-indigo-800/50 rounded-2xl shadow-2xl p-12 backdrop-blur-sm text-center">
              <AnimatedSection animation="slideInUp" delay={200} pageId="aboutUs">
                <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-open-sans font-bold text-3xl text-white mb-6">
                  Μια Οικογένεια Επαγγελματιών
                </h3>
                <p className="font-open-sans text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto mb-8">
                  Η ομάδα μας αποτελείται από έμπειρους τεχνικούς, εξειδικευμένους πωλητές και 
                  αφοσιωμένους εκπροσώπους εξυπηρέτησης πελατών. Κάθε μέλος της ομάδας μας 
                  φέρνει τη δική του εξειδίκευση και πάθος για την παροχή άριστων υπηρεσιών.
                </p>
                <div className="flex justify-center">
                  <a 
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-indigo-500 border border-indigo-800 rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    Επικοινωνήστε μαζί μας
                    <Phone className="ml-2 w-5 h-5" />
                  </a>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Footer */}
        <AnimatedSection animation="fadeIn" pageId="aboutUs">
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
                    href: "/parts"
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
                    href: "/aboutUs"
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