'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Grid3X3,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg: '#0d0d0d',
  border: 'rgba(245,241,234,0.08)',
  gold: '#c9a96e',
  fg1: '#f5f1ea',
  fg2: '#c9c0a8',
  fg3: '#8a8a8a',
  activeBg: 'rgba(201,169,110,0.12)',
  hoverBg: 'rgba(245,241,234,0.04)',
  sans: "'Inter', system-ui, sans-serif",
  serif: "'Playfair Display', Georgia, serif",
} as const;

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Grid3X3 },
  { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

/**
 * WHY null on login: the login page uses the full viewport without a sidebar.
 * Returning null avoids rendering the sidebar DOM entirely; the admin layout's
 * marginLeft remains but the page overrides it via a <style> injection in the
 * old code — here we simply return null for the sidebar only, keeping login
 * full-bleed without over-engineering a second layout file.
 */
export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // If on the login page, suppress the sidebar completely
  if (pathname === '/admin/login') return null;

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
        bottom: 0,
        width: 240,
        background: T.bg,
        borderRight: `1px solid ${T.border}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 0',
        zIndex: 50,
      }}
    >
      {/* ── Brand block ── */}
      <div
        style={{
          padding: '0 24px 28px',
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <Link
          href="/admin/dashboard"
          style={{ textDecoration: 'none' }}
        >
          <span
            style={{
              display: 'block',
              fontFamily: T.serif,
              fontSize: 22,
              fontWeight: 700,
              color: T.gold,
              letterSpacing: '-0.01em',
            }}
          >
            nobilitas
          </span>
          <span
            style={{
              display: 'block',
              fontFamily: T.sans,
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: T.fg3,
              marginTop: 4,
            }}
          >
            Ventures LLP · Admin
          </span>
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          padding: '24px 12px',
          flex: 1,
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <NavItem
              key={item.href}
              href={item.href}
              isActive={isActive}
              icon={<Icon size={16} />}
              label={item.name}
            />
          );
        })}
      </nav>

      {/* ── Bottom block ── */}
      <div
        style={{
          marginTop: 'auto',
          padding: '0 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          borderTop: `1px solid ${T.border}`,
          paddingTop: 16,
        }}
      >
        <NavItem
          href="/"
          isActive={false}
          icon={<ExternalLink size={16} />}
          label="View public site ↗"
          target="_blank"
        />
        <SignOutButton onSignOut={handleSignOut} />
      </div>
    </aside>
  );
}

// ─── NavItem ──────────────────────────────────────────────────────────────────

interface NavItemProps {
  href: string;
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
  target?: string;
}

function NavItem({ href, isActive, icon, label, target }: NavItemProps) {
  const [hovered, setHovered] = useState(false);

  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '11px 16px',
    borderRadius: 8,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: 14,
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 180ms',
    background: isActive
      ? 'rgba(201,169,110,0.12)'
      : hovered
        ? 'rgba(245,241,234,0.04)'
        : 'transparent',
    color: isActive ? '#c9a96e' : hovered ? '#c9c0a8' : '#8a8a8a',
  };

  return (
    <Link
      href={href}
      target={target}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon}
      {label}
    </Link>
  );
}

// ─── SignOutButton ─────────────────────────────────────────────────────────────

function SignOutButton({ onSignOut }: { onSignOut: () => void }) {
  const [hovered, setHovered] = useState(false);

  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '11px 16px',
    borderRadius: 8,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: 14,
    fontWeight: 500,
    background: 'none',
    border: 'none',
    width: '100%',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 180ms',
    color: hovered ? '#c9c0a8' : '#8a8a8a',
    backgroundColor: hovered ? 'rgba(245,241,234,0.04)' : 'transparent',
  };

  return (
    <button
      style={style}
      onClick={onSignOut}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <LogOut size={16} />
      Sign Out
    </button>
  );
}
