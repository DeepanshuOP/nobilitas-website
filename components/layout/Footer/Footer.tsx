import Link from 'next/link';
import { COMPANY } from '@/lib/siteData';
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
            <Link href={`https://wa.me/${COMPANY.whatsapp}`} className="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
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
              <li><Link href={`tel:${COMPANY.phone.replace(/ /g, '')}`}>{COMPANY.phone}</Link></li>
              <li><Link href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp · 24×7</Link></li>
              <li>
                <Link href={`mailto:${COMPANY.email}`}>Sales enquiries</Link>
                <div className={styles.monoLine}>{COMPANY.email}</div>
              </li>
              <li>
                <span>{COMPANY.name}</span>
                <div className={styles.monoLine}>
                  {COMPANY.addressLine1},<br />{COMPANY.addressLine2}, {COMPANY.city}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant wordmark */}
        <div className={`${styles.wordmark} reveal-up`} aria-hidden="true">nobilitas.</div>

        <div className={styles.footerBottom}>
          <div className="left">
            <span>GSTIN · {COMPANY.gst}</span>
            <span>Estd. Jaipur {COMPANY.estd}</span>
            <span>© 2026 {COMPANY.name}</span>
          </div>
          <div>All inquiries answered within 4 working hours.</div>
        </div>
      </div>
    </footer>
  );
}
