/**
 * Product detail page — Server Component.
 * Fetches one product by slug, its images (sorted primary-first),
 * and up to 4 related products from the same category.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { ProductImage } from '@/lib/types';
import ProductDetailClient, {
  type DetailProduct,
  type RelatedProduct,
} from '@/components/catalog/ProductDetailClient';

// ─── Raw Supabase shapes ──────────────────────────────────────────────────────
interface RawProduct {
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
  image_url:      string | null;
  certifications: string;
  notes:          string;
  category_id:    string;
  subcategory_id: string | null;
  categories:     { name: string; slug: string } | null;
  created_at:     string;
  updated_at:     string;
}

interface RawRelatedProduct {
  id:             string;
  name:           string;
  slug:           string;
  brand:          string;
  category_id:    string;
  status:         'available' | 'on_request' | 'out_of_stock';
  categories:     { name: string } | null;
  product_images: Pick<ProductImage, 'url' | 'is_primary'>[];
}

// ─── generateMetadata ─────────────────────────────────────────────────────────
interface PageParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const supabase  = await createClient();
  const { data }  = await supabase
    .from('products')
    .select('name, description')
    .eq('slug', slug)
    .single();

  if (!data) return { title: 'Product not found' };

  return {
    title:       `${data.name} — Nobilitas Ventures`,
    description: data.description?.slice(0, 160) || `Request a quote for ${data.name} from Nobilitas Ventures.`,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ProductDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const supabase = await createClient();

  // ── 1. Product + category ─────────────────────────────────────────────────
  const { data: productRaw, error: productError } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .single<RawProduct>();

  if (productError || !productRaw) notFound();

  // ── 2. Images sorted primary-first ───────────────────────────────────────
  const { data: imagesRaw } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productRaw.id)
    .order('display_order');

  const rawImages = (imagesRaw as ProductImage[] | null) ?? [];
  // Sort: primary flag first, then display_order
  const images = [
    ...rawImages.filter((i) => i.is_primary),
    ...rawImages.filter((i) => !i.is_primary),
  ];

  // ── 3. Related products ───────────────────────────────────────────────────
  const { data: relatedRaw } = await supabase
    .from('products')
    .select('id, name, slug, brand, category_id, status, categories(name), product_images(url, is_primary)')
    .eq('category_id', productRaw.category_id)
    .neq('id', productRaw.id)
    .limit(4);

  const relatedProducts: RelatedProduct[] = (
    (relatedRaw as RawRelatedProduct[] | null) ?? []
  ).map((r) => {
    const imgs = r.product_images ?? [];
    const primaryImage = imgs.find((i) => i.is_primary)?.url ?? imgs[0]?.url ?? null;
    return {
      id:           r.id,
      name:         r.name,
      slug:         r.slug,
      brand:        r.brand,
      category_id:  r.category_id,
      status:       r.status,
      categories:   r.categories,
      primaryImage,
    };
  });

  // ── 4. Shape DetailProduct ─────────────────────────────────────────────────
  const product: DetailProduct = {
    id:             productRaw.id,
    name:           productRaw.name,
    slug:           productRaw.slug,
    sku:            productRaw.sku,
    brand:          productRaw.brand,
    description:    productRaw.description,
    pack_sizes:     productRaw.pack_sizes,
    unit:           productRaw.unit,
    min_order_qty:  productRaw.min_order_qty,
    application:    productRaw.application,
    status:         productRaw.status,
    is_featured:    productRaw.is_featured,
    is_new_arrival: productRaw.is_new_arrival,
    certifications: productRaw.certifications,
    notes:          productRaw.notes,
    category_id:    productRaw.category_id,
    subcategory_id: productRaw.subcategory_id,
    categories:     productRaw.categories,
  };

  return (
    <ProductDetailClient
      product={product}
      images={images}
      relatedProducts={relatedProducts}
    />
  );
}
