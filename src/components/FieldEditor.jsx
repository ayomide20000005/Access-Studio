import { useState } from 'react'

const FIELD_TYPES = [
  { value: 'text', label: 'Text', icon: '✏️' },
  { value: 'textarea', label: 'Textarea', icon: '📝' },
  { value: 'number', label: 'Number', icon: '🔢' },
  { value: 'color', label: 'Color', icon: '🎨' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'select', label: 'Select', icon: '📋' },
  { value: 'toggle', label: 'Toggle', icon: '🔘' },
  { value: 'slider', label: 'Slider', icon: '🎚️' },
  { value: 'list', label: 'List', icon: '📌' },
  { value: 'font', label: 'Font', icon: '🔤' },
  { value: 'image', label: 'Image Upload', icon: '🖼️' },
  { value: 'video', label: 'Video Upload', icon: '🎬' },
  { value: 'audio', label: 'Audio Upload', icon: '🎵' },
  { value: 'caption', label: 'Caption/Subtitle', icon: '💬' },
  { value: 'transition', label: 'Transition', icon: '✨' },
]

const TRANSITION_OPTIONS = ['fade', 'slide', 'wipe', 'flip', 'zoom', 'none']
const FONT_OPTIONS = ['Inter', 'Roboto', 'Poppins', 'Montserrat', 'Playfair Display', 'Oswald', 'Raleway', 'Lato', 'Open Sans', 'Source Sans Pro']

function generateKey(label) {
  return label
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}

export default function FieldEditor({ fields, onSave, onClose, templateName }) {
  const [localFields, setLocalFields] = useState(fields ? [...fields] : [])
  const [editingIndex, setEditingIndex] = useState(null)
  const [newField, setNewField] = useState({
    key: '',
    label: '',
    type: 'text',
    placeholder: '',
    required: false,
    default: '',
    min: '',
    max: '',
    step: '',
    options: '',
  })
  const [dragIndex, setDragIndex] = useState(null)
  const [activeTab, setActiveTab] = useState('fields')

  const handleAddField = () => {
    if (!newField.label.trim()) return

    const field = {
      key: newField.key || generateKey(newField.label),
      label: newField.label,
      type: newField.type,
      placeholder: newField.placeholder || '',
      required: newField.required,
    }

    if (newField.default) field.default = newField.default
    if (newField.type === 'slider') {
      field.min = parseFloat(newField.min) || 0
      field.max = parseFloat(newField.max) || 10
      field.step = parseFloat(newField.step) || 0.1
    }
    if (newField.type === 'select' && newField.options) {
      field.options = newField.options.split(',').map(o => o.trim())
    }
    if (newField.type === 'transition') {
      field.options = TRANSITION_OPTIONS
    }
    if (newField.type === 'font') {
      field.options = FONT_OPTIONS
    }

    setLocalFields(prev => [...prev, field])
    setNewField({
      key: '', label: '', type: 'text', placeholder: '',
      required: false, default: '', min: '', max: '', step: '', options: '',
    })
  }

  const handleRemove = (index) => {
    setLocalFields(prev => prev.filter((_, i) => i !== index))
  }

  const handleMoveUp = (index) => {
    if (index === 0) return
    const updated = [...localFields]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    setLocalFields(updated)
  }

  const handleMoveDown = (index) => {
    if (index === localFields.length - 1) return
    const updated = [...localFields]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    setLocalFields(updated)
  }

  const handleEditField = (index, key, value) => {
    setLocalFields(prev => prev.map((f, i) => i === index ? { ...f, [key]: value } : f))
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-8" style={{ pointerEvents: 'none' }}>
        <div
          className="w-full max-w-2xl rounded-2xl flex flex-col overflow-hidden"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            pointerEvents: 'all',
            maxHeight: '85vh',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
                Field Editor
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {templateName} — {localFields.length} fields
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSave(localFields)}
                className="text-xs px-4 py-2 rounded-lg font-semibold text-white glow"
                style={{ background: 'var(--primary)' }}
              >
                Save Fields
              </button>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background: 'var(--panel)', color: 'var(--muted)' }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div
            className="flex items-center gap-1 px-6 py-3 shrink-0"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            {['fields', 'add field'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="text-xs px-3 py-1.5 rounded-lg capitalize transition-all"
                style={{
                  background: activeTab === tab ? 'var(--primary)' : 'var(--panel)',
                  color: activeTab === tab ? '#fff' : 'var(--muted)',
                  border: `1px solid ${activeTab === tab ? 'var(--primary)' : 'var(--border)'}`,
                }}
              >
                {tab === 'fields' ? `📋 Current Fields (${localFields.length})` : '➕ Add Field'}
              </button>
            ))}
          </div>

          {/* Body */}
          <div
            className="flex-1 px-6 py-5 flex flex-col gap-3"
            style={{ overflowY: 'auto' }}
          >
            {activeTab === 'fields' && (
              <>
                {localFields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 gap-2" style={{ color: 'var(--muted)' }}>
                    <span className="text-3xl">📋</span>
                    <p className="text-sm">No fields yet. Add your first field.</p>
                    <button
                      onClick={() => setActiveTab('add field')}
                      className="text-xs px-3 py-1.5 rounded-lg mt-1"
                      style={{ background: 'var(--primary)', color: '#fff' }}
                    >
                      ➕ Add Field
                    </button>
                  </div>
                ) : (
                  localFields.map((field, index) => (
                    <div
                      key={index}
                      className="rounded-xl p-4"
                      style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}
                    >
                      {editingIndex === index ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={field.label}
                              onChange={e => handleEditField(index, 'label', e.target.value)}
                              className="input text-xs flex-1"
                              placeholder="Label"
                            />
                            <input
                              type="text"
                              value={field.key}
                              onChange={e => handleEditField(index, 'key', e.target.value)}
                              className="input text-xs flex-1 font-mono"
                              placeholder="key"
                            />
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={field.type}
                              onChange={e => handleEditField(index, 'type', e.target.value)}
                              className="input text-xs flex-1"
                            >
                              {FIELD_TYPES.map(t => (
                                <option key={t.value} value={t.value} style={{ background: 'var(--panel)' }}>
                                  {t.icon} {t.label}
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={field.placeholder || ''}
                              onChange={e => handleEditField(index, 'placeholder', e.target.value)}
                              className="input text-xs flex-1"
                              placeholder="Placeholder"
                            />
                          </div>
                          <button
                            onClick={() => setEditingIndex(null)}
                            className="text-xs py-1.5 rounded-lg"
                            style={{ background: 'var(--primary)', color: '#fff' }}
                          >
                            Done
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {FIELD_TYPES.find(t => t.value === field.type)?.icon || '✏️'}
                            </span>
                            <div>
                              <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{field.label}</p>
                              <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                                {field.key} · {field.type}
                                {field.required && <span style={{ color: '#DC2626' }}> · required</span>}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                              className="w-6 h-6 rounded flex items-center justify-center text-xs"
                              style={{ background: 'var(--surface)', color: index === 0 ? 'var(--border)' : 'var(--muted)' }}
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => handleMoveDown(index)}
                              disabled={index === localFields.length - 1}
                              className="w-6 h-6 rounded flex items-center justify-center text-xs"
                              style={{ background: 'var(--surface)', color: index === localFields.length - 1 ? 'var(--border)' : 'var(--muted)' }}
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => setEditingIndex(index)}
                              className="text-xs px-2 py-1 rounded"
                              style={{ background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleRemove(index)}
                              className="text-xs px-2 py-1 rounded"
                              style={{ background: '#DC262611', color: '#DC2626', border: '1px solid #DC262633' }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === 'add field' && (
              <div className="flex flex-col gap-4">
                {/* Type selector */}
                <div>
                  <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>Field Type</p>
                  <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {FIELD_TYPES.map(t => (
                      <button
                        key={t.value}
                        onClick={() => setNewField(prev => ({ ...prev, type: t.value }))}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all"
                        style={{
                          background: newField.type === t.value ? '#7C3AED22' : 'var(--panel)',
                          border: `1px solid ${newField.type === t.value ? 'var(--primary)' : 'var(--border)'}`,
                          color: newField.type === t.value ? 'var(--primary)' : 'var(--muted)',
                        }}
                      >
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Label and key */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Label</p>
                    <input
                      type="text"
                      value={newField.label}
                      onChange={e => setNewField(prev => ({
                        ...prev,
                        label: e.target.value,
                        key: generateKey(e.target.value)
                      }))}
                      className="input text-sm"
                      placeholder="e.g. Background Color"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Key (auto)</p>
                    <input
                      type="text"
                      value={newField.key}
                      onChange={e => setNewField(prev => ({ ...prev, key: e.target.value }))}
                      className="input text-sm font-mono"
                      placeholder="e.g. background_color"
                    />
                  </div>
                </div>

                {/* Placeholder */}
                {['text', 'textarea', 'number'].includes(newField.type) && (
                  <div>
                    <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Placeholder</p>
                    <input
                      type="text"
                      value={newField.placeholder}
                      onChange={e => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
                      className="input text-sm"
                      placeholder="e.g. Enter your value..."
                    />
                  </div>
                )}

                {/* Slider options */}
                {newField.type === 'slider' && (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Min</p>
                      <input type="number" value={newField.min} onChange={e => setNewField(prev => ({ ...prev, min: e.target.value }))} className="input text-sm" placeholder="0" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Max</p>
                      <input type="number" value={newField.max} onChange={e => setNewField(prev => ({ ...prev, max: e.target.value }))} className="input text-sm" placeholder="10" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Step</p>
                      <input type="number" value={newField.step} onChange={e => setNewField(prev => ({ ...prev, step: e.target.value }))} className="input text-sm" placeholder="0.1" />
                    </div>
                  </div>
                )}

                {/* Select options */}
                {newField.type === 'select' && (
                  <div>
                    <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Options (comma separated)</p>
                    <input
                      type="text"
                      value={newField.options}
                      onChange={e => setNewField(prev => ({ ...prev, options: e.target.value }))}
                      className="input text-sm"
                      placeholder="e.g. Option 1, Option 2, Option 3"
                    />
                  </div>
                )}

                {/* Required toggle */}
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Required field</p>
                  <button
                    onClick={() => setNewField(prev => ({ ...prev, required: !prev.required }))}
                    style={{
                      width: 40, height: 22, borderRadius: 50,
                      background: newField.required ? 'var(--primary)' : 'var(--border)',
                      position: 'relative', border: 'none', cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 3,
                      left: newField.required ? 21 : 3,
                      width: 16, height: 16, borderRadius: '50%',
                      background: '#fff', transition: 'left 0.2s ease',
                    }} />
                  </button>
                </div>

                <button
                  onClick={handleAddField}
                  disabled={!newField.label.trim()}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
                  style={{
                    background: newField.label.trim() ? 'var(--primary)' : 'var(--border)',
                    cursor: newField.label.trim() ? 'pointer' : 'not-allowed',
                  }}
                >
                  ➕ Add Field
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}