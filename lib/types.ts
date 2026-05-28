/**
 * TypeScript type definitions for Nobilitas Ventures B2B catalog system.
 * These interfaces mirror the PostgreSQL schema on Supabase and support strict type safety.
 */

// ==========================================
// Category Types
// ==========================================

export interface Category {
  id: string; // uuid
  name: string;
  slug: string;
  icon_name: string; // Lucide icon identifier for UI rendering
  display_order: number; // Controls layout order in navigation & category list
  is_active: boolean; // Enables soft-disable of categories from the catalog
  created_at: string; // ISO Timestamp from database
}

// ==========================================
// Subcategory Types
// ==========================================

export interface Subcategory {
  id: string; // uuid
  category_id: string; // FK to categories.id
  name: string;
  slug: string;
  display_order: number; // Controls visual sequence under parent category
  is_active: boolean; // Enables soft-disable of subcategories
}

// ==========================================
// Product Types
// ==========================================

/**
 * Union type for product inventory or availability status.
 * Used for status badges and filtering products.
 */
export type ProductStatus = 'available' | 'on_request' | 'out_of_stock';

export interface Product {
  id: string; // uuid
  name: string;
  slug: string; // SEO-friendly URL slug (must be unique)
  sku: string; // Stock Keeping Unit for B2B ordering reference
  category_id: string; // FK to categories.id
  subcategory_id: string | null; // FK to subcategories.id, optional for broader products
  brand: string;
  description: string;
  pack_sizes: string[]; // Pack sizing options (e.g., ["500ml", "1L", "5L"])
  unit: string; // Selling unit representation (e.g., "Bottle", "Box")
  min_order_qty: number; // Minimum quantity required to place an inquiry
  application: string[]; // Targeted sectors/use-cases (e.g., ["Hotels", "Hospitals"])
  tags: string[]; // General-purpose tags for search and categorization
  status: ProductStatus;
  is_featured: boolean; // Flag to feature product on homepage
  is_new_arrival: boolean; // Flag to display "New" badges and highlights
  image_url: string | null; // Nullable if product doesn't have an uploaded image yet
  certifications: string; // Certifications like ISO, GMP, etc.
  notes: string; // Internal admin notes for management/auditing
  created_at: string; // ISO Timestamp
  updated_at: string; // ISO Timestamp
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

/**
 * Type omission helper for creating a new product from admin forms.
 * Omit database-generated primary key and auto-timestamps.
 */
export type CreateProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

/**
 * Product row joined with its parent category name.
 * Used by the admin products list to show the category label inline
 * without a second client-side lookup.
 */
export interface ProductWithCategory extends Product {
  categories: { name: string; slug?: string; icon_name?: string } | null;
}

// ==========================================
// Inquiry Types
// ==========================================

/**
 * Union type for tracing B2B buyer inquiries workflow state.
 */
export type InquiryStatus = 'new' | 'read' | 'responded';

export interface Inquiry {
  id: string; // uuid
  product_id: string | null; // FK to products.id (nullable if general inquiry)
  name: string; // Buyer's name
  company: string; // Buyer's corporate/business entity name
  phone: string; // Required for primary B2B phone contact/WhatsApp routing
  email: string;
  products_interested: string; // Text list/description of products for quick context
  quantity: string; // Desired volume (e.g., "1000 units")
  message: string; // Customer's inquiry details or questions
  status: InquiryStatus;
  source: string; // Context channel of creation (e.g., 'contact_form', 'product_page', 'whatsapp')
  created_at: string; // ISO Timestamp
}

/**
 * Type omission helper for customer-facing or automated inquiry creation.
 * Omit database-generated key, workflow status, and created timestamp.
 */
export type CreateInquiryInput = Omit<Inquiry, 'id' | 'status' | 'created_at'>;

/**
 * Inquiry row joined with its linked product name via FK left-join.
 * The `products` key mirrors the Supabase `.select('*, products(name)')` shape.
 * Nullable because product_id is optional — a general inquiry has no product.
 */
export interface InquiryWithProduct extends Inquiry {
  products: { name: string } | null;
}

// ==========================================
// Setting Types
// ==========================================

export interface Setting {
  id: string; // uuid
  key: string; // Identifier key for application settings (e.g., 'whatsapp_number')
  value: string; // Corresponding configuration value
  label: string; // Descriptive human-readable label for Admin UI controls
}
