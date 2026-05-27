import Link from 'next/link';
import styles from './FeaturedSection.module.css';

const BULLETS = [
  'One purchase order covers every category',
  'Quote within four working hours, guaranteed',
  'Pan-India delivery from Jaipur',
] as const;

export default function FeaturedSection() {
  return (
    <section className="section" id="featured">
      <div className={`container ${styles.featured}`}>
        <div className={`${styles.featuredImage} reveal-left`}>
          <span className={styles.badge}>// 05 · Why Nobilitas</span>
          <div className={styles.signature}>
            <div className={styles.label}>— Partner brands</div>
            <div className={styles.name}>Diversey · 3M · Godrej · Philips</div>
          </div>
        </div>

        <div className={`${styles.featuredContent} reveal-right delay-2`}>
          <div className="eyebrow">
            <span className="num">// 05</span>&nbsp;&nbsp;Why Nobilitas
          </div>
          <h2 className="h-section">
            not the cheapest. the <em>most reliable.</em>
          </h2>
          <p className="lede">
            We carry Diversey, 3M, Godrej Interio, Kimberly-Clark, and Philips — vetted
            for quality, pricing, and post-sale service. Many of our category leads have
            been with us since 2014.
          </p>
          <ul className={styles.featuredBullets}>
            {BULLETS.map((text, i) => (
              <li key={text}>
                <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
                <span>{text}</span>
                <span className={styles.check}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M5 12l5 5 9-11" />
                  </svg>
                </span>
              </li>
            ))}
          </ul>
          <div>
            <Link href="/catalog" className="btn btn--dark">
              Browse the catalog <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
