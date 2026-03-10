import { useRef } from 'react'

export default function Timeline({
  scenes,
  selectedScene,
  onSceneSelect,
  currentTime,
  onTimeChange,
  duration,
  isPlaying,
  onPlayPause,
  selectedLayer,
  onLayerSelect,
}) {
  const timelineRef = useRef(null)

  const formatTime = (frames) => {
    const seconds = Math.floor(frames / 30)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleTimelineClick = (e) => {
    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = x / rect.width
    onTimeChange(Math.floor(percent * duration))
  }

  const progressPercent = (currentTime / duration) * 100

  return (
    <div className="h-48 bg-surface border-t border-border flex flex-col shrink-0">
      {/* Timeline Header */}
      <div className="h-8 border-b border-border flex items-center px-4 gap-4">
        <button
          onClick={onPlayPause}
          className="w-6 h-6 flex items-center justify-center text-primary hover:text-purple-400 transition-colors"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <span className="text-xs text-muted font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Scenes:</span>
          {scenes.map(scene => (
            <button
              key={scene.id}
              onClick={() => onSceneSelect(scene.id)}
              className="text-xs px-2 py-0.5 rounded transition-colors"
              style={{
                background: selectedScene === scene.id ? '#7C3AED' : '#242424',
                color: selectedScene === scene.id ? '#fff' : '#888',
              }}
            >
              {scene.name}
            </button>
          ))}
        </div>
      </div>

      {/* Scrubber */}
      <div
        ref={timelineRef}
        className="h-6 bg-dark relative cursor-pointer border-b border-border"
        onClick={handleTimelineClick}
      >
        {/* Time markers */}
        {Array.from({ length: 11 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 h-full flex flex-col items-center"
            style={{ left: `${i * 10}%` }}
          >
            <div className="w-px h-3 bg-border mt-1" />
            <span className="text-xs text-muted" style={{ fontSize: '9px' }}>
              {formatTime(Math.floor((i / 10) * duration))}
            </span>
          </div>
        ))}

        {/* Playhead */}
        <div
          className="absolute top-0 h-full w-px bg-primary z-10"
          style={{ left: `${progressPercent}%` }}
        >
          <div className="w-3 h-3 bg-primary rounded-full -translate-x-1.5 -translate-y-0" />
        </div>
      </div>

      {/* Tracks */}
      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2">
        {/* Video Track */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted w-16 shrink-0">Video</span>
          <div className="timeline-track flex-1">
            <div
              className="timeline-clip"
              style={{ left: '0%', width: '100%' }}
            >
              🎬 {scenes.find(s => s.id === selectedScene)?.name}
            </div>
          </div>
        </div>

        {/* Audio Track */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted w-16 shrink-0">Audio</span>
          <div className="timeline-track flex-1">
            <div
              className="timeline-clip"
              style={{
                left: '0%',
                width: '60%',
                background: '#0891B222',
                borderColor: '#0891B2',
              }}
            >
              🎵 Background
            </div>
          </div>
        </div>

        {/* Voiceover Track */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted w-16 shrink-0">Voice</span>
          <div className="timeline-track flex-1" />
        </div>
      </div>
    </div>
  )
}