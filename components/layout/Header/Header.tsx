'use client';

/**
 * Header — sticky, transparent over hero, frosted-glass after scroll.
 * Detects home page route to apply .overHero state.
 * Mobile nav drawer with backdrop.
 */
import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  /* Scroll listener — transparent over hero on home, frosted everywhere else */
  const handleScroll = useCallback(() => {
    if (isHome) {
      setScrolled(window.scrollY > 24);
    } else {
      setScrolled(true); // always frosted on non-home pages
    }
  }, [isHome]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* Close mobile nav on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* Reveal animation observer */
  useEffect(() => {
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('reveal-in');
            ro.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    els.forEach((el) => ro.observe(el));

    // Failsafe — force reveal after 3 s
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach((el) => {
        if (!el.classList.contains('reveal-in')) el.classList.add('reveal-in');
      });
    }, 3000);

    return () => {
      ro.disconnect();
      clearTimeout(timer);
    };
  }, [pathname]); // re-run on page navigation

  /* Derived class */
  const overHero = isHome && !scrolled;
  const headerClass = [
    styles.siteHeader,
    overHero  ? styles.overHero : '',
    scrolled  ? styles.scrolled : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <header ref={headerRef} className={headerClass} id="siteHeader">
        <div className={`container ${styles.headerInner}`}>
          {/* Brand */}
          <Link href="/" className={styles.brand} aria-label="Nobilitas Ventures — Home">
            <div className={styles.brandMark}>
              <span>N</span>
            </div>
            <div className={styles.brandText}>
              <strong>Nobilitas</strong>
              <small>Ventures · Jaipur</small>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className={styles.nav} aria-label="Main navigation">
            <Link href="/about" className={pathname === '/about' ? styles.active : ''}>About</Link>
            <Link href="/catalog" className={pathname.startsWith('/catalog') ? styles.active : ''}>Catalog</Link>
            <Link href="/#featured">Why us</Link>
            <Link href="/#testimonials">Clients</Link>
            <Link href="/contact" className={pathname === '/contact' ? styles.active : ''}>Contact</Link>
          </nav>

          {/* Desktop CTA */}
          <div className={styles.headerCta}>
            <Link
              href="/#cta"
              className={`btn btn--outline-dark ${styles.ctaBtn}`}
            >
              Send inquiry <span className="arrow">↗</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className={styles.navToggle}
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <svg viewBox="0 0 24 24" strokeWidth="1.6" strokeLinecap="square">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`${styles.navBackdrop}${mobileOpen ? ` ${styles.open}` : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <aside className={`${styles.mobileNav}${mobileOpen ? ` ${styles.open}` : ''}`}>
        <button
          className={styles.mobileNavClose}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        >
          <svg viewBox="0 0 24 24" strokeWidth="1.6" strokeLinecap="square">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
        <Link href="/#about" onClick={() => setMobileOpen(false)}>about</Link>
        <Link href="/catalog" onClick={() => setMobileOpen(false)}>catalog</Link>
        <Link href="/#featured" onClick={() => setMobileOpen(false)}>why us</Link>
        <Link href="/#testimonials" onClick={() => setMobileOpen(false)}>clients</Link>
        <Link href="/#cta" onClick={() => setMobileOpen(false)}>contact</Link>
        <div style={{ marginTop: '32px' }}>
          <Link
            href="https://wa.me/919314093160"
            className="btn btn--whatsapp"
            onClick={() => setMobileOpen(false)}
          >
            WhatsApp inquiry <span className="arrow">→</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
