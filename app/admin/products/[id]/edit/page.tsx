/**
 * Admin: Edit product page — Server Component
 *
 * Fetches the product by id alongside all categories and subcategories.
 * Calls notFound() for an unknown id so Next.js serves the 404 page cleanly
 * rather than rendering a broken form.
 */

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Category, Product, Subcategory } from '@/lib/types';
import EditProductClient from './EditProductClient';

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

// Dynamic title so browser tab reflects the product being edited
export async function generateMetadata({ params }: EditProductPageProps) {
  const { id } = await params;
  return {
    title: `Edit Product — Nobilitas Admin`,
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const supabase = await createClient();
  const { id } = await params;

  // WHY separate fetch: overrideTypes<Product> (scalar) still produces a
  // phantom union type in Supabase JS v2 without codegen. Separating the
  // single-row query and asserting `data as Product | null` is the cleanest
  // type-safe approach without pulling in the entire generated schema.
  const { data: rawProduct, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  // Assert after runtime null-check so downstream code gets a clean Product
  const product = rawProduct as Product | null;

  if (productError || !product) {
    notFound();
  }

  // Fetch reference data in parallel — only after confirming the product exists
  const [
    { data: categories, error: catError },
    { data: subcategories, error: subError },
  ] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name, slug, icon_name, display_order, is_active, created_at')
      .order('display_order', { ascending: true })
      .returns<Category[]>(),
    supabase
      .from('subcategories')
      .select('id, category_id, name, slug, display_order, is_active')
      .order('display_order', { ascending: true })
      .returns<Subcategory[]>(),
  ]);

  if (catError || subError) {
    notFound();
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        padding: '40px 24px',
      }}
    >
      {/* Page title */}
      <div
        style={{
          maxWidth: 896,
          margin: '0 auto',
          marginBottom: 32,
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 26,
            fontWeight: 700,
            color: '#f5f1ea',
            margin: 0,
          }}
        >
          Edit Product
        </h2>
        <p
          style={{
            marginTop: 6,
            fontSize: 13,
            color: '#8a8a8a',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          {product.name}
          <span style={{ color: '#555', marginLeft: 8, fontFamily: 'monospace', fontSize: 11 }}>
            {product.sku || product.slug}
          </span>
        </p>
      </div>

      {/* Form container */}
      <div style={{ maxWidth: 896, margin: '0 auto' }}>
        <EditProductClient
          product={product}
          categories={categories ?? []}
          subcategories={subcategories ?? []}
        />
      </div>
    </div>
  );
}
