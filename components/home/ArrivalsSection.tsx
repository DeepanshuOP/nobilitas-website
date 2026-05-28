import styles from './ArrivalsSection.module.css';

import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';

const homeProducts = [
  { p: PRODUCTS.find(p => p.id === 'c01')!, img: '/ref/picture-1.avif', num: '001 / 03', avail: 'Available on inquiry' },
  { p: PRODUCTS.find(p => p.id === 'f01')!, img: '/ref/cta-picture.avif', num: '002 / 03', avail: 'Seats 12 · 10–14 day lead' },
  { p: PRODUCTS.find(p => p.id === 'g01')!, img: '/ref/category.avif', num: '003 / 03', avail: 'MOQ 25 · custom branding' },
];

const delays = ['delay-1', 'delay-2', 'delay-3'] as const;

export default function ArrivalsSection() {
  return (
    <section className={`section ${styles.arrivals}`} id="arrivals">
      <div className="container">
        <div className={styles.arrivalsHead}>
          <div className="left">
            <div className="eyebrow reveal-up">
              <span className="num">// 04</span>&nbsp;&nbsp;New arrivals
            </div>
            <h2 className="h-section reveal-up delay-1">
              freshly sourced. <em>ready</em> to quote.
            </h2>
          </div>
          <div className="right reveal-up delay-2">
            <p className="lede">
              Curated each month from the brands we partner with.
              Tell us what catches your eye — we will quote within four working hours.
            </p>
          </div>
        </div>

        <div className={styles.arrivalsGrid}>
          {homeProducts.map(({ p, img, num, avail }, i) => (
            <Link href={`/catalog/${p.id}`} key={p.sku} className={`${styles.productCard} reveal-up ${delays[i]}`}>
              <div
                className={styles.productImg}
                style={{ backgroundImage: `url('${img}')` }}
              >
                <span className={styles.sku}>{p.sku}</span>
                <span className={styles.pnum}>{num}</span>
                <span className={styles.pcat}>// {p.cat.toLowerCase()}</span>
              </div>
              <div className={styles.productMeta}>
                <h3 className={styles.productName}>{p.name}</h3>
                <div className={styles.productFoot}>
                  <span className={styles.avail}>{avail}</span>
                  <span className={styles.view}>
                    View details <span className={styles.arrow}>→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
