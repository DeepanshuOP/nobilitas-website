'use client';

import { useState, useRef } from 'react';
import styles from './CategoriesSection.module.css';

const CATEGORIES = [
  { name: 'cleaning & hygiene',      count: '001 / 010', img: '/ref/about.avif'       },
  { name: 'paper & stationery',      count: '002 / 010', img: '/ref/picture-1.avif'   },
  { name: 'office electronics',      count: '003 / 010', img: '/ref/cta-picture.avif' },
  { name: 'office furniture',        count: '004 / 010', img: '/ref/picture-1.avif'   },
  { name: 'pantry & cafeteria',      count: '005 / 010', img: '/ref/category.avif'    },
  { name: 'packaging materials',     count: '006 / 010', img: '/ref/metric.avif'      },
  { name: 'corporate gifts',         count: '007 / 010', img: '/ref/cta-picture.avif' },
  { name: 'safety & ppe',            count: '008 / 010', img: '/ref/living-room.avif' },
  { name: 'electrical & lighting',   count: '009 / 010', img: '/ref/hero.avif'        },
  { name: 'housekeeping equipment',  count: '010 / 010', img: '/ref/about.avif'       },
] as const;

export default function CategoriesSection() {
  const [active, setActive] = useState(0);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleClick(i: number) {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setActive(i);
  }

  function handleMouseEnter(i: number) {
    hoverTimer.current = setTimeout(() => setActive(i), 110);
  }

  function handleMouseLeave() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  }

  return (
    <section className={`section ${styles.catsSection}`} id="categories">
      <div className="container">
        <div className={styles.cats}>
          {/* Head — full-width */}
          <div className={styles.catsHead}>
            <div className="left">
              <div className="eyebrow reveal-up">
                <span className="num">// 03</span>&nbsp;&nbsp;The catalog
              </div>
              <h2 className="h-section reveal-up delay-1">
                ten categories. <em>one</em> supplier.
              </h2>
            </div>
            <div className="right reveal-up delay-2">
              <p className="lede">
                Hover or tap a category to peek at how it lives in a real space.
                Every line item is available on inquiry, pan-India.
              </p>
            </div>
          </div>

          {/* Image panel */}
          <div className="reveal-left">
            <div className={styles.catsImageWrap}>
              {CATEGORIES.map((cat, i) => (
                <div
                  key={cat.name}
                  className={`${styles.catsImage}${active === i ? ` ${styles.active}` : ''}`}
                  style={{ backgroundImage: `url('${cat.img}')` }}
                >
                  <div className={styles.catOverlay}>
                    <span className={styles.name}>{cat.name}</span>
                    <span className={styles.count}>{cat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* List */}
          <div className={`${styles.catsList} reveal-right delay-2`}>
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.name}
                className={`${styles.catItem}${active === i ? ` ${styles.active}` : ''}`}
                onClick={() => handleClick(i)}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={handleMouseLeave}
              >
                <span className={styles.catName}>{cat.name}</span>
                <span className={styles.catNum}>{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
