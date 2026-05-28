import { createClient } from '@/lib/supabase/server';
import { ProductWithCategory } from '@/lib/types';
import Link from 'next/link';
import ProductDetailClient from './ProductDetailClient';
import styles from './page.module.css';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient();
  const { slug } = await params;

  const { data: product, error } = await supabase
    .from('products')
    .select('*, categories(name, slug, icon_name)')
    .eq('slug', slug)
    .single();

  if (error || !product) {
    return (
      <div className={styles.notFound}>
        <h2>Product not found</h2>
        <Link href="/catalog" className="btn btn--outline-dark">
          Browse the full catalog →
        </Link>
      </div>
    );
  }

  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*, categories(name, slug, icon_name)')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .neq('status', 'out_of_stock')
    .limit(3)
    .returns<ProductWithCategory[]>();

  const { data: productImages } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', product.id)
    .order('display_order', { ascending: true })
    .returns<import('@/lib/types').ProductImage[]>();

  // Use product_images if available, fall back to image_url
  const images: string[] = productImages && productImages.length > 0
    ? productImages.map(img => img.url)
    : product.image_url
    ? [product.image_url]
    : [];

  return (
    <ProductDetailClient
      product={product as ProductWithCategory}
      relatedProducts={relatedProducts || []}
      images={images}
    />
  );
}
// NOTE: Run supabase/migrations/002_product_images.sql in your
// Supabase SQL editor if you haven't already.
