'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ICON_PATHS, ProductTone } from '@/lib/products'; // Keep ICON_PATHS for SVGs
import { Category, ProductWithCategory } from '@/lib/types';
import styles from './catalog.module.css';

function CategoryIcon({ name, dark }: { name: string; dark: boolean }) {
  const iconPath = ICON_PATHS[name as keyof typeof ICON_PATHS] || ICON_PATHS.sparkles;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke={dark ? 'var(--cream-light)' : 'var(--onyx)'}
      style={{ width: 56, height: 56, strokeWidth: 1.2, opacity: dark ? 0.7 : 0.5 }}
    >
      <path d={iconPath} />
    </svg>
  );
}

const TONE_CLASS: Record<ProductTone, string> = {
  warm: styles.toneWarm,
  sage: styles.toneSage,
  cocoa: styles.toneCocoa,
  deep: styles.toneDeep,
  default: styles.toneDefault,
};

function getToneForCategory(slug: string): ProductTone {
  switch (slug) {
    case 'cleaning-hygiene': return 'sage';
    case 'office-furniture': return 'warm';
    case 'office-electronics': return 'cocoa';
    case 'electrical-lighting': return 'cocoa';
    case 'corporate-gifts': return 'warm';
    case 'safety-ppe': return 'default';
    case 'packaging-materials': return 'deep';
    case 'pantry-cafeteria': return 'default';
    case 'paper-stationery': return 'warm';
    case 'housekeeping-equipment': return 'deep';
    default: return 'default';
  }
}

interface CatalogClientProps {
  products: ProductWithCategory[];
  categories: Category[];
}

export default function CatalogClient({ products, categories }: CatalogClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState('Featured');

  const filtered = activeFilter === 'All'
    ? products
    : products.filter((p) => p.category_id === activeFilter);

  // Compute how many products belong to each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    categories.forEach(cat => {
      counts[cat.id] = products.filter(p => p.category_id === cat.id).length;
    });
    return counts;
  }, [products, categories]);

  const totalCount = String(products.length).padStart(2, '0');

  const sortedProducts = [...filtered].sort((a, b) => {
    if (sort === 'A → Z') return a.name.localeCompare(b.name);
    if (sort === 'Newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sort === 'Most inquired') return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    return 0;
  });

  const getAvailText = (p: ProductWithCategory) => {
    if (p.pack_sizes && p.pack_sizes.length > 0) {
      return p.pack_sizes[0];
    }
    return 'Available on inquiry';
  };

  const getBadge = (p: ProductWithCategory) => {
    if (p.is_new_arrival) return { text: 'New', solid: true };
    if (p.is_featured) return { text: 'Featured', solid: true };
    if (p.status === 'on_request') return { text: 'On request', solid: false };
    if (p.status === 'out_of_stock') return { text: 'Out of stock', solid: false };
    return null;
  };

  return (
    <main>
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
                <>{products.length} <em>products</em>.</>
              ) : (
                <>{filtered.length} <em>{categories.find(c => c.id === activeFilter)?.name.toLowerCase()}</em>.</>
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

      <section className={styles.catalogBody}>
        <div className="container">
          <div className={styles.catalogGrid}>

            <aside className={styles.sidebar}>
              <div className={styles.filterGroup}>
                <div className={styles.filterGroupHead}>
                  <span className={styles.filterGroupHeadNum}>// i</span>
                  <span className={styles.filterGroupHeadTitle}>Categories</span>
                </div>
                <ul className={styles.catFilter}>
                  <li>
                    <button
                      className={activeFilter === 'All' ? styles.active : ''}
                      onClick={() => setActiveFilter('All')}
                    >
                      <span>All</span>
                      <span className={styles.catFilterCount}>{String(categoryCounts['All'] ?? 0).padStart(2, '0')}</span>
                    </button>
                  </li>
                  {categories.map((c) => {
                    const count = categoryCounts[c.id] ?? 0;
                    return (
                      <li key={c.id}>
                        <button
                          className={activeFilter === c.id ? styles.active : ''}
                          onClick={() => setActiveFilter(c.id)}
                        >
                          <span>{c.name}</span>
                          <span className={styles.catFilterCount}>{String(count).padStart(2, '0')}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className={styles.filterGroup}>
                <div className={styles.filterGroupHead}>
                  <span className={styles.filterGroupHeadNum}>// ii</span>
                  <span className={styles.filterGroupHeadTitle}>Filters</span>
                </div>
                {[
                  { label: 'In stock' },
                  { label: 'ISI / BIS certified' },
                  { label: 'Custom branding' },
                  { label: 'Bulk MOQ (100+)' },
                  { label: 'Available for export' },
                ].map(({ label }) => (
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

            <div>
              <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                  <span className={styles.filterLabel}>
                    // {activeFilter === 'All' ? 'All' : categories.find(c => c.id === activeFilter)?.name}
                  </span>
                  <span className={styles.countText}>
                    showing <strong>{filtered.length}</strong> of {products.length} products
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

              {view === 'grid' && (
                <div className={styles.productsGrid}>
                  {sortedProducts.map((p) => {
                    const catSlug = categories.find(c => c.id === p.category_id)?.slug || '';
                    const tone = getToneForCategory(catSlug);
                    const isDark = tone === 'cocoa' || tone === 'deep';
                    const badge = getBadge(p);
                    const iconName = categories.find(c => c.id === p.category_id)?.icon_name || '';

                    return (
                      <Link href={`/catalog/${p.slug}`} key={p.id} className={styles.productCard}>
                        <div 
                          className={`${styles.productImg} ${!p.image_url ? TONE_CLASS[tone] : ''}`}
                          style={p.image_url ? { backgroundImage: `url('${p.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                        >
                          <span className={styles.sku}>{p.sku}</span>
                          {badge && (
                            <span className={`${styles.badge}${!badge.solid ? ` ${styles.badgeMuted}` : ''}`}>
                              {badge.text}
                            </span>
                          )}
                          {!p.image_url && (
                            <div className={styles.centerIcon}>
                              <CategoryIcon name={iconName} dark={isDark} />
                            </div>
                          )}
                        </div>
                        <div className={styles.productMeta}>
                          <div className={styles.productCat}>// {p.categories?.name}</div>
                          <h3 className={styles.productName}>{p.name}</h3>
                          <p className={styles.productAvail}>{getAvailText(p)}</p>
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

              {view === 'list' && (
                <div className={styles.productsList}>
                  {sortedProducts.map((p) => {
                    const catSlug = categories.find(c => c.id === p.category_id)?.slug || '';
                    const tone = getToneForCategory(catSlug);
                    const isDark = tone === 'cocoa' || tone === 'deep';
                    const badge = getBadge(p);
                    const iconName = categories.find(c => c.id === p.category_id)?.icon_name || '';

                    return (
                      <Link href={`/catalog/${p.slug}`} key={p.id} className={styles.listRow}>
                        <div className={styles.thumb}>
                          <div 
                            className={`${styles.productImg} ${!p.image_url ? TONE_CLASS[tone] : ''}`} 
                            style={p.image_url ? { backgroundImage: `url('${p.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center', aspectRatio: '1', border: 'none' } : { aspectRatio: '1', border: 'none' }}
                          >
                            {!p.image_url && (
                              <div className={styles.centerIcon}>
                                <CategoryIcon name={iconName} dark={isDark} />
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className={styles.catEyebrow}>// {p.categories?.name}</div>
                          <div className={styles.name}>{p.name}</div>
                        </div>
                        <div className={styles.metaCol}>{getAvailText(p)}</div>
                        <div className={styles.badgeCol}>
                          {badge && (
                            <span className={`${styles.badge}${badge.solid ? ` ${styles.solid}` : ''}`}>
                              {badge.text}
                            </span>
                          )}
                        </div>
                        <div className={styles.go}>→</div>
                      </Link>
                    );
                  })}
                </div>
              )}

              <div className={styles.loadMoreWrap}>
                <div className={styles.progressLabel}>Viewing {filtered.length} of {products.length} products</div>
                <div className={styles.progress}>
                  <div className={styles.progressFill} style={{ width: `${products.length === 0 ? 0 : (filtered.length / products.length) * 100}%` }} />
                </div>
                <button type="button" className="btn btn--outline-dark">
                  Load more <span className="arrow">↓</span>
                </button>
              </div>

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
                  <Link href="https://wa.me/919314093160" className="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
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
