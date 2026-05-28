'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductById, getRelatedProducts, ICON_PATHS, ProductTone } from '@/lib/products';
import styles from './page.module.css';

const TONE_CLASS: Record<ProductTone, string> = {
  warm: styles.toneWarm,
  sage: styles.toneSage,
  cocoa: styles.toneCocoa,
  deep: styles.toneDeep,
  default: styles.toneDefault,
};

const CYCLE_TONES: ProductTone[] = ['warm', 'deep', 'cocoa', 'sage', 'default'];

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

export default function ProductDetail() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = id ? getProductById(id) : undefined;
  
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Product not found</h2>
        <Link href="/catalog" className="btn btn--outline-dark">
          Browse the full catalog →
        </Link>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product);
  const mainTone = CYCLE_TONES[activeThumb % CYCLE_TONES.length];
  const isMainDark = mainTone === 'cocoa' || mainTone === 'deep';

  return (
    <div className={styles.container}>
      {/* ── Breadcrumb ── */}
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link>
        <span className={styles.bcSep}>/</span>
        <Link href="/catalog">Catalog</Link>
        <span className={styles.bcSep}>/</span>
        <span className={styles.bcCurrentCat}>{product.cat}</span>
        <span className={styles.bcSep}>/</span>
        <span className={styles.bcCurrentName}>
          {product.name.length > 40 ? product.name.slice(0, 40) + '...' : product.name}
        </span>
      </div>

      {/* ── Main Grid ── */}
      <div className={styles.mainGrid}>
        
        {/* LEFT: Image gallery */}
        <div className={styles.gallery}>
          <div className={`${styles.mainImage} ${TONE_CLASS[mainTone]}`}>
            <div className={styles.jaliOverlay} />
            <div className={styles.skuTag}>{product.sku}</div>
            <div className={styles.centerIcon}>
              <CategoryIcon name={product.icon} dark={isMainDark} />
            </div>
          </div>
          
          <div className={styles.thumbnails}>
            {[0, 1, 2, 3, 4].map((i) => {
              const tone = CYCLE_TONES[i % CYCLE_TONES.length];
              const isDark = tone === 'cocoa' || tone === 'deep';
              return (
                <div
                  key={i}
                  className={`${styles.thumb} ${TONE_CLASS[tone]} ${activeThumb === i ? styles.thumbActive : ''}`}
                  onClick={() => setActiveThumb(i)}
                >
                  <div className={styles.jaliOverlay} />
                  <div className={styles.centerIcon} style={{ transform: 'scale(0.5)' }}>
                    <CategoryIcon name={product.icon} dark={isDark} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Product info */}
        <div className={styles.info}>
          <div className={styles.sectionLabel}>// {product.cat} · Catalog</div>
          
          <h1 className={styles.title}>{product.name}</h1>
          
          <div className={styles.badgesRow}>
            {product.badge && (
              <span className={`${styles.badge} ${product.solid ? styles.badgeSolid : styles.badgeOutline}`}>
                {product.badge}
              </span>
            )}
            <span className={`${styles.badge} ${styles.badgeInquiry}`}>Available on inquiry</span>
            <span className={`${styles.badge} ${styles.badgeSupplier}`}>Supplied by Nobilitas</span>
          </div>

          <div className={styles.brand}>// {product.brand}</div>
          
          <p className={styles.description}>{product.description}</p>

          <div className={styles.specsGrid}>
            {[
              { label: 'MOQ', value: product.moq, mono: false },
              { label: 'Lead time', value: product.leadTime, mono: true },
              { label: 'Delivery', value: product.delivery, mono: false },
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

          <div className={styles.ctaWrap}>
            <a
              href={`https://wa.me/919876543210?text=Hi, I'm interested in: ${product.name} (SKU: ${product.sku})`}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn--whatsapp ${styles.btnFull}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{ marginRight: '4px' }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.027 6.988 2.895a9.86 9.86 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
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

      {/* ── Tabs Section ── */}
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
            {product.specs.map((spec, i) => (
              <div key={i} className={styles.tabRow}>
                <span className={styles.tabRowLabel}>{spec.label}</span>
                <span className={styles.tabRowValue}>{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 1 && (
          <div>
            <p className={`${styles.tabText} ${styles.tabTextTop}`}>
              All products supplied by Nobilitas are sourced from manufacturers vetted on quality, compliance, and post-sale support.
            </p>
            <div className={styles.certWrap}>
              {product.certifications.map((c, i) => (
                <span key={i} className={styles.certBadge}>{c}</span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div>
            {[
              { label: 'Minimum order quantity', value: product.moq },
              { label: 'Lead time from Jaipur', value: product.leadTime },
              { label: 'Delivery coverage', value: product.delivery },
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

      {/* ── Related Products ── */}
      <div className={styles.relatedSection}>
        <div className={styles.sectionLabel}>// Also from Nobilitas</div>
        <h2 className={styles.relatedTitle}>
          more in <em>{product.cat.toLowerCase()}.</em>
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
              const isDark = p.tone === 'cocoa' || p.tone === 'deep';
              return (
                <Link href={`/catalog/${p.id}`} key={p.id} className={styles.productCard}>
                  <div className={`${styles.productImg} ${TONE_CLASS[p.tone]}`}>
                    <span className={styles.sku}>{p.sku}</span>
                    {p.badge && (
                      <span className={`${styles.cardBadge} ${!p.solid ? styles.cardBadgeMuted : ''}`}>
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
      </div>
    </div>
  );
}
