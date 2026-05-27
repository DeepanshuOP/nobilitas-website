'use client';

/**
 * InquiriesClient — interactive inquiries management table.
 *
 * WHY client component: filter tab state, expandable row panels,
 * optimistic status mutations, and Supabase client-side updates all
 * require browser APIs and React state unavailable in Server Components.
 */

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { InquiryStatus, InquiryWithProduct } from '@/lib/types';

// ─── Design tokens (mirrors the rest of the admin UI) ─────────────────────────

const T = {
  bg: '#0f0f0f',
  surface: '#161616',
  elevated: '#1c1c1c',
  border: 'rgba(245,241,234,0.08)',
  borderGold: 'rgba(201,169,110,0.28)',
  fg1: '#f5f1ea',
  fg2: '#c9c0a8',
  fg3: '#8a8a8a',
  gold: '#c9a96e',
  goldBg: 'rgba(201,169,110,0.12)',
  serif: "'Playfair Display', Georgia, serif",
  sans: "'Inter', system-ui, sans-serif",
} as const;

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS: { label: string; value: InquiryStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Read', value: 'read' },
  { label: 'Responded', value: 'responded' },
];

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_CFG: Record<InquiryStatus, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: '#c9a96e', bg: 'rgba(201,169,110,0.15)' },
  read: { label: 'Read', color: '#8a8a8a', bg: 'rgba(138,138,138,0.12)' },
  responded: { label: 'Responded', color: '#4a7c59', bg: 'rgba(74,124,89,0.15)' },
};

function StatusBadge({ status }: { status: InquiryStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 9999,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
        color: cfg.color,
        backgroundColor: cfg.bg,
      }}
    >
      {cfg.label}
    </span>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Format ISO timestamp as DD MMM YYYY (e.g. "24 May 2026").
 * Uses en-IN locale which yields the desired day-month-year order.
 */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Expanded detail panel ────────────────────────────────────────────────────

interface DetailPanelProps {
  inquiry: InquiryWithProduct;
  onMarkRead: () => void;
  onMarkResponded: () => void;
  isUpdating: boolean;
}

function DetailPanel({
  inquiry,
  onMarkRead,
  onMarkResponded,
  isUpdating,
}: DetailPanelProps) {
  const fields: { label: string; value: string | null }[] = [
    { label: 'Email', value: inquiry.email || null },
    { label: 'Quantity', value: inquiry.quantity || null },
    { label: 'Products Interested', value: inquiry.products_interested || null },
    { label: 'Message', value: inquiry.message || null },
  ];

  return (
    <tr>
      <td
        colSpan={6}
        style={{
          padding: 0,
          background: T.elevated,
          borderBottom: `1px solid ${T.borderGold}`,
        }}
      >
        <div
          style={{
            padding: '20px 24px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px 28px',
          }}
        >
          {/* Detail fields */}
          {fields.map(({ label, value }) =>
            value ? (
              <div key={label}>
                <p
                  style={{
                    margin: '0 0 4px',
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: T.fg3,
                    fontFamily: T.sans,
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: T.fg2,
                    lineHeight: 1.65,
                    fontFamily: T.sans,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {value}
                </p>
              </div>
            ) : null
          )}

          {/* Action buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            {/* "Mark as read" — only shown when status is new */}
            {inquiry.status === 'new' && (
              <button
                id={`mark-read-${inquiry.id}`}
                onClick={onMarkRead}
                disabled={isUpdating}
                style={{
                  background: 'transparent',
                  border: `1px solid ${T.borderGold}`,
                  borderRadius: 6,
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: T.gold,
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  opacity: isUpdating ? 0.5 : 1,
                  fontFamily: T.sans,
                  transition: 'opacity 180ms',
                }}
              >
                Mark as Read
              </button>
            )}

            {/* "Mark as responded" — shown when status is new or read */}
            {(inquiry.status === 'new' || inquiry.status === 'read') && (
              <button
                id={`mark-responded-${inquiry.id}`}
                onClick={onMarkResponded}
                disabled={isUpdating}
                style={{
                  background: T.goldBg,
                  border: `1px solid ${T.borderGold}`,
                  borderRadius: 6,
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: T.gold,
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  opacity: isUpdating ? 0.5 : 1,
                  fontFamily: T.sans,
                  transition: 'opacity 180ms',
                }}
              >
                {isUpdating ? 'Saving…' : 'Mark as Responded'}
              </button>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── Table row ────────────────────────────────────────────────────────────────

interface InquiryRowProps {
  inquiry: InquiryWithProduct;
  isExpanded: boolean;
  isUpdating: boolean;
  onToggle: () => void;
  onMarkRead: () => void;
  onMarkResponded: () => void;
}

function InquiryRow({
  inquiry,
  isExpanded,
  isUpdating,
  onToggle,
  onMarkRead,
  onMarkResponded,
}: InquiryRowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <tr
        id={`inquiry-row-${inquiry.id}`}
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderBottom: `1px solid ${isExpanded ? T.borderGold : hovered ? T.borderGold : T.border}`,
          backgroundColor: isExpanded
            ? 'rgba(201,169,110,0.04)'
            : hovered
              ? 'rgba(201,169,110,0.025)'
              : 'transparent',
          transition: 'background-color 200ms ease, border-color 200ms ease',
          cursor: 'pointer',
        }}
      >
        {/* Name */}
        <td
          style={{
            padding: '14px 20px',
            color: T.fg1,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            fontFamily: T.sans,
          }}
        >
          {inquiry.name}
        </td>

        {/* Company */}
        <td
          style={{
            padding: '14px 20px',
            color: T.fg2,
            whiteSpace: 'nowrap',
            fontFamily: T.sans,
          }}
        >
          {inquiry.company || '—'}
        </td>

        {/* Phone */}
        <td
          style={{
            padding: '14px 20px',
            color: T.fg2,
            fontFamily: 'monospace',
            fontSize: 12,
            whiteSpace: 'nowrap',
          }}
        >
          {inquiry.phone}
        </td>

        {/* Product */}
        <td
          style={{
            padding: '14px 20px',
            color: T.fg3,
            whiteSpace: 'nowrap',
            fontFamily: T.sans,
            fontSize: 12,
          }}
        >
          {inquiry.products?.name ?? '—'}
        </td>

        {/* Status */}
        <td style={{ padding: '14px 20px' }}>
          <StatusBadge status={inquiry.status} />
        </td>

        {/* Date */}
        <td
          style={{
            padding: '14px 20px',
            color: T.fg3,
            fontSize: 12,
            whiteSpace: 'nowrap',
            fontFamily: T.sans,
          }}
        >
          {formatDate(inquiry.created_at)}
        </td>
      </tr>

      {/* Inline detail panel — rendered as the very next <tr> */}
      {isExpanded && (
        <DetailPanel
          inquiry={inquiry}
          onMarkRead={onMarkRead}
          onMarkResponded={onMarkResponded}
          isUpdating={isUpdating}
        />
      )}
    </>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface InquiriesClientProps {
  inquiries: InquiryWithProduct[];
  fetchError: string | null;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function InquiriesClient({
  inquiries: initialInquiries,
  fetchError,
}: InquiriesClientProps) {
  const supabase = createClient();

  // Local copy — mutated optimistically on status change
  const [inquiries, setInquiries] = useState<InquiryWithProduct[]>(initialInquiries);

  // Active filter tab
  const [activeTab, setActiveTab] = useState<InquiryStatus | 'all'>('all');

  // Expanded row id — only one row can be expanded at a time
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Track which row is currently being mutated to disable its buttons
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ── Derived counts for tab badges ──────────────────────────────────────────

  const counts = {
    all: inquiries.length,
    new: inquiries.filter((i) => i.status === 'new').length,
    read: inquiries.filter((i) => i.status === 'read').length,
    responded: inquiries.filter((i) => i.status === 'responded').length,
  } satisfies Record<InquiryStatus | 'all', number>;

  // ── Filtered list ─────────────────────────────────────────────────────────

  const visible =
    activeTab === 'all' ? inquiries : inquiries.filter((i) => i.status === activeTab);

  // ── Status mutation (optimistic) ──────────────────────────────────────────

  const updateStatus = useCallback(
    async (id: string, newStatus: InquiryStatus) => {
      setUpdatingId(id);

      // Optimistic update — reflect change immediately in UI
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );

      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', id);

      setUpdatingId(null);

      if (error) {
        // Revert on failure — restore the original status from initialInquiries
        setInquiries((prev) =>
          prev.map((i) => {
            if (i.id !== id) return i;
            const original = initialInquiries.find((o) => o.id === id);
            // WHY fallback: if somehow not found keep current rather than corrupt state
            return original ? { ...i, status: original.status } : i;
          })
        );
      }
    },
    [supabase, initialInquiries]
  );

  // ── Toggle row expansion ──────────────────────────────────────────────────

  function toggleRow(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: '100vh',
        background: T.bg,
        padding: '32px 24px',
        fontFamily: T.sans,
      }}
    >
      {/* ── Page header ── */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: T.serif,
            fontSize: 30,
            fontWeight: 700,
            color: T.fg1,
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          Inquiries
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: T.fg3 }}>
          Manage buyer inquiries. {inquiries.length} total — {counts.new} new.
        </p>
      </div>

      {/* ── Fetch error banner ── */}
      {fetchError && (
        <div
          style={{
            marginBottom: 24,
            padding: '12px 16px',
            borderRadius: 8,
            border: `1px solid ${T.borderGold}`,
            background: 'rgba(201,169,110,0.06)',
            color: T.gold,
            fontSize: 13,
            fontFamily: T.sans,
          }}
        >
          Could not load inquiries: {fetchError}
        </div>
      )}

      {/* ── Filter tabs ── */}
      <div
        role="tablist"
        aria-label="Filter inquiries by status"
        style={{
          display: 'flex',
          gap: 4,
          marginBottom: 24,
          borderBottom: `1px solid ${T.border}`,
          paddingBottom: 0,
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          const count = counts[tab.value];
          // WHY: "New" badge gets gold treatment to draw attention; others use fg3
          const badgeColor = tab.value === 'new' ? T.gold : T.fg3;
          const badgeBg =
            tab.value === 'new'
              ? 'rgba(201,169,110,0.14)'
              : 'rgba(138,138,138,0.1)';

          return (
            <button
              key={tab.value}
              id={`inquiry-tab-${tab.value}`}
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActiveTab(tab.value);
                setExpandedId(null); // collapse any open row when switching tabs
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                background: 'none',
                border: 'none',
                borderBottom: isActive
                  ? `2px solid ${T.gold}`
                  : '2px solid transparent',
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? T.fg1 : T.fg3,
                cursor: 'pointer',
                fontFamily: T.sans,
                transition: 'color 160ms, border-color 160ms',
                marginBottom: -1, // sit flush with the border
              }}
            >
              {tab.label}
              {/* Count badge */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 20,
                  height: 18,
                  padding: '0 6px',
                  borderRadius: 9999,
                  fontSize: 10,
                  fontWeight: 700,
                  color: isActive && tab.value === 'new' ? T.gold : isActive ? T.fg2 : badgeColor,
                  backgroundColor: isActive && tab.value === 'new' ? badgeBg : isActive ? 'rgba(245,241,234,0.06)' : badgeBg,
                  transition: 'background 160ms, color 160ms',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Table ── */}
      <div
        style={{
          overflowX: 'auto',
          borderRadius: 8,
          border: `1px solid ${T.border}`,
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: 13,
            fontFamily: T.sans,
          }}
        >
          <thead>
            <tr
              style={{
                background: T.surface,
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              {['Name', 'Company', 'Phone', 'Product', 'Status', 'Date'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '14px 20px',
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: T.fg3,
                    whiteSpace: 'nowrap',
                    fontFamily: T.sans,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: '64px 20px',
                    textAlign: 'center',
                    color: T.fg3,
                    fontSize: 13,
                    fontFamily: T.sans,
                  }}
                >
                  {activeTab === 'all'
                    ? 'No inquiries yet.'
                    : `No ${activeTab} inquiries.`}
                </td>
              </tr>
            ) : (
              visible.map((inquiry) => (
                <InquiryRow
                  key={inquiry.id}
                  inquiry={inquiry}
                  isExpanded={expandedId === inquiry.id}
                  isUpdating={updatingId === inquiry.id}
                  onToggle={() => toggleRow(inquiry.id)}
                  onMarkRead={() => updateStatus(inquiry.id, 'read')}
                  onMarkResponded={() => updateStatus(inquiry.id, 'responded')}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
