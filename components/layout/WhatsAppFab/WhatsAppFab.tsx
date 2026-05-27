import Link from 'next/link';
import styles from './WhatsAppFab.module.css';

export default function WhatsAppFab() {
  return (
    <Link
      href="https://wa.me/919876543210"
      className={styles.waFab}
      aria-label="WhatsApp inquiry"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={styles.label}>Inquiry on WhatsApp</span>
      <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    </Link>
  );
}
