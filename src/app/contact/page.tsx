'use client'

import { useState } from 'react'
import Navigation from '../components/Navigation'
import { Footer } from '../components/Footer'
import AnimatedSection from '../components/AnimatedSection'
import DynamicContent from '@/components/DynamicContent'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  Wrench,
  Settings,
  Award,
  HelpCircle,
  Users,
  FileText,
  Shield
} from 'lucide-react'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission here
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900/20 to-transparent pt-16">
        {/* Main Contact Section */}
        <section className="py-16 px-6 sm:px-12 lg:px-16 xl:px-20">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <AnimatedSection animation="fadeIn" className="text-center mb-16" pageId="contact">
              <DynamicContent
                contentKey="contact_page_title"
                fallback="ΕΠΙΚΟΙΝΩΝΙΑ"
                as="h1"
                className="font-open-sans font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6"
              />
              <DynamicContent
                contentKey="contact_page_subtitle"
                fallback="Αν έχετε οποιεσδήποτε ερωτήσεις, παρακαλώ μη διστάσετε να επικοινωνήσετε μαζί μας μέσω τηλεφώνου, email, της φόρμας παρακάτω ή ακόμα και μέσω social media!"
                as="p"
                className="font-open-sans text-lg text-gray-300 max-w-2xl mx-auto"
              />
            </AnimatedSection>

            {/* Contact Content */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
              {/* Contact Form */}
              <AnimatedSection animation="slideInLeft" delay={200} pageId="contact">
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-indigo-800/50 rounded-2xl p-8 backdrop-blur-sm">
                  <DynamicContent
                    contentKey="contact_form_title"
                    fallback="ΕΠΙΚΟΙΝΩΝΗΣΤΕ ΜΑΖΙ ΜΑΣ"
                    as="h2"
                    className="font-open-sans font-bold text-2xl text-white mb-6"
                  />
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <DynamicContent
                          contentKey="contact_form_name_label"
                          fallback="ΟΝΟΜΑ"
                          as="label"
                          className="block font-open-sans text-sm font-medium text-gray-300 mb-2"
                        />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Εισάγετε το όνομά σας"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-indigo-800/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-open-sans"
                          required
                        />
                      </div>
                      <div>
                        <DynamicContent
                          contentKey="contact_form_phone_label"
                          fallback="ΤΗΛΕΦΩΝΟ"
                          as="label"
                          className="block font-open-sans text-sm font-medium text-gray-300 mb-2"
                        />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Εισάγετε το τηλέφωνό σας"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-indigo-800/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-open-sans"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <DynamicContent
                        contentKey="contact_form_email_label"
                        fallback="EMAIL"
                        as="label"
                        className="block font-open-sans text-sm font-medium text-gray-300 mb-2"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Εισάγετε το email σας"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-indigo-800/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-open-sans"
                        required
                      />
                    </div>
                    
                    <div>
                      <DynamicContent
                        contentKey="contact_form_message_label"
                        fallback="ΜΗΝΥΜΑ"
                        as="label"
                        className="block font-open-sans text-sm font-medium text-gray-300 mb-2"
                      />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Εισάγετε το μήνυμά σας"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-indigo-800/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-open-sans resize-vertical"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-lg font-open-sans font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      <DynamicContent
                        contentKey="contact_form_submit_button"
                        fallback="ΑΠΟΣΤΟΛΗ ΜΗΝΥΜΑΤΟΣ"
                        as="span"
                      />
                    </button>
                  </form>
                </div>
              </AnimatedSection>

              {/* Contact Information */}
              <AnimatedSection animation="slideInRight" delay={400} pageId="contact">
                <div className="space-y-8">
                  {/* Contact Info */}
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-indigo-800/50 rounded-2xl p-8 backdrop-blur-sm">
                    <h2 className="font-open-sans font-bold text-2xl text-white mb-6">
                      ΣΤΟΙΧΕΙΑ ΕΠΙΚΟΙΝΩΝΙΑΣ
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                          <Phone className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-open-sans text-sm text-gray-400 uppercase tracking-wide mb-1">ΤΗΛΕΦΩΝΟ</p>
                          <p className="font-open-sans text-white">+30 210 123 4567</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                          <Mail className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-open-sans text-sm text-gray-400 uppercase tracking-wide mb-1">EMAIL</p>
                          <p className="font-open-sans text-white">info@clark-parts.gr</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-indigo-400" />
                        </div>
                                               <div>
                         <p className="font-open-sans text-sm text-gray-400 uppercase tracking-wide mb-1">ΔΙΕΥΘΥΝΣΗ</p>
                         <p className="font-open-sans text-white">Λευκός Πύργος<br />Θεσσαλονίκη 546 21, Ελλάδα</p>
                       </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-indigo-800/50 rounded-2xl p-8 backdrop-blur-sm">
                    <h2 className="font-open-sans font-bold text-2xl text-white mb-6">
                      ΩΡΑΡΙΟ ΛΕΙΤΟΥΡΓΙΑΣ
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                        <div>
                          <p className="font-open-sans text-sm text-gray-400 uppercase tracking-wide">ΔΕΥΤΕΡΑ - ΠΑΡΑΣΚΕΥΗ</p>
                        </div>
                        <p className="font-open-sans text-white">09:00 - 18:00</p>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                        <div>
                          <p className="font-open-sans text-sm text-gray-400 uppercase tracking-wide">ΣΑΒΒΑΤΟ</p>
                        </div>
                        <p className="font-open-sans text-white">09:00 - 15:00</p>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <div>
                          <p className="font-open-sans text-sm text-gray-400 uppercase tracking-wide">ΚΥΡΙΑΚΗ</p>
                        </div>
                        <p className="font-open-sans text-white">09:00 - 14:00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Map Section */}
            <AnimatedSection animation="fadeIn" delay={600} pageId="contact">
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-indigo-800/50 rounded-2xl p-4 backdrop-blur-sm">
                <div className="w-full h-96 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3027.5555555555557!2d22.948611!3d40.626944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a838f41428e0ed%3A0x9bae715b8d574a9!2sWhite%20Tower%20of%20Thessaloniki!5e0!3m2!1sen!2sgr!4v1641234567890!5m2!1sen!2sgr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Λευκός Πύργος - Θεσσαλονίκη"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Footer */}
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
                  href: "#εταιρεια"
                },
                {
                  name: "Η Ιστορία μας",
                  Icon: FileText,
                  href: "#ιστορια"
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
      </div>
    </>
  )
}

export default ContactPage 