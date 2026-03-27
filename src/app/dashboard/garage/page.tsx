'use client';

import { useState } from 'react';
import { useContent } from '@/hooks/useContent';
import { GarageItem } from '@/types/content';
import '../dashboard.css';

export default function GarageEditor() {
  const { content, saveContent, loading, saving, toast } = useContent();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (loading || !content) return <div style={{ color: '#666' }}>Loading...</div>;

  const garage = content.garage;

  const updateTitle = (value: string) => {
    saveContent({ ...content, garage: { ...garage, title: value } });
  };

  const updateStamp = (value: string) => {
    saveContent({ ...content, garage: { ...garage, stamp: value } });
  };

  const updateItem = (id: string, field: keyof GarageItem, value: string) => {
    const updatedItems = garage.items.map(item => item.id === id ? { ...item, [field]: value } : item);
    saveContent({ ...content, garage: { ...garage, items: updatedItems } });
  };

  const addItem = () => {
    const newId = Date.now().toString();
    const newItem: GarageItem = {
      id: newId,
      image: '',
      label: '#NEW_SKETCH',
      alt: 'New sketch',
    };
    saveContent({ ...content, garage: { ...garage, items: [...garage.items, newItem] } });
    setEditingId(newId);
  };

  const deleteItem = (id: string) => {
    const updatedItems = garage.items.filter(item => item.id !== id);
    saveContent({ ...content, garage: { ...garage, items: updatedItems } });
  };

  return (
    <div>
      <div className="dash-section-header">
        <h2>The Garage</h2>
        <p>Manage your sketch gallery items</p>
      </div>

      <div style={{ maxWidth: '700px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <label className="dash-label">Section Title</label>
            <input className="dash-input" defaultValue={garage.title} onBlur={(e) => updateTitle(e.target.value)} />
          </div>
          <div>
            <label className="dash-label">Catalog Stamp</label>
            <input className="dash-input" defaultValue={garage.stamp} onBlur={(e) => updateStamp(e.target.value)} />
          </div>
        </div>

        <label className="dash-label" style={{ marginBottom: '1rem' }}>Gallery Items ({garage.items.length})</label>

        {garage.items.map((item) => (
          <div key={item.id} className="dash-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.alt}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', filter: 'grayscale(1)', border: '1px solid #333' }}
                  />
                )}
                <span
                  style={{
                    fontFamily: "'Space Grotesk', monospace", fontWeight: 600,
                    fontSize: '0.85rem', color: '#a2ff00'
                  }}
                >
                  {item.label}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="dash-btn-danger"
                  onClick={() => editingId === item.id ? setEditingId(null) : setEditingId(item.id)}
                  style={{ color: '#a2ff00', borderColor: '#a2ff00' }}
                >
                  {editingId === item.id ? 'Close' : 'Edit'}
                </button>
                <button className="dash-btn-danger" onClick={() => deleteItem(item.id)}>
                  Delete
                </button>
              </div>
            </div>

            {editingId === item.id && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="dash-label">Image URL</label>
                  <input className="dash-input" defaultValue={item.image} onBlur={(e) => updateItem(item.id, 'image', e.target.value)} />
                </div>
                <div>
                  <label className="dash-label">Label (e.g. #AERO_FLOW_01)</label>
                  <input className="dash-input" defaultValue={item.label} onBlur={(e) => updateItem(item.id, 'label', e.target.value)} />
                </div>
                <div>
                  <label className="dash-label">Alt Text</label>
                  <input className="dash-input" defaultValue={item.alt} onBlur={(e) => updateItem(item.id, 'alt', e.target.value)} />
                </div>
                {item.image && (
                  <div style={{ border: '1px solid #333', padding: '0.5rem' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.alt} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', filter: 'grayscale(1)', opacity: 0.7 }} />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <button className="dash-btn-add" onClick={addItem}>
          + Add New Gallery Item
        </button>
      </div>

      {toast && <div className="dash-toast">{toast}</div>}
      {saving && <div className="dash-toast">Saving...</div>}
    </div>
  );
}
