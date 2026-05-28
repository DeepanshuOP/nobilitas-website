'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';

// ─── Light-theme tokens ───────────────────────────────────────────────────────
const T = {
  bgCanvas:   '#f5f1ea',
  bgScrolled: 'rgba(245,241,234,0.88)',
  border:     'rgba(15,15,15,0.08)',
  borderGold: 'rgba(201,169,110,0.28)',
  fg1:        '#0f0f0f',
  fg2:        '#564f40',
  fg3:        '#7d7560',
  gold:       '#c9a96e',
  goldBg:     'rgba(201,169,110,0.06)',
  ease:       'cubic-bezier(0.22,1,0.36,1)',
  fontSerif:  "'Playfair Display', Georgia, serif",
  fontSans:   "'Inter', system-ui, sans-serif",
} as const;

// ─── Nav items ────────────────────────────────────────────────────────────────
interface NavItem { label: string; href: string }
const NAV_ITEMS: NavItem[] = [
  { label: 'Home',    href: '/' },
  { label: 'Catalog', href: '/products' },
  { label: 'About',   href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// ─── Desktop NavLink ──────────────────────────────────────────────────────────
function NavLink({ label, href, pathname }: NavItem & { pathname: string }) {
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
  const [hovered, setHovered] = useState(false);
  const highlighted = isActive || hovered;

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:      'relative',
        paddingBottom: '4px',
        fontFamily:    T.fontSans,
        fontSize:      '13px',
        fontWeight:    400,
        letterSpacing: '0.04em',
        // active/hover → onyx; idle → secondary text
        color:         highlighted ? T.fg1 : T.fg2,
        textDecoration:'none',
        transition:    `color 240ms ${T.ease}`,
        whiteSpace:    'nowrap',
      }}
    >
      {label}
      {/* Gold underline */}
      <span
        aria-hidden
        style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          height:     '1px',
          background: T.gold,
          width:      '100%',
          transformOrigin: 'left',
          transform:  highlighted ? 'scaleX(1)' : 'scaleX(0)',
          transition: `transform 240ms ${T.ease}`,
        }}
      />
    </Link>
  );
}

// ─── Mobile drawer link ───────────────────────────────────────────────────────
function DrawerLink({
  label, href, pathname, onClose,
}: NavItem & { pathname: string; onClose: () => void }) {
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
  return (
    <Link
      href={href}
      onClick={onClose}
      style={{
        display:       'block',
        fontFamily:    T.fontSans,
        fontSize:      '15px',
        fontWeight:    400,
        letterSpacing: '0.02em',
        color:         isActive ? T.fg1 : T.fg2,
        textDecoration:'none',
        padding:       '12px 0',
        borderBottom:  `1px solid ${T.border}`,
        transition:    `color 240ms ${T.ease}`,
      }}
    >
      {label}
    </Link>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
export default function Header() {
  const pathname            = usePathname();
  const [scrolled, setScrolled]     = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <>
      {/* ── Header bar ─────────────────────────────────────────────────────── */}
      <header
        style={{
          position:           'sticky',
          top:                0,
          zIndex:             50,
          background:         scrolled ? T.bgScrolled : 'transparent',
          backdropFilter:     scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom:       scrolled ? `1px solid ${T.border}` : '1px solid transparent',
          transition:         `background 240ms ${T.ease}, border-color 240ms ${T.ease}`,
        }}
      >
        <div
          style={{
            maxWidth:       '1320px',
            margin:         '0 auto',
            padding:        'clamp(18px,2.5vw,18px) clamp(20px,4vw,48px)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            gap:            '32px',
          }}
        >
          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link
            href="/"
            style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden>
              <polygon points="4,0 8,4 4,8 0,4" fill={T.gold} />
            </svg>
            <span style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
              <span style={{
                fontFamily:    T.fontSerif,
                fontWeight:    500,
                fontSize:      '20px',
                color:         T.fg1,          // #0f0f0f on light bg
                letterSpacing: '0.01em',
              }}>
                Nobilitas
              </span>
              <span style={{
                fontFamily:    T.fontSans,
                fontWeight:    300,
                fontSize:      '9px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color:         T.fg3,          // #7d7560 muted
                marginTop:     '2px',
              }}>
                Ventures
              </span>
            </span>
          </Link>

          {/* ── Desktop nav ──────────────────────────────────────────────── */}
          <nav
            aria-label="Primary navigation"
            className="header-desktop-nav"
            style={{ display:'none', alignItems:'center', gap:'32px' }}
          >
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} {...item} pathname={pathname} />
            ))}
          </nav>

          {/* ── Right CTA + hamburger ─────────────────────────────────────── */}
          <div style={{ display:'flex', alignItems:'center', gap:'16px', flexShrink:0 }}>
            {/* Request a quote — desktop */}
            <Link
              href="/contact"
              id="header-cta-quote"
              className="header-cta-btn"
              style={{
                fontFamily:    T.fontSans,
                fontWeight:    500,
                fontSize:      '13px',
                color:         T.fg1,
                border:        `1px solid rgba(15,15,15,0.15)`,
                padding:       '8px 20px',
                borderRadius:  '4px',
                textDecoration:'none',
                transition:    `background 240ms ${T.ease}, border-color 240ms ${T.ease}, color 240ms ${T.ease}`,
                whiteSpace:    'nowrap',
              }}
            >
              Request a quote
            </Link>

            {/* Hamburger — mobile */}
            <button
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="header-hamburger"
              style={{
                display:    'none',
                background: 'transparent',
                border:     'none',
                padding:    '4px',
                cursor:     'pointer',
                color:      T.fg1,
              }}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile backdrop ─────────────────────────────────────────────────── */}
      {drawerOpen && (
        <div
          aria-hidden
          onClick={closeDrawer}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.25)', zIndex:99 }}
        />
      )}

      {/* ── Mobile drawer ───────────────────────────────────────────────────── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position:      'fixed',
          top:           0,
          right:         0,
          width:         '280px',
          height:        '100vh',
          background:    T.bgCanvas,          // ivory — light drawer
          borderLeft:    `1px solid ${T.border}`,
          zIndex:        100,
          padding:       '24px',
          display:       'flex',
          flexDirection: 'column',
          gap:           '8px',
          transform:     drawerOpen ? 'translateX(0)' : 'translateX(280px)',
          transition:    `transform 320ms ${T.ease}`,
          overflowY:     'auto',
        }}
      >
        {/* Drawer header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
          <span style={{ fontFamily:T.fontSerif, fontWeight:500, fontSize:'18px', color:T.fg1 }}>
            Nobilitas
          </span>
          <button
            aria-label="Close navigation menu"
            onClick={closeDrawer}
            style={{ background:'transparent', border:'none', padding:'4px', cursor:'pointer', color:T.fg1 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer links */}
        {NAV_ITEMS.map((item) => (
          <DrawerLink key={item.href} {...item} pathname={pathname} onClose={closeDrawer} />
        ))}

        {/* Drawer CTA */}
        <Link
          href="/contact"
          onClick={closeDrawer}
          style={{
            marginTop:     '24px',
            display:       'block',
            textAlign:     'center',
            fontFamily:    T.fontSans,
            fontWeight:    500,
            fontSize:      '14px',
            color:         T.fg1,
            border:        `1px solid rgba(15,15,15,0.15)`,
            padding:       '12px 20px',
            borderRadius:  '4px',
            textDecoration:'none',
          }}
        >
          <MessageCircle size={14} style={{ display:'inline', marginRight:'6px', verticalAlign:'middle' }} />
          Request a quote
        </Link>
      </aside>

      {/* ── Responsive + hover styles ────────────────────────────────────────── */}
      <style>{`
        @media (min-width: 768px) {
          .header-desktop-nav { display: flex !important; }
          .header-hamburger    { display: none !important; }
          .header-cta-btn      { display: inline-block !important; }
        }
        @media (max-width: 767px) {
          .header-desktop-nav { display: none !important; }
          .header-hamburger    { display: block !important; }
          .header-cta-btn      { display: none !important; }
        }
        .header-cta-btn:hover {
          background:    rgba(201,169,110,0.06) !important;
          border-color:  #c9a96e !important;
          color:         #c9a96e !important;
        }
      `}</style>
    </>
  );
}
