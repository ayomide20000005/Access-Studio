import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export const PromotionalVideo = ({
  brandName = 'Your Brand',
  offerHeadline = 'Biggest Sale of the Year',
  discount = '50% OFF',
  originalPrice = '$199',
  salePrice = '$99',
  offerDetails = 'Free shipping, 30-day returns, Lifetime warranty',
  expiryText = 'Ends Sunday Midnight',
  callToAction = 'Shop Now',
  promoCode = 'SAVE50',
  primaryColor = '#EF4444',
  secondaryColor = '#F97316',
  accentColor = '#FBBF24',
  fontFamily = 'Inter',
  pace = 'Medium',
  energy = 'High Energy',
  style = 'Bold',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const damping = pace === 'Fast' ? 18 : pace === 'Slow' ? 10 : 13

  const detailsArray = typeof offerDetails === 'string'
    ? offerDetails.split(',').map(d => d.trim()).filter(Boolean)
    : offerDetails

  // Proportional scene timing
  const S1 = Math.floor(durationInFrames * 0.22)  // Brand punch
  const S2 = Math.floor(durationInFrames * 0.50)  // Offer reveal
  const S3 = Math.floor(durationInFrames * 0.72)  // Details + urgency
  const S4 = durationInFrames                      // CTA

  const currentScene = frame < S1 ? 0 : frame < S2 ? 1 : frame < S3 ? 2 : 3

  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, dist = 50) =>
    spring({ frame: Math.max(0, frame - start), fps, from: dist, to: 0, config: { damping, stiffness: 120 } })

  const scaleIn = (start, from = 0.7) =>
    spring({ frame: Math.max(0, frame - start), fps, from, to: 1, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  // High energy pulse
  const pulseSpeed = energy === 'High Energy' ? 25 : energy === 'Subtle' ? 70 : 40
  const pulse = interpolate(frame % pulseSpeed, [0, pulseSpeed / 2, pulseSpeed], [1, 1.04, 1])

  // Countdown urgency flicker
  const urgencyFlicker = energy === 'High Energy' ? (Math.floor(frame / 8) % 2 === 0 ? 1 : 0.85) : 1

  // Diagonal stripe animation
  const stripeOffset = interpolate(frame, [0, durationInFrames], [0, 120])

  return (
    <AbsoluteFill style={{ background: '#080808', fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Animated diagonal stripes background */}
      <AbsoluteFill style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 60px,
          ${primaryColor}06 60px,
          ${primaryColor}06 61px
        )`,
        backgroundPosition: `${stripeOffset}px 0`,
      }} />

      {/* Ambient glow */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 50%, ${primaryColor}18 0%, transparent 60%)`,
        transform: `scale(${pulse})`,
      }} />

      {/* ===== SCENE 1: Brand Punch ===== */}
      {currentScene === 0 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Explosive reveal rings */}
          {[200, 400, 600, 800].map((size, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              border: `${i === 0 ? 3 : 1}px solid ${primaryColor}${['66', '44', '22', '11'][i]}`,
              transform: `scale(${interpolate(frame, [i * 3, Math.min(S1, i * 3 + 20)], [0, 1], { extrapolateRight: 'clamp' })})`,
              opacity: interpolate(frame, [i * 3, S1 * 0.7, S1], [0, 0.8, 0.2]),
            }} />
          ))}

          {/* Brand name — massive impact */}
          <div style={{
            fontSize: 140,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(3, 18),
            transform: `scale(${scaleIn(3, 1.3)}) translateY(${slideUp(3, 20)}px)`,
            textAlign: 'center',
            letterSpacing: '-6px',
            lineHeight: 0.9,
            textShadow: `0 0 80px ${primaryColor}66`,
          }}>
            {brandName}
          </div>

          {/* Offer teaser */}
          <div style={{
            marginTop: 36,
            color: accentColor,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: 'uppercase',
            opacity: fadeIn(15, 30),
            transform: `translateY(${slideUp(15, 20)}px)`,
          }}>
            {offerHeadline}
          </div>

          {/* Horizontal slash lines */}
          <div style={{
            position: 'absolute',
            top: '45%',
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${primaryColor}44, transparent)`,
            opacity: fadeIn(10, 25),
          }} />
        </AbsoluteFill>
      )}

      {/* ===== SCENE 2: Offer Reveal ===== */}
      {currentScene === 1 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Background flash */}
          <AbsoluteFill style={{
            background: `radial-gradient(ellipse at center, ${primaryColor}28 0%, transparent 65%)`,
            transform: `scale(${pulse})`,
          }} />

          {/* Discount — hero element */}
          <div style={{
            fontSize: 200,
            fontWeight: 900,
            lineHeight: 0.85,
            textAlign: 'center',
            opacity: fadeIn(S1 + 3, S1 + 18),
            transform: `scale(${scaleIn(S1 + 3, 0.6)})`,
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            letterSpacing: '-8px',
            filter: `drop-shadow(0 0 40px ${primaryColor}88)`,
          }}>
            {discount}
          </div>

          {/* Price comparison */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            marginTop: 24,
            opacity: fadeIn(S1 + 18, S1 + 35),
            transform: `translateY(${slideUp(S1 + 18, 30)}px)`,
          }}>
            {/* Original price - struck through */}
            <div style={{ position: 'relative' }}>
              <div style={{ color: '#555', fontSize: 40, fontWeight: 700 }}>{originalPrice}</div>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: -4,
                right: -4,
                height: 3,
                background: '#EF4444',
                transform: 'rotate(-8deg)',
              }} />
            </div>

            <div style={{ color: '#333', fontSize: 28 }}>→</div>

            {/* Sale price */}
            <div style={{
              color: '#FFFFFF',
              fontSize: 64,
              fontWeight: 900,
              letterSpacing: '-2px',
              textShadow: `0 0 40px ${primaryColor}88`,
            }}>
              {salePrice}
            </div>
          </div>

          {/* Brand tag */}
          <div style={{
            marginTop: 32,
            color: '#555',
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: 'uppercase',
            opacity: fadeIn(S1 + 28, S1 + 45),
          }}>
            {brandName}
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 3: Details + Urgency ===== */}
      {currentScene === 2 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 140px' }}>

          {/* Offer details */}
          <div style={{
            color: accentColor,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 5,
            textTransform: 'uppercase',
            opacity: fadeIn(S2, S2 + 15),
            marginBottom: 40,
          }}>
            What's included
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 60 }}>
            {detailsArray.map((detail, i) => {
              const dStart = S2 + 10 + i * 15
              return (
                <div key={i} style={{
                  background: '#111',
                  border: `1px solid ${primaryColor}33`,
                  borderRadius: 16,
                  padding: '20px 32px',
                  opacity: interpolate(frame, [dStart, dStart + 12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                  transform: `translateY(${spring({ frame: Math.max(0, frame - dStart), fps, from: 30, to: 0, config: { damping } })}px)`,
                }}>
                  <div style={{ color: primaryColor, fontSize: 20, marginBottom: 8 }}>✓</div>
                  <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 600 }}>{detail}</div>
                </div>
              )
            })}
          </div>

          {/* Urgency bar */}
          <div style={{
            background: `${primaryColor}22`,
            border: `1px solid ${primaryColor}55`,
            borderRadius: 50,
            padding: '16px 40px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            opacity: fadeIn(S2 + 40, S2 + 55) * urgencyFlicker,
          }}>
            <div style={{ fontSize: 24 }}>⏰</div>
            <div style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 700 }}>{expiryText}</div>
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 4: CTA ===== */}
      {currentScene === 3 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Pulsing background */}
          <AbsoluteFill style={{
            background: `radial-gradient(ellipse at center, ${primaryColor}22 0%, transparent 55%)`,
            transform: `scale(${pulse})`,
          }} />

          <div style={{
            fontSize: 120,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(S3, S3 + 18),
            transform: `scale(${scaleIn(S3, 0.8)})`,
            textAlign: 'center',
            letterSpacing: '-5px',
            lineHeight: 0.9,
            marginBottom: 16,
            textShadow: `0 0 80px ${primaryColor}55`,
          }}>
            {discount}
          </div>

          <div style={{
            color: '#666',
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: 'uppercase',
            opacity: fadeIn(S3 + 10, S3 + 25),
            marginBottom: 48,
          }}>
            {brandName} · {expiryText}
          </div>

          {/* Promo code */}
          {promoCode && (
            <div style={{
              background: '#111',
              border: `2px dashed ${accentColor}55`,
              borderRadius: 12,
              padding: '14px 40px',
              marginBottom: 36,
              opacity: fadeIn(S3 + 18, S3 + 35),
              transform: `translateY(${slideUp(S3 + 18, 20)}px)`,
            }}>
              <div style={{ color: '#666', fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Promo Code</div>
              <div style={{ color: accentColor, fontSize: 28, fontWeight: 900, letterSpacing: 4 }}>{promoCode}</div>
            </div>
          )}

          {/* CTA */}
          <div style={{
            opacity: fadeIn(S3 + 28, S3 + 45),
            transform: `scale(${pulse})`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 60,
              padding: '24px 80px',
              color: '#FFFFFF',
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: 1,
              boxShadow: `0 0 60px ${primaryColor}55, 0 20px 60px ${primaryColor}33`,
            }}>
              {callToAction} →
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene flash transitions */}
      {[S1, S2, S3].map((t, i) => (
        <AbsoluteFill key={i} style={{
          background: i === 0 ? primaryColor : '#000000',
          opacity: interpolate(frame, [t - 3, t, t + 8], [0, i === 0 ? 0.4 : 0.9, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
          pointerEvents: 'none',
        }} />
      ))}

    </AbsoluteFill>
  )
}

export default PromotionalVideo