import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { TextLayer } from '../remotion/components/TextLayer'
import { ImageLayer } from '../remotion/components/ImageLayer'

export const DemoVideo = ({
  productName = 'Your Product',
  tagline = 'The best solution for your needs',
  keyFeatures = 'Feature One, Feature Two, Feature Three',
  callToAction = 'Try it today',
  primaryColor = '#7C3AED',
  secondaryColor = '#4F46E5',
  logoPath = null,
  fontFamily = 'Inter',
  videoStyle = 'Minimal',
  mood = 'Professional',
  animation = 'Smooth',
  background = 'Gradient',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const featuresArray = typeof keyFeatures === 'string'
    ? keyFeatures.split(',').map(f => f.trim()).filter(Boolean)
    : keyFeatures

  const damping = animation === 'Snappy' ? 20 : animation === 'Cinematic' ? 8 : 12
  const springConfig = { damping, stiffness: 100 }

  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start) =>
    spring({ frame: Math.max(0, frame - start), fps, from: 50, to: 0, config: springConfig })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const getBackground = () => {
    if (background === 'Dark') return '#0F0F0F'
    if (background === 'Light') return '#F5F5F5'
    if (videoStyle === 'Bold') return `linear-gradient(135deg, ${primaryColor} 0%, #0F0F0F 60%)`
    if (videoStyle === 'Corporate') return `linear-gradient(180deg, #0A0A0F 0%, #1A1A2E 100%)`
    if (videoStyle === 'Playful') return `linear-gradient(135deg, ${primaryColor}66 0%, ${secondaryColor}44 100%)`
    return `radial-gradient(ellipse at 20% 50%, ${primaryColor}33 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, ${secondaryColor}22 0%, transparent 60%)`
  }

  const titleSize = videoStyle === 'Bold' ? 96 : videoStyle === 'Playful' ? 72 : 80
  const moodColor = mood === 'Energetic' ? primaryColor : mood === 'Calm' ? '#60A5FA' : mood === 'Exciting' ? '#F59E0B' : '#FFFFFF'

  return (
    <AbsoluteFill style={{ background: getBackground(), fontFamily, opacity: outroOpacity }}>
      {logoPath && (
        <div style={{ position: 'absolute', top: 60, left: 60, opacity: fadeIn(0, 20) }}>
          <ImageLayer src={logoPath} style={{ width: 100, height: 'auto' }} />
        </div>
      )}

      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 100 }}>
        <TextLayer
          text={productName}
          style={{
            fontSize: titleSize,
            fontWeight: 800,
            color: background === 'Light' ? '#0F0F0F' : '#FFFFFF',
            opacity: fadeIn(0, 20),
            transform: `translateY(${slideUp(0)}px)`,
            textAlign: 'center',
            marginBottom: 20,
            letterSpacing: '-2px',
          }}
        />

        <TextLayer
          text={tagline}
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: moodColor,
            opacity: fadeIn(15, 35),
            transform: `translateY(${slideUp(15)}px)`,
            textAlign: 'center',
            marginBottom: 60,
          }}
        />

        <div style={{ display: 'flex', gap: 24, marginBottom: 60, flexWrap: 'wrap', justifyContent: 'center' }}>
          {featuresArray.map((feature, i) => (
            <div
              key={i}
              style={{
                background: `${primaryColor}22`,
                border: `1px solid ${primaryColor}44`,
                borderRadius: 12,
                padding: '12px 24px',
                color: background === 'Light' ? '#0F0F0F' : '#FFFFFF',
                fontSize: 18,
                fontWeight: 500,
                opacity: interpolate(frame, [30 + i * 8, 50 + i * 8], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                transform: `translateY(${spring({ frame: Math.max(0, frame - (30 + i * 8)), fps, from: 30, to: 0, config: springConfig })}px)`,
              }}
            >
              ✓ {feature}
            </div>
          ))}
        </div>

        <div
          style={{
            background: primaryColor,
            borderRadius: 50,
            padding: '16px 48px',
            color: '#FFFFFF',
            fontSize: 22,
            fontWeight: 700,
            opacity: fadeIn(50, 70),
            transform: `translateY(${slideUp(50)}px)`,
          }}
        >
          {callToAction} →
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

export default DemoVideo