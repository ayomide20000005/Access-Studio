// LOCATION: src/templates/ProductLaunch.jsx

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export const ProductLaunch = ({
  productName = 'Product Name',
  tagline = 'The future is here',
  launchDate = 'Coming Soon',
  keyBenefits = 'Faster performance, Beautiful design, Built to last',
  features = 'Feature One, Feature Two, Feature Three, Feature Four',
  price = '$99',
  callToAction = 'Pre-order Now',
  primaryColor = '#14B8A6',
  secondaryColor = '#6366F1',
  accentColor = '#F59E0B',
  fontFamily = 'Inter',
  launchFeel = 'Hype',
  pace = 'Medium',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const damping = pace === 'Fast' ? 22 : pace === 'Slow' ? 8 : 13

  const benefitsArray = typeof keyBenefits === 'string'
    ? keyBenefits.split(',').map(b => b.trim()).filter(Boolean)
    : Array.isArray(keyBenefits) ? keyBenefits : []

  const featuresArray = typeof features === 'string'
    ? features.split(',').map(f => f.trim()).filter(Boolean)
    : Array.isArray(features) ? features : []

  // ── Proportional scene timing ──
  const S1 = Math.floor(durationInFrames * 0.22)
  const S2 = Math.floor(durationInFrames * 0.55)
  const S3 = Math.floor(durationInFrames * 0.78)

  const scene = frame < S1 ? 0 : frame < S2 ? 1 : frame < S3 ? 2 : 3

  // ── Helpers ──
  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, dist = 50) =>
    spring({ frame: Math.max(0, frame - start), fps, from: dist, to: 0, config: { damping } })

  const scaleSpring = (start, from = 0.7) =>
    spring({ frame: Math.max(0, frame - start), fps, from, to: 1, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const flashOpacity = (t) =>
    interpolate(frame, [t - 3, t, t + 8], [0, 0.92, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const getFeel = () => {
    if (launchFeel === 'Premium') return { titleSize: 100, spacing: '-4px' }
    if (launchFeel === 'Dramatic') return { titleSize: 110, spacing: '-5px' }
    if (launchFeel === 'Clean') return { titleSize: 80, spacing: '-2px' }
    return { titleSize: 96, spacing: '-3px' }
  }
  const { titleSize, spacing } = getFeel()

  // ── Neon glow text trail ──
  const NeonTextReveal = ({ text, startFrame, fontSize, color }) => {
    const letters = text.split('')
    const delay = launchFeel === 'Dramatic' ? 5 : 3
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        {letters.map((char, i) => {
          const lf = startFrame + i * delay
          const op = interpolate(frame, [lf, lf + 12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
          const blur = interpolate(frame, [lf, lf + 20], [20, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
          const glow = interpolate(frame, [lf, lf + 10, lf + 35], [3, 1.5, 0.3], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
          return (
            <span key={i} style={{
              fontSize,
              fontWeight: 900,
              color: '#FFFFFF',
              opacity: op,
              filter: `blur(${blur}px) drop-shadow(0 0 ${glow * 18}px ${color}) drop-shadow(0 0 ${glow * 6}px ${color})`,
              letterSpacing: spacing,
              lineHeight: 1,
              display: 'inline-block',
            }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          )
        })}
      </div>
    )
  }

  // ── Particle burst ──
  const ParticleBurst = ({ startFrame, count = 28 }) => (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        const dist = 100 + (i % 4) * 50
        const pf = Math.max(0, frame - startFrame)
        const progress = interpolate(pf, [0, 45], [0, 1], { extrapolateRight: 'clamp' })
        const x = Math.cos(angle) * dist * progress
        const y = Math.sin(angle) * dist * progress
        const op = interpolate(pf, [0, 8, 45], [0, 1, 0], { extrapolateRight: 'clamp' })
        const size = interpolate(pf, [0, 45], [7, 2], { extrapolateRight: 'clamp' })
        const colors = [primaryColor, secondaryColor, accentColor, '#FFFFFF']
        return (
          <div key={i} style={{
            position: 'absolute',
            left: '50%', top: '55%',
            width: size, height: size,
            borderRadius: '50%',
            background: colors[i % colors.length],
            opacity: op,
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            boxShadow: `0 0 ${size * 3}px ${colors[i % colors.length]}`,
            pointerEvents: 'none',
          }} />
        )
      })}
    </>
  )

  // ── Ken Burns zoom ──
  const kenScale = interpolate(frame, [0, durationInFrames], [1, 1.1], { extrapolateRight: 'clamp' })
  const kenX = interpolate(frame, [0, durationInFrames], [0, -15], { extrapolateRight: 'clamp' })

  // ── Bloom pulse ──
  const bloom = interpolate(frame % 60, [0, 30, 60], [0.95, 1.05, 0.95])

  // ── Feature carousel timing ──
  const featureSlotDuration = Math.max(1, Math.floor((S2 - S1) / Math.max(featuresArray.length, 1)))
  const currentFeatureIndex = Math.min(
    Math.floor(Math.max(0, frame - S1) / featureSlotDuration),
    Math.max(0, featuresArray.length - 1)
  )
  const featureSlotFrame = Math.max(0, frame - S1) % featureSlotDuration

  return (
    <AbsoluteFill style={{ background: '#06060F', fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Deep background radial glow — Ken Burns applied here */}
      <AbsoluteFill style={{
        background: `
          radial-gradient(ellipse at 20% 50%, ${primaryColor}18 0%, transparent 50%),
          radial-gradient(ellipse at 80% 50%, ${secondaryColor}14 0%, transparent 50%),
          radial-gradient(ellipse at 50% 100%, ${accentColor}0C 0%, transparent 40%)
        `,
        transform: `scale(${kenScale}) translateX(${kenX}px)`,
      }} />

      {/* Grid overlay */}
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${primaryColor}10 1px, transparent 1px), linear-gradient(90deg, ${primaryColor}10 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        opacity: 0.5,
      }} />

      {/* Scanlines */}
      <AbsoluteFill style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 4px)',
        opacity: 0.04,
        pointerEvents: 'none',
        zIndex: 99,
      }} />

      {/* Chromatic aberration — fades after entry */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 50%, transparent 60%, ${primaryColor}06 100%)`,
        transform: `translateX(${interpolate(frame, [0, 20], [4, 0.5], { extrapolateRight: 'clamp' })}px)`,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        zIndex: 98,
      }} />
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 50%, transparent 60%, ${secondaryColor}06 100%)`,
        transform: `translateX(${interpolate(frame, [0, 20], [-4, -0.5], { extrapolateRight: 'clamp' })}px)`,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        zIndex: 98,
      }} />

      {/* ══════════════════════════════════
          SCENE 1 — Logo + Neon Name Reveal
      ══════════════════════════════════ */}
      {scene === 0 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Bloom ring */}
          <div style={{
            position: 'absolute',
            width: 700, height: 700,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}12 0%, transparent 65%)`,
            transform: `scale(${bloom})`,
            pointerEvents: 'none',
          }} />

          {/* Introducing label */}
          <div style={{
            color: primaryColor,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 8,
            textTransform: 'uppercase',
            opacity: fadeIn(0, 14),
            marginBottom: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            filter: `drop-shadow(0 0 10px ${primaryColor})`,
          }}>
            <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${primaryColor})` }} />
            Introducing
            <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${primaryColor}, transparent)` }} />
          </div>

          {/* Neon glow text trail */}
          <NeonTextReveal text={productName} startFrame={6} fontSize={titleSize} color={primaryColor} />

          {/* Animated underline draw */}
          <div style={{
            marginTop: 14,
            height: 3,
            width: interpolate(frame, [18, 52], [0, 340], { extrapolateRight: 'clamp' }),
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
            borderRadius: 2,
            boxShadow: `0 0 14px ${primaryColor}88`,
          }} />

          {/* Tagline */}
          <div style={{
            fontSize: 22,
            fontWeight: 300,
            color: '#777',
            opacity: fadeIn(24, 40),
            marginTop: 22,
            letterSpacing: 2,
            textAlign: 'center',
          }}>
            {tagline}
          </div>

          {/* Launch date badge */}
          <div style={{
            marginTop: 32,
            background: `${primaryColor}18`,
            border: `1px solid ${primaryColor}44`,
            borderRadius: 50,
            padding: '10px 32px',
            color: primaryColor,
            fontSize: 15,
            fontWeight: 600,
            opacity: fadeIn(30, 44),
            filter: `drop-shadow(0 0 8px ${primaryColor}55)`,
          }}>
            📅 {launchDate}
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 2 — Features Cube Carousel
      ══════════════════════════════════ */}
      {scene === 1 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 120px' }}>

          <div style={{
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: fadeIn(S1, S1 + 15),
            marginBottom: 52,
            filter: `drop-shadow(0 0 8px ${primaryColor})`,
          }}>
            Key Features
          </div>

          {/* Feature card with cube rotate entry */}
          {featuresArray.map((feature, i) => {
            if (i !== currentFeatureIndex) return null
            const entryOp = interpolate(featureSlotFrame, [0, 14], [0, 1], { extrapolateRight: 'clamp' })
            const entryRot = interpolate(featureSlotFrame, [0, 18], [-12, 0], { extrapolateRight: 'clamp' })
            const entryScale = spring({ frame: Math.max(0, featureSlotFrame), fps, from: 0.82, to: 1, config: { damping } })
            return (
              <div key={i} style={{
                opacity: entryOp,
                transform: `perspective(900px) rotateY(${entryRot}deg) scale(${entryScale})`,
                textAlign: 'center',
                position: 'relative',
              }}>
                {/* Big background number */}
                <div style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -60%)',
                  fontSize: 200,
                  fontWeight: 900,
                  color: `${primaryColor}10`,
                  letterSpacing: '-10px',
                  userSelect: 'none',
                  lineHeight: 1,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div style={{
                  fontSize: 68,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-2px',
                  lineHeight: 1.1,
                  position: 'relative',
                  zIndex: 1,
                  textShadow: `0 0 50px ${primaryColor}44`,
                  maxWidth: 1000,
                }}>
                  {feature}
                </div>

                <div style={{
                  height: 3,
                  width: interpolate(featureSlotFrame, [10, 38], [0, 220], { extrapolateRight: 'clamp' }),
                  background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                  borderRadius: 2,
                  margin: '22px auto 0',
                  boxShadow: `0 0 14px ${primaryColor}88`,
                }} />
              </div>
            )
          })}

          {/* Progress dots */}
          <div style={{ position: 'absolute', bottom: 60, display: 'flex', gap: 10 }}>
            {featuresArray.map((_, i) => (
              <div key={i} style={{
                width: i === currentFeatureIndex ? 30 : 8,
                height: 8,
                borderRadius: 4,
                background: i === currentFeatureIndex ? primaryColor : `${primaryColor}33`,
                boxShadow: i === currentFeatureIndex ? `0 0 10px ${primaryColor}` : 'none',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 3 — Benefits with Dispersion
      ══════════════════════════════════ */}
      {scene === 2 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 160px' }}>

          <div style={{
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: fadeIn(S2, S2 + 15),
            marginBottom: 56,
            filter: `drop-shadow(0 0 8px ${primaryColor})`,
          }}>
            Why Choose Us
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%', maxWidth: 1000 }}>
            {benefitsArray.map((benefit, i) => {
              const bStart = S2 + 10 + i * 18
              const bOp = interpolate(frame, [bStart, bStart + 14], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
              const bX = spring({ frame: Math.max(0, frame - bStart), fps, from: -70, to: 0, config: { damping } })
              const scatter = interpolate(frame, [bStart, bStart + 20], [10, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
              return (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 28,
                  opacity: bOp,
                  transform: `translateX(${bX}px)`,
                  filter: `blur(${scatter}px)`,
                }}>
                  <div style={{
                    width: 14, height: 14,
                    borderRadius: '50%',
                    background: primaryColor,
                    flexShrink: 0,
                    boxShadow: `0 0 18px ${primaryColor}, 0 0 36px ${primaryColor}66`,
                  }} />
                  <div style={{ fontSize: 34, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                    {benefit}
                  </div>
                </div>
              )
            })}
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 4 — CTA Explosion
      ══════════════════════════════════ */}
      {scene === 3 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          <ParticleBurst startFrame={S3 + 4} count={32} />
          <ParticleBurst startFrame={S3 + 18} count={20} />

          {/* Bloom ring */}
          <div style={{
            position: 'absolute',
            width: 800, height: 800,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}18 0%, transparent 65%)`,
            transform: `scale(${bloom * scaleSpring(S3, 0.5)})`,
            pointerEvents: 'none',
          }} />

          <div style={{
            fontSize: 20,
            fontWeight: 300,
            color: '#555',
            opacity: fadeIn(S3, S3 + 14),
            marginBottom: 8,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}>
            Starting at
          </div>

          <div style={{
            fontSize: 130,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(S3 + 5, S3 + 20),
            transform: `scale(${scaleSpring(S3 + 5, 0.6)})`,
            letterSpacing: '-5px',
            textShadow: `0 0 70px ${primaryColor}55`,
            marginBottom: 44,
            lineHeight: 1,
          }}>
            {price}
          </div>

          {/* CTA button */}
          <div style={{
            opacity: fadeIn(S3 + 16, S3 + 30),
            transform: `scale(${scaleSpring(S3 + 16, 0.8) * bloom})`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 60,
              padding: '24px 88px',
              color: '#FFFFFF',
              fontSize: 26,
              fontWeight: 800,
              boxShadow: `0 0 60px ${primaryColor}55, 0 0 120px ${primaryColor}22`,
              letterSpacing: 0.5,
            }}>
              {callToAction} →
            </div>
          </div>

          {/* Product name watermark */}
          <div style={{
            position: 'absolute',
            bottom: 44,
            color: `${primaryColor}66`,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: fadeIn(S3 + 24, S3 + 38),
          }}>
            {productName}
          </div>

        </AbsoluteFill>
      )}

      {/* Scene flash transitions */}
      {[S1, S2, S3].map((t, i) => (
        <AbsoluteFill key={i} style={{
          background: '#000000',
          opacity: flashOpacity(t),
          pointerEvents: 'none',
          zIndex: 50,
        }} />
      ))}

    </AbsoluteFill>
  )
}

export default ProductLaunch