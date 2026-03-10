import { useState } from 'react'

const presets = [
  '#7C3AED', '#4F46E5', '#0891B2', '#059669',
  '#DC2626', '#D97706', '#DB2777', '#6B7280',
  '#ffffff', '#F5F5F5', '#1A1A1A', '#0F0F0F',
]

export default function ColorPicker({ selectedLayer }) {
  const [color, setColor] = useState('#7C3AED')
  const [activeTab, setActiveTab] = useState('fill')

  return (
    <div className="p-3">
      <div className="flex gap-1 mb-3">
        {['fill', 'stroke', 'text'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-1 rounded text-xs capitalize transition-colors"
            style={{
              background: activeTab === tab ? '#7C3AED' : '#242424',
              color: activeTab === tab ? '#fff' : '#888',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Color Input */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-lg border border-border cursor-pointer overflow-hidden shrink-0"
          style={{ background: color }}
        >
          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            className="opacity-0 w-full h-full cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={color}
          onChange={e => setColor(e.target.value)}
          className="input text-xs font-mono"
          maxLength={7}
        />
      </div>

      {/* Presets */}
      <p className="text-xs text-muted mb-2">Presets</p>
      <div className="grid grid-cols-6 gap-1">
        {presets.map(preset => (
          <button
            key={preset}
            onClick={() => setColor(preset)}
            className="w-full aspect-square rounded-md border-2 transition-all"
            style={{
              background: preset,
              borderColor: color === preset ? '#7C3AED' : 'transparent',
            }}
          />
        ))}
      </div>
    </div>
  )
}