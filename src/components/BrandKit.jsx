import { useState } from 'react'

const defaultColors = ['#7C3AED', '#4F46E5', '#F5F5F5', '#0F0F0F']

export default function BrandKit() {
  const [logo, setLogo] = useState(null)
  const [brandColors, setBrandColors] = useState(defaultColors)
  const [brandFont, setBrandFont] = useState('Inter')
  const [brandName, setBrandName] = useState('')

  const handleLogoUpload = async () => {
    const files = await window.electron.openFile([
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'svg', 'webp'] },
    ])
    if (files && files[0]) setLogo(files[0])
  }

  const handleColorChange = (index, value) => {
    const updated = [...brandColors]
    updated[index] = value
    setBrandColors(updated)
  }

  const handleAddColor = () => {
    if (brandColors.length < 8) {
      setBrandColors([...brandColors, '#888888'])
    }
  }

  const handleRemoveColor = (index) => {
    if (brandColors.length > 1) {
      setBrandColors(brandColors.filter((_, i) => i !== index))
    }
  }

  const handleSave = () => {
    const brandData = { logo, brandColors, brandFont, brandName }
    localStorage.setItem('acces-brand-kit', JSON.stringify(brandData))
  }

  return (
    <div className="p-3 flex flex-col gap-4">
      {/* Brand Name */}
      <div>
        <p className="text-xs text-muted mb-1">Brand Name</p>
        <input
          type="text"
          value={brandName}
          onChange={e => setBrandName(e.target.value)}
          placeholder="Your Brand"
          className="input text-xs"
        />
      </div>

      {/* Logo */}
      <div>
        <p className="text-xs text-muted mb-2">Logo</p>
        <div
          onClick={handleLogoUpload}
          className="w-full h-20 rounded-lg border border-dashed border-border hover:border-primary flex items-center justify-center cursor-pointer transition-colors group"
        >
          {logo ? (
            <img
              src={`file://${logo}`}
              alt="Brand Logo"
              className="max-h-16 max-w-full object-contain"
            />
          ) : (
            <div className="text-center">
              <p className="text-2xl mb-1">🖼</p>
              <p className="text-xs text-muted group-hover:text-primary transition-colors">
                Upload Logo
              </p>
            </div>
          )}
        </div>
        {logo && (
          <button
            onClick={() => setLogo(null)}
            className="text-xs text-muted hover:text-red-400 mt-1 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      {/* Brand Colors */}
      <div>
        <p className="text-xs text-muted mb-2">Brand Colors</p>
        <div className="flex flex-col gap-2">
          {brandColors.map((color, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg border border-border overflow-hidden shrink-0 cursor-pointer"
                style={{ background: color }}
              >
                <input
                  type="color"
                  value={color}
                  onChange={e => handleColorChange(index, e.target.value)}
                  className="opacity-0 w-full h-full cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={color}
                onChange={e => handleColorChange(index, e.target.value)}
                className="input text-xs font-mono"
                maxLength={7}
              />
              <button
                onClick={() => handleRemoveColor(index)}
                className="text-muted hover:text-red-400 transition-colors text-sm shrink-0"
              >
                ×
              </button>
            </div>
          ))}
          {brandColors.length < 8 && (
            <button
              onClick={handleAddColor}
              className="text-xs text-muted hover:text-primary transition-colors flex items-center gap-1 mt-1"
            >
              + Add Color
            </button>
          )}
        </div>
      </div>

      {/* Brand Font */}
      <div>
        <p className="text-xs text-muted mb-2">Brand Font</p>
        <select
          value={brandFont}
          onChange={e => setBrandFont(e.target.value)}
          className="input text-xs"
        >
          {['Inter', 'Roboto', 'Poppins', 'Montserrat', 'Oswald', 'Lato', 'Raleway', 'Playfair Display'].map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Save */}
      <button onClick={handleSave} className="btn-primary text-xs py-2">
        💾 Save Brand Kit
      </button>
    </div>
  )
}