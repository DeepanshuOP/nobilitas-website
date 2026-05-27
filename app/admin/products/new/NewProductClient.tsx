'use client';

/**
 * NewProductClient — thin client shell for the "Add product" page.
 *
 * WHY a separate client wrapper: ProductForm's onSuccess prop is a function,
 * which cannot be serialised and passed from a Server Component. This wrapper
 * owns the callback and receives the already-fetched data as serialisable props.
 */

import { useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import type { Category, Subcategory } from '@/lib/types';

interface NewProductClientProps {
  categories: Category[];
  subcategories: Subcategory[];
}

export default function NewProductClient({
  categories,
  subcategories,
}: NewProductClientProps) {
  const router = useRouter();

  return (
    <ProductForm
      categories={categories}
      subcategories={subcategories}
      onSuccess={() => router.push('/admin/products')}
    />
  );
}
