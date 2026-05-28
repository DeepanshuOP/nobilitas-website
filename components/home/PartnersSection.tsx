'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './PartnersSection.module.css';
import { CLIENTS } from '@/lib/siteData';

export default function PartnersSection() {
  const [showPopup, setShowPopup] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => setShowPopup(false), 150);
  };

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);
  return (
    <section className="section" id="partners">
      <div className="container">
        <div className={styles.partnersHead}>
          <div className="left">
            <div className="eyebrow reveal-up">
              <span className="num">// 07</span>&nbsp;&nbsp;Trusted by
            </div>
            <h2 className="h-section reveal-up delay-1">
              400+ organisations <em>across</em> india.
            </h2>
          </div>
          <div className="right reveal-up delay-2">
            <p className="lede">
              From hotel chains to public hospitals, manufacturing campuses to law firms
              — we supply the operational backbone, quietly.
            </p>
          </div>
        </div>
        <div style={{ position: 'relative' }} onMouseLeave={handleMouseLeave}>
          <div 
            className={`${styles.popup} ${showPopup ? styles.popupVisible : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.popupHeader}>
              <p className={styles.popupHeaderLeft}>// Our clients</p>
              <p className={styles.popupHeaderRight}>400+ organisations</p>
            </div>
            <div className={styles.popupGrid}>
              {CLIENTS.map((client) => (
                <div key={client.name} className={styles.clientCell}>{client.name}</div>
              ))}
            </div>
            <div className={styles.popupFooter}>
              <p>Supplied to 400+ organisations</p>
              <Link href="/contact">Send an inquiry →</Link>
            </div>
          </div>

          <div className={`${styles.marqueeOuter} reveal-up`}>
            <div className={`${styles.marqueeTrack} ${showPopup ? styles.paused : ''}`}>
              {/* First set */}
              {CLIENTS.map((client, i) => (
                <span key={`a-${i}`} className={styles.partnerName} onMouseEnter={handleMouseEnter}>{client.shortName}</span>
              ))}
              {/* Exact duplicate for seamless loop */}
              {CLIENTS.map((client, i) => (
                <span key={`b-${i}`} className={styles.partnerName} aria-hidden="true" onMouseEnter={handleMouseEnter}>{client.shortName}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
