/**
 * /products → redirects to /catalog (canonical B2B catalog URL).
 * This page is kept for backwards-compatible links only.
 */
import { redirect } from 'next/navigation';

interface ProductsPageProps {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}

export default async function ProductsRedirectPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (params.search)   qs.set('search',   params.search);
  if (params.category) qs.set('category', params.category);
  if (params.page)     qs.set('page',     params.page);

  const query = qs.toString();
  redirect(`/catalog${query ? `?${query}` : ''}`);
}
