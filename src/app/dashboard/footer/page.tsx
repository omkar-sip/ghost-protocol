'use client';

import { useContent } from '@/hooks/useContent';
import { SocialLink } from '@/types/content';
import '../dashboard.css';

export default function FooterEditor() {
  const { content, saveContent, loading, saving, toast } = useContent();

  if (loading || !content) return <div style={{ color: '#666' }}>Loading...</div>;

  const footer = content.footer;

  const update = (field: string, value: string) => {
    saveContent({ ...content, footer: { ...content.footer, [field]: value } });
  };

  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    const updatedLinks = [...footer.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    saveContent({ ...content, footer: { ...footer, socialLinks: updatedLinks } });
  };

  const addLink = () => {
    saveContent({
      ...content,
      footer: {
        ...footer,
        socialLinks: [...footer.socialLinks, { label: 'New Link', href: '#' }],
      },
    });
  };

  const deleteLink = (index: number) => {
    const updatedLinks = footer.socialLinks.filter((_, i) => i !== index);
    saveContent({ ...content, footer: { ...footer, socialLinks: updatedLinks } });
  };

  return (
    <div>
      <div className="dash-section-header">
        <h2>Footer</h2>
        <p>Edit footer brand, copyright, and social links</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px' }}>
        <div>
          <label className="dash-label">Brand Name</label>
          <input className="dash-input" defaultValue={footer.brand} onBlur={(e) => update('brand', e.target.value)} />
        </div>

        <div>
          <label className="dash-label">Copyright Text</label>
          <input className="dash-input" defaultValue={footer.copyright} onBlur={(e) => update('copyright', e.target.value)} />
        </div>

        <div>
          <label className="dash-label" style={{ marginBottom: '1rem' }}>Social Links ({footer.socialLinks.length})</label>

          {footer.socialLinks.map((link, index) => (
            <div key={index} className="dash-card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label className="dash-label">Label</label>
                <input className="dash-input" defaultValue={link.label} onBlur={(e) => updateLink(index, 'label', e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="dash-label">URL</label>
                <input className="dash-input" defaultValue={link.href} onBlur={(e) => updateLink(index, 'href', e.target.value)} />
              </div>
              <button className="dash-btn-danger" onClick={() => deleteLink(index)} style={{ marginBottom: '0.1rem' }}>
                Delete
              </button>
            </div>
          ))}

          <button className="dash-btn-add" onClick={addLink}>
            + Add Social Link
          </button>
        </div>
      </div>

      {toast && <div className="dash-toast">{toast}</div>}
      {saving && <div className="dash-toast">Saving...</div>}
    </div>
  );
}
