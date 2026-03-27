'use client';

import { useEffect, useRef } from 'react';
import { SectionProps } from '@/types/theme';

export default function GarageSection({ settings: content, id }: SectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

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

  const scrollGallery = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -400 : 400,
      behavior: 'smooth'
    });
  };

  return (
    <section
      ref={sectionRef}
      id="garage"
      style={{
        padding: '6rem 0', background: 'var(--color-surface)',
        overflow: 'hidden', position: 'relative'
      }}
    >
      <div
        className="ghost-wm"
        style={{ top: '10%', right: '-2vw', opacity: 0.025 }}
        aria-hidden="true"
      >
        G4
      </div>

      {/* Header */}
      <div
        className="reveal"
        style={{
          padding: '0 2rem', maxWidth: '1280px', margin: '0 auto 3rem',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem'
        }}
      >
        <div>
          <h2
            className="font-headline"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: '-0.02em'
            }}
          >
            {content.title}
          </h2>
          <p className="stamp" style={{ marginTop: '0.4rem', fontSize: '9px' }}>
            {content.stamp}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="garage-nav-btn"
            onClick={() => scrollGallery('left')}
            aria-label="Previous sketch"
          >
            ←
          </button>
          <button
            className="garage-nav-btn"
            onClick={() => scrollGallery('right')}
            aria-label="Next sketch"
          >
            →
          </button>
        </div>
      </div>

      {/* Scrollable gallery */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex', gap: '1.5rem', overflowX: 'auto',
          padding: '0 2rem 2.5rem', scrollSnapType: 'x mandatory'
        }}
        className="no-scrollbar"
      >
        {content.items.map((item: any, index: number) => (
          <div key={item.id ? `id-${item.id}` : `idx-${index}`} className="garage-card">
            <div className="garage-card-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.alt} loading="lazy" />
              <div className="garage-label">{item.label}</div>
            </div>
          </div>
        ))}

        {/* Placeholder card */}
        <div className="garage-card">
          <div
            className="garage-card-inner"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '0.75rem'
            }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ opacity: 0.25 }}>
              <rect x="4" y="4" width="40" height="40" stroke="#1a1c1c" strokeWidth="1.5" strokeDasharray="4 3" />
              <path d="M24 16 V32 M16 24 H32" stroke="#1a1c1c" strokeWidth="1.5" />
            </svg>
            <span className="stamp" style={{ opacity: 0.4, fontSize: '9px' }}>YOUR_SKETCH_HERE</span>
            <div className="garage-label" style={{ position: 'static', marginTop: '0.5rem' }}>#NEW_DRAFT</div>
          </div>
        </div>
      </div>
    </section>
  );
}
