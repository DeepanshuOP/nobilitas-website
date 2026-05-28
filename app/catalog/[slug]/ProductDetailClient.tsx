'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ICON_PATHS, ProductTone } from '@/lib/products';
import { ProductWithCategory } from '@/lib/types';
import styles from './page.module.css';

const TONE_CLASS: Record<ProductTone, string> = {
  warm: styles.toneWarm,
  sage: styles.toneSage,
  cocoa: styles.toneCocoa,
  deep: styles.toneDeep,
  default: styles.toneDefault,
};

const CYCLE_TONES: ProductTone[] = ['warm', 'deep', 'cocoa', 'sage', 'default'];

function getToneForCategory(slug?: string): ProductTone {
  if (!slug) return 'default';
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

interface ProductDetailClientProps {
  product: ProductWithCategory;
  relatedProducts: ProductWithCategory[];
  images: string[];
}

export default function ProductDetailClient({ product, relatedProducts, images }: ProductDetailClientProps) {
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getAnimStyle = (
    translateType: 'Y' | 'X' | 'none',
    translateVal: number,
    delayMs: number,
    durationMs: number
  ) => {
    const easeOut = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const transform = translateType === 'none' 
      ? 'none' 
      : `translate${translateType}(${mounted ? 0 : translateVal}px)`;
    return {
      opacity: mounted ? 1 : 0,
      transform,
      transition: `opacity ${durationMs}ms ${easeOut} ${delayMs}ms, transform ${durationMs}ms ${easeOut} ${delayMs}ms`
    };
  };

  const mainTone = CYCLE_TONES[activeThumb % CYCLE_TONES.length];
  const isMainDark = mainTone === 'cocoa' || mainTone === 'deep';

  const currentImage = images[activeThumb] || null;

  const categoryName = product.categories?.name || 'Uncategorized';
  const categorySlug = product.categories?.slug;
  const iconName = product.categories?.icon_name || '';

  const getBadge = (p: ProductWithCategory) => {
    if (p.is_new_arrival) return { text: 'New arrival', solid: true };
    if (p.is_featured) return { text: 'Bestseller', solid: true };
    if (p.status === 'on_request') return { text: 'Available on request', solid: false };
    if (p.status === 'out_of_stock') return { text: 'Currently unavailable', solid: false };
    return { text: 'Available on inquiry', solid: false };
  };

  const badge = getBadge(product);

  const specs = [
    { label: 'SKU', value: product.sku, mono: true },
    { label: 'Brand', value: product.brand, mono: false },
    { label: 'Pack sizes', value: product.pack_sizes?.join(', '), mono: false },
    { label: 'Unit', value: product.unit, mono: false },
    { label: 'Min. order qty', value: product.min_order_qty ? `${product.min_order_qty} ${product.unit}` : '', mono: false },
    { label: 'Applications', value: product.application?.join(', '), mono: false },
    { label: 'Tags', value: product.tags?.join(', '), mono: false },
  ].filter(row => row.value && row.value.trim() !== '' && row.value !== '0 ');

  const certificationsList = (product.certifications || '')
    .split(',')
    .map(c => c.trim())
    .filter(c => c.length > 0);

  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in: ${product.name} (SKU: ${product.sku})`);
  const whatsappHref = `https://wa.me/919314093160?text=${whatsappMessage}`;

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb} style={getAnimStyle('Y', -8, 0, 400)}>
        <Link href="/">Home</Link>
        <span className={styles.bcSep}>/</span>
        <Link href="/catalog">Catalog</Link>
        <span className={styles.bcSep}>/</span>
        <span className={styles.bcCurrentCat}>{categoryName}</span>
        <span className={styles.bcSep}>/</span>
        <span className={styles.bcCurrentName}>
          {product.name.length > 40 ? product.name.slice(0, 40) + '...' : product.name}
        </span>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.gallery}>
          <div
            className={`${styles.mainImage} ${!currentImage ? TONE_CLASS[mainTone] : styles.hasImage}`}
            style={{
              ...(currentImage ? { backgroundImage: `url('${currentImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
              ...getAnimStyle('X', -24, 100, 640)
            }}
          >
            {!currentImage && <div className={styles.jaliOverlay} />}
            <div className={styles.skuTag}>{product.sku}</div>
            {!currentImage && (
              <div className={styles.centerIcon}>
                <CategoryIcon name={iconName} dark={isMainDark} />
              </div>
            )}

            {images.length >= 2 && (
              <>
                <button
                  type="button"
                  className={`${styles.galleryArrow} ${styles.galleryArrowLeft}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveThumb(prev => prev === 0 ? images.length - 1 : prev - 1);
                  }}
                  aria-label="Previous image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--fg-1)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`${styles.galleryArrow} ${styles.galleryArrowRight}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveThumb(prev => prev === images.length - 1 ? 0 : prev + 1);
                  }}
                  aria-label="Next image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--fg-1)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className={styles.thumbnails}>
              {images.map((imgUrl, i) => {
                return (
                  <div
                    key={i}
                    className={`${styles.thumb} ${activeThumb === i ? styles.thumbActive : ''}`}
                    style={{ backgroundImage: `url('${imgUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    onClick={() => setActiveThumb(i)}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.info}>
          <div className={styles.sectionLabel} style={getAnimStyle('none', 0, 80, 400)}>// {categoryName} · Catalog</div>

          <h1 className={styles.title} style={getAnimStyle('Y', 16, 160, 600)}>{product.name}</h1>

          <div className={styles.badgesRow} style={getAnimStyle('none', 0, 240, 400)}>
            <span className={`${styles.badge} ${badge.solid ? styles.badgeSolid : styles.badgeOutline}`}>
              {badge.text}
            </span>
            <span className={`${styles.badge} ${styles.badgeSupplier}`}>Supplied by Nobilitas</span>
          </div>

          <div className={styles.brand} style={getAnimStyle('none', 0, 280, 400)}>// {product.brand}</div>

          <p className={styles.description} style={getAnimStyle('Y', 8, 320, 480)}>{product.description}</p>

          <div className={styles.specsGrid} style={getAnimStyle('none', 0, 400, 480)}>
            {[
              { label: 'MOQ', value: product.min_order_qty ? `${product.min_order_qty} ${product.unit}` : 'On inquiry', mono: false },
              { label: 'Pack sizes', value: product.pack_sizes?.join(', ') || 'Custom', mono: false },
              { label: 'Delivery', value: 'Pan-India', mono: false },
              { label: 'Brand', value: product.brand, mono: false },
              { label: 'SKU', value: product.sku, mono: true },
            ].map((s) => (
              <div key={s.label} className={styles.specItem}>
                <span className={styles.specLabel}>{s.label}</span>
                <span className={`${styles.specValue} ${s.mono ? styles.specValueMono : ''}`}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.ctaWrap} style={getAnimStyle('Y', 12, 480, 520)}>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn--whatsapp ${styles.btnFull}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{ marginRight: '4px' }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.027 6.988 2.895a9.86 9.86 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Request a quote on WhatsApp
            </a>
            <Link href="/contact" className={`btn btn--outline-dark ${styles.btnFull}`}>
              Or send an inquiry form →
            </Link>
          </div>

          <p className={styles.finePrint}>
            Your inquiry is with our team. Expect a WhatsApp reply within 4 working hours.
          </p>
        </div>
      </div>

      <div className={styles.tabsSection}>
        <div className={styles.tabBar}>
          {['Specifications', 'Brand & certifications', 'Delivery & MOQ'].map((tab, i) => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === i ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab(i as 0 | 1 | 2)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 0 && (
          <div>
            {specs.map((spec, i) => (
              <div key={i} className={styles.tabRow}>
                <span className={styles.tabRowLabel}>{spec.label}</span>
                <span className={styles.tabRowValue}>{spec.value}</span>
              </div>
            ))}
            {product.notes && product.notes.trim() !== '' && (
              <p style={{ marginTop: 24, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-3)' }}>
                Note: {product.notes}
              </p>
            )}
          </div>
        )}

        {activeTab === 1 && (
          <div>
            <p className={`${styles.tabText} ${styles.tabTextTop}`}>
              All products supplied by Nobilitas are sourced from manufacturers vetted on quality, compliance, and post-sale support.
            </p>
            {certificationsList.length > 0 && (
              <div className={styles.certWrap}>
                {certificationsList.map((c, i) => (
                  <span key={i} className={styles.certBadge}>{c}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div>
            {[
              { label: 'Minimum order quantity', value: product.min_order_qty ? `${product.min_order_qty} ${product.unit}` : 'On inquiry' },
              { label: 'Lead time from Jaipur', value: '5-14 working days (faster on stocked items)' },
              { label: 'Delivery coverage', value: 'Pan-India' },
            ].map((spec, i) => (
              <div key={i} className={styles.tabRow}>
                <span className={styles.tabRowLabel}>{spec.label}</span>
                <span className={styles.tabRowValue}>{spec.value}</span>
              </div>
            ))}
            <p className={`${styles.tabText} ${styles.tabTextBottom}`}>
              We ship pan-India from our warehouse in Sitapura, Jaipur. For bulk orders, consolidated shipping and installation services are available. Payment terms on inquiry — typically 50% advance, 50% on delivery.
            </p>
          </div>
        )}
      </div>

      <div className={styles.relatedSection}>
        <div className={styles.sectionLabel}>// Also from Nobilitas</div>
        <h2 className={styles.relatedTitle}>
          more in <em>{categoryName.toLowerCase()}.</em>
        </h2>

        {relatedProducts.length === 0 ? (
          <p className={styles.noRelated}>
            No related products found.{' '}
            <Link href="/catalog">Browse the full catalog →</Link>
          </p>
        ) : (
          <div
            className={styles.relatedGrid}
            style={{ gridTemplateColumns: `repeat(${Math.min(3, relatedProducts.length)}, 1fr)` }}
          >
            {relatedProducts.map((p) => {
              const catSlug = p.categories?.slug || '';
              const tone = getToneForCategory(catSlug);
              const isDark = tone === 'cocoa' || tone === 'deep';

              let pBadge = { text: 'Available', solid: false };
              if (p.is_new_arrival) pBadge = { text: 'New', solid: true };
              else if (p.is_featured) pBadge = { text: 'Featured', solid: true };
              else if (p.status === 'out_of_stock') pBadge = { text: 'Out of stock', solid: false };
              else if (p.status === 'on_request') pBadge = { text: 'On request', solid: false };

              const pAvail = p.pack_sizes && p.pack_sizes.length > 0 ? p.pack_sizes[0] : 'Available on inquiry';

              return (
                <Link href={`/catalog/${p.slug}`} key={p.id} className={styles.productCard}>
                  <div
                    className={`${styles.productImg} ${!p.image_url ? TONE_CLASS[tone] : ''}`}
                    style={p.image_url ? { backgroundImage: `url('${p.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                  >
                    <span className={styles.sku}>{p.sku}</span>
                    <span className={`${styles.cardBadge} ${!pBadge.solid ? styles.cardBadgeMuted : ''}`}>
                      {pBadge.text}
                    </span>
                    {!p.image_url && (
                      <div className={styles.centerIcon}>
                        <CategoryIcon name={p.categories?.icon_name || ''} dark={isDark} />
                      </div>
                    )}
                  </div>
                  <div className={styles.productMeta}>
                    <div className={styles.productCat}>// {p.categories?.name || 'Category'}</div>
                    <h3 className={styles.productName}>{p.name}</h3>
                    <p className={styles.productAvail}>{pAvail}</p>
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
      </div>
    </div>
  );
}
