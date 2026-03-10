export default function Sidebar({ template, fields, inputs, onInputChange, styles, selectedStyles, onStyleChange }) {
  return (
    <div
      className="w-72 h-full flex flex-col shrink-0 overflow-hidden"
      style={{
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            Video Details
          </h2>
          <div className="flex items-center gap-1.5">
            <div className="live-dot" />
            <span className="text-xs" style={{ color: '#22C55E' }}>Live</span>
          </div>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Every change updates the preview instantly
        </p>
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 px-5 py-4 flex flex-col gap-5"
        style={{
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
      >

        {/* Style selections */}
        {Object.keys(styles).length > 0 && (
          <div
            className="rounded-xl p-4 flex flex-col gap-4"
            style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Video Style
            </p>
            {Object.keys(styles).map(styleKey => (
              <div key={styleKey}>
                <p
                  className="text-xs font-medium mb-2 capitalize"
                  style={{ color: 'var(--muted)' }}
                >
                  {styleKey.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {styles[styleKey].map(option => (
                    <button
                      key={option}
                      onClick={() => onStyleChange(styleKey, option)}
                      className="text-xs px-3 py-1 rounded-full transition-all duration-150"
                      style={{
                        background: selectedStyles[styleKey] === option ? 'var(--primary)' : 'var(--surface)',
                        color: selectedStyles[styleKey] === option ? '#fff' : 'var(--muted)',
                        border: `1px solid ${selectedStyles[styleKey] === option ? 'var(--primary)' : 'var(--border)'}`,
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Duration */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
            Video Duration (seconds)
          </label>
          <input
            type="number"
            value={inputs['duration'] || 10}
            onChange={e => onInputChange('duration', Number(e.target.value))}
            placeholder="e.g. 30"
            min={5}
            max={300}
            className="input text-sm"
          />
        </div>

        {/* Template fields */}
        {fields.map((field) => (
          <div key={field.key}>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--muted)' }}
            >
              {field.label}
            </label>

            {field.type === 'text' && (
              <input
                type="text"
                value={inputs[field.key] || ''}
                onChange={e => onInputChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="input text-sm"
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                value={inputs[field.key] || ''}
                onChange={e => onInputChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="input text-sm resize-none"
                rows={3}
              />
            )}

            {field.type === 'color' && (
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-lg border overflow-hidden cursor-pointer shrink-0"
                  style={{
                    background: inputs[field.key] || '#7C3AED',
                    borderColor: 'var(--border)',
                  }}
                >
                  <input
                    type="color"
                    value={inputs[field.key] || '#7C3AED'}
                    onChange={e => onInputChange(field.key, e.target.value)}
                    className="opacity-0 w-full h-full cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={inputs[field.key] || '#7C3AED'}
                  onChange={e => onInputChange(field.key, e.target.value)}
                  className="input text-xs font-mono"
                  maxLength={7}
                />
              </div>
            )}

            {field.type === 'select' && (
              <select
                value={inputs[field.key] || ''}
                onChange={e => onInputChange(field.key, e.target.value)}
                className="input text-sm"
              >
                {field.options.map(opt => (
                  <option key={opt} value={opt} style={{ background: 'var(--panel)' }}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        {/* Logo upload */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
            Logo (optional)
          </label>
          <button
            className="w-full h-16 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-xs transition-all duration-150"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--primary)'
              e.currentTarget.style.color = 'var(--primary)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--muted)'
            }}
            onClick={async () => {
              const files = await window.electron.openFile([
                { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'svg', 'webp'] },
              ])
              if (files && files[0]) onInputChange('logoPath', files[0])
            }}
          >
            🖼 Upload Logo
          </button>
        </div>

        {/* Voiceover */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
            Voiceover (optional)
          </label>
          <button
            className="w-full h-10 rounded-xl border flex items-center justify-center gap-2 text-xs transition-all duration-150"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--panel)',
              color: 'var(--muted)',
            }}
          >
            🎙 Record Voiceover
          </button>
        </div>
      </div>

      {/* Bottom brand kit notice */}
      <div
        className="px-5 py-3 shrink-0"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: '#7C3AED11', border: '1px solid #7C3AED33' }}
        >
          <span className="text-sm">💎</span>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Brand Kit applied automatically
          </p>
        </div>
      </div>
    </div>
  )
}