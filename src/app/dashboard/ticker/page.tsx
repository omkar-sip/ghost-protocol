'use client';

import { useContent } from '@/hooks/useContent';
import '../dashboard.css';

export default function TickerEditor() {
  const { content, saveContent, loading, saving, toast } = useContent();

  if (loading || !content) return <div style={{ color: '#666' }}>Loading...</div>;

  const ticker = content.ticker;

  const updateItem = (index: number, value: string) => {
    const updated = [...ticker];
    updated[index] = value;
    saveContent({ ...content, ticker: updated });
  };

  const addItem = () => {
    saveContent({ ...content, ticker: [...ticker, 'NEW_ITEM'] });
  };

  const deleteItem = (index: number) => {
    const updated = ticker.filter((_, i) => i !== index);
    saveContent({ ...content, ticker: updated });
  };

  return (
    <div>
      <div className="dash-section-header">
        <h2>Ticker Tape</h2>
        <p>Edit the scrolling marquee items that appear below the navigation</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '700px' }}>
        <label className="dash-label">Ticker Items ({ticker.length})</label>

        {ticker.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: "'Space Grotesk', monospace", fontSize: '10px',
                color: '#555', width: '24px', textAlign: 'right', flexShrink: 0,
              }}
            >
              {index + 1}.
            </span>
            <input
              className="dash-input"
              defaultValue={item}
              onBlur={(e) => updateItem(index, e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="dash-btn-danger" onClick={() => deleteItem(index)}>
              ✕
            </button>
          </div>
        ))}

        <button className="dash-btn-add" onClick={addItem} style={{ marginTop: '0.5rem' }}>
          + Add Ticker Item
        </button>
      </div>

      {toast && <div className="dash-toast">{toast}</div>}
      {saving && <div className="dash-toast">Saving...</div>}
    </div>
  );
}
