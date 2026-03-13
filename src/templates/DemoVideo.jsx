import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export const DemoVideo = ({
  productName = 'Your Product',
  headline = 'The future is here',
  subheadline = 'Experience something entirely new',
  demoPoints = 'Blazing fast performance, Intuitive by design, Built for everyone',
  callToAction = 'Get Started',
  websiteUrl = 'yourproduct.com',
  primaryColor = '#7C3AED',
  secondaryColor = '#4F46E5',
  accentColor = '#06B6D4',
  logoPath = null,
  fontFamily = 'Inter',
  pace = 'Medium',
  mood = 'Premium',
  background = 'Dark',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const damping = pace === 'Fast' ? 20 : pace === 'Slow' ? 8 : 12

  const pointsArray = typeof demoPoints === 'string'
    ? demoPoints.split(',').map(p => p.trim()).filter(Boolean)
    : demoPoints

  // Proportional scene timing
  const S1 = Math.floor(durationInFrames * 0.18)  // Cinematic open
  const S2 = Math.floor(durationInFrames * 0.42)  // Headline
  const S3 = Math.floor(durationInFrames * 0.70)  // Demo points
  const S4 = durationInFrames                      // CTA

  const currentScene = frame < S1 ? 0 : frame < S2 ? 1 : frame < S3 ? 2 : 3

  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, dist = 50) =>
    spring({ frame: Math.max(0, frame - start), fps, from: dist, to: 0, config: { damping, stiffness: 100 } })

  const scaleIn = (start) =>
    spring({ frame: Math.max(0, frame - start), fps, from: 0.8, to: 1, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  // Slow horizontal drift for background elements
  const drift = interpolate(frame, [0, durationInFrames], [0, -40], { extrapolateRight: 'clamp' })

  // Pulsing glow
  const pulse = interpolate(frame % 60, [0, 30, 60], [1, 1.08, 1])

  const getBg = () => {
    if (background === 'Light') return '#F8F8FC'
    if (mood === 'Vibrant') return `linear-gradient(140deg, #0A0010 0%, #0D0020 100%)`
    return '#07070C'
  }

  const textColor = background === 'Light' ? '#0A0A0A' : '#FFFFFF'

  return (
    <AbsoluteFill style={{ background: getBg(), fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Deep background layers */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 30% 40%, ${primaryColor}15 0%, transparent 60%),
                     radial-gradient(ellipse at 75% 65%, ${accentColor}0D 0%, transparent 55%)`,
        transform: `translateX(${drift}px)`,
      }} />

      {/* Noise grain overlay */}
      <AbsoluteFill style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
        opacity: 0.4,
      }} />

      {/* Horizontal line accents */}
      {[20, 40, 60, 80].map((pct, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: 0, right: 0,
          top: `${pct}%`,
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${primaryColor}${i === 1 || i === 2 ? '18' : '08'} 30%, ${primaryColor}${i === 1 || i === 2 ? '18' : '08'} 70%, transparent 100%)`,
        }} />
      ))}

      {/* ===== SCENE 1: Cinematic Open ===== */}
      {currentScene === 0 && (
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* Large abstract shape */}
          <div style={{
            position: 'absolute',
            width: 700,
            height: 700,
            borderRadius: '50%',
            border: `1px solid ${primaryColor}22`,
            transform: `scale(${interpolate(frame, [0, S1], [0.6, 1.4])})`,
            opacity: interpolate(frame, [0, S1 * 0.3, S1], [0, 0.6, 0]),
          }} />
          <div style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            border: `1px solid ${accentColor}33`,
            transform: `scale(${interpolate(frame, [0, S1], [0.8, 1.6])})`,
            opacity: interpolate(frame, [0, S1 * 0.4, S1], [0, 0.5, 0]),
          }} />

          {/* Center logo / icon */}
          <div style={{
            width: 120,
            height: 120,
            borderRadius: 32,
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 52,
            opacity: fadeIn(5, 20),
            transform: `scale(${scaleIn(5)})`,
            boxShadow: `0 0 80px ${primaryColor}55, 0 0 160px ${primaryColor}22`,
            zIndex: 2,
          }}>
            ⚡
          </div>

          {/* Product name fades in below */}
          <div style={{
            position: 'absolute',
            bottom: '30%',
            color: textColor,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: 8,
            textTransform: 'uppercase',
            opacity: fadeIn(15, 35),
            transform: `translateY(${slideUp(15, 20)}px)`,
          }}>
            {productName}
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 2: Big Headline ===== */}
      {currentScene === 1 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 120px' }}>

          {/* Eyebrow */}
          <div style={{
            color: accentColor,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 5,
            textTransform: 'uppercase',
            opacity: fadeIn(S1, S1 + 15),
            marginBottom: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{ width: 32, height: 1, background: accentColor }} />
            Introducing {productName}
            <div style={{ width: 32, height: 1, background: accentColor }} />
          </div>

          {/* Main headline — massive */}
          <div style={{
            fontSize: 112,
            fontWeight: 900,
            color: textColor,
            opacity: fadeIn(S1 + 8, S1 + 28),
            transform: `translateY(${slideUp(S1 + 8, 60)}px)`,
            textAlign: 'center',
            letterSpacing: '-5px',
            lineHeight: 0.95,
            marginBottom: 36,
          }}>
            {headline}
          </div>

          {/* Sub */}
          <div style={{
            fontSize: 28,
            fontWeight: 300,
            color: background === 'Light' ? '#444' : '#888',
            opacity: fadeIn(S1 + 20, S1 + 40),
            transform: `translateY(${slideUp(S1 + 20, 30)}px)`,
            textAlign: 'center',
            letterSpacing: 0.5,
            maxWidth: 700,
          }}>
            {subheadline}
          </div>

          {/* Decorative line */}
          <div style={{
            marginTop: 52,
            width: interpolate(frame, [S1 + 30, S1 + 60], [0, 200], { extrapolateRight: 'clamp' }),
            height: 2,
            background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
            borderRadius: 1,
          }} />
        </AbsoluteFill>
      )}

      {/* ===== SCENE 3: Demo Points ===== */}
      {currentScene === 2 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 160px' }}>

          <div style={{
            color: primaryColor,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 5,
            textTransform: 'uppercase',
            opacity: fadeIn(S2, S2 + 15),
            marginBottom: 60,
          }}>
            Why {productName}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: '100%', maxWidth: 900 }}>
            {pointsArray.map((point, i) => {
              const pStart = S2 + 15 + i * 18
              return (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 32,
                  opacity: interpolate(frame, [pStart, pStart + 15], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                  transform: `translateX(${spring({ frame: Math.max(0, frame - pStart), fps, from: -80, to: 0, config: { damping } })}px)`,
                }}>
                  {/* Number */}
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: `linear-gradient(135deg, ${primaryColor}33, ${secondaryColor}22)`,
                    border: `1px solid ${primaryColor}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: primaryColor,
                    fontSize: 20,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div style={{ color: textColor, fontSize: 28, fontWeight: 600, lineHeight: 1.3 }}>{point}</div>
                  </div>

                  {/* Right accent line */}
                  <div style={{
                    width: interpolate(frame, [pStart + 10, pStart + 40], [0, 80], { extrapolateRight: 'clamp' }),
                    height: 1,
                    background: `linear-gradient(90deg, ${primaryColor}88, transparent)`,
                  }} />
                </div>
              )
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 4: CTA ===== */}
      {currentScene === 3 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Radial burst */}
          <div style={{
            position: 'absolute',
            width: 800,
            height: 800,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}18 0%, transparent 65%)`,
            transform: `scale(${pulse})`,
          }} />

          {/* Product name small */}
          <div style={{
            color: background === 'Light' ? '#666' : '#555',
            fontSize: 16,
            fontWeight: 500,
            letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: fadeIn(S3, S3 + 15),
            marginBottom: 20,
          }}>
            {productName}
          </div>

          {/* Headline */}
          <div style={{
            fontSize: 88,
            fontWeight: 900,
            color: textColor,
            opacity: fadeIn(S3 + 8, S3 + 28),
            transform: `translateY(${slideUp(S3 + 8)}px) scale(${scaleIn(S3 + 8)})`,
            textAlign: 'center',
            letterSpacing: '-4px',
            lineHeight: 1,
            marginBottom: 20,
          }}>
            {headline}
          </div>

          {/* Website */}
          <div style={{
            color: accentColor,
            fontSize: 20,
            fontWeight: 500,
            opacity: fadeIn(S3 + 18, S3 + 38),
            marginBottom: 52,
            letterSpacing: 1,
          }}>
            {websiteUrl}
          </div>

          {/* CTA Button */}
          <div style={{
            opacity: fadeIn(S3 + 28, S3 + 48),
            transform: `translateY(${slideUp(S3 + 28, 30)}px)`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 60,
              padding: '22px 72px',
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 0.5,
              boxShadow: `0 0 60px ${primaryColor}44, 0 20px 60px ${primaryColor}22`,
            }}>
              {callToAction} →
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene flash transitions */}
      {[S1, S2, S3].map((t, i) => (
        <AbsoluteFill key={i} style={{
          background: '#000000',
          opacity: interpolate(frame, [t - 4, t, t + 10], [0, 0.9, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
          pointerEvents: 'none',
        }} />
      ))}

    </AbsoluteFill>
  )
}

export default DemoVideo