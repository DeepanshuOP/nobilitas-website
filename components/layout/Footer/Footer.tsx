import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerTop}>
          {/* Brand */}
          <div className={styles.footerBrand}>
            <div className={styles.brand}>
              <div className={styles.brandMark}>
                <span>N</span>
              </div>
              <div className={styles.brandText}>
                <strong>Nobilitas</strong>
                <small>Ventures · Jaipur</small>
              </div>
            </div>
            <p className={styles.tagline}>
              Equipping India&apos;s finest workplaces — quietly, since 2014.
            </p>
            <Link href="https://wa.me/919876543210" className="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
              WhatsApp inquiry <span className="arrow">→</span>
            </Link>
          </div>

          {/* Catalog */}
          <div className={styles.footerCol}>
            <h5>Catalog</h5>
            <ul>
              <li><Link href="/catalog">Cleaning &amp; hygiene</Link></li>
              <li><Link href="/catalog">Office furniture</Link></li>
              <li><Link href="/catalog">Electronics</Link></li>
              <li><Link href="/catalog">Pantry &amp; cafeteria</Link></li>
              <li><Link href="/catalog">Corporate gifts</Link></li>
              <li><Link href="/catalog">View all →</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className={styles.footerCol}>
            <h5>Company</h5>
            <ul>
              <li><Link href="/#about">About</Link></li>
              <li><Link href="/#featured">Brands we carry</Link></li>
              <li><Link href="/#testimonials">Clients</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Press</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.footerCol}>
            <h5>Contact</h5>
            <ul>
              <li><Link href="tel:+919876543210">+91 98765 43210</Link></li>
              <li><Link href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">WhatsApp · 24×7</Link></li>
              <li>
                <Link href="mailto:sales@nobilitas.in">Sales enquiries</Link>
                <div className={styles.monoLine}>sales@nobilitas.in</div>
              </li>
              <li>
                <span>Nobilitas Ventures LLP</span>
                <div className={styles.monoLine}>
                  12, Sansar Chandra Road,<br />Jaipur 302001
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant wordmark */}
        <div className={`${styles.wordmark} reveal-up`} aria-hidden="true">nobilitas.</div>

        <div className={styles.footerBottom}>
          <div className="left">
            <span>GSTIN · 08AAJFN1234L1Z5</span>
            <span>Estd. Jaipur 2014</span>
            <span>© 2026 Nobilitas Ventures LLP</span>
          </div>
          <div>All inquiries answered within 4 working hours.</div>
        </div>
      </div>
    </footer>
  );
}
