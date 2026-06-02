import AdminSidebar from '@/app/admin/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Server-side layout component wrapping all administrative pages.
 * Renders the fixed sidebar and shifts main content by its width.
 * Login page: sidebar returns null so the main content fills the viewport
 * minus marginLeft — acceptable since the login page centres its own card.
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f0f', color: '#f5f1ea' }}>
      <AdminSidebar />
      <main
        style={{
          marginLeft: 240,
          flex: 1,
          background: '#0f0f0f',
          padding: '40px 48px',
          minHeight: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  );
}
