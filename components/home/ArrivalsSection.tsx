import { createClient } from '@/lib/supabase/server';
import { ProductWithCategory } from '@/lib/types';
import ArrivalsClient from './ArrivalsClient';
import styles from './ArrivalsSection.module.css';

export default async function ArrivalsSection() {
  const supabase = await createClient();

  let { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('is_featured', true)
    .neq('status', 'out_of_stock')
    .limit(3)
    .returns<ProductWithCategory[]>();

  if (!products || products.length === 0) {
    const { data: fallbackProducts } = await supabase
      .from('products')
      .select('*, categories(name)')
      .neq('status', 'out_of_stock')
      .order('created_at', { ascending: false })
      .limit(3)
      .returns<ProductWithCategory[]>();
      
    products = fallbackProducts || [];
  }

  return (
    <section className={`section ${styles.arrivals}`} id="arrivals">
      <div className="container">
        <div className={styles.arrivalsHead}>
          <div className="left">
            <div className="eyebrow reveal-up">
              <span className="num">// 04</span>&nbsp;&nbsp;New arrivals
            </div>
            <h2 className="h-section reveal-up delay-1">
              freshly sourced. <em>ready</em> to quote.
            </h2>
          </div>
          <div className="right reveal-up delay-2">
            <p className="lede">
              Curated each month from the brands we partner with.
              Tell us what catches your eye — we will quote within four working hours.
            </p>
          </div>
        </div>

        <ArrivalsClient products={products} />
      </div>
    </section>
  );
}
