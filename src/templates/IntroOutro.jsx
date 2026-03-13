import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export const IntroOutro = ({
  channelName = 'Your Channel',
  tagline = 'Subscribe for more',
  niche = 'Tech & Innovation',
  socialLinks = '@yourchannel, youtube.com/yourchannel',
  subscriberCount = '100K Subscribers',
  uploadSchedule = 'Every Tuesday',
  callToAction = 'Subscribe Now',
  primaryColor = '#F59E0B',
  secondaryColor = '#EF4444',
  accentColor = '#8B5CF6',
  logoPath = null,
  fontFamily = 'Inter',
  type = 'Intro',
  style = 'Dynamic',
  animation = 'Smooth',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const damping = animation === 'Snappy' ? 22 : animation === 'Bounce' ? 5 : 12

  const linksArray = typeof socialLinks === 'string'
    ? socialLinks.split(',').map(l => l.trim()).filter(Boolean)
    : socialLinks

  const isIntro = type === 'Intro' || type === 'Both'
  const isOutro = type === 'Outro' || type === 'Both'

  // Proportional scene timing
  const S1 = Math.floor(durationInFrames * 0.20)  // Logo burst
  const S2 = Math.floor(durationInFrames * 0.55)  // Channel reveal
  const S3 = Math.floor(durationInFrames * 0.78)  // Social / info
  const S4 = durationInFrames                      // CTA

  const currentScene = frame < S1 ? 0 : frame < S2 ? 1 : frame < S3 ? 2 : 3

  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, dist = 50) =>
    spring({ frame: Math.max(0, frame - start), fps, from: dist, to: 0, config: { damping, stiffness: 100 } })

  const scaleIn = (start, from = 0.5) =>
    spring({ frame: Math.max(0, frame - start), fps, from, to: 1, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  // Spinning ring rotation
  const spin = interpolate(frame, [0, durationInFrames], [0, isIntro ? 360 : -360])

  // Counter spin
  const spinReverse = interpolate(frame, [0, durationInFrames], [0, isIntro ? -240 : 240])

  // Pulse
  const pulse = interpolate(frame % 50, [0, 25, 50], [1, 1.05, 1])

  return (
    <AbsoluteFill style={{ background: '#060608', fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Deep ambient glow */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 50%, ${primaryColor}15 0%, transparent 60%)`,
        transform: `scale(${pulse})`,
      }} />
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 20% 80%, ${accentColor}0C 0%, transparent 50%)`,
      }} />

      {/* ===== SCENE 1: Logo Burst ===== */}
      {currentScene === 0 && (
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* Spinning outer rings */}
          {[700, 550, 400].map((size, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              border: `${i === 0 ? 1 : i === 1 ? 1.5 : 2}px solid ${[primaryColor, secondaryColor, accentColor][i]}${['22', '33', '44'][i]}`,
              transform: `rotate(${[spin, spinReverse, spin * 1.5][i]}deg) scale(${interpolate(frame, [i * 3, Math.min(S1, 25)], [0, 1])})`,
              opacity: interpolate(frame, [i * 3, S1 * 0.5, S1], [0, 0.8, 0.4]),
            }} />
          ))}

          {/* Dashes on outer ring */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 360 + spin
            const rad = (angle * Math.PI) / 180
            const r = 350
            return (
              <div key={i} style={{
                position: 'absolute',
                width: 3,
                height: 12,
                background: primaryColor,
                borderRadius: 2,
                left: `calc(50% + ${Math.cos(rad) * r}px - 1.5px)`,
                top: `calc(50% + ${Math.sin(rad) * r}px - 6px)`,
                opacity: interpolate(frame, [5, 20], [0, 0.5], { extrapolateRight: 'clamp' }),
              }} />
            )
          })}

          {/* Center logo */}
          <div style={{
            width: 140,
            height: 140,
            borderRadius: 36,
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 60,
            opacity: fadeIn(4, 18),
            transform: `scale(${scaleIn(4, 0.3)})`,
            boxShadow: `0 0 80px ${primaryColor}55, 0 0 160px ${primaryColor}22`,
            zIndex: 2,
          }}>
            🎬
          </div>

          {/* Niche label */}
          <div style={{
            position: 'absolute',
            bottom: '28%',
            color: primaryColor,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 5,
            textTransform: 'uppercase',
            opacity: fadeIn(12, 25),
          }}>
            {niche}
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 2: Channel Reveal ===== */}
      {currentScene === 1 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Continued spinning rings in background */}
          <div style={{
            position: 'absolute',
            width: 900,
            height: 900,
            borderRadius: '50%',
            border: `1px solid ${primaryColor}12`,
            transform: `rotate(${spin}deg)`,
          }} />
          <div style={{
            position: 'absolute',
            width: 700,
            height: 700,
            borderRadius: '50%',
            border: `1px solid ${secondaryColor}15`,
            transform: `rotate(${spinReverse}deg)`,
          }} />

          {/* Channel name — hero */}
          <div style={{
            fontSize: 120,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(S1, S1 + 18),
            transform: `scale(${scaleIn(S1, 0.7)}) translateY(${slideUp(S1, 40)}px)`,
            textAlign: 'center',
            letterSpacing: '-4px',
            lineHeight: 0.95,
            marginBottom: 24,
            textShadow: `0 0 80px ${primaryColor}33`,
          }}>
            {channelName}
          </div>

          {/* Animated color bar under name */}
          <div style={{
            height: 4,
            width: interpolate(frame, [S1 + 15, S1 + 45], [0, 400], { extrapolateRight: 'clamp' }),
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
            borderRadius: 2,
            marginBottom: 28,
          }} />

          {/* Tagline */}
          <div style={{
            fontSize: 28,
            fontWeight: 400,
            color: '#888',
            opacity: fadeIn(S1 + 20, S1 + 38),
            transform: `translateY(${slideUp(S1 + 20, 25)}px)`,
            textAlign: 'center',
            letterSpacing: 0.5,
          }}>
            {tagline}
          </div>

          {/* Subscriber count badge */}
          <div style={{
            marginTop: 40,
            background: `${primaryColor}22`,
            border: `1px solid ${primaryColor}44`,
            borderRadius: 50,
            padding: '12px 32px',
            color: primaryColor,
            fontSize: 16,
            fontWeight: 700,
            opacity: fadeIn(S1 + 32, S1 + 50),
            transform: `translateY(${slideUp(S1 + 32, 20)}px)`,
          }}>
            ✦ {subscriberCount}
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 3: Social + Schedule ===== */}
      {currentScene === 2 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 120px' }}>

          <div style={{
            color: accentColor,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 5,
            textTransform: 'uppercase',
            opacity: fadeIn(S2, S2 + 15),
            marginBottom: 48,
          }}>
            Find us everywhere
          </div>

          {/* Social links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center', marginBottom: 52 }}>
            {linksArray.map((link, i) => {
              const lStart = S2 + 12 + i * 15
              return (
                <div key={i} style={{
                  background: '#0E0E18',
                  border: `1px solid ${primaryColor}33`,
                  borderRadius: 16,
                  padding: '20px 36px',
                  opacity: interpolate(frame, [lStart, lStart + 12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                  transform: `translateY(${spring({ frame: Math.max(0, frame - lStart), fps, from: 30, to: 0, config: { damping } })}px)`,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: 2,
                    background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
                  }} />
                  <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 600 }}>{link}</div>
                </div>
              )
            })}
          </div>

          {/* Upload schedule */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: '#0E0E18',
            border: `1px solid ${secondaryColor}33`,
            borderRadius: 60,
            padding: '14px 36px',
            opacity: fadeIn(S2 + 45, S2 + 60),
          }}>
            <div style={{ fontSize: 22 }}>📅</div>
            <div>
              <div style={{ color: '#666', fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' }}>New videos</div>
              <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>{uploadSchedule}</div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 4: CTA ===== */}
      {currentScene === 3 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Background rings */}
          <div style={{
            position: 'absolute',
            width: 800,
            height: 800,
            borderRadius: '50%',
            border: `1px solid ${primaryColor}18`,
            transform: `rotate(${spin}deg) scale(${pulse})`,
          }} />

          {/* Logo small */}
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 22,
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 34,
            opacity: fadeIn(S3, S3 + 15),
            transform: `scale(${scaleIn(S3, 0.6)})`,
            marginBottom: 28,
            boxShadow: `0 0 50px ${primaryColor}44`,
          }}>
            🎬
          </div>

          <div style={{
            fontSize: 96,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(S3 + 8, S3 + 25),
            transform: `translateY(${slideUp(S3 + 8, 40)}px)`,
            textAlign: 'center',
            letterSpacing: '-3px',
            lineHeight: 0.95,
            marginBottom: 16,
          }}>
            {channelName}
          </div>

          <div style={{
            color: '#666',
            fontSize: 20,
            fontWeight: 400,
            opacity: fadeIn(S3 + 15, S3 + 30),
            marginBottom: 48,
          }}>
            {tagline}
          </div>

          <div style={{
            opacity: fadeIn(S3 + 25, S3 + 42),
            transform: `scale(${pulse})`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 60,
              padding: '22px 72px',
              color: '#FFFFFF',
              fontSize: 24,
              fontWeight: 800,
              boxShadow: `0 0 60px ${primaryColor}44`,
            }}>
              {callToAction} 🔔
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene flash transitions */}
      {[S1, S2, S3].map((t, i) => (
        <AbsoluteFill key={i} style={{
          background: '#000000',
          opacity: interpolate(frame, [t - 4, t, t + 10], [0, 0.88, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
          pointerEvents: 'none',
        }} />
      ))}

    </AbsoluteFill>
  )
}

export default IntroOutro