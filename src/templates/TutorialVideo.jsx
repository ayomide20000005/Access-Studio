import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { TextLayer } from '../remotion/components/TextLayer'

export const TutorialVideo = ({
  tutorialTitle = 'How To Do Something',
  steps = 'Step One, Step Two, Step Three',
  tips = 'Pro tip: Always save your work',
  callToAction = 'Watch Full Tutorial',
  primaryColor = '#059669',
  secondaryColor = '#0891B2',
  fontFamily = 'Inter',
  layout = 'Step by Step',
  tone = 'Friendly',
  pace = 'Medium',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const stepsArray = typeof steps === 'string'
    ? steps.split(',').map(s => s.trim()).filter(Boolean)
    : steps

  const damping = pace === 'Fast' ? 20 : pace === 'Slow' ? 8 : 12
  const framesPerStep = Math.floor((durationInFrames - 60) / stepsArray.length)
  const currentStep = Math.min(Math.floor((frame - 30) / framesPerStep), stepsArray.length - 1)

  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const toneColor = tone === 'Casual' ? '#F59E0B' : tone === 'Professional' ? '#4F46E5' : primaryColor

  return (
    <AbsoluteFill style={{ background: '#0F0F0F', fontFamily, opacity: outroOpacity }}>
      <AbsoluteFill style={{ background: `linear-gradient(135deg, ${primaryColor}11 0%, transparent 50%, ${secondaryColor}11 100%)` }} />

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 100, background: '#1A1A1A', borderBottom: `2px solid ${toneColor}`, display: 'flex', alignItems: 'center', padding: '0 80px', opacity: fadeIn(0, 20) }}>
        <TextLayer text={tutorialTitle} style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF' }} />
        <div style={{ marginLeft: 'auto', color: toneColor, fontSize: 16, fontWeight: 600 }}>
          Step {Math.max(1, currentStep + 1)} of {stepsArray.length}
        </div>
      </div>

      <div style={{ position: 'absolute', top: 100, left: 0, right: 0, height: 4, background: '#2E2E2E' }}>
        <div style={{ height: '100%', background: toneColor, width: `${((currentStep + 1) / stepsArray.length) * 100}%`, borderRadius: 2 }} />
      </div>

      {layout === 'Step by Step' && (
        <div style={{ position: 'absolute', top: 104, left: 0, bottom: 0, width: 320, background: '#1A1A1A', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 8, opacity: fadeIn(10, 30), overflowY: 'auto' }}>
          {stepsArray.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', borderRadius: 8, background: currentStep === i ? `${toneColor}22` : 'transparent', border: `1px solid ${currentStep === i ? toneColor : 'transparent'}` }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: i <= currentStep ? toneColor : '#2E2E2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#FFFFFF', flexShrink: 0 }}>
                {i < currentStep ? '✓' : i + 1}
              </div>
              <div style={{ color: currentStep === i ? '#FFFFFF' : '#666', fontSize: 16, fontWeight: currentStep === i ? 600 : 400, lineHeight: 1.4, paddingTop: 2 }}>
                {step}
              </div>
            </div>
          ))}
        </div>
      )}

      <AbsoluteFill style={{ left: layout === 'Step by Step' ? 320 : 0, top: 104, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 80 }}>
        <div style={{ fontSize: 80, marginBottom: 32, opacity: fadeIn(20, 40) }}>📋</div>
        <TextLayer text={stepsArray[Math.max(0, currentStep)]} style={{ fontSize: 48, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', lineHeight: 1.3, opacity: fadeIn(20, 40) }} />
        {tips && currentStep === stepsArray.length - 1 && (
          <div style={{ marginTop: 40, background: `${secondaryColor}22`, border: `1px solid ${secondaryColor}44`, borderRadius: 12, padding: '16px 32px', color: secondaryColor, fontSize: 20, opacity: fadeIn(50, 70) }}>
            💡 {tips}
          </div>
        )}
      </AbsoluteFill>

      {frame > durationInFrames - 60 && (
        <div style={{ position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)', background: toneColor, borderRadius: 50, padding: '16px 48px', color: '#FFFFFF', fontSize: 20, fontWeight: 700, opacity: fadeIn(durationInFrames - 60, durationInFrames - 40) }}>
          {callToAction} →
        </div>
      )}
    </AbsoluteFill>
  )
}

export default TutorialVideo