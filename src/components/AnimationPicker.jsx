import { useState } from 'react'

const animations = [
  { id: 'fade', label: 'Fade In', icon: '◐' },
  { id: 'slide-left', label: 'Slide Left', icon: '←' },
  { id: 'slide-right', label: 'Slide Right', icon: '→' },
  { id: 'slide-up', label: 'Slide Up', icon: '↑' },
  { id: 'slide-down', label: 'Slide Down', icon: '↓' },
  { id: 'zoom-in', label: 'Zoom In', icon: '⊕' },
  { id: 'zoom-out', label: 'Zoom Out', icon: '⊖' },
  { id: 'bounce', label: 'Bounce', icon: '⤒' },
  { id: 'spin', label: 'Spin', icon: '↻' },
  { id: 'flip', label: 'Flip', icon: '⇅' },
]

export default function AnimationPicker({ selectedLayer }) {
  const [selected, setSelected] = useState('fade')

  return (
    <div className="p-3">
      {!selectedLayer ? (
        <p className="text-xs text-muted text-center py-8">
          Select a layer to add animations
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted mb-2">Entrance Animation</p>
          {animations.map(anim => (
            <button
              key={anim.id}
              onClick={() => setSelected(anim.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-150 w-full text-left"
              style={{
                background: selected === anim.id ? '#7C3AED22' : 'transparent',
                color: selected === anim.id ? '#7C3AED' : '#888',
                border: selected === anim.id ? '1px solid #7C3AED44' : '1px solid transparent',
              }}
            >
              <span className="w-5 text-center">{anim.icon}</span>
              {anim.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}