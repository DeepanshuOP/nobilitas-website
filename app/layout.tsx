import type { Metadata } from 'next';
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import PublicChrome from '@/components/layout/PublicChrome';

/* ── Fonts ───────────────────────────────────────────────────────────────── */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

/* ── Metadata ────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Nobilitas — Equipping India's finest workplaces",
  description:
    'A single trusted B2B supplier for cleaning, office furniture, electronics, pantry, gifts, and more. Pan-India delivery from Jaipur. Quote within four working hours.',
  keywords: ['B2B supplier', 'office supplies', 'cleaning', 'Jaipur', 'corporate procurement'],
};

/* ── Root layout ─────────────────────────────────────────────────────────── */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <PublicChrome>{children}</PublicChrome>
      </body>
    </html>
  );
}
