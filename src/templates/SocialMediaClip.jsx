// LOCATION: src/templates/SocialMediaClip.jsx

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export const SocialMediaClip = ({
  hookText = 'Wait for it...',
  revealText = 'Mind = Blown 🤯',
  caption = 'This changed everything for me 🔥',
  subCaption = 'You need to try this',
  hashtags = '#viral, #trending, #fyp, #foryou',
  brandHandle = '@yourbrand',
  callToAction = 'Follow for more',
  platform = 'tiktok',
  primaryColor = '#A855F7',
  secondaryColor = '#EC4899',
  accentColor = '#06B6D4',
  fontFamily = 'Inter',
  format = 'Square',
  style = 'Bold',
  energy = 'High',
  vibe = 'Hype',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames, width, height } = useVideoConfig()

  const hashtagsArray = typeof hashtags === 'string'
    ? hashtags.split(',').map(h => h.trim()).filter(Boolean)
    : Array.isArray(hashtags) ? hashtags : []

  const isVertical = format === 'Vertical' || height > width
  const damping = energy === 'High' ? 6 : energy === 'Chill' ? 20 : 11

  // ── Proportional scene timing ──
  const S1 = Math.floor(durationInFrames * 0.20) // Hook
  const S2 = Math.floor(durationInFrames * 0.44) // Reveal
  const S3 = Math.floor(durationInFrames * 0.68) // Caption + hashtags
  const S4 = durationInFrames                     // CTA

  const scene = frame < S1 ? 0 : frame < S2 ? 1 : frame < S3 ? 2 : 3

  // ── Helpers ──
  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, dist = 50) =>
    spring({ frame: Math.max(0, frame - start), fps, from: dist, to: 0, config: { damping } })

  const scaleSpring = (start, from = 0.5) =>
    spring({ frame: Math.max(0, frame - start), fps, from, to: 1, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const flashOpacity = (t) =>
    interpolate(frame, [t - 2, t, t + 6], [0, 0.95, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  // ── Platform config ──
  const platformConfig = {
    tiktok: { icon: '♪', color: '#69C9D0', label: 'TikTok' },
    instagram: { icon: '◈', color: '#E1306C', label: 'Instagram' },
    youtube: { icon: '▶', color: '#FF0000', label: 'YouTube' },
    twitter: { icon: '✦', color: '#1DA1F2', label: 'Twitter' },
    linkedin: { icon: '◆', color: '#0A66C2', label: 'LinkedIn' },
  }
  const pConfig = platformConfig[platform] || platformConfig.tiktok

  // ── Pulse ──
  const pulse = interpolate(frame % 22, [0, 11, 22], [1, 1.06, 1])

  // ── RGB Glitch effect ──
  const glitchActive = scene === 1
    ? interpolate(frame % 12, [0, 1, 2, 10, 11, 12], [0, 1, 0, 0, 0.6, 0])
    : scene === 0
    ? interpolate(frame % 30, [0, 1, 2, 28, 29, 30], [0, 0.5, 0, 0, 0.3, 0])
    : 0

  // ── Velocity ramp — speed lines ──
  const SpeedLines = ({ count = 12, startFrame }) => (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 360
        const length = 60 + (i % 4) * 30
        const op = interpolate(frame, [startFrame, startFrame + 8, startFrame + 14], [0, 0.6, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
        const rad = (angle * Math.PI) / 180
        return (
          <div key={i} style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: length, height: 2,
            background: `linear-gradient(90deg, ${primaryColor}, transparent)`,
            opacity: op,
            transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${80 + i * 5}px)`,
            pointerEvents: 'none',
          }} />
        )
      })}
    </>
  )

  // ── Word-by-word caption reveal ──
  const WordReveal = ({ text, startFrame, fontSize = 52, color = '#FFFFFF', stagger = 6 }) => {
    const words = text.split(' ')
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 10px', textAlign: 'center' }}>
        {words.map((word, i) => {
          const wf = startFrame + i * stagger
          const op = interpolate(frame, [wf, wf + 10], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
          const y = spring({ frame: Math.max(0, frame - wf), fps, from: 25, to: 0, config: { damping } })
          const sc = spring({ frame: Math.max(0, frame - wf), fps, from: 0.6, to: 1, config: { damping: 7 } })
          return (
            <span key={i} style={{
              fontSize, fontWeight: 900, color,
              opacity: op,
              transform: `translateY(${y}px) scale(${sc})`,
              display: 'inline-block',
              letterSpacing: '-1px', lineHeight: 1.15,
            }}>
              {word}
            </span>
          )
        })}
      </div>
    )
  }

  // ── Bubble pop ──
  const BubblePop = ({ text, startFrame, color = primaryColor, fontSize = 20 }) => {
    const sc = spring({ frame: Math.max(0, frame - startFrame), fps, from: 0, to: 1, config: { damping: 5, stiffness: 220 } })
    const op = interpolate(frame, [startFrame, startFrame + 8], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    return (
      <span style={{
        background: `${color}22`,
        border: `1.5px solid ${color}66`,
        borderRadius: 50, padding: '8px 20px',
        color, fontSize, fontWeight: 700,
        opacity: op,
        transform: `scale(${sc})`,
        display: 'inline-block',
        boxShadow: `0 0 16px ${color}44`,
      }}>
        {text}
      </span>
    )
  }

  // ── Confetti dots ──
  const Confetti = ({ startFrame }) => (
    <>
      {Array.from({ length: 16 }).map((_, i) => {
        const pf = Math.max(0, frame - startFrame)
        const angle = (i / 16) * Math.PI * 2
        const dist = 120 + (i % 4) * 60
        const progress = interpolate(pf, [0, 35], [0, 1], { extrapolateRight: 'clamp' })
        const x = Math.cos(angle) * dist * progress
        const y = Math.sin(angle) * dist * progress + (pf * 1.5)
        const op = interpolate(pf, [0, 6, 35], [0, 1, 0], { extrapolateRight: 'clamp' })
        const colors = [primaryColor, secondaryColor, accentColor, '#FFFFFF', '#F59E0B']
        return (
          <div key={i} style={{
            position: 'absolute',
            left: '50%', top: '40%',
            width: 8, height: 8,
            borderRadius: i % 2 === 0 ? '50%' : '2px',
            background: colors[i % colors.length],
            opacity: op,
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${pf * 6 + i * 30}deg)`,
            pointerEvents: 'none',
          }} />
        )
      })}
    </>
  )

  return (
    <AbsoluteFill style={{ background: '#130A1E', fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Deep purple base glow */}
      <AbsoluteFill style={{
        background: `
          radial-gradient(ellipse at 50% 30%, ${primaryColor}20 0%, transparent 55%),
          radial-gradient(ellipse at 20% 80%, ${secondaryColor}14 0%, transparent 45%),
          radial-gradient(ellipse at 80% 70%, ${accentColor}10 0%, transparent 45%)
        `,
      }} />

      {/* Subtle diagonal lines */}
      <AbsoluteFill style={{
        backgroundImage: `repeating-linear-gradient(
          -55deg,
          transparent,
          transparent 50px,
          ${primaryColor}04 50px,
          ${primaryColor}04 51px
        )`,
        pointerEvents: 'none',
      }} />

      {/* RGB Glitch layers */}
      {glitchActive > 0 && (
        <>
          <AbsoluteFill style={{
            background: `${primaryColor}08`,
            transform: `translateX(${glitchActive * 8}px)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            zIndex: 96,
          }} />
          <AbsoluteFill style={{
            background: `${secondaryColor}08`,
            transform: `translateX(${-glitchActive * 6}px) translateY(${glitchActive * 3}px)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            zIndex: 96,
          }} />
          <AbsoluteFill style={{
            background: `${accentColor}05`,
            transform: `translateX(${glitchActive * 3}px) translateY(${-glitchActive * 2}px)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            zIndex: 96,
          }} />
        </>
      )}

      {/* Top progress bar — native feel */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3, background: '#FFFFFF10', zIndex: 10,
      }}>
        <div style={{
          height: '100%',
          width: `${interpolate(frame, [0, durationInFrames], [0, 100], { extrapolateRight: 'clamp' })}%`,
          background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
          boxShadow: `0 0 6px ${primaryColor}`,
        }} />
      </div>

      {/* Platform badge */}
      <div style={{
        position: 'absolute', top: 24, left: 36,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(12px)',
        borderRadius: 50, padding: '8px 20px',
        display: 'flex', alignItems: 'center', gap: 8,
        opacity: fadeIn(0, 14), zIndex: 10,
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <span style={{ color: pConfig.color, fontSize: 16, fontWeight: 700 }}>{pConfig.icon}</span>
        <span style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600 }}>{pConfig.label}</span>
      </div>

      {/* Brand handle */}
      <div style={{
        position: 'absolute', top: 24, right: 36,
        color: '#FFFFFF55', fontSize: 14, fontWeight: 600,
        opacity: fadeIn(4, 18), zIndex: 10,
      }}>
        {brandHandle}
      </div>

      {/* ══════════════════════════════════
          SCENE 0 — Hook
      ══════════════════════════════════ */}
      {scene === 0 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isVertical ? '120px 60px' : '80px 120px' }}>

          {/* Animated dots */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 32, opacity: fadeIn(0, 16) }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 12, height: 12, borderRadius: '50%',
                background: [primaryColor, secondaryColor, accentColor][i],
                transform: `scale(${interpolate((frame + i * 8) % 24, [0, 12, 24], [1, 1.9, 1])})`,
                opacity: interpolate((frame + i * 8) % 24, [0, 12, 24], [0.4, 1, 0.4]),
                boxShadow: `0 0 12px ${[primaryColor, secondaryColor, accentColor][i]}`,
              }} />
            ))}
          </div>

          {/* Hook text */}
          <WordReveal text={hookText} startFrame={6} fontSize={isVertical ? 72 : 92} color="#FFFFFF" stagger={7} />

          {/* Speed lines on hook */}
          <SpeedLines count={10} startFrame={8} />

          {/* Velocity bubble pop */}
          <div style={{ marginTop: 32, opacity: fadeIn(16, 28) }}>
            <BubblePop text="🔥 Must Watch" startFrame={18} color={primaryColor} fontSize={18} />
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 1 — Reveal
      ══════════════════════════════════ */}
      {scene === 1 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isVertical ? '120px 60px' : '80px 120px' }}>

          {/* White flash on entry */}
          <AbsoluteFill style={{
            background: '#FFFFFF',
            opacity: interpolate(frame, [S1, S1 + 4, S1 + 10], [0.7, 0.2, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
            pointerEvents: 'none',
          }} />

          {/* Confetti burst */}
          <Confetti startFrame={S1 + 3} />

          {/* Speed lines */}
          <SpeedLines count={14} startFrame={S1 + 2} />

          {/* Reveal text — gradient */}
          <div style={{
            fontSize: isVertical ? 78 : 108,
            fontWeight: 900,
            textAlign: 'center',
            letterSpacing: '-2px', lineHeight: 1,
            opacity: fadeIn(S1 + 4, S1 + 18),
            transform: `scale(${scaleSpring(S1 + 4, 1.5)})`,
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: `drop-shadow(0 0 30px ${primaryColor}66)`,
            marginBottom: 20,
          }}>
            {revealText}
          </div>

          {/* Sub caption */}
          <div style={{
            fontSize: isVertical ? 22 : 28,
            fontWeight: 400, color: '#AAAAAA',
            opacity: fadeIn(S1 + 16, S1 + 30),
            transform: `translateY(${slideUp(S1 + 16, 20)}px)`,
            textAlign: 'center',
          }}>
            {subCaption}
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 2 — Caption + Hashtags
      ══════════════════════════════════ */}
      {scene === 2 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isVertical ? '120px 60px' : '80px 140px' }}>

          {/* Caption word by word */}
          <WordReveal
            text={caption}
            startFrame={S2 + 4}
            fontSize={isVertical ? 50 : 68}
            color="#FFFFFF"
            stagger={5}
          />

          {/* Hashtags staggered */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 12,
            justifyContent: 'center', marginTop: 36,
          }}>
            {hashtagsArray.map((tag, i) => {
              const tStart = S2 + 20 + i * 10
              return (
                <span key={i} style={{
                  color: [primaryColor, secondaryColor, accentColor][i % 3],
                  fontSize: isVertical ? 22 : 26,
                  fontWeight: 700,
                  opacity: interpolate(frame, [tStart, tStart + 10], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                  transform: `translateY(${spring({ frame: Math.max(0, frame - tStart), fps, from: 18, to: 0, config: { damping } })}px)`,
                  display: 'inline-block',
                  filter: `drop-shadow(0 0 8px ${[primaryColor, secondaryColor, accentColor][i % 3]}88)`,
                }}>
                  {tag}
                </span>
              )
            })}
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 3 — CTA
      ══════════════════════════════════ */}
      {scene === 3 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isVertical ? '120px 60px' : '80px 120px' }}>

          {/* Bloom */}
          <div style={{
            position: 'absolute', width: 600, height: 600, borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}20 0%, transparent 65%)`,
            transform: `scale(${pulse})`,
            pointerEvents: 'none',
          }} />

          {/* Caption */}
          <div style={{
            fontSize: isVertical ? 56 : 80,
            fontWeight: 900, color: '#FFFFFF',
            opacity: fadeIn(S3, S3 + 16),
            transform: `translateY(${slideUp(S3, 40)}px) scale(${scaleSpring(S3)})`,
            textAlign: 'center', letterSpacing: '-2px', lineHeight: 1.1,
            marginBottom: 24,
          }}>
            {caption}
          </div>

          {/* Handle */}
          <div style={{
            color: '#FFFFFF55', fontSize: 16, fontWeight: 600,
            opacity: fadeIn(S3 + 12, S3 + 24),
            marginBottom: 40,
          }}>
            {brandHandle}
          </div>

          {/* CTA button */}
          <div style={{
            opacity: fadeIn(S3 + 20, S3 + 34),
            transform: `scale(${scaleSpring(S3 + 20, 0.8) * pulse})`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 60,
              padding: '20px 64px',
              color: '#FFFFFF',
              fontSize: 22, fontWeight: 800,
              boxShadow: `0 0 50px ${primaryColor}55, 0 0 100px ${primaryColor}22`,
              letterSpacing: 0.5,
            }}>
              {callToAction} ↑
            </div>
          </div>

          {/* Emoji float up — live stream feel */}
          {Array.from({ length: 6 }).map((_, i) => {
            const emojis = ['🔥', '❤️', '😍', '💯', '⚡', '🚀']
            const ef = S3 + i * 8
            const pf = Math.max(0, frame - ef)
            const y = interpolate(pf, [0, 60], [0, -200], { extrapolateRight: 'clamp' })
            const op = interpolate(pf, [0, 6, 50, 60], [0, 1, 0.8, 0], { extrapolateRight: 'clamp' })
            return (
              <div key={i} style={{
                position: 'absolute',
                bottom: '20%',
                left: `${15 + i * 13}%`,
                fontSize: 28,
                opacity: op,
                transform: `translateY(${y}px)`,
                pointerEvents: 'none',
              }}>
                {emojis[i]}
              </div>
            )
          })}

        </AbsoluteFill>
      )}

      {/* Scene flash transitions */}
      {[S1, S2, S3].map((t, i) => (
        <AbsoluteFill key={i} style={{
          background: i === 0 ? '#FFFFFF' : '#000000',
          opacity: flashOpacity(t),
          pointerEvents: 'none',
          zIndex: 50,
        }} />
      ))}

    </AbsoluteFill>
  )
}

export default SocialMediaClip