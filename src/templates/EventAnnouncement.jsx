// LOCATION: src/templates/EventAnnouncement.jsx

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export const EventAnnouncement = ({
  eventName = 'Summit 2025',
  eventType = 'Conference',
  tagline = 'The future starts here',
  date = 'March 15, 2025',
  time = '9:00 AM — 6:00 PM',
  location = 'San Francisco, CA',
  venue = 'Moscone Center',
  description = 'Join thousands of innovators, creators, and leaders for a day that will change how you see the world',
  speakers = 'Jane Doe, John Smith, Sarah Lee',
  highlights = 'Keynotes, Workshops, Networking, Live Demos',
  ticketPrice = 'From $99',
  registerLink = 'summit2025.com/register',
  callToAction = 'Get Your Ticket',
  primaryColor = '#C2410C',
  secondaryColor = '#B45309',
  accentColor = '#0369A1',
  fontFamily = 'Inter',
  vibe = 'Exciting',
  style = 'Bold',
  pace = 'Medium',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const damping = pace === 'Fast' ? 22 : pace === 'Slow' ? 8 : 12

  const speakersArray = typeof speakers === 'string'
    ? speakers.split(',').map(s => s.trim()).filter(Boolean)
    : Array.isArray(speakers) ? speakers : []

  const highlightsArray = typeof highlights === 'string'
    ? highlights.split(',').map(h => h.trim()).filter(Boolean)
    : Array.isArray(highlights) ? highlights : []

  // ── Proportional scene timing ──
  const S1 = Math.floor(durationInFrames * 0.22) // Teaser
  const S2 = Math.floor(durationInFrames * 0.48) // Event reveal
  const S3 = Math.floor(durationInFrames * 0.72) // Speakers + highlights
  const S4 = durationInFrames                     // CTA

  const scene = frame < S1 ? 0 : frame < S2 ? 1 : frame < S3 ? 2 : 3

  // ── Helpers ──
  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, dist = 50) =>
    spring({ frame: Math.max(0, frame - start), fps, from: dist, to: 0, config: { damping } })

  const slideLeft = (start, dist = 60) =>
    spring({ frame: Math.max(0, frame - start), fps, from: dist, to: 0, config: { damping } })

  const scaleSpring = (start, from = 0.6) =>
    spring({ frame: Math.max(0, frame - start), fps, from, to: 1, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const flashOpacity = (t) =>
    interpolate(frame, [t - 3, t, t + 8], [0, 0.65, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const vibeColor = vibe === 'Formal' ? accentColor : vibe === 'Luxury' ? secondaryColor : primaryColor

  // ── Bloom pulse ──
  const bloom = interpolate(frame % 55, [0, 27, 55], [0.97, 1.05, 0.97])

  // ── Animated subtitle pop ──
  const SubtitlePop = ({ text, startFrame, color = primaryColor, fontSize = 16 }) => {
    const sc = spring({ frame: Math.max(0, frame - startFrame), fps, from: 0.5, to: 1, config: { damping: 7, stiffness: 200 } })
    const op = interpolate(frame, [startFrame, startFrame + 10], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    return (
      <div style={{
        background: `${color}22`,
        border: `1.5px solid ${color}55`,
        borderRadius: 50, padding: '8px 22px',
        color, fontSize, fontWeight: 700,
        opacity: op, transform: `scale(${sc})`,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        boxShadow: `0 4px 14px ${color}22`,
      }}>
        {text}
      </div>
    )
  }

  // ── Particle burst ──
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
        const size = interpolate(pf, [0, 42], [8, 2], { extrapolateRight: 'clamp' })
        const colors = [primaryColor, secondaryColor, accentColor, '#2D1400', '#FFFFFF']
        return (
          <div key={i} style={{
            position: 'absolute',
            left: '50%', top: '52%',
            width: size, height: size,
            borderRadius: '50%',
            background: colors[i % colors.length],
            opacity: op,
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            boxShadow: `0 0 ${size * 2}px ${colors[i % colors.length]}`,
            pointerEvents: 'none',
          }} />
        )
      })}
    </>
  )

  // ── Countdown circular progress ──
  const CountdownArc = ({ startFrame, size = 90, color = primaryColor }) => {
    const radius = (size - 8) / 2
    const circ = 2 * Math.PI * radius
    const elapsed = interpolate(frame, [startFrame, startFrame + 60], [0, 100], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    const offset = circ - (elapsed / 100) * circ
    const pulse = interpolate(frame % 30, [0, 15, 30], [0.6, 1, 0.6])
    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={`${color}22`} strokeWidth={8} />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={8}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size * 0.18, fontWeight: 800, color,
          opacity: pulse,
        }}>
          LIVE
        </div>
      </div>
    )
  }

  // ── Layered type stacking ──
  const LayeredTitle = ({ text, startFrame }) => {
    const words = text.split(' ')
    return (
      <div style={{ position: 'relative', textAlign: 'center' }}>
        {/* Shadow layer */}
        <div style={{
          position: 'absolute',
          fontSize: 120, fontWeight: 900,
          color: `${primaryColor}12`,
          top: 8, left: 8,
          letterSpacing: '-4px', lineHeight: 0.95,
          userSelect: 'none',
          width: '100%', textAlign: 'center',
        }}>
          {text}
        </div>
        {/* Main layer */}
        <div style={{ position: 'relative' }}>
          {words.map((word, i) => {
            const wf = startFrame + i * 6
            const op = interpolate(frame, [wf, wf + 12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
            const y = spring({ frame: Math.max(0, frame - wf), fps, from: 40, to: 0, config: { damping } })
            return (
              <span key={i} style={{
                fontSize: 120, fontWeight: 900,
                color: '#2D1400',
                opacity: op,
                transform: `translateY(${y}px)`,
                display: 'inline-block',
                letterSpacing: '-4px', lineHeight: 0.95,
                marginRight: 16,
              }}>
                {word}
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <AbsoluteFill style={{ background: '#E8D4B8', fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Warm amber festival poster base */}
      <AbsoluteFill style={{
        background: `
          radial-gradient(ellipse at 50% 20%, ${primaryColor}20 0%, transparent 50%),
          radial-gradient(ellipse at 20% 80%, ${secondaryColor}14 0%, transparent 45%),
          radial-gradient(ellipse at 80% 60%, ${accentColor}10 0%, transparent 45%),
          linear-gradient(170deg, #F0D8B8 0%, #E8D4B8 50%, #D8C0A0 100%)
        `,
      }} />

      {/* Concert poster grain lines */}
      <AbsoluteFill style={{
        backgroundImage: `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 80px,
          ${primaryColor}04 80px,
          ${primaryColor}04 81px
        )`,
        pointerEvents: 'none',
      }} />

      {/* Spotlight sweep */}
      <div style={{
        position: 'absolute',
        width: 300, height: '150%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
        transform: `rotate(15deg) translateX(${interpolate(frame, [0, durationInFrames], [-400, 2000], { extrapolateRight: 'clamp' })}px)`,
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* ══════════════════════════════════
          SCENE 0 — Teaser
      ══════════════════════════════════ */}
      {scene === 0 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Expanding rings */}
          {[320, 520, 720].map((size, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: size, height: size, borderRadius: '50%',
              border: `1px solid ${vibeColor}${['44', '28', '16'][i]}`,
              transform: `scale(${interpolate(frame, [i * 5, S1], [0.3, 1.2])})`,
              opacity: interpolate(frame, [i * 5, S1 * 0.5, S1], [0, 0.7, 0.2]),
            }} />
          ))}

          {/* Event type label */}
          <div style={{
            color: vibeColor, fontSize: 13, fontWeight: 700,
            letterSpacing: 7, textTransform: 'uppercase',
            opacity: fadeIn(0, 14), marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 14,
            filter: `drop-shadow(0 2px 6px ${vibeColor}44)`,
          }}>
            <div style={{ width: 32, height: 1, background: vibeColor }} />
            {eventType}
            <div style={{ width: 32, height: 1, background: vibeColor }} />
          </div>

          {/* Tagline */}
          <div style={{
            fontSize: 76, fontWeight: 900, color: '#2D1400',
            opacity: fadeIn(8, 22),
            transform: `translateY(${slideUp(8, 50)}px)`,
            textAlign: 'center', letterSpacing: '-3px', lineHeight: 1.05,
            marginBottom: 24,
          }}>
            {tagline}
          </div>

          {/* Date badge */}
          <SubtitlePop text={`📅 ${date}`} startFrame={18} color={vibeColor} fontSize={16} />

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 1 — Event Reveal
      ══════════════════════════════════ */}
      {scene === 1 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 100px' }}>

          {/* You're Invited */}
          <div style={{
            color: vibeColor, fontSize: 13, fontWeight: 700,
            letterSpacing: 6, textTransform: 'uppercase',
            opacity: fadeIn(S1, S1 + 14), marginBottom: 16,
            filter: `drop-shadow(0 2px 6px ${vibeColor}44)`,
          }}>
            ✦ You're Invited
          </div>

          {/* Layered event name */}
          <div style={{ opacity: fadeIn(S1 + 4, S1 + 18) }}>
            <LayeredTitle text={eventName} startFrame={S1 + 6} />
          </div>

          {/* Info badges */}
          <div style={{
            display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center',
            marginTop: 28,
            opacity: fadeIn(S1 + 22, S1 + 36),
            transform: `translateY(${slideUp(S1 + 22, 22)}px)`,
          }}>
            <SubtitlePop text={`📅 ${date}`} startFrame={S1 + 24} color={vibeColor} fontSize={15} />
            <SubtitlePop text={`📍 ${venue}`} startFrame={S1 + 30} color={secondaryColor} fontSize={15} />
            <SubtitlePop text={`🕐 ${time}`} startFrame={S1 + 36} color={accentColor} fontSize={15} />
          </div>

          {/* Description */}
          <div style={{
            marginTop: 28,
            fontSize: 19, fontWeight: 300, color: '#5C3A1E',
            opacity: fadeIn(S1 + 34, S1 + 48),
            textAlign: 'center', maxWidth: 900, lineHeight: 1.6,
          }}>
            {description}
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 2 — Speakers + Highlights
      ══════════════════════════════════ */}
      {scene === 2 && (
        <AbsoluteFill style={{ display: 'flex', padding: '80px 100px', alignItems: 'center', gap: 80 }}>

          {/* Left — speakers */}
          <div style={{ flex: 1 }}>
            <div style={{
              color: vibeColor, fontSize: 12, fontWeight: 700,
              letterSpacing: 6, textTransform: 'uppercase',
              opacity: fadeIn(S2, S2 + 14), marginBottom: 36,
            }}>
              Speakers
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {speakersArray.map((speaker, i) => {
                const sStart = S2 + 14 + i * 16
                const initials = speaker.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 18,
                    opacity: interpolate(frame, [sStart, sStart + 14], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                    transform: `translateX(${spring({ frame: Math.max(0, frame - sStart), fps, from: -50, to: 0, config: { damping } })}px)`,
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${vibeColor}, ${secondaryColor})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#FFFFFF', fontSize: 18, fontWeight: 800, flexShrink: 0,
                      boxShadow: `0 4px 16px ${vibeColor}44`,
                    }}>
                      {initials}
                    </div>
                    <div style={{ color: '#2D1400', fontSize: 20, fontWeight: 600 }}>{speaker}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Divider */}
          <div style={{
            width: 1, alignSelf: 'stretch',
            background: `linear-gradient(180deg, transparent, ${vibeColor}33, transparent)`,
            opacity: fadeIn(S2, S2 + 18),
          }} />

          {/* Right — highlights + countdown */}
          <div style={{ flex: 1 }}>
            <div style={{
              color: secondaryColor, fontSize: 12, fontWeight: 700,
              letterSpacing: 6, textTransform: 'uppercase',
              opacity: fadeIn(S2 + 10, S2 + 24), marginBottom: 28,
            }}>
              What's Inside
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {highlightsArray.map((highlight, i) => {
                const hStart = S2 + 18 + i * 14
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    opacity: interpolate(frame, [hStart, hStart + 12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                    transform: `translateX(${spring({ frame: Math.max(0, frame - hStart), fps, from: 50, to: 0, config: { damping } })}px)`,
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: vibeColor, flexShrink: 0,
                      boxShadow: `0 0 8px ${vibeColor}88`,
                    }} />
                    <div style={{ color: '#2D1400', fontSize: 19, fontWeight: 500 }}>{highlight}</div>
                  </div>
                )
              })}
            </div>

            {/* Countdown arc + ticket price */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 20,
              background: '#FFFFFF',
              border: `1px solid ${vibeColor}33`,
              borderRadius: 16, padding: '16px 24px',
              opacity: fadeIn(S2 + 52, S2 + 66),
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}>
              <CountdownArc startFrame={S2 + 54} size={72} color={vibeColor} />
              <div>
                <div style={{ color: '#8B6A54', fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 3 }}>Tickets</div>
                <div style={{ color: '#2D1400', fontSize: 26, fontWeight: 900 }}>{ticketPrice}</div>
              </div>
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
          <ParticleBurst startFrame={S3 + 16} count={22} />

          {/* Bloom */}
          <div style={{
            position: 'absolute', width: 800, height: 800, borderRadius: '50%',
            background: `radial-gradient(circle, ${vibeColor}14 0%, transparent 65%)`,
            transform: `scale(${bloom})`,
            pointerEvents: 'none',
          }} />

          {/* Event type label */}
          <div style={{
            color: vibeColor, fontSize: 12, fontWeight: 700,
            letterSpacing: 7, textTransform: 'uppercase',
            opacity: fadeIn(S3, S3 + 14), marginBottom: 14,
            filter: `drop-shadow(0 2px 6px ${vibeColor}44)`,
          }}>
            ✦ {eventType}
          </div>

          {/* Layered event name */}
          <div style={{
            opacity: fadeIn(S3 + 6, S3 + 22),
            transform: `translateY(${slideUp(S3 + 6, 40)}px)`,
            marginBottom: 16,
          }}>
            <div style={{
              fontSize: 100, fontWeight: 900, color: '#2D1400',
              textAlign: 'center', letterSpacing: '-4px', lineHeight: 0.95,
              textShadow: `4px 4px 0px ${primaryColor}22`,
            }}>
              {eventName}
            </div>
          </div>

          {/* Date + location */}
          <div style={{
            display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center',
            opacity: fadeIn(S3 + 16, S3 + 28), marginBottom: 12,
          }}>
            <SubtitlePop text={`📅 ${date}`} startFrame={S3 + 18} color={vibeColor} fontSize={15} />
            <SubtitlePop text={`📍 ${location}`} startFrame={S3 + 22} color={secondaryColor} fontSize={15} />
          </div>

          {/* Ticket price */}
          <div style={{
            color: vibeColor, fontSize: 22, fontWeight: 700,
            opacity: fadeIn(S3 + 22, S3 + 34), marginBottom: 40,
            filter: `drop-shadow(0 2px 6px ${vibeColor}33)`,
          }}>
            {ticketPrice}
          </div>

          {/* CTA button — dark on warm light */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
            opacity: fadeIn(S3 + 30, S3 + 44),
            transform: `scale(${scaleSpring(S3 + 30, 0.8) * bloom})`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 60, padding: '22px 80px',
              color: '#FFFFFF', fontSize: 24, fontWeight: 800,
              boxShadow: `0 8px 30px ${vibeColor}55`,
            }}>
              {callToAction} →
            </div>
            <div style={{ color: '#8B6A54', fontSize: 15 }}>{registerLink}</div>
          </div>

        </AbsoluteFill>
      )}

      {/* Scene flash transitions — warm amber flash */}
      {[S1, S2, S3].map((t, i) => (
        <AbsoluteFill key={i} style={{
          background: '#FFF5E0',
          opacity: flashOpacity(t),
          pointerEvents: 'none',
          zIndex: 50,
        }} />
      ))}

    </AbsoluteFill>
  )
}

export default EventAnnouncement