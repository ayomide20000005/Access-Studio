import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { TextLayer } from '../remotion/components/TextLayer'
import { ImageLayer } from '../remotion/components/ImageLayer'

export const PitchDeckVideo = ({
  companyName = 'Your Company',
  problem = 'The problem we solve',
  solution = 'Our unique solution',
  marketSize = '$1B Market',
  team = 'World class team',
  ask = 'Raising $500K',
  primaryColor = '#7C3AED',
  secondaryColor = '#4F46E5',
  logoPath = null,
  fontFamily = 'Inter',
  tone = 'Confident',
  style = 'Startup',
  pace = 'Medium',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const damping = pace === 'Fast' ? 20 : pace === 'Slow' ? 8 : 12

  const slides = [
    { label: 'Company', content: companyName, icon: '🏢', big: true },
    { label: 'Problem', content: problem, icon: '⚠️' },
    { label: 'Solution', content: solution, icon: '💡' },
    { label: 'Market Size', content: marketSize, icon: '📊' },
    { label: 'Team', content: team, icon: '👥' },
    { label: 'The Ask', content: ask, icon: '🤝' },
  ]

  const framesPerSlide = Math.floor(durationInFrames / slides.length)
  const currentSlide = Math.min(Math.floor(frame / framesPerSlide), slides.length - 1)
  const slideFrame = frame % framesPerSlide

  const fadeIn = (start, end) =>
    interpolate(slideFrame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start) =>
    spring({ frame: Math.max(0, slideFrame - start), fps, from: 40, to: 0, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const toneColor = tone === 'Inspiring' ? '#F59E0B' : tone === 'Data Driven' ? '#0891B2' : tone === 'Storytelling' ? '#EC4899' : primaryColor

  const getBg = () => {
    if (style === 'Corporate') return `linear-gradient(180deg, #0A0A14 0%, #14141F 100%)`
    if (style === 'Minimal') return '#0F0F0F'
    if (style === 'Bold') return `linear-gradient(135deg, ${primaryColor}22 0%, #0A0A14 50%)`
    return '#0A0A14'
  }

  const slide = slides[currentSlide]

  return (
    <AbsoluteFill style={{ background: getBg(), fontFamily, opacity: outroOpacity }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at top left, ${toneColor}22 0%, transparent 50%)` }} />

      <div style={{ position: 'absolute', top: 40, right: 60, color: '#444', fontSize: 16, fontWeight: 500 }}>
        {currentSlide + 1} / {slides.length}
      </div>

      {logoPath && (
        <div style={{ position: 'absolute', top: 40, left: 60, opacity: 0.8 }}>
          <ImageLayer src={logoPath} style={{ width: 80, height: 'auto' }} />
        </div>
      )}

      <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
        {slides.map((_, i) => (
          <div key={i} style={{ width: i === currentSlide ? 24 : 8, height: 8, borderRadius: 4, background: i === currentSlide ? toneColor : '#333' }} />
        ))}
      </div>

      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 120 }}>
        <div style={{ fontSize: slide.big ? 80 : 60, marginBottom: 24, opacity: fadeIn(0, 15) }}>{slide.icon}</div>
        <div style={{ color: toneColor, fontSize: 18, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', opacity: fadeIn(0, 20), marginBottom: 20 }}>
          {slide.label}
        </div>
        <TextLayer
          text={slide.content}
          style={{ fontSize: slide.big ? 80 : 48, fontWeight: slide.big ? 800 : 600, color: '#FFFFFF', opacity: fadeIn(10, 30), transform: `translateY(${slideUp(10)}px)`, textAlign: 'center', lineHeight: 1.2 }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

export default PitchDeckVideo