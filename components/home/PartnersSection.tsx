import styles from './PartnersSection.module.css';

const PARTNERS = [
  'TAJ HOTELS', 'INFOSYS', 'AIIMS', 'RELIANCE',
  'OBEROI', 'TATA', 'ITC', 'MARRIOTT'
] as const;

export default function PartnersSection() {
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
        <div className={`${styles.marqueeOuter} reveal-up`}>
          <div className={styles.marqueeTrack}>
            {/* First set */}
            {PARTNERS.map((name, i) => (
              <span key={`a-${i}`} className={styles.partnerName}>{name}</span>
            ))}
            {/* Exact duplicate for seamless loop */}
            {PARTNERS.map((name, i) => (
              <span key={`b-${i}`} className={styles.partnerName} aria-hidden="true">{name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
