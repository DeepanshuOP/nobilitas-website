import Link from 'next/link';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBg} />

      <div className={styles.heroTopBar}>
        <div className={`${styles.label} reveal-up reveal-in delay-1`}>
          <span>// Workplace supplier · est. 2014</span>
        </div>
        <div className={`${styles.est} reveal-up reveal-in delay-2`}>— Jaipur, India</div>
      </div>

      <div className={styles.heroBottom}>
        <div className={styles.heroHeadline}>
          <h1 className="h-display reveal-left reveal-in">
            equipping india&apos;s <em>finest</em> workplaces.
          </h1>
        </div>
        <div className={`${styles.heroSubtext} reveal-right reveal-in delay-2`}>
          <p className="lede">
            A single trusted supplier for cleaning, furniture, electronics, and everything
            else your office, hotel, or factory runs on. Pan-India delivery from Jaipur.
          </p>
          <div className={styles.heroCtaRow}>
            <Link href="/catalog" className="btn btn--cream">
              Browse the catalog <span className="arrow">→</span>
            </Link>
            <Link href="/#cta" className="btn btn--outline-dark">
              Send an inquiry <span className="arrow">↗</span>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.heroScroll}>
        <span className={styles.label}>Scroll</span>
        <div className={styles.bar} />
      </div>
    </section>
  );
}
