import type { Metadata } from 'next';
import './globals.css';

// ─── Site metadata ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default:  'Nobilitas Ventures — B2B Supplies, Jaipur',
    template: '%s | Nobilitas Ventures',
  },
  description:
    'Nobilitas Ventures is a trusted single-source B2B supplier of cleaning, office, hospitality, and industrial supplies based in Jaipur, India. Request a quote today.',
  keywords: [
    'B2B supplies India',
    'office supplies Jaipur',
    'cleaning products wholesale',
    'hospitality supplies',
    'Nobilitas Ventures',
  ],
  authors: [{ name: 'Nobilitas Ventures LLP' }],
  openGraph: {
    type:        'website',
    locale:      'en_IN',
    url:         'https://nobilitasventures.com',
    siteName:    'Nobilitas Ventures',
    title:       'Nobilitas Ventures — B2B Supplies, Jaipur',
    description: 'A trusted single-source supplier for offices, hotels, hospitals & factories.',
  },
};

// ─── Root layout ─────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
