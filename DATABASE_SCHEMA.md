# 🏗️ Forklift Management Database Schema

## 📊 Overview

Comprehensive database system for managing forklift inventory with detailed specifications, filtering capabilities, and image management.

## 🗂️ Database Tables

### 1. **brands** - Μάρκες Κλαρκ

Αποθηκεύει όλες τις μάρκες κλαρκ (NISSAN, CLARK, TOYOTA, κτλ.)

| Column       | Type                         | Description                      |
| ------------ | ---------------------------- | -------------------------------- |
| `id`         | SERIAL PRIMARY KEY           | Μοναδικό ID μάρκας               |
| `name`       | VARCHAR(100) NOT NULL UNIQUE | Όνομα μάρκας                     |
| `logo_url`   | TEXT                         | URL λογότυπου μάρκας             |
| `created_at` | TIMESTAMPTZ                  | Ημερομηνία δημιουργίας           |
| `updated_at` | TIMESTAMPTZ                  | Ημερομηνία τελευταίας ενημέρωσης |

### 2. **categories** - Κύριες Κατηγορίες

Κύριες κατηγορίες προϊόντων (Κλαρκ, Ανταλλακτικά, κτλ.)

| Column        | Type                         | Description                      |
| ------------- | ---------------------------- | -------------------------------- |
| `id`          | SERIAL PRIMARY KEY           | Μοναδικό ID κατηγορίας           |
| `name`        | VARCHAR(100) NOT NULL UNIQUE | Όνομα κατηγορίας                 |
| `description` | TEXT                         | Περιγραφή κατηγορίας             |
| `created_at`  | TIMESTAMPTZ                  | Ημερομηνία δημιουργίας           |
| `updated_at`  | TIMESTAMPTZ                  | Ημερομηνία τελευταίας ενημέρωσης |

### 3. **subcategories** - Υποκατηγορίες

Υποκατηγορίες κλαρκ (Ηλεκτρικά, Diesel, LPG, κτλ.)

| Column        | Type                              | Description                      |
| ------------- | --------------------------------- | -------------------------------- |
| `id`          | SERIAL PRIMARY KEY                | Μοναδικό ID υποκατηγορίας        |
| `category_id` | INTEGER REFERENCES categories(id) | ID κύριας κατηγορίας             |
| `name`        | VARCHAR(100) NOT NULL             | Όνομα υποκατηγορίας              |
| `description` | TEXT                              | Περιγραφή υποκατηγορίας          |
| `created_at`  | TIMESTAMPTZ                       | Ημερομηνία δημιουργίας           |
| `updated_at`  | TIMESTAMPTZ                       | Ημερομηνία τελευταίας ενημέρωσης |

### 4. **fuel_types** - Τύποι Καυσίμου

Διαθέσιμοι τύποι καυσίμου για κλαρκ

| Column       | Type                        | Description                |
| ------------ | --------------------------- | -------------------------- |
| `id`         | SERIAL PRIMARY KEY          | Μοναδικό ID τύπου καυσίμου |
| `name`       | VARCHAR(50) NOT NULL UNIQUE | Όνομα τύπου καυσίμου       |
| `created_at` | TIMESTAMPTZ                 | Ημερομηνία δημιουργίας     |

**Διαθέσιμοι τύποι:**

- Βενζινοκίνητο
- Ηλεκτροκίνητο
- Υγραεριοκίνητο
- Πετρελαιοκίνητο

### 5. **mast_types** - Τύποι Ιστού

Διαθέσιμοι τύποι ιστού για κλαρκ

| Column       | Type                        | Description             |
| ------------ | --------------------------- | ----------------------- |
| `id`         | SERIAL PRIMARY KEY          | Μοναδικό ID τύπου ιστού |
| `name`       | VARCHAR(50) NOT NULL UNIQUE | Όνομα τύπου ιστού       |
| `created_at` | TIMESTAMPTZ                 | Ημερομηνία δημιουργίας  |

**Διαθέσιμοι τύποι:**

- Duplex
- Simplex
- Triplex
- Telescopic
- Τριπλοεκτεινόμενος

### 6. **forklifts** - Κύριος Πίνακας Κλαρκ 🏗️

Κεντρικός πίνακας με όλα τα δεδομένα κλαρκ

| Column                | Type                                 | Description                                |
| --------------------- | ------------------------------------ | ------------------------------------------ |
| `id`                  | SERIAL PRIMARY KEY                   | Μοναδικό ID κλαρκ                          |
| `product_code`        | VARCHAR(20) UNIQUE NOT NULL          | Auto-generated κωδικός (PID_XXXX)          |
| `title`               | VARCHAR(200) NOT NULL                | Τίτλος προϊόντος                           |
| `brand_id`            | INTEGER REFERENCES brands(id)        | ID μάρκας                                  |
| `category_id`         | INTEGER REFERENCES categories(id)    | ID κατηγορίας                              |
| `subcategory_id`      | INTEGER REFERENCES subcategories(id) | ID υποκατηγορίας                           |
| `condition`           | VARCHAR(20) NOT NULL                 | Κατάσταση ('Καινούργιο', 'Μεταχειρισμένο') |
| `model_year`          | INTEGER                              | Έτος μοντέλου                              |
| `fuel_type_id`        | INTEGER REFERENCES fuel_types(id)    | ID τύπου καυσίμου                          |
| `lifting_capacity_kg` | INTEGER NOT NULL                     | Ανυψωτική ικανότητα σε kg                  |
| `mast_type_id`        | INTEGER REFERENCES mast_types(id)    | ID τύπου ιστού                             |
| `mast_visibility`     | VARCHAR(20)                          | Ορατότητα ιστού (π.χ. "Full-View")         |
| `max_lift_height_mm`  | INTEGER NOT NULL                     | Μέγιστο ύψος ανύψωσης σε mm                |
| `description`         | TEXT                                 | Περιγραφή προϊόντος (ελεύθερο κείμενο)     |
| `price`               | DECIMAL(10,2)                        | Χονδρική τιμή                              |
| `stock_quantity`      | INTEGER DEFAULT 0                    | Ποσότητα αποθέματος                        |
| `is_available`        | BOOLEAN DEFAULT true                 | Διαθεσιμότητα                              |
| `created_at`          | TIMESTAMPTZ                          | Ημερομηνία δημιουργίας                     |
| `updated_at`          | TIMESTAMPTZ                          | Ημερομηνία τελευταίας ενημέρωσης           |

### 7. **forklift_images** - Εικόνες Κλαρκ

Αποθήκευση πολλαπλών εικόνων ανά κλαρκ

| Column        | Type                             | Description                       |
| ------------- | -------------------------------- | --------------------------------- |
| `id`          | SERIAL PRIMARY KEY               | Μοναδικό ID εικόνας               |
| `forklift_id` | INTEGER REFERENCES forklifts(id) | ID κλαρκ                          |
| `image_url`   | TEXT NOT NULL                    | URL εικόνας                       |
| `alt_text`    | VARCHAR(200)                     | Εναλλακτικό κείμενο               |
| `is_primary`  | BOOLEAN DEFAULT false            | Κύρια εικόνα (μόνο μία ανά κλαρκ) |
| `sort_order`  | INTEGER DEFAULT 0                | Σειρά εμφάνισης                   |
| `created_at`  | TIMESTAMPTZ                      | Ημερομηνία δημιουργίας            |

### 8. **admin_users** - Διαχειριστές

Λογαριασμοί διαχειριστών για το admin panel

| Column          | Type                         | Description                      |
| --------------- | ---------------------------- | -------------------------------- |
| `id`            | SERIAL PRIMARY KEY           | Μοναδικό ID χρήστη               |
| `email`         | VARCHAR(255) UNIQUE NOT NULL | Email διαχειριστή                |
| `password_hash` | VARCHAR(255) NOT NULL        | Κρυπτογραφημένος κωδικός         |
| `name`          | VARCHAR(100) NOT NULL        | Όνομα διαχειριστή                |
| `role`          | VARCHAR(20) DEFAULT 'admin'  | Ρόλος χρήστη                     |
| `is_active`     | BOOLEAN DEFAULT true         | Ενεργός λογαριασμός              |
| `created_at`    | TIMESTAMPTZ                  | Ημερομηνία δημιουργίας           |
| `updated_at`    | TIMESTAMPTZ                  | Ημερομηνία τελευταίας ενημέρωσης |

## 📋 Views & Functions

### 1. **forklift_listings** View

Comprehensive view που συνδυάζει όλα τα δεδομένα για εύκολη προβολή

```sql
SELECT * FROM forklift_listings;
```

**Περιλαμβάνει:**

- Όλα τα στοιχεία κλαρκ με ονόματα (όχι IDs)
- Κύρια εικόνα
- Συνολικός αριθμός εικόνων
- Μόνο διαθέσιμα κλαρκ (is_available = true)

### 2. **search_forklifts()** Function

Προηγμένη αναζήτηση και φιλτράρισμα κλαρκ

```sql
SELECT * FROM search_forklifts(
  search_term := 'NISSAN',
  brand_ids := ARRAY[1, 2, 3],
  condition_filter := 'Μεταχειρισμένο',
  min_capacity := 1000,
  max_capacity := 3000,
  min_height := 3000,
  max_height := 5000,
  fuel_type_ids := ARRAY[1, 2],
  mast_type_ids := ARRAY[1, 3],
  limit_count := 20,
  offset_count := 0
);
```

**Παράμετροι φίλτρων:**

- `search_term`: Κείμενο αναζήτησης (title, description, product_code, brand_name)
- `brand_ids`: Array με IDs μαρκών
- `condition_filter`: Κατάσταση κλαρκ
- `min_capacity/max_capacity`: Εύρος ανυψωτικής ικανότητας
- `min_height/max_height`: Εύρος μέγιστου ύψους
- `fuel_type_ids`: Array με IDs τύπων καυσίμου
- `mast_type_ids`: Array με IDs τύπων ιστού
- `limit_count/offset_count`: Pagination

## 🔄 Auto-Generated Features

### Product Code Generation

Αυτόματη δημιουργία κωδικών προϊόντων με format `PID_XXXX`:

```sql
-- Παράδειγμα: PID_1000, PID_1001, PID_1002...
```

### Timestamp Updates

Αυτόματη ενημέρωση `updated_at` timestamp σε κάθε UPDATE.

## 🛡️ Security (RLS Policies)

### Public Access (Read-Only)

- Όλοι οι πίνακες: **Read access** για όλους
- `forklifts`: Μόνο διαθέσιμα (is_available = true)

### Admin Access (Development)

- Προσωρινά: **Full access** για όλες τις λειτουργίες
- `admin_users`: **Πλήρως περιορισμένος**

## 📈 Performance Indexes

Indexes για βελτιστοποίηση performance:

```sql
-- Forklift searches
idx_forklifts_brand_id, idx_forklifts_category_id,
idx_forklifts_fuel_type_id, idx_forklifts_mast_type_id,
idx_forklifts_lifting_capacity, idx_forklifts_max_lift_height,
idx_forklifts_condition, idx_forklifts_is_available

-- Image management
idx_forklift_images_forklift_id, idx_forklift_images_is_primary
```

## 🚀 Usage Examples

### Βασική αναζήτηση

```sql
SELECT * FROM forklift_listings
WHERE brand_name = 'NISSAN'
AND lifting_capacity_kg >= 2000;
```

### Φιλτραρισμένη αναζήτηση

```sql
SELECT * FROM search_forklifts(
  search_term := 'diesel',
  min_capacity := 1500,
  max_capacity := 3000,
  limit_count := 10
);
```

### Προσθήκη νέου κλαρκ

```sql
INSERT INTO forklifts (
  title, brand_id, category_id, condition,
  lifting_capacity_kg, max_lift_height_mm, price
) VALUES (
  'TOYOTA 7FG25 Diesel Forklift',
  (SELECT id FROM brands WHERE name = 'TOYOTA'),
  (SELECT id FROM categories WHERE name = 'Κλαρκ'),
  'Μεταχειρισμένο', 2500, 4500, 18500.00
);
```

## 🔧 Next Steps για Development

1. **Authentication System**: Ενσωμάτωση Supabase Auth για admin users
2. **File Upload**: Σύστημα upload εικόνων με Supabase Storage
3. **API Endpoints**: RESTful APIs για frontend integration
4. **Admin Panel**: Dashboard για διαχείριση κλαρκ
5. **Search Optimization**: Full-text search με PostgreSQL

---

## 📞 Database Information

- **Project**: stavridis_forklift_website
- **Platform**: Supabase
- **Region**: EU Central (Frankfurt)
- **PostgreSQL Version**: 17.4.1
