'use client';

import { useContent } from '@/hooks/useContent';
import '../dashboard.css';

export default function JoinEditor() {
  const { content, saveContent, loading, saving, toast } = useContent();

  if (loading || !content) return <div style={{ color: '#666' }}>Loading...</div>;

  const join = content.join;

  const update = (field: string, value: string) => {
    saveContent({ ...content, join: { ...content.join, [field]: value } });
  };

  return (
    <div>
      <div className="dash-section-header">
        <h2>Join / Contact Section</h2>
        <p>Edit the collaborator application form header and text</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px' }}>
        <div>
          <label className="dash-label">Section Title (supports HTML)</label>
          <input
            className="dash-input"
            defaultValue={join.title}
            onBlur={(e) => update('title', e.target.value)}
          />
        </div>

        <div>
          <label className="dash-label">Document Stamp</label>
          <input
            className="dash-input"
            defaultValue={join.stamp}
            onBlur={(e) => update('stamp', e.target.value)}
          />
        </div>

        <div>
          <label className="dash-label">Intro Description (supports HTML like &lt;strong&gt;)</label>
          <textarea
            className="dash-textarea"
            defaultValue={join.description}
            onBlur={(e) => update('description', e.target.value)}
            rows={5}
          />
        </div>
      </div>

      {toast && <div className="dash-toast">{toast}</div>}
      {saving && <div className="dash-toast">Saving...</div>}
    </div>
  );
}
