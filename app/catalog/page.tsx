'use client';

/**
 * CatalogPage — full client component.
 */
import { useState } from 'react';
import Link from 'next/link';
import styles from './catalog.module.css';

/* ── Product data ─────────────────────── */
import { PRODUCTS, CATEGORY_COUNTS, CATEGORIES as LIB_CATEGORIES, ICON_PATHS, ProductTone } from '@/lib/products';

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
const CATEGORY_LABELS: Record<string, string> = {
  All: 'All',
  Cleaning: 'Cleaning',
  Furniture: 'Furniture',
  Electronics: 'Electronics',
  Lighting: 'Lighting',
  Safety: 'Safety & PPE',
  Packaging: 'Packaging',
  Pantry: 'Pantry',
  Gifting: 'Corporate gifts',
  Mattress: 'Mattresses',
  Buggies: 'Buggies',
  Cables: 'Cables',
  Audio: 'Audio',
  Paper: 'Paper goods',
};

const CATEGORIES = [
  { label: 'All', cat: 'All' },
  ...LIB_CATEGORIES.map(cat => ({ label: CATEGORY_LABELS[cat] || cat, cat }))
].map(c => ({
  ...c,
  count: String(CATEGORY_COUNTS[c.cat] || 0).padStart(2, '0')
}));

const TONE_CLASS: Record<ProductTone, string> = {
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
                      <Link href={`/catalog/${p.id}`} key={p.id} className={styles.productCard}>
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
                      </Link>
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
                      <Link href={`/catalog/${p.id}`} key={p.id} className={styles.listRow}>
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
                      </Link>
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
