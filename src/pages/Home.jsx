import { useState } from 'react'
import TemplateCard from '../components/TemplateCard'
import TemplateManager from '../components/TemplateManager'
import TemplateGuide from './TemplateGuide'
import { useTemplates } from '../hooks/useTemplates'

const templates = [
  {
    id: 'demo-video',
    name: 'Demo Video',
    description: 'Showcase your product or service in action',
    icon: '🎬',
    color: '#7C3AED',
    fields: ['Product Name', 'Tagline', 'Key Features', 'Call to Action'],
    previewPath: null,
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    description: 'Announce your new product with impact',
    icon: '🚀',
    color: '#4F46E5',
    fields: ['Product Name', 'Launch Date', 'Key Benefits', 'Price', 'Call to Action'],
    previewPath: null,
  },
  {
    id: 'explainer-video',
    name: 'Explainer Video',
    description: 'Break down complex ideas simply',
    icon: '💡',
    color: '#0891B2',
    fields: ['Topic', 'Problem', 'Solution', 'How It Works', 'Call to Action'],
    previewPath: null,
  },
  {
    id: 'promotional-video',
    name: 'Promotional Video',
    description: 'Drive sales with a compelling promo',
    icon: '📣',
    color: '#DC2626',
    fields: ['Brand Name', 'Offer', 'Discount', 'Expiry Date', 'Call to Action'],
    previewPath: null,
  },
  {
    id: 'tutorial-video',
    name: 'Tutorial Video',
    description: 'Teach your audience step by step',
    icon: '📚',
    color: '#059669',
    fields: ['Tutorial Title', 'Steps', 'Tips', 'Call to Action'],
    previewPath: null,
  },
  {
    id: 'intro-outro',
    name: 'Intro & Outro',
    description: 'Professional intros and outros for your channel',
    icon: '🎞️',
    color: '#D97706',
    fields: ['Channel Name', 'Tagline', 'Social Links'],
    previewPath: null,
  },
  {
    id: 'social-media-clip',
    name: 'Social Media Clip',
    description: 'Eye-catching clips for any platform',
    icon: '📱',
    color: '#DB2777',
    fields: ['Caption', 'Hashtags', 'Platform', 'Call to Action'],
    previewPath: null,
  },
  {
    id: 'pitch-deck-video',
    name: 'Pitch Deck Video',
    description: 'Turn your pitch deck into a compelling video',
    icon: '💼',
    color: '#7C3AED',
    fields: ['Company Name', 'Problem', 'Solution', 'Market Size', 'Team', 'Ask'],
    previewPath: null,
  },
  {
    id: 'resume-portfolio',
    name: 'Resume & Portfolio',
    description: 'Stand out with a video resume',
    icon: '👤',
    color: '#4F46E5',
    fields: ['Full Name', 'Role', 'Skills', 'Experience', 'Contact'],
    previewPath: null,
  },
  {
    id: 'event-announcement',
    name: 'Event Announcement',
    description: 'Promote your upcoming event',
    icon: '📅',
    color: '#0891B2',
    fields: ['Event Name', 'Date', 'Location', 'Description', 'Register Link'],
    previewPath: null,
  },
]

const PER_PAGE = 6

export default function Home({ onTemplateSelect, theme }) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('templates')
  const [page, setPage] = useState(0)
  const [hoveredId, setHoveredId] = useState(null)
  const [showGuide, setShowGuide] = useState(false)

  const {
    userTemplates,
    loading,
    error,
    importTemplate,
    deleteTemplate,
    updateTemplate,
  } = useTemplates()

  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  const handleSearch = (val) => {
    setSearch(val)
    setPage(0)
  }

  const handleImport = async () => {
    const template = await importTemplate()
    if (template) {
      setActiveTab('my templates')
    }
  }

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Top Bar */}
      <div
        className="h-14 flex items-center justify-between px-6 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {/* Left — Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'var(--primary)' }}
          >
            A
          </div>
          <span className="font-bold text-base" style={{ color: 'var(--text)' }}>
            Acces <span style={{ color: 'var(--primary)' }}>Studio</span>
          </span>
        </div>

        {/* Center — Search + Actions */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="input text-xs w-48"
            style={{ height: 34 }}
          />
          <button
            onClick={handleImport}
            className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg transition-all duration-150"
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          >
            ⬆ Import Template
          </button>
          <button
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg transition-all duration-150"
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          >
            📖 Build a Template
          </button>
        </div>

        {/* Right */}
        <div style={{ width: 120 }} />
      </div>

      {/* Hero */}
      <div className="px-8 pt-6 pb-4 shrink-0">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
          What are you creating today?
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Pick a template and your video builds itself — no timeline, no complexity.
        </p>
      </div>

      {/* Tabs */}
      <div className="px-8 mb-4 flex items-center gap-1 shrink-0">
        {['templates', 'my templates'].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(0) }}
            className="px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-150"
            style={{
              background: activeTab === tab ? 'var(--primary)' : 'var(--panel)',
              color: activeTab === tab ? '#fff' : 'var(--muted)',
              border: `1px solid ${activeTab === tab ? 'var(--primary)' : 'var(--border)'}`,
            }}
          >
            {tab === 'templates' ? '✦ Templates' : `📦 My Templates${userTemplates.length > 0 ? ` (${userTemplates.length})` : ''}`}
          </button>
        ))}
        {activeTab === 'templates' && (
          <span className="text-xs ml-3" style={{ color: 'var(--muted)' }}>
            {filtered.length} available
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-8 overflow-hidden">
        {activeTab === 'templates' && (
          <>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--muted)' }}>
                <span className="text-4xl mb-4">🔍</span>
                <p className="text-sm">No templates found for "{search}"</p>
              </div>
            ) : (
              <div
                className="grid gap-4 h-full"
                style={{
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(2, 1fr)',
                }}
              >
                {paginated.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isHovered={hoveredId === template.id}
                    onHover={setHoveredId}
                    onSelect={onTemplateSelect}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'my templates' && (
          <TemplateManager
            userTemplates={userTemplates}
            loading={loading}
            error={error}
            onImport={handleImport}
            onDelete={deleteTemplate}
            onUpdate={updateTemplate}
            onSelect={onTemplateSelect}
          />
        )}
      </div>

      {/* Pagination + Footer */}
      <div
        className="h-12 flex items-center justify-between px-8 shrink-0"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          Acces Studio v1.0.0 — Free & Open Source
        </span>

        {activeTab === 'templates' && totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all"
              style={{
                background: page === 0 ? 'var(--panel)' : 'var(--primary)',
                color: page === 0 ? 'var(--muted)' : '#fff',
                border: `1px solid ${page === 0 ? 'var(--border)' : 'var(--primary)'}`,
                cursor: page === 0 ? 'not-allowed' : 'pointer',
                opacity: page === 0 ? 0.5 : 1,
              }}
            >
              ←
            </button>
            <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all"
              style={{
                background: page === totalPages - 1 ? 'var(--panel)' : 'var(--primary)',
                color: page === totalPages - 1 ? 'var(--muted)' : '#fff',
                border: `1px solid ${page === totalPages - 1 ? 'var(--border)' : 'var(--primary)'}`,
                cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer',
                opacity: page === totalPages - 1 ? 0.5 : 1,
              }}
            >
              →
            </button>
          </div>
        )}

        <span className="text-xs" style={{ color: 'var(--muted)' }}> Offline Ready</span>
      </div>

      {/* Template Guide Modal */}
      {showGuide && <TemplateGuide onClose={() => setShowGuide(false)} />}
    </div>
  )
}