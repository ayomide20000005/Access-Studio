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
  primaryColor = '#0EA5E9',
  secondaryColor = '#6366F1',
  accentColor = '#F59E0B',
  logoPath = null,
  fontFamily = 'Inter',
  vibe = 'Exciting',
  style = 'Bold',
  pace = 'Medium',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const damping = pace === 'Fast' ? 20 : pace === 'Slow' ? 8 : 12

  const speakersArray = typeof speakers === 'string'
    ? speakers.split(',').map(s => s.trim()).filter(Boolean)
    : speakers

  const highlightsArray = typeof highlights === 'string'
    ? highlights.split(',').map(h => h.trim()).filter(Boolean)
    : highlights

  // Proportional scene timing
  const S1 = Math.floor(durationInFrames * 0.20)  // Teaser
  const S2 = Math.floor(durationInFrames * 0.45)  // Event reveal
  const S3 = Math.floor(durationInFrames * 0.68)  // Details + speakers
  const S4 = durationInFrames                      // CTA

  const currentScene = frame < S1 ? 0 : frame < S2 ? 1 : frame < S3 ? 2 : 3

  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, dist = 50) =>
    spring({ frame: Math.max(0, frame - start), fps, from: dist, to: 0, config: { damping, stiffness: 100 } })

  const scaleIn = (start, from = 0.7) =>
    spring({ frame: Math.max(0, frame - start), fps, from, to: 1, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const vibeColor = vibe === 'Formal' ? secondaryColor : vibe === 'Casual' ? accentColor : vibe === 'Luxury' ? '#D97706' : primaryColor

  // Particle field
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    x: (i * 17 + 5) % 95,
    y: (i * 13 + 8) % 90,
    size: 1 + (i % 3),
    speed: 0.3 + (i % 5) * 0.15,
    color: i % 3 === 0 ? primaryColor : i % 3 === 1 ? secondaryColor : accentColor,
  }))

  return (
    <AbsoluteFill style={{ background: '#06080F', fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Background glow */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 30%, ${vibeColor}14 0%, transparent 55%),
                     radial-gradient(ellipse at 80% 80%, ${secondaryColor}0E 0%, transparent 50%)`,
      }} />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: `${(p.y + Math.sin((frame * p.speed * 0.04) + i * 0.8) * 2.5)}%`,
          width: p.size * 3,
          height: p.size * 3,
          borderRadius: '50%',
          background: p.color,
          opacity: 0.3 + Math.sin((frame * p.speed * 0.06) + i) * 0.2,
          boxShadow: `0 0 ${p.size * 5}px ${p.color}`,
        }} />
      ))}

      {/* ===== SCENE 1: Teaser ===== */}
      {currentScene === 0 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Expanding rings teaser */}
          {[300, 500, 700].map((size, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              border: `1px solid ${vibeColor}${['44', '28', '14'][i]}`,
              transform: `scale(${interpolate(frame, [i * 4, S1], [0.3, 1.2])})`,
              opacity: interpolate(frame, [i * 4, S1 * 0.5, S1], [0, 0.7, 0.2]),
            }} />
          ))}

          {/* Event type label */}
          <div style={{
            color: vibeColor,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: fadeIn(0, 15),
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            <div style={{ width: 32, height: 1, background: vibeColor }} />
            {eventType}
            <div style={{ width: 32, height: 1, background: vibeColor }} />
          </div>

          {/* Teaser headline */}
          <div style={{
            fontSize: 80,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(8, 24),
            transform: `translateY(${slideUp(8, 50)}px)`,
            textAlign: 'center',
            letterSpacing: '-3px',
            lineHeight: 1.05,
            marginBottom: 20,
          }}>
            {tagline}
          </div>

          {/* Date teaser */}
          <div style={{
            color: '#555',
            fontSize: 20,
            fontWeight: 500,
            opacity: fadeIn(18, 32),
            letterSpacing: 2,
          }}>
            {date}
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 2: Event Reveal ===== */}
      {currentScene === 1 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 100px' }}>

          {/* Top horizontal line */}
          <div style={{
            position: 'absolute',
            top: '30%',
            left: 0, right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${vibeColor}33, transparent)`,
          }} />
          <div style={{
            position: 'absolute',
            top: '70%',
            left: 0, right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${vibeColor}22, transparent)`,
          }} />

          {/* YOU'RE INVITED */}
          <div style={{
            color: vibeColor,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: fadeIn(S1, S1 + 15),
            marginBottom: 20,
            transform: `translateY(${slideUp(S1, 20)}px)`,
          }}>
            ✦ You're Invited
          </div>

          {/* Event name — MASSIVE */}
          <div style={{
            fontSize: 120,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(S1 + 8, S1 + 25),
            transform: `translateY(${slideUp(S1 + 8, 60)}px)`,
            textAlign: 'center',
            letterSpacing: '-5px',
            lineHeight: 0.9,
            marginBottom: 24,
            textShadow: `0 0 100px ${vibeColor}33`,
          }}>
            {eventName}
          </div>

          {/* Location + Date badges */}
          <div style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
            opacity: fadeIn(S1 + 20, S1 + 38),
            transform: `translateY(${slideUp(S1 + 20, 25)}px)`,
          }}>
            <div style={{
              background: `${vibeColor}22`,
              border: `1px solid ${vibeColor}44`,
              borderRadius: 50,
              padding: '10px 28px',
              color: vibeColor,
              fontSize: 15,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              📅 {date}
            </div>
            <div style={{
              background: '#111',
              border: '1px solid #222',
              borderRadius: 50,
              padding: '10px 28px',
              color: '#AAAAAA',
              fontSize: 15,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              📍 {venue}, {location}
            </div>
            <div style={{
              background: '#111',
              border: '1px solid #222',
              borderRadius: 50,
              padding: '10px 28px',
              color: '#AAAAAA',
              fontSize: 15,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              🕐 {time}
            </div>
          </div>

          {/* Description */}
          <div style={{
            marginTop: 32,
            fontSize: 20,
            fontWeight: 300,
            color: '#666',
            opacity: fadeIn(S1 + 32, S1 + 48),
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.6,
          }}>
            {description}
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 3: Speakers + Highlights ===== */}
      {currentScene === 2 && (
        <AbsoluteFill style={{ display: 'flex', padding: '60px 100px', alignItems: 'center', gap: 80 }}>

          {/* Left — Speakers */}
          <div style={{ flex: 1 }}>
            <div style={{
              color: accentColor,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 5,
              textTransform: 'uppercase',
              opacity: fadeIn(S2, S2 + 15),
              marginBottom: 36,
            }}>
              Speakers
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {speakersArray.map((speaker, i) => {
                const sStart = S2 + 12 + i * 16
                const initials = speaker.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                return (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    opacity: interpolate(frame, [sStart, sStart + 14], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                    transform: `translateX(${spring({ frame: Math.max(0, frame - sStart), fps, from: -50, to: 0, config: { damping } })}px)`,
                  }}>
                    <div style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${vibeColor}, ${secondaryColor})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 700,
                      flexShrink: 0,
                      boxShadow: `0 0 20px ${vibeColor}33`,
                    }}>
                      {initials}
                    </div>
                    <div style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 600 }}>{speaker}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Divider */}
          <div style={{
            width: 1,
            alignSelf: 'stretch',
            background: `linear-gradient(180deg, transparent, ${vibeColor}33, transparent)`,
            opacity: fadeIn(S2, S2 + 20),
          }} />

          {/* Right — Highlights */}
          <div style={{ flex: 1 }}>
            <div style={{
              color: vibeColor,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 5,
              textTransform: 'uppercase',
              opacity: fadeIn(S2 + 10, S2 + 25),
              marginBottom: 36,
            }}>
              What's Inside
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {highlightsArray.map((highlight, i) => {
                const hStart = S2 + 18 + i * 14
                return (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    opacity: interpolate(frame, [hStart, hStart + 12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                    transform: `translateX(${spring({ frame: Math.max(0, frame - hStart), fps, from: 50, to: 0, config: { damping } })}px)`,
                  }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: vibeColor,
                      flexShrink: 0,
                      boxShadow: `0 0 10px ${vibeColor}88`,
                    }} />
                    <div style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 500 }}>{highlight}</div>
                  </div>
                )
              })}
            </div>

            {/* Ticket price */}
            <div style={{
              marginTop: 36,
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}33`,
              borderRadius: 14,
              padding: '16px 28px',
              opacity: fadeIn(S2 + 55, S2 + 70),
            }}>
              <div style={{ color: '#666', fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Tickets</div>
              <div style={{ color: accentColor, fontSize: 28, fontWeight: 800 }}>{ticketPrice}</div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 4: CTA ===== */}
      {currentScene === 3 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          <div style={{
            position: 'absolute',
            width: 800,
            height: 800,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${vibeColor}18 0%, transparent 65%)`,
            transform: `scale(${interpolate(frame % 60, [0, 30, 60], [1, 1.06, 1])})`,
          }} />

          <div style={{
            color: vibeColor,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: fadeIn(S3, S3 + 15),
            marginBottom: 16,
          }}>
            ✦ {eventType}
          </div>

          <div style={{
            fontSize: 100,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(S3 + 8, S3 + 25),
            transform: `translateY(${slideUp(S3 + 8, 50)}px)`,
            textAlign: 'center',
            letterSpacing: '-4px',
            lineHeight: 0.95,
            marginBottom: 12,
            textShadow: `0 0 80px ${vibeColor}33`,
          }}>
            {eventName}
          </div>

          <div style={{
            color: '#555',
            fontSize: 18,
            fontWeight: 500,
            opacity: fadeIn(S3 + 16, S3 + 30),
            marginBottom: 12,
            letterSpacing: 1,
          }}>
            {date} · {location}
          </div>

          <div style={{
            color: accentColor,
            fontSize: 20,
            fontWeight: 600,
            opacity: fadeIn(S3 + 22, S3 + 36),
            marginBottom: 48,
          }}>
            {ticketPrice}
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            opacity: fadeIn(S3 + 30, S3 + 46),
            transform: `translateY(${slideUp(S3 + 30, 25)}px)`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${vibeColor}, ${secondaryColor})`,
              borderRadius: 60,
              padding: '22px 80px',
              color: '#FFFFFF',
              fontSize: 24,
              fontWeight: 800,
              boxShadow: `0 0 60px ${vibeColor}44`,
            }}>
              {callToAction} →
            </div>
            <div style={{ color: '#444', fontSize: 16 }}>{registerLink}</div>
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

export default EventAnnouncement