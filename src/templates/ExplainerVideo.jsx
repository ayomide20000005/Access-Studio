import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { TextLayer } from '../remotion/components/TextLayer'

export const ExplainerVideo = ({
  topic = 'Your Topic',
  problem = 'The problem people face',
  solution = 'Your amazing solution',
  howItWorks = 'Step One, Step Two, Step Three',
  callToAction = 'Learn More',
  primaryColor = '#0891B2',
  secondaryColor = '#7C3AED',
  fontFamily = 'Inter',
  style = 'Simple',
  tone = 'Friendly',
  pace = 'Medium',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const stepsArray = typeof howItWorks === 'string'
    ? howItWorks.split(',').map(s => s.trim()).filter(Boolean)
    : howItWorks

  const damping = pace === 'Fast' ? 20 : pace === 'Slow' ? 8 : 12
  const totalScenes = 4
  const framesPerScene = Math.floor(durationInFrames / totalScenes)
  const currentScene = Math.min(Math.floor(frame / framesPerScene), totalScenes - 1)
  const sceneFrame = frame % framesPerScene

  const fadeIn = (start, end) =>
    interpolate(sceneFrame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start) =>
    spring({ frame: Math.max(0, sceneFrame - start), fps, from: 40, to: 0, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const toneColor = tone === 'Casual' ? '#F59E0B' : tone === 'Serious' ? '#6B7280' : tone === 'Professional' ? '#4F46E5' : primaryColor

  const scenes = [
    <AbsoluteFill key={0} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 100 }}>
      <div style={{ color: toneColor, fontSize: 18, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', opacity: fadeIn(0, 15), marginBottom: 24 }}>✦ Explainer</div>
      <TextLayer text={topic} style={{ fontSize: 80, fontWeight: 800, color: '#FFFFFF', opacity: fadeIn(5, 25), transform: `translateY(${slideUp(5)}px)`, textAlign: 'center', marginBottom: 24 }} />
    </AbsoluteFill>,

    <AbsoluteFill key={1} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 100 }}>
      <div style={{ fontSize: 64, marginBottom: 32, opacity: fadeIn(0, 20) }}>⚠️</div>
      <div style={{ color: '#DC2626', fontSize: 20, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', opacity: fadeIn(0, 20), marginBottom: 20 }}>The Problem</div>
      <TextLayer text={problem} style={{ fontSize: 48, fontWeight: 700, color: '#FFFFFF', opacity: fadeIn(10, 30), transform: `translateY(${slideUp(10)}px)`, textAlign: 'center', lineHeight: 1.3 }} />
    </AbsoluteFill>,

    <AbsoluteFill key={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 100 }}>
      <div style={{ fontSize: 64, marginBottom: 32, opacity: fadeIn(0, 20) }}>💡</div>
      <div style={{ color: toneColor, fontSize: 20, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', opacity: fadeIn(0, 20), marginBottom: 20 }}>The Solution</div>
      <TextLayer text={solution} style={{ fontSize: 48, fontWeight: 700, color: '#FFFFFF', opacity: fadeIn(10, 30), transform: `translateY(${slideUp(10)}px)`, textAlign: 'center', lineHeight: 1.3 }} />
    </AbsoluteFill>,

    <AbsoluteFill key={3} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 100 }}>
      <div style={{ color: toneColor, fontSize: 20, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', opacity: fadeIn(0, 20), marginBottom: 40 }}>How It Works</div>
      <div style={{ display: 'flex', gap: 40, marginBottom: 60, flexWrap: 'wrap', justifyContent: 'center' }}>
        {stepsArray.map((step, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: interpolate(sceneFrame, [10 + i * 10, 30 + i * 10], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: toneColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#FFFFFF' }}>{i + 1}</div>
            <div style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 500, textAlign: 'center', maxWidth: 200 }}>{step}</div>
          </div>
        ))}
      </div>
      <div style={{ background: toneColor, borderRadius: 50, padding: '16px 48px', color: '#FFFFFF', fontSize: 20, fontWeight: 700, opacity: fadeIn(40, 60) }}>
        {callToAction} →
      </div>
    </AbsoluteFill>,
  ]

  return (
    <AbsoluteFill style={{ background: '#0F0F0F', fontFamily, opacity: outroOpacity }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, ${primaryColor}22 0%, transparent 70%)` }} />
      {scenes[currentScene]}
    </AbsoluteFill>
  )
}

export default ExplainerVideo