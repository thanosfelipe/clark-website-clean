# 🚁 Forklift Gallery - Εξαιρετική Gallery Κλαρκ

## 🎨 Χαρακτηριστικά Σχεδίασης

### Layout & Structure

- **Sidebar Left**: Στενή αριστερή sidebar με φίλτρα και κύρια περιοχή περιεχομένου
- **Full Screen**: Καταλαμβάνει ολόκληρο το browser (width & height)
- **Flat Design**: Καθαρό, μινιμαλιστικό styling
- **Dark Mode**: Σκοτεινό θέμα σε όλη τη σελίδα

### 🎨 Χρώματα (Tailwind-based)

- **Accent Color**: Violet-500 (#8b5cf6) - για κουμπιά, links, highlights
- **Background**: Neutral-900 (#171717) - κύριο φόντο
- **Borders**: Neutral-800 (#262626) - διαφανή borders
- **Shadow**: Medium (shadow-md) - για cards και elements

### 📝 Typography

- **Font Family**: Open Sans (συμβατό με το website)
- **Heading Size**: 32-40px (text-4xl)
- **Subheading Size**: 20-24px (text-xl)
- **Body Text**: 14-16px (text-sm/text-base)
- **Font Weight**: Regular για headings
- **Γλώσσα**: Όλα στα Ελληνικά

### ✨ Animations

- **Type**: Fade animation
- **Sequence**: Όλα τα elements animate μαζί
- **Duration**: 0.3s για smooth transitions
- **Custom CSS**: Accordion fade-in effects

## 🔧 Λειτουργίες

### 🔍 Σύστημα Φίλτρων

1. **Αναζήτηση κειμένου**: Αναζήτηση σε τίτλο, μάρκα, κωδικό προϊόντος
2. **Φίλτρο Μάρκας**: Checkbox για NISSAN, TOYOTA, CLARK, κ.α.
3. **Κατάσταση**: Καινούργιο/Μεταχειρισμένο
4. **Τύπος Καυσίμου**: Βενζίνη, Ηλεκτρικό, Υγραέριο, Πετρέλαιο
5. **Τύπος Ιστού**: Duplex, Triplex, Telescopic, κ.α.
6. **Range Sliders**: Ανυψωτική ικανότητα (kg) και μέγιστο ύψος (mm)

### 🖼️ Gallery Grid

- **Responsive**: 1 στήλη mobile, 2 tablet, 3 desktop
- **Card Layout**: Εικόνα, στοιχεία, τιμή, accordion
- **Hover Effects**: Subtle animations στα cards

### 📁 Accordion System (όπως στην εικόνα)

Κάθε card έχει τμήμα "Χαρακτηριστικά" που:

- **Ανοίγει/κλείνει** με click
- **Εμφανίζει λεπτομέρειες**: Υποκατηγορία, τύπος ιστού, ορατότητα, απόθεμα
- **Περιγραφή προϊόντος**: Εάν υπάρχει
- **Color-coded dots**: Διαφορετικό χρώμα για κάθε χαρακτηριστικό

### 📊 Sample Data Structure

Βασισμένο στο database schema:

```typescript
interface ForkliftData {
  id: number;
  product_code: string; // PID_XXXX
  title: string; // Πλήρης τίτλος
  brand_name: string; // NISSAN, TOYOTA, etc.
  condition: string; // Καινούργιο/Μεταχειρισμένο
  fuel_type: string; // Τύπος καυσίμου
  lifting_capacity_kg: number;
  mast_type: string;
  max_lift_height_mm: number;
  price: number;
  description: string;
  // ... άλλα fields
}
```

## 🔗 Navigation Integration

### Main Navigation

- **ΚΛΑΡΚ** menu item τώρα link στο `/gallery`
- **Dropdown items** με query parameters για filtering:
  - `/gallery?type=electric` για Ηλεκτρικά
  - `/gallery?type=diesel` για Diesel
  - `/gallery?type=lpg` για LPG

### Home Page Button

- **"Δείτε τα προϊόντα"** button τώρα link στο `/gallery`

## 🛠️ Τεχνικές Λεπτομέρειες

### Components & Dependencies

- **@heroicons/react**: Για τα icons (FunnelIcon, ChevronDown, etc.)
- **Next.js Image**: Optimized εικόνες
- **AnimatedSection**: Χρήση του υπάρχοντος animation component
- **Particles**: Background effect όπως στην κύρια σελίδα

### State Management

- **React Hooks**: useState για filters, expanded cards, sidebar
- **useEffect**: Real-time filtering logic
- **TypeScript**: Πλήρη type safety

### Responsive Design

- **Mobile-first**: Προσαρμογή για όλες τις οθόνες
- **Sidebar collapse**: Στενότερη sidebar σε mobile
- **Grid adaptation**: Αλλαγή στηλών ανάλογα με οθόνη

### Performance Features

- **Efficient filtering**: Optimized filtering algorithms
- **Lazy state updates**: Smooth user experience
- **Custom scrollbars**: Styled scrollbars στη sidebar

## 🎯 Μελλοντικές Βελτιώσεις

1. **Database Integration**: Σύνδεση με πραγματικό Supabase API
2. **Server-side Filtering**: Για μεγάλα datasets
3. **Image Gallery**: Multiple εικόνες ανά προϊόν
4. **Wishlist**: Αγαπημένα προϊόντα
5. **Comparison**: Σύγκριση κλαρκ
6. **Advanced Search**: Περισσότερα φίλτρα
7. **Export**: PDF catalogs
8. **Admin Panel**: CRUD operations

## 🚀 Για να τρέξει τη Gallery

1. Server θα τρέχει στο `http://localhost:3000`
2. Πήγαινε στο `/gallery` ή κάνε click "ΚΛΑΡΚ" στο menu
3. Δοκίμασε τα φίλτρα και τα accordion components

**Η Gallery είναι έτοιμη και πλήρως λειτουργική! 🎉**
