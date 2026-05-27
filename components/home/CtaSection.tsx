import Link from 'next/link';
import styles from './CtaSection.module.css';

export default function CtaSection() {
  return (
    <section className={styles.cta} id="cta">
      <div className="container">
        <div className={styles.ctaInner}>
          {/* Left photo */}
          <div className={`${styles.ctaPhoto} ${styles.ctaPhotoLeft} reveal-left`}>
            <span className={styles.tag}>// Jaipur showroom</span>
          </div>

          {/* Content */}
          <div className={`${styles.ctaContent} reveal-up delay-1`}>
            <div className="eyebrow">
              <span className="num">// 08</span>&nbsp;&nbsp;Get in touch
            </div>
            <h2 className="h-section">
              ready to simplify your <em>procurement?</em>
            </h2>
            <p className="lede">
              WhatsApp us a list. We respond with sourcing, pricing, and lead times
              within four working hours.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="https://wa.me/919876543210" className="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                WhatsApp your inquiry
              </Link>
              <Link href="/contact" className="btn btn--outline-gold">
                Or fill the contact form <span className="arrow">↗</span>
              </Link>
            </div>
            <div className={styles.ctaDivider} />
          </div>

          {/* Right photo */}
          <div className={`${styles.ctaPhoto} ${styles.ctaPhotoRight} reveal-right delay-2`}>
            <span className={styles.tag}>— since 2014</span>
          </div>
        </div>
      </div>
    </section>
  );
}
