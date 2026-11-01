'use client';

import { useContent } from '@/hooks/useContent';
import '../dashboard.css';

export default function HeroEditor() {
  const { content, saveContent, loading, saving, toast } = useContent();

  if (loading || !content) return <div style={{ color: '#666' }}>Loading...</div>;

  const hero = content.hero;

  const update = (field: string, value: string) => {
    saveContent({ ...content, hero: { ...content.hero, [field]: value } });
  };

  return (
    <div>
      <div className="dash-section-header">
        <h2>Hero Section</h2>
        <p>Edit the main landing section of your site</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px' }}>
        <div>
          <label className="dash-label">Badge Text</label>
          <input
            className="dash-input"
            defaultValue={hero.badge}
            onBlur={(e) => update('badge', e.target.value)}
          />
        </div>

        <div>
          <label className="dash-label">Title (supports HTML like &lt;br/&gt;)</label>
          <input
            className="dash-input"
            defaultValue={hero.title}
            onBlur={(e) => update('title', e.target.value)}
          />
        </div>

        <div>
          <label className="dash-label">Hero Title Animation</label>
          <select
            className="dash-input"
            defaultValue={hero.heroTitleAnimation ?? 'none'}
            onChange={(e) => update('heroTitleAnimation', e.target.value)}
          >
            <option value="none">None</option>
            <option value="float">Float Drift</option>
            <option value="glitch">Glitch Pulse</option>
            <option value="pulse">Neon Pulse</option>
            <option value="wave">Wave Tilt</option>
          </select>
        </div>

        <div>
          <label className="dash-label">Description</label>
          <textarea
            className="dash-textarea"
            defaultValue={hero.description}
            onBlur={(e) => update('description', e.target.value)}
            rows={3}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="dash-label">Primary CTA Text</label>
            <input
              className="dash-input"
              defaultValue={hero.cta}
              onBlur={(e) => update('cta', e.target.value)}
            />
          </div>
          <div>
            <label className="dash-label">Primary CTA Link</label>
            <input
              className="dash-input"
              defaultValue={hero.ctaLink}
              onBlur={(e) => update('ctaLink', e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="dash-label">Secondary CTA Text</label>
            <input
              className="dash-input"
              defaultValue={hero.secondaryCta}
              onBlur={(e) => update('secondaryCta', e.target.value)}
            />
          </div>
          <div>
            <label className="dash-label">Secondary CTA Link</label>
            <input
              className="dash-input"
              defaultValue={hero.secondaryCtaLink}
              onBlur={(e) => update('secondaryCtaLink', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="dash-label">Hero Image URL</label>
          <input
            className="dash-input"
            defaultValue={hero.image}
            onBlur={(e) => update('image', e.target.value)}
          />
          {hero.image && (
            <div style={{ marginTop: '0.75rem', border: '1px solid #333', padding: '0.5rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.image}
                alt="Preview"
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', filter: 'grayscale(1)', opacity: 0.7 }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="dash-label">Image Alt Text</label>
          <input
            className="dash-input"
            defaultValue={hero.imageAlt}
            onBlur={(e) => update('imageAlt', e.target.value)}
          />
        </div>
      </div>

      {toast && <div className="dash-toast">{toast}</div>}
      {saving && <div className="dash-toast">Saving...</div>}
    </div>
  );
}
