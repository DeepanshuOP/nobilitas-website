/**
 * Public catalog page — Server Component.
 * Handles search, category filter, and pagination via searchParams.
 * Fetches categories, paginated products, and total count from Supabase.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Category, ProductImage } from '@/lib/types';
import CatalogClient, { type CatalogProduct } from '@/components/catalog/CatalogClient';

export const metadata: Metadata = {
  title: 'Catalog — Nobilitas Ventures',
  description:
    'Browse our full B2B catalog of cleaning, office, hospitality, and industrial supplies. Request a quote from Nobilitas Ventures.',
};

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

// ─── searchParams shape ───────────────────────────────────────────────────────
interface CatalogSearchParams {
  search?:   string;
  category?: string;  // category slug
  page?:     string;
}

interface CatalogPageProps {
  searchParams: Promise<CatalogSearchParams>;
}

// ─── Raw Supabase join shape ──────────────────────────────────────────────────
interface RawCatalogProduct {
  id:             string;
  name:           string;
  slug:           string;
  sku:            string;
  brand:          string;
  description:    string;
  pack_sizes:     string[];
  unit:           string;
  min_order_qty:  number;
  application:    string[];
  status:         'available' | 'on_request' | 'out_of_stock';
  is_featured:    boolean;
  is_new_arrival: boolean;
  certifications: string;
  category_id:    string;
  categories:     { name: string } | null;
  product_images: ProductImage[];
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params       = await searchParams;
  const search       = params.search?.trim() ?? '';
  const categorySlug = params.category?.trim() ?? '';
  const currentPage  = Math.max(1, parseInt(params.page ?? '1', 10));
  const from         = (currentPage - 1) * PAGE_SIZE;
  const to           = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  // ── 1. Categories (for sidebar) ───────────────────────────────────────────
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  const categories: Category[] = categoriesData ?? [];

  // ── 2. Resolve category slug → id (if filter active) ─────────────────────
  let categoryId: string | null = null;
  if (categorySlug) {
    const found = categories.find((c) => c.slug === categorySlug);
    if (!found) {
      // Slug doesn't match any active category → 404
      notFound();
    }
    categoryId = found.id;
  }

  // ── 4. Total count (for pagination) ──────────────────────────────────────
  const countBase = supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'available');

  let countQuery = countBase;
  if (search)     countQuery = countQuery.ilike('name', `%${search}%`);
  if (categoryId) countQuery = countQuery.eq('category_id', categoryId);

  const { count } = await countQuery;
  const totalCount = count ?? 0;

  // ── 5. Paginated products ─────────────────────────────────────────────────
  let productQuery = supabase
    .from('products')
    .select('id,name,slug,sku,brand,description,pack_sizes,unit,min_order_qty,application,status,is_featured,is_new_arrival,certifications,category_id,categories(name),product_images(url,is_primary,display_order)')
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (search)     productQuery = productQuery.ilike('name', `%${search}%`);
  if (categoryId) productQuery = productQuery.eq('category_id', categoryId);

  const { data: productsRaw } = await productQuery;

  // ── 6. Resolve primary image per product ─────────────────────────────────
  const products: CatalogProduct[] = ((productsRaw as RawCatalogProduct[] | null) ?? []).map(
    (p) => {
      const imgs = p.product_images ?? [];
      const primaryImage =
        imgs.find((i) => i.is_primary)?.url ?? imgs[0]?.url ?? null;
      return {
        id:            p.id,
        name:          p.name,
        slug:          p.slug,
        sku:           p.sku,
        brand:         p.brand,
        description:   p.description,
        pack_sizes:    p.pack_sizes,
        unit:          p.unit,
        min_order_qty: p.min_order_qty,
        application:   p.application,
        status:        p.status,
        is_featured:   p.is_featured,
        is_new_arrival:p.is_new_arrival,
        certifications:p.certifications,
        category_id:   p.category_id,
        categories:    p.categories,
        primaryImage,
      };
    }
  );

  return (
    <CatalogClient
      products={products}
      categories={categories}
      totalCount={totalCount}
      currentPage={currentPage}
      initialSearch={search}
      initialCategory={categorySlug}
    />
  );
}
