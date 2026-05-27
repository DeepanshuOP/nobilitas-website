'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Grid3X3,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

/**
 * Interactive Client Sidebar component for admin routes.
 * Positioned fixed on the left side of the viewport.
 */
export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // If on the login page, hide the sidebar completely and override the parent layout margin
  if (pathname === '/admin/login') {
    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `
            main { margin-left: 0px !important; padding: 0px !important; }
          `,
        }}
      />
    );
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Grid3X3 },
    { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/admin/login');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 40,
        display: 'flex',
        height: '100vh',
        width: '220px',
        flexDirection: 'column',
        borderRight: '1px solid rgba(245, 241, 234, 0.08)',
        backgroundColor: '#161616',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Dynamic Hover Styles to override inline style defaults */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .admin-nav-link:hover {
              background-color: rgba(245, 241, 234, 0.02) !important;
              color: #c9c0a8 !important;
            }
            .admin-signout-btn:hover {
              border-color: #c9a96e !important;
              color: #c9a96e !important;
            }
          `,
        }}
      />

      {/* Sidebar Header */}
      <div style={{ padding: '1.5rem 1.25rem' }}>
        <h2
          style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: '#c9a96e',
          }}
        >
          NOBILITAS
        </h2>
        <span
          style={{
            display: 'block',
            fontSize: '0.65rem',
            color: '#555',
            marginTop: '2px',
          }}
        >
          Ventures LLP
        </span>
      </div>

      {/* Sidebar Navigation */}
      <nav style={{ flex: 1, marginTop: '1rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          // Active if pathname starts with href (exactly matching spec)
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '4px',
                margin: '2px 0.5rem',
                fontSize: '0.78rem',
                letterSpacing: '0.06em',
                color: isActive ? '#c9a96e' : '#8a8a8a',
                backgroundColor: isActive ? 'rgba(201, 169, 110, 0.1)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              className="admin-nav-link"
            >
              <Icon style={{ height: '1rem', width: '1rem', flexShrink: 0 }} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          width: '100%',
        }}
      >
        <button
          onClick={handleSignOut}
          style={{
            margin: '0 0.5rem',
            width: 'calc(100% - 1rem)',
            background: 'transparent',
            border: '1px solid rgba(245, 241, 234, 0.08)',
            color: '#8a8a8a',
            fontSize: '0.75rem',
            padding: '0.6rem',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          className="admin-signout-btn"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
