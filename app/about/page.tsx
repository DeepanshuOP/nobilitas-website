'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './about.module.css';
import { CLIENTS, BRANDS } from '@/lib/siteData';

const TEAM_GRADIENTS = [
  'linear-gradient(135deg, #f0e3cc, #d8c5a0)',
  'linear-gradient(135deg, #ddd3bd, #c9c0a8)',
  'linear-gradient(135deg, #c9b69c, #a89373)',
  'linear-gradient(135deg, #d9dccf, #b8c0ad)',
  'linear-gradient(135deg, #f0e3cc, #d8c5a0)',
  'linear-gradient(135deg, #ece5d7, #ddd3bd)',
];

function formatProductCount(n: number): string {
  if (n === 0) return '—';
  if (n < 100) return `${n}`;
  const rounded = Math.floor(n / 100) * 100;
  return `${rounded.toLocaleString()}+`;
}

// SVG components for Values
const IconOne = () => (
  <svg viewBox="0 0 60 60" fill="none" style={{ width: '60px', height: '60px' }}>
    <circle cx="30" cy="30" r="8" stroke="var(--gold)" strokeWidth="0.8" />
    <circle cx="30" cy="30" r="14" stroke="var(--gold)" strokeWidth="0.8" opacity="0.7" />
    <circle cx="30" cy="30" r="20" stroke="var(--gold)" strokeWidth="0.8" opacity="0.5" />
    <circle cx="30" cy="30" r="26" stroke="var(--gold)" strokeWidth="0.8" opacity="0.35" />
    <circle cx="30" cy="30" r="32" stroke="var(--gold)" strokeWidth="0.8" opacity="0.2" />
  </svg>
);

const IconTwo = () => (
  <svg viewBox="0 0 60 60" fill="none" style={{ width: '60px', height: '60px' }}>
    <rect x="30" y="30" width="8" height="8" stroke="var(--gold)" strokeWidth="0.8" />
    <rect x="26" y="26" width="16" height="16" stroke="var(--gold)" strokeWidth="0.8" opacity="0.7" />
    <rect x="22" y="22" width="24" height="24" stroke="var(--gold)" strokeWidth="0.8" opacity="0.5" />
    <rect x="18" y="18" width="32" height="32" stroke="var(--gold)" strokeWidth="0.8" opacity="0.35" />
    <rect x="14" y="14" width="40" height="40" stroke="var(--gold)" strokeWidth="0.8" opacity="0.2" />
  </svg>
);

const IconThree = () => {
  const circles = Array.from({ length: 12 }).map((_, i) => {
    const r = 4 + i * 4;
    const op = 0.08 + i * 0.08;
    return <circle key={i} cx="30" cy="30" r={r} stroke="var(--gold)" strokeWidth="0.8" opacity={Math.min(op, 1)} />;
  });
  return (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: '60px', height: '60px' }}>
      {circles}
    </svg>
  );
};

const IconFour = () => (
  <svg viewBox="0 0 60 60" fill="none" style={{ width: '60px', height: '60px' }}>
    <path d="M 30 10 C 40 10, 50 20, 50 30 C 50 40, 40 50, 30 50 C 20 50, 10 40, 10 30 C 10 20, 20 10, 30 10 Z" stroke="var(--gold)" strokeWidth="0.8" opacity="1" />
    <path d="M 30 14 C 38 14, 46 22, 46 30 C 46 38, 38 46, 30 46 C 22 46, 14 38, 14 30 C 14 22, 22 14, 30 14 Z" stroke="var(--gold)" strokeWidth="0.8" opacity="0.7" />
    <path d="M 30 18 C 36 18, 42 24, 42 30 C 42 36, 36 42, 30 42 C 24 42, 18 36, 18 30 C 18 24, 24 18, 30 18 Z" stroke="var(--gold)" strokeWidth="0.8" opacity="0.5" />
    <path d="M 30 22 C 34 22, 38 26, 38 30 C 38 34, 34 38, 30 38 C 26 38, 22 34, 22 30 C 22 26, 26 22, 30 22 Z" stroke="var(--gold)" strokeWidth="0.8" opacity="0.3" />
    <path d="M 30 26 C 32 26, 34 28, 34 30 C 34 32, 32 34, 30 34 C 28 34, 26 32, 26 30 C 26 28, 28 26, 30 26 Z" stroke="var(--gold)" strokeWidth="0.8" opacity="0.1" />
  </svg>
);

const IconFive = () => (
  <svg viewBox="0 0 60 60" fill="none" style={{ width: '60px', height: '60px' }}>
    <path d="M30 4 L52 17 L52 43 L30 56 L8 43 L8 17 Z" stroke="var(--gold)" strokeWidth="0.8" opacity="0.2" />
    <path d="M30 10 L46 19 L46 41 L30 50 L14 41 L14 19 Z" stroke="var(--gold)" strokeWidth="0.8" opacity="0.4" />
    <path d="M30 16 L40 21 L40 39 L30 44 L20 39 L20 21 Z" stroke="var(--gold)" strokeWidth="0.8" opacity="0.6" />
    <path d="M30 22 L34 24 L34 36 L30 38 L26 36 L26 24 Z" stroke="var(--gold)" strokeWidth="0.8" opacity="0.8" />
    <path d="M30 28 L31 29 L31 31 L30 32 L29 31 L29 29 Z" stroke="var(--gold)" strokeWidth="0.8" opacity="1" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.78 12.53L14.03 19.28C13.88 19.43 13.69 19.5 13.5 19.5C13.31 19.5 13.12 19.43 12.97 19.28C12.68 18.99 12.68 18.51 12.97 18.22L18.44 12.75H3.75C3.34 12.75 3 12.41 3 12C3 11.59 3.34 11.25 3.75 11.25H18.44L12.97 5.78C12.68 5.49 12.68 5.01 12.97 4.72C13.26 4.43 13.74 4.43 14.03 4.72L20.78 11.47C21.07 11.76 21.07 12.24 20.78 12.53Z" fill="currentColor" />
  </svg>
);

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ productCount: 0, categoryCount: 0 });

  useEffect(() => {
    setMounted(true);
    
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => {});

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));

    // Failsafe — force reveal-in after 3s if observer fires late
    const timer = setTimeout(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.classList.add('revealed');
      });
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <main>
      {/* HERO SECTION */}
      <section className={styles.aboutHeroSection}>
        <div className={styles.fullContainer}>
          <div className={styles.aboutHeroWrap}>
            <div className={styles.aboutHeroHeading}>
              <h1 style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(75px)',
                transition: 'opacity 880ms cubic-bezier(0.22, 1, 0.36, 1), transform 880ms cubic-bezier(0.22, 1, 0.36, 1)',
                transitionDelay: '0ms'
              }}>
                built to equip india's finest workplaces.
              </h1>
            </div>
            <div
              className={styles.aboutHeroSubheading}
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(75px)',
                transition: 'opacity 880ms cubic-bezier(0.22, 1, 0.36, 1), transform 880ms cubic-bezier(0.22, 1, 0.36, 1)',
                transitionDelay: '200ms'
              }}
            >
              <div className={styles.aboutHeroDescription}>
                <p>Nobilitas believes a well-equipped workplace reflects how much an organisation values its people.</p>
              </div>
              <a
                href="#story-section"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(75px)',
                  transition: 'opacity 880ms cubic-bezier(0.22, 1, 0.36, 1), transform 880ms cubic-bezier(0.22, 1, 0.36, 1)',
                  transitionDelay: '400ms'
                }}
              >
                (SCROLL DOWN)
              </a>
            </div>
            <div className={styles.aboutHeroImage}>
              <img src="/ref/cta-picture.avif" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} alt="Hero" />
            </div>
          </div>
        </div>
      </section>

      {/* STORY SECTION */}
      <section id="story-section" className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.storyWrap}>
            <div className={styles.label}>
              <p>// 01</p>
              <p>/ About Us</p>
            </div>
            <div className={styles.storyContent}>
              <div className={styles.storyLeft}>
                <div className={styles.storyTitle}>
                  <h2 className={styles.h2SerifLeft} data-reveal="up">welcome to nobilitas</h2>
                </div>
                <Link href="/contact" className={styles.secondaryButton} data-reveal="up" data-delay="100">
                  <p className={styles.secondaryButtonText}>CONTACT US</p>
                  <div className={styles.btnIcon}>
                    <div className={styles.btnIconSvg1}><ArrowIcon /></div>
                    <div className={styles.btnIconSvg2}><ArrowIcon /></div>
                  </div>
                </Link>
              </div>
              <div className={styles.storyRight}>
                <p className={styles.storyP} data-reveal="up" data-delay="200">
                  Nobilitas is a premier B2B workplace solutions provider based in Jaipur, Rajasthan. With a curated portfolio of cleaning products, office electronics, furniture, paper goods, and corporate gifting, we help organisations of all sizes maintain seamless, well-equipped operations.
                  <br /><br />
                  Our approach is built on reliability, speed, and genuine partnership. Whether you're stocking a corporate campus or outfitting a new hotel property, we make procurement effortless — one supplier, one quote, one invoice.
                </p>
                <div className={styles.storyKeyMetric}>
                  <div className={styles.keyMetricLeft} data-reveal="up" data-delay="100">
                    <h2 className={styles.h2SansLeft}>{formatProductCount(stats.productCount)}</h2>
                    <p className={styles.p1LeftRegularGrey}>Products across {stats.categoryCount || '—'} categories</p>
                  </div>
                  <div className={styles.keyMetricRight} data-reveal="up" data-delay="200">
                    <h2 className={styles.h2SansLeft}>400+</h2>
                    <p className={styles.p1LeftRegularGrey}>Corporate clients pan-India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER SECTION */}
      <section className={styles.partnerSection}>
        <div className={styles.container}>
          <div className={styles.partnerWrap}>
            <div className={styles.partnerHeading}>
              <div className={styles.label}>
                <p>// 02</p>
                <p>/ Our Clients</p>
              </div>
              <h2 className={styles.h2SerifLeft} data-reveal="up">trusted by hundreds</h2>
            </div>
          </div>
        </div>
        <div className={styles.clientsGrid}>
          {CLIENTS.map((client, i) => (
            <div 
              key={client.name} 
              className={styles.clientCell}
              data-reveal="fade"
              data-delay={['100', '200', '300'][i % 3]}
            >
              {client.name}
            </div>
          ))}
        </div>
        <div className={styles.container}>
          <p className={styles.clientsFooterText}>
            And 400+ more across corporate offices, hospitals, manufacturing units, and hospitality groups across India.
          </p>
        </div>
      </section>

      {/* VISION & MISSION SECTION */}
      <section className={styles.visionMissionSection}>
        <div className={styles.container}>
          <div className={styles.visionMissionWrap}>
            <div className={styles.label}>
              <p>// 03</p>
              <p>/ Vision & Mission</p>
            </div>
            <div className={styles.visionMissionHeading}>
              <div className={styles.visionMissionTitle}>
                <h2 className={styles.h2SerifLeft} data-reveal="up">what we truly stand for</h2>
              </div>
              <div className={styles.visionMissionImage} data-reveal="fade" data-delay="100">
                <img src="/ref/about.avif" style={{ width: '100%', height: '100%', objectFit: 'cover' }} height="320" alt="Vision" />
              </div>
            </div>
            <div className={styles.visionContent}>
              <div className={styles.visionContentText}>
                <div className={styles.visionLeft} data-reveal="right">
                  <div className={styles.visionNumber}><h3 className={styles.h4Left}>1</h3></div>
                  <div className={styles.visionTitleText}><h3 className={styles.h3SansLeftCapitalized}>Our Vision</h3></div>
                </div>
                <div className={styles.visionDescription} data-reveal="right" data-delay="100">
                  <p>To become the most trusted single-source procurement partner for India's offices, hotels, hospitals, and factories.</p>
                </div>
              </div>
              <div className={styles.missionContentText}>
                <div className={styles.missionLeft} data-reveal="right" data-delay="200">
                  <div className={styles.visionNumber}><h3 className={styles.h4Left}>2</h3></div>
                  <div className={styles.visionTitleText}><h3 className={styles.h3SansLeftCapitalized}>Our Mission</h3></div>
                </div>
                <div className={styles.missionDescription} data-reveal="right" data-delay="300">
                  <p>To deliver reliable, quality-vetted workplace supplies with speed and transparency — making procurement feel like one phone call.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE SECTION */}
      <section className={styles.valueSection}>
        <div className={styles.container}>
          <div className={styles.valueWrap}>
            <div className={styles.label}>
              <p>// 04</p>
              <p>/ Values</p>
            </div>
            <div className={styles.valueHeading}>
              <div className={styles.valueTitle}>
                <div className={styles.valueTitleText}>
                  <h2 className={styles.h2SerifLeft} data-reveal="up">values we are proud of</h2>
                </div>
                <div className={styles.valueDescription}>
                  <p>These principles guide how we source, supply, and serve.</p>
                </div>
              </div>
              <div className={styles.valueImage} data-reveal="fade">
                <img src="/ref/living-room.avif" style={{ width: '100%', height: '480px', objectFit: 'cover' }} alt="Values" />
              </div>
            </div>
            <div className={styles.valueContent}>
              <div className={styles.valueItem} data-reveal="right" data-delay="100">
                <IconOne />
                <div className={styles.valueTextContent}>
                  <h3 className={styles.h5LeftMediumCapitalized}>ONE PURCHASE ORDER</h3>
                  <p>One inquiry covers all categories. One quote. One invoice. No vendor juggling.</p>
                </div>
              </div>
              <div className={styles.valueItem} data-reveal="right" data-delay="200">
                <IconTwo />
                <div className={styles.valueTextContent}>
                  <h3 className={styles.h5LeftMediumCapitalized}>FOUR-HOUR RESPONSE</h3>
                  <p>WhatsApp us a list and receive pricing, sourcing, and lead times the same day.</p>
                </div>
              </div>
              <div className={styles.valueItem} data-reveal="right" data-delay="300">
                <IconThree />
                <div className={styles.valueTextContent}>
                  <h3 className={styles.h5LeftMediumCapitalized}>VERIFIED BRANDS ONLY</h3>
                  <p>Diversey, 3M, Godrej Interio, Kimberly-Clark, Philips — vetted on quality and compliance.</p>
                </div>
              </div>
              <div className={styles.valueItem} data-reveal="right" data-delay="100">
                <IconFour />
                <div className={styles.valueTextContent}>
                  <h3 className={styles.h5LeftMediumCapitalized}>PAN-INDIA DELIVERY</h3>
                  <p>26 states covered from our Jaipur warehouse. Same reliability everywhere.</p>
                </div>
              </div>
              <div className={styles.valueItem} data-reveal="right" data-delay="200">
                <IconFive />
                <div className={styles.valueTextContent}>
                  <h3 className={styles.h5LeftMediumCapitalized}>ENTERPRISE READY</h3>
                  <p>GST invoices, flexible MOQs, custom branding, and a dedicated account contact.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRANDS SECTION */}
      <section className={styles.brandsSection}>
        <div className={styles.container}>
          <div className={styles.brandsHeader}>
            <div className={styles.brandsHeaderLeft}>
              <div className={styles.label}>
                <p>// 05</p>
                <p>/ Brands we work with</p>
              </div>
              <h2 className={styles.brandsH2} data-reveal="up">sourced from the best.</h2>
            </div>
            <p className={styles.brandsDesc} data-reveal="up" data-delay="100">
              Every product in our catalog is sourced from manufacturers vetted on quality, compliance, and post-sale support. No compromises — only brands we would stake our name on.
            </p>
          </div>
        </div>
        <div className={styles.brandsGrid}>
          {BRANDS.map((brand, i) => (
            <div
              key={brand.name}
              className={styles.brandCard}
              data-reveal="up"
              data-delay={["100", "200", "300", "400"][i % 4]}
            >
              <div className={styles.brandLine}></div>
              <h3 className={styles.brandName}>{brand.name}</h3>
              <p className={styles.brandCat}>{brand.category}</p>
            </div>
          ))}
        </div>
        <div className={styles.brandsFooter}>
          <p>
            And 50+ more partner brands across all categories.
            <Link href="/catalog" style={{ color: 'var(--gold)', marginLeft: '6px' }}>Browse the catalog →</Link>
          </p>
        </div>
      </section>

      {/* MILESTONE SECTION */}
      <section className={styles.milestoneSection}>
        <div className={styles.container}>
          <div className={styles.milestoneWrap}>
            <div className={styles.label}>
              <p>// 06</p>
              <p>/ Milestone</p>
            </div>
            <div className={styles.milestoneContent}>
              <div className={styles.milestoneTitle}>
                <h2 className={styles.h2SerifLeft} data-reveal="up">our journey</h2>
                <p data-reveal="up" data-delay="100">A timeline of growth and commitment to India's workplaces.</p>
              </div>
              <div className={styles.milestoneContentBottom}>
                <div className={styles.milestoneListing}>
                  {[
                    { year: '2014', title: 'nobilitas was founded', desc: 'Started in Jaipur with 3 categories and one warehouse.' },
                    { year: '2016', title: 'first hospitality contract', desc: 'Signed our first pan-property hotel supply agreement.' },
                    { year: '2018', title: 'expanded to 10 categories', desc: 'Added electronics, lighting, safety, and gifting.' },
                    { year: '2020', title: 'pan-india logistics', desc: 'Delivery network built across 26 states.' },
                    { year: '2023', title: '400+ active clients', desc: 'Across corporate, hospitality, and healthcare.' },
                    { year: '2026', title: 'nobilitas.in launched', desc: 'The digital catalog goes live.' },
                  ].map((m, i) => (
                    <div className={styles.journeyList} key={m.year} data-reveal="up" data-delay={['100', '200', '300'][i % 3]}>
                      <div className={styles.journeyYear}>
                        <div className={styles.journeySquare}></div>
                        <h3 className={styles.h3SansLeft}>{m.year}</h3>
                      </div>
                      <div className={styles.journeyDescription}>
                        <h4 className={styles.journeyText}>{m.title}</h4>
                        <p>{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.milestoneImage} data-reveal="fade" data-delay="200">
                  <img src="/ref/metric.avif" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Our Journey" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className={styles.teamsSection}>
        <div className={styles.container}>
          <div className={styles.label}>
            <p>// 07</p>
            <p>/ Our Team</p>
          </div>
          <div className={styles.teamsHeading}>
            <h2 className={styles.h2SerifLeft} data-reveal="up">meet our team</h2>
          </div>
          <div className={styles.meetTeamItems}>
            {[
              { id: '001', name: 'Rahul Nagar', role: 'Founder & Managing Partner', tone: styles.toneWarm },
              { id: '002', name: 'Priya Sharma', role: 'Head of Sales', tone: styles.toneDeep },
              { id: '003', name: 'Arjun Mehta', role: 'Logistics & Operations', tone: styles.toneCocoa },
              { id: '004', name: 'Neha Joshi', role: 'Corporate Accounts', tone: styles.toneSage },
              { id: '005', name: 'Vikram Singh', role: 'Catalog & Sourcing', tone: styles.toneWarm },
              { id: '006', name: 'Ananya Rao', role: 'Client Experience', tone: styles.toneDefault },
            ].map((member, i) => (
              <div className={styles.teamCard} key={member.id} data-reveal="up" data-delay={['100', '200', '300'][i % 3]}>
                <div
                  className={styles.teamImage}
                  style={{ background: TEAM_GRADIENTS[i % 6] }}
                >
                  <svg width="48" height="48" viewBox="0 0 60 60"
                    fill="none" stroke="rgba(90,79,66,0.4)" strokeWidth="1">
                    <circle cx="30" cy="20" r="12"/>
                    <path d="M6 60c0-13 48-13 48 0"/>
                  </svg>
                </div>
                <div className={styles.teamText}>
                  <p className={styles.teamNumber}>// {member.id}</p>
                  <div className={styles.teamName}>
                    <h5 className={styles.h5LeftMediumCapitalized}>{member.name}</h5>
                    <p className={styles.regularItalic}>{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.ctaAboutImageSection}>
        <div className={styles.ctaAboutImageWrap}>
          <div className={styles.ctaAboutHeading}>
            <h1 className={styles.h1LeftRegularWhite} data-reveal="up">ready to equip your workplace?</h1>
            <div className={styles.ctaAboutSubheading} data-reveal="up" data-delay="100">
              <p>Find the right supplier for cleaning, furniture, electronics, and everything else your organisation needs.</p>
            </div>
          </div>
          <Link href="/catalog" className={styles.primaryButton} data-reveal="up" data-delay="200">
            <div className={styles.primaryBtnTextWrap}>
              <p className={styles.primaryBtnText}>START BROWSING</p>
              <p className={`${styles.primaryBtnText} ${styles.hover}`}>START BROWSING</p>
            </div>
            <div className={styles.btnIcon}>
              <div className={styles.btnIconSvg1}><ArrowIcon /></div>
              <div className={styles.btnIconSvg2}><ArrowIcon /></div>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
