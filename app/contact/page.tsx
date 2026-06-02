'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { CreateInquiryInput } from '@/lib/types';
import { COMPANY } from '@/lib/siteData';
import styles from './contact.module.css';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [source, setSource] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Reveal animation observer
  useEffect(() => {
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('reveal-in');
            ro.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    els.forEach((el) => ro.observe(el));

    // Failsafe
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach((el) => {
        if (!el.classList.contains('reveal-in')) el.classList.add('reveal-in');
      });
    }, 3000);

    return () => {
      ro.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const supabase = createClient();

    let sourceMapped = 'other';
    if (source === 'Google search') sourceMapped = 'google';
    if (source === 'WhatsApp referral') sourceMapped = 'whatsapp_referral';
    if (source === 'Existing client') sourceMapped = 'existing_client';
    if (source === 'Trade directory') sourceMapped = 'trade_directory';

    const inquiryData: CreateInquiryInput = {
      name,
      company,
      email,
      phone,
      message,
      source: sourceMapped,
      product_id: null,
      products_interested: '',
      quantity: '',
    };

    const { error } = await supabase.from('inquiries').insert([inquiryData]);

    setSubmitting(false);

    if (error) {
      setErrorMsg('Something went wrong. Please try WhatsApp instead.');
    } else {
      setSent(true);
    }
  };

  return (
    <main style={{ background: 'var(--cream-light)' }}>
      {/* ── Page head ─────────────────────────────────────────────── */}
      <section className={styles.pageHead}>
        <div className={`container ${styles.pageHeadContainer}`}>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span className={styles.sep}>/</span>
            <span className={styles.current}>Contact</span>
          </div>

          <div className="eyebrow reveal-up">
            <span className="num">// 05</span>&nbsp;&nbsp;Get in touch
          </div>

          <h1 className="h-display reveal-up delay-1" style={{ marginTop: '24px', maxWidth: '880px' }}>
            tell us what your <em>workplace</em> needs.
          </h1>
        </div>
      </section>

      {/* ── Main Section ────────────────────────────────────────────── */}
      <section className={styles.mainSection}>
        <div className={`container ${styles.mainGrid}`}>
          {/* Left Column */}
          <div className="reveal-left">
            <p className="lede" style={{ maxWidth: '520px', marginBottom: '48px' }}>
              "The fastest path is WhatsApp — drop a list or a photo of a procurement spec, and we'll respond with sourcing and pricing within four working hours."
            </p>

            <a
              href={`https://wa.me/${COMPANY.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.waCard}
            >
              <div className={styles.waCircle}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <div className={styles.waText}>
                <div className={styles.waPhone}>{COMPANY.phone}</div>
                <div className={styles.waSub}>WhatsApp · Mon–Sat · 9 AM – 7 PM IST</div>
              </div>
              <span className={styles.waArrow}>↗</span>
            </a>

            <div className={styles.contactDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>
                  <a href={`mailto:${COMPANY.email}`} style={{ color: 'inherit' }}>{COMPANY.email}</a>
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Phone</span>
                <span className={styles.detailValue}>
                  <a href={`tel:${COMPANY.phone.replace(/ /g, '')}`} style={{ color: 'inherit' }}>{COMPANY.phone}</a>
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Address</span>
                <span className={styles.detailValue}>
                  {COMPANY.addressLine1}, {COMPANY.addressLine2}, {COMPANY.city}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Hours</span>
                <span className={styles.detailValue}>
                  Mon–Sat, 9 AM – 7 PM IST
                </span>
              </div>
            </div>

            {/* Map Block inside Left Column container structure, but positioned full width via grid if desired.
                Wait, instructions say: MAP BLOCK margin-top: 96px... Grid: 1fr 1.4fr...
                I will place it under the main grid or inside it? The instructions say "margin-top: 96px" as a separate block.
                I will put it after the mainGrid. */}
          </div>

          {/* Right Column — Form */}
          <div className="reveal-right delay-1">
            <div className={styles.formCard}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.4" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 12l3 3 5-5" />
                    </svg>
                  </div>
                  <div className="eyebrow" style={{ marginTop: '20px' }}>// sent</div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: '28px', fontStyle: 'italic', color: 'var(--fg-1)', margin: '16px 0 0' }}>
                    Your inquiry is with our team.
                  </h3>
                  <p style={{ fontFamily: 'var(--sans)', fontWeight: 300, fontSize: '16px', lineHeight: '1.65', color: 'var(--fg-2)', margin: '16px auto 28px', maxWidth: '320px' }}>
                    Expect a WhatsApp reply within 4 working hours.
                  </p>
                  <button className="btn btn--outline-dark" onClick={() => setSent(false)}>
                    Send another <span className="arrow">→</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="eyebrow">// form&nbsp;&nbsp;Send an inquiry</div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: '24px', textTransform: 'lowercase', color: 'var(--fg-1)', margin: '16px 0 32px' }}>
                    we reply within one working day.
                  </h3>

                  <div className={styles.formFields}>
                    <div className={styles.fieldGroup}>
                      <label>Your name</label>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.inputBase}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label>Company</label>
                      <input
                        type="text"
                        placeholder="Organisation name"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className={styles.inputBase}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label>Email address</label>
                      <input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.inputBase}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label>Phone / WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="+91 93140 93160"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={styles.inputBase}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label>What do you need?</label>
                      <textarea
                        rows={5}
                        placeholder="Paste a product list, describe your requirements, or send a photo of your old PO."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className={`${styles.inputBase} ${styles.textarea}`}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label>How did you hear about us?</label>
                      <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className={`${styles.inputBase} ${styles.select}`}
                      >
                        <option value="">Select...</option>
                        <option value="Google search">Google search</option>
                        <option value="WhatsApp referral">WhatsApp referral</option>
                        <option value="Existing client">Existing client</option>
                        <option value="Trade directory">Trade directory</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn--dark"
                    style={{ width: '100%', marginTop: '28px', justifyContent: 'center', opacity: submitting ? 0.7 : 1 }}
                    disabled={submitting}
                  >
                    {submitting ? 'Sending…' : <>Send inquiry <span className="arrow">↗</span></>}
                  </button>
                  {errorMsg && (
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#a1352a', marginTop: '12px', textAlign: 'center' }}>
                      {errorMsg}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ── Map Block ────────────────────────────────────────────── */}
        <div className={`container ${styles.mapBlock} reveal-up`}>
          <div>
            <div className="eyebrow">// find us</div>
            <h2 className="h-section" style={{ marginTop: '24px', marginBottom: '20px' }}>
              our jaipur office.
            </h2>
            <p style={{ fontFamily: 'var(--sans)', fontWeight: 300, fontSize: '15px', lineHeight: '1.8', color: 'var(--fg-2)' }}>
              {COMPANY.addressLine1}<br />
              {COMPANY.addressLine2}, {COMPANY.city}<br />
              {COMPANY.state}
            </p>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-3)', marginTop: '20px' }}>
              // Pan-India delivery from Jaipur
            </p>
          </div>
          <div className={styles.mapWrapper}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28469.193965532086!2d75.7743146!3d26.8828829!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db585a4f2490d%3A0x24533d8add4d1375!2sNobilitas%20Ventures%20LLP!5e0!3m2!1sen!2sin!4v1779994250527!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Nobilitas Ventures LLP - Jaipur Office"
            />
            <div className={styles.mapActions}>
              <a
                href="https://maps.app.goo.gl/zVyAjbQYoVXAYJyZ6"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapBtn}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                Open in Google Maps
              </a>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination_place_id=0x396db585a4f2490d:0x24533d8add4d1375&destination=Nobilitas+Ventures+LLP"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapBtn}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                </svg>
                Get directions
              </a>
              <button
                className={styles.mapBtn}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Nobilitas Ventures LLP',
                      text: 'C 3 & 4, Above Evok Furniture Store, MJRP College Road, Nandpuri, Jaipur 302019',
                      url: 'https://maps.app.goo.gl/zVyAjbQYoVXAYJyZ6'
                    })
                  } else {
                    navigator.clipboard.writeText('https://maps.app.goo.gl/zVyAjbQYoVXAYJyZ6')
                    alert('Location link copied to clipboard')
                  }
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share address
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
