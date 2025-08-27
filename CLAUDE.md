# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the development server (localhost:3000)
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Architecture Overview

This is a Next.js 15 React application built for forklift parts/equipment management with a Supabase backend. The application uses TypeScript and Tailwind CSS.

### Core Structure

**Frontend Architecture:**
- Next.js App Router (`src/app/`)
- TypeScript with strict mode enabled
- Tailwind CSS for styling
- Three Google Fonts: Quicksand, Nunito, and Open Sans
- Greek language support (`lang="el"`)

**Backend Integration:**
- Supabase as the primary database and storage solution
- Database queries organized in `src/lib/admin-queries.ts` with proper error handling
- Type-safe database operations using generated types from `src/lib/database.types.ts`

### Key Application Areas

**Public Pages:**
- `/` - Main landing page
- `/gallery` - Forklift gallery with search/filtering
- `/parts` - Parts page
- `/contact` - Contact page

**Admin System:**
- `/admin` - Protected admin dashboard
- `/admin/login` - Admin authentication
- `/admin/forklifts` - Forklift management (add/edit/view)
- `/admin/brands` - Brand management

### Database Layer

The application uses a comprehensive database abstraction layer in `src/lib/admin-queries.ts`:
- Organized query modules for each entity: brands, categories, subcategories, fuel types, mast types, forklifts, and forklift images
- Built-in validation functions with Greek error messages
- Proper error handling with custom DatabaseError class
- Transaction support for complex operations (e.g., creating forklifts with images)

Key database features:
- Dynamic search using stored procedures (`search_forklifts`)
- Image management with primary image support
- Product code auto-generation
- Comprehensive filtering system

### Supabase Configuration

- URL: `https://aifgbbgclcukazrwezwk.supabase.co` (configured in `src/lib/supabase.ts`)
- Image storage configured for both Supabase storage and Unsplash
- Type-safe client with generated database types

### UI Components

**Reusable Components:**
- `AnimatedSection.tsx` - Scroll-triggered animations
- `SpotlightCard` - Interactive card component
- `RotatingText` - Text animation component
- UI components in `src/app/components/ui/` (breadcrumb, glowing effects, particles, etc.)

**Admin Components:**
- `ForkliftCard.tsx` - Admin forklift display
- `ForkliftForm.tsx` - Add/edit forklift form
- `ImageUpload.tsx` - Image management interface
- `AdminHeader.tsx` & `AdminSidebar.tsx` - Admin layout components

### Development Notes

- Path alias configured: `@/*` maps to `./src/*`
- The codebase includes comprehensive documentation files (DATABASE_SCHEMA.md, GALLERY_FEATURES.md, etc.)
- Greek language content throughout the application
- Analytics integration with Vercel Analytics and Speed Insights
- Responsive design with mobile-optimized components