import styles from './PartnersSection.module.css';

const PARTNERS = ['Taj Hotels', 'Infosys', 'AIIMS', 'Reliance', 'Oberoi', 'Tata', 'ITC', 'Marriott'] as const;

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
        <div className={`${styles.partnersStrip} reveal-up`}>
          {PARTNERS.map((p) => (
            <span key={p} className={styles.partner}>{p}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
