'use client';
/**
 * ProductDetailClient — stub component.
 * Full implementation pending. Satisfies the type import in products/[slug]/page.tsx.
 */
import type { ProductImage } from '@/lib/types';

// WHY: We export these types so the server page can shape its props.
export interface DetailProduct {
  id:             string;
  name:           string;
  slug:           string;
  sku:            string;
  brand:          string;
  description:    string;
  pack_sizes:     string[];
  unit:           string;
  min_order_qty:  number;
  application:    string[];
  status:         'available' | 'on_request' | 'out_of_stock';
  is_featured:    boolean;
  is_new_arrival: boolean;
  certifications: string;
  notes:          string;
  category_id:    string;
  subcategory_id: string | null;
  categories:     { name: string; slug: string } | null;
}

export interface RelatedProduct {
  id:           string;
  name:         string;
  slug:         string;
  brand:        string;
  category_id:  string;
  status:       'available' | 'on_request' | 'out_of_stock';
  categories:   { name: string } | null;
  primaryImage: string | null;
}

interface Props {
  product:         DetailProduct;
  images:          ProductImage[];
  relatedProducts: RelatedProduct[];
}

export default function ProductDetailClient({ product }: Props) {
  return (
    <main style={{ padding: 'clamp(120px,12vw,160px) 0 80px', minHeight: '60vh' }}>
      <div className="container">
        <p className="eyebrow" style={{ marginBottom: '24px' }}>
          <span className="num">// product</span>&nbsp; detail
        </p>
        <h1 className="h-section" style={{ marginBottom: '24px' }}>{product.name}</h1>
        <p className="lede">{product.description}</p>
      </div>
    </main>
  );
}
