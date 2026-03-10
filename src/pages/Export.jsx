import { useState } from 'react'
import { useExport } from '../hooks/useExport'

const resolutionOptions = [
  { id: '720p', label: '720p', sublabel: '1280 × 720', description: 'HD — smaller file size' },
  { id: '1080p', label: '1080p', sublabel: '1920 × 1080', description: 'Full HD — recommended' },
  { id: '4k', label: '4K', sublabel: '3840 × 2160', description: 'Ultra HD — large file' },
]

const formatOptions = [
  { id: 'mp4', label: 'MP4', sublabel: 'H.264 codec', description: 'Best compatibility' },
  { id: 'gif', label: 'GIF', sublabel: 'Animated', description: 'No audio, smaller' },
]

const fpsOptions = [
  { id: '24', label: '24 fps', sublabel: 'Cinematic' },
  { id: '30', label: '30 fps', sublabel: 'Standard' },
  { id: '60', label: '60 fps', sublabel: 'Smooth' },
]

export default function Export({ projectData, onBack, onHome, theme }) {
  const [selectedResolution, setSelectedResolution] = useState('1080p')
  const [selectedFormat, setSelectedFormat] = useState('mp4')
  const [selectedFps, setSelectedFps] = useState('30')
  const { isExporting, progress, stage, error, outputPath, startExport, reset } = useExport()

  const handleExport = async () => {
    await startExport({
      project: projectData,
      format: selectedFormat,
      resolution: selectedResolution,
      fps: selectedFps,
      outputDir: null,
    })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        onClick={onBack}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-8" style={{ pointerEvents: 'none' }}>
        <div
          className="w-full max-w-md rounded-2xl flex flex-col overflow-hidden"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            pointerEvents: 'all',
            maxHeight: '85vh',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
                Export Video
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                Renders locally — no internet needed
              </p>
            </div>
            <button
              onClick={onBack}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'var(--panel)', color: 'var(--muted)' }}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div
            className="flex-1 px-6 py-5 flex flex-col gap-6"
            style={{ overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}
          >
            {/* Resolution */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
                Resolution
              </p>
              <div className="flex flex-col gap-2">
                {resolutionOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedResolution(option.id)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150"
                    style={{
                      background: selectedResolution === option.id ? '#7C3AED22' : 'var(--panel)',
                      border: `1px solid ${selectedResolution === option.id ? 'var(--primary)' : 'var(--border)'}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={{ borderColor: selectedResolution === option.id ? 'var(--primary)' : 'var(--border)' }}
                      >
                        {selectedResolution === option.id && (
                          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--primary)' }} />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold" style={{ color: selectedResolution === option.id ? 'var(--primary)' : 'var(--text)' }}>
                          {option.label}
                          <span className="ml-2 text-xs font-normal" style={{ color: 'var(--muted)' }}>
                            {option.sublabel}
                          </span>
                        </p>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
                Format
              </p>
              <div className="grid grid-cols-2 gap-2">
                {formatOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedFormat(option.id)}
                    className="flex flex-col items-start px-4 py-3 rounded-xl transition-all duration-150"
                    style={{
                      background: selectedFormat === option.id ? '#7C3AED22' : 'var(--panel)',
                      border: `1px solid ${selectedFormat === option.id ? 'var(--primary)' : 'var(--border)'}`,
                    }}
                  >
                    <p className="text-sm font-semibold mb-0.5" style={{ color: selectedFormat === option.id ? 'var(--primary)' : 'var(--text)' }}>
                      {option.label}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{option.sublabel}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* FPS */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
                Frame Rate
              </p>
              <div className="grid grid-cols-3 gap-2">
                {fpsOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedFps(option.id)}
                    className="flex flex-col items-center py-3 rounded-xl transition-all duration-150"
                    style={{
                      background: selectedFps === option.id ? '#7C3AED22' : 'var(--panel)',
                      border: `1px solid ${selectedFps === option.id ? 'var(--primary)' : 'var(--border)'}`,
                    }}
                  >
                    <p className="text-sm font-semibold" style={{ color: selectedFps === option.id ? 'var(--primary)' : 'var(--text)' }}>
                      {option.label}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{option.sublabel}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-xl p-3 flex items-center justify-between"
                style={{ background: '#DC262611', border: '1px solid #DC262633' }}
              >
                <p className="text-xs" style={{ color: '#DC2626' }}>❌ {error}</p>
                <button onClick={reset} className="text-xs" style={{ color: 'var(--muted)' }}>Retry</button>
              </div>
            )}

            {/* Success */}
            {outputPath && !isExporting && (
              <div
                className="rounded-xl p-3"
                style={{ background: '#22C55E11', border: '1px solid #22C55E33' }}
              >
                <p className="text-sm font-semibold mb-1" style={{ color: '#22C55E' }}>✅ Export Complete</p>
                <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{outputPath}</p>
              </div>
            )}

            {/* Progress */}
            {isExporting && (
              <div
                className="rounded-xl p-4"
                style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>{stage}</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--primary)' }}>{progress}%</span>
                </div>
                <div className="w-full rounded-full overflow-hidden" style={{ height: 4, background: 'var(--border)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%`, background: 'var(--primary)' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="px-6 py-4 shrink-0 flex gap-3"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <button
              onClick={onBack}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)' }}
            >
              Cancel
            </button>

            {outputPath ? (
              <button
                onClick={reset}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white glow"
                style={{ background: 'var(--primary)' }}
              >
                Export Again
              </button>
            ) : (
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{
                  background: isExporting ? 'var(--border)' : 'var(--primary)',
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                  boxShadow: isExporting ? 'none' : '0 0 20px #7C3AED44',
                }}
              >
                {isExporting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Rendering...
                  </span>
                ) : (
                  '⬇ Render Video'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}