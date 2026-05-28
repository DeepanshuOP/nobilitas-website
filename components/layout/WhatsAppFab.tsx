'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

// ─── WhatsApp FAB with pulse ring + tooltip ───────────────────────────────────
export default function WhatsAppFab() {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      {/* ── Keyframe + tooltip styles ─────────────────────────────────────── */}
      <style>{`
        @keyframes nob-pulse {
          0%   { opacity: 0.5; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.8); }
        }
        .nob-fab-pulse {
          animation: nob-pulse 2.8s infinite;
        }
      `}</style>

      {/* ── Fixed wrapper ─────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          right:    '24px',
          bottom:   '24px',
          zIndex:   40,
          display:  'inline-flex',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Pulse ring ────────────────────────────────────────────────── */}
        <span
          aria-hidden
          className="nob-fab-pulse"
          style={{
            position:    'absolute',
            inset:       '-4px',
            borderRadius:'50%',
            border:      '1.5px solid rgba(37,211,102,0.4)',
            pointerEvents:'none',
          }}
        />

        {/* ── Tooltip ───────────────────────────────────────────────────── */}
        <span
          aria-hidden
          style={{
            position:       'absolute',
            bottom:         '68px',
            right:          0,
            fontFamily:     "'Inter', system-ui, sans-serif",
            fontWeight:     400,
            fontSize:       '12px',
            background:     '#0f0f0f',
            color:          '#f5f1ea',
            padding:        '6px 12px',
            borderRadius:   '4px',
            whiteSpace:     'nowrap',
            border:         '1px solid rgba(245,241,234,0.06)',
            opacity:        hovered ? 1 : 0,
            transform:      hovered ? 'translateY(0)' : 'translateY(4px)',
            transition:     'opacity 200ms ease-out, transform 200ms ease-out',
            pointerEvents:  'none',
          }}
        >
          Chat on WhatsApp
        </span>

        {/* ── Main button ───────────────────────────────────────────────── */}
        <a
          id="whatsapp-fab-btn"
          href="https://wa.me/919314093160"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            width:          '56px',
            height:         '56px',
            borderRadius:   '50%',
            background:     hovered ? '#1da851' : '#25d366',
            color:          '#fff',
            boxShadow:      '0 4px 20px rgba(37,211,102,0.3)',
            transition:     'background 240ms cubic-bezier(0.22,1,0.36,1), transform 240ms cubic-bezier(0.22,1,0.36,1)',
            transform:      hovered ? 'scale(1.05)' : 'scale(1)',
            textDecoration: 'none',
            position:       'relative',
            zIndex:         1,
          }}
        >
          <MessageCircle size={24} />
        </a>
      </div>
    </>
  );
}
