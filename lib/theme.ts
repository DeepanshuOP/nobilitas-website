/**
 * Design tokens for the Nobilitas public site.
 * Import THEME wherever you need inline-style values —
 * admin pages use their own dark palette and should NOT import this.
 */
export const THEME = {
  // ── Backgrounds ────────────────────────────────────────────────────────────
  bgCanvas:      '#f5f1ea',      // ivory-100 — page base
  bgSurface:     '#faf7f1',      // ivory-50  — cards
  bgElevated:    '#ece5d7',      // ivory-200 — hover surfaces
  bgDark:        '#0f0f0f',      // onyx — footer, trust bar
  bgDarkSurface: '#161616',

  // ── Foreground ─────────────────────────────────────────────────────────────
  fg1:       '#0f0f0f',          // primary text
  fg2:       '#564f40',          // secondary text
  fg3:       '#7d7560',          // muted text
  fgInverse: '#f5f1ea',          // text on dark bg

  // ── Gold ───────────────────────────────────────────────────────────────────
  gold:      '#c9a96e',
  goldHover: '#b89656',
  goldSoft:  'rgba(201,169,110,0.25)',
  goldBg:    'rgba(201,169,110,0.10)',

  // ── Borders ────────────────────────────────────────────────────────────────
  border:     'rgba(15,15,15,0.08)',    // on light bg
  borderDark: 'rgba(245,241,234,0.06)', // on dark bg
  borderGold: 'rgba(201,169,110,0.28)',

  // ── Semantic ───────────────────────────────────────────────────────────────
  whatsapp:      '#25d366',
  whatsappHover: '#1da851',

  // ── Typography ─────────────────────────────────────────────────────────────
  fontSerif: '"Playfair Display", Georgia, serif',
  fontSans:  '"Inter", system-ui, sans-serif',
  fontMono:  '"JetBrains Mono", monospace',

  // ── Motion ─────────────────────────────────────────────────────────────────
  ease:    'cubic-bezier(0.22,1,0.36,1)',
  durFast: '140ms',
  durBase: '240ms',
  durSlow: '480ms',
} as const;
