'use client';

import Link from 'next/link';
import { ProductWithCategory } from '@/lib/types';
import styles from './ArrivalsSection.module.css';

const delays = ['delay-1', 'delay-2', 'delay-3'] as const;

interface ArrivalsClientProps {
  products: ProductWithCategory[];
}

export default function ArrivalsClient({ products }: ArrivalsClientProps) {
  return (
    <div className={styles.arrivalsGrid}>
      {products.map((p, i) => {
        const num = `00${i + 1} / 03`;
        const avail = p.pack_sizes && p.pack_sizes.length > 0 ? p.pack_sizes[0] : 'Available on inquiry';
        
        return (
          <Link href={`/catalog/${p.slug}`} key={p.sku} className={`${styles.productCard} reveal-up ${delays[i]}`}>
            <div
              className={styles.productImg}
              style={p.image_url ? { backgroundImage: `url('${p.image_url}')` } : {}}
            >
              <span className={styles.sku}>{p.sku}</span>
              <span className={styles.pnum}>{num}</span>
              <span className={styles.pcat}>// {p.categories?.name?.toLowerCase() || 'category'}</span>
            </div>
            <div className={styles.productMeta}>
              <h3 className={styles.productName}>{p.name}</h3>
              <div className={styles.productFoot}>
                <span className={styles.avail}>{avail}</span>
                <span className={styles.view}>
                  View details <span className={styles.arrow}>→</span>
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
