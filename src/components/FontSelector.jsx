import { useState } from 'react'

const fonts = [
  { id: 'inter', label: 'Inter', style: 'Inter, sans-serif' },
  { id: 'roboto', label: 'Roboto', style: 'Roboto, sans-serif' },
  { id: 'poppins', label: 'Poppins', style: 'Poppins, sans-serif' },
  { id: 'playfair', label: 'Playfair Display', style: 'Playfair Display, serif' },
  { id: 'montserrat', label: 'Montserrat', style: 'Montserrat, sans-serif' },
  { id: 'oswald', label: 'Oswald', style: 'Oswald, sans-serif' },
  { id: 'lato', label: 'Lato', style: 'Lato, sans-serif' },
  { id: 'raleway', label: 'Raleway', style: 'Raleway, sans-serif' },
]

export default function FontSelector({ selectedLayer }) {
  const [selectedFont, setSelectedFont] = useState('inter')
  const [fontSize, setFontSize] = useState(32)
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [align, setAlign] = useState('left')

  return (
    <div className="p-3">
      {/* Style buttons */}
      <div className="flex items-center gap-1 mb-3">
        <button
          onClick={() => setBold(!bold)}
          className="w-8 h-8 rounded text-xs font-bold transition-colors"
          style={{ background: bold ? '#7C3AED' : '#242424', color: bold ? '#fff' : '#888' }}
        >
          B
        </button>
        <button
          onClick={() => setItalic(!italic)}
          className="w-8 h-8 rounded text-xs italic transition-colors"
          style={{ background: italic ? '#7C3AED' : '#242424', color: italic ? '#fff' : '#888' }}
        >
          I
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        {['left', 'center', 'right'].map(a => (
          <button
            key={a}
            onClick={() => setAlign(a)}
            className="w-8 h-8 rounded text-xs transition-colors"
            style={{ background: align === a ? '#7C3AED' : '#242424', color: align === a ? '#fff' : '#888' }}
          >
            {a === 'left' ? '⬛' : a === 'center' ? '▬' : '▪'}
          </button>
        ))}
      </div>

      {/* Font size */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-muted w-16 shrink-0">Size</span>
        <input
          type="number"
          value={fontSize}
          onChange={e => setFontSize(Number(e.target.value))}
          className="input text-xs"
          min={8}
          max={200}
        />
      </div>

      {/* Font list */}
      <p className="text-xs text-muted mb-2">Font Family</p>
      <div className="flex flex-col gap-1">
        {fonts.map(font => (
          <button
            key={font.id}
            onClick={() => setSelectedFont(font.id)}
            className="flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-150 text-left"
            style={{
              fontFamily: font.style,
              background: selectedFont === font.id ? '#7C3AED22' : 'transparent',
              color: selectedFont === font.id ? '#7C3AED' : '#888',
              border: selectedFont === font.id ? '1px solid #7C3AED44' : '1px solid transparent',
            }}
          >
            {font.label}
          </button>
        ))}
      </div>
    </div>
  )
}