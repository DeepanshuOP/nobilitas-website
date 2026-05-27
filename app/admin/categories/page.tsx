/**
 * Admin: Categories page — Server Component
 * Fetches all categories ordered by display_order ASC and delegates
 * rendering to CategoriesClient so the table/CRUD UI stays interactive.
 */

import { createClient } from '@/lib/supabase/server';
import { Category } from '@/lib/types';
import CategoriesClient from './CategoriesClient';

// Opt out of static generation — data must always reflect the live DB.
export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })
    .returns<Category[]>();

  // Surface the error to the client component so it can render a
  // user-facing message without crashing the entire page.
  if (error) {
    return (
      <CategoriesClient
        initialCategories={[]}
        fetchError={error.message}
      />
    );
  }

  return (
    <CategoriesClient
      initialCategories={data ?? []}
      fetchError={null}
    />
  );
}
