'use client';

/**
 * HomeClient — animated public home page.
 * Receives server-fetched categories + featuredProducts.
 * All 8 sections: Hero → CapabilityBar → Categories → WhyNobilitas
 *                 → FeaturedProducts → ClientWall → PullQuote → CTA
 */

import { useEffect, useRef, useState, CSSProperties } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  MessageCircle,
  // category icons
  Sparkles,
  Armchair,
  Monitor,
  FileText,
  Lamp,
  HardHat,
  Package,
  Coffee,
  Bed,
  CarFront,
  Cable,
  Speaker,
  Gift,
} from 'lucide-react';
import type { Category } from '@/lib/types';

// ─── Design tokens (dark palette) ────────────────────────────────────────────
const T = {
  bg:         '#0f0f0f',
  bgDark:     '#0a0a0a',
  bgSurface:  '#161616',
  bgInset:    '#1c1c1c',
  fg1:        '#f5f1ea',
  fg2:        '#c9c0a8',
  fg3:        '#8a8a8a',
  dim:        '#6b6b6b',
  gold:       '#c9a96e',
  goldHover:  '#b89656',
  goldSoft:   'rgba(201,169,110,0.28)',
  goldBg:     'rgba(201,169,110,0.08)',
  border1:    'rgba(245,241,234,0.06)',
  border1Med: 'rgba(245,241,234,0.08)',
  borderGold: 'rgba(201,169,110,0.18)',
  ease:       'cubic-bezier(0.22,1,0.36,1)',
  fontSerif:  "'Playfair Display', Georgia, serif",
  fontSans:   "'Inter', system-ui, sans-serif",
  fontMono:   "'JetBrains Mono', monospace",
} as const;

// ─── Jali SVG (inline) ───────────────────────────────────────────────────────
const JALI = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cpath d='M60 0L120 60L60 120L0 60Z' fill='none' stroke='%23c9a96e' stroke-width='0.5'/%3E%3Cpath d='M0 0L60 60L0 120' fill='none' stroke='%23c9a96e' stroke-width='0.5'/%3E%3Cpath d='M120 0L60 60L120 120' fill='none' stroke='%23c9a96e' stroke-width='0.5'/%3E%3C/svg%3E`;

// ─── Reveal (IntersectionObserver fade-up) ───────────────────────────────────
interface RevealProps { children: React.ReactNode; delay?: number; style?: CSSProperties; }

function Reveal({ children, delay = 0, style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity:    vis ? 1 : 0,
      transform:  vis ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Eyebrow ──────────────────────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: T.fontSans, fontWeight: 500, fontSize: '11px',
      letterSpacing: '0.22em', textTransform: 'uppercase', color: T.gold, margin: 0,
    }}>
      {children}
    </p>
  );
}

// ─── Ornament divider ─────────────────────────────────────────────────────────
function Ornament({ width = 200 }: { width?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width, margin: '0 auto' }}>
      <div style={{ flex: 1, height: '1px', background: T.gold, opacity: 0.4 }} />
      <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden>
        <polygon points="4,0 8,4 4,8 0,4" fill={T.gold} />
      </svg>
      <div style={{ flex: 1, height: '1px', background: T.gold, opacity: 0.4 }} />
    </div>
  );
}

// ─── Static category tiles (13 + 1 filler) ───────────────────────────────────
const CATEGORIES = [
  { slug: 'cleaning',   Icon: Sparkles,  label: 'Cleaning supplies',   sku: '240+ SKUs' },
  { slug: 'furniture',  Icon: Armchair,  label: 'Office furniture',     sku: '180+ SKUs' },
  { slug: 'electronics',Icon: Monitor,   label: 'Office electronics',   sku: '120+ SKUs' },
  { slug: 'paper',      Icon: FileText,  label: 'Paper goods',          sku: '90+ SKUs'  },
  { slug: 'lighting',   Icon: Lamp,      label: 'Lighting',             sku: '60+ SKUs'  },
  { slug: 'safety',     Icon: HardHat,   label: 'Safety & PPE',         sku: '80+ SKUs'  },
  { slug: 'packaging',  Icon: Package,   label: 'Packaging',            sku: '50+ SKUs'  },
  { slug: 'pantry',     Icon: Coffee,    label: 'Pantry & breakroom',   sku: '70+ SKUs'  },
  { slug: 'mattress',   Icon: Bed,       label: 'Mattresses',           sku: '20+ SKUs'  },
  { slug: 'buggy',      Icon: CarFront,  label: 'Golf carts & e-buggies', sku: '8 models' },
  { slug: 'cables',     Icon: Cable,     label: 'Wires & cables',       sku: '40+ SKUs'  },
  { slug: 'audio',      Icon: Speaker,   label: 'Sound & audio',        sku: '30+ SKUs'  },
  { slug: 'gifting',    Icon: Gift,      label: 'Corporate gifting',    sku: 'Custom'    },
] as const;

// ─── Static featured products (4 cards) ──────────────────────────────────────
const FEATURED = [
  { id: 'f01', Icon: Armchair, category: 'Furniture',  name: 'Executive conference table — walnut', meta: '8 sizes · Godrej Interio', badge: 'Bestseller' },
  { id: 'c01', Icon: Sparkles, category: 'Cleaning',   name: 'Industrial floor scrubber — 60L',     meta: 'ISI · 3 capacities',       badge: 'In stock'   },
  { id: 'l01', Icon: Lamp,     category: 'Lighting',   name: 'Architectural pendant — antique brass',meta: '12 finishes · custom',     badge: null         },
  { id: 'g01', Icon: Gift,     category: 'Gifting',    name: 'Diwali hamper — Mehfil',               meta: 'Custom 24-piece sets',     badge: 'Seasonal'   },
] as const;

// ─── Types from server page ───────────────────────────────────────────────────
export interface FeaturedProduct {
  id: string; name: string; slug: string;
  categories: { name: string } | null; primaryImage: string | null;
}

interface HomeClientProps {
  categories:       Category[];
  featuredProducts: FeaturedProduct[];
}

// ─── CSS (hover states that need pseudo-selectors) ────────────────────────────
const CSS = `
  .ghost-link { transition: color 200ms ease-out; }
  .ghost-link:hover { color: #b89656 !important; }
  .ghost-link svg  { transition: transform 200ms ease-out; }
  .ghost-link:hover svg { transform: translate(2px,-2px); }

  .hero-primary:hover  { background: #b89656 !important; }
  .hero-secondary:hover{ background: rgba(201,169,110,0.08) !important; }

  .cat-tile { transition: background 240ms ease-out; }
  .cat-tile:hover { background: #161616 !important; }
  .cat-tile:hover .cat-icon { color: #c9a96e !important; }
  .cat-tile:hover .cat-sku  { color: #c9a96e !important; }
  .cat-tile:hover .cat-arrow{ opacity: 1 !important; transform: translate(0,0) !important; }

  .prod-card { transition: border-color 240ms ease-out, transform 240ms ease-out; }
  .prod-card:hover { border-color: rgba(201,169,110,0.28) !important; transform: translateY(-2px) !important; }

  .cta-wa:hover  { background: #1da851 !important; }
  .cta-sec:hover { background: rgba(201,169,110,0.08) !important; }

  @media (max-width: 767px) {
    .hero-h1       { font-size: clamp(52px,12vw,90px) !important; }
    .hero-sub      { grid-template-columns: 1fr !important; gap: 32px !important; }
    .hero-cta      { justify-content: flex-start !important; }
    .hero-clients  { gap: 24px !important; flex-wrap: wrap !important; }
    .cap-grid      { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
    .cat-grid      { grid-template-columns: 1fr 1fr !important; }
    .why-grid      { grid-template-columns: 1fr !important; gap: 48px !important; }
    .prod-grid     { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
    .client-grid   { grid-template-columns: 1fr 1fr !important; }
    .cta-grid      { grid-template-columns: 1fr !important; gap: 40px !important; }
    .pull-quote    { font-size: clamp(22px,5vw,32px) !important; }
  }
  @media (max-width: 480px) {
    .prod-grid   { grid-template-columns: 1fr !important; }
    .cat-grid    { grid-template-columns: 1fr !important; }
    .client-grid { grid-template-columns: 1fr !important; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
export default function HomeClient({ categories, featuredProducts }: HomeClientProps) {
  // Resolve which category tiles to render: prefer DB, fall back to static
  const catTiles = categories.length > 0
    ? categories.map((c) => {
        const match = CATEGORIES.find((s) => s.slug === c.slug);
        return { slug: c.slug, Icon: match?.Icon ?? Package, label: c.name, sku: match?.sku ?? '' };
      })
    : CATEGORIES.map((c) => ({ ...c }));

  // Resolve featured: prefer server data, fall back to static demo
  const resolvedFeatured = featuredProducts.length > 0 ? null : FEATURED;

  const gutter: CSSProperties = { padding: '0 clamp(20px,4vw,48px)' };
  const inner:  CSSProperties = { maxWidth: '1320px', margin: '0 auto' };

  return (
    <>
      <style>{CSS}</style>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 1 · HERO                                                            */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="hero" style={{
        position: 'relative', minHeight: 'calc(100vh - 80px)', overflow: 'hidden',
        ...gutter, paddingTop: '80px', paddingBottom: '120px',
      }}>
        {/* Jali tile */}
        <div aria-hidden style={{
          position: 'absolute', top: '-120px', right: '-120px',
          width: '700px', height: '700px',
          backgroundImage: `url("${JALI}")`, backgroundSize: '120px 120px',
          opacity: 0.08, pointerEvents: 'none',
        }} />
        {/* Gold glow */}
        <div aria-hidden style={{
          position: 'absolute', top: '-200px', right: '-200px',
          width: '800px', height: '800px',
          background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ ...inner, position: 'relative' }}>
          <Reveal delay={100}>
            <Eyebrow>A B2B supplier · Jaipur · since 2014</Eyebrow>
          </Reveal>

          <Reveal delay={250}>
            <h1 className="hero-h1" style={{
              fontFamily: T.fontSerif, fontWeight: 400,
              fontSize: 'clamp(56px,8.8vw,128px)', lineHeight: 0.96,
              letterSpacing: '-0.03em', color: T.fg1, marginTop: '32px', maxWidth: '1100px',
            }}>
              Equipping{' '}
              <em style={{ fontStyle: 'italic', color: T.gold, fontWeight: 400 }}>India&apos;s finest</em>
              <br />workplaces.
            </h1>
          </Reveal>

          <Reveal delay={450}>
            <div className="hero-sub" style={{
              display: 'grid', gridTemplateColumns: '1.2fr 1fr',
              gap: '80px', alignItems: 'flex-end', marginTop: '48px',
            }}>
              <p style={{
                fontFamily: T.fontSans, fontWeight: 300, fontSize: '21px',
                lineHeight: 1.6, color: T.fg2, maxWidth: '580px', margin: 0,
              }}>
                A single trusted supplier for cleaning, furniture, electronics,
                lighting, and the hundred other things your office, hotel, or
                factory runs on. Pan-India, from Jaipur.
              </p>

              <div className="hero-cta" style={{
                display: 'flex', flexDirection: 'row', gap: '14px',
                justifyContent: 'flex-end', flexWrap: 'wrap',
              }}>
                <Link href="/catalog" id="hero-cta-catalog" className="hero-primary" style={{
                  fontFamily: T.fontSans, fontWeight: 500, fontSize: '15px',
                  background: T.gold, color: '#0f0f0f', padding: '14px 36px',
                  borderRadius: '4px', textDecoration: 'none',
                  transition: `background 240ms ${T.ease}`, whiteSpace: 'nowrap',
                }}>
                  Browse the catalog
                </Link>
                <Link href="/contact" id="hero-cta-quote" className="hero-secondary" style={{
                  fontFamily: T.fontSans, fontWeight: 500, fontSize: '15px',
                  color: T.gold, border: `1px solid ${T.goldSoft}`, padding: '14px 36px',
                  borderRadius: '4px', textDecoration: 'none', display: 'inline-flex',
                  alignItems: 'center', gap: '8px',
                  transition: `background 240ms ${T.ease}`, whiteSpace: 'nowrap',
                }}>
                  Get a quote <ArrowUpRight size={16} strokeWidth={1.4} />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Client strip */}
          <Reveal delay={650}>
            <div className="hero-clients" style={{
              marginTop: '96px', paddingTop: '32px',
              borderTop: `1px solid ${T.border1Med}`,
              display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap',
            }}>
              <span style={{
                fontFamily: T.fontSans, fontWeight: 500, fontSize: '11px',
                letterSpacing: '0.22em', textTransform: 'uppercase', color: T.fg3,
                whiteSpace: 'nowrap',
              }}>SUPPLIED TO</span>
              <div style={{ display: 'flex', gap: '56px', opacity: 0.55, flexWrap: 'wrap' }}>
                {['TAJ HOTELS', 'INFOSYS', 'AIIMS', 'RELIANCE', 'OBEROI', 'TATA'].map((c) => (
                  <span key={c} style={{
                    fontFamily: T.fontSerif, fontWeight: 400,
                    fontSize: '19px', letterSpacing: '0.08em', color: T.fg2,
                  }}>{c}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 2 · CAPABILITY BAR                                                  */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="capability" style={{
        background: T.bgDark,
        borderTop: `1px solid ${T.border1}`, borderBottom: `1px solid ${T.border1}`,
        padding: `44px clamp(20px,4vw,48px)`,
      }}>
        <div style={inner}>
          <Reveal>
            <div className="cap-grid" style={{
              display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
            }}>
              {([
                { num: '12+',  label: 'Years in business'  },
                { num: '400+', label: 'Corporate clients'  },
                { num: '26',   label: 'States served'      },
                { num: '5.0',  label: 'Google rating'      },
                { num: '4hr',  label: 'Quote turnaround'   },
              ] as const).map((s, i) => (
                <div key={s.num} style={{
                  paddingLeft: i > 0 ? '28px' : '0',
                  borderLeft:  i > 0 ? `1px solid ${T.border1}` : 'none',
                  display: 'flex', flexDirection: 'column', gap: '8px',
                }}>
                  <div style={{
                    fontFamily: T.fontSerif, fontWeight: 400,
                    fontSize: '38px', lineHeight: 1, color: T.fg1, letterSpacing: '-0.02em',
                  }}>{s.num}</div>
                  <div style={{
                    fontFamily: T.fontSans, fontWeight: 500, fontSize: '11px',
                    letterSpacing: '0.2em', textTransform: 'uppercase', color: T.fg3,
                  }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 3 · CATEGORIES                                                      */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="categories" style={{ ...gutter, paddingTop: '140px', paddingBottom: '140px' }}>
        <div style={inner}>
          <Reveal>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              gap: '48px', flexWrap: 'wrap', marginBottom: '64px',
            }}>
              <div>
                <Eyebrow>What we supply</Eyebrow>
                <h2 style={{
                  fontFamily: T.fontSerif, fontWeight: 400,
                  fontSize: 'clamp(40px,5vw,64px)', letterSpacing: '-0.02em', lineHeight: 1.05,
                  color: T.fg1, marginTop: '20px', maxWidth: '720px',
                }}>
                  Thirteen categories.{' '}
                  <em style={{ fontStyle: 'italic', color: T.gold }}>One purchase order.</em>
                </h2>
              </div>
              <Link href="/catalog" className="ghost-link" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontFamily: T.fontSans, fontWeight: 500, fontSize: '13px',
                color: T.gold, textDecoration: 'none', whiteSpace: 'nowrap',
              }}>
                View full catalog <ArrowUpRight size={16} strokeWidth={1.4} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="cat-grid" style={{
              display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
              gap: '1px', background: T.border1, border: `1px solid ${T.border1}`,
            }}>
              {catTiles.map(({ slug, Icon, label, sku }) => (
                <Link key={slug} href={`/catalog?category=${slug}`}
                  className="cat-tile"
                  style={{
                    background: T.bg, padding: '36px 28px 28px', aspectRatio: '1.2',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    cursor: 'pointer', textDecoration: 'none', position: 'relative', overflow: 'hidden',
                  }}
                >
                  <span className="cat-arrow" aria-hidden style={{
                    position: 'absolute', top: '32px', right: '28px',
                    opacity: 0, transform: 'translate(-6px,6px)',
                    transition: 'all 240ms ease-out', color: T.gold,
                  }}>
                    <ArrowUpRight size={16} strokeWidth={1.4} />
                  </span>
                  <span className="cat-icon" style={{ color: T.fg2, transition: `color 240ms ${T.ease}` }}>
                    <Icon size={28} strokeWidth={1.3} />
                  </span>
                  <div>
                    <div style={{
                      fontFamily: T.fontSerif, fontWeight: 400,
                      fontSize: '20px', lineHeight: 1.2, color: T.fg1, marginBottom: '6px',
                    }}>{label}</div>
                    <div className="cat-sku" style={{
                      fontFamily: T.fontSans, fontWeight: 500, fontSize: '11px',
                      letterSpacing: '0.16em', textTransform: 'uppercase', color: T.dim,
                      transition: `color 240ms ${T.ease}`,
                    }}>{sku}</div>
                  </div>
                </Link>
              ))}
              {/* Filler cell */}
              <div style={{ background: T.bg, aspectRatio: '1.2' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 4 · WHY NOBILITAS                                                   */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="why" style={{
        background: T.bgDark,
        borderTop: `1px solid ${T.border1}`, borderBottom: `1px solid ${T.border1}`,
        ...gutter, paddingTop: '140px', paddingBottom: '140px',
      }}>
        <div style={inner}>
          <Reveal>
            <Eyebrow>Why Nobilitas</Eyebrow>
            <h2 style={{
              fontFamily: T.fontSerif, fontWeight: 400,
              fontSize: 'clamp(40px,5vw,64px)', letterSpacing: '-0.02em', lineHeight: 1.05,
              color: T.fg1, margin: '20px 0 80px', maxWidth: '880px',
            }}>
              Not the cheapest supplier in India.{' '}
              <em style={{ fontStyle: 'italic', color: T.gold }}>The most reliable one.</em>
            </h2>
          </Reveal>

          <div className="why-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '56px',
          }}>
            {([
              {
                num: '01', title: 'One PO, every category',
                body: 'Stop juggling forty vendors for forty things. We supply across cleaning, furniture, electronics, lighting, pantry, and corporate gifting from one inquiry, one quote, one invoice.',
              },
              {
                num: '02', title: 'Quoted within four hours',
                body: 'Send a list on WhatsApp. We respond same-day, with sourcing details and lead times. No portals to log into, no callbacks scheduled three days out.',
              },
              {
                num: '03', title: 'Trusted, verified brands',
                body: 'We carry Diversey, 3M, Godrej Interio, Kimberly-Clark, Philips, and reliable local manufacturers — vetted on quality, pricing, and post-sale service.',
              },
            ] as const).map((item, i) => (
              <Reveal key={item.num} delay={i * 120}>
                <div style={{
                  fontFamily: T.fontSerif, fontWeight: 400, fontSize: '56px',
                  letterSpacing: '-0.02em', lineHeight: 1, color: T.gold,
                  marginBottom: '28px', opacity: 0.5,
                }}>{item.num}</div>
                <h3 style={{
                  fontFamily: T.fontSerif, fontWeight: 400, fontSize: '26px',
                  lineHeight: 1.2, color: T.fg1, marginBottom: '16px',
                }}>{item.title}</h3>
                <p style={{
                  fontFamily: T.fontSans, fontWeight: 300, fontSize: '15px',
                  lineHeight: 1.75, color: T.fg2, margin: 0,
                }}>{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 5 · FEATURED PRODUCTS                                               */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="featured-products" style={{ ...gutter, paddingTop: '140px', paddingBottom: '140px' }}>
        <div style={inner}>
          <Reveal>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              marginBottom: '64px', flexWrap: 'wrap', gap: '24px',
            }}>
              <div>
                <Eyebrow>Recently sourced</Eyebrow>
                <h2 style={{
                  fontFamily: T.fontSerif, fontWeight: 400,
                  fontSize: 'clamp(36px,4.5vw,56px)', lineHeight: 1.1,
                  color: T.fg1, marginTop: '20px', margin: '20px 0 0',
                }}>Selected from the catalog.</h2>
              </div>
              <Link href="/catalog" className="ghost-link" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontFamily: T.fontSans, fontWeight: 500, fontSize: '13px',
                color: T.gold, textDecoration: 'none', whiteSpace: 'nowrap',
              }}>
                See all 1,200+ products <ArrowUpRight size={16} strokeWidth={1.4} />
              </Link>
            </div>
          </Reveal>

          <div className="prod-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px',
          }}>
            {resolvedFeatured
              ? resolvedFeatured.map(({ id, Icon, category, name, meta, badge }, i) => (
                <Reveal key={id} delay={i * 80}>
                  <FeaturedCard
                    id={id} Icon={Icon} category={category}
                    name={name} meta={meta} badge={badge ?? null}
                  />
                </Reveal>
              ))
              : featuredProducts.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <LiveFeaturedCard product={p} />
                </Reveal>
              ))
            }
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 6 · CLIENT WALL                                                     */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="clients" style={{
        background: T.bgDark,
        borderTop: `1px solid ${T.border1}`, borderBottom: `1px solid ${T.border1}`,
        ...gutter, paddingTop: '120px', paddingBottom: '120px',
      }}>
        <div style={inner}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <Eyebrow>Trusted by</Eyebrow>
              <h2 style={{
                fontFamily: T.fontSerif, fontWeight: 400,
                fontSize: 'clamp(32px,4vw,48px)', color: T.fg1, marginTop: '20px',
              }}>400+ organisations across India.</h2>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="client-grid" style={{
              display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
              gap: '1px', background: T.border1, border: `1px solid ${T.border1}`,
            }}>
              {[
                'TAJ HOTELS','INFOSYS LTD','AIIMS','RELIANCE',
                'OBEROI','TATA STEEL','ITC LIMITED','JAIPUR RUGS',
                'JK CEMENT','MARRIOTT','WIPRO','HINDUSTAN ZINC',
              ].map((name) => (
                <div key={name} style={{
                  padding: '44px 24px', background: T.bgDark,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: T.fontSerif, fontWeight: 400, fontSize: '18px',
                  letterSpacing: '0.08em', color: T.fg2, opacity: 0.65, textAlign: 'center',
                }}>{name}</div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 7 · PULL QUOTE                                                      */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="testimonial" style={{ ...gutter, paddingTop: '160px', paddingBottom: '160px' }}>
        <div style={{ ...inner, maxWidth: '1100px', textAlign: 'center', position: 'relative' }}>
          <Reveal>
            <Ornament width={200} />
            <blockquote className="pull-quote" style={{
              fontFamily: T.fontSerif, fontWeight: 400, fontStyle: 'italic',
              fontSize: 'clamp(28px,3.5vw,44px)', lineHeight: 1.3,
              letterSpacing: '-0.01em', color: T.fg1, margin: '40px auto',
              maxWidth: '900px',
            }}>
              &ldquo;When we opened our Jaipur property, Nobilitas handled
              procurement across{' '}
              <span style={{ color: T.gold, fontStyle: 'normal', fontFamily: T.fontSerif }}>
                seventeen categories
              </span>
              {' '}— from staff uniforms to the housekeeping carts.
              One contact. One invoice schedule. Genuinely the easiest
              opening I&apos;ve run.&rdquo;
            </blockquote>
            <Ornament width={200} />
            <div style={{
              marginTop: '24px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '4px',
            }}>
              <span style={{ fontFamily: T.fontSans, fontWeight: 500, fontSize: '14px', color: T.fg1 }}>
                Priya Sharma
              </span>
              <span style={{
                fontFamily: T.fontSans, fontWeight: 500, fontSize: '11px',
                letterSpacing: '0.18em', textTransform: 'uppercase', color: T.fg3,
              }}>
                General Manager · The Oberoi Rajvilās, Jaipur
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 8 · CTA                                                             */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="cta" style={{ ...gutter, paddingBottom: '140px' }}>
        <div style={inner}>
          <Reveal>
            <div style={{
              background: T.bgSurface, border: `1px solid ${T.borderGold}`,
              borderRadius: '10px', padding: `80px clamp(40px,6vw,96px)`,
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Jali bg */}
              <div aria-hidden style={{
                position: 'absolute', top: '-100px', right: '-100px',
                width: '480px', height: '480px',
                backgroundImage: `url("${JALI}")`, backgroundSize: '100px',
                opacity: 0.06, pointerEvents: 'none',
              }} />

              <div className="cta-grid" style={{
                display: 'grid', gridTemplateColumns: '1.4fr 1fr',
                gap: '64px', alignItems: 'center', position: 'relative',
              }}>
                {/* Left */}
                <div>
                  <Eyebrow>Send a list. Get a quote.</Eyebrow>
                  <h2 style={{
                    fontFamily: T.fontSerif, fontWeight: 400,
                    fontSize: 'clamp(36px,4.5vw,56px)', lineHeight: 1.05,
                    color: T.fg1, margin: '20px 0 20px',
                  }}>Tell us what your workplace needs.</h2>
                  <p style={{
                    fontFamily: T.fontSans, fontWeight: 300, fontSize: '17px',
                    lineHeight: 1.65, color: T.fg2, maxWidth: '540px', margin: 0,
                  }}>
                    WhatsApp us a list of items or a procurement spec. We&apos;ll
                    respond with sourcing, pricing, and lead times within four
                    working hours.
                  </p>
                </div>

                {/* Right */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <a
                    id="cta-whatsapp-btn"
                    href="https://wa.me/911414019200"
                    target="_blank" rel="noopener noreferrer"
                    className="cta-wa"
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      gap: '10px', background: '#25d366', color: '#fff',
                      fontFamily: T.fontSans, fontWeight: 500, fontSize: '15px',
                      padding: '16px 32px', borderRadius: '4px', textDecoration: 'none',
                      transition: `background 240ms ${T.ease}`,
                    }}
                  >
                    <MessageCircle size={18} strokeWidth={1.4} />
                    WhatsApp your inquiry
                  </a>

                  <Link href="/contact" id="cta-contact-btn" className="cta-sec" style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: T.fontSans, fontWeight: 500, fontSize: '15px',
                    color: T.gold, border: `1px solid ${T.goldSoft}`, padding: '16px 32px',
                    borderRadius: '4px', textDecoration: 'none',
                    transition: `background 240ms ${T.ease}`,
                  }}>
                    Or fill the contact form
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

// ─── Static featured product card (icon placeholder) ─────────────────────────
function FeaturedCard({
  id, Icon, category, name, meta, badge,
}: {
  id: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
  category: string;
  name: string;
  meta: string;
  badge: string | null;
}) {
  return (
    <Link href={`/catalog/${id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article className="prod-card" style={{
        background: T.bgSurface, border: `1px solid ${T.border1}`,
        borderRadius: '10px', overflow: 'hidden',
      }}>
        {/* Placeholder image */}
        <div style={{
          aspectRatio: '1.3', position: 'relative',
          background: 'linear-gradient(135deg,#1c1c1c,#242424,#181818)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}>
          {/* Jali corner */}
          <div aria-hidden style={{
            position: 'absolute', top: 0, right: 0, width: '160px', height: '160px',
            backgroundImage: `url("${JALI}")`, backgroundSize: '40px 40px', opacity: 0.18,
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <Icon size={42} strokeWidth={1.1} color="rgba(201,169,110,0.6)" />
            <span style={{
              fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500,
              fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase',
              color: 'rgba(138,138,138,0.7)',
            }}>Available on inquiry</span>
          </div>
          {/* Badge */}
          {badge && (
            <span style={{
              position: 'absolute', top: '12px', left: '12px',
              fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500,
              fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase',
              background: 'rgba(201,169,110,0.15)', color: '#c9a96e',
              padding: '4px 10px', borderRadius: '999px',
            }}>{badge}</span>
          )}
        </div>
        {/* Body */}
        <div style={{ padding: '20px 22px 22px' }}>
          <div style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500,
            fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: T.gold, marginBottom: '8px',
          }}>{category}</div>
          <h3 style={{
            fontFamily: T.fontSerif, fontWeight: 400, fontSize: '19px',
            lineHeight: 1.25, color: T.fg1, margin: '0 0 6px',
          }}>{name}</h3>
          <p style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400,
            fontSize: '12px', color: T.fg3, margin: 0,
          }}>{meta}</p>
        </div>
      </article>
    </Link>
  );
}

// ─── Live featured card (Supabase data) ───────────────────────────────────────
function LiveFeaturedCard({ product }: { product: FeaturedProduct }) {
  return (
    <Link href={`/catalog/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article className="prod-card" style={{
        background: T.bgSurface, border: `1px solid ${T.border1}`,
        borderRadius: '10px', overflow: 'hidden',
      }}>
        <div style={{
          aspectRatio: '1.3',
          background: product.primaryImage ? 'transparent' : 'linear-gradient(135deg,#1c1c1c,#242424,#181818)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}>
          {product.primaryImage
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={product.primaryImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <Package size={42} strokeWidth={1.1} color="rgba(201,169,110,0.6)" />
          }
        </div>
        <div style={{ padding: '20px 22px 22px' }}>
          {product.categories && (
            <div style={{
              fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500,
              fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase',
              color: T.gold, marginBottom: '8px',
            }}>{product.categories.name}</div>
          )}
          <h3 style={{
            fontFamily: T.fontSerif, fontWeight: 400, fontSize: '19px',
            lineHeight: 1.25, color: T.fg1, margin: '0 0 6px',
          }}>{product.name}</h3>
          <p style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400,
            fontSize: '12px', color: T.fg3, margin: 0,
          }}>Available on inquiry</p>
        </div>
      </article>
    </Link>
  );
}
