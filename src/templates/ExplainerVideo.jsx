import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export const ExplainerVideo = ({
  topic = 'Your Big Idea',
  brandName = 'Your Brand',
  problemStatement = 'People struggle with this every single day',
  solutionStatement = 'We built something that changes everything',
  howItWorks = 'Sign up in seconds, Set your preferences, Watch the magic happen',
  proofPoint = '10,000+ happy users',
  callToAction = 'Try for Free',
  primaryColor = '#0EA5E9',
  secondaryColor = '#6366F1',
  accentColor = '#F59E0B',
  fontFamily = 'Inter',
  pace = 'Medium',
  tone = 'Friendly',
  style = 'Bold',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const damping = pace === 'Fast' ? 20 : pace === 'Slow' ? 8 : 12

  const stepsArray = typeof howItWorks === 'string'
    ? howItWorks.split(',').map(s => s.trim()).filter(Boolean)
    : howItWorks

  // Proportional scene timing
  const S1 = Math.floor(durationInFrames * 0.15)  // Hook
  const S2 = Math.floor(durationInFrames * 0.35)  // Problem
  const S3 = Math.floor(durationInFrames * 0.55)  // Solution
  const S4 = Math.floor(durationInFrames * 0.78)  // How it works
  const S5 = durationInFrames                      // CTA

  const currentScene = frame < S1 ? 0 : frame < S2 ? 1 : frame < S3 ? 2 : frame < S4 ? 3 : 4

  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, dist = 50) =>
    spring({ frame: Math.max(0, frame - start), fps, from: dist, to: 0, config: { damping, stiffness: 100 } })

  const slideIn = (start, dir = 1) =>
    spring({ frame: Math.max(0, frame - start), fps, from: 80 * dir, to: 0, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const toneColor = tone === 'Serious' ? '#6B7280' : tone === 'Professional' ? primaryColor : accentColor

  // Animated counter for proof point
  const countMatch = proofPoint.match(/[\d,]+/)
  const countNum = countMatch ? parseInt(countMatch[0].replace(/,/g, '')) : null

  return (
    <AbsoluteFill style={{ background: '#08080F', fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Ambient glow layers */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 15% 50%, ${primaryColor}12 0%, transparent 55%),
                     radial-gradient(ellipse at 85% 50%, ${secondaryColor}0E 0%, transparent 50%)`,
      }} />

      {/* Grid */}
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${primaryColor}07 1px, transparent 1px), linear-gradient(90deg, ${primaryColor}07 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />

      {/* ===== SCENE 1: Hook ===== */}
      {currentScene === 0 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Animated rings */}
          {[300, 500, 700].map((size, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              border: `1px solid ${primaryColor}${i === 0 ? '33' : i === 1 ? '22' : '11'}`,
              transform: `scale(${interpolate(frame, [i * 5, S1], [0, 1])})`,
              opacity: interpolate(frame, [i * 5, S1 * 0.6, S1], [0, 1, 0.3]),
            }} />
          ))}

          <div style={{
            color: primaryColor,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: fadeIn(0, 15),
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{ width: 24, height: 1, background: primaryColor }} />
            {brandName}
            <div style={{ width: 24, height: 1, background: primaryColor }} />
          </div>

          <div style={{
            fontSize: 100,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(8, 25),
            transform: `translateY(${slideUp(8, 60)}px)`,
            textAlign: 'center',
            letterSpacing: '-4px',
            lineHeight: 0.95,
            marginBottom: 28,
            maxWidth: 1400,
            padding: '0 80px',
          }}>
            {topic}
          </div>

          <div style={{
            width: interpolate(frame, [20, 50], [0, 160], { extrapolateRight: 'clamp' }),
            height: 3,
            background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
            borderRadius: 2,
            opacity: fadeIn(20, 35),
          }} />
        </AbsoluteFill>
      )}

      {/* ===== SCENE 2: Problem ===== */}
      {currentScene === 1 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 160px' }}>

          {/* Red problem accent */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 4,
            background: `linear-gradient(90deg, transparent, #EF444488, transparent)`,
            opacity: fadeIn(S1, S1 + 20),
          }} />

          <div style={{
            fontSize: 80,
            opacity: fadeIn(S1, S1 + 20),
            marginBottom: 32,
            transform: `scale(${spring({ frame: Math.max(0, frame - S1), fps, from: 0.5, to: 1, config: { damping: 8 } })})`,
          }}>
            😤
          </div>

          <div style={{
            color: '#EF4444',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 5,
            textTransform: 'uppercase',
            opacity: fadeIn(S1 + 5, S1 + 20),
            marginBottom: 24,
          }}>
            The Problem
          </div>

          <div style={{
            fontSize: 56,
            fontWeight: 800,
            color: '#FFFFFF',
            opacity: fadeIn(S1 + 12, S1 + 30),
            transform: `translateY(${slideUp(S1 + 12, 40)}px)`,
            textAlign: 'center',
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            maxWidth: 1100,
          }}>
            {problemStatement}
          </div>

          {/* Underline animation */}
          <div style={{
            marginTop: 40,
            height: 2,
            width: interpolate(frame, [S1 + 30, S1 + 60], [0, 300], { extrapolateRight: 'clamp' }),
            background: 'linear-gradient(90deg, #EF4444, transparent)',
            borderRadius: 1,
          }} />
        </AbsoluteFill>
      )}

      {/* ===== SCENE 3: Solution ===== */}
      {currentScene === 2 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 160px' }}>

          {/* Green solution accent */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${primaryColor}88, transparent)`,
            opacity: fadeIn(S2, S2 + 20),
          }} />

          <div style={{
            fontSize: 80,
            opacity: fadeIn(S2, S2 + 20),
            marginBottom: 32,
            transform: `scale(${spring({ frame: Math.max(0, frame - S2), fps, from: 0.5, to: 1, config: { damping: 8 } })})`,
          }}>
            💡
          </div>

          <div style={{
            color: primaryColor,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 5,
            textTransform: 'uppercase',
            opacity: fadeIn(S2 + 5, S2 + 20),
            marginBottom: 24,
          }}>
            The Solution
          </div>

          <div style={{
            fontSize: 56,
            fontWeight: 800,
            color: '#FFFFFF',
            opacity: fadeIn(S2 + 12, S2 + 30),
            transform: `translateY(${slideUp(S2 + 12, 40)}px)`,
            textAlign: 'center',
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            maxWidth: 1100,
          }}>
            {solutionStatement}
          </div>

          {/* Brand name stamp */}
          <div style={{
            marginTop: 48,
            background: `${primaryColor}22`,
            border: `1px solid ${primaryColor}44`,
            borderRadius: 50,
            padding: '10px 32px',
            color: primaryColor,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 2,
            opacity: fadeIn(S2 + 30, S2 + 50),
          }}>
            {brandName}
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 4: How It Works ===== */}
      {currentScene === 3 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 120px' }}>

          <div style={{
            color: accentColor,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 5,
            textTransform: 'uppercase',
            opacity: fadeIn(S3, S3 + 15),
            marginBottom: 56,
          }}>
            How it works
          </div>

          <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', width: '100%', maxWidth: 1200, justifyContent: 'center' }}>
            {stepsArray.map((step, i) => {
              const sStart = S3 + 15 + i * 20
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    opacity: interpolate(frame, [sStart, sStart + 15], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                    transform: `translateY(${spring({ frame: Math.max(0, frame - sStart), fps, from: 40, to: 0, config: { damping } })}px)`,
                  }}>
                    {/* Step circle */}
                    <div style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 26,
                      fontWeight: 800,
                      color: '#FFFFFF',
                      marginBottom: 24,
                      boxShadow: `0 0 30px ${primaryColor}44`,
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>

                    <div style={{
                      color: '#FFFFFF',
                      fontSize: 20,
                      fontWeight: 600,
                      textAlign: 'center',
                      lineHeight: 1.4,
                      maxWidth: 260,
                    }}>
                      {step}
                    </div>
                  </div>

                  {/* Arrow between steps */}
                  {i < stepsArray.length - 1 && (
                    <div style={{
                      color: `${primaryColor}44`,
                      fontSize: 28,
                      marginTop: 22,
                      opacity: interpolate(frame, [sStart + 10, sStart + 25], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                      flexShrink: 0,
                    }}>
                      →
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Proof point */}
          <div style={{
            marginTop: 60,
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}33`,
            borderRadius: 16,
            padding: '16px 40px',
            opacity: fadeIn(S3 + 50, S3 + 70),
          }}>
            <span style={{ color: accentColor, fontSize: 22, fontWeight: 800 }}>{proofPoint}</span>
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 5: CTA ===== */}
      {currentScene === 4 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          <div style={{
            position: 'absolute',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}18 0%, transparent 65%)`,
            transform: `scale(${interpolate(frame % 60, [0, 30, 60], [1, 1.06, 1])})`,
          }} />

          <div style={{
            color: primaryColor,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 5,
            textTransform: 'uppercase',
            opacity: fadeIn(S4, S4 + 15),
            marginBottom: 24,
          }}>
            {brandName}
          </div>

          <div style={{
            fontSize: 84,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(S4 + 8, S4 + 25),
            transform: `translateY(${slideUp(S4 + 8)}px)`,
            textAlign: 'center',
            letterSpacing: '-3px',
            lineHeight: 1,
            marginBottom: 48,
            maxWidth: 1200,
            padding: '0 80px',
          }}>
            {topic}
          </div>

          <div style={{
            opacity: fadeIn(S4 + 22, S4 + 40),
            transform: `translateY(${slideUp(S4 + 22, 30)}px)`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 60,
              padding: '22px 80px',
              color: '#FFFFFF',
              fontSize: 24,
              fontWeight: 800,
              boxShadow: `0 0 60px ${primaryColor}44`,
            }}>
              {callToAction} →
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene flash transitions */}
      {[S1, S2, S3, S4].map((t, i) => (
        <AbsoluteFill key={i} style={{
          background: '#000000',
          opacity: interpolate(frame, [t - 4, t, t + 10], [0, 0.85, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
          pointerEvents: 'none',
        }} />
      ))}

    </AbsoluteFill>
  )
}

export default ExplainerVideo