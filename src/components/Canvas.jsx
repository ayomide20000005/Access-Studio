import { useRef, useState } from 'react'
import { Player } from '@remotion/player'
import { MainComposition } from '../remotion/compositions/MainComposition'

export default function Canvas({
  template,
  inputs,
  selectedStyles,
  isPlaying,
  currentTime,
  onPlayPause,
  onTimeChange,
  showTimeline,
}) {
  const playerRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [speed, setSpeed] = useState(1)

  const primaryColor = inputs?.primaryColor || template?.color || '#7C3AED'
  const duration = inputs?.duration || 10
  const totalFrames = duration * 30

  const formatTime = (frames) => {
    const seconds = Math.floor(frames / 30)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden relative"
      style={{ background: 'var(--bg)' }}
    >
      {/* Canvas area */}
      <div
        className="flex-1 flex items-center justify-center canvas-wrapper relative"
        onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={e => { e.preventDefault(); setIsDragOver(false) }}
      >
        {/* Remotion Player */}
        <div
          className="relative shadow-2xl overflow-hidden"
          style={{
            width: 640,
            height: 360,
            borderRadius: 8,
            border: `1px solid ${isDragOver ? primaryColor : 'var(--border)'}`,
            flexShrink: 0,
          }}
        >
          <Player
            ref={playerRef}
            component={MainComposition}
            inputProps={{
              templateId: template?.id || 'demo-video',
              inputs: {
                ...inputs,
                primaryColor: inputs?.primaryColor || template?.color || '#7C3AED',
                fontFamily: 'Inter',
              },
              selectedStyles: selectedStyles || {},
            }}
            durationInFrames={totalFrames}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={30}
            style={{ width: '100%', height: '100%' }}
            controls={false}
            playbackRate={speed}
            loop
          />

          {/* Drag overlay */}
          {isDragOver && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: `${primaryColor}22`,
                border: `2px dashed ${primaryColor}`,
              }}
            >
              <p className="text-sm font-medium" style={{ color: primaryColor }}>
                Drop to add
              </p>
            </div>
          )}
        </div>

        {/* Resolution badge */}
        <div
          className="absolute bottom-4 right-4 text-xs px-3 py-1.5 rounded-lg"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
          }}
        >
          1920 × 1080 · {duration}s
        </div>
      </div>

      {/* Floating pill toolbar */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: showTimeline ? 148 : 20 }}
      >
        <div className="pill">
          {/* Rewind */}
          <button
            onClick={() => {
              playerRef.current?.seekTo(0)
              onTimeChange(0)
            }}
            className="text-sm transition-opacity hover:opacity-70"
            style={{ color: 'var(--muted)' }}
          >
            ⏮
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => {
              if (isPlaying) {
                playerRef.current?.pause()
              } else {
                playerRef.current?.play()
              }
              onPlayPause()
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
            style={{ background: 'var(--primary)' }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Time */}
          <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
            {formatTime(currentTime)} / {duration}s
          </span>

          <div style={{ width: 1, height: 14, background: 'var(--border)' }} />

          {/* Speed input */}
          <div className="flex items-center gap-1">
            <span className="text-xs" style={{ color: 'var(--muted)' }}>×</span>
            <input
              type="number"
              value={speed}
              onChange={e => setSpeed(parseFloat(e.target.value) || 1)}
              min={0.1}
              max={4}
              step={0.1}
              className="text-xs font-mono text-center rounded-md"
              style={{
                width: 40,
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '2px 4px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ width: 1, height: 14, background: 'var(--border)' }} />

          {/* Forward */}
          <button
            onClick={() => {
              playerRef.current?.seekTo(totalFrames - 1)
              onTimeChange(totalFrames)
            }}
            className="text-sm transition-opacity hover:opacity-70"
            style={{ color: 'var(--muted)' }}
          >
            ⏭
          </button>
        </div>
      </div>

      {/* Timeline */}
      {showTimeline && (
        <div
          className="h-32 shrink-0"
          style={{
            background: 'var(--surface)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div
            className="flex items-center px-4 h-8"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <span className="text-xs" style={{ color: 'var(--muted)' }}>Timeline</span>
          </div>
          <div className="px-4 py-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs w-14 shrink-0" style={{ color: 'var(--muted)' }}>Video</span>
              <div className="timeline-track flex-1">
                <div className="timeline-clip" style={{ left: '0%', width: '100%' }}>
                  🎬 {template?.name}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs w-14 shrink-0" style={{ color: 'var(--muted)' }}>Audio</span>
              <div className="timeline-track flex-1" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}