// PATH: src/components/Canvas.jsx

import { useState, useEffect, useRef } from 'react'
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

  // Custom template component state
  const [customComponent, setCustomComponent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const loadedFolderRef = useRef(null)

  useEffect(() => {
    if (!template?.isCustom || !template?.folderPath) {
      setCustomComponent(null)
      setLoadError(null)
      return
    }

    // Already loaded this template — skip
    if (loadedFolderRef.current === template.folderPath && customComponent) return

    const run = async () => {
      setLoading(true)
      setLoadError(null)
      try {
        // Dynamically import Composition.jsx from the template folder
        // vite.config.js fs.allow lets Vite serve files from anywhere
        const compositionPath = template.folderPath.replace(/\\/g, '/') + '/Composition.jsx'
        const module = await import(/* @vite-ignore */ `/@fs/${compositionPath}`)

        // Find the exported component
        const component = Object.values(module).find(
          (exp) => typeof exp === 'function'
        )

        if (!component) {
          throw new Error('No valid component found in Composition.jsx')
        }

        setCustomComponent(() => component)
        loadedFolderRef.current = template.folderPath
      } catch (err) {
        setLoadError(err.message)
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [template?.folderPath, template?.isCustom])

  // For built-in templates
  const builtInInputProps = {
    templateId: template?.id || '',
    inputs: inputs || {},
    selectedStyles: selectedStyles || {},
  }

  // For custom templates — pass all inputs and selectedStyles directly as props
  const customInputProps = {
    ...(inputs || {}),
    ...(selectedStyles || {}),
  }

  const renderPlayer = () => {
    if (!template) {
      return (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-3"
          style={{ background: 'var(--surface)', color: 'var(--muted)' }}
        >
          <span className="text-4xl">🎬</span>
          <p className="text-sm">Select a template to start</p>
        </div>
      )
    }

    if (template.isCustom && loading) {
      return (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-4"
          style={{ background: 'var(--surface)', color: 'var(--muted)' }}
        >
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }}
          />
          <p className="text-sm">Loading template...</p>
        </div>
      )
    }

    if (template.isCustom && loadError) {
      return (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-3"
          style={{ background: 'var(--surface)', color: 'var(--muted)' }}
        >
          <span className="text-4xl">⚠️</span>
          <p className="text-sm font-semibold" style={{ color: '#DC2626' }}>Preview failed</p>
          <p className="text-xs text-center px-8" style={{ color: 'var(--muted)', maxWidth: 340 }}>
            {loadError}
          </p>
        </div>
      )
    }

    // Custom template — use Player with directly imported component
    // No bundling, no iframe, no Studio shell
    if (template.isCustom && customComponent) {
      return (
        <Player
          component={customComponent}
          inputProps={customInputProps}
          durationInFrames={durationInFrames}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={FPS}
          style={{ width: '100%', height: '100%' }}
          controls
          autoPlay={false}
          loop
          acknowledgeRemotionLicense
        />
      )
    }

    // Built-in template
    return (
      <Player
        component={MainComposition}
        inputProps={builtInInputProps}
        durationInFrames={durationInFrames}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={FPS}
        style={{ width: '100%', height: '100%' }}
        controls
        autoPlay={false}
        loop
        acknowledgeRemotionLicense
      />
    )
  }

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
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
          {renderPlayer()}
        </div>
      </div>

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