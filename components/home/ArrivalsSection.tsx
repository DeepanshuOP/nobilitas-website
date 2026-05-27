import styles from './ArrivalsSection.module.css';

const PRODUCTS = [
  {
    img: '/ref/picture-1.avif',
    sku: 'CL · FS-60',
    num: '001 / 03',
    cat: '// cleaning & hygiene',
    name: 'industrial floor scrubber — 60L capacity',
    avail: 'Available on inquiry',
  },
  {
    img: '/ref/cta-picture.avif',
    sku: 'OF · CT-W24',
    num: '002 / 03',
    cat: '// office furniture',
    name: 'executive conference table — walnut finish',
    avail: 'Seats 12 · 10–14 day lead',
  },
  {
    img: '/ref/category.avif',
    sku: 'CG · MH-24',
    num: '003 / 03',
    cat: '// corporate gifts',
    name: 'diwali hamper — mehfil edition, 24-piece',
    avail: 'MOQ 25 · custom branding',
  },
] as const;

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
          {PRODUCTS.map((p, i) => (
            <article key={p.sku} className={`${styles.productCard} reveal-up ${delays[i]}`}>
              <div
                className={styles.productImg}
                style={{ backgroundImage: `url('${p.img}')` }}
              >
                <span className={styles.sku}>{p.sku}</span>
                <span className={styles.pnum}>{p.num}</span>
                <span className={styles.pcat}>{p.cat}</span>
              </div>
              <div className={styles.productMeta}>
                <h3 className={styles.productName}>{p.name}</h3>
                <div className={styles.productFoot}>
                  <span className={styles.avail}>{p.avail}</span>
                  <span className={styles.view}>
                    View details <span className={styles.arrow}>→</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
