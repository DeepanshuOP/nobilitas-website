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
      <main style={{ background: '#0f0f0f', minHeight: '100vh' }}>
        {children}
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
