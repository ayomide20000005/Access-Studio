import { useState } from 'react'

export default function TemplateManager({
  userTemplates,
  loading,
  error,
  onImport,
  onDelete,
  onUpdate,
  onSelect,
}) {
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const startEdit = (template) => {
    setEditingId(template.id)
    setEditName(template.name)
    setEditDesc(template.description || '')
  }

  const saveEdit = async () => {
    await onUpdate(editingId, { name: editName, description: editDesc })
    setEditingId(null)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: 'var(--muted)' }}>
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
        <p className="text-sm">Loading templates...</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Actions */}
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <button
          onClick={onImport}
          className="flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg transition-all"
          style={{ background: 'var(--primary)', color: '#fff' }}
        >
          ⬆ Import Template
        </button>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          {userTemplates.length} custom template{userTemplates.length !== 1 ? 's' : ''}
        </p>
      </div>

      {error && (
        <div
          className="mb-4 px-4 py-3 rounded-xl text-xs shrink-0"
          style={{ background: '#DC262611', border: '1px solid #DC262633', color: '#DC2626' }}
        >
          {error}
        </div>
      )}

      {/* Templates list */}
      {userTemplates.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4" style={{ color: 'var(--muted)' }}>
          <span className="text-5xl">📦</span>
          <p className="text-sm">No custom templates yet</p>
          <p className="text-xs text-center" style={{ maxWidth: 300 }}>
            Import a Remotion composition folder and Acces Studio will automatically detect the fields
          </p>
          <button
            onClick={onImport}
            className="text-xs px-4 py-2 rounded-lg"
            style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            ⬆ Import Your First Template
          </button>
        </div>
      ) : (
        <div
          className="flex-1 flex flex-col gap-3"
          style={{ overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}
        >
          {userTemplates.map(template => (
            <div
              key={template.id}
              className="rounded-xl p-4"
              style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}
            >
              {editingId === template.id ? (
                // Edit mode
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="input text-sm"
                    placeholder="Template name"
                  />
                  <textarea
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                    className="input text-sm resize-none"
                    placeholder="Description"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold text-white"
                      style={{ background: 'var(--primary)' }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 py-2 rounded-lg text-xs"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : confirmDeleteId === template.id ? (
                // Confirm delete
                <div className="flex flex-col gap-3">
                  <p className="text-xs" style={{ color: 'var(--text)' }}>
                    Delete <strong>{template.name}</strong>? This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { onDelete(template.id); setConfirmDeleteId(null) }}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold text-white"
                      style={{ background: '#DC2626' }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="flex-1 py-2 rounded-lg text-xs"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Normal view
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                      style={{ background: `${template.color || '#7C3AED'}22`, border: `1px solid ${template.color || '#7C3AED'}44` }}
                    >
                      📦
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{template.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>{template.description || 'No description'}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--primary)' }}>
                        {template.fields?.length || 0} fields · {template.detectionMethod === 'config' ? '✅ Config' : template.detectionMethod === 'autoDetect' ? '🔍 Auto detected' : '⚡ Generic'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onSelect(template)}
                      className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white transition-all"
                      style={{ background: 'var(--primary)' }}
                    >
                      Use
                    </button>
                    <button
                      onClick={() => startEdit(template)}
                      className="text-xs px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(template.id)}
                      className="text-xs px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: '#DC2626' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}