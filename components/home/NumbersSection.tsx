'use client';

import { useEffect, useRef } from 'react';
import styles from './NumbersSection.module.css';

const METRICS = [
  { target: 400, suffix: '+', decimals: 0, label: 'Corporate clients' },
  { target: 12, suffix: '', decimals: 0, label: 'Years in business' },
  { target: 26, suffix: '', decimals: 0, label: 'States served' },
  { target: 5.0, suffix: '', decimals: 1, label: 'Google rating' },
  { target: 4, suffix: 'hr', decimals: 0, label: 'Quote turnaround' },
] as const;

const delays = ['', 'delay-1', 'delay-2', 'delay-3', 'delay-4'];

export default function NumbersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const numRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          METRICS.forEach((m, i) => {
            const el = numRefs.current[i];
            if (!el) return;
            
            setTimeout(() => {
              const start = performance.now();
              const duration = 1600;
              
              function step(now: number) {
                const progress = Math.min((now - start) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                const value = m.target * ease;
                
                el!.textContent = m.decimals > 0
                  ? value.toFixed(m.decimals) + m.suffix
                  : Math.floor(value) + m.suffix;
                  
                if (progress < 1) requestAnimationFrame(step);
              }
              requestAnimationFrame(step);
            }, i * 100);
          });
          
          if (sectionRef.current) {
             observer.unobserve(sectionRef.current);
          }
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.numbers}>
      <div className="container">
        <div className={styles.numbersRow}>
          {METRICS.map((m, i) => (
            <div key={m.label} className={`${styles.metric} reveal-up ${delays[i]}`}>
              <div 
                className={styles.metricNum} 
                ref={(el) => { numRefs.current[i] = el; }}
              >
                0{m.suffix}
              </div>
              <div className={styles.metricLabel}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
