import Link from 'next/link';
import styles from './AboutSection.module.css';
import { SiteStats, formatProductCount } from '@/lib/stats';

export default function AboutSection({ stats }: { stats: SiteStats }) {
  return (
    <section className="section" id="about">
      <div className={`container ${styles.about}`}>
        <div className={styles.aboutLeft}>
          <div className="eyebrow reveal-up">
            <span className="num">// 01</span>&nbsp;&nbsp;About Nobilitas
          </div>
          <h2 className="h-section reveal-left delay-1">
            your one-stop supplier for every workplace need.
          </h2>
          <div className={`${styles.meta} reveal-up delay-2`}>
            <strong>One inquiry, one quote, one supplier.</strong>
            <span>{stats.categoryCount} categories · {formatProductCount(stats.productCount)} products · 62 partner brands</span>
          </div>
        </div>

        <div className={`${styles.aboutRight} reveal-right delay-2`}>
          <p className="lede">
            Whether you are stocking a 5-star hotel or a corporate campus, our curated
            catalog is sourced from trusted brands and delivered pan-India. Twelve years
            in, we have built our practice on the idea that procurement should feel like
            one phone call, not seventeen.
          </p>
          <div>
            <Link href="/about" className="link-arrow">
              More about us <span className="arrow">→</span>
            </Link>
          </div>
          <div className={styles.aboutImage}>
            <span className={styles.caption}>// Showroom · Sansar Chandra Road, Jaipur</span>
          </div>
        </div>
      </div>
    </section>
  );
}
