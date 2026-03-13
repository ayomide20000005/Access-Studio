import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export const SocialMediaClip = ({
  caption = 'This changed everything for me 🔥',
  subCaption = 'You need to try this',
  hashtags = '#viral, #trending, #fyp, #foryou',
  platform = 'tiktok',
  callToAction = 'Follow for more',
  hookText = 'Wait for it...',
  revealText = 'Mind = Blown',
  brandHandle = '@yourbrand',
  primaryColor = '#EC4899',
  secondaryColor = '#8B5CF6',
  accentColor = '#F59E0B',
  fontFamily = 'Inter',
  format = 'Vertical',
  style = 'Bold',
  energy = 'High',
  vibe = 'Hype',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames, width, height } = useVideoConfig()

  const hashtagsArray = typeof hashtags === 'string'
    ? hashtags.split(',').map(h => h.trim()).filter(Boolean)
    : hashtags

  const isVertical = format === 'Vertical' || height > width
  const damping = energy === 'High' ? 7 : energy === 'Chill' ? 20 : 12

  // Proportional scene timing
  const S1 = Math.floor(durationInFrames * 0.18)  // Hook
  const S2 = Math.floor(durationInFrames * 0.42)  // Reveal
  const S3 = Math.floor(durationInFrames * 0.68)  // Caption + hashtags
  const S4 = durationInFrames                      // CTA

  const currentScene = frame < S1 ? 0 : frame < S2 ? 1 : frame < S3 ? 2 : 3

  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, dist = 50) =>
    spring({ frame: Math.max(0, frame - start), fps, from: dist, to: 0, config: { damping, stiffness: 120 } })

  const scaleIn = (start, from = 0.5) =>
    spring({ frame: Math.max(0, frame - start), fps, from, to: 1, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const pulse = interpolate(frame % 20, [0, 10, 20], [1, 1.05, 1])
  const shake = energy === 'High'
    ? interpolate(frame % 6, [0, 2, 4, 6], [0, -2, 2, 0])
    : 0

  const platformConfig = {
    tiktok: { icon: '♪', color: '#00F2EA', label: 'TikTok' },
    instagram: { icon: '◈', color: '#E1306C', label: 'Instagram' },
    youtube: { icon: '▶', color: '#FF0000', label: 'YouTube Shorts' },
    twitter: { icon: '✦', color: '#1DA1F2', label: 'Twitter' },
    linkedin: { icon: '◆', color: '#0A66C2', label: 'LinkedIn' },
  }
  const pConfig = platformConfig[platform] || platformConfig.tiktok

  const getBg = () => {
    if (style === 'Clean') return '#FAFAFA'
    if (style === 'Minimal') return '#0A0A0A'
    if (vibe === 'Aesthetic') return `linear-gradient(160deg, #0A0010 0%, #10001A 100%)`
    return '#080810'
  }

  const textColor = style === 'Clean' ? '#0A0A0A' : '#FFFFFF'

  return (
    <AbsoluteFill style={{ background: getBg(), fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Dynamic background */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 40%, ${primaryColor}18 0%, transparent 55%),
                     radial-gradient(ellipse at 20% 80%, ${secondaryColor}12 0%, transparent 50%)`,
        transform: `scale(${pulse})`,
      }} />

      {/* Platform badge — always visible */}
      <div style={{
        position: 'absolute',
        top: 40,
        left: 40,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(12px)',
        borderRadius: 50,
        padding: '10px 22px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        opacity: fadeIn(0, 15),
        zIndex: 10,
      }}>
        <span style={{ color: pConfig.color, fontSize: 18 }}>{pConfig.icon}</span>
        <span style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 700 }}>{pConfig.label}</span>
      </div>

      {/* Brand handle — always visible */}
      <div style={{
        position: 'absolute',
        top: 40,
        right: 40,
        color: '#555',
        fontSize: 15,
        fontWeight: 600,
        opacity: fadeIn(5, 20),
        zIndex: 10,
      }}>
        {brandHandle}
      </div>

      {/* ===== SCENE 1: Hook ===== */}
      {currentScene === 0 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isVertical ? '120px 60px' : '80px 120px' }}>

          {/* Attention grabber */}
          <div style={{
            fontSize: 80,
            opacity: fadeIn(0, 12),
            transform: `scale(${scaleIn(0, 0.3)}) rotate(${interpolate(frame, [0, 15], [-10, 0])}deg)`,
            marginBottom: 24,
          }}>
            👀
          </div>

          <div style={{
            fontSize: isVertical ? 72 : 96,
            fontWeight: 900,
            color: textColor,
            opacity: fadeIn(6, 20),
            transform: `translateY(${slideUp(6, 40)}px) translateX(${shake}px)`,
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: '-2px',
            textShadow: style !== 'Clean' ? `0 0 60px ${primaryColor}55` : 'none',
          }}>
            {hookText}
          </div>

          {/* Animated dots */}
          <div style={{
            display: 'flex',
            gap: 12,
            marginTop: 32,
            opacity: fadeIn(14, 28),
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: primaryColor,
                transform: `scale(${interpolate((frame + i * 8) % 24, [0, 12, 24], [1, 1.8, 1])})`,
                opacity: interpolate((frame + i * 8) % 24, [0, 12, 24], [0.4, 1, 0.4]),
              }} />
            ))}
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 2: Reveal ===== */}
      {currentScene === 1 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isVertical ? '120px 60px' : '80px 120px' }}>

          {/* Flash effect */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#FFFFFF',
            opacity: interpolate(frame, [S1, S1 + 4, S1 + 10], [0.8, 0.3, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
          }} />

          {/* Reveal text — massive */}
          <div style={{
            fontSize: isVertical ? 80 : 120,
            fontWeight: 900,
            textAlign: 'center',
            lineHeight: 1,
            letterSpacing: '-3px',
            opacity: fadeIn(S1 + 5, S1 + 20),
            transform: `scale(${scaleIn(S1 + 5, 1.4)})`,
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: `drop-shadow(0 0 40px ${primaryColor}66)`,
            marginBottom: 24,
          }}>
            {revealText}
          </div>

          <div style={{
            fontSize: isVertical ? 24 : 32,
            fontWeight: 500,
            color: style === 'Clean' ? '#444' : '#888',
            opacity: fadeIn(S1 + 18, S1 + 35),
            transform: `translateY(${slideUp(S1 + 18, 20)}px)`,
            textAlign: 'center',
          }}>
            {subCaption}
          </div>

          {/* Confetti-like dots */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: [primaryColor, secondaryColor, accentColor][i % 3],
              left: `${10 + (i * 7.5)}%`,
              top: `${20 + Math.sin(i * 1.2) * 30}%`,
              opacity: interpolate(frame, [S1 + 5, S1 + 15, S1 + 40], [0, 0.8, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
              transform: `translateY(${interpolate(frame, [S1 + 5, S1 + 40], [0, -60 - i * 5], { extrapolateRight: 'clamp' })}px)`,
            }} />
          ))}
        </AbsoluteFill>
      )}

      {/* ===== SCENE 3: Caption + Hashtags ===== */}
      {currentScene === 2 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isVertical ? '120px 60px' : '80px 140px' }}>

          <div style={{
            fontSize: isVertical ? 52 : 72,
            fontWeight: 900,
            color: textColor,
            opacity: fadeIn(S2, S2 + 18),
            transform: `translateY(${slideUp(S2, 40)}px)`,
            textAlign: 'center',
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            marginBottom: 36,
            maxWidth: isVertical ? 900 : 1400,
          }}>
            {caption}
          </div>

          {/* Hashtags */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'center',
            marginBottom: 0,
          }}>
            {hashtagsArray.map((tag, i) => {
              const tStart = S2 + 15 + i * 10
              return (
                <span key={i} style={{
                  color: [primaryColor, secondaryColor, accentColor][i % 3],
                  fontSize: isVertical ? 22 : 26,
                  fontWeight: 700,
                  opacity: interpolate(frame, [tStart, tStart + 10], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                  transform: `translateY(${spring({ frame: Math.max(0, frame - tStart), fps, from: 20, to: 0, config: { damping } })}px)`,
                }}>
                  {tag}
                </span>
              )
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 4: CTA ===== */}
      {currentScene === 3 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isVertical ? '120px 60px' : '80px 120px' }}>

          <div style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}20 0%, transparent 65%)`,
            transform: `scale(${pulse})`,
          }} />

          <div style={{
            fontSize: isVertical ? 64 : 88,
            fontWeight: 900,
            color: textColor,
            opacity: fadeIn(S3, S3 + 18),
            transform: `translateY(${slideUp(S3, 40)}px) scale(${scaleIn(S3)})`,
            textAlign: 'center',
            letterSpacing: '-2px',
            lineHeight: 1.1,
            marginBottom: 32,
          }}>
            {caption}
          </div>

          <div style={{
            color: '#666',
            fontSize: 18,
            fontWeight: 600,
            opacity: fadeIn(S3 + 12, S3 + 25),
            marginBottom: 40,
          }}>
            {brandHandle}
          </div>

          <div style={{
            opacity: fadeIn(S3 + 20, S3 + 38),
            transform: `scale(${pulse})`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 60,
              padding: '20px 64px',
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: 800,
              boxShadow: `0 0 50px ${primaryColor}44`,
            }}>
              {callToAction} ↑
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene flash transitions */}
      {[S1, S2, S3].map((t, i) => (
        <AbsoluteFill key={i} style={{
          background: i === 1 ? '#FFFFFF' : '#000000',
          opacity: interpolate(frame, [t - 3, t, t + 8], [0, i === 1 ? 0.7 : 0.9, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
          pointerEvents: 'none',
        }} />
      ))}

    </AbsoluteFill>
  )
}

export default SocialMediaClip