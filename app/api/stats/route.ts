import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const [products, categories] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true })
      .neq('status', 'out_of_stock'),
    supabase.from('categories').select('id', { count: 'exact', head: true })
      .eq('is_active', true),
  ])
  return NextResponse.json({
    productCount: products.count ?? 0,
    categoryCount: categories.count ?? 0,
  })
}
