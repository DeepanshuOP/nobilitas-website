'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import WhatsAppFab from '@/components/layout/WhatsAppFab/WhatsAppFab';

/**
 * WHY PublicChrome: The root layout must be a Server Component (for metadata),
 * but we need pathname access to suppress public chrome on /admin routes.
 * Extracting this into a 'use client' wrapper keeps the Server/Client boundary
 * clean without converting the entire root layout.
 */
export default function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <WhatsAppFab />
    </>
  );
}
