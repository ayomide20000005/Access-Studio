import { useState, useEffect, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import Canvas from '../components/Canvas'

const templateFields = {
  'demo-video': [
    { key: 'productName', label: 'Product Name', type: 'text', placeholder: 'e.g. Acces Studio' },
    { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'e.g. Create videos in minutes' },
    { key: 'keyFeatures', label: 'Key Features', type: 'textarea', placeholder: 'e.g. No code, Offline, Fast' },
    { key: 'callToAction', label: 'Call to Action', type: 'text', placeholder: 'e.g. Try it today' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color' },
    { key: 'secondaryColor', label: 'Secondary Color', type: 'color' },
  ],
  'product-launch': [
    { key: 'productName', label: 'Product Name', type: 'text', placeholder: 'e.g. iPhone 16' },
    { key: 'launchDate', label: 'Launch Date', type: 'text', placeholder: 'e.g. January 1, 2025' },
    { key: 'keyBenefits', label: 'Key Benefits', type: 'textarea', placeholder: 'e.g. Faster, Smarter, Better' },
    { key: 'price', label: 'Price', type: 'text', placeholder: 'e.g. $99' },
    { key: 'callToAction', label: 'Call to Action', type: 'text', placeholder: 'e.g. Pre-order Now' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color' },
  ],
  'explainer-video': [
    { key: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. How AI works' },
    { key: 'problem', label: 'Problem', type: 'textarea', placeholder: 'e.g. People struggle to understand AI' },
    { key: 'solution', label: 'Solution', type: 'textarea', placeholder: 'e.g. We break it down simply' },
    { key: 'howItWorks', label: 'How It Works', type: 'textarea', placeholder: 'e.g. Step 1, Step 2, Step 3' },
    { key: 'callToAction', label: 'Call to Action', type: 'text', placeholder: 'e.g. Learn More' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color' },
  ],
  'promotional-video': [
    { key: 'brandName', label: 'Brand Name', type: 'text', placeholder: 'e.g. Nike' },
    { key: 'offer', label: 'Offer', type: 'text', placeholder: 'e.g. Summer Sale' },
    { key: 'discount', label: 'Discount', type: 'text', placeholder: 'e.g. 50% OFF' },
    { key: 'expiryDate', label: 'Expiry Date', type: 'text', placeholder: 'e.g. Ends Sunday' },
    { key: 'callToAction', label: 'Call to Action', type: 'text', placeholder: 'e.g. Shop Now' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color' },
  ],
  'tutorial-video': [
    { key: 'tutorialTitle', label: 'Tutorial Title', type: 'text', placeholder: 'e.g. How to use Figma' },
    { key: 'steps', label: 'Steps', type: 'textarea', placeholder: 'e.g. Open Figma, Create frame, Add elements' },
    { key: 'tips', label: 'Pro Tip', type: 'text', placeholder: 'e.g. Always save your work' },
    { key: 'callToAction', label: 'Call to Action', type: 'text', placeholder: 'e.g. Watch Full Tutorial' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color' },
  ],
  'intro-outro': [
    { key: 'channelName', label: 'Channel Name', type: 'text', placeholder: 'e.g. My Channel' },
    { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'e.g. Subscribe for more' },
    { key: 'socialLinks', label: 'Social Links', type: 'textarea', placeholder: 'e.g. @mychannel' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color' },
  ],
  'social-media-clip': [
    { key: 'caption', label: 'Caption', type: 'textarea', placeholder: 'e.g. This changed everything...' },
    { key: 'hashtags', label: 'Hashtags', type: 'text', placeholder: 'e.g. #viral #trending #fyp' },
    { key: 'platform', label: 'Platform', type: 'select', options: ['tiktok', 'instagram', 'twitter', 'youtube', 'linkedin'] },
    { key: 'callToAction', label: 'Call to Action', type: 'text', placeholder: 'e.g. Follow for more' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color' },
  ],
  'pitch-deck-video': [
    { key: 'companyName', label: 'Company Name', type: 'text', placeholder: 'e.g. Acces Studio' },
    { key: 'problem', label: 'Problem', type: 'textarea', placeholder: 'e.g. Video creation is too complex' },
    { key: 'solution', label: 'Solution', type: 'textarea', placeholder: 'e.g. No-code offline video studio' },
    { key: 'marketSize', label: 'Market Size', type: 'text', placeholder: 'e.g. $5B Market' },
    { key: 'team', label: 'Team', type: 'text', placeholder: 'e.g. 3 experienced founders' },
    { key: 'ask', label: 'The Ask', type: 'text', placeholder: 'e.g. Raising $500K' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color' },
  ],
  'resume-portfolio': [
    { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'e.g. John Doe' },
    { key: 'role', label: 'Role', type: 'text', placeholder: 'e.g. Frontend Developer' },
    { key: 'skills', label: 'Skills', type: 'textarea', placeholder: 'e.g. React, Node.js, Figma' },
    { key: 'experience', label: 'Experience', type: 'text', placeholder: 'e.g. 3+ Years' },
    { key: 'contact', label: 'Contact', type: 'text', placeholder: 'e.g. hello@yourname.com' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color' },
  ],
  'event-announcement': [
    { key: 'eventName', label: 'Event Name', type: 'text', placeholder: 'e.g. Tech Summit 2025' },
    { key: 'date', label: 'Date', type: 'text', placeholder: 'e.g. January 1, 2025' },
    { key: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Lagos, Nigeria' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'e.g. Join us for an amazing event' },
    { key: 'registerLink', label: 'Register Link', type: 'text', placeholder: 'e.g. register.yoursite.com' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color' },
  ],
}

const templateStyles = {
  'demo-video': {
    videoStyle: ['Minimal', 'Bold', 'Corporate', 'Playful'],
    mood: ['Energetic', 'Professional', 'Calm', 'Exciting'],
    animation: ['Smooth', 'Snappy', 'Cinematic'],
    background: ['Gradient', 'Dark', 'Light'],
  },
  'product-launch': {
    launchFeel: ['Hype', 'Premium', 'Clean', 'Dramatic'],
    colorVibe: ['Dark Luxury', 'Bright Pop', 'Monochrome'],
    pace: ['Fast', 'Medium', 'Slow'],
  },
  'explainer-video': {
    style: ['Simple', 'Dynamic', 'Storytelling', 'Technical'],
    tone: ['Friendly', 'Professional', 'Casual', 'Serious'],
    pace: ['Fast', 'Medium', 'Slow'],
  },
  'promotional-video': {
    energy: ['High Energy', 'Moderate', 'Subtle'],
    style: ['Bold', 'Elegant', 'Playful', 'Minimal'],
    emphasis: ['Discount', 'Brand', 'Urgency'],
  },
  'tutorial-video': {
    layout: ['Step by Step', 'Split Screen', 'Minimal'],
    tone: ['Friendly', 'Professional', 'Casual'],
    pace: ['Fast', 'Medium', 'Slow'],
  },
  'intro-outro': {
    type: ['Intro', 'Outro', 'Both'],
    style: ['Minimal', 'Dynamic', 'Cinematic', 'Playful'],
    animation: ['Smooth', 'Snappy', 'Bounce'],
  },
  'social-media-clip': {
    format: ['Square', 'Vertical', 'Horizontal'],
    style: ['Bold', 'Minimal', 'Trendy', 'Clean'],
    energy: ['High', 'Medium', 'Chill'],
  },
  'pitch-deck-video': {
    tone: ['Confident', 'Storytelling', 'Data Driven', 'Inspiring'],
    style: ['Corporate', 'Startup', 'Minimal', 'Bold'],
    pace: ['Fast', 'Medium', 'Slow'],
  },
  'resume-portfolio': {
    layout: ['Centered', 'Split', 'Timeline'],
    tone: ['Professional', 'Creative', 'Minimal'],
    style: ['Bold', 'Clean', 'Elegant'],
  },
  'event-announcement': {
    vibe: ['Exciting', 'Formal', 'Casual', 'Luxury'],
    style: ['Minimal', 'Bold', 'Cinematic'],
    pace: ['Fast', 'Medium', 'Slow'],
  },
}

const defaultInputs = (fields) => {
  const defaults = { duration: 10 }
  fields.forEach(f => {
    if (f.type === 'color') defaults[f.key] = '#7C3AED'
    else defaults[f.key] = ''
  })
  return defaults
}

const defaultStyles = (styles) => {
  const defaults = {}
  Object.keys(styles).forEach(key => {
    defaults[key] = styles[key][0]
  })
  return defaults
}

export default function Editor({ template, projectData, onProjectUpdate, onExport, onHome, theme }) {
  const fields = templateFields[template?.id] || []
  const styles = templateStyles[template?.id] || {}
  const [inputs, setInputs] = useState(defaultInputs(fields))
  const [selectedStyles, setSelectedStyles] = useState(defaultStyles(styles))
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showTimeline, setShowTimeline] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('acces-brand-kit')
      if (saved) {
        const brand = JSON.parse(saved)
        setInputs(prev => ({
          ...prev,
          primaryColor: brand.primaryColor || prev.primaryColor,
          secondaryColor: brand.secondaryColor || prev.secondaryColor,
        }))
      }
    } catch {}
  }, [])

  // Push inputs and selectedStyles up to App every time they change
  useEffect(() => {
    if (onProjectUpdate) {
      onProjectUpdate(inputs, selectedStyles)
    }
  }, [inputs, selectedStyles])

  const handleInputChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }))
  }

  const handleStyleChange = (key, value) => {
    setSelectedStyles(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Top bar */}
      <div
        className="h-12 flex items-center justify-between px-6 shrink-0"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      >
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onHome}
            className="text-xs flex items-center gap-1 transition-colors"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
          >
            ← Home
          </button>
          <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>
            {template?.icon} {template?.name}
          </span>
        </div>

        {/* Center */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: showTimeline ? '#7C3AED22' : 'var(--panel)',
              border: `1px solid ${showTimeline ? 'var(--primary)' : 'var(--border)'}`,
              color: showTimeline ? 'var(--primary)' : 'var(--muted)',
            }}
          >
            ⏱ Timeline
          </button>
          <button
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            💾 Save
          </button>
          <button
            onClick={onExport}
            className="text-xs px-4 py-1.5 rounded-lg font-semibold text-white glow transition-all"
            style={{ background: 'var(--primary)' }}
          >
            ⬇ Export
          </button>
        </div>

        {/* Right — Window controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => window.electron.minimize()}
            className="w-3 h-3 rounded-full transition-opacity hover:opacity-70"
            style={{ background: '#F59E0B' }}
            title="Minimize"
          />
          <button
            onClick={() => window.electron.maximize()}
            className="w-3 h-3 rounded-full transition-opacity hover:opacity-70"
            style={{ background: '#22C55E' }}
            title="Maximize"
          />
          <button
            onClick={() => window.electron.close()}
            className="w-3 h-3 rounded-full transition-opacity hover:opacity-70"
            style={{ background: '#DC2626' }}
            title="Close"
          />
        </div>
      </div>

      {/* Main split pane */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          template={template}
          fields={fields}
          inputs={inputs}
          onInputChange={handleInputChange}
          styles={styles}
          selectedStyles={selectedStyles}
          onStyleChange={handleStyleChange}
        />
        <Canvas
          template={template}
          inputs={inputs}
          selectedStyles={selectedStyles}
          isPlaying={isPlaying}
          currentTime={currentTime}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onTimeChange={setCurrentTime}
          showTimeline={showTimeline}
        />
      </div>
    </div>
  )
}