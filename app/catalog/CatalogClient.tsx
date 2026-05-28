'use client';

import { useState, useMemo, useEffect } from 'react';
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
  productCount: number;
  categoryCount: number;
}

export default function CatalogClient({ products, categories, productCount, categoryCount }: CatalogClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState('Featured');
  const [search, setSearch] = useState('');

  const ITEMS_PER_PAGE = 12;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const filteredProducts = useMemo(() => {
    let result = activeFilter === 'All'
      ? products
      : products.filter(p => p.category_id === activeFilter);
    
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    return result;
  }, [products, activeFilter, search]);

  useEffect(() => { setVisibleCount(ITEMS_PER_PAGE); }, [activeFilter, search]);

  // Compute how many products belong to each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts['All'] = products.length;
    categories.forEach(cat => {
      counts[cat.id] = products.filter(p => p.category_id === cat.id).length;
    });
    return counts;
  }, [products, categories]);

  const totalCount = String(products.length).padStart(2, '0');

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'A → Z') return a.name.localeCompare(b.name);
    if (sort === 'Newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sort === 'Most inquired') return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    return 0;
  });

  const displayedProducts = sortedProducts.slice(0, visibleCount);

  const getAvailText = (p: ProductWithCategory) => {
    return p.status === 'out_of_stock' ? 'Currently unavailable'
    : p.status === 'on_request' ? 'Available on request'
    : p.pack_sizes && p.pack_sizes.length > 0
    ? p.pack_sizes.join(' · ')
    : 'Available on inquiry';
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
                <><span key={productCount} className={styles.headCount}>{productCount}</span> <em>products</em>.</>
              ) : (
                <><span key={filteredProducts.length} className={styles.headCount}>{filteredProducts.length}</span> <em>{categories.find(c => c.id === activeFilter)?.name.toLowerCase()}</em>.</>
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
              { num: categoryCount.toString(), lbl: 'Categories' },
              { num: '62', lbl: 'Partner brands' },
              { num: '26', lbl: 'States served' },
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


            </aside>

            <div>
              <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                  <span className={styles.filterLabel}>
                    // {activeFilter === 'All' ? 'All' : categories.find(c => c.id === activeFilter)?.name}
                  </span>
                  <span className={styles.countText}>
                    showing <strong>{filteredProducts.length}</strong> of {products.length} products
                  </span>
                </div>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
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

              {filteredProducts.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyStateTitle}>
                    {search.trim() ? `No products found for '${search}'.` : `No products listed yet in this category.`}
                  </p>
                  <p className={styles.emptyStateBody}>
                    {search.trim() ? `Try a different search term or browse by category.` : `We supply across all categories — send us an inquiry and we will source exactly what you need.`}
                  </p>
                  {search.trim() ? (
                    <button onClick={() => setSearch('')} className="btn btn--outline-dark" style={{ marginTop: 8 }}>
                      Clear search
                    </button>
                  ) : (
                    <>
                      <a
                        href={`https://wa.me/919314093160?text=Hi, I need products from the ${activeFilter === 'All' ? 'All' : (categories.find(c => c.id === activeFilter)?.name ?? 'this category')} category`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--whatsapp"
                        style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 10 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                        </svg>
                        Inquire on WhatsApp
                      </a>
                      <a href="/contact" className="btn btn--outline-dark" style={{ marginTop: 8 }}>
                        Or send an inquiry form
                      </a>
                    </>
                  )}
                </div>
              ) : (
                <>
                  {view === 'grid' && (
                    <div className={styles.productsGrid}>
                      {displayedProducts.map((p, index) => {
                    const catSlug = categories.find(c => c.id === p.category_id)?.slug || '';
                    const tone = getToneForCategory(catSlug);
                    const isDark = tone === 'cocoa' || tone === 'deep';
                    const badge = getBadge(p);
                    const iconName = categories.find(c => c.id === p.category_id)?.icon_name || '';

                    return (
                      <Link href={`/catalog/${p.slug}`} key={`${activeFilter}-${p.id}`} className={`${styles.productCard} ${styles.productCardAnimated}`} style={{ animationDelay: `${(index % 6) * 60}ms` }}>
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
                      {displayedProducts.map((p, index) => {
                    const catSlug = categories.find(c => c.id === p.category_id)?.slug || '';
                    const tone = getToneForCategory(catSlug);
                    const isDark = tone === 'cocoa' || tone === 'deep';
                    const badge = getBadge(p);
                    const iconName = categories.find(c => c.id === p.category_id)?.icon_name || '';

                    return (
                      <Link href={`/catalog/${p.slug}`} key={`${activeFilter}-${p.id}`} className={`${styles.listRow} ${styles.productCardAnimated}`} style={{ animationDelay: `${(index % 6) * 60}ms` }}>
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
                </>
              )}

              {filteredProducts.length > ITEMS_PER_PAGE && (
                <div className={styles.loadMoreWrap}>
                  <div className={styles.progressLabel}>Viewing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} products</div>
                  <div className={styles.progress}>
                    <div className={styles.progressFill} style={{ width: `${filteredProducts.length === 0 ? 0 : (Math.min(visibleCount, filteredProducts.length) / filteredProducts.length) * 100}%` }} />
                  </div>
                  {visibleCount < filteredProducts.length && (
                    <button type="button" className="btn btn--outline-dark" onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}>
                      Load more <span className="arrow">↓</span>
                    </button>
                  )}
                </div>
              )}

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
