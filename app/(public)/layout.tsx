import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppFab from '@/components/layout/WhatsAppFab';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <Header />
      <main style={{ background: '#f5f1ea', minHeight: '100vh' }}>
        {children}
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
