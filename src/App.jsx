import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Editor from './pages/Editor'
import Export from './pages/Export'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [projectData, setProjectData] = useState(null)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const saved = localStorage.getItem('acces-theme') || 'dark'
    setTheme(saved)
    document.documentElement.classList.toggle('light', saved === 'light')
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('acces-theme', next)
    document.documentElement.classList.toggle('light', next === 'light')
  }

  const navigateTo = (page, data = null) => {
    if (data) setProjectData(data)
    setCurrentPage(page)
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    setProjectData({ template, inputs: {}, selectedStyles: {} })
    setCurrentPage('editor')
  }

  const handleProjectUpdate = (inputs, selectedStyles) => {
    setProjectData(prev => ({
      ...prev,
      inputs,
      selectedStyles,
    }))
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Custom Title Bar */}
      <div
        className="h-9 flex items-center justify-between px-4 select-none shrink-0"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', WebkitAppRegion: 'drag' }}
      >
        {/* Left — App name + theme toggle */}
        <div className="flex items-center gap-3" style={{ WebkitAppRegion: 'no-drag' }}>
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
            Acces Studio
          </span>

          {/* Toggle switch */}
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            style={{
              width: 40,
              height: 22,
              borderRadius: 50,
              background: theme === 'light' ? 'var(--primary)' : 'var(--border)',
              position: 'relative',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
              flexShrink: 0,
            }}
          >
            {/* Knob */}
            <div
              style={{
                position: 'absolute',
                top: 3,
                left: theme === 'light' ? 21 : 3,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#FFFFFF',
                transition: 'left 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
              }}
            >
              {theme === 'light' ? '☀️' : '🌙'}
            </div>
          </button>
        </div>

        {/* Right — Windows style controls */}
        <div className="flex items-center" style={{ WebkitAppRegion: 'no-drag' }}>
          {/* Minimize */}
          <button
            onClick={() => window.electron.minimize()}
            className="flex items-center justify-center transition-colors"
            style={{
              width: 46,
              height: 36,
              color: 'var(--muted)',
              background: 'transparent',
              fontSize: 16,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--panel)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            ─
          </button>

          {/* Maximize */}
          <button
            onClick={() => window.electron.maximize()}
            className="flex items-center justify-center transition-colors"
            style={{
              width: 46,
              height: 36,
              color: 'var(--muted)',
              background: 'transparent',
              fontSize: 12,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--panel)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            □
          </button>

          {/* Close */}
          <button
            onClick={() => window.electron.close()}
            className="flex items-center justify-center transition-colors"
            style={{
              width: 46,
              height: 36,
              color: 'var(--muted)',
              background: 'transparent',
              fontSize: 16,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#DC2626'
              e.currentTarget.style.color = '#FFFFFF'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--muted)'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Page Router */}
      <div className="flex-1 overflow-hidden">
        {currentPage === 'home' && (
          <Home
            onTemplateSelect={handleTemplateSelect}
            theme={theme}
          />
        )}
        {currentPage === 'editor' && (
          <Editor
            template={selectedTemplate}
            projectData={projectData}
            onProjectUpdate={handleProjectUpdate}
            onExport={() => navigateTo('export')}
            onHome={() => navigateTo('home')}
            theme={theme}
          />
        )}
        {currentPage === 'export' && (
          <Export
            projectData={projectData}
            onBack={() => navigateTo('editor')}
            onHome={() => navigateTo('home')}
            theme={theme}
          />
        )}
      </div>
    </div>
  )
}