import { Player } from '@remotion/player'
import { MainComposition } from '../remotion/compositions/MainComposition'

const FPS = 30

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
  const rawDuration = parseFloat(inputs?.duration)
  const safeDuration = isFinite(rawDuration) && rawDuration >= 1 ? rawDuration : 10
  const durationInFrames = Math.max(1, Math.round(safeDuration * FPS))

  const inputProps = {
    templateId: template?.id || '',
    inputs: inputs || {},
    selectedStyles: selectedStyles || {},
  }

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Canvas area */}
      <div
        className="flex-1 flex items-center justify-center"
        style={{ background: 'var(--bg)', padding: '32px 48px' }}
      >
        <div
          style={{
            width: '72%',
            aspectRatio: '16/9',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 0 0 1px var(--border), 0 24px 64px rgba(0,0,0,0.5)',
            flexShrink: 0,
          }}
        >
          {template ? (
            <Player
              component={MainComposition}
              inputProps={inputProps}
              durationInFrames={durationInFrames}
              compositionWidth={1920}
              compositionHeight={1080}
              fps={FPS}
              style={{ width: '100%', height: '100%' }}
              controls
              autoPlay={false}
              loop
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-3"
              style={{ background: 'var(--surface)', color: 'var(--muted)' }}
            >
              <span className="text-4xl">🎬</span>
              <p className="text-sm">Select a template to start</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline strip */}
      {showTimeline && (
        <div
          className="h-16 flex items-center px-6 gap-4 shrink-0"
          style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
        >
          <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
            Timeline
          </span>
          <div
            className="flex-1 h-2 rounded-full"
            style={{ background: 'var(--panel)' }}
          >
            <div
              className="h-full rounded-full"
              style={{ width: '30%', background: 'var(--primary)' }}
            />
          </div>
          <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
            {safeDuration}s
          </span>
        </div>
      )}
    </div>
  )
}