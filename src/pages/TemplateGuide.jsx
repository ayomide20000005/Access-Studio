import { useState } from 'react'

const prompt = `You are helping me build a custom video template for Acces Studio — a no-code desktop video creation app built with Electron, React, and Remotion.

Here is how Acces Studio templates work:

FOLDER STRUCTURE:
my-template/
  index.js                  ← Remotion entry point that registers the composition
  MyComposition.jsx         ← The actual Remotion composition
  template.config.json      ← Config file that defines the input fields
  preview.png               ← A screenshot of the template (optional)

TEMPLATE CONFIG FORMAT (template.config.json):
{
  "id": "my-template",
  "name": "My Template",
  "description": "What this template does",
  "version": "1.0.0",
  "author": "Your Name",
  "composition": "MyComposition",
  "fields": [
    { "key": "title", "label": "Title", "type": "text", "placeholder": "e.g. Your Title", "required": true },
    { "key": "description", "label": "Description", "type": "textarea", "placeholder": "e.g. Your Description" },
    { "key": "primaryColor", "label": "Primary Color", "type": "color", "default": "#7C3AED" },
    { "key": "launchDate", "label": "Launch Date", "type": "date" },
    { "key": "logoPath", "label": "Logo", "type": "image" },
    { "key": "backgroundVideo", "label": "Background Video", "type": "video" },
    { "key": "backgroundMusic", "label": "Background Music", "type": "audio" },
    { "key": "showSubtitle", "label": "Show Subtitle", "type": "toggle", "default": true },
    { "key": "animationSpeed", "label": "Animation Speed", "type": "slider", "min": 0.5, "max": 3, "step": 0.1, "default": 1 },
    { "key": "features", "label": "Features", "type": "list", "placeholder": "Add a feature" },
    { "key": "fontFamily", "label": "Font", "type": "font" },
    { "key": "count", "label": "Count", "type": "number", "placeholder": "e.g. 10" }
  ],
  "styles": {
    "mood": ["Energetic", "Calm", "Professional"],
    "pace": ["Fast", "Medium", "Slow"]
  }
}

AVAILABLE FIELD TYPES:
- text — single line text input
- textarea — multi line text input
- color — color picker
- date — date picker
- image — image file upload
- video — video file upload
- audio — audio file upload
- toggle — on/off switch
- slider — number range slider
- list — multi item list
- font — font family picker
- number — number input
- select — dropdown with options

HOW THE REMOTION COMPOSITION RECEIVES PROPS:
All field values are passed directly as props to your composition. For example if you have a field with key "title" then your composition receives it as:
const MyComposition = ({ title, primaryColor, logoPath }) => { ... }

The composition must also handle these default style props that Acces Studio passes automatically:
- fontFamily
- Any styles defined in the "styles" section of config

Now please help me build a complete Acces Studio template. I want a template for:`

export default function TemplateGuide({ onClose }) {
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'structure', label: 'Folder Structure' },
    { id: 'config', label: 'Config File' },
    { id: 'fields', label: 'Field Types' },
    { id: 'prompt', label: 'AI Prompt' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-8" style={{ pointerEvents: 'none' }}>
        <div
          className="w-full max-w-3xl rounded-2xl flex flex-col overflow-hidden"
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
                Build a Template
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                Everything you need to create a custom Acces Studio template
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'var(--panel)', color: 'var(--muted)' }}
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div
            className="flex items-center gap-1 px-6 py-3 shrink-0"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className="text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: activeSection === s.id ? 'var(--primary)' : 'var(--panel)',
                  color: activeSection === s.id ? '#fff' : 'var(--muted)',
                  border: `1px solid ${activeSection === s.id ? 'var(--primary)' : 'var(--border)'}`,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Body */}
          <div
            className="flex-1 px-6 py-5"
            style={{ overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}
          >
            {activeSection === 'overview' && (
              <div className="flex flex-col gap-4">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                  Acces Studio templates are Remotion compositions packaged in a folder with a config file. Anyone can build one — you do not need to know Remotion deeply. You can use an AI to generate the full template for you.
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: '📁', title: 'Create a folder', desc: 'Your template lives in a single folder with a few files inside.' },
                    { icon: '⚙️', title: 'Add a config file', desc: 'A template.config.json file tells Acces Studio what input fields to show.' },
                    { icon: '🎬', title: 'Write the composition', desc: 'A Remotion composition that receives the user inputs as props and renders the video.' },
                    { icon: '📦', title: 'Import into Acces Studio', desc: 'Drop the folder into Acces Studio via the Import Template button. Done.' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-xl"
                      style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}
                    >
                      <span className="text-2xl shrink-0">{item.icon}</span>
                      <div>
                        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>{item.title}</p>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'structure' && (
              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Your template folder should look like this:</p>
                <div
                  className="rounded-xl p-4 font-mono text-sm"
                  style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)', lineHeight: 2 }}
                >
                  <div>📁 my-template/</div>
                  <div style={{ paddingLeft: 24 }}>📄 index.js <span style={{ color: 'var(--muted)', fontSize: 11 }}>← Remotion entry point</span></div>
                  <div style={{ paddingLeft: 24 }}>📄 MyComposition.jsx <span style={{ color: 'var(--muted)', fontSize: 11 }}>← The actual composition</span></div>
                  <div style={{ paddingLeft: 24 }}>📄 template.config.json <span style={{ color: 'var(--muted)', fontSize: 11 }}>← Required config file</span></div>
                  <div style={{ paddingLeft: 24 }}>🖼 preview.png <span style={{ color: 'var(--muted)', fontSize: 11 }}>← Optional preview image</span></div>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  If you do not include a template.config.json file, Acces Studio will try to detect the fields automatically from your composition code.
                </p>
              </div>
            )}

            {activeSection === 'config' && (
              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: 'var(--muted)' }}>The template.config.json file defines everything about your template:</p>
                <div
                  className="rounded-xl p-4 font-mono text-xs overflow-x-auto"
                  style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)', lineHeight: 1.8 }}
                >
                  <pre>{`{
  "id": "my-template",
  "name": "My Template",
  "description": "What this template does",
  "version": "1.0.0",
  "author": "Your Name",
  "composition": "MyComposition",
  "fields": [
    {
      "key": "title",
      "label": "Title",
      "type": "text",
      "placeholder": "e.g. Your Title",
      "required": true
    },
    {
      "key": "primaryColor",
      "label": "Primary Color",
      "type": "color",
      "default": "#7C3AED"
    }
  ],
  "styles": {
    "mood": ["Energetic", "Calm", "Professional"],
    "pace": ["Fast", "Medium", "Slow"]
  }
}`}</pre>
                </div>
              </div>
            )}

            {activeSection === 'fields' && (
              <div className="flex flex-col gap-3">
                <p className="text-sm" style={{ color: 'var(--muted)' }}>These are all the field types you can use in your config:</p>
                {[
                  { type: 'text', desc: 'Single line text input', example: 'Title, Name, Tagline' },
                  { type: 'textarea', desc: 'Multi line text input', example: 'Description, Bio, Steps' },
                  { type: 'color', desc: 'Color picker with hex input', example: 'Primary Color, Background' },
                  { type: 'date', desc: 'Date picker', example: 'Launch Date, Event Date' },
                  { type: 'number', desc: 'Number input', example: 'Count, Year, Score' },
                  { type: 'image', desc: 'Image file upload', example: 'Logo, Photo, Background Image' },
                  { type: 'video', desc: 'Video file upload', example: 'Background Video, Footage' },
                  { type: 'audio', desc: 'Audio file upload', example: 'Background Music, Voiceover' },
                  { type: 'toggle', desc: 'On/off switch', example: 'Show Subtitle, Enable Animation' },
                  { type: 'slider', desc: 'Number range slider', example: 'Opacity, Speed, Size' },
                  { type: 'list', desc: 'Multi item list', example: 'Features, Team Members, Steps' },
                  { type: 'font', desc: 'Font family picker', example: 'Title Font, Body Font' },
                  { type: 'select', desc: 'Dropdown with options', example: 'Platform, Category, Style' },
                ].map((field, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-center gap-3">
                      <code
                        className="text-xs px-2 py-1 rounded"
                        style={{ background: '#7C3AED22', color: 'var(--primary)', fontFamily: 'monospace' }}
                      >
                        {field.type}
                      </code>
                      <span className="text-xs" style={{ color: 'var(--text)' }}>{field.desc}</span>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>{field.example}</span>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'prompt' && (
              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  Copy this prompt and paste it into Claude, ChatGPT or any AI. Tell it what type of template you want and it will generate the full template for you — ready to import into Acces Studio.
                </p>
                <div
                  className="rounded-xl p-4 text-xs font-mono leading-relaxed"
                  style={{
                    background: 'var(--panel)',
                    border: '1px solid var(--border)',
                    color: 'var(--muted)',
                    whiteSpace: 'pre-wrap',
                    maxHeight: 300,
                    overflowY: 'auto',
                  }}
                >
                  {prompt}
                </div>
                <button
                  onClick={handleCopy}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all glow"
                  style={{ background: copied ? '#22C55E' : 'var(--primary)' }}
                >
                  {copied ? '✅ Copied to Clipboard' : '📋 Copy Prompt'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}