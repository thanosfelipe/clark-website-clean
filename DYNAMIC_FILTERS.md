# Δυναμικά Φίλτρα Κλαρκ

## Επισκόπηση

Το σύστημα εμφανίζει στα φίλτρα **μόνο τις επιλογές που πραγματικά υπάρχουν** στη βάση δεδομένων. Αν δεν υπάρχει κανένα κλαρκ συγκεκριμένης μάρκας, η μάρκα δεν θα εμφανιστεί στα φίλτρα.

## Πώς Λειτουργεί

### 1. PostgreSQL Functions

Δημιουργήθηκαν 5 PostgreSQL functions που επιστρέφουν μόνο διαθέσιμες επιλογές:

```sql
-- Μόνο brands που έχουν διαθέσιμα κλαρκ
get_available_brands()

-- Μόνο fuel types που έχουν διαθέσιμα κλαρκ
get_available_fuel_types()

-- Μόνο mast types που έχουν διαθέσιμα κλαρκ
get_available_mast_types()

-- Min/Max capacity από διαθέσιμα κλαρκ
get_available_capacity_range()

-- Min/Max height από διαθέσιμα κλαρκ
get_available_height_range()
```

### 2. Δυναμικές Επιλογές

- **Brands**: Εμφανίζονται μόνο brands που έχουν `is_available = true` κλαρκ
- **Fuel Types**: Εμφανίζονται μόνο fuel types που χρησιμοποιούνται σε διαθέσιμα κλαρκ
- **Mast Types**: Εμφανίζονται μόνο mast types που χρησιμοποιούνται σε διαθέσιμα κλαρκ
- **Capacity Range**: Αυτόματα min/max από τα πραγματικά δεδομένα
- **Height Range**: Αυτόματα min/max από τα πραγματικά δεδομένα

### 3. Fallback Λογική

Αν οι PostgreSQL functions αποτύχουν:

- Επιστρέφουν όλες τις διαθέσιμες επιλογές από τους βασικούς πίνακες
- Static ranges για capacity/height

## Παραδείγματα

### Τρέχον Κατάσταση Βάσης

```
Διαθέσιμα Brands: BAOLI, CAM, CATERPILLAR, CHL, CLARK, JUNGHEINRICH, NISSAN
Διαθέσιμα Fuel Types: Ηλεκτροκίνητο, Πετρελαιοκίνητο, Υγραεριοκίνητο
Capacity Range: 1,600kg - 4,000kg
Height Range: 3,800mm - 9,500mm
```

### Αν προσθέσετε νέο Brand χωρίς κλαρκ

```sql
INSERT INTO brands (name) VALUES ('HYSTER');
-- Το HYSTER ΔΕΝ θα εμφανιστεί στα φίλτρα
```

### Αν προσθέσετε κλαρκ για το νέο Brand

```sql
INSERT INTO forklifts (...) VALUES (..., brand_id_hyster, ...);
-- Το HYSTER ΘΑ εμφανιστεί στα φίλτρα
```

## Πλεονεκτήματα

1. **Καθαρό UI**: Μόνο σχετικές επιλογές
2. **Αυτόματη Ενημέρωση**: Τα φίλτρα ενημερώνονται όταν προστίθενται νέα κλαρκ
3. **Απόδοση**: Efficient SQL queries με JOINs
4. **Αξιοπιστία**: Fallback λογική σε περίπτωση σφάλματος

## Τεχνικές Λεπτομέρειες

### Frontend Implementation

```typescript
// Dynamic loading στο Gallery component
const [
  forkliftData,
  brandsData,
  fuelTypesData,
  mastTypesData,
  capacityRange,
  heightRange,
] = await Promise.all([
  getAllForklifts(),
  getBrands(), // → get_available_brands()
  getFuelTypes(), // → get_available_fuel_types()
  getMastTypes(), // → get_available_mast_types()
  getCapacityRange(), // → get_available_capacity_range()
  getHeightRange(), // → get_available_height_range()
]);
```

### Database Functions

Οι functions χρησιμοποιούν INNER JOINs για performance:

```sql
CREATE OR REPLACE FUNCTION get_available_brands()
RETURNS TABLE(id INT, name TEXT)
LANGUAGE sql
AS $$
  SELECT DISTINCT b.id, b.name
  FROM brands b
  INNER JOIN forklifts f ON b.id = f.brand_id
  WHERE f.is_available = true
  ORDER BY b.name;
$$;
```

## Συντήρηση

Για προσθήκη νέων τύπων φίλτρων:

1. Δημιουργήστε PostgreSQL function
2. Προσθέστε TypeScript function στο `supabase.ts`
3. Ενημερώστε το Gallery component
4. Προσθέστε fallback λογική

Οι functions ενημερώνονται αυτόματα όταν αλλάζουν τα δεδομένα - δεν χρειάζεται manual refresh.
