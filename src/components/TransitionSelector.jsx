import { useState } from 'react'

const transitions = [
  { id: 'none', label: 'None', icon: '—' },
  { id: 'fade', label: 'Fade', icon: '◐' },
  { id: 'slide', label: 'Slide', icon: '→' },
  { id: 'zoom', label: 'Zoom', icon: '⊕' },
  { id: 'wipe', label: 'Wipe', icon: '▶' },
  { id: 'dissolve', label: 'Dissolve', icon: '░' },
  { id: 'flip', label: 'Flip', icon: '⇅' },
  { id: 'blur', label: 'Blur', icon: '◈' },
]

export default function TransitionSelector({ scenes, selectedScene }) {
  const [selected, setSelected] = useState('fade')
  const [duration, setDuration] = useState(0.5)

  return (
    <div className="p-3">
      <p className="text-xs text-muted mb-3">Scene Transition</p>

      <div className="grid grid-cols-2 gap-1 mb-4">
        {transitions.map(t => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all duration-150"
            style={{
              background: selected === t.id ? '#7C3AED22' : '#242424',
              color: selected === t.id ? '#7C3AED' : '#888',
              border: selected === t.id ? '1px solid #7C3AED44' : '1px solid #2E2E2E',
            }}
          >
            <span className="text-lg">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-muted">Duration</p>
          <span className="text-xs text-primary">{duration}s</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={duration}
          onChange={e => setDuration(parseFloat(e.target.value))}
          className="w-full accent-purple-600"
        />
      </div>
    </div>
  )
}