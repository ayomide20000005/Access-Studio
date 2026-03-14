// LOCATION: src/pages/Editor.jsx

import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Canvas from '../components/Canvas'
import FieldEditor from '../components/FieldEditor'

const templateFields = {

  // ── Product Launch ──
  'product-launch': [
    { key: 'productName', label: 'Product Name', type: 'text', placeholder: 'e.g. iPhone 16' },
    { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'e.g. The future is here' },
    { key: 'launchDate', label: 'Launch Date', type: 'text', placeholder: 'e.g. March 15, 2025' },
    { key: 'keyBenefits', label: 'Key Benefits', type: 'textarea', placeholder: 'e.g. Faster, Smarter, Better' },
    { key: 'features', label: 'Features', type: 'textarea', placeholder: 'e.g. Feature One, Feature Two, Feature Three' },
    { key: 'price', label: 'Price', type: 'text', placeholder: 'e.g. $99' },
    { key: 'callToAction', label: 'Call to Action', type: 'text', placeholder: 'e.g. Pre-order Now' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color', default: '#14B8A6' },
    { key: 'secondaryColor', label: 'Secondary Color', type: 'color', default: '#6366F1' },
    { key: 'accentColor', label: 'Accent Color', type: 'color', default: '#F59E0B' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color', default: '#06060F' },
    { key: 'fontFamily', label: 'Font', type: 'font' },
  ],

  // ── Demo Video ──
  'demo-video': [
    { key: 'productName', label: 'Product Name', type: 'text', placeholder: 'e.g. Acces Studio' },
    { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'e.g. Create videos in minutes' },
    { key: 'keyFeatures', label: 'Key Features', type: 'textarea', placeholder: 'e.g. No code, Offline, Fast' },
    { key: 'featureDetails', label: 'Feature Details', type: 'textarea', placeholder: 'e.g. Blazing fast, Zero learning curve, Works everywhere' },
    { key: 'callToAction', label: 'Call to Action', type: 'text', placeholder: 'e.g. Try it today' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color', default: '#14B8A6' },
    { key: 'secondaryColor', label: 'Secondary Color', type: 'color', default: '#0EA5E9' },
    { key: 'accentColor', label: 'Accent Color', type: 'color', default: '#6366F1' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color', default: '#050810' },
    { key: 'fontFamily', label: 'Font', type: 'font' },
  ],

  // ── Explainer Video ──
  'explainer-video': [
    { key: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. How AI works' },
    { key: 'problem', label: 'Problem', type: 'textarea', placeholder: 'e.g. People struggle to understand AI' },
    { key: 'solution', label: 'Solution', type: 'textarea', placeholder: 'e.g. We break it down simply' },
    { key: 'howItWorks', label: 'How It Works (Steps)', type: 'textarea', placeholder: 'e.g. Step One, Step Two, Step Three' },
    { key: 'stats', label: 'Stats / Key Points', type: 'textarea', placeholder: 'e.g. 10x faster, 50% cheaper, 99% accurate' },
    { key: 'callToAction', label: 'Call to Action', type: 'text', placeholder: 'e.g. Learn More' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color', default: '#14B8A6' },
    { key: 'secondaryColor', label: 'Secondary Color', type: 'color', default: '#6366F1' },
    { key: 'accentColor', label: 'Accent Color', type: 'color', default: '#F59E0B' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color', default: '#06060F' },
    { key: 'fontFamily', label: 'Font', type: 'font' },
  ],

  // ── Promotional Video ──
  'promotional-video': [
    { key: 'brandName', label: 'Brand Name', type: 'text', placeholder: 'e.g. Nike' },
    { key: 'offer', label: 'Offer', type: 'text', placeholder: 'e.g. Summer Sale' },
    { key: 'discount', label: 'Discount', type: 'text', placeholder: 'e.g. 50% OFF' },
    { key: 'originalPrice', label: 'Original Price', type: 'text', placeholder: 'e.g. $199' },
    { key: 'salePrice', label: 'Sale Price', type: 'text', placeholder: 'e.g. $99' },
    { key: 'expiryText', label: 'Expiry Text', type: 'text', placeholder: 'e.g. Offer ends Sunday' },
    { key: 'benefits', label: 'Benefits', type: 'textarea', placeholder: 'e.g. Free shipping, 30-day returns, 24/7 support' },
    { key: 'callToAction', label: 'Call to Action', type: 'text', placeholder: 'e.g. Shop Now' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color', default: '#EF4444' },
    { key: 'secondaryColor', label: 'Secondary Color', type: 'color', default: '#F59E0B' },
    { key: 'accentColor', label: 'Accent Color', type: 'color', default: '#14B8A6' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color', default: '#0E0800' },
    { key: 'backgroundMusic', label: 'Background Music', type: 'audio' },
    { key: 'fontFamily', label: 'Font', type: 'font' },
  ],

  // ── Tutorial Video ──
  'tutorial-video': [
    { key: 'tutorialTitle', label: 'Tutorial Title', type: 'text', placeholder: 'e.g. How to use Figma' },
    { key: 'instructorName', label: 'Instructor Name', type: 'text', placeholder: 'e.g. John Doe' },
    { key: 'difficulty', label: 'Difficulty', type: 'text', placeholder: 'e.g. Beginner' },
    { key: 'clipDuration', label: 'Duration', type: 'text', placeholder: 'e.g. 10 min' },
    { key: 'steps', label: 'Steps', type: 'textarea', placeholder: 'e.g. Open the app, Configure settings, Export' },
    { key: 'tips', label: 'Pro Tip', type: 'text', placeholder: 'e.g. Always save your work' },
    { key: 'callToAction', label: 'Call to Action', type: 'text', placeholder: 'e.g. Watch Full Tutorial' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color', default: '#6366F1' },
    { key: 'secondaryColor', label: 'Secondary Color', type: 'color', default: '#14B8A6' },
    { key: 'accentColor', label: 'Accent Color', type: 'color', default: '#F59E0B' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color', default: '#0D1117' },
    { key: 'fontFamily', label: 'Font', type: 'font' },
  ],

  // ── Intro Outro ──
  'intro-outro': [
    { key: 'channelName', label: 'Channel Name', type: 'text', placeholder: 'e.g. My Channel' },
    { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'e.g. Subscribe for more' },
    { key: 'niche', label: 'Niche', type: 'text', placeholder: 'e.g. Tech & Innovation' },
    { key: 'socialLinks', label: 'Social Links', type: 'textarea', placeholder: 'e.g. @mychannel, youtube.com/mychannel' },
    { key: 'subscriberCount', label: 'Subscriber Count', type: 'text', placeholder: 'e.g. 100K Subscribers' },
    { key: 'uploadSchedule', label: 'Upload Schedule', type: 'text', placeholder: 'e.g. Every Tuesday' },
    { key: 'callToAction', label: 'Call to Action', type: 'text', placeholder: 'e.g. Subscribe Now' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color', default: '#B8860B' },
    { key: 'secondaryColor', label: 'Secondary Color', type: 'color', default: '#8B6914' },
    { key: 'accentColor', label: 'Accent Color', type: 'color', default: '#D4AF37' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color', default: '#F5F0E8' },
    { key: 'backgroundMusic', label: 'Background Music', type: 'audio' },
    { key: 'fontFamily', label: 'Font', type: 'font' },
  ],

  // ── Social Media Clip ──
  'social-media-clip': [
    { key: 'hookText', label: 'Hook Text', type: 'text', placeholder: 'e.g. Wait for it...' },
    { key: 'revealText', label: 'Reveal Text', type: 'text', placeholder: 'e.g. Mind = Blown 🤯' },
    { key: 'caption', label: 'Caption', type: 'textarea', placeholder: 'e.g. This changed everything for me 🔥' },
    { key: 'subCaption', label: 'Sub Caption', type: 'text', placeholder: 'e.g. You need to try this' },
    { key: 'hashtags', label: 'Hashtags', type: 'textarea', placeholder: 'e.g. #viral, #trending, #fyp' },
    { key: 'brandHandle', label: 'Brand Handle', type: 'text', placeholder: 'e.g. @yourbrand' },
    { key: 'callToAction', label: 'Call to Action', type: 'text', placeholder: 'e.g. Follow for more' },
    { key: 'platform', label: 'Platform', type: 'select', options: ['tiktok', 'instagram', 'youtube', 'twitter', 'linkedin'] },
    { key: 'primaryColor', label: 'Primary Color', type: 'color', default: '#A855F7' },
    { key: 'secondaryColor', label: 'Secondary Color', type: 'color', default: '#EC4899' },
    { key: 'accentColor', label: 'Accent Color', type: 'color', default: '#06B6D4' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color', default: '#130A1E' },
    { key: 'backgroundMusic', label: 'Background Music', type: 'audio' },
    { key: 'fontFamily', label: 'Font', type: 'font' },
  ],

  // ── Pitch Deck Video ──
  'pitch-deck-video': [
    { key: 'companyName', label: 'Company Name', type: 'text', placeholder: 'e.g. Acces Studio' },
    { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'e.g. Changing the way the world works' },
    { key: 'problem', label: 'Problem', type: 'textarea', placeholder: 'e.g. Video creation is too complex' },
    { key: 'solution', label: 'Solution', type: 'textarea', placeholder: 'e.g. No-code offline video studio' },
    { key: 'marketSize', label: 'Market Size', type: 'text', placeholder: 'e.g. $50B' },
    { key: 'marketLabel', label: 'Market Label', type: 'text', placeholder: 'e.g. Total Addressable Market' },
    { key: 'traction', label: 'Traction', type: 'textarea', placeholder: 'e.g. 10K users, $500K ARR, 40% MoM growth' },
    { key: 'teamNames', label: 'Team Members', type: 'textarea', placeholder: 'e.g. Jane Doe — CEO, John Smith — CTO' },
    { key: 'askAmount', label: 'Ask Amount', type: 'text', placeholder: 'e.g. $2M' },
    { key: 'askUse', label: 'Use of Funds', type: 'textarea', placeholder: 'e.g. Product, Growth, Team' },
    { key: 'contactEmail', label: 'Contact Email', type: 'text', placeholder: 'e.g. hello@yourstartup.com' },
    { key: 'callToAction', label: 'Call to Action', type: 'text', placeholder: 'e.g. Lets Talk' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color', default: '#1E3A5F' },
    { key: 'secondaryColor', label: 'Secondary Color', type: 'color', default: '#2563EB' },
    { key: 'accentColor', label: 'Accent Color', type: 'color', default: '#0EA5E9' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color', default: '#C8D4E0' },
    { key: 'fontFamily', label: 'Font', type: 'font' },
  ],

  // ── Resume Portfolio ──
  'resume-portfolio': [
    { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'e.g. John Doe' },
    { key: 'title', label: 'Title / Role', type: 'text', placeholder: 'e.g. Product Designer & Developer' },
    { key: 'bio', label: 'Bio', type: 'textarea', placeholder: 'e.g. I build beautiful digital products' },
    { key: 'skills', label: 'Skills', type: 'textarea', placeholder: 'e.g. UI/UX Design, React, Motion Design' },
    { key: 'experience', label: 'Experience', type: 'text', placeholder: 'e.g. 5+ Years Experience' },
    { key: 'companies', label: 'Companies', type: 'textarea', placeholder: 'e.g. Google, Airbnb, Stripe' },
    { key: 'achievement', label: 'Key Achievement', type: 'text', placeholder: 'e.g. Led team that grew revenue by 300%' },
    { key: 'education', label: 'Education', type: 'text', placeholder: 'e.g. BSc Computer Science, MIT' },
    { key: 'contact', label: 'Contact Email', type: 'text', placeholder: 'e.g. hello@yourname.com' },
    { key: 'portfolioUrl', label: 'Portfolio URL', type: 'text', placeholder: 'e.g. yourname.com' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color', default: '#7C3AED' },
    { key: 'secondaryColor', label: 'Secondary Color', type: 'color', default: '#4F46E5' },
    { key: 'accentColor', label: 'Accent Color', type: 'color', default: '#EC4899' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color', default: '#E8D5C4' },
    { key: 'fontFamily', label: 'Font', type: 'font' },
  ],

  // ── Event Announcement ──
  'event-announcement': [
    { key: 'eventName', label: 'Event Name', type: 'text', placeholder: 'e.g. Summit 2025' },
    { key: 'eventType', label: 'Event Type', type: 'text', placeholder: 'e.g. Conference' },
    { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'e.g. The future starts here' },
    { key: 'date', label: 'Date', type: 'text', placeholder: 'e.g. March 15, 2025' },
    { key: 'time', label: 'Time', type: 'text', placeholder: 'e.g. 9:00 AM — 6:00 PM' },
    { key: 'location', label: 'Location', type: 'text', placeholder: 'e.g. San Francisco, CA' },
    { key: 'venue', label: 'Venue', type: 'text', placeholder: 'e.g. Moscone Center' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'e.g. Join thousands of innovators...' },
    { key: 'speakers', label: 'Speakers', type: 'textarea', placeholder: 'e.g. Jane Doe, John Smith, Sarah Lee' },
    { key: 'highlights', label: 'Highlights', type: 'textarea', placeholder: 'e.g. Keynotes, Workshops, Networking' },
    { key: 'ticketPrice', label: 'Ticket Price', type: 'text', placeholder: 'e.g. From $99' },
    { key: 'registerLink', label: 'Register Link', type: 'text', placeholder: 'e.g. summit2025.com/register' },
    { key: 'callToAction', label: 'Call to Action', type: 'text', placeholder: 'e.g. Get Your Ticket' },
    { key: 'primaryColor', label: 'Primary Color', type: 'color', default: '#C2410C' },
    { key: 'secondaryColor', label: 'Secondary Color', type: 'color', default: '#B45309' },
    { key: 'accentColor', label: 'Accent Color', type: 'color', default: '#0369A1' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color', default: '#E8D4B8' },
    { key: 'backgroundMusic', label: 'Background Music', type: 'audio' },
    { key: 'fontFamily', label: 'Font', type: 'font' },
  ],

}

const templateStyles = {
  'product-launch': {
    launchFeel: ['Hype', 'Premium', 'Clean', 'Dramatic'],
    pace: ['Fast', 'Medium', 'Slow'],
  },
  'demo-video': {
    videoStyle: ['Minimal', 'Bold', 'Corporate', 'Playful'],
    mood: ['Energetic', 'Professional', 'Calm', 'Exciting'],
    animation: ['Smooth', 'Snappy', 'Cinematic'],
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
    vibe: ['Hype', 'Aesthetic', 'Funny', 'Informative'],
  },
  'pitch-deck-video': {
    tone: ['Confident', 'Storytelling', 'Data Driven', 'Inspiring'],
    style: ['Corporate', 'Startup', 'Minimal', 'Bold'],
    pace: ['Fast', 'Medium', 'Slow'],
  },
  'resume-portfolio': {
    layout: ['Centered', 'Split', 'Timeline'],
    tone: ['Professional', 'Creative', 'Bold'],
    style: ['Clean', 'Elegant', 'Minimal'],
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
    if (f.type === 'color') defaults[f.key] = f.default || '#7C3AED'
    else if (f.type === 'toggle') defaults[f.key] = f.default || false
    else if (f.type === 'slider') defaults[f.key] = f.default || f.min || 0
    else if (f.type === 'list') defaults[f.key] = f.default || []
    else defaults[f.key] = f.default || ''
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
  // Support both built-in and custom template fields
  const builtInFields = templateFields[template?.id] || []
  const builtInStyles = templateStyles[template?.id] || {}

  // Custom templates carry their own fields and styles
  const [fields, setFields] = useState(
    template?.isCustom ? (template.fields || []) : builtInFields
  )
  const [styles] = useState(
    template?.isCustom ? (template.styles || {}) : builtInStyles
  )

  const [inputs, setInputs] = useState(defaultInputs(fields))
  const [selectedStyles, setSelectedStyles] = useState(defaultStyles(styles))
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showTimeline, setShowTimeline] = useState(false)
  const [showFieldEditor, setShowFieldEditor] = useState(false)

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

  const handleFieldsSave = async (updatedFields) => {
    setFields(updatedFields)
    setShowFieldEditor(false)

    // If custom template save fields back to config
    if (template?.isCustom && template?.id) {
      try {
        await window.electron.updateTemplate(template.id, { fields: updatedFields })
      } catch {}
    }
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
            onClick={() => setShowFieldEditor(true)}
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
            }}
          >
            ⚙ Edit Fields
          </button>
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
          onEditFields={() => setShowFieldEditor(true)}
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

      {/* Field Editor Modal */}
      {showFieldEditor && (
        <FieldEditor
          fields={fields}
          templateName={template?.name}
          onSave={handleFieldsSave}
          onClose={() => setShowFieldEditor(false)}
        />
      )}
    </div>
  )
}