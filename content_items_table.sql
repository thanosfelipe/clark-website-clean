-- Create content_items table for managing website content
-- This table will store editable text content for the website

-- Create table only if it doesn't exist
CREATE TABLE IF NOT EXISTS content_items (
    id SERIAL PRIMARY KEY,
    content_key VARCHAR(255) UNIQUE NOT NULL,
    content_value TEXT NOT NULL,
    description TEXT,
    page VARCHAR(100) DEFAULT 'homepage',
    content_type VARCHAR(50) DEFAULT 'text',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial content items based on the homepage
-- Use ON CONFLICT DO NOTHING to avoid errors if items already exist
INSERT INTO content_items (content_key, content_value, description, page, content_type) VALUES
-- Homepage Content
('hero_main_title', 'Μετατρέψτε την<br />Επιχείρησή σας<br /><span class="text-indigo-400">με Κλαρκ</span>', 'Κύριος τίτλος της αρχικής σελίδας', 'homepage', 'html'),
('hero_subtitle', 'Προσφέρουμε ποιοτικά ανταλλακτικά που οδηγούν σε αποτελέσματα. Από εξειδικευμένη τεχνική υποστήριξη έως γρήγορη παράδοση, βοηθάμε τις επιχειρήσεις να αντιμετωπίσουν κάθε πρόκληση.', 'Υπότιτλος της αρχικής σελίδας', 'homepage', 'text'),
('hero_badge_text', 'Εταιρεία Ανταλλακτικών', 'Κείμενο στο badge του hero section', 'homepage', 'text'),
('hero_cta_primary', 'Δείτε τα προϊόντα', 'Κύριο κουμπί call-to-action', 'homepage', 'text'),
('hero_cta_secondary', 'Μάθετε περισσότερα', 'Δευτερεύον κουμπί call-to-action', 'homepage', 'text'),

-- Features Cards Content
('features_card1_title', 'Ποιοτικά<br />Ανταλλακτικά!', 'Τίτλος πρώτης κάρτας χαρακτηριστικών', 'homepage', 'html'),
('features_card1_subtitle', 'Προσφέρουμε τα καλύτερα ανταλλακτικά για κάθε ανάγκη.', 'Υπότιτλος πρώτης κάρτας χαρακτηριστικών', 'homepage', 'text'),
('features_card1_tag', 'Ανταλλακτικά', 'Tag πρώτης κάρτας χαρακτηριστικών', 'homepage', 'text'),
('features_card1_feature1_title', 'Γρήγορη παράδοση', 'Τίτλος πρώτου χαρακτηριστικού πρώτης κάρτας', 'homepage', 'text'),
('features_card1_feature1_desc', 'Παραδίδουμε γρήγορα και αξιόπιστα.', 'Περιγραφή πρώτου χαρακτηριστικού πρώτης κάρτας', 'homepage', 'text'),
('features_card1_feature2_title', 'Εγγυημένη ποιότητα', 'Τίτλος δεύτερου χαρακτηριστικού πρώτης κάρτας', 'homepage', 'text'),
('features_card1_feature2_desc', 'Όλα τα προϊόντα μας είναι πιστοποιημένα.', 'Περιγραφή δεύτερου χαρακτηριστικού πρώτης κάρτας', 'homepage', 'text'),
('features_card1_feature3_title', 'Καλύτερες τιμές', 'Τίτλος τρίτου χαρακτηριστικού πρώτης κάρτας', 'homepage', 'text'),
('features_card1_feature3_desc', 'Προσφέρουμε ανταγωνιστικές τιμές.', 'Περιγραφή τρίτου χαρακτηριστικού πρώτης κάρτας', 'homepage', 'text'),

('features_card2_title', 'Εξειδικευμένη<br />Τεχνική Υποστήριξη!', 'Τίτλος δεύτερης κάρτας χαρακτηριστικών', 'homepage', 'html'),
('features_card2_subtitle', 'Η ομάδα μας παρέχει εξειδικευμένη τεχνική βοήθεια.', 'Υπότιτλος δεύτερης κάρτας χαρακτηριστικών', 'homepage', 'text'),
('features_card2_tag', 'Υπηρεσίες', 'Tag δεύτερης κάρτας χαρακτηριστικών', 'homepage', 'text'),
('features_card2_feature1_title', '24/7 Υποστήριξη', 'Τίτλος πρώτου χαρακτηριστικού δεύτερης κάρτας', 'homepage', 'text'),
('features_card2_feature1_desc', 'Είμαστε διαθέσιμοι όλο το 24ωρο.', 'Περιγραφή πρώτου χαρακτηριστικού δεύτερης κάρτας', 'homepage', 'text'),
('features_card2_feature2_title', 'Εξειδικευμένο προσωπικό', 'Τίτλος δεύτερου χαρακτηριστικού δεύτερης κάρτας', 'homepage', 'text'),
('features_card2_feature2_desc', 'Ομάδα με χρόνια εμπειρίας.', 'Περιγραφή δεύτερου χαρακτηριστικού δεύτερης κάρτας', 'homepage', 'text'),
('features_card2_feature3_title', 'Άμεση απάντηση', 'Τίτλος τρίτου χαρακτηριστικού δεύτερης κάρτας', 'homepage', 'text'),
('features_card2_feature3_desc', 'Γρήγορη και αποτελεσματική εξυπηρέτηση.', 'Περιγραφή τρίτου χαρακτηριστικού δεύτερης κάρτας', 'homepage', 'text'),

('features_card3_title', 'Αξιόπιστη<br />Συνεργασία!', 'Τίτλος τρίτης κάρτας χαρακτηριστικών', 'homepage', 'html'),
('features_card3_subtitle', 'Χτίζουμε μακροπρόθεσμες σχέσεις εμπιστοσύνης.', 'Υπότιτλος τρίτης κάρτας χαρακτηριστικών', 'homepage', 'text'),
('features_card3_tag', 'Εταιρεία', 'Tag τρίτης κάρτας χαρακτηριστικών', 'homepage', 'text'),
('features_card3_feature1_title', 'Χρόνια εμπειρίας', 'Τίτλος πρώτου χαρακτηριστικού τρίτης κάρτας', 'homepage', 'text'),
('features_card3_feature1_desc', 'Έμπειρη ομάδα στο χώρο.', 'Περιγραφή πρώτου χαρακτηριστικού τρίτης κάρτας', 'homepage', 'text'),
('features_card3_feature2_title', 'Εξατομικευμένη εξυπηρέτηση', 'Τίτλος δεύτερου χαρακτηριστικού τρίτης κάρτας', 'homepage', 'text'),
('features_card3_feature2_desc', 'Λύσεις προσαρμοσμένες στις ανάγκες σας.', 'Περιγραφή δεύτερου χαρακτηριστικού τρίτης κάρτας', 'homepage', 'text'),
('features_card3_feature3_title', 'Πανελλήνια κάλυψη', 'Τίτλος τρίτου χαρακτηριστικού τρίτης κάρτας', 'homepage', 'text'),
('features_card3_feature3_desc', 'Εξυπηρετούμε σε όλη την Ελλάδα.', 'Περιγραφή τρίτου χαρακτηριστικού τρίτης κάρτας', 'homepage', 'text'),

-- What Makes Us Unique Section
('unique_section_title', 'Τι μας κάνει μοναδικούς', 'Τίτλος ενότητας "Τι μας κάνει μοναδικούς"', 'homepage', 'text'),
('unique_section_subtitle', 'Δεν προσφέρουμε απλά ανταλλακτικά - δημιουργούμε αξιόπιστες λύσεις που οδηγούν την επιχείρησή σας στην επιτυχία', 'Υπότιτλος ενότητας "Τι μας κάνει μοναδικούς"', 'homepage', 'text'),

-- Clark Advantages Section
('clark_advantages_title', 'Πλεονεκτήματα Κλαρκ', 'Τίτλος ενότητας πλεονεκτημάτων Κλαρκ', 'homepage', 'text'),
('clark_advantage1', 'Εξατομικευμένες λύσεις για κάθε ανάγκη', 'Πρώτο πλεονέκτημα Κλαρκ', 'homepage', 'text'),
('clark_advantage2', 'Άριστη ποιότητα από την πρώτη μέρα', 'Δεύτερο πλεονέκτημα Κλαρκ', 'homepage', 'text'),
('clark_advantage3', 'Γρήγορη και αξιόπιστη εξυπηρέτηση', 'Τρίτο πλεονέκτημα Κλαρκ', 'homepage', 'text'),
('clark_advantage4', 'Κορυφαία απόδοση και αποτελεσματικότητα', 'Τέταρτο πλεονέκτημα Κλαρκ', 'homepage', 'text'),
('clark_advantage5', 'Αφοσιωμένη ομάδα υποστήριξης', 'Πέμπτο πλεονέκτημα Κλαρκ', 'homepage', 'text'),

-- Traditional Companies Section
('traditional_companies_title', 'Παραδοσιακές Εταιρείες', 'Τίτλος ενότητας παραδοσιακών εταιρειών', 'homepage', 'text'),
('traditional_disadvantage1', 'Γενικές λύσεις χωρίς εξειδίκευση', 'Πρώτο μειονέκτημα παραδοσιακών εταιρειών', 'homepage', 'text'),
('traditional_disadvantage2', 'Βασική ποιότητα προϊόντων', 'Δεύτερο μειονέκτημα παραδοσιακών εταιρειών', 'homepage', 'text'),
('traditional_disadvantage3', 'Περιορισμένη τεχνική υποστήριξη', 'Τρίτο μειονέκτημα παραδοσιακών εταιρειών', 'homepage', 'text'),
('traditional_disadvantage4', 'Αργοί χρόνοι παράδοσης', 'Τέταρτο μειονέκτημα παραδοσιακών εταιρειών', 'homepage', 'text'),
('traditional_disadvantage5', 'Ελάχιστη εξυπηρέτηση μετά την πώληση', 'Πέμπτο μειονέκτημα παραδοσιακών εταιρειών', 'homepage', 'text'),

-- Contact Page Content
('contact_page_title', 'ΕΠΙΚΟΙΝΩΝΙΑ', 'Τίτλος σελίδας επικοινωνίας', 'contact', 'text'),
('contact_page_subtitle', 'Αν έχετε οποιεσδήποτε ερωτήσεις, παρακαλώ μη διστάσετε να επικοινωνήσετε μαζί μας μέσω τηλεφώνου, email, της φόρμας παρακάτω ή ακόμα και μέσω social media!', 'Υπότιτλος σελίδας επικοινωνίας', 'contact', 'text'),
('contact_form_title', 'ΕΠΙΚΟΙΝΩΝΗΣΤΕ ΜΑΖΙ ΜΑΣ', 'Τίτλος φόρμας επικοινωνίας', 'contact', 'text'),
('contact_form_name_label', 'ΟΝΟΜΑ', 'Ετικέτα πεδίου ονόματος', 'contact', 'text'),
('contact_form_phone_label', 'ΤΗΛΕΦΩΝΟ', 'Ετικέτα πεδίου τηλεφώνου', 'contact', 'text'),
('contact_form_email_label', 'EMAIL', 'Ετικέτα πεδίου email', 'contact', 'text'),
('contact_form_message_label', 'ΜΗΝΥΜΑ', 'Ετικέτα πεδίου μηνύματος', 'contact', 'text'),
('contact_form_submit_button', 'ΑΠΟΣΤΟΛΗ ΜΗΝΥΜΑΤΟΣ', 'Κείμενο κουμπιού αποστολής φόρμας', 'contact', 'text'),

-- About Us Page Content
('about_hero_badge', 'Σχετικά με εμάς', 'Badge του hero section της σελίδας about', 'aboutUs', 'text'),
('about_hero_title', 'Η Ιστορία του<br /><span class="text-indigo-400">Κλαρκ</span>', 'Κύριος τίτλος της σελίδας about', 'aboutUs', 'html'),
('about_hero_subtitle', 'Από το 1995 στην υπηρεσία των επιχειρήσεων, προσφέρουμε ποιοτικά ανταλλακτικά και αξιόπιστες λύσεις που στηρίζουν την ανάπτυξη και την επιτυχία των πελατών μας.', 'Υπότιτλος της σελίδας about', 'aboutUs', 'text'),
('about_values_title', 'Οι Αξίες μας', 'Τίτλος ενότητας αξιών', 'aboutUs', 'text'),
('about_values_subtitle', 'Καθοδηγούμαστε από αξίες που εμπνέουν την καθημερινή μας δουλειά και τη σχέση μας με τους πελάτες', 'Υπότιτλος ενότητας αξιών', 'aboutUs', 'text'),
('about_quality_title', 'Ποιότητα', 'Τίτλος αξίας ποιότητας', 'aboutUs', 'text'),
('about_quality_desc', 'Προσφέρουμε μόνο ανταλλακτικά άριστης ποιότητας που εγγυώνται μακροχρόνια απόδοση και αξιοπιστία.', 'Περιγραφή αξίας ποιότητας', 'aboutUs', 'text'),

-- Footer Content
('footer_brand_name', 'Κλαρκ', 'Όνομα εταιρείας στο footer', 'global', 'text'),
('footer_brand_desc', 'Η κορυφαία εταιρεία ανταλλακτικών και υπηρεσιών κλαρκ στην Ελλάδα. Προσφέρουμε ποιοτικά ανταλλακτικά, τεχνική υποστήριξη και αξιόπιστες λύσεις για κάθε επιχειρηματική ανάγκη.', 'Περιγραφή εταιρείας στο footer', 'global', 'text'),
('footer_products_title', 'Προϊόντα & Υπηρεσίες', 'Τίτλος στήλης προϊόντων και υπηρεσιών στο footer', 'global', 'text'),
('footer_company_title', 'Εταιρεία', 'Τίτλος στήλης εταιρείας στο footer', 'global', 'text'),
('footer_contact_title', 'Επικοινωνία', 'Τίτλος στήλης επικοινωνίας στο footer', 'global', 'text'),
('footer_copyright', '© 2025 Κλαρκ Ανταλλακτικά. Όλα τα δικαιώματα διατηρούνται.', 'Κείμενο copyright στο footer', 'global', 'text')
ON CONFLICT (content_key) DO NOTHING;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_content_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at (drop if exists first)
DROP TRIGGER IF EXISTS update_content_items_updated_at ON content_items;
CREATE TRIGGER update_content_items_updated_at
    BEFORE UPDATE ON content_items
    FOR EACH ROW
    EXECUTE FUNCTION update_content_items_updated_at();

-- Add RLS (Row Level Security) if needed
-- ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;