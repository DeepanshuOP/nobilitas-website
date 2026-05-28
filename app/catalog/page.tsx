import { createClient } from '@/lib/supabase/server';
import CatalogClient from './CatalogClient';
import { ProductWithCategory } from '@/lib/types';
import Link from 'next/link';
import styles from './catalog.module.css';

export default async function CatalogPage() {
  const supabase = await createClient();

  const [categoriesResponse, productsResponse] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true }),
    supabase
      .from('products')
      .select('*, categories(name, icon_name, slug)')
      .neq('status', 'out_of_stock')
      .order('created_at', { ascending: false })
      .returns<ProductWithCategory[]>(),
  ]);

  if (categoriesResponse.error || productsResponse.error) {
    return (
      <div style={{ padding: '160px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
        <h2 className="h-display">Unable to load catalog</h2>
        <p className="lede">Please try again later.</p>
        <Link href="/catalog" className="btn btn--outline-dark">
          Refresh
        </Link>
      </div>
    );
  }

  const productCount = productsResponse.data?.length ?? 0;
  const categoryCount = categoriesResponse.data?.length ?? 0;

  return <CatalogClient products={productsResponse.data} categories={categoriesResponse.data} productCount={productCount} categoryCount={categoryCount} />;
}
