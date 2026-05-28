import { createClient } from '@/lib/supabase/server'

export interface SiteStats {
  productCount: number      // total active products
  categoryCount: number     // total active categories  
  featuredCount: number     // products with is_featured = true
}

export async function getSiteStats(): Promise<SiteStats> {
  const supabase = await createClient()

  const [productsResult, categoriesResult] = await Promise.all([
    supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .neq('status', 'out_of_stock'),
    supabase
      .from('categories')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),
  ])

  return {
    productCount: productsResult.count ?? 0,
    categoryCount: categoriesResult.count ?? 0,
    featuredCount: 0,
  }
}

// Format helpers
export function formatProductCount(n: number): string {
  if (n === 0) return 'Products'
  if (n < 100) return `${n}`
  // Round down to nearest 100 and add +
  const rounded = Math.floor(n / 100) * 100
  return `${rounded.toLocaleString()}+`
}

export function formatCategoryCount(n: number): string {
  return `${n}`
}
