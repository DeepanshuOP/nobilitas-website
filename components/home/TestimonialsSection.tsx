'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './TestimonialsSection.module.css';

const SLIDES = [
  {
    photo: '/ref/testi-1.avif',
    quote: 'Nobilitas handled procurement across 17 categories when we opened our Jaipur property. One contact. One invoice. Genuinely the easiest hotel opening I have run.',
    name: 'Priya Sharma',
    role: 'General Manager · Hospitality, Jaipur',
  },
  {
    photo: '/ref/testi-2.avif',
    quote: 'We switched all our office procurement to Nobilitas. Response time is under four hours, every time. The team understands what enterprise compliance looks like.',
    name: 'Vikram Mehta',
    role: 'Admin Head · IT Services, Bengaluru',
  },
  {
    photo: '/ref/testi-3.avif',
    quote: 'Best sourcing partner we have worked with in twelve years of facilities management. Quiet, consistent, and respectful of how a hospital actually runs.',
    name: 'Ananya Rao',
    role: 'Facilities · Public Healthcare, Delhi NCR',
  },
] as const;

const TOTAL = SLIDES.length;

export default function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => {
    setIdx(((i % TOTAL) + TOTAL) % TOTAL);
  }, []);

  /* Autoplay */
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => goTo(idx + 1), 8000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [idx, paused, goTo]);

  return (
    <section className={`section ${styles.testimonials}`} id="testimonials">
      <div className="container">
        <div className={styles.testimonialsHead}>
          <div className="left">
            <div className="eyebrow reveal-up">
              <span className="num">// 06</span>&nbsp;&nbsp;Voices from the field
            </div>
            <h2 className="h-section reveal-up delay-1">
              what our <em>clients</em> say.
            </h2>
          </div>
          <div className={`${styles.testiNav} reveal-up delay-2`}>
            <button aria-label="Previous" onClick={() => goTo(idx - 1)}>
              <svg viewBox="0 0 24 24" strokeLinecap="round">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button aria-label="Next" onClick={() => goTo(idx + 1)}>
              <svg viewBox="0 0 24 24" strokeLinecap="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        <div
          className={styles.testiViewport}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className={styles.testiTrack}
            style={{ transform: `translateX(-${idx * 100}%)` }}
          >
            {SLIDES.map((s) => (
              <div key={s.name} className={styles.testiSlide}>
                <div
                  className={styles.testiPhoto}
                  style={{ backgroundImage: `url('${s.photo}')` }}
                >
                  <span className={styles.quoteMark}>&ldquo;</span>
                </div>
                <div className={styles.testiBody}>
                  <p className={styles.testiQuote}>{s.quote}</p>
                  <div className={styles.testiAttrib}>
                    <span className={styles.line} />
                    <span>
                      <strong className={styles.name}>{s.name}</strong>
                      &nbsp;
                      <span className={styles.role}>{s.role}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.testiDots}>
          {SLIDES.map((s, i) => (
            <button
              key={s.name}
              className={i === idx ? styles.active : ''}
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
