// LOCATION: src/templates/PitchDeckVideo.jsx

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export const PitchDeckVideo = ({
  companyName = 'Your Startup',
  tagline = 'Changing the way the world works',
  problem = 'Millions of people struggle with this problem every day',
  solution = 'We built the only platform that solves this end to end',
  marketSize = '$50B',
  marketLabel = 'Total Addressable Market',
  traction = '10K users, $500K ARR, 40% MoM growth',
  teamNames = 'Jane Doe — CEO, John Smith — CTO, Sarah Lee — CPO',
  askAmount = '$2M',
  askUse = 'Product, Growth, Team',
  contactEmail = 'hello@yourstartup.com',
  callToAction = 'Lets Talk',
  primaryColor = '#1E3A5F',
  secondaryColor = '#2563EB',
  accentColor = '#0EA5E9',
  fontFamily = 'Inter',
  tone = 'Confident',
  style = 'Startup',
  pace = 'Medium',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const damping = pace === 'Fast' ? 22 : pace === 'Slow' ? 8 : 12

  const tractionArray = typeof traction === 'string'
    ? traction.split(',').map(t => t.trim()).filter(Boolean)
    : Array.isArray(traction) ? traction : []

  const teamArray = typeof teamNames === 'string'
    ? teamNames.split(',').map(t => t.trim()).filter(Boolean)
    : Array.isArray(teamNames) ? teamNames : []

  const askUseArray = typeof askUse === 'string'
    ? askUse.split(',').map(a => a.trim()).filter(Boolean)
    : Array.isArray(askUse) ? askUse : []

  // ── 6 slides proportional ──
  const totalSlides = 6
  const framesPerSlide = Math.floor(durationInFrames / totalSlides)
  const currentSlide = Math.min(Math.floor(frame / framesPerSlide), totalSlides - 1)
  const slideFrame = frame - currentSlide * framesPerSlide
  const slideProgress = interpolate(slideFrame, [0, framesPerSlide], [0, 1], { extrapolateRight: 'clamp' })

  // ── Helpers ──
  const fadeIn = (start, end) =>
    interpolate(slideFrame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, dist = 40) =>
    spring({ frame: Math.max(0, slideFrame - start), fps, from: dist, to: 0, config: { damping } })

  const slideRight = (start, dist = 60) =>
    spring({ frame: Math.max(0, slideFrame - start), fps, from: -dist, to: 0, config: { damping } })

  const scaleSpring = (start, from = 0.7) =>
    spring({ frame: Math.max(0, slideFrame - start), fps, from, to: 1, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const flashOpacity = (slideIdx) => {
    const t = slideIdx * framesPerSlide
    return interpolate(frame, [t - 3, t, t + 8], [0, 0.6, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
  }

  const toneColor = tone === 'Inspiring' ? '#7C3AED' : tone === 'Data Driven' ? secondaryColor : tone === 'Storytelling' ? '#EC4899' : secondaryColor

  // ── Chart bar ──
  const ChartBar = ({ label, percent, index, color = secondaryColor }) => {
    const barW = interpolate(slideFrame, [20 + index * 14, 45 + index * 14], [0, percent], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    const op = interpolate(slideFrame, [14 + index * 10, 28 + index * 10], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    return (
      <div style={{ opacity: op, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: '#4A5568', fontSize: 14, fontWeight: 600 }}>{label}</span>
          <span style={{ color, fontSize: 14, fontWeight: 700 }}>{Math.round(barW)}%</span>
        </div>
        <div style={{ height: 8, background: '#B8C8D8', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${barW}%`,
            background: `linear-gradient(90deg, ${color}, ${accentColor})`,
            borderRadius: 4,
            boxShadow: `0 0 8px ${color}66`,
          }} />
        </div>
      </div>
    )
  }

  // ── Timeline reveal ──
  const TimelineItem = ({ label, value, index }) => {
    const op = interpolate(slideFrame, [10 + index * 14, 24 + index * 14], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    const x = spring({ frame: Math.max(0, slideFrame - (10 + index * 14)), fps, from: -50, to: 0, config: { damping } })
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 20,
        opacity: op, transform: `translateX(${x}px)`,
        marginBottom: 20,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FFFFFF', fontSize: 16, fontWeight: 800, flexShrink: 0,
          boxShadow: `0 4px 14px ${secondaryColor}44`,
        }}>
          {index + 1}
        </div>
        <div>
          <div style={{ color: '#718096', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2 }}>{label}</div>
          <div style={{ color: '#1A202C', fontSize: 20, fontWeight: 700 }}>{value}</div>
        </div>
      </div>
    )
  }

  const slides = ['cover', 'problem', 'solution', 'traction', 'team', 'ask']

  return (
    <AbsoluteFill style={{ background: '#C8D4E0', fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Cool blue-grey paper texture */}
      <AbsoluteFill style={{
        background: `
          radial-gradient(ellipse at 15% 20%, ${accentColor}18 0%, transparent 45%),
          radial-gradient(ellipse at 85% 80%, ${secondaryColor}12 0%, transparent 45%),
          linear-gradient(160deg, #D8E4F0 0%, #C8D4E0 50%, #B8C8D8 100%)
        `,
      }} />

      {/* Subtle grid — blueprint feel */}
      <AbsoluteFill style={{
        backgroundImage: `
          linear-gradient(${secondaryColor}08 1px, transparent 1px),
          linear-gradient(90deg, ${secondaryColor}08 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        opacity: 0.8,
        pointerEvents: 'none',
      }} />

      {/* Top progress line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3, background: '#B0BCC8', zIndex: 10,
      }}>
        <div style={{
          height: '100%',
          width: `${((currentSlide + slideProgress) / totalSlides) * 100}%`,
          background: `linear-gradient(90deg, ${secondaryColor}, ${accentColor})`,
          boxShadow: `0 0 8px ${secondaryColor}66`,
        }} />
      </div>

      {/* Slide counter */}
      <div style={{
        position: 'absolute', top: 24, right: 52,
        color: '#6B7A8D', fontSize: 14, fontWeight: 600,
        fontFamily: 'monospace', zIndex: 10,
      }}>
        {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
      </div>

      {/* Progress dots */}
      <div style={{
        position: 'absolute', bottom: 36, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 10, zIndex: 10,
      }}>
        {slides.map((_, i) => (
          <div key={i} style={{
            height: 4,
            width: i === currentSlide ? 32 : 12,
            borderRadius: 2,
            background: i === currentSlide ? secondaryColor : '#A0B0C0',
            boxShadow: i === currentSlide ? `0 0 8px ${secondaryColor}88` : 'none',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      {/* ══════════════════════════════════
          SLIDE 0 — Cover
      ══════════════════════════════════ */}
      {currentSlide === 0 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Decorative vertical lines */}
          <div style={{ position: 'absolute', left: 80, top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg, transparent, ${secondaryColor}33, transparent)` }} />
          <div style={{ position: 'absolute', right: 80, top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg, transparent, ${secondaryColor}33, transparent)` }} />

          <div style={{
            color: secondaryColor, fontSize: 12, fontWeight: 700,
            letterSpacing: 7, textTransform: 'uppercase',
            opacity: fadeIn(0, 14), marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ width: 36, height: 1, background: secondaryColor }} />
            Investor Deck
            <div style={{ width: 36, height: 1, background: secondaryColor }} />
          </div>

          {/* Company name — big dark on light */}
          <div style={{
            fontSize: 110, fontWeight: 900, color: '#1A202C',
            opacity: fadeIn(6, 22),
            transform: `translateY(${slideUp(6, 50)}px)`,
            textAlign: 'center', letterSpacing: '-4px', lineHeight: 0.95,
            marginBottom: 22,
          }}>
            {companyName}
          </div>

          {/* Animated underline */}
          <div style={{
            height: 4,
            width: interpolate(slideFrame, [18, 50], [0, 380], { extrapolateRight: 'clamp' }),
            background: `linear-gradient(90deg, ${secondaryColor}, ${accentColor})`,
            borderRadius: 2, marginBottom: 24,
            boxShadow: `0 2px 12px ${secondaryColor}44`,
          }} />

          <div style={{
            fontSize: 24, fontWeight: 300, color: '#4A5568',
            opacity: fadeIn(22, 38),
            transform: `translateY(${slideUp(22, 20)}px)`,
            textAlign: 'center', maxWidth: 800, lineHeight: 1.5,
          }}>
            {tagline}
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SLIDE 1 — Problem
      ══════════════════════════════════ */}
      {currentSlide === 1 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 160px' }}>

          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 4, background: `linear-gradient(90deg, transparent, #EF444455, transparent)`,
          }} />

          <div style={{ fontSize: 52, opacity: fadeIn(0, 14), transform: `scale(${scaleSpring(0, 0.4)})`, marginBottom: 20 }}>⚠️</div>

          <div style={{
            color: '#EF4444', fontSize: 12, fontWeight: 700,
            letterSpacing: 6, textTransform: 'uppercase',
            opacity: fadeIn(6, 20), marginBottom: 24,
          }}>
            The Problem
          </div>

          <div style={{
            fontSize: 54, fontWeight: 800, color: '#1A202C',
            opacity: fadeIn(12, 28),
            transform: `translateY(${slideUp(12, 40)}px)`,
            textAlign: 'center', lineHeight: 1.2, letterSpacing: '-1px',
            maxWidth: 1100,
          }}>
            {problem}
          </div>

          <div style={{
            marginTop: 36, height: 3,
            width: interpolate(slideFrame, [24, 52], [0, 260], { extrapolateRight: 'clamp' }),
            background: 'linear-gradient(90deg, #EF4444, transparent)',
            borderRadius: 2,
          }} />

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SLIDE 2 — Solution + Charts
      ══════════════════════════════════ */}
      {currentSlide === 2 && (
        <AbsoluteFill style={{ display: 'flex', padding: '80px 100px', alignItems: 'center', gap: 80 }}>

          {/* Left */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 52, opacity: fadeIn(0, 14), transform: `scale(${scaleSpring(0, 0.4)})`, marginBottom: 16 }}>💡</div>
            <div style={{
              color: secondaryColor, fontSize: 12, fontWeight: 700,
              letterSpacing: 6, textTransform: 'uppercase',
              opacity: fadeIn(6, 20), marginBottom: 20,
            }}>
              Our Solution
            </div>
            <div style={{
              fontSize: 46, fontWeight: 800, color: '#1A202C',
              opacity: fadeIn(12, 28),
              transform: `translateX(${slideRight(12, 50)}px)`,
              lineHeight: 1.2, letterSpacing: '-0.5px',
              marginBottom: 24,
            }}>
              {solution}
            </div>
            <div style={{
              height: 3,
              width: interpolate(slideFrame, [22, 48], [0, 200], { extrapolateRight: 'clamp' }),
              background: `linear-gradient(90deg, ${secondaryColor}, ${accentColor})`,
              borderRadius: 2,
              boxShadow: `0 2px 10px ${secondaryColor}44`,
            }} />
          </div>

          {/* Divider */}
          <div style={{
            width: 1, alignSelf: 'stretch',
            background: `linear-gradient(180deg, transparent, ${secondaryColor}33, transparent)`,
            opacity: fadeIn(8, 22),
          }} />

          {/* Right — charts */}
          <div style={{ flex: 1 }}>
            <div style={{
              color: '#718096', fontSize: 12, fontWeight: 700,
              letterSpacing: 5, textTransform: 'uppercase',
              opacity: fadeIn(14, 28), marginBottom: 28,
            }}>
              Why We Win
            </div>
            <ChartBar label="Market Fit" percent={94} index={0} color={secondaryColor} />
            <ChartBar label="Efficiency Gain" percent={87} index={1} color={accentColor} />
            <ChartBar label="User Retention" percent={91} index={2} color={toneColor} />
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SLIDE 3 — Traction
      ══════════════════════════════════ */}
      {currentSlide === 3 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 120px' }}>

          <div style={{
            color: secondaryColor, fontSize: 12, fontWeight: 700,
            letterSpacing: 6, textTransform: 'uppercase',
            opacity: fadeIn(0, 14), marginBottom: 52,
          }}>
            Traction
          </div>

          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 44 }}>
            {tractionArray.map((item, i) => {
              const parts = item.split(/—|-/)
              const num = parts[0]?.trim()
              const label = parts[1]?.trim() || item
              const tStart = i * 16
              return (
                <div key={i} style={{
                  background: '#FFFFFF',
                  border: `1px solid ${secondaryColor}33`,
                  borderRadius: 20, padding: '28px 40px',
                  textAlign: 'center', minWidth: 200,
                  opacity: interpolate(slideFrame, [tStart, tStart + 14], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                  transform: `translateY(${spring({ frame: Math.max(0, slideFrame - tStart), fps, from: 50, to: 0, config: { damping } })}px)`,
                  position: 'relative', overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${secondaryColor}, ${accentColor})` }} />
                  <div style={{ color: '#1A202C', fontSize: parts.length > 1 ? 44 : 24, fontWeight: 900, letterSpacing: '-1px', marginBottom: 6 }}>
                    {parts.length > 1 ? num : item}
                  </div>
                  {parts.length > 1 && (
                    <div style={{ color: '#718096', fontSize: 14, fontWeight: 500 }}>{label}</div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Market size */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            opacity: fadeIn(44, 58),
          }}>
            <div style={{ color: secondaryColor, fontSize: 48, fontWeight: 900 }}>{marketSize}</div>
            <div style={{ color: '#718096', fontSize: 18, fontWeight: 500 }}>{marketLabel}</div>
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SLIDE 4 — Team
      ══════════════════════════════════ */}
      {currentSlide === 4 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 120px' }}>

          <div style={{
            color: secondaryColor, fontSize: 12, fontWeight: 700,
            letterSpacing: 6, textTransform: 'uppercase',
            opacity: fadeIn(0, 14), marginBottom: 52,
          }}>
            The Team
          </div>

          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
            {teamArray.map((member, i) => {
              const parts = member.split(/—|-/)
              const name = parts[0]?.trim()
              const role = parts[1]?.trim() || ''
              const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
              const tStart = i * 18
              return (
                <div key={i} style={{
                  background: '#FFFFFF',
                  border: `1px solid ${secondaryColor}22`,
                  borderRadius: 20, padding: '28px 32px',
                  textAlign: 'center', minWidth: 200,
                  opacity: interpolate(slideFrame, [tStart, tStart + 14], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                  transform: `translateY(${spring({ frame: Math.max(0, slideFrame - tStart), fps, from: 40, to: 0, config: { damping } })}px)`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}>
                  <div style={{
                    width: 68, height: 68, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, fontWeight: 800, color: '#FFFFFF',
                    margin: '0 auto 16px',
                    boxShadow: `0 4px 16px ${secondaryColor}44`,
                  }}>
                    {initials}
                  </div>
                  <div style={{ color: '#1A202C', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{name}</div>
                  {role && <div style={{ color: secondaryColor, fontSize: 13, fontWeight: 500 }}>{role}</div>}
                </div>
              )
            })}
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SLIDE 5 — The Ask
      ══════════════════════════════════ */}
      {currentSlide === 5 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Bloom — subtle on light bg */}
          <div style={{
            position: 'absolute', width: 700, height: 700, borderRadius: '50%',
            background: `radial-gradient(circle, ${secondaryColor}12 0%, transparent 65%)`,
            transform: `scale(${interpolate(frame % 60, [0, 30, 60], [0.97, 1.04, 0.97])})`,
            pointerEvents: 'none',
          }} />

          <div style={{
            color: secondaryColor, fontSize: 12, fontWeight: 700,
            letterSpacing: 6, textTransform: 'uppercase',
            opacity: fadeIn(0, 14), marginBottom: 18,
          }}>
            The Ask
          </div>

          <div style={{
            fontSize: 130, fontWeight: 900, color: '#1A202C',
            opacity: fadeIn(6, 20),
            transform: `scale(${scaleSpring(6, 0.7)})`,
            textAlign: 'center', letterSpacing: '-5px', lineHeight: 0.95,
            marginBottom: 16,
            textShadow: `0 4px 30px ${secondaryColor}22`,
          }}>
            {askAmount}
          </div>

          <div style={{
            display: 'flex', gap: 14, marginBottom: 44, flexWrap: 'wrap', justifyContent: 'center',
            opacity: fadeIn(18, 32),
          }}>
            {askUseArray.map((use, i) => (
              <div key={i} style={{
                background: '#FFFFFF',
                border: `1px solid ${secondaryColor}33`,
                borderRadius: 50, padding: '8px 24px',
                color: secondaryColor, fontSize: 15, fontWeight: 600,
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              }}>
                {use}
              </div>
            ))}
          </div>

          <div style={{
            opacity: fadeIn(28, 42),
            transform: `scale(${scaleSpring(28, 0.8)})`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})`,
              borderRadius: 60, padding: '20px 72px',
              color: '#FFFFFF', fontSize: 22, fontWeight: 800,
              boxShadow: `0 8px 30px ${secondaryColor}44`,
            }}>
              {callToAction} →
            </div>
            <div style={{ color: '#718096', fontSize: 15 }}>{contactEmail}</div>
          </div>

        </AbsoluteFill>
      )}

      {/* Slide flash transitions */}
      {Array.from({ length: totalSlides - 1 }).map((_, i) => (
        <AbsoluteFill key={i} style={{
          background: '#FFFFFF',
          opacity: flashOpacity(i + 1),
          pointerEvents: 'none',
          zIndex: 50,
        }} />
      ))}

    </AbsoluteFill>
  )
}

export default PitchDeckVideo