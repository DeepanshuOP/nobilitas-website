import type { Metadata } from 'next';
import HeroSection        from '@/components/home/HeroSection';
import AboutSection       from '@/components/home/AboutSection';
import NumbersSection     from '@/components/home/NumbersSection';
import CategoriesSection  from '@/components/home/CategoriesSection';
import ArrivalsSection    from '@/components/home/ArrivalsSection';
import FeaturedSection    from '@/components/home/FeaturedSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import PartnersSection    from '@/components/home/PartnersSection';
import CtaSection         from '@/components/home/CtaSection';
import { getSiteStats }   from '@/lib/stats';

export const metadata: Metadata = {
  title: "Nobilitas — Equipping India's finest workplaces",
  description:
    'B2B supplier for cleaning, office furniture, electronics, pantry, and more. ' +
    'Pan-India delivery from Jaipur. Quote within four working hours.',
};

export default async function HomePage() {
  const stats = await getSiteStats();

  return (
    <main>
      <HeroSection />
      <AboutSection stats={stats} />
      <NumbersSection />
      <CategoriesSection />
      <ArrivalsSection />
      <FeaturedSection />
      <TestimonialsSection />
      <PartnersSection />
      <CtaSection />
    </main>
  );
}
