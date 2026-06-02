import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Inquiry } from '@/lib/types';

// ─── Design tokens ────────────────────────────────────────────────────────────

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
  serif: "'Playfair Display', Georgia, serif",
  sans: "'Inter', system-ui, sans-serif",
} as const;

/**
 * Server-Side Dashboard Home Component.
 * Fetches metrics in parallel and displays them alongside recent inquiries.
 */
export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch metrics and recent inquiries in parallel
  const [
    productsCountRes,
    categoriesCountRes,
    newInquiriesCountRes,
    totalInquiriesCountRes,
    recentInquiriesRes,
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    // WHY is_active filter: the sublabel reads "active categories"; without
    // this filter the count includes soft-disabled categories and misleads the admin.
    supabase.from('categories').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  const totalProducts = productsCountRes.count ?? 0;
  const totalCategories = categoriesCountRes.count ?? 0;
  const newInquiries = newInquiriesCountRes.count ?? 0;
  const totalInquiries = totalInquiriesCountRes.count ?? 0;
  const recentInquiries = (recentInquiriesRes.data || []) as Inquiry[];

  // Define stat cards array for rendering
  const statCards = [
    {
      label: 'TOTAL PRODUCTS',
      count: totalProducts,
      sublabel: 'products in catalog',
    },
    {
      // Label updated to ACTIVE CATEGORIES to match the is_active filter on the query
      label: 'ACTIVE CATEGORIES',
      count: totalCategories,
      sublabel: 'active categories',
    },
    {
      label: 'NEW INQUIRIES',
      count: newInquiries,
      sublabel: 'awaiting response',
    },
    {
      label: 'TOTAL INQUIRIES',
      count: totalInquiries,
      sublabel: 'total received',
    },
  ];

  return (
    <div style={{ fontFamily: T.sans, color: T.fg1 }}>
      {/* ── Page Header ── */}
      <header style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: T.serif,
            fontSize: 30,
            fontWeight: 700,
            color: T.fg1,
            margin: 0,
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            fontFamily: T.sans,
            fontSize: 14,
            color: T.fg3,
            marginTop: 6,
            marginBottom: 0,
          }}
        >
          Welcome back. Here&apos;s what&apos;s happening.
        </p>
      </header>

      {/* ── KPI Stats Grid ── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
          marginTop: 32,
          marginBottom: 40,
        }}
      >
        {statCards.map((card, index) => (
          <div
            key={index}
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              padding: 28,
            }}
          >
            <p
              style={{
                fontFamily: T.serif,
                fontSize: 40,
                fontWeight: 700,
                color: T.fg1,
                lineHeight: 1,
                margin: 0,
              }}
            >
              {card.count}
            </p>
            <p
              style={{
                fontFamily: T.sans,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: T.fg3,
                marginTop: 10,
                marginBottom: 0,
              }}
            >
              {card.label}
            </p>
          </div>
        ))}
      </section>

      {/* ── Recent Inquiries Section ── */}
      <section style={{ marginBottom: 40 }}>
        <h2
          style={{
            fontFamily: T.serif,
            fontSize: 20,
            fontWeight: 700,
            color: T.fg1,
            margin: '0 0 16px',
          }}
        >
          Recent Inquiries
        </h2>

        <div
          style={{
            background: T.surface,
            borderRadius: 10,
            border: `1px solid ${T.border}`,
            overflow: 'hidden',
          }}
        >
          {recentInquiries.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
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
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    {['Name', 'Company', 'Phone', 'Status', 'Date'].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: 'left',
                          padding: '12px 16px',
                          fontSize: 10,
                          fontWeight: 500,
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          color: T.fg3,
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentInquiries.map((inquiry) => {
                    // Dynamic badge rendering configuration based on status
                    let badgeColor: string = T.fg3;
                    let badgeBg: string = 'rgba(245,241,234,0.06)';
                    if (inquiry.status === 'new') {
                      badgeColor = T.gold;
                      badgeBg = 'rgba(201,169,110,0.15)';
                    } else if (inquiry.status === 'responded') {
                      badgeColor = '#4ade80';
                      badgeBg = 'rgba(74,222,128,0.1)';
                    }

                    const dateString = new Date(inquiry.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    });

                    return (
                      <tr
                        key={inquiry.id}
                        style={{ borderBottom: `1px solid rgba(245,241,234,0.06)` }}
                      >
                        <td style={{ padding: '14px 16px', fontSize: 13, color: T.fg2, fontWeight: 500 }}>
                          {inquiry.name}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: T.fg2 }}>
                          {inquiry.company || '—'}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: T.fg2, fontFamily: 'monospace' }}>
                          {inquiry.phone}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              borderRadius: 9999,
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              color: badgeColor,
                              backgroundColor: badgeBg,
                            }}
                          >
                            {inquiry.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: T.fg3 }}>
                          {dateString}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <p style={{ fontSize: 14, color: T.fg3, fontFamily: T.sans }}>No inquiries yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Quick Actions Block ── */}
      <section>
        <h2
          style={{
            fontFamily: T.serif,
            fontSize: 20,
            fontWeight: 700,
            color: T.fg1,
            margin: '0 0 16px',
          }}
        >
          Quick Actions
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link
            href="/admin/products/new"
            style={{
              display: 'inline-block',
              background: T.surface,
              border: `1px solid ${T.border}`,
              color: T.gold,
              padding: '12px 24px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
              fontFamily: T.sans,
            }}
          >
            Add Product
          </Link>
          <Link
            href="/admin/categories"
            style={{
              display: 'inline-block',
              background: T.surface,
              border: `1px solid ${T.border}`,
              color: T.gold,
              padding: '12px 24px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
              fontFamily: T.sans,
            }}
          >
            Add Category
          </Link>
          <Link
            href="/admin/inquiries"
            style={{
              display: 'inline-block',
              background: T.surface,
              border: `1px solid ${T.border}`,
              color: T.gold,
              padding: '12px 24px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
              fontFamily: T.sans,
            }}
          >
            View Inquiries
          </Link>
        </div>
      </section>
    </div>
  );
}
