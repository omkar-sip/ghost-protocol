'use client';

import { useEffect, useRef, useState } from 'react';
import { SectionProps } from '@/types/theme';

const WHATSAPP_NUMBER = '919483937558';

export default function JoinSection({ settings: content }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [transmitting, setTransmitting] = useState(false);

  useEffect(() => {
    const reveals = sectionRef.current?.querySelectorAll('.reveal');
    if (!reveals) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTransmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const notes = String(formData.get('notes') ?? '').trim();

    const message = [
      'New Join Form Submission',
      `Name: ${name}`,
      `Email: ${email}`,
      `Notes: ${notes || 'N/A'}`,
    ].join('\n');

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setSubmitted(true);
    setTransmitting(false);
    form.reset();
  };

  return (
    <section
      ref={sectionRef}
      id="join"
      style={{
        padding: '6rem 2rem',
        background: 'var(--color-surface-container)',
        position: 'relative'
      }}
    >
      {/* Doodle accent */}
      <svg
        className="doodle-arrow"
        style={{ top: '5%', right: '8%', width: '80px', opacity: 0.12 }}
        viewBox="0 0 80 80"
        aria-hidden="true"
      >
        <circle cx="40" cy="40" r="35" stroke="#406900" strokeWidth="1.5" strokeDasharray="6 4" fill="none" />
        <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#406900" fontSize="22" fontFamily="monospace">?</text>
      </svg>

      <div
        className="pencil-border reveal"
        style={{
          maxWidth: '820px', margin: '0 auto',
          background: 'var(--color-surface-container-lowest)',
          padding: 'clamp(2rem, 6vw, 5rem)', position: 'relative'
        }}
      >
        {/* GP watermark */}
        <div
          style={{
            position: 'absolute', top: '2rem', right: '2.5rem',
            opacity: 0.06, fontSize: '7rem',
            fontFamily: "'Epilogue', sans-serif", fontWeight: 900,
            lineHeight: 1, userSelect: 'none'
          }}
          aria-hidden="true"
        >
          GP
        </div>

        {/* Header */}
        <header
          style={{
            marginBottom: '2.5rem', paddingBottom: '1.5rem',
            borderBottom: '2px solid var(--color-on-surface)'
          }}
        >
          <h3
            className="font-headline"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.1
            }}
            dangerouslySetInnerHTML={{ __html: content.title }}
          />
          <p className="stamp" style={{ marginTop: '0.6rem' }}>{content.stamp}</p>
        </header>

        {/* Intro */}
        <p
          style={{
            fontSize: '1.05rem', lineHeight: 1.8,
            marginBottom: '2.5rem', color: 'var(--color-on-surface-variant)'
          }}
          dangerouslySetInnerHTML={{ __html: content.description }}
        />

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}
        >
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}
            className="sm:grid-cols-2 grid-cols-1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label
                htmlFor="f-name"
                style={{
                  fontFamily: "'Space Grotesk', monospace", fontSize: '10px',
                  fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em'
                }}
              >
                Identity_Name
              </label>
              <input
                id="f-name"
                name="name"
                type="text"
                placeholder="GHOST_USER_99"
                required
                className="field-input"
                autoComplete="name"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label
                htmlFor="f-email"
                style={{
                  fontFamily: "'Space Grotesk', monospace", fontSize: '10px',
                  fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em'
                }}
              >
                Digital_Signal (Email)
              </label>
              <input
                id="f-email"
                name="email"
                type="email"
                placeholder="blueprint@ghost.com"
                required
                className="field-input"
                autoComplete="email"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label
              htmlFor="f-notes"
              style={{
                fontFamily: "'Space Grotesk', monospace", fontSize: '10px',
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em'
              }}
            >
              Specialization_Notes
            </label>
            <textarea
              id="f-notes"
              name="notes"
              rows={4}
              placeholder="Briefly describe your craft (Design, Code, Chaos...)"
              className="field-input"
              style={{ resize: 'none' }}
            />
          </div>

          <div style={{ paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn-transmit"
              disabled={transmitting}
            >
              <span>
                {transmitting ? 'Transmitting...' : submitted ? '✓ Transmitted' : 'Transmit Signal'}
              </span>
            </button>
          </div>

          {submitted && (
            <div
              role="alert"
              style={{
                border: '1.5px solid var(--color-primary)',
                background: 'rgba(162,255,0,0.08)',
                padding: '1rem 1.2rem'
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Grotesk', monospace", fontSize: '11px',
                  fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.1em', color: 'var(--color-primary)'
                }}
              >
                ✓ Signal transmitted. We&apos;ll find you.
              </span>
            </div>
          )}
        </form>

        {/* Footer meta */}
        <footer
          style={{
            marginTop: '3rem', paddingTop: '1.5rem',
            borderTop: '1px dashed rgba(192,202,173,0.5)',
            display: 'flex', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '1rem'
          }}
        >
          <span className="stamp" style={{ fontSize: '9px' }}>ENCRYPTION: AES-256-SKETCH</span>
          <span className="stamp" style={{ fontSize: '9px' }}>LOC: UNKNOWN_NODE</span>
        </footer>
      </div>
    </section>
  );
}
