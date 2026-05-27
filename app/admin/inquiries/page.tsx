/**
 * Admin: Inquiries list page — Server Component
 *
 * Fetches all inquiries ordered by created_at DESC.
 * The `products(name)` join piggybacks on the product_id FK so we get the
 * linked product name in a single round-trip without a separate query.
 * Data is passed directly to InquiriesClient which owns all interactivity.
 */

import { createClient } from '@/lib/supabase/server';
import { InquiryWithProduct } from '@/lib/types';
import InquiriesClient from './InquiriesClient';

// Always fetch fresh — inquiry statuses change and must not be stale
export const dynamic = 'force-dynamic';

export default async function InquiriesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inquiries')
    // Left-join: products(name) will be null when product_id is null
    .select('*, products(name)')
    .order('created_at', { ascending: false })
    .returns<InquiryWithProduct[]>();

  return (
    <InquiriesClient
      inquiries={data ?? []}
      fetchError={error?.message ?? null}
    />
  );
}
