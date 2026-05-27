'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Grid3x3,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // If user is on the login page, sidebar is hidden entirely
  if (pathname === '/admin/login') {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Grid3x3 },
    { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col justify-between border-r border-[rgba(245,241,234,0.08)] bg-[#161616] py-6 font-sans">
      <div>
        {/* Brand/Logo */}
        <div className="px-6 mb-8">
          <Link href="/admin/dashboard" className="text-xl font-bold tracking-[0.2em] text-[#c9a96e] hover:opacity-90">
            NOBILITAS
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Check if active (matches path exactly or acts as subpath parent)
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded text-[0.78rem] tracking-[0.08em] font-medium transition-all ${
                  isActive
                    ? 'bg-[rgba(201,169,110,0.1)] text-[#c9a96e]'
                    : 'text-[#8a8a8a] hover:bg-[rgba(245,241,234,0.02)] hover:text-[#c9c0a8]'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sign Out */}
      <div className="px-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-4 py-2.5 rounded text-[0.78rem] tracking-[0.08em] font-medium text-[#8a8a8a] hover:bg-[rgba(245,241,234,0.02)] hover:text-[#c9c0a8] transition-all cursor-pointer text-left"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

/**
 * Client-side layout main container wrapper.
 * Dynamically shifts margin of the content area when on `/admin/login` route.
 */
export function AdminMainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <main
      className={`flex-1 min-h-screen bg-[#0f0f0f] p-8 transition-all duration-200 ${
        isLoginPage ? 'ml-0' : 'ml-[220px]'
      }`}
    >
      {children}
    </main>
  );
}
