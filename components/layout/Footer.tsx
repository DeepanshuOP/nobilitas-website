import Link from 'next/link';
import { MessageCircle, Phone, MapPin } from 'lucide-react';

// ─── Design tokens ───────────────────────────────────────────────────────────
const T = {
  bgInset:   '#060606',
  border1:   'rgba(245,241,234,0.06)',
  fg1:       '#f5f1ea',
  fg2:       '#c9c0a8',
  fg3:       '#8a8a8a',
  dimText:   '#6b6b6b',
  gold:      '#c9a96e',
  goldBorder:'rgba(201,169,110,0.28)',
  whatsapp:  '#25d366',
  ease:      'cubic-bezier(0.22,1,0.36,1)',
  fontSerif: "'Playfair Display', Georgia, serif",
  fontSans:  "'Inter', system-ui, sans-serif",
  fontMono:  "'JetBrains Mono', monospace",
} as const;

// ─── Catalog links (for footer col 2) ───────────────────────────────────────
const CATALOG_LINKS = [
  { label: 'Cleaning supplies',  slug: 'cleaning-hygiene' },
  { label: 'Office furniture',   slug: 'office-furniture' },
  { label: 'Electronics',        slug: 'electronics' },
  { label: 'Lighting',           slug: 'lighting' },
  { label: 'Corporate gifting',  slug: 'corporate-gifting' },
  { label: 'Pantry & breakroom', slug: 'pantry-breakroom' },
] as const;

// ─── Company links ───────────────────────────────────────────────────────────
const COMPANY_LINKS = [
  { label: 'About us', href: '/about' },
  { label: 'Contact',  href: '/contact' },
] as const;

// ─── Reusable eyebrow label ───────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily:    T.fontSans,
        fontWeight:    500,
        fontSize:      '10px',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color:         T.fg3,
        marginBottom:  '20px',
      }}
    >
      {children}
    </p>
  );
}

// ─── Footer link item ─────────────────────────────────────────────────────────
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li style={{ marginBottom: '12px' }}>
      <Link
        href={href}
        style={{
          fontFamily:    T.fontSans,
          fontWeight:    400,
          fontSize:      '13px',
          color:         T.fg2,
          textDecoration:'none',
          transition:    `color 240ms ${T.ease}`,
          display:       'inline-block',
        }}
        className="footer-link"
      >
        {children}
      </Link>
    </li>
  );
}

// ─── Footer Logo ─────────────────────────────────────────────────────────────
function FooterLogo() {
  return (
    <Link
      href="/"
      style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
    >
      <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden>
        <polygon points="4,0 8,4 4,8 0,4" fill={T.gold} />
      </svg>
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          style={{
            fontFamily:    T.fontSerif,
            fontWeight:    500,
            fontSize:      '20px',
            color:         T.fg1,
            letterSpacing: '0.01em',
          }}
        >
          Nobilitas
        </span>
        <span
          style={{
            fontFamily:    T.fontSans,
            fontWeight:    300,
            fontSize:      '9px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color:         T.fg3,
            marginTop:     '2px',
          }}
        >
          Ventures
        </span>
      </span>
    </Link>
  );
}

// ─── Footer (Server Component) ───────────────────────────────────────────────
export default function Footer() {
  return (
    <footer
      style={{
        background:  T.bgInset,
        borderTop:   `1px solid ${T.border1}`,
        paddingTop:  '96px',
        paddingBottom:'32px',
      }}
    >
      <div
        style={{
          maxWidth: '1320px',
          margin:   '0 auto',
          padding:  `0 clamp(20px,4vw,48px)`,
        }}
      >
        {/* ── 4-column grid ────────────────────────────────────────────────── */}
        <div className="footer-grid">

          {/* Col 1 — Brand ─────────────────────────────────────────────────── */}
          <div style={{ gridColumn: 'span 1' }}>
            <FooterLogo />

            <p
              style={{
                fontFamily:  T.fontSans,
                fontWeight:  300,
                fontSize:    '15px',
                lineHeight:  1.7,
                color:       T.fg2,
                maxWidth:    '320px',
                marginTop:   '24px',
              }}
            >
              A trusted single-source supplier for India&apos;s offices, hotels,
              hospitals, and factories. From Jaipur, since 2014.
            </p>

            {/* CTA buttons */}
            <div
              style={{
                display:   'flex',
                gap:       '12px',
                marginTop: '28px',
                flexWrap:  'wrap',
              }}
            >
              {/* WhatsApp button */}
              <a
                id="footer-whatsapp-btn"
                href="https://wa.me/919314093160"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  gap:            '8px',
                  background:     T.whatsapp,
                  color:          '#fff',
                  fontFamily:     T.fontSans,
                  fontWeight:     500,
                  fontSize:       '13px',
                  padding:        '9px 18px',
                  borderRadius:   '4px',
                  textDecoration: 'none',
                }}
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>

              {/* Browse catalog */}
              <Link
                id="footer-catalog-btn"
                href="/products"
                style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  gap:            '8px',
                  background:     'transparent',
                  color:          T.gold,
                  fontFamily:     T.fontSans,
                  fontWeight:     500,
                  fontSize:       '13px',
                  padding:        '9px 18px',
                  borderRadius:   '4px',
                  border:         `1px solid ${T.goldBorder}`,
                  textDecoration: 'none',
                }}
              >
                Browse catalog
              </Link>
            </div>
          </div>

          {/* Col 2 — Catalog ────────────────────────────────────────────────── */}
          <div>
            <Eyebrow>Catalog</Eyebrow>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {CATALOG_LINKS.map(({ label, slug }) => (
                <FooterLink key={slug} href={`/products?category=${slug}`}>
                  {label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company ────────────────────────────────────────────────── */}
          <div>
            <Eyebrow>Company</Eyebrow>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {COMPANY_LINKS.map(({ label, href }) => (
                <FooterLink key={href} href={href}>
                  {label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Col 4 — Reach us ───────────────────────────────────────────────── */}
          <div>
            <Eyebrow>Reach us</Eyebrow>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {/* Phone */}
              <li
                style={{
                  display:     'flex',
                  alignItems:  'center',
                  gap:         '10px',
                  marginBottom:'16px',
                }}
              >
                <Phone size={13} style={{ color: T.gold, flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: T.fontSans,
                    fontWeight: 400,
                    fontSize:   '13px',
                    color:      T.fg2,
                  }}
                >
                  +91 93140 93160
                </span>
              </li>

              {/* WhatsApp link */}
              <li
                style={{
                  display:     'flex',
                  alignItems:  'center',
                  gap:         '10px',
                  marginBottom:'16px',
                }}
              >
                <MessageCircle size={13} style={{ color: T.gold, flexShrink: 0 }} />
                <a
                  href="https://wa.me/919314093160"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily:    T.fontSans,
                    fontWeight:    400,
                    fontSize:      '13px',
                    color:         T.fg2,
                    textDecoration:'none',
                  }}
                  className="footer-link"
                >
                  wa.me/919314093160
                </a>
              </li>

              {/* Location */}
              <li
                style={{
                  display:    'flex',
                  alignItems: 'center',
                  gap:        '10px',
                }}
              >
                <MapPin size={13} style={{ color: T.gold, flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: T.fontSans,
                    fontWeight: 400,
                    fontSize:   '13px',
                    color:      T.fg2,
                  }}
                >
                  Jaipur, Rajasthan
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────────────── */}
        <div
          style={{
            marginTop:  '80px',
            paddingTop: '32px',
            borderTop:  `1px solid ${T.border1}`,
            display:    'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap:   'wrap',
            gap:        '12px',
          }}
        >
          <span
            style={{
              fontFamily:    T.fontMono,
              fontSize:      '11px',
              letterSpacing: '0.04em',
              color:         T.dimText,
            }}
          >
            GST · 08AABFN0123Z1ZK &nbsp;·&nbsp; Estd. Jaipur 2014
          </span>
          <span
            style={{
              fontFamily: T.fontSans,
              fontSize:   '11px',
              color:      T.dimText,
            }}
          >
            © 2026 Nobilitas Ventures LLP. All rights reserved.
          </span>
        </div>
      </div>

      {/* ── Responsive grid + link hover styles ─────────────────────────────── */}
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
        }
        @media (min-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1.6fr 1fr 1fr 1fr;
            gap: 64px;
          }
        }
        .footer-link:hover {
          color: #c9a96e !important;
        }
      `}</style>
    </footer>
  );
}
