'use client';

/**
 * CatalogPage — full client component.
 */
import { useState } from 'react';
import Link from 'next/link';
import styles from './catalog.module.css';

/* ── Product data ─────────────────────── */
type Tone = 'warm' | 'sage' | 'cocoa' | 'deep' | 'default';

interface Product {
  id: string;
  cat: string;
  icon: keyof typeof ICON_PATHS;
  name: string;
  meta: string;
  badge: string | null;
  solid: boolean;
  tone: Tone;
  sku: string;
}

const PRODUCTS: Product[] = [
  { id: 'f01', cat: 'Furniture', icon: 'armchair', name: 'executive conference table — walnut', meta: '8 sizes · Godrej Interio', badge: 'Bestseller', solid: true, tone: 'warm', sku: 'OF-CT-W24' },
  { id: 'f02', cat: 'Furniture', icon: 'armchair', name: 'ergonomic task chair — mesh back', meta: '5 colorways · BIFMA tested', badge: null, solid: false, tone: 'deep', sku: 'OF-TC-MB1' },
  { id: 'f03', cat: 'Furniture', icon: 'armchair', name: 'modular workstation — 6-person cluster', meta: 'Custom dimensions', badge: null, solid: false, tone: 'default', sku: 'OF-WS-06' },
  { id: 'c01', cat: 'Cleaning', icon: 'sparkles', name: 'industrial floor scrubber — 60L', meta: 'ISI · 3 capacities', badge: 'In stock', solid: false, tone: 'sage', sku: 'CL-FS-60' },
  { id: 'c02', cat: 'Cleaning', icon: 'sparkles', name: 'diversey suma D1.1 — degreaser', meta: '5L · 25L · 200L drums', badge: null, solid: false, tone: 'default', sku: 'CL-DG-D1' },
  { id: 'c03', cat: 'Cleaning', icon: 'sparkles', name: 'housekeeping cart — twin-bin', meta: 'Stainless · galvanised', badge: null, solid: false, tone: 'deep', sku: 'CL-HK-TB' },
  { id: 'e01', cat: 'Electronics', icon: 'monitor', name: '27" 4K monitor — IPS panel', meta: 'Dell · HP · LG variants', badge: null, solid: false, tone: 'cocoa', sku: 'EL-MN-27' },
  { id: 'e02', cat: 'Electronics', icon: 'monitor', name: 'multifunction printer A3 — laser', meta: 'Canon · Xerox', badge: null, solid: false, tone: 'default', sku: 'EL-PR-A3' },
  { id: 'l01', cat: 'Lighting', icon: 'lamp', name: 'architectural pendant — antique brass', meta: '12 finishes · custom', badge: null, solid: false, tone: 'cocoa', sku: 'LT-PD-AB' },
  { id: 'l02', cat: 'Lighting', icon: 'lamp', name: 'LED panel — 600×600 recessed', meta: '30W · 40W · 50W', badge: 'New 2026', solid: true, tone: 'warm', sku: 'LT-LP-66' },
  { id: 's01', cat: 'Safety', icon: 'hardhat', name: 'safety helmet — ISI type-A', meta: 'Bulk pricing 100+', badge: null, solid: false, tone: 'default', sku: 'SF-HM-TA' },
  { id: 's02', cat: 'Safety', icon: 'hardhat', name: 'high-visibility vest — class 2', meta: '5 sizes · custom branding', badge: null, solid: false, tone: 'warm', sku: 'SF-VS-C2' },
  { id: 'p01', cat: 'Packaging', icon: 'package', name: 'corrugated boxes — 3-ply 5-ply', meta: 'Custom sizes · MOQ 500', badge: null, solid: false, tone: 'deep', sku: 'PK-CB-35' },
  { id: 'n01', cat: 'Pantry', icon: 'coffee', name: 'commercial espresso machine — 2-group', meta: 'La Marzocco · Faema', badge: null, solid: false, tone: 'cocoa', sku: 'PN-ES-2G' },
  { id: 'n02', cat: 'Pantry', icon: 'coffee', name: 'pantry refill — tea, coffee, sugar', meta: 'Monthly subscription', badge: 'Subscription', solid: true, tone: 'default', sku: 'PN-RF-MO' },
  { id: 'g01', cat: 'Gifting', icon: 'gift', name: 'diwali hamper — mehfil edition', meta: 'Custom 24-piece sets', badge: 'Seasonal', solid: true, tone: 'warm', sku: 'CG-MH-24' },
  { id: 'g02', cat: 'Gifting', icon: 'gift', name: 'onboarding kit — welcome box', meta: 'Branded · 4-piece', badge: null, solid: false, tone: 'sage', sku: 'CG-OB-04' },
  { id: 'm01', cat: 'Mattress', icon: 'bed', name: 'hotel mattress — king 6-zone', meta: 'Sleepwell · Kurl-on', badge: null, solid: false, tone: 'default', sku: 'MT-HK-6Z' },
  { id: 'b01', cat: 'Buggies', icon: 'carfront', name: 'electric buggy — 6-seater', meta: 'Lithium · 80km range', badge: null, solid: false, tone: 'sage', sku: 'BG-EL-06' },
  { id: 'w01', cat: 'Cables', icon: 'cable', name: 'cat 6A LAN cable — 305m roll', meta: 'Shielded · plenum', badge: null, solid: false, tone: 'deep', sku: 'WR-LN-6A' },
  { id: 'a01', cat: 'Audio', icon: 'speaker', name: 'conference speaker — dante', meta: 'Shure · Sennheiser', badge: null, solid: false, tone: 'cocoa', sku: 'AU-SP-DA' },
  { id: 'pa01', cat: 'Paper', icon: 'filetext', name: 'letterhead — 100 GSM bond', meta: 'Min 500 sheets', badge: null, solid: false, tone: 'warm', sku: 'PA-LH-BD' }
];

/* ── Inline SVG paths ──────────────────────── */
const ICON_PATHS = {
  sparkles: 'M12 3l1.5 4 4 1.5-4 1.5L12 14l-1.5-4-4-1.5 4-1.5L12 3zM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z',
  armchair: 'M5 11a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3H5v-3zM5 14v6M19 14v6M7 9V5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v4',
  monitor: 'M2 3h20a0 0 0 0 1 0 0v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3zM8 21h8M12 17v4',
  lamp: 'M7 2l4 8h2l4-8H7zM10 10v10h4V10M8 20h8',
  hardhat: 'M2 18a5 5 0 0 1 10 0M10 14a8 8 0 0 1 8-8 8 8 0 0 1 4 1M2 18h20',
  package: 'M16.5 9.4 7.55 4.24M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zm-10-11.76 8.73 5.05M12 22.08V12',
  coffee: 'M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v3M10 2v3M14 2v3',
  gift: 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  bed: 'M2 18v-7a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v7M2 14h20M2 18h20M8 11h4',
  carfront: 'M6 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2 14h20l-2-7H4z',
  cable: 'M4 9V6a2 2 0 0 1 2-2h2v6H4zM16 4h2a2 2 0 0 1 2 2v3h-4zM8 10v4a4 4 0 0 0 8 0V10',
  speaker: 'M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM12 17.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM12 7h.01',
  filetext: 'M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M16 2l6 6M16 8H8M16 12H8M14 16H8'
} as const;

function CategoryIcon({ name, dark }: { name: keyof typeof ICON_PATHS; dark: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke={dark ? 'var(--cream-light)' : 'var(--onyx)'}
      style={{ width: 56, height: 56, strokeWidth: 1.2, opacity: dark ? 0.7 : 0.5 }}
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

/* ── Sidebar category data ────────────────────────────────────────────────── */
const CATEGORIES = [
  { label: 'All',         count: '22', cat: 'All'         },
  { label: 'Cleaning',    count: '03', cat: 'Cleaning'    },
  { label: 'Furniture',   count: '03', cat: 'Furniture'   },
  { label: 'Electronics', count: '02', cat: 'Electronics' },
  { label: 'Lighting',    count: '02', cat: 'Lighting'    },
  { label: 'Safety & PPE',count: '02', cat: 'Safety'      },
  { label: 'Packaging',   count: '01', cat: 'Packaging'   },
  { label: 'Pantry',      count: '02', cat: 'Pantry'      },
  { label: 'Corporate gifts', count: '02', cat: 'Gifting' },
  { label: 'Mattresses',  count: '01', cat: 'Mattress'    },
  { label: 'Buggies',     count: '01', cat: 'Buggies'     },
  { label: 'Cables',      count: '01', cat: 'Cables'      },
  { label: 'Audio',       count: '01', cat: 'Audio'       },
  { label: 'Paper goods', count: '01', cat: 'Paper'       },
] as const;

const TONE_CLASS: Record<Tone, string> = {
  warm:    styles.toneWarm,
  sage:    styles.toneSage,
  cocoa:   styles.toneCocoa,
  deep:    styles.toneDeep,
  default: styles.toneDefault,
};

/* ── Component ────────────────────────────────────────────────────────────── */
export default function CatalogPage() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState('Featured');

  const filtered = activeFilter === 'All'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.cat === activeFilter);

  return (
    <main>
      {/* ── Page header ─────────────────────────────────────────────── */}
      <section className={styles.pageHead}>
        <div className={`container ${styles.pageHeadContainer}`}>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span className={styles.sep}>/</span>
            <span className={styles.current}>Catalog</span>
          </div>

          <div className="eyebrow reveal-up reveal-in">
            <span className="num">// 02</span>&nbsp; The full catalog
          </div>

          <div className={styles.pageHeadGrid}>
            <h1 className="h-display reveal-up delay-1">
              {activeFilter === 'All' ? (
                <>1,247 <em>products</em>.</>
              ) : (
                <>{filtered.length} <em>{activeFilter.toLowerCase()}</em>.</>
              )}
            </h1>
            <div className={`${styles.pageHeadGridRight} reveal-up delay-2`}>
              <p className="lede">
                All pricing on inquiry. MOQs vary by SKU. Lead times of 5–14 working days from Jaipur, faster on stocked items. Reply within four working hours, guaranteed.
              </p>
            </div>
          </div>

          <div className={styles.headStats}>
            {[
              { num: '10',    lbl: 'Categories'       },
              { num: '62',    lbl: 'Partner brands'   },
              { num: '26',    lbl: 'States served'    },
              { num: '4 hrs', lbl: 'Quote turnaround' },
            ].map((s) => (
              <div key={s.lbl} className={styles.stat}>
                <div className={styles.statNum}>{s.num}</div>
                <div className={styles.statLbl}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Catalog body ─────────────────────────────────────────────── */}
      <section className={styles.catalogBody}>
        <div className="container">
          <div className={styles.catalogGrid}>

            {/* ── Sidebar ────────────────────────────────────────────── */}
            <aside className={styles.sidebar}>
              {/* Categories */}
              <div className={styles.filterGroup}>
                <div className={styles.filterGroupHead}>
                  <span className={styles.filterGroupHeadNum}>// i</span>
                  <span className={styles.filterGroupHeadTitle}>Categories</span>
                </div>
                <ul className={styles.catFilter}>
                  {CATEGORIES.map((c) => (
                    <li key={c.cat}>
                      <button
                        className={activeFilter === c.cat ? styles.active : ''}
                        onClick={() => setActiveFilter(c.cat)}
                      >
                        <span>{c.label}</span>
                        <span className={styles.catFilterCount}>{c.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Filters */}
              <div className={styles.filterGroup}>
                <div className={styles.filterGroupHead}>
                  <span className={styles.filterGroupHeadNum}>// ii</span>
                  <span className={styles.filterGroupHeadTitle}>Filters</span>
                </div>
                {[
                  { label: 'In stock',            num: '142' },
                  { label: 'ISI / BIS certified', num: '98'  },
                  { label: 'Custom branding',     num: '64'  },
                  { label: 'Bulk MOQ (100+)',      num: '52'  },
                  { label: 'Available for export', num: '36'  },
                ].map(({ label, num }) => (
                  <label key={label} className={styles.check}>
                    <input type="checkbox" />
                    <span className={styles.box}>
                      <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round">
                        <path d="M5 12l5 5 9-11" />
                      </svg>
                    </span>
                    <span>{label}</span>
                    <span className={styles.checkNum}>{num}</span>
                  </label>
                ))}
              </div>

              {/* Lead time */}
              <div className={styles.filterGroup}>
                <div className={styles.filterGroupHead}>
                  <span className={styles.filterGroupHeadNum}>// iii</span>
                  <span className={styles.filterGroupHeadTitle}>Lead time</span>
                </div>
                {['Same day (Jaipur)', '3–5 working days', '1–2 weeks', 'Custom / quote'].map((label) => (
                  <label key={label} className={styles.check}>
                    <input type="checkbox" />
                    <span className={styles.box}>
                      <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round">
                        <path d="M5 12l5 5 9-11" />
                      </svg>
                    </span>
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              {/* Partner brands */}
              <div className={styles.filterGroup}>
                <div className={styles.filterGroupHead}>
                  <span className={styles.filterGroupHeadNum}>// iv</span>
                  <span className={styles.filterGroupHeadTitle}>Partner brand</span>
                </div>
                {['Diversey', '3M', 'Godrej Interio', 'Kimberly-Clark', 'Philips'].map((b) => (
                  <label key={b} className={styles.check}>
                    <input type="checkbox" />
                    <span className={styles.box}>
                      <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round">
                        <path d="M5 12l5 5 9-11" />
                      </svg>
                    </span>
                    <span>{b}</span>
                  </label>
                ))}
                <button className={styles.clearBtn} type="button">Reset all filters →</button>
              </div>
            </aside>

            {/* ── Main column ─────────────────────────────────────────── */}
            <div>
              {/* Toolbar */}
              <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                  <span className={styles.filterLabel}>// {activeFilter}</span>
                  <span className={styles.countText}>
                    showing <strong>{filtered.length}</strong> of 1,247 products
                  </span>
                </div>
                <div className={styles.toolbarRight}>
                  <select 
                    className={styles.sortSelect} 
                    value={sort} 
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option>Sort · Featured</option>
                    <option>A → Z</option>
                    <option>Newest</option>
                    <option>Most inquired</option>
                    <option>Lead time</option>
                  </select>
                  <div className={styles.viewToggle}>
                    <button
                      className={`${styles.viewBtn}${view === 'grid' ? ` ${styles.active}` : ''}`}
                      aria-label="Grid view"
                      onClick={() => setView('grid')}
                    >
                      <svg viewBox="0 0 24 24" strokeLinecap="round">
                        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                      </svg>
                    </button>
                    <button
                      className={`${styles.viewBtn}${view === 'list' ? ` ${styles.active}` : ''}`}
                      aria-label="List view"
                      onClick={() => setView('list')}
                    >
                      <svg viewBox="0 0 24 24" strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid view */}
              {view === 'grid' && (
                <div className={styles.productsGrid}>
                  {filtered.map((p) => {
                    const isDark = p.tone === 'cocoa' || p.tone === 'deep';
                    return (
                      <article key={p.id} className={styles.productCard}>
                        <div className={`${styles.productImg} ${TONE_CLASS[p.tone]}`}>
                          <span className={styles.sku}>{p.sku}</span>
                          {p.badge && (
                            <span className={`${styles.badge}${!p.solid ? ` ${styles.badgeMuted}` : ''}`}>
                              {p.badge}
                            </span>
                          )}
                          <div className={styles.centerIcon}>
                            <CategoryIcon name={p.icon} dark={isDark} />
                          </div>
                        </div>
                        <div className={styles.productMeta}>
                          <div className={styles.productCat}>{p.cat}</div>
                          <h3 className={styles.productName}>{p.name}</h3>
                          <p className={styles.productAvail}>{p.meta} · available on inquiry</p>
                          <div className={styles.productFoot}>
                            <span className={styles.view}>
                              View details<span className={styles.arrow}>→</span>
                            </span>
                            <span className={styles.inq}>// inquiry</span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* List view */}
              {view === 'list' && (
                <div className={styles.productsList}>
                  {filtered.map((p) => {
                    const isDark = p.tone === 'cocoa' || p.tone === 'deep';
                    return (
                      <div key={p.id} className={styles.listRow}>
                        <div className={styles.thumb}>
                          <div className={`${styles.productImg} ${TONE_CLASS[p.tone]}`} style={{ aspectRatio: '1', border: 'none' }}>
                            <div className={styles.centerIcon}>
                              <CategoryIcon name={p.icon} dark={isDark} />
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className={styles.catEyebrow}>// {p.cat}</div>
                          <div className={styles.name}>{p.name}</div>
                        </div>
                        <div className={styles.metaCol}>{p.meta}</div>
                        <div className={styles.badgeCol}>
                          {p.badge && (
                            <span className={`${styles.badge}${p.solid ? ` ${styles.solid}` : ''}`}>
                              {p.badge}
                            </span>
                          )}
                        </div>
                        <div className={styles.go}>→</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Load more */}
              <div className={styles.loadMoreWrap}>
                <div className={styles.progressLabel}>Viewing {filtered.length} of 1,247 products</div>
                <div className={styles.progress}>
                  <div className={styles.progressFill} style={{ width: `${(filtered.length / 1247) * 100}%` }} />
                </div>
                <button type="button" className="btn btn--outline-dark">
                  Load 24 more <span className="arrow">↓</span>
                </button>
              </div>

              {/* Inline CTA */}
              <div className={styles.inlineCta}>
                <div>
                  <div className="eyebrow">
                    <span className="num">// quick</span>&nbsp; Or just ask
                  </div>
                  <h2 className={`h-section ${styles.inlineCtaH}`}>
                    browsing is <em>optional.</em>
                  </h2>
                  <p className={`lede ${styles.inlineCtaLede}`}>
                    Send us a list — typed, scanned, or photographed on a napkin. We will quote within four working hours.
                  </p>
                </div>
                <div className={styles.inlineCtaBtns}>
                  <Link href="https://wa.me/919876543210" className="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    WhatsApp inquiry
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
