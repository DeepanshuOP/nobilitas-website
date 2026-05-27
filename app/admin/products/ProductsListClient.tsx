'use client';

/**
 * ProductsListClient — full CRUD table for the admin products list.
 *
 * WHY client component: search debounce, URL mutation via useRouter,
 * optimistic delete, and delete-confirm modal all require browser APIs
 * and React state that can't live in a Server Component.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Upload, ImageOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Category, ProductStatus, ProductWithCategory } from '@/lib/types';

// ─── Design token map ─────────────────────────────────────────────────────────
// Centralised here so every sub-component gets the same reference rather than
// repeating literal strings — makes future theming a single-point change.
const T = {
  bg: '#0f0f0f',
  surface: '#161616',
  elevated: '#1c1c1c',
  border: 'rgba(245,241,234,0.08)',
  borderGold: 'rgba(201,169,110,0.28)',
  fg1: '#f5f1ea',
  fg2: '#c9c0a8',
  fg3: '#8a8a8a',
  gold: '#c9a96e',
  serif: "'Playfair Display', Georgia, serif",
  sans: "'Inter', system-ui, sans-serif",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductsListClientProps {
  products: ProductWithCategory[];
  categories: Category[];
  fetchError: string | null;
  initialSearch: string;
  initialCategory: string;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_CFG: Record<
  ProductStatus,
  { label: string; color: string; bg: string }
> = {
  available: {
    label: 'Available',
    color: '#4a7c59',
    bg: 'rgba(74,124,89,0.15)',
  },
  on_request: {
    label: 'On Request',
    color: '#b8893f',
    bg: 'rgba(184,137,63,0.15)',
  },
  out_of_stock: {
    label: 'Out of Stock',
    color: '#a1352a',
    bg: 'rgba(161,53,42,0.15)',
  },
};

function StatusBadge({ status }: { status: ProductStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 9999,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
        color: cfg.color,
        backgroundColor: cfg.bg,
      }}
    >
      {cfg.label}
    </span>
  );
}

// ─── Boolean dot indicator ────────────────────────────────────────────────────

function BoolDot({ value }: { value: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: value ? T.gold : 'rgba(245,241,234,0.12)',
      }}
    />
  );
}

// ─── Table row (isolated so hover state doesn't re-render the whole list) ────

interface ProductRowProps {
  product: ProductWithCategory;
  onEdit: () => void;
  onDelete: () => void;
}

function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
  const [hovered, setHovered] = useState(false);

  const categoryName = product.categories?.name ?? '—';

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: `1px solid ${
          hovered ? T.borderGold : T.border
        }`,
        transition: 'border-color 240ms ease',
        backgroundColor: hovered ? 'rgba(201,169,110,0.025)' : 'transparent',
      }}
    >
      {/* Image Thumbnail */}
      <td style={{ padding: '14px 20px', width: 40, minWidth: 40 }}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{
              width: 40,
              height: 40,
              objectFit: 'cover',
              borderRadius: 6,
              border: '1px solid rgba(245,241,234,0.08)',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 6,
              backgroundColor: '#1c1c1c',
              border: '1px solid rgba(245,241,234,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: T.fg3,
            }}
          >
            <ImageOff size={16} />
          </div>
        )}
      </td>

      {/* Name */}
      <td style={{ padding: '14px 20px', color: T.fg1, fontWeight: 500, maxWidth: 200 }}>
        <span
          style={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={product.name}
        >
          {product.name}
        </span>
      </td>

      {/* SKU */}
      <td
        style={{
          padding: '14px 20px',
          color: T.fg3,
          fontFamily: 'monospace',
          fontSize: 12,
          whiteSpace: 'nowrap',
        }}
      >
        {product.sku || '—'}
      </td>

      {/* Category */}
      <td style={{ padding: '14px 20px', color: T.fg2, whiteSpace: 'nowrap' }}>
        {categoryName}
      </td>

      {/* Brand */}
      <td style={{ padding: '14px 20px', color: T.fg2, whiteSpace: 'nowrap' }}>
        {product.brand || '—'}
      </td>

      {/* Status */}
      <td style={{ padding: '14px 20px' }}>
        <StatusBadge status={product.status} />
      </td>

      {/* Featured */}
      <td style={{ padding: '14px 20px', textAlign: 'center' }}>
        <BoolDot value={product.is_featured} />
      </td>

      {/* New Arrival */}
      <td style={{ padding: '14px 20px', textAlign: 'center' }}>
        <BoolDot value={product.is_new_arrival} />
      </td>

      {/* Actions */}
      <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button
            id={`edit-product-${product.id}`}
            onClick={onEdit}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: 13,
              color: T.gold,
              cursor: 'pointer',
              fontFamily: T.sans,
            }}
          >
            Edit
          </button>
          <button
            id={`delete-product-${product.id}`}
            onClick={onDelete}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: 13,
              color: '#a1352a',
              cursor: 'pointer',
              fontFamily: T.sans,
            }}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProductsListClient({
  products: initialProducts,
  categories,
  fetchError,
  initialSearch,
  initialCategory,
}: ProductsListClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Local copy — mutated optimistically on delete
  const [products, setProducts] = useState<ProductWithCategory[]>(initialProducts);
  const [searchValue, setSearchValue] = useState(initialSearch);

  // Delete dialog state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Debounce timer ref — stored outside render to survive re-renders
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local list when the server re-renders with new data (URL change)
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // ── URL helpers ────────────────────────────────────────────────────────────

  const buildUrl = useCallback(
    (updates: Partial<Record<'search' | 'category', string>>) => {
      const params = new URLSearchParams(searchParams.toString());
      (Object.entries(updates) as [string, string][]).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams]
  );

  // ── Search — 300 ms debounce ───────────────────────────────────────────────

  function handleSearchChange(value: string) {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.push(
        buildUrl({
          search: value,
          category: searchParams.get('category') ?? '',
        })
      );
    }, 300);
  }

  // ── Category filter — immediate ────────────────────────────────────────────

  function handleCategoryChange(value: string) {
    router.push(buildUrl({ category: value, search: searchValue }));
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  async function handleConfirmDelete() {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    setDeleteError(null);

    // Optimistic: remove from UI immediately
    const snapshot = [...products];
    setProducts((prev) => prev.filter((p) => p.id !== deleteTargetId));

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', deleteTargetId);

    setIsDeleting(false);

    if (error) {
      // Revert on failure and surface the message
      setProducts(snapshot);
      setDeleteError(error.message);
    } else {
      setDeleteTargetId(null);
    }
  }

  // Escape closes the confirm dialog
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setDeleteTargetId(null);
        setDeleteError(null);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: '100vh',
        background: T.bg,
        padding: '32px 24px',
        fontFamily: T.sans,
      }}
    >
      {/* ── Page header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 32,
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: T.serif,
              fontSize: 30,
              fontWeight: 700,
              color: T.fg1,
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Products
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: T.fg3 }}>
            Manage the B2B product catalog. {products.length} item
            {products.length !== 1 ? 's' : ''}.
          </p>
        </div>

        {/* Action buttons — Import CSV (secondary) + Add Product (primary) */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
          <button
            id="import-csv-btn"
            onClick={() => router.push('/admin/products/import')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              background: 'transparent',
              border: `1px solid ${T.borderGold}`,
              borderRadius: 6,
              padding: '10px 18px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: T.gold,
              cursor: 'pointer',
              fontFamily: T.sans,
              transition: 'background 180ms',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(201,169,110,0.08)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
          >
            <Upload size={16} strokeWidth={2} />
            Import CSV
          </button>

          <button
            id="add-product-btn"
            onClick={() => router.push('/admin/products/new')}
            style={{
              background: T.gold,
              color: '#0f0f0f',
              border: 'none',
              borderRadius: 6,
              padding: '10px 20px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: T.sans,
              flexShrink: 0,
            }}
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* ── Fetch error banner ── */}
      {fetchError && (
        <div
          style={{
            marginBottom: 24,
            padding: '12px 16px',
            borderRadius: 8,
            border: `1px solid ${T.borderGold}`,
            background: 'rgba(201,169,110,0.06)',
            color: T.gold,
            fontSize: 13,
          }}
        >
          Could not load data: {fetchError}
        </div>
      )}

      {/* ── Filter row ── */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <input
          id="products-search-input"
          type="text"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search name, brand, SKU…"
          style={{
            flex: '1 1 260px',
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 6,
            padding: '9px 14px',
            fontSize: 13,
            color: T.fg1,
            fontFamily: T.sans,
            outline: 'none',
            // Focus ring via onFocus/onBlur to avoid CSS injection
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = T.borderGold)
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = T.border)
          }
        />

        {/* Category select */}
        <select
          id="products-category-filter"
          value={searchParams.get('category') ?? ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          style={{
            flex: '0 1 220px',
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 6,
            padding: '9px 14px',
            fontSize: 13,
            color: T.fg2,
            fontFamily: T.sans,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* ── Table ── */}
      <div
        style={{
          overflowX: 'auto',
          borderRadius: 8,
          border: `1px solid ${T.border}`,
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: 13,
            fontFamily: T.sans,
          }}
        >
          <thead>
            <tr
              style={{
                background: T.surface,
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              {[
                '',
                'Name',
                'SKU',
                'Category',
                'Brand',
                'Status',
                'Featured',
                'New',
                'Actions',
              ].map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: '14px 20px',
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: T.fg3,
                    whiteSpace: 'nowrap',
                    fontFamily: T.sans,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    padding: '64px 20px',
                    textAlign: 'center',
                    color: T.fg3,
                    fontSize: 13,
                  }}
                >
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={() =>
                    router.push(`/admin/products/${product.id}/edit`)
                  }
                  onDelete={() => {
                    setDeleteError(null);
                    setDeleteTargetId(product.id);
                  }}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Delete confirmation dialog ── */}
      {deleteTargetId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDeleteTargetId(null);
              setDeleteError(null);
            }
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 400,
              background: T.elevated,
              border: '1px solid rgba(161,53,42,0.35)',
              borderRadius: 12,
              padding: 32,
              fontFamily: T.sans,
            }}
          >
            <h3
              style={{
                fontFamily: T.serif,
                fontSize: 18,
                fontWeight: 700,
                color: T.fg1,
                margin: '0 0 8px',
              }}
            >
              Delete Product?
            </h3>
            <p
              style={{
                fontSize: 13,
                color: T.fg3,
                margin: '0 0 20px',
                lineHeight: 1.6,
              }}
            >
              This is permanent. Any buyer inquiries linked to this product
              will lose their product reference.
            </p>

            {deleteError && (
              <p
                style={{
                  fontSize: 12,
                  color: '#e57373',
                  margin: '0 0 12px',
                }}
              >
                {deleteError}
              </p>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                id="confirm-delete-product-btn"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                style={{
                  flex: 1,
                  background: '#a1352a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 0',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  opacity: isDeleting ? 0.5 : 1,
                  fontFamily: T.sans,
                  transition: 'opacity 180ms',
                }}
              >
                {isDeleting ? 'Deleting…' : 'Yes, Delete'}
              </button>

              <button
                onClick={() => {
                  setDeleteTargetId(null);
                  setDeleteError(null);
                }}
                style={{
                  borderRadius: 6,
                  padding: '10px 20px',
                  fontSize: 13,
                  color: T.fg3,
                  background: 'transparent',
                  border: `1px solid ${T.border}`,
                  cursor: 'pointer',
                  fontFamily: T.sans,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
