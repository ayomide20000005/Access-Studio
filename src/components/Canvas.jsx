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

  // Custom template bundle state
  const [serveUrl, setServeUrl] = useState(null)
  const [bundling, setBundling] = useState(false)
  const [bundleError, setBundleError] = useState(null)

  // Track which folderPath we already bundled so we don't re-bundle on every input change
  const bundledFolderRef = useRef(null)

  useEffect(() => {
    // Only run for custom templates
    if (!template?.isCustom || !template?.folderPath) {
      setServeUrl(null)
      setBundleError(null)
      return
    }

    // Already bundled this template this session — skip
    if (bundledFolderRef.current === template.folderPath && serveUrl) return

    const run = async () => {
      setBundling(true)
      setBundleError(null)
      try {
        const result = await window.electron.bundleTemplate(template.folderPath)
        if (result.success) {
          setServeUrl(result.serveUrl)
          bundledFolderRef.current = template.folderPath
        } else {
          setBundleError(result.error)
        }
      } catch (err) {
        setBundleError(err.message)
      } finally {
        setBundling(false)
      }
    }

    run()
  }, [template?.folderPath, template?.isCustom])

  // For built-in templates — same inputProps as before
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
    // No template selected
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

    // Custom template — bundling in progress
    if (template.isCustom && bundling) {
      return (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-4"
          style={{ background: 'var(--surface)', color: 'var(--muted)' }}
        >
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }}
          />
          <p className="text-sm">Preparing preview...</p>
          <p className="text-xs" style={{ color: 'var(--muted)', maxWidth: 260, textAlign: 'center' }}>
            This only happens once per template. Updates will be instant after this.
          </p>
        </div>
      )
    }

    // Custom template — bundle failed
    if (template.isCustom && bundleError) {
      return (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-3"
          style={{ background: 'var(--surface)', color: 'var(--muted)' }}
        >
          <span className="text-4xl">⚠️</span>
          <p className="text-sm font-semibold" style={{ color: '#DC2626' }}>Preview failed</p>
          <p
            className="text-xs text-center px-8"
            style={{ color: 'var(--muted)', maxWidth: 340 }}
          >
            {bundleError}
          </p>
          <p className="text-xs text-center px-8" style={{ color: 'var(--muted)', maxWidth: 340 }}>
            Make sure your template has a valid index.js and Root.jsx and that the composition id in Root.jsx matches the "composition" value in template.config.json.
          </p>
        </div>
      )
    }

    // Custom template — ready with serveUrl — show in iframe
    if (template.isCustom && serveUrl) {
      const compositionId = template?.composition || 'MainComposition'
      const allProps = {
        ...(inputs || {}),
        ...(selectedStyles || {}),
      }

      // serveUrl is now http://127.0.0.1:PORT
      // append index.html and composition hash
      const iframeSrc = `${serveUrl}/index.html#${compositionId}`

      return (
        <iframe
          key={`${compositionId}-${JSON.stringify(allProps)}`}
          src={iframeSrc}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            background: '#000',
          }}
          title="Custom Template Preview"
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
      />
    )
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
          {renderPlayer()}
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