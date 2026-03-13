// LOCATION: src/templates/IntroOutro.jsx

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export const IntroOutro = ({
  channelName = 'Your Channel',
  tagline = 'Subscribe for more',
  niche = 'Tech & Innovation',
  socialLinks = '@yourchannel, youtube.com/yourchannel',
  subscriberCount = '100K Subscribers',
  uploadSchedule = 'Every Tuesday',
  callToAction = 'Subscribe Now',
  primaryColor = '#B8860B',
  secondaryColor = '#8B6914',
  accentColor = '#D4AF37',
  fontFamily = 'Inter',
  type = 'Intro',
  style = 'Dynamic',
  animation = 'Smooth',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const linksArray = typeof socialLinks === 'string'
    ? socialLinks.split(',').map(l => l.trim()).filter(Boolean)
    : Array.isArray(socialLinks) ? socialLinks : []

  const damping = animation === 'Snappy' ? 22 : animation === 'Bounce' ? 5 : 12

  // ── Proportional scene timing ──
  const S1 = Math.floor(durationInFrames * 0.22) // Logo burst
  const S2 = Math.floor(durationInFrames * 0.52) // Channel reveal
  const S3 = Math.floor(durationInFrames * 0.76) // Social + info
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
    interpolate(frame, [t - 3, t, t + 8], [0, 0.7, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  // ── Spinning rings ──
  const spin = interpolate(frame, [0, durationInFrames], [0, 360])
  const spinR = interpolate(frame, [0, durationInFrames], [0, -240])

  // ── Gold shimmer sweep ──
  const shimmerX = interpolate(frame % 80, [0, 80], [-200, 200])

  // ── Bloom pulse ──
  const bloom = interpolate(frame % 55, [0, 27, 55], [0.97, 1.04, 0.97])

  // ── Popping text burst — letters explode in from center ──
  const PoppingText = ({ text, startFrame, fontSize = 100, color = '#1A1200' }) => {
    const letters = text.split('')
    const delay = 3
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        {letters.map((char, i) => {
          const lf = startFrame + i * delay
          const op = interpolate(frame, [lf, lf + 10], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
          const sc = spring({ frame: Math.max(0, frame - lf), fps, from: 2.5, to: 1, config: { damping: 6, stiffness: 280 } })
          const blur = interpolate(frame, [lf, lf + 14], [8, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
          return (
            <span key={i} style={{
              fontSize,
              fontWeight: 900,
              color,
              opacity: op,
              transform: `scale(${sc})`,
              filter: `blur(${blur}px)`,
              display: 'inline-block',
              letterSpacing: '-2px',
              lineHeight: 1,
            }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          )
        })}
      </div>
    )
  }

  // ── Neon glow trail for tagline — but gold version ──
  const GoldGlowReveal = ({ text, startFrame, fontSize = 28, color = primaryColor }) => {
    const words = text.split(' ')
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 10px' }}>
        {words.map((word, i) => {
          const wf = startFrame + i * 7
          const op = interpolate(frame, [wf, wf + 14], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
          const glowI = interpolate(frame, [wf, wf + 10, wf + 30], [2, 1, 0.2], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
          return (
            <span key={i} style={{
              fontSize, fontWeight: 600, color,
              opacity: op,
              display: 'inline-block',
              filter: `drop-shadow(0 0 ${glowI * 12}px ${color})`,
              letterSpacing: 1,
            }}>
              {word}
            </span>
          )
        })}
      </div>
    )
  }

  // ── Particle burst — gold particles ──
  const ParticleBurst = ({ startFrame, count = 28 }) => (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        const dist = 90 + (i % 4) * 50
        const pf = Math.max(0, frame - startFrame)
        const progress = interpolate(pf, [0, 42], [0, 1], { extrapolateRight: 'clamp' })
        const x = Math.cos(angle) * dist * progress
        const y = Math.sin(angle) * dist * progress
        const op = interpolate(pf, [0, 6, 42], [0, 1, 0], { extrapolateRight: 'clamp' })
        const size = interpolate(pf, [0, 42], [7, 2], { extrapolateRight: 'clamp' })
        const colors = [accentColor, primaryColor, '#F5E6C8', '#FFFFFF']
        return (
          <div key={i} style={{
            position: 'absolute',
            left: '50%', top: '50%',
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

  return (
    <AbsoluteFill style={{ background: '#F5F0E8', fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Cream paper texture base */}
      <AbsoluteFill style={{
        background: `
          radial-gradient(ellipse at 20% 30%, ${accentColor}18 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, ${primaryColor}12 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, #FFF8EC 0%, #F5F0E8 100%)
        `,
      }} />

      {/* Subtle warm grain */}
      <AbsoluteFill style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 40px,
          ${accentColor}05 40px,
          ${accentColor}05 41px
        )`,
        opacity: 0.6,
        pointerEvents: 'none',
      }} />

      {/* ══════════════════════════════════
          SCENE 0 — Logo Burst
      ══════════════════════════════════ */}
      {scene === 0 && (
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* Spinning gold rings */}
          {[700, 520, 360].map((size, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: size, height: size,
              borderRadius: '50%',
              border: `${i === 2 ? 2 : 1}px solid ${[accentColor, primaryColor, secondaryColor][i]}${['33', '44', '66'][i]}`,
              transform: `rotate(${[spin, spinR, spin * 1.4][i]}deg) scale(${interpolate(frame, [i * 4, 22], [0.2, 1], { extrapolateRight: 'clamp' })})`,
              opacity: interpolate(frame, [i * 4, S1 * 0.6, S1], [0, 0.8, 0.3]),
            }} />
          ))}

          {/* Gold tick marks on outer ring */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 360 + spin
            const rad = (angle * Math.PI) / 180
            const r = 350
            return (
              <div key={i} style={{
                position: 'absolute',
                width: 3, height: 14,
                background: accentColor,
                borderRadius: 2,
                left: `calc(50% + ${Math.cos(rad) * r}px - 1.5px)`,
                top: `calc(50% + ${Math.sin(rad) * r}px - 7px)`,
                opacity: interpolate(frame, [6, 22], [0, 0.5], { extrapolateRight: 'clamp' }),
              }} />
            )
          })}

          {/* Center logo circle */}
          <div style={{
            width: 150, height: 150, borderRadius: '50%',
            background: `linear-gradient(135deg, ${accentColor}, ${primaryColor})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 64,
            opacity: fadeIn(4, 18),
            transform: `scale(${scaleSpring(4, 0.2)})`,
            boxShadow: `0 0 60px ${accentColor}66, 0 4px 30px rgba(0,0,0,0.15)`,
            zIndex: 2,
          }}>
            🎬
          </div>

          {/* Gold shimmer sweep over logo */}
          <div style={{
            position: 'absolute',
            width: 60, height: 200,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            transform: `rotate(30deg) translateX(${shimmerX}px)`,
            pointerEvents: 'none',
            zIndex: 3,
            opacity: 0.8,
          }} />

          {/* Niche label */}
          <div style={{
            position: 'absolute', bottom: '28%',
            color: primaryColor,
            fontSize: 13, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase',
            opacity: fadeIn(14, 26),
            filter: `drop-shadow(0 0 6px ${accentColor}88)`,
          }}>
            {niche}
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 1 — Channel Reveal
      ══════════════════════════════════ */}
      {scene === 1 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Background rings faint */}
          <div style={{
            position: 'absolute', width: 900, height: 900, borderRadius: '50%',
            border: `1px solid ${accentColor}18`,
            transform: `rotate(${spin}deg)`,
          }} />
          <div style={{
            position: 'absolute', width: 680, height: 680, borderRadius: '50%',
            border: `1px solid ${primaryColor}20`,
            transform: `rotate(${spinR}deg)`,
          }} />

          {/* Popping text burst — channel name */}
          <PoppingText text={channelName} startFrame={S1 + 4} fontSize={110} color="#1A1200" />

          {/* Gold shimmer line under name */}
          <div style={{
            height: 4,
            width: interpolate(frame, [S1 + 16, S1 + 48], [0, 420], { extrapolateRight: 'clamp' }),
            background: `linear-gradient(90deg, transparent, ${accentColor}, ${primaryColor}, transparent)`,
            borderRadius: 2, marginTop: 10, marginBottom: 24,
            boxShadow: `0 0 16px ${accentColor}88`,
          }} />

          {/* Gold shimmer sweep over name */}
          <div style={{
            position: 'absolute',
            width: 80, height: 400,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
            transform: `rotate(15deg) translateX(${shimmerX * 2.5}px)`,
            pointerEvents: 'none',
            opacity: 0.7,
          }} />

          {/* Tagline gold glow reveal */}
          <GoldGlowReveal text={tagline} startFrame={S1 + 22} fontSize={26} color={primaryColor} />

          {/* Subscriber badge */}
          <div style={{
            marginTop: 36,
            background: `${accentColor}22`,
            border: `1.5px solid ${accentColor}66`,
            borderRadius: 50,
            padding: '12px 36px',
            color: secondaryColor,
            fontSize: 16, fontWeight: 700,
            opacity: fadeIn(S1 + 34, S1 + 50),
            transform: `translateY(${slideUp(S1 + 34, 20)}px)`,
            boxShadow: `0 0 20px ${accentColor}33`,
          }}>
            ✦ {subscriberCount}
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 2 — Social + Schedule
      ══════════════════════════════════ */}
      {scene === 2 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 120px' }}>

          <div style={{
            color: primaryColor, fontSize: 12, fontWeight: 700,
            letterSpacing: 6, textTransform: 'uppercase',
            opacity: fadeIn(S2, S2 + 15),
            marginBottom: 48,
            filter: `drop-shadow(0 0 6px ${accentColor}88)`,
          }}>
            Find us everywhere
          </div>

          {/* Social link cards — warm cream cards */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center', marginBottom: 48 }}>
            {linksArray.map((link, i) => {
              const lStart = S2 + 14 + i * 14
              return (
                <div key={i} style={{
                  background: '#FFFFFF',
                  border: `1px solid ${accentColor}44`,
                  borderRadius: 16,
                  padding: '18px 34px',
                  opacity: interpolate(frame, [lStart, lStart + 12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                  transform: `translateY(${spring({ frame: Math.max(0, frame - lStart), fps, from: 28, to: 0, config: { damping } })}px)`,
                  position: 'relative', overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}>
                  {/* Gold top line */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: 2,
                    background: `linear-gradient(90deg, ${accentColor}, ${primaryColor})`,
                  }} />
                  <div style={{ color: '#1A1200', fontSize: 17, fontWeight: 600 }}>{link}</div>
                </div>
              )
            })}
          </div>

          {/* Upload schedule */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 18,
            background: '#FFFFFF',
            border: `1px solid ${accentColor}44`,
            borderRadius: 60,
            padding: '14px 36px',
            opacity: fadeIn(S2 + 44, S2 + 58),
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: 22 }}>📅</div>
            <div>
              <div style={{ color: '#999', fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>New videos</div>
              <div style={{ color: '#1A1200', fontSize: 18, fontWeight: 700 }}>{uploadSchedule}</div>
            </div>
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 3 — CTA
      ══════════════════════════════════ */}
      {scene === 3 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          <ParticleBurst startFrame={S3 + 2} count={32} />
          <ParticleBurst startFrame={S3 + 18} count={20} />

          {/* Background rings */}
          <div style={{
            position: 'absolute', width: 800, height: 800, borderRadius: '50%',
            border: `1px solid ${accentColor}22`,
            transform: `rotate(${spin}deg) scale(${bloom})`,
          }} />

          {/* Bloom glow */}
          <div style={{
            position: 'absolute', width: 600, height: 600, borderRadius: '50%',
            background: `radial-gradient(circle, ${accentColor}18 0%, transparent 65%)`,
            transform: `scale(${bloom})`,
            pointerEvents: 'none',
          }} />

          {/* Small logo */}
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: `linear-gradient(135deg, ${accentColor}, ${primaryColor})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 38,
            opacity: fadeIn(S3, S3 + 14),
            transform: `scale(${scaleSpring(S3, 0.4)})`,
            marginBottom: 28,
            boxShadow: `0 0 40px ${accentColor}55, 0 4px 20px rgba(0,0,0,0.15)`,
          }}>
            🎬
          </div>

          {/* Channel name */}
          <div style={{
            fontSize: 96, fontWeight: 900, color: '#1A1200',
            opacity: fadeIn(S3 + 8, S3 + 24),
            transform: `translateY(${slideUp(S3 + 8, 40)}px)`,
            textAlign: 'center', letterSpacing: '-3px', lineHeight: 1,
            marginBottom: 12,
          }}>
            {channelName}
          </div>

          {/* Gold shimmer sweep */}
          <div style={{
            position: 'absolute',
            width: 100, height: 500,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            transform: `rotate(15deg) translateX(${shimmerX * 3}px)`,
            pointerEvents: 'none',
            opacity: 0.8,
          }} />

          <div style={{
            color: primaryColor, fontSize: 20, fontWeight: 400,
            opacity: fadeIn(S3 + 16, S3 + 30),
            marginBottom: 44, letterSpacing: 1,
          }}>
            {tagline}
          </div>

          {/* CTA button — dark on light */}
          <div style={{
            opacity: fadeIn(S3 + 26, S3 + 40),
            transform: `scale(${scaleSpring(S3 + 26, 0.8) * bloom})`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
              borderRadius: 60,
              padding: '22px 80px',
              color: '#FFFFFF',
              fontSize: 24, fontWeight: 800,
              boxShadow: `0 0 50px ${accentColor}55, 0 8px 30px rgba(0,0,0,0.2)`,
              letterSpacing: 0.5,
            }}>
              {callToAction} 🔔
            </div>
          </div>

        </AbsoluteFill>
      )}

      {/* Scene flash transitions — soft white flashes for light theme */}
      {[S1, S2, S3].map((t, i) => (
        <AbsoluteFill key={i} style={{
          background: '#FFFFFF',
          opacity: flashOpacity(t),
          pointerEvents: 'none',
          zIndex: 50,
        }} />
      ))}

    </AbsoluteFill>
  )
}

export default IntroOutro