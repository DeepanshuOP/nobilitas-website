import styles from './NumbersSection.module.css';

const METRICS = [
  { num: '400', unit: '+', label: 'Corporate clients' },
  { num: '12',  unit: '',  label: 'Years in business' },
  { num: '26',  unit: '',  label: 'States served'     },
  { num: '5.0', unit: '',  label: 'Google rating'     },
  { num: '4',   unit: 'hr',label: 'Quote turnaround'  },
] as const;

const delays = ['', 'delay-1', 'delay-2', 'delay-3', 'delay-4'];

export default function NumbersSection() {
  return (
    <section className={styles.numbers}>
      <div className="container">
        <div className={styles.numbersRow}>
          {METRICS.map((m, i) => (
            <div key={m.label} className={`${styles.metric} reveal-up ${delays[i]}`}>
              <div className={styles.metricNum}>
                {m.num}
                {m.unit && <span className={styles.unit}>{m.unit}</span>}
              </div>
              <div className={styles.metricLabel}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
