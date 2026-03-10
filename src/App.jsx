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
    navigateTo('editor')
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Custom Title Bar */}
      <div
        className="h-9 flex items-center justify-between px-4 select-none shrink-0"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', WebkitAppRegion: 'drag' }}
      >
        {/* Window controls */}
        <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
          <div
            className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => window.electron.close()}
          />
          <div
            className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => window.electron.minimize()}
          />
          <div
            className="w-3 h-3 rounded-full bg-green-500 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => window.electron.maximize()}
          />
        </div>

        {/* App name */}
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
          Acces Studio
        </span>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{ WebkitAppRegion: 'no-drag', color: 'var(--muted)' }}
          className="text-sm hover:opacity-80 transition-opacity px-2"
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
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