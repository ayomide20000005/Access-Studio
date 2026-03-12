import { useState } from 'react'

const aiPrompt = `You are helping me build a custom video template for Acces Studio — a free, offline, no-code desktop video creation app built with Electron, React, and Remotion.

IMPORTANT: Acces Studio already has these packages installed. Your template must ONLY use these — no npm install needed:
- remotion (core) — useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Sequence, Audio, Video, Img, staticFile
- @remotion/transitions — TransitionSeries, linearTiming, springTiming + transitions: fade, slide, wipe, flip, clockWipe, none
- @remotion/shapes — Triangle, Circle, Rect, Star, Ellipse
- @remotion/paths — evolvePath, getLength, getPointAtLength
- @remotion/google-fonts — loadFont
- @remotion/captions — Caption component for subtitles
- @remotion/media-utils — getVideoMetadata, getAudioData
- react (18) — useState, useEffect, useRef, useMemo, useCallback
- framer-motion — motion components and animations
- gsap — GreenSock animation library
- animejs — anime.js animations
- d3 — data visualization

FOLDER STRUCTURE (create exactly this):
my-template/
  index.js                    ← Remotion entry point
  Root.jsx                    ← Registers the composition
  Composition.jsx             ← The actual animation
  template.config.json        ← Fields and styles config
  preview.png                 ← Optional screenshot

index.js MUST look exactly like this:
\`\`\`javascript
import { registerRoot } from 'remotion'
import { Root } from './Root'
registerRoot(Root)
\`\`\`

Root.jsx MUST look exactly like this:
\`\`\`jsx
import { Composition } from 'remotion'
import { MyComposition } from './Composition'

export const Root = () => {
  return (
    <Composition
      id="MyComposition"
      component={MyComposition}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        // all your default prop values here
      }}
    />
  )
}
\`\`\`

Composition.jsx receives ALL field values as props directly:
\`\`\`jsx
export const MyComposition = ({
  title = 'Default Title',
  primaryColor = '#7C3AED',
  // ... all fields from config
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames, width, height } = useVideoConfig()
  // your animation logic here
}
\`\`\`

template.config.json format:
\`\`\`json
{
  "id": "my-template",
  "name": "My Template",
  "description": "What this template does",
  "version": "1.0.0",
  "author": "Your Name",
  "composition": "MyComposition",
  "fields": [
    { "key": "title", "label": "Title", "type": "text", "placeholder": "e.g. Your Title", "required": true },
    { "key": "description", "label": "Description", "type": "textarea", "placeholder": "e.g. Description" },
    { "key": "primaryColor", "label": "Primary Color", "type": "color", "default": "#7C3AED" },
    { "key": "logoPath", "label": "Logo", "type": "image" },
    { "key": "backgroundMusic", "label": "Music", "type": "audio" },
    { "key": "backgroundVideo", "label": "Background Video", "type": "video" },
    { "key": "launchDate", "label": "Date", "type": "date" },
    { "key": "count", "label": "Count", "type": "number", "min": 0, "max": 100 },
    { "key": "showSubtitle", "label": "Show Subtitle", "type": "toggle", "default": true },
    { "key": "animationSpeed", "label": "Speed", "type": "slider", "min": 0.5, "max": 3, "step": 0.1, "default": 1 },
    { "key": "features", "label": "Features", "type": "list", "placeholder": "Add feature" },
    { "key": "fontFamily", "label": "Font", "type": "font" },
    { "key": "platform", "label": "Platform", "type": "select", "options": ["instagram", "tiktok", "youtube"] },
    { "key": "transitionType", "label": "Transition", "type": "transition" },
    { "key": "subtitles", "label": "Subtitles", "type": "caption" }
  ],
  "styles": {
    "mood": ["Energetic", "Calm", "Professional"],
    "pace": ["Fast", "Medium", "Slow"]
  }
}
\`\`\`

AVAILABLE FIELD TYPES:
text, textarea, color, date, number, image, video, audio, toggle, slider, list, font, select, transition, caption

Now please help me build a complete Acces Studio template. I want a template for:`

const convertPrompt = `You are helping me convert an existing Remotion template to Acces Studio format.

Acces Studio is a free, offline, no-code desktop video creation app. Here is what you must do:

1. Read the template code I will paste below
2. Identify every hardcoded value — text, colors, numbers, image paths, font names
3. Turn each one into a field in template.config.json using the correct field type
4. Rewrite Composition.jsx to receive all those values as props instead of hardcoding them
5. Create a proper index.js and Root.jsx following the exact Acces Studio format
6. Only use packages already installed in Acces Studio:
   - remotion (core), @remotion/transitions, @remotion/shapes, @remotion/paths
   - @remotion/google-fonts, @remotion/captions, @remotion/media-utils
   - react (18), framer-motion, gsap, animejs, d3

Output exactly these 4 files:
- index.js
- Root.jsx
- Composition.jsx
- template.config.json

Available field types: text, textarea, color, date, number, image, video, audio, toggle, slider, list, font, select, transition, caption

Here is the template code to convert:`

export default function TemplateGuide({ onClose }) {
  const [copied, setCopied] = useState(false)
  const [copiedConvert, setCopiedConvert] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')

  const handleCopy = () => {
    navigator.clipboard.writeText(aiPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyConvert = () => {
    navigator.clipboard.writeText(convertPrompt)
    setCopiedConvert(true)
    setTimeout(() => setCopiedConvert(false), 2000)
  }

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'structure', label: 'Folder Structure' },
    { id: 'config', label: 'Config File' },
    { id: 'fields', label: 'Field Types' },
    { id: 'converting', label: 'Convert Template' },
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
                Everything you need to create or convert a template for Acces Studio
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
            className="flex items-center gap-1 px-6 py-3 shrink-0 flex-wrap"
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
            style={{ overflowY: 'auto', overflowX: 'hidden' }}
          >
            {activeSection === 'overview' && (
              <div className="flex flex-col gap-4">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                  Acces Studio templates are Remotion compositions packaged in a folder. No npm install needed — all dependencies come from Acces Studio itself. Build one from scratch or convert any existing Remotion template using AI.
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: '📁', title: 'Create a folder', desc: 'Your template lives in a folder with 4 files — index.js, Root.jsx, Composition.jsx, and template.config.json.' },
                    { icon: '⚙️', title: 'Define your fields', desc: 'The config file tells Acces Studio what inputs to show — text, color, image, video, audio, toggle, slider and more.' },
                    { icon: '🎬', title: 'Write the animation', desc: 'A Remotion composition that uses useCurrentFrame, interpolate, spring and all installed packages to create the animation.' },
                    { icon: '📦', title: 'Import into Acces Studio', desc: 'Drop the folder into Acces Studio via Import Template. Fields appear automatically. No code needed to use it.' },
                    { icon: '🔄', title: 'Convert existing templates', desc: 'Found a Remotion template online? Copy the code, paste into the AI prompt and it converts it to Acces Studio format automatically.' },
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
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Your template folder must look exactly like this:</p>
                <div
                  className="rounded-xl p-4 font-mono text-sm"
                  style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)', lineHeight: 2 }}
                >
                  <div>📁 my-template/</div>
                  <div style={{ paddingLeft: 24 }}>📄 index.js <span style={{ color: 'var(--muted)', fontSize: 11 }}>← registerRoot entry point</span></div>
                  <div style={{ paddingLeft: 24 }}>📄 Root.jsx <span style={{ color: 'var(--muted)', fontSize: 11 }}>← registers Composition with fps, size, duration</span></div>
                  <div style={{ paddingLeft: 24 }}>📄 Composition.jsx <span style={{ color: 'var(--muted)', fontSize: 11 }}>← the actual animation logic</span></div>
                  <div style={{ paddingLeft: 24 }}>📄 template.config.json <span style={{ color: 'var(--muted)', fontSize: 11 }}>← fields and styles config</span></div>
                  <div style={{ paddingLeft: 24 }}>🖼 preview.png <span style={{ color: 'var(--muted)', fontSize: 11 }}>← optional preview image</span></div>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{ background: '#7C3AED11', border: '1px solid #7C3AED33' }}
                >
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--primary)' }}>Important</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    Do NOT include node_modules, package.json or any dependencies. Acces Studio provides React, Remotion and all installed packages automatically. Your template only needs the 4 core files.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'config' && (
              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: 'var(--muted)' }}>The template.config.json defines your template name, composition ID and all input fields:</p>
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
                <p className="text-sm" style={{ color: 'var(--muted)' }}>All available field types for your config:</p>
                {[
                  { type: 'text', desc: 'Single line text input', example: 'Title, Name, Tagline' },
                  { type: 'textarea', desc: 'Multi line text input', example: 'Description, Bio, Summary' },
                  { type: 'color', desc: 'Color picker with hex input', example: 'Primary Color, Background' },
                  { type: 'date', desc: 'Date picker', example: 'Launch Date, Event Date' },
                  { type: 'number', desc: 'Number input with min/max', example: 'Count, Year, Score' },
                  { type: 'image', desc: 'Image file upload', example: 'Logo, Photo, Banner' },
                  { type: 'video', desc: 'Video file upload', example: 'Background Video, Footage' },
                  { type: 'audio', desc: 'Audio file upload', example: 'Background Music, Voiceover' },
                  { type: 'toggle', desc: 'On/off switch', example: 'Show Subtitle, Enable Animation' },
                  { type: 'slider', desc: 'Range slider with min/max/step', example: 'Opacity, Speed, Size' },
                  { type: 'list', desc: 'Multi item list', example: 'Features, Steps, Team Members' },
                  { type: 'font', desc: 'Font family picker', example: 'Title Font, Body Font' },
                  { type: 'select', desc: 'Dropdown with custom options', example: 'Platform, Category, Style' },
                  { type: 'transition', desc: 'Scene transition picker', example: 'Intro Transition, Scene Change' },
                  { type: 'caption', desc: 'Subtitle with size, color, position', example: 'Subtitles, Captions' },
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

            {activeSection === 'converting' && (
              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: 'var(--text)' }}>
                  Found a Remotion template online? Convert it to Acces Studio format using AI in 4 steps.
                </p>
                {[
                  { step: '1', title: 'Download the template', desc: 'Find any Remotion template on GitHub. Download the folder or copy the composition file contents.' },
                  { step: '2', title: 'Copy the descriptive prompt below', desc: 'Click the Copy Descriptive Prompt button below. This tells the AI exactly how to convert the template to Acces Studio format.' },
                  { step: '3', title: 'Paste into any AI', desc: 'Paste the prompt into Claude, ChatGPT or any AI. Then paste the original template code at the end of the prompt.' },
                  { step: '4', title: 'Import into Acces Studio', desc: 'Save the 4 generated files into a folder and import it using the Import Template button. Fields appear automatically.' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl"
                    style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 text-white"
                      style={{ background: 'var(--primary)' }}
                    >
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>{item.title}</p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}

                {/* Convert prompt */}
                <div className="flex flex-col gap-3 mt-2">
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    Copy this prompt, paste it into any AI, then paste your existing Remotion template code at the end.
                  </p>
                  <div
                    className="rounded-xl p-4 text-xs font-mono leading-relaxed"
                    style={{
                      background: 'var(--panel)',
                      border: '1px solid var(--border)',
                      color: 'var(--muted)',
                      whiteSpace: 'pre-wrap',
                      maxHeight: 200,
                      overflowY: 'auto',
                    }}
                  >
                    {convertPrompt}
                  </div>
                  <button
                    onClick={handleCopyConvert}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all glow"
                    style={{ background: copiedConvert ? '#22C55E' : 'var(--primary)' }}
                  >
                    {copiedConvert ? '✅ Copied to Clipboard' : '📋 Copy Descriptive Prompt'}
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'prompt' && (
              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  Copy this prompt and paste it into any AI. Use it to build a brand new template from scratch for Acces Studio.
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
                  {aiPrompt}
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