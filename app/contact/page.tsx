'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { CreateInquiryInput } from '@/lib/types';
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
              href="https://wa.me/919876543210"
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
                <div className={styles.waPhone}>+91 98765 43210</div>
                <div className={styles.waSub}>WhatsApp · Mon–Sat · 9 AM – 7 PM IST</div>
              </div>
              <span className={styles.waArrow}>↗</span>
            </a>

            <div className={styles.contactDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>
                  <a href="mailto:sales@nobilitas.in" style={{ color: 'inherit' }}>sales@nobilitas.in</a>
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Phone</span>
                <span className={styles.detailValue}>
                  <a href="tel:+919876543210" style={{ color: 'inherit' }}>+91 98765 43210</a>
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Address</span>
                <span className={styles.detailValue}>
                  12, Sansar Chandra Road, C-Scheme, Jaipur 302001
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
                        placeholder="+91 98765 43210" 
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
              12, Sansar Chandra Road<br/>
              C-Scheme, Jaipur 302001<br/>
              Rajasthan, India
            </p>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-3)', marginTop: '20px' }}>
              // Pan-India delivery from Sitapura warehouse
            </p>
          </div>
          <div className={styles.mapPlaceholder}>
            <svg viewBox="0 0 24 24">
              <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
              // interactive map · coming soon
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
