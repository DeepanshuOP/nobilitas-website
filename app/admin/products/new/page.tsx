/**
 * Admin: Add product page — Server Component
 *
 * Fetches categories and subcategories from Supabase, then renders the
 * shared ProductForm inside a max-w-4xl container via a thin client wrapper
 * (NewProductClient) that owns the onSuccess navigation callback.
 */

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Category, Subcategory } from '@/lib/types';
import NewProductClient from './NewProductClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Add Product — Nobilitas Admin',
};

export default async function NewProductPage() {
  const supabase = await createClient();

  const [{ data: categories, error: catError }, { data: subcategories, error: subError }] =
    await Promise.all([
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

  // If either lookup fails completely we can't render a useful form
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
      {/* Page title — h2 so it doesn't conflict with any layout h1 */}
      <div
        style={{
          maxWidth: 896, // max-w-4xl ≈ 896px
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
          Add Product
        </h2>
        <p
          style={{
            marginTop: 6,
            fontSize: 13,
            color: '#8a8a8a',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          New product will appear in the catalog once saved.
        </p>
      </div>

      {/* Form container */}
      <div style={{ maxWidth: 896, margin: '0 auto' }}>
        <NewProductClient
          categories={categories ?? []}
          subcategories={subcategories ?? []}
        />
      </div>
    </div>
  );
}
