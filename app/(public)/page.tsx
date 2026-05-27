/**
 * Home page — Server Component.
 * Fetches categories and featured products from Supabase, then passes
 * them to the animated HomeClient for rendering.
 */
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import HomeClient, { type FeaturedProduct } from '@/components/home/HomeClient';
import type { Category, ProductImage } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Nobilitas Ventures — B2B Supplies, Jaipur',
  description:
    'A single trusted source for cleaning, office, hospitality, and industrial supplies. ' +
    'Request a quote from Nobilitas Ventures, Jaipur.',
};

// ─── Supabase join shape for the products query ───────────────────────────────
interface RawFeaturedProduct {
  id:             string;
  name:           string;
  slug:           string;
  categories:     { name: string } | null;
  product_images: ProductImage[];
}

export default async function HomePage() {
  const supabase = await createClient();

  // 1. Fetch active categories ordered by display_order
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  const categories: Category[] = categoriesData ?? [];

  // 2. Fetch featured products with category name + product images
  const { data: productsData } = await supabase
    .from('products')
    .select('id, name, slug, categories(name), product_images(url, is_primary, display_order)')
    .eq('is_featured', true)
    .eq('status', 'available')
    .limit(8);

  // Resolve primary image URL per product
  const featuredProducts: FeaturedProduct[] = (
    (productsData as RawFeaturedProduct[] | null) ?? []
  ).map((product) => {
    const images = product.product_images ?? [];
    // Prefer is_primary flag, fall back to first image, then null
    const primaryImage =
      images.find((img) => img.is_primary)?.url ??
      images[0]?.url ??
      null;

    return {
      id:           product.id,
      name:         product.name,
      slug:         product.slug,
      categories:   product.categories,
      primaryImage,
    };
  });

  return (
    <HomeClient
      categories={categories}
      featuredProducts={featuredProducts}
    />
  );
}
