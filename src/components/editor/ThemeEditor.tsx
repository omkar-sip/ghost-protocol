'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThemeConfig, SchemaField } from '@/types/theme';
import { componentSchemas } from '@/registry';
import { useAuth } from '@/context/AuthContext';
import '@/app/dashboard/dashboard.css';

// The auto-generated Schema Form
function SchemaForm({
  schema,
  data,
  onChange,
}: {
  schema: SchemaField[];
  data: any;
  onChange: (newData: any) => void;
}) {
  const handleChange = (id: string, value: any) => {
    onChange({ ...data, [id]: value });
  };

  const renderField = (field: SchemaField, value: any, arrayPath: string[] = []) => {
    const fieldId = field.id;
    const val = value !== undefined ? value : field.default;

    switch (field.type) {
      case 'text':
      case 'color':
      case 'image':
        return (
          <div key={fieldId} style={{ marginBottom: '1rem' }}>
            <label className="dash-label">{field.label}</label>
            <input
              type={field.type === 'color' ? 'color' : 'text'}
              className="dash-input"
              value={val || ''}
              onChange={(e) => handleChange(fieldId, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
            />
            {field.type === 'image' && val && (
              <div style={{ marginTop: '0.5rem', border: '1px solid #333' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={val} alt="Preview" style={{ width: '100%', maxHeight: '120px', objectFit: 'cover' }} />
              </div>
            )}
          </div>
        );
      case 'select':
        return (
          <div key={fieldId} style={{ marginBottom: '1rem' }}>
            <label className="dash-label">{field.label}</label>
            <select
              className="dash-input"
              value={val || field.default || ''}
              onChange={(e) => handleChange(fieldId, e.target.value)}
            >
              {(field.options || []).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      case 'textarea':
      case 'richtext':
        return (
          <div key={fieldId} style={{ marginBottom: '1rem' }}>
            <label className="dash-label">{field.label}</label>
            <textarea
              className="dash-textarea"
              value={val || ''}
              onChange={(e) => handleChange(fieldId, e.target.value)}
              rows={field.type === 'richtext' ? 4 : 3}
            />
          </div>
        );
      case 'list':
        const listItems = Array.isArray(val) ? val : [];
        return (
          <div key={fieldId} style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid #2a2a2a' }}>
            <label className="dash-label" style={{ marginBottom: '1rem' }}>{field.label} ({listItems.length})</label>

            {listItems.map((item: any, index: number) => (
              <div key={index} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '12px', color: '#a2ff00', fontWeight: 'bold' }}>
                    {field.itemTitleField ? item[field.itemTitleField] || `Item ${index + 1}` : `Item ${index + 1}`}
                  </span>
                  <button
                    className="dash-btn-danger"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '9px' }}
                    onClick={() => {
                      const newList = [...listItems];
                      newList.splice(index, 1);
                      handleChange(fieldId, newList);
                    }}
                  >
                    Delete
                  </button>
                </div>
                {/* Recursive render for item schema */}
                {field.itemSchema?.map((subField) => {
                  return (
                    <div key={subField.id} style={{ marginBottom: '0.5rem' }}>
                      <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '0.2rem' }}>{subField.label}</label>
                      {subField.type === 'textarea' ? (
                        <textarea
                          className="dash-input"
                          style={{ minHeight: '60px', padding: '0.5rem' }}
                          value={item[subField.id] || ''}
                          onChange={(e) => {
                            const newList = [...listItems];
                            newList[index] = { ...item, [subField.id]: e.target.value };
                            handleChange(fieldId, newList);
                          }}
                        />
                      ) : subField.type === 'select' ? (
                        <select
                          className="dash-input"
                          style={{ padding: '0.5rem' }}
                          value={item[subField.id] || subField.default || ''}
                          onChange={(e) => {
                            const newList = [...listItems];
                            newList[index] = { ...item, [subField.id]: e.target.value };
                            handleChange(fieldId, newList);
                          }}
                        >
                          {(subField.options || []).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={subField.type === 'color' ? 'color' : 'text'}
                          className="dash-input"
                          style={{ padding: '0.5rem' }}
                          value={item[subField.id] || ''}
                          onChange={(e) => {
                            const newList = [...listItems];
                            newList[index] = { ...item, [subField.id]: e.target.value };
                            handleChange(fieldId, newList);
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
            <button
              className="dash-btn-add"
              style={{ padding: '0.5rem', fontSize: '10px' }}
              onClick={() => {
                const newItem: any = {};
                field.itemSchema?.forEach(s => { newItem[s.id] = s.default || ''; });
                handleChange(fieldId, [...listItems, newItem]);
              }}
            >
              + Add {field.label.replace(/s$/, '')}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return <div>{schema.map(field => renderField(field, data[field.id]))}</div>;
}

export default function ThemeEditor() {
  const [theme, setTheme] = useState<ThemeConfig | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);

  // Load initial theme
  useEffect(() => {
    fetch('/api/theme')
      .then(res => res.json())
      .then(data => setTheme(data));
  }, []);

  // PostMessage sync helper for iframe preview
  const syncPreview = useCallback((updatedTheme: ThemeConfig) => {
    setTheme(updatedTheme); // locally
    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'UPDATE_THEME', payload: updatedTheme }, '*');
    }
  }, []);

  const { getToken } = useAuth();

  const handleSave = async () => {
    if (!theme) return;
    setIsSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Authentication required');

      const res = await fetch('/api/theme', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(theme),
      });
      if (res.ok) {
        setToast('✓ Theme published successfully');
        setTimeout(() => setToast(null), 3000);
      } else {
        throw new Error('Server rejected save');
      }
    } catch (err: any) {
      console.error(err);
      setToast('✕ Failed to publish');
      setTimeout(() => setToast(null), 3000);
    }
    setIsSaving(false);
  };

  if (!theme) return <div style={{ color: '#fff', padding: '2rem' }}>Loading Editor...</div>;

  const activeSection = theme.sections.find(s => s.id === activeSectionId);
  const activeSchema = activeSection ? componentSchemas[activeSection.type] : null;

  // Reorder helper
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...theme.sections];
    if (direction === 'up' && index > 0) {
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    } else if (direction === 'down' && index < newSections.length - 1) {
      [newSections[index + 1], newSections[index]] = [newSections[index], newSections[index + 1]];
    }
    syncPreview({ ...theme, sections: newSections });
  };

  const removeSection = (index: number) => {
    const newSections = theme.sections.filter((_, i) => i !== index);
    syncPreview({ ...theme, sections: newSections });
  };

  const addSection = (type: string) => {
    const schema = componentSchemas[type];
    const settings: any = {};
    schema.settings.forEach(s => { settings[s.id] = s.default; });
    const newSection = { id: `${type}-${Date.now()}`, type, settings };

    syncPreview({ ...theme, sections: [...theme.sections, newSection] });
    setShowCatalog(false);
    setActiveSectionId(newSection.id);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#0f0f0f', overflow: 'hidden' }}>

      {/* LEFT PANE: Sidebar Controls */}
      <div style={{
        width: '320px',
        background: '#141414',
        borderRight: '1px solid #2a2a2a',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10
      }}>
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #2a2a2a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '10px', color: '#a2ff00', letterSpacing: '0.1em' }}>
              LIVE EDITOR / {activeSection ? 'SECTION' : 'HOME'}
            </div>
            <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: '1.2rem', color: '#fff', margin: 0 }}>
              {activeSchema ? activeSchema.name : 'Theme Settings'}
            </h2>
          </div>
          <button
            className="dash-btn-save"
            style={{ padding: '0.5rem 1rem', fontSize: '10px' }}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Publish'}
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>

          {/* VIEW 1: Active Section Inspector */}
          {activeSection && activeSchema ? (
            <div>
              <button
                onClick={() => setActiveSectionId(null)}
                style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                ← Back to outline
              </button>

              <SchemaForm
                schema={activeSchema.settings}
                data={activeSection.settings}
                onChange={(newSettings) => {
                  const newSections = theme.sections.map(s => s.id === activeSection.id ? { ...s, settings: newSettings } : s);
                  syncPreview({ ...theme, sections: newSections });
                }}
              />
            </div>
          ) : showCatalog ? (
            /* VIEW 2: Add Section Catalog */
            <div>
              <button
                onClick={() => setShowCatalog(false)}
                style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                ← Cancel
              </button>
              <h3 style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '10px', color: '#555', letterSpacing: '0.1em', marginBottom: '1rem' }}>AVAILABLE BLOCKS</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {Object.values(componentSchemas).map(schema => (
                  <button
                    key={schema.type}
                    onClick={() => addSection(schema.type)}
                    style={{ background: '#1a1a1a', border: '1px solid #333', padding: '1rem', textAlign: 'left', cursor: 'pointer', color: '#fff' }}
                  >
                    <div style={{ fontFamily: "'Epilogue', sans-serif", fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.2rem' }}>{schema.name}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#888' }}>{schema.description}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* VIEW 3: Main Theme Outline */
            <div>
              {/* Global Settings */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '10px', color: '#555', letterSpacing: '0.1em', marginBottom: '1rem' }}>GLOBAL VARIABLES</h3>
                <SchemaForm
                  schema={[
                    { id: 'primaryContainer', label: 'Accent Color', type: 'color', default: '#a2ff00' },
                    { id: 'background', label: 'Background Color', type: 'color', default: '#0f0f0f' }
                  ]}
                  data={theme.global.colors || {}}
                  onChange={(newColors) => syncPreview({ ...theme, global: { ...theme.global, colors: newColors } })}
                />
              </div>

              {/* Sections List */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '10px', color: '#555', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>PAGE SECTIONS</span>
                  <span>({theme.sections.length})</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {theme.sections.map((section, index) => {
                    const schema = componentSchemas[section.type];
                    return (
                      <div
                        key={section.id}
                        style={{ display: 'flex', alignItems: 'center', background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                      >
                        <button
                          onClick={() => setActiveSectionId(section.id)}
                          style={{ flex: 1, padding: '0.8rem 1rem', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', color: '#e0e0e0', fontWeight: 600 }}
                        >
                          {schema ? schema.name : section.type}
                        </button>

                        {/* Drag / Ordering Controls */}
                        <div style={{ display: 'flex', paddingRight: '0.5rem', gap: '0.1rem' }}>
                          <button onClick={() => moveSection(index, 'up')} disabled={index === 0} style={{ background: 'transparent', border: 'none', color: index === 0 ? '#333' : '#888', cursor: index === 0 ? 'not-allowed' : 'pointer', padding: '0.3rem' }}>↑</button>
                          <button onClick={() => moveSection(index, 'down')} disabled={index === theme.sections.length - 1} style={{ background: 'transparent', border: 'none', color: index === theme.sections.length - 1 ? '#333' : '#888', cursor: index === theme.sections.length - 1 ? 'not-allowed' : 'pointer', padding: '0.3rem' }}>↓</button>
                          <button onClick={() => removeSection(index)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.3rem', marginLeft: '0.2rem' }}>✕</button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  className="dash-btn-add"
                  style={{ marginTop: '0.5rem' }}
                  onClick={() => setShowCatalog(true)}
                >
                  + Add Section
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Live Preview iframe */}
      <div style={{ flex: 1, background: '#000', padding: '1rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, background: 'rgba(0,0,0,0.8)', padding: '0.3rem 0.8rem', borderRadius: '4px', border: '1px solid #333', fontFamily: "'Space Grotesk', monospace", fontSize: '10px', color: '#a2ff00', letterSpacing: '0.1em' }}>
          PREVIEW MODE (LIVE)
        </div>
        <iframe
          id="preview-iframe"
          src="/"
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px', background: '#fff' }}
          title="Live Preview"
        />
      </div>

      {/* Toast Notification */}
      {toast && <div className="dash-toast">{toast}</div>}
    </div>
  );
}
