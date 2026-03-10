export default function Toolbar({
  activeTool,
  onToolChange,
  onExport,
  onHome,
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
  zoom,
  onZoomChange,
  template,
}) {
  const tools = [
    { id: 'select', icon: '↖', label: 'Select' },
    { id: 'text', icon: 'T', label: 'Text' },
    { id: 'image', icon: '🖼', label: 'Image' },
    { id: 'shape', icon: '⬜', label: 'Shape' },
    { id: 'video', icon: '🎬', label: 'Video' },
    { id: 'audio', icon: '🎵', label: 'Audio' },
  ]

  const formatTime = (frames) => {
    const seconds = Math.floor(frames / 30)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div
      className="h-12 flex items-center px-4 gap-4 shrink-0"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Back */}
      <button
        onClick={onHome}
        className="text-sm flex items-center gap-1 transition-colors"
        style={{ color: 'var(--muted)' }}
        onMouseEnter={e => e.target.style.color = 'var(--text)'}
        onMouseLeave={e => e.target.style.color = 'var(--muted)'}
      >
        ← Home
      </button>

      <div style={{ width: 1, height: 16, background: 'var(--border)' }} />

      {/* Template name */}
      <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
        {template?.name || 'Untitled'}
      </span>

      <div style={{ width: 1, height: 16, background: 'var(--border)' }} />

      {/* Tools */}
      <div className="flex items-center gap-1">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            title={tool.label}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all duration-150"
            style={{
              background: activeTool === tool.id ? 'var(--primary)' : 'transparent',
              color: activeTool === tool.id ? '#fff' : 'var(--muted)',
            }}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div style={{ width: 1, height: 16, background: 'var(--border)' }} />

      {/* Playback */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPlayPause}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm transition-colors"
          style={{ background: 'var(--primary)' }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div style={{ width: 1, height: 16, background: 'var(--border)' }} />

      {/* Zoom */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
          className="w-6 h-6 flex items-center justify-center text-sm transition-colors"
          style={{ color: 'var(--muted)' }}
        >
          −
        </button>
        <span className="text-xs font-mono w-10 text-center" style={{ color: 'var(--muted)' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}
          className="w-6 h-6 flex items-center justify-center text-sm transition-colors"
          style={{ color: 'var(--muted)' }}
        >
          +
        </button>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          className="text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all"
          style={{
            background: 'var(--panel)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        >
          💾 Save
        </button>
        <button
          onClick={onExport}
          className="text-xs py-1.5 px-4 rounded-lg flex items-center gap-1 font-semibold text-white glow transition-all"
          style={{ background: 'var(--primary)' }}
        >
          ⬇ Export
        </button>
      </div>
    </div>
  )
}