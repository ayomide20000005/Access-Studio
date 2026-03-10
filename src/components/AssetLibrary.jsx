import { useState, useEffect } from 'react'

const assetCategories = [
  { id: 'all', label: 'All' },
  { id: 'images', label: 'Images' },
  { id: 'videos', label: 'Videos' },
  { id: 'audio', label: 'Audio' },
]

export default function AssetLibrary() {
  const [assets, setAssets] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [isDragOver, setIsDragOver] = useState(false)

  const handleImport = async () => {
    const files = await window.electron.openFile([
      {
        name: 'Media Files',
        extensions: ['png', 'jpg', 'jpeg', 'webp', 'svg', 'mp4', 'mov', 'webm', 'mp3', 'wav', 'ogg'],
      },
    ])
    if (files && files[0]) {
      const filePath = files[0]
      const fileName = filePath.split('\\').pop().split('/').pop()
      const ext = fileName.split('.').pop().toLowerCase()

      let type = 'images'
      if (['mp4', 'mov', 'webm'].includes(ext)) type = 'videos'
      if (['mp3', 'wav', 'ogg'].includes(ext)) type = 'audio'

      const newAsset = {
        id: Date.now(),
        name: fileName,
        path: filePath,
        type,
        ext,
      }
      setAssets(prev => [...prev, newAsset])
    }
  }

  const handleDelete = (id) => {
    setAssets(prev => prev.filter(a => a.id !== id))
  }

  const filtered = activeCategory === 'all'
    ? assets
    : assets.filter(a => a.type === activeCategory)

  const getIcon = (type) => {
    if (type === 'videos') return '🎬'
    if (type === 'audio') return '🎵'
    return '🖼'
  }

  return (
    <div className="flex flex-col h-full">
      {/* Category tabs */}
      <div className="flex gap-1 p-2 border-b border-border">
        {assetCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="flex-1 py-1 rounded text-xs transition-colors"
            style={{
              background: activeCategory === cat.id ? '#7C3AED' : '#242424',
              color: activeCategory === cat.id ? '#fff' : '#888',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Import button */}
      <div className="p-2">
        <button
          onClick={handleImport}
          className="w-full py-2 rounded-lg border border-dashed border-border hover:border-primary text-muted hover:text-primary text-xs transition-all flex items-center justify-center gap-1"
        >
          + Import Asset
        </button>
      </div>

      {/* Asset list */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted">
            <p className="text-2xl mb-2">📁</p>
            <p className="text-xs text-center">No assets yet. Import media files to get started.</p>
          </div>
        ) : (
          filtered.map(asset => (
            <div
              key={asset.id}
              draggable
              className="flex items-center gap-2 p-2 rounded-lg bg-panel hover:bg-border transition-colors cursor-grab group"
            >
              <span className="text-lg shrink-0">{getIcon(asset.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text truncate">{asset.name}</p>
                <p className="text-xs text-muted capitalize">{asset.type}</p>
              </div>
              <button
                onClick={() => handleDelete(asset.id)}
                className="text-muted hover:text-red-400 text-sm hidden group-hover:block transition-colors shrink-0"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}