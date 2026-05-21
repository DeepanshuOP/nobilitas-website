# PRODUCT REQUIREMENTS & AGENT INSTRUCTIONS — NOBILITAS VENTURES
This document serves as the ground truth context, rules, and database schema for the Nobilitas Ventures B2B Catalog project.

## 1. Project Summary
*   **Product Type**: B2B catalog + inquiry website (no e-commerce checkout)
*   **Goal**: Generate WhatsApp and contact form inquiries from B2B buyers
*   **Pricing**: No prices displayed (inquiry-only)
*   **Visuals**: Lucide category icons initially; custom product images via Admin panel later
*   **Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase, Vercel

## 2. Database Schema (Supabase / PostgreSQL)

### Table: `categories`
*   `id`: `uuid` Primary Key (auto-generated)
*   `name`: `text NOT NULL` (e.g. "Cleaning & Hygiene")
*   `slug`: `text UNIQUE NOT NULL` (e.g. "cleaning-hygiene")
*   `description`: `text`
*   `icon_name`: `text` (Lucide React icon identifier e.g. "sparkles")
*   `display_order`: `integer`
*   `is_active`: `boolean` (Default: `true`)
*   `created_at`: `timestamptz`

### Table: `subcategories`
*   `id`: `uuid` Primary Key
*   `category_id`: `uuid` Foreign Key → `categories.id`
*   `name`: `text NOT NULL`
*   `slug`: `text`
*   `display_order`: `integer`
*   `is_active`: `boolean` (Default: `true`)

### Table: `products`
*   `id`: `uuid` Primary Key
*   `name`: `text NOT NULL`
*   `slug`: `text UNIQUE NOT NULL`
*   `sku`: `text`
*   `category_id`: `uuid` Foreign Key → `categories.id`
*   `subcategory_id`: `uuid` Foreign Key → `subcategories.id` (nullable)
*   `brand`: `text`
*   `description`: `text`
*   `pack_sizes`: `text[]` (e.g. `["500ml", "1L", "5L"]`)
*   `unit`: `text` (e.g. "Bottle", "Box")
*   `min_order_qty`: `integer`
*   `application`: `text[]` (e.g. `["Hotels", "Hospitals"]`)
*   `tags`: `text[]`
*   `status`: `enum` (`'available'`, `'on_request'`, `'out_of_stock'`)
*   `is_featured`: `boolean` (Shows on homepage)
*   `is_new_arrival`: `boolean` (Triggers badge)
*   `image_url`: `text` (nullable)
*   `certifications`: `text`
*   `notes`: `text` (Internal notes)
*   `created_at`: `timestamptz`
*   `updated_at`: `timestamptz`

### Table: `inquiries`
*   `id`: `uuid` Primary Key
*   `name`: `text NOT NULL` (Buyer's name)
*   `company`: `text`
*   `phone`: `text NOT NULL`
*   `email`: `text`
*   `products_interested`: `text`
*   `product_id`: `uuid` Foreign Key → `products.id` (nullable)
*   `quantity`: `text` (e.g. "1000 units")
*   `message`: `text`
*   `status`: `enum` (`'new'`, `'read'`, `'responded'`)
*   `source`: `text` (`'contact_form'`, `'product_page'`, `'whatsapp'`)
*   `created_at`: `timestamptz`

---

## 3. Universal Development Rules & Guidelines
1.  **TypeScript Strict Mode**: No use of `any` types. Ensure full type definitions are established in `lib/types.ts`.
2.  **Functional Components**: Strictly functional components. Avoid class components.
3.  **Mobile-First Design**: Implement Tailwind CSS responsive layouts focusing on mobile viewports first, styling up to desktop screen widths.
4.  **Self-Check Verification**: Run `npm run build` or `npx tsc --noEmit` locally after creating or editing TypeScript files to verify there are no syntax or type compilation errors.
5.  **Git Guidelines**: Write high-quality, professional commit messages following the standard `feat/fix/chore/refactor: description` format.
