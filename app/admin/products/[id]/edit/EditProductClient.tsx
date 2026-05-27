'use client';

/**
 * EditProductClient — thin client shell for the "Edit product" page.
 *
 * WHY a separate client wrapper: ProductForm's onSuccess prop is a function
 * and cannot be serialised across the Server→Client boundary in Next.js 14.
 * This wrapper owns the callback; the Server Component parent handles fetching.
 */

import { useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import type { Category, Product, Subcategory } from '@/lib/types';

interface EditProductClientProps {
  product: Product;
  categories: Category[];
  subcategories: Subcategory[];
}

export default function EditProductClient({
  product,
  categories,
  subcategories,
}: EditProductClientProps) {
  const router = useRouter();

  return (
    <ProductForm
      initialData={product}
      productId={product.id}
      categories={categories}
      subcategories={subcategories}
      onSuccess={() => router.push('/admin/products')}
    />
  );
}
