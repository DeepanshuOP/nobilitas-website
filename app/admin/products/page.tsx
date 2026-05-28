/**
 * Admin: Products list page — Server Component
 *
 * Reads optional ?search= and ?category= query params from the URL and
 * applies them as server-side Supabase filters before passing data down.
 * The join `categories(name)` piggybacks on the existing FK so we get the
 * human-readable category name without a separate round-trip.
 */

import { createClient } from '@/lib/supabase/server';
import { Category, ProductWithCategory } from '@/lib/types';
import ProductsListClient from './ProductsListClient';

export const dynamic = 'force-dynamic';

interface SearchParams {
  search?: string;
  category?: string;
}

// Next.js 16 App Router passes searchParams as a Promise
interface ProductsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  // ── 1. Fetch categories for the filter dropdown ───────────────────────────
  const { data: categoriesData, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name, slug, icon_name, display_order, is_active, created_at')
    .order('display_order', { ascending: true })
    .returns<Category[]>();

  // ── 2. Build products query with optional filters ─────────────────────────
  let query = supabase
    .from('products')
    // Join category name via FK — Supabase embeds it as a nested object
    .select('*, categories(name)')
    .order('created_at', { ascending: false });

  // Full-text style filter: match name OR brand (case-insensitive via ilike)
  const searchTerm = params.search?.trim();
  if (searchTerm) {
    // WHY or(): Supabase PostgREST requires explicit OR grouping for
    // multi-column ilike — chaining .ilike() would apply AND logic.
    query = query.or(
      `name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`
    );
  }

  // Category filter: match on the UUID stored in category_id
  const categoryFilter = params.category?.trim();
  if (categoryFilter) {
    query = query.eq('category_id', categoryFilter);
  }

  const { data: productsData, error: productsError } =
    await query.returns<ProductWithCategory[]>();

  // Aggregate the first error to surface in the UI; categories failure is
  // non-fatal (filter dropdown will just be empty).
  const fetchError =
    productsError?.message ?? categoriesError?.message ?? null;

  return (
    <ProductsListClient
      products={productsData ?? []}
      categories={categoriesData ?? []}
      fetchError={fetchError}
      initialSearch={searchTerm ?? ''}
      initialCategory={categoryFilter ?? ''}
    />
  );
}
