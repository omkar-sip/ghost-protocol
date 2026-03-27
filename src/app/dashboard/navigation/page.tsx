'use client';

import { useContent } from '@/hooks/useContent';
import { NavLink } from '@/types/content';
import '../dashboard.css';

export default function NavigationEditor() {
  const { content, saveContent, loading, saving, toast } = useContent();

  if (loading || !content) return <div style={{ color: '#666' }}>Loading...</div>;

  const nav = content.nav;

  const updateBrand = (value: string) => {
    saveContent({ ...content, nav: { ...nav, brand: value } });
  };

  const updateLink = (index: number, field: keyof NavLink, value: string) => {
    const updatedLinks = [...nav.links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    saveContent({ ...content, nav: { ...nav, links: updatedLinks } });
  };

  const addLink = () => {
    saveContent({
      ...content,
      nav: { ...nav, links: [...nav.links, { label: 'New Link', href: '#' }] },
    });
  };

  const deleteLink = (index: number) => {
    const updatedLinks = nav.links.filter((_, i) => i !== index);
    saveContent({ ...content, nav: { ...nav, links: updatedLinks } });
  };

  return (
    <div>
      <div className="dash-section-header">
        <h2>Navigation</h2>
        <p>Edit the navigation bar brand and menu links</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px' }}>
        <div>
          <label className="dash-label">Brand Name</label>
          <input className="dash-input" defaultValue={nav.brand} onBlur={(e) => updateBrand(e.target.value)} />
        </div>

        <div>
          <label className="dash-label" style={{ marginBottom: '1rem' }}>Nav Links ({nav.links.length})</label>

          {nav.links.map((link, index) => (
            <div key={index} className="dash-card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label className="dash-label">Label</label>
                <input className="dash-input" defaultValue={link.label} onBlur={(e) => updateLink(index, 'label', e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="dash-label">Href (e.g. #wins)</label>
                <input className="dash-input" defaultValue={link.href} onBlur={(e) => updateLink(index, 'href', e.target.value)} />
              </div>
              <button className="dash-btn-danger" onClick={() => deleteLink(index)} style={{ marginBottom: '0.1rem' }}>
                Delete
              </button>
            </div>
          ))}

          <button className="dash-btn-add" onClick={addLink}>
            + Add Nav Link
          </button>
        </div>
      </div>

      {toast && <div className="dash-toast">{toast}</div>}
      {saving && <div className="dash-toast">Saving...</div>}
    </div>
  );
}
