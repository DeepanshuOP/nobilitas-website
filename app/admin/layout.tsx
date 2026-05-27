import AdminSidebar from '@/components/admin/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Server-side layout component wrapping administrative pages.
 * Statically renders the sidebar and provides a standardized page wrapper.
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f0f', color: '#f5f1ea' }}>
      {/* Interactive navigation sidebar */}
      <AdminSidebar />

      {/* Main administrative content layout */}
      <main
        style={{
          marginLeft: '220px',
          flex: 1,
          background: '#0f0f0f',
          padding: '2rem',
          minHeight: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  );
}
