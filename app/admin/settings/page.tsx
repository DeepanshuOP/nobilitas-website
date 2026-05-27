/**
 * Admin: Settings page — Server Component
 *
 * Fetches every row from the `settings` table and transforms the array into
 * a plain Record<string, string> (key → value) before passing it down.
 * This keeps the client component free of raw Supabase row shapes and lets
 * react-hook-form default values be expressed as a simple object literal.
 */

import { createClient } from '@/lib/supabase/server';
import { Setting } from '@/lib/types';
import SettingsClient from './SettingsClient';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .returns<Setting[]>();

  // Transform rows → key/value map so the client receives typed defaults
  const settingsMap: Record<string, string> = {};
  for (const row of data ?? []) {
    settingsMap[row.key] = row.value;
  }

  return (
    <SettingsClient
      initialValues={settingsMap}
      fetchError={error?.message ?? null}
    />
  );
}
