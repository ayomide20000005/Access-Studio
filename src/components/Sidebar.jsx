import { useState } from 'react'

const FONTS = [
  'Inter', 'Roboto', 'Poppins', 'Montserrat', 'Playfair Display',
  'Oswald', 'Raleway', 'Lato', 'Open Sans', 'Source Sans Pro',
  'Ubuntu', 'Nunito', 'Merriweather', 'PT Sans', 'Fira Sans'
]

const TRANSITION_TYPES = ['fade', 'slide', 'wipe', 'flip', 'zoom', 'none']

function FieldRenderer({ field, value, onChange }) {
  const [listInput, setListInput] = useState('')

  const handleListAdd = () => {
    if (!listInput.trim()) return
    const current = Array.isArray(value) ? value : []
    onChange([...current, listInput.trim()])
    setListInput('')
  }

  const handleListRemove = (index) => {
    const current = Array.isArray(value) ? value : []
    onChange(current.filter((_, i) => i !== index))
  }

  switch (field.type) {
    case 'text':
      return (
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="input text-sm"
        />
      )

    case 'textarea':
      return (
        <textarea
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="input text-sm resize-none"
          rows={3}
        />
      )

    case 'number':
      return (
        <input
          type="number"
          value={value || field.default || 0}
          onChange={e => onChange(Number(e.target.value))}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          step={field.step || 1}
          className="input text-sm"
        />
      )

    case 'date':
      return (
        <input
          type="date"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="input text-sm"
        />
      )

    case 'color':
      return (
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg border overflow-hidden cursor-pointer shrink-0"
            style={{ background: value || '#7C3AED', borderColor: 'var(--border)' }}
          >
            <input
              type="color"
              value={value || '#7C3AED'}
              onChange={e => onChange(e.target.value)}
              className="opacity-0 w-full h-full cursor-pointer"
            />
          </div>
          <input
            type="text"
            value={value || '#7C3AED'}
            onChange={e => onChange(e.target.value)}
            className="input text-xs font-mono"
            maxLength={7}
          />
        </div>
      )

    case 'select':
      return (
        <select
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="input text-sm"
        >
          {(field.options || []).map(opt => (
            <option key={opt} value={opt} style={{ background: 'var(--panel)' }}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
      )

    case 'toggle':
      return (
        <button
          onClick={() => onChange(!value)}
          style={{
            width: 40, height: 22, borderRadius: 50,
            background: value ? 'var(--primary)' : 'var(--border)',
            position: 'relative', border: 'none', cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
        >
          <div style={{
            position: 'absolute', top: 3,
            left: value ? 21 : 3,
            width: 16, height: 16, borderRadius: '50%',
            background: '#FFFFFF', transition: 'left 0.2s ease',
          }} />
        </button>
      )

    case 'slider':
      return (
        <div className="flex items-center gap-3">
          <input
            type="range"
            value={value || field.default || 1}
            onChange={e => onChange(parseFloat(e.target.value))}
            min={field.min || 0}
            max={field.max || 10}
            step={field.step || 0.1}
            style={{ flex: 1, accentColor: 'var(--primary)' }}
          />
          <span className="text-xs font-mono w-8 text-right" style={{ color: 'var(--text)' }}>
            {value || field.default || 1}
          </span>
        </div>
      )

    case 'list':
      return (
        <div className="flex flex-col gap-2">
          {(Array.isArray(value) ? value : []).map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="flex-1 text-xs px-3 py-1.5 rounded-lg"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              >
                {item}
              </span>
              <button
                onClick={() => handleListRemove(i)}
                className="text-xs w-6 h-6 rounded flex items-center justify-center"
                style={{ color: '#DC2626', background: '#DC262611' }}
              >
                ✕
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={listInput}
              onChange={e => setListInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleListAdd()}
              placeholder={field.placeholder || 'Add item...'}
              className="input text-xs flex-1"
            />
            <button
              onClick={handleListAdd}
              className="text-xs px-3 rounded-lg font-semibold text-white"
              style={{ background: 'var(--primary)' }}
            >
              +
            </button>
          </div>
        </div>
      )

    case 'font':
      return (
        <select
          value={value || 'Inter'}
          onChange={e => onChange(e.target.value)}
          className="input text-sm"
          style={{ fontFamily: value || 'Inter' }}
        >
          {FONTS.map(font => (
            <option key={font} value={font} style={{ fontFamily: font, background: 'var(--panel)' }}>
              {font}
            </option>
          ))}
        </select>
      )

    case 'transition':
      return (
        <div className="flex flex-wrap gap-1.5">
          {TRANSITION_TYPES.map(t => (
            <button
              key={t}
              onClick={() => onChange(t)}
              className="text-xs px-3 py-1 rounded-full capitalize transition-all"
              style={{
                background: value === t ? 'var(--primary)' : 'var(--surface)',
                color: value === t ? '#fff' : 'var(--muted)',
                border: `1px solid ${value === t ? 'var(--primary)' : 'var(--border)'}`,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      )

    case 'caption':
      return (
        <div className="flex flex-col gap-2">
          <textarea
            value={value?.text || ''}
            onChange={e => onChange({ ...value, text: e.target.value })}
            placeholder="Enter subtitle text..."
            className="input text-sm resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Size</p>
              <input
                type="number"
                value={value?.fontSize || 24}
                onChange={e => onChange({ ...value, fontSize: Number(e.target.value) })}
                className="input text-xs"
                min={10}
                max={80}
              />
            </div>
            <div className="flex-1">
              <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Color</p>
              <div className="flex items-center gap-1">
                <div
                  className="w-8 h-8 rounded border overflow-hidden cursor-pointer shrink-0"
                  style={{ background: value?.color || '#FFFFFF', borderColor: 'var(--border)' }}
                >
                  <input
                    type="color"
                    value={value?.color || '#FFFFFF'}
                    onChange={e => onChange({ ...value, color: e.target.value })}
                    className="opacity-0 w-full h-full cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Position</p>
              <select
                value={value?.position || 'bottom'}
                onChange={e => onChange({ ...value, position: e.target.value })}
                className="input text-xs"
              >
                <option value="top" style={{ background: 'var(--panel)' }}>Top</option>
                <option value="center" style={{ background: 'var(--panel)' }}>Center</option>
                <option value="bottom" style={{ background: 'var(--panel)' }}>Bottom</option>
              </select>
            </div>
          </div>
        </div>
      )

    case 'image':
      return (
        <button
          className="w-full h-14 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-xs transition-all duration-150"
          style={{
            borderColor: value ? 'var(--primary)' : 'var(--border)',
            color: value ? 'var(--primary)' : 'var(--muted)',
          }}
          onClick={async () => {
            const files = await window.electron.openFile([
              { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'svg', 'webp'] }
            ])
            if (files && files[0]) onChange(files[0])
          }}
        >
          🖼 {value ? '✅ Image selected' : 'Upload Image'}
        </button>
      )

    case 'video':
      return (
        <button
          className="w-full h-14 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-xs transition-all duration-150"
          style={{
            borderColor: value ? 'var(--primary)' : 'var(--border)',
            color: value ? 'var(--primary)' : 'var(--muted)',
          }}
          onClick={async () => {
            const files = await window.electron.openFile([
              { name: 'Videos', extensions: ['mp4', 'mov', 'avi', 'webm'] }
            ])
            if (files && files[0]) onChange(files[0])
          }}
        >
          🎬 {value ? '✅ Video selected' : 'Upload Video'}
        </button>
      )

    case 'audio':
      return (
        <button
          className="w-full h-14 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-xs transition-all duration-150"
          style={{
            borderColor: value ? 'var(--primary)' : 'var(--border)',
            color: value ? 'var(--primary)' : 'var(--muted)',
          }}
          onClick={async () => {
            const files = await window.electron.openFile([
              { name: 'Audio', extensions: ['mp3', 'wav', 'aac', 'ogg'] }
            ])
            if (files && files[0]) onChange(files[0])
          }}
        >
          🎵 {value ? '✅ Audio selected' : 'Upload Audio'}
        </button>
      )

    default:
      return (
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="input text-sm"
        />
      )
  }
}

export default function Sidebar({
  template, fields, inputs, onInputChange,
  styles, selectedStyles, onStyleChange, onEditFields
}) {
  return (
    <div
      className="w-72 h-full flex flex-col shrink-0 overflow-hidden"
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
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
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="live-dot" />
              <span className="text-xs" style={{ color: '#22C55E' }}>Live</span>
            </div>
            <button
              onClick={onEditFields}
              className="text-xs px-2 py-1 rounded-lg transition-all"
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                color: 'var(--muted)',
                fontSize: 10,
              }}
            >
              ⚙ Fields
            </button>
          </div>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Every change updates the preview instantly
        </p>
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 px-5 py-4 flex flex-col gap-5"
        style={{ overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}
      >
        {/* Style selections */}
        {styles && Object.keys(styles).length > 0 && (
          <div
            className="rounded-xl p-4 flex flex-col gap-4"
            style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Video Style
            </p>
            {Object.keys(styles).map(styleKey => (
              <div key={styleKey}>
                <p className="text-xs font-medium mb-2 capitalize" style={{ color: 'var(--muted)' }}>
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

        {/* Dynamic template fields */}
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
              {field.label}
              {field.required && <span style={{ color: '#DC2626', marginLeft: 4 }}>*</span>}
            </label>
            <FieldRenderer
              field={field}
              value={inputs[field.key]}
              onChange={(val) => onInputChange(field.key, val)}
            />
          </div>
        ))}

        {/* Voiceover */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
            Voiceover (optional)
          </label>
          <button
            className="w-full h-10 rounded-xl border flex items-center justify-center gap-2 text-xs transition-all duration-150"
            style={{ borderColor: 'var(--border)', background: 'var(--panel)', color: 'var(--muted)' }}
          >
            🎙 Record Voiceover
          </button>
        </div>
      </div>

      {/* Bottom */}
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