/**
 * Product detail placeholder page — /catalog/[id]
 * Resolves the product from the static ALL_PRODUCTS list.
 * Shows product name, meta, and a "Request a quote" WhatsApp button.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MessageCircle } from 'lucide-react';

// ─── Shared static product list (duplicated to avoid client bundle in RSC) ────
const PRODUCT_NAMES: Record<string, { name: string; category: string; meta: string }> = {
  f01:  { name: 'Executive conference table — walnut',     category: 'Furniture',   meta: '8 sizes · Godrej Interio'       },
  f02:  { name: 'Ergonomic task chair — mesh back',        category: 'Furniture',   meta: '5 colorways · BIFMA tested'     },
  f03:  { name: 'Modular workstation — 6-person cluster',  category: 'Furniture',   meta: 'Custom dimensions'              },
  c01:  { name: 'Industrial floor scrubber — 60L',         category: 'Cleaning',    meta: 'ISI · 3 capacities'             },
  c02:  { name: 'Diversey Suma D1.1 — degreaser',          category: 'Cleaning',    meta: '5L · 25L · 200L drums'          },
  c03:  { name: 'Housekeeping cart — twin-bin',            category: 'Cleaning',    meta: 'Stainless · galvanised'         },
  e01:  { name: '27″ 4K monitor — IPS panel',              category: 'Electronics', meta: 'Dell · HP · LG variants'        },
  e02:  { name: 'Multifunction printer A3 — laser',        category: 'Electronics', meta: 'Canon · Xerox'                  },
  l01:  { name: 'Architectural pendant — antique brass',   category: 'Lighting',    meta: '12 finishes · custom'           },
  l02:  { name: 'LED panel — 600×600 recessed',            category: 'Lighting',    meta: '30W · 40W · 50W'                },
  s01:  { name: 'Safety helmet — ISI Type-A',              category: 'Safety',      meta: 'Bulk pricing 100+ units'        },
  s02:  { name: 'High-visibility vest — Class 2',          category: 'Safety',      meta: '5 sizes · custom branding'      },
  p01:  { name: 'Corrugated boxes — 3-ply 5-ply',          category: 'Packaging',   meta: 'Custom sizes · bulk MOQ 500'    },
  n01:  { name: 'Commercial espresso machine — 2-group',   category: 'Pantry',      meta: 'La Marzocco · Faema'            },
  n02:  { name: 'Pantry refill — tea, coffee, sugar',      category: 'Pantry',      meta: 'Monthly subscription'           },
  g01:  { name: 'Diwali hamper — Mehfil',                  category: 'Gifting',     meta: 'Custom 24-piece sets'           },
  g02:  { name: 'Onboarding kit — welcome box',            category: 'Gifting',     meta: 'Branded · 4-piece'              },
  m01:  { name: 'Hotel mattress — King 6-zone',            category: 'Mattress',    meta: 'Sleepwell · Kurl-on'            },
  b01:  { name: 'Electric buggy — 6-seater',               category: 'Buggies',     meta: 'Lithium · 80km range'           },
  w01:  { name: 'Cat 6A LAN cable — 305m roll',            category: 'Cables',      meta: 'Shielded · plenum'              },
  a01:  { name: 'Conference room speaker — Dante',          category: 'Audio',       meta: 'Shure · Sennheiser'             },
  pa01: { name: 'Letterhead — 100 GSM bond',               category: 'Paper',       meta: 'Min 500 sheets'                 },
};

// ─── Dynamic metadata ─────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCT_NAMES[id];
  if (!product) return { title: 'Product not found' };
  return {
    title: `${product.name} — Nobilitas Ventures`,
    description: `Inquire about ${product.name} (${product.category}). ${product.meta}. Available on inquiry from Nobilitas Ventures, Jaipur.`,
  };
}

// ─── Design tokens (inline) ───────────────────────────────────────────────────
const T = {
  bg:        '#0f0f0f',
  bgSurface: '#161616',
  bgInset:   '#1c1c1c',
  fg1:       '#f5f1ea',
  fg2:       '#c9c0a8',
  fg3:       '#8a8a8a',
  gold:      '#c9a96e',
  goldSoft:  'rgba(201,169,110,0.28)',
  border1:   'rgba(245,241,234,0.06)',
  borderGold:'rgba(201,169,110,0.18)',
  ease:      'cubic-bezier(0.22,1,0.36,1)',
  fontSerif: "'Playfair Display', Georgia, serif",
  fontSans:  "'Inter', system-ui, sans-serif",
} as const;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = PRODUCT_NAMES[id];

  // Unknown ID → graceful fallback (not hard 404)
  if (!product) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '24px',
        padding: '0 clamp(20px,4vw,48px)',
      }}>
        <p style={{ fontFamily: T.fontSans, color: T.fg3, fontSize: '15px' }}>
          Product not found.
        </p>
        <Link href="/catalog" style={{
          fontFamily: T.fontSans, fontWeight: 500, fontSize: '14px',
          color: T.gold, textDecoration: 'none',
        }}>
          ← Back to catalog
        </Link>
      </div>
    );
  }

  const waText = encodeURIComponent(
    `Hi, I'd like to inquire about: ${product.name} (${product.meta}). Please share pricing and availability.`
  );

  return (
    <div style={{
      padding: 'clamp(48px,6vw,96px) clamp(20px,4vw,48px)',
      maxWidth: '960px', margin: '0 auto',
    }}>
      {/* Back link */}
      <Link href="/catalog" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontFamily: T.fontSans, fontWeight: 500, fontSize: '13px',
        color: T.fg3, textDecoration: 'none', marginBottom: '48px',
      }}>
        <ArrowLeft size={14} strokeWidth={1.4} /> Back to catalog
      </Link>

      {/* Category eyebrow */}
      <p style={{
        fontFamily: T.fontSans, fontWeight: 500, fontSize: '11px',
        letterSpacing: '0.22em', textTransform: 'uppercase', color: T.gold, marginBottom: '16px',
      }}>{product.category}</p>

      {/* Product name */}
      <h1 style={{
        fontFamily: T.fontSerif, fontWeight: 400,
        fontSize: 'clamp(36px,5vw,60px)', lineHeight: 1.05,
        letterSpacing: '-0.02em', color: T.fg1, margin: '0 0 20px',
      }}>{product.name}</h1>

      {/* Meta */}
      <p style={{
        fontFamily: T.fontSans, fontWeight: 400, fontSize: '16px',
        color: T.fg2, margin: '0 0 40px',
      }}>{product.meta}</p>

      {/* Image placeholder */}
      <div style={{
        width: '100%', aspectRatio: '2.2',
        background: 'linear-gradient(135deg,#1c1c1c 0%,#242424 50%,#181818 100%)',
        borderRadius: '8px', marginBottom: '48px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${T.border1}`,
      }}>
        <p style={{
          fontFamily: T.fontSans, fontWeight: 500, fontSize: '11px',
          letterSpacing: '0.22em', textTransform: 'uppercase', color: T.fg3,
        }}>
          Images available on request
        </p>
      </div>

      {/* Availability notice */}
      <div style={{
        background: T.bgSurface, border: `1px solid ${T.borderGold}`,
        borderRadius: '8px', padding: '28px 32px', marginBottom: '32px',
      }}>
        <p style={{
          fontFamily: T.fontSans, fontWeight: 500, fontSize: '11px',
          letterSpacing: '0.22em', textTransform: 'uppercase', color: T.gold,
          marginBottom: '8px',
        }}>Available on inquiry</p>
        <p style={{
          fontFamily: T.fontSans, fontWeight: 300, fontSize: '15px',
          lineHeight: 1.7, color: T.fg2, margin: 0,
        }}>
          Pricing, lead time, and pack sizes are shared directly with buyers.
          WhatsApp us your requirement and we&apos;ll respond within four hours.
        </p>
      </div>

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <a
          id="product-whatsapp-btn"
          href={`https://wa.me/911414019200?text=${waText}`}
          target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: '#25d366', color: '#fff',
            fontFamily: T.fontSans, fontWeight: 500, fontSize: '15px',
            padding: '14px 32px', borderRadius: '4px', textDecoration: 'none',
          }}
        >
          <MessageCircle size={18} strokeWidth={1.4} />
          Request a quote
        </a>
        <Link href="/catalog" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          fontFamily: T.fontSans, fontWeight: 500, fontSize: '15px',
          color: T.gold, border: `1px solid ${T.goldSoft}`,
          padding: '14px 32px', borderRadius: '4px', textDecoration: 'none',
        }}>
          Browse more products
        </Link>
      </div>
    </div>
  );
}
