# URL-Based Filtering για Gallery

## Επισκόπηση

Τα links του navbar τώρα οδηγούν στη gallery με προεπιλεγμένα φίλτρα. Όταν κάποιος επιλέξει "Ηλεκτροκίνητο", πηγαίνει στη gallery με το φίλτρο "Ηλεκτροκίνητο" ήδη επιλεγμένο.

## URL Parameters

Υποστηρίζονται τα εξής parameters:

- `fuelType` - Τύπος καυσίμου (π.χ. "Ηλεκτροκίνητο", "Πετρελαιοκίνητο", "Υγραεριοκίνητο")
- `mastType` - Τύπος ιστού (π.χ. "Duplex", "Triplex", "Simplex", "Telescopic")
- `brand` - Μάρκα (π.χ. "CLARK", "NISSAN", "CATERPILLAR")
- `condition` - Κατάσταση (π.χ. "Καινούργιο", "Μεταχειρισμένο")

## Παραδείγματα URLs

### Fuel Type Filtering

```
/gallery?fuelType=Ηλεκτροκίνητο    - Μόνο ηλεκτρικά κλαρκ
/gallery?fuelType=Πετρελαιοκίνητο - Μόνο diesel κλαρκ
/gallery?fuelType=Υγραεριοκίνητο  - Μόνο LPG κλαρκ
```

### Mast Type Filtering

```
/gallery?mastType=Duplex   - Μόνο Duplex κλαρκ
/gallery?mastType=Triplex  - Μόνο Triplex κλαρκ
```

### Brand Filtering

```
/gallery?brand=CLARK       - Μόνο CLARK κλαρκ
/gallery?brand=NISSAN      - Μόνο NISSAN κλαρκ
/gallery?brand=CATERPILLAR - Μόνο CATERPILLAR κλαρκ
```

### Condition Filtering

```
/gallery?condition=Καινούργιο      - Μόνο καινούργια κλαρκ
/gallery?condition=Μεταχειρισμένο  - Μόνο μεταχειρισμένα κλαρκ
```

### Combination Filtering

```
/gallery?fuelType=Ηλεκτροκίνητο&brand=CLARK&condition=Καινούργιο
```

## Navbar Links

### Dropdown "Τύποι Κλαρκ"

- **Όλα τα Κλαρκ**: `/gallery`
- **Ηλεκτροκίνητο**: `/gallery?fuelType=Ηλεκτροκίνητο`
- **Πετρελαιοκίνητο**: `/gallery?fuelType=Πετρελαιοκίνητο`
- **Υγραεριοκίνητο**: `/gallery?fuelType=Υγραεριοκίνητο`
- **Duplex**: `/gallery?mastType=Duplex`
- **Triplex**: `/gallery?mastType=Triplex`

### Dropdown "Μάρκες & Κατάσταση"

- **CLARK**: `/gallery?brand=CLARK`
- **NISSAN**: `/gallery?brand=NISSAN`
- **CATERPILLAR**: `/gallery?brand=CATERPILLAR`
- **TOYOTA**: `/gallery?brand=TOYOTA`
- **Καινούργιο**: `/gallery?condition=Καινούργιο`
- **Μεταχειρισμένο**: `/gallery?condition=Μεταχειρισμένο`

## Πώς Λειτουργεί

### 1. URL Parameter Reading

Το Gallery component χρησιμοποιεί το Next.js `useSearchParams` hook:

```typescript
const searchParams = useSearchParams();
const urlFuelType = searchParams.get("fuelType");
```

### 2. Initial Filters Setup

Όταν φορτώνει η σελίδα, διαβάζει τα URL parameters και ορίζει αρχικά φίλτρα:

```typescript
const getInitialFilters = (): FilterState => {
  const urlFuelType = searchParams.get("fuelType");
  const urlMastType = searchParams.get("mastType");
  // ... κλπ

  return {
    fuelTypes: urlFuelType ? [urlFuelType] : [],
    mastTypes: urlMastType ? [urlMastType] : [],
    // ... κλπ
  };
};
```

### 3. Dynamic Updates

Αν αλλάξει το URL (π.χ. με browser back/forward), τα φίλτρα ενημερώνονται αυτόματα:

```typescript
useEffect(() => {
  // Update filters when URL parameters change
  const urlFuelType = searchParams.get("fuelType");
  // ... ενημέρωση φίλτρων
}, [searchParams]);
```

## User Experience

### 1. Direct Navigation

- Χρήστης επιλέγει "Ηλεκτροκίνητο" από navbar
- Πηγαίνει στη gallery με URL: `/gallery?fuelType=Ηλεκτροκίνητο`
- Gallery φορτώνει με προεπιλεγμένο το φίλτρο "Ηλεκτροκίνητο"
- Εμφανίζονται μόνο ηλεκτρικά κλαρκ

### 2. Filter State Persistence

- Τα φίλτρα που προέρχονται από URL διατηρούνται
- Χρήστης μπορεί να προσθέσει επιπλέον φίλτρα
- Browser back/forward δουλεύει σωστά

### 3. Combination

- Μπορεί να έχει πολλαπλά φίλτρα στο URL
- Κάθε φίλτρο εφαρμόζεται ξεχωριστά

## Τεχνικές Λεπτομέρειες

### URL Encoding

Τα ελληνικά κείμενα κωδικοποιούνται αυτόματα:

```
"Ηλεκτροκίνητο" → "%CE%97%CE%BB%CE%B5%CE%BA%CF%84%CF%81%CE%BF%CE%BA%CE%AF%CE%BD%CE%B7%CF%84%CE%BF"
```

### Fallback Behavior

- Αν το URL parameter δεν αντιστοιχεί σε διαθέσιμη επιλογή, αγνοείται
- Φίλτρα που δεν προέρχονται από URL παραμένουν κενά αρχικά

### Browser Compatibility

- Χρησιμοποιεί Next.js `useSearchParams` που είναι stable
- Δουλεύει σε όλους τους σύγχρονους browsers
- Server-side rendering safe

## Μελλοντικές Επεκτάσεις

### 1. URL State Sync

Μπορεί να προστεθεί sync των φίλτρων με το URL:

```typescript
// Όταν αλλάζουν τα φίλτρα, ενημέρωση URL
router.push(`/gallery?${new URLSearchParams(activeFilters)}`);
```

### 2. Social Sharing

URLs μπορούν να μοιραστούν:

```
"Κοίτα αυτά τα ηλεκτροκίνητα κλαρκ!"
https://clark-parts.gr/gallery?fuelType=Ηλεκτροκίνητο
```

### 3. Advanced Filtering

```
/gallery?minCapacity=2000&maxCapacity=4000&fuelType=Ηλεκτροκίνητο
```

## Debugging

Για να δείτε τα τρέχοντα φίλτρα:

1. Ανοίξτε Developer Tools
2. Console tab
3. Τα φίλτρα εμφανίζονται στο component state

Για να δοκιμάσετε manual URLs:

```
http://localhost:3000/gallery?fuelType=Ηλεκτροκίνητο
http://localhost:3000/gallery?brand=CLARK&condition=Καινούργιο
```
