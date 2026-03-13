// LOCATION: src/templates/PromotionalVideo.jsx

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export const PromotionalVideo = ({
  brandName = 'Your Brand',
  offer = 'Summer Sale',
  discount = '50% OFF',
  originalPrice = '$199',
  salePrice = '$99',
  expiryText = 'Offer ends Sunday',
  benefits = 'Free shipping, 30-day returns, 24/7 support',
  callToAction = 'Shop Now',
  primaryColor = '#EF4444',
  secondaryColor = '#F59E0B',
  accentColor = '#14B8A6',
  fontFamily = 'Inter',
  energy = 'High Energy',
  style = 'Bold',
  emphasis = 'Discount',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const benefitsArray = typeof benefits === 'string'
    ? benefits.split(',').map(b => b.trim()).filter(Boolean)
    : Array.isArray(benefits) ? benefits : []

  const damping = energy === 'High Energy' ? 7 : energy === 'Subtle' ? 18 : 11
  const pulseSpeed = energy === 'High Energy' ? 18 : energy === 'Subtle' ? 55 : 28
  const pulse = interpolate(frame % pulseSpeed, [0, pulseSpeed / 2, pulseSpeed], [1, 1.06, 1])

  // ── Proportional scene timing ──
  const S1 = Math.floor(durationInFrames * 0.22) // Hook headline
  const S2 = Math.floor(durationInFrames * 0.50) // Offer reveal
  const S3 = Math.floor(durationInFrames * 0.75) // Benefits
  const S4 = durationInFrames                     // CTA

  const scene = frame < S1 ? 0 : frame < S2 ? 1 : frame < S3 ? 2 : 3

  // ── Helpers ──
  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, dist = 60) =>
    spring({ frame: Math.max(0, frame - start), fps, from: dist, to: 0, config: { damping } })

  const scaleSpring = (start, from = 0.5) =>
    spring({ frame: Math.max(0, frame - start), fps, from, to: 1, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const flashOpacity = (t) =>
    interpolate(frame, [t - 2, t, t + 6], [0, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  // ── Bouncy spring text — each word slams in ──
  const BouncyText = ({ text, startFrame, fontSize = 80, color = '#FFFFFF', stagger = 6 }) => {
    const words = text.split(' ')
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 14px' }}>
        {words.map((word, i) => {
          const wStart = startFrame + i * stagger
          const op = interpolate(frame, [wStart, wStart + 8], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
          const sc = spring({ frame: Math.max(0, frame - wStart), fps, from: 1.6, to: 1, config: { damping: 5, stiffness: 300 } })
          const y = spring({ frame: Math.max(0, frame - wStart), fps, from: -40, to: 0, config: { damping: 5 } })
          return (
            <span key={i} style={{
              fontSize, fontWeight: 900, color,
              opacity: op,
              transform: `scale(${sc}) translateY(${y}px)`,
              display: 'inline-block',
              letterSpacing: '-2px',
              lineHeight: 1,
              textShadow: `0 4px 20px rgba(0,0,0,0.5)`,
            }}>
              {word}
            </span>
          )
        })}
      </div>
    )
  }

  // ── Dispersion pixel scatter ──
  const DispersionReveal = ({ children, startFrame }) => {
    const progress = interpolate(frame, [startFrame, startFrame + 25], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    const blur = interpolate(frame, [startFrame, startFrame + 20], [12, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    const scatter = interpolate(frame, [startFrame, startFrame + 20], [20, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    return (
      <div style={{
        opacity: progress,
        filter: `blur(${blur}px)`,
        transform: `translateY(${scatter}px)`,
      }}>
        {children}
      </div>
    )
  }

  // ── Colors and shapes morph — pulsing gradient shapes ──
  const MorphShape = ({ size, x, y, color, delay = 0 }) => {
    const morphPhase = interpolate((frame + delay) % 120, [0, 60, 120], [0, 1, 0])
    const shapeScale = 1 + morphPhase * 0.15
    const shapeOpacity = 0.08 + morphPhase * 0.06
    return (
      <div style={{
        position: 'absolute',
        width: size, height: size,
        borderRadius: `${50 + morphPhase * 20}% ${30 + morphPhase * 20}% ${50 - morphPhase * 10}% ${40 + morphPhase * 10}%`,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        left: x, top: y,
        transform: `scale(${shapeScale})`,
        opacity: shapeOpacity,
        pointerEvents: 'none',
      }} />
    )
  }

  // ── Particle burst ──
  const ParticleBurst = ({ startFrame, count = 24, color = primaryColor }) => (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        const dist = 80 + (i % 5) * 45
        const pf = Math.max(0, frame - startFrame)
        const progress = interpolate(pf, [0, 40], [0, 1], { extrapolateRight: 'clamp' })
        const x = Math.cos(angle) * dist * progress
        const y = Math.sin(angle) * dist * progress
        const op = interpolate(pf, [0, 6, 40], [0, 1, 0], { extrapolateRight: 'clamp' })
        const size = interpolate(pf, [0, 40], [8, 2], { extrapolateRight: 'clamp' })
        const colors = [primaryColor, secondaryColor, accentColor, '#FFFFFF']
        return (
          <div key={i} style={{
            position: 'absolute',
            left: '50%', top: '52%',
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

  // ── Impact shake on big reveals ──
  const impactShake = scene === 1
    ? interpolate(frame % 4, [0, 1, 2, 3, 4], [0, -3, 3, -1, 0]) *
      interpolate(frame, [S1, S1 + 8, S1 + 12], [1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    : 0

  return (
    <AbsoluteFill style={{ background: '#0E0800', fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Warm dark background — deep charcoal with orange undertones */}
      <AbsoluteFill style={{
        background: `
          radial-gradient(ellipse at 50% 0%, ${primaryColor}20 0%, transparent 50%),
          radial-gradient(ellipse at 0% 100%, ${secondaryColor}15 0%, transparent 45%),
          radial-gradient(ellipse at 100% 100%, ${primaryColor}10 0%, transparent 45%)
        `,
      }} />

      {/* Morphing color shapes in background */}
      <MorphShape size={600} x="-10%" y="-10%" color={primaryColor} delay={0} />
      <MorphShape size={500} x="60%" y="50%" color={secondaryColor} delay={40} />
      <MorphShape size={400} x="20%" y="60%" color={accentColor} delay={80} />

      {/* Diagonal slash lines — energetic feel */}
      <AbsoluteFill style={{
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 60px,
          ${primaryColor}04 60px,
          ${primaryColor}04 61px
        )`,
        opacity: 0.8,
        pointerEvents: 'none',
      }} />

      {/* Impact shake wrapper */}
      <AbsoluteFill style={{ transform: `translateX(${impactShake}px)` }}>

        {/* ══════════════════════════════════
            SCENE 1 — Hook Headline
        ══════════════════════════════════ */}
        {scene === 0 && (
          <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

            {/* Brand name */}
            <div style={{
              color: '#FFFFFF',
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 8,
              textTransform: 'uppercase',
              opacity: fadeIn(0, 14),
              marginBottom: 24,
            }}>
              {brandName}
            </div>

            {/* Big hook offer text — bouncy */}
            <BouncyText text={offer} startFrame={6} fontSize={100} color="#FFFFFF" stagger={8} />

            {/* Accent line */}
            <div style={{
              height: 4,
              width: interpolate(frame, [16, 45], [0, 400], { extrapolateRight: 'clamp' }),
              background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 2,
              marginTop: 20,
              boxShadow: `0 0 20px ${primaryColor}`,
            }} />

            {/* Expiry badge */}
            <div style={{
              marginTop: 36,
              background: `${secondaryColor}22`,
              border: `1.5px solid ${secondaryColor}55`,
              borderRadius: 50,
              padding: '10px 32px',
              color: secondaryColor,
              fontSize: 16,
              fontWeight: 700,
              opacity: fadeIn(24, 38),
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              ⏰ {expiryText}
            </div>

          </AbsoluteFill>
        )}

        {/* ══════════════════════════════════
            SCENE 2 — Offer Reveal
        ══════════════════════════════════ */}
        {scene === 1 && (
          <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

            {/* White flash on entry */}
            <AbsoluteFill style={{
              background: '#FFFFFF',
              opacity: interpolate(frame, [S1, S1 + 3, S1 + 8], [0, 0.6, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
              pointerEvents: 'none',
            }} />

            {/* MASSIVE discount number — cube rotate reveal */}
            <DispersionReveal startFrame={S1 + 5}>
              <div style={{
                fontSize: 180,
                fontWeight: 900,
                color: primaryColor,
                letterSpacing: '-8px',
                lineHeight: 0.9,
                textAlign: 'center',
                textShadow: `0 0 80px ${primaryColor}66, 0 0 160px ${primaryColor}33`,
                transform: `scale(${pulse})`,
              }}>
                {discount}
              </div>
            </DispersionReveal>

            {/* Price comparison */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              marginTop: 20,
              opacity: fadeIn(S1 + 20, S1 + 35),
            }}>
              <div style={{
                fontSize: 36,
                fontWeight: 700,
                color: '#555',
                textDecoration: 'line-through',
              }}>
                {originalPrice}
              </div>
              <div style={{ color: '#444', fontSize: 24 }}>→</div>
              <div style={{
                fontSize: 52,
                fontWeight: 900,
                color: secondaryColor,
                textShadow: `0 0 30px ${secondaryColor}88`,
              }}>
                {salePrice}
              </div>
            </div>

            {/* Offer label */}
            <div style={{
              marginTop: 24,
              color: '#777',
              fontSize: 20,
              fontWeight: 500,
              opacity: fadeIn(S1 + 28, S1 + 42),
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}>
              {offer}
            </div>

          </AbsoluteFill>
        )}

        {/* ══════════════════════════════════
            SCENE 3 — Benefits
        ══════════════════════════════════ */}
        {scene === 2 && (
          <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 140px' }}>

            <div style={{
              color: secondaryColor,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 6,
              textTransform: 'uppercase',
              opacity: fadeIn(S2, S2 + 14),
              marginBottom: 52,
              filter: `drop-shadow(0 0 8px ${secondaryColor})`,
            }}>
              What You Get
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: '100%', maxWidth: 900 }}>
              {benefitsArray.map((benefit, i) => {
                const bStart = S2 + 12 + i * 18
                const bOp = interpolate(frame, [bStart, bStart + 14], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
                const bScale = spring({ frame: Math.max(0, frame - bStart), fps, from: 1.3, to: 1, config: { damping: 7 } })
                // Dispersion scatter
                const scatter = interpolate(frame, [bStart, bStart + 18], [8, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 24,
                    opacity: bOp,
                    transform: `scale(${bScale})`,
                    filter: `blur(${scatter}px)`,
                    background: '#FFFFFF08',
                    border: `1px solid ${primaryColor}22`,
                    borderRadius: 16,
                    padding: '18px 28px',
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, flexShrink: 0,
                      boxShadow: `0 0 16px ${primaryColor}55`,
                    }}>
                      ✓
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: '#FFFFFF' }}>
                      {benefit}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Urgency flicker */}
            <div style={{
              marginTop: 40,
              color: secondaryColor,
              fontSize: 18,
              fontWeight: 700,
              opacity: interpolate(frame % 30, [0, 14, 15, 29, 30], [1, 1, 0.3, 0.3, 1]),
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}>
              ⏰ {expiryText}
            </div>

          </AbsoluteFill>
        )}

        {/* ══════════════════════════════════
            SCENE 4 — CTA
        ══════════════════════════════════ */}
        {scene === 3 && (
          <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

            <ParticleBurst startFrame={S3 + 2} count={36} color={primaryColor} />
            <ParticleBurst startFrame={S3 + 14} count={24} color={secondaryColor} />

            {/* Bloom */}
            <div style={{
              position: 'absolute',
              width: 900, height: 900,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${primaryColor}18 0%, transparent 60%)`,
              transform: `scale(${pulse})`,
              pointerEvents: 'none',
            }} />

            {/* Brand */}
            <div style={{
              color: '#777',
              fontSize: 18, fontWeight: 600, letterSpacing: 6, textTransform: 'uppercase',
              opacity: fadeIn(S3, S3 + 14),
              marginBottom: 16,
            }}>
              {brandName}
            </div>

            {/* Discount big */}
            <div style={{
              fontSize: 150,
              fontWeight: 900,
              color: primaryColor,
              opacity: fadeIn(S3 + 5, S3 + 20),
              transform: `scale(${scaleSpring(S3 + 5, 0.6) * pulse})`,
              letterSpacing: '-6px',
              lineHeight: 0.9,
              textShadow: `0 0 80px ${primaryColor}66`,
              marginBottom: 20,
            }}>
              {discount}
            </div>

            {/* Sale price */}
            <div style={{
              fontSize: 48,
              fontWeight: 900,
              color: secondaryColor,
              opacity: fadeIn(S3 + 14, S3 + 28),
              marginBottom: 44,
              textShadow: `0 0 30px ${secondaryColor}66`,
            }}>
              {salePrice}
            </div>

            {/* CTA button */}
            <div style={{
              opacity: fadeIn(S3 + 22, S3 + 36),
              transform: `scale(${scaleSpring(S3 + 22, 0.7) * pulse})`,
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                borderRadius: 60,
                padding: '24px 96px',
                color: '#FFFFFF',
                fontSize: 28,
                fontWeight: 900,
                boxShadow: `0 0 70px ${primaryColor}66, 0 0 140px ${primaryColor}22`,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}>
                {callToAction} →
              </div>
            </div>

            {/* Urgency */}
            <div style={{
              marginTop: 24,
              color: '#555',
              fontSize: 16,
              opacity: fadeIn(S3 + 30, S3 + 44),
              letterSpacing: 2,
            }}>
              {expiryText}
            </div>

          </AbsoluteFill>
        )}

      </AbsoluteFill>

      {/* Scene flash transitions — harsh white cuts for energy */}
      {[S1, S2, S3].map((t, i) => (
        <AbsoluteFill key={i} style={{
          background: i === 1 ? '#FFFFFF' : '#000000',
          opacity: flashOpacity(t),
          pointerEvents: 'none',
          zIndex: 50,
        }} />
      ))}

    </AbsoluteFill>
  )
}

export default PromotionalVideo