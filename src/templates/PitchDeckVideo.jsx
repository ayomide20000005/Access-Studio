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
  callToAction = 'Lets Talk',
  contactEmail = 'hello@yourstartup.com',
  primaryColor = '#7C3AED',
  secondaryColor = '#4F46E5',
  accentColor = '#06B6D4',
  fontFamily = 'Inter',
  tone = 'Confident',
  style = 'Startup',
  pace = 'Medium',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const damping = pace === 'Fast' ? 20 : pace === 'Slow' ? 8 : 12

  const tractionArray = typeof traction === 'string'
    ? traction.split(',').map(t => t.trim()).filter(Boolean)
    : traction

  const teamArray = typeof teamNames === 'string'
    ? teamNames.split(',').map(t => t.trim()).filter(Boolean)
    : teamNames

  const askUseArray = typeof askUse === 'string'
    ? askUse.split(',').map(a => a.trim()).filter(Boolean)
    : askUse

  // Proportional scene timing — 6 slides
  const totalSlides = 6
  const framesPerSlide = Math.floor(durationInFrames / totalSlides)
  const currentSlide = Math.min(Math.floor(frame / framesPerSlide), totalSlides - 1)
  const slideFrame = frame - currentSlide * framesPerSlide
  const slideProgress = interpolate(slideFrame, [0, framesPerSlide], [0, 1], { extrapolateRight: 'clamp' })

  const fadeIn = (start, end) =>
    interpolate(slideFrame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, dist = 40) =>
    spring({ frame: Math.max(0, slideFrame - start), fps, from: dist, to: 0, config: { damping, stiffness: 100 } })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const toneColor = tone === 'Inspiring' ? accentColor : tone === 'Data Driven' ? '#0EA5E9' : tone === 'Storytelling' ? '#EC4899' : primaryColor

  const slides = [
    { id: 'cover', label: 'Cover' },
    { id: 'problem', label: 'Problem' },
    { id: 'solution', label: 'Solution' },
    { id: 'traction', label: 'Traction' },
    { id: 'team', label: 'Team' },
    { id: 'ask', label: 'The Ask' },
  ]

  return (
    <AbsoluteFill style={{ background: '#060810', fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Background glow */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 20% 30%, ${primaryColor}12 0%, transparent 55%),
                     radial-gradient(ellipse at 80% 70%, ${secondaryColor}0E 0%, transparent 50%)`,
      }} />

      {/* Slide number + progress dots */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 10,
        zIndex: 10,
      }}>
        {slides.map((_, i) => (
          <div key={i} style={{
            height: 4,
            width: i === currentSlide ? 32 : 12,
            borderRadius: 2,
            background: i === currentSlide ? toneColor : '#222',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      {/* Slide counter top right */}
      <div style={{
        position: 'absolute',
        top: 40,
        right: 60,
        color: '#333',
        fontSize: 15,
        fontWeight: 500,
        fontFamily: 'monospace',
        zIndex: 10,
      }}>
        {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
      </div>

      {/* Slide progress line */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 3,
        background: '#111',
        zIndex: 10,
      }}>
        <div style={{
          height: '100%',
          width: `${((currentSlide + slideProgress) / totalSlides) * 100}%`,
          background: `linear-gradient(90deg, ${primaryColor}, ${toneColor})`,
          borderRadius: 2,
        }} />
      </div>

      {/* ===== SLIDE 1: Cover ===== */}
      {currentSlide === 0 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Decorative lines */}
          <div style={{ position: 'absolute', left: 80, top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg, transparent, ${primaryColor}33, transparent)` }} />
          <div style={{ position: 'absolute', right: 80, top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg, transparent, ${primaryColor}33, transparent)` }} />

          <div style={{
            color: toneColor,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: fadeIn(0, 15),
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{ width: 40, height: 1, background: toneColor }} />
            Investor Deck
            <div style={{ width: 40, height: 1, background: toneColor }} />
          </div>

          <div style={{
            fontSize: 120,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(8, 25),
            transform: `translateY(${slideUp(8, 50)}px)`,
            textAlign: 'center',
            letterSpacing: '-5px',
            lineHeight: 0.9,
            marginBottom: 28,
          }}>
            {companyName}
          </div>

          <div style={{
            fontSize: 26,
            fontWeight: 300,
            color: '#666',
            opacity: fadeIn(20, 38),
            transform: `translateY(${slideUp(20, 25)}px)`,
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.5,
          }}>
            {tagline}
          </div>

          <div style={{
            marginTop: 52,
            height: 2,
            width: interpolate(slideFrame, [25, 55], [0, 200], { extrapolateRight: 'clamp' }),
            background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
            borderRadius: 1,
          }} />
        </AbsoluteFill>
      )}

      {/* ===== SLIDE 2: Problem ===== */}
      {currentSlide === 1 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 160px' }}>

          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, #EF444466, transparent)`, opacity: fadeIn(0, 20) }} />

          <div style={{ fontSize: 64, opacity: fadeIn(0, 15), transform: `scale(${spring({ frame: Math.max(0, slideFrame), fps, from: 0.5, to: 1, config: { damping: 8 } })})`, marginBottom: 28 }}>⚠️</div>

          <div style={{ color: '#EF4444', fontSize: 13, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase', opacity: fadeIn(8, 22), marginBottom: 24 }}>The Problem</div>

          <div style={{
            fontSize: 58,
            fontWeight: 800,
            color: '#FFFFFF',
            opacity: fadeIn(14, 30),
            transform: `translateY(${slideUp(14, 40)}px)`,
            textAlign: 'center',
            lineHeight: 1.2,
            letterSpacing: '-1.5px',
            maxWidth: 1100,
          }}>
            {problem}
          </div>

          <div style={{
            marginTop: 48,
            height: 2,
            width: interpolate(slideFrame, [30, 60], [0, 250], { extrapolateRight: 'clamp' }),
            background: 'linear-gradient(90deg, #EF4444, transparent)',
            borderRadius: 1,
          }} />
        </AbsoluteFill>
      )}

      {/* ===== SLIDE 3: Solution ===== */}
      {currentSlide === 2 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 160px' }}>

          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${toneColor}66, transparent)`, opacity: fadeIn(0, 20) }} />

          <div style={{ fontSize: 64, opacity: fadeIn(0, 15), transform: `scale(${spring({ frame: Math.max(0, slideFrame), fps, from: 0.5, to: 1, config: { damping: 8 } })})`, marginBottom: 28 }}>💡</div>

          <div style={{ color: toneColor, fontSize: 13, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase', opacity: fadeIn(8, 22), marginBottom: 24 }}>Our Solution</div>

          <div style={{
            fontSize: 58,
            fontWeight: 800,
            color: '#FFFFFF',
            opacity: fadeIn(14, 30),
            transform: `translateY(${slideUp(14, 40)}px)`,
            textAlign: 'center',
            lineHeight: 1.2,
            letterSpacing: '-1.5px',
            maxWidth: 1100,
          }}>
            {solution}
          </div>

          <div style={{
            marginTop: 48,
            background: `${toneColor}18`,
            border: `1px solid ${toneColor}33`,
            borderRadius: 50,
            padding: '12px 36px',
            color: toneColor,
            fontSize: 16,
            fontWeight: 700,
            opacity: fadeIn(35, 52),
          }}>
            {companyName}
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SLIDE 4: Traction ===== */}
      {currentSlide === 3 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 120px' }}>

          <div style={{ color: accentColor, fontSize: 13, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase', opacity: fadeIn(0, 15), marginBottom: 52 }}>Traction</div>

          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            {tractionArray.map((item, i) => {
              const parts = item.split(/—|-/)
              const num = parts[0]?.trim()
              const label = parts[1]?.trim() || item
              const tStart = i * 15
              return (
                <div key={i} style={{
                  background: '#0C0C18',
                  border: `1px solid ${toneColor}33`,
                  borderRadius: 20,
                  padding: '32px 44px',
                  textAlign: 'center',
                  minWidth: 220,
                  opacity: interpolate(slideFrame, [tStart, tStart + 15], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                  transform: `translateY(${spring({ frame: Math.max(0, slideFrame - tStart), fps, from: 50, to: 0, config: { damping } })}px)`,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${toneColor}, transparent)` }} />
                  <div style={{ color: '#FFFFFF', fontSize: parts.length > 1 ? 48 : 28, fontWeight: 900, letterSpacing: '-1px', marginBottom: 8 }}>
                    {parts.length > 1 ? num : item}
                  </div>
                  {parts.length > 1 && (
                    <div style={{ color: '#666', fontSize: 16, fontWeight: 500 }}>{label}</div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Market size */}
          <div style={{
            marginTop: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            opacity: fadeIn(40, 55),
          }}>
            <div style={{ color: toneColor, fontSize: 52, fontWeight: 900 }}>{marketSize}</div>
            <div style={{ color: '#555', fontSize: 20, fontWeight: 500 }}>{marketLabel}</div>
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SLIDE 5: Team ===== */}
      {currentSlide === 4 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 120px' }}>

          <div style={{ color: toneColor, fontSize: 13, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase', opacity: fadeIn(0, 15), marginBottom: 52 }}>The Team</div>

          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
            {teamArray.map((member, i) => {
              const parts = member.split(/—|-/)
              const name = parts[0]?.trim()
              const role = parts[1]?.trim() || ''
              const tStart = i * 18
              const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
              return (
                <div key={i} style={{
                  background: '#0C0C18',
                  border: `1px solid ${primaryColor}22`,
                  borderRadius: 20,
                  padding: '32px 36px',
                  textAlign: 'center',
                  minWidth: 220,
                  opacity: interpolate(slideFrame, [tStart, tStart + 15], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                  transform: `translateY(${spring({ frame: Math.max(0, slideFrame - tStart), fps, from: 40, to: 0, config: { damping } })}px)`,
                }}>
                  <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    margin: '0 auto 20px',
                    boxShadow: `0 0 30px ${primaryColor}33`,
                  }}>
                    {initials}
                  </div>
                  <div style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{name}</div>
                  {role && <div style={{ color: toneColor, fontSize: 14, fontWeight: 500 }}>{role}</div>}
                </div>
              )
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SLIDE 6: The Ask ===== */}
      {currentSlide === 5 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          <div style={{
            position: 'absolute',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}18 0%, transparent 65%)`,
            transform: `scale(${interpolate(slideFrame % 60, [0, 30, 60], [1, 1.06, 1])})`,
          }} />

          <div style={{ color: toneColor, fontSize: 13, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase', opacity: fadeIn(0, 15), marginBottom: 20 }}>The Ask</div>

          <div style={{
            fontSize: 140,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(8, 22),
            transform: `scale(${spring({ frame: Math.max(0, slideFrame - 8), fps, from: 0.7, to: 1, config: { damping } })})`,
            textAlign: 'center',
            letterSpacing: '-6px',
            lineHeight: 0.9,
            marginBottom: 16,
            textShadow: `0 0 80px ${primaryColor}44`,
          }}>
            {askAmount}
          </div>

          <div style={{
            display: 'flex',
            gap: 16,
            marginBottom: 48,
            flexWrap: 'wrap',
            justifyContent: 'center',
            opacity: fadeIn(20, 36),
          }}>
            {askUseArray.map((use, i) => (
              <div key={i} style={{
                background: `${toneColor}18`,
                border: `1px solid ${toneColor}33`,
                borderRadius: 50,
                padding: '8px 24px',
                color: toneColor,
                fontSize: 16,
                fontWeight: 600,
              }}>
                {use}
              </div>
            ))}
          </div>

          <div style={{
            opacity: fadeIn(32, 48),
            transform: `translateY(${spring({ frame: Math.max(0, slideFrame - 32), fps, from: 30, to: 0, config: { damping } })}px)`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 60,
              padding: '20px 64px',
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: 800,
              boxShadow: `0 0 60px ${primaryColor}44`,
              marginBottom: 20,
              textAlign: 'center',
            }}>
              {callToAction} →
            </div>
            <div style={{ color: '#444', fontSize: 16, textAlign: 'center' }}>{contactEmail}</div>
          </div>
        </AbsoluteFill>
      )}

      {/* Slide transition flash */}
      {Array.from({ length: totalSlides - 1 }).map((_, i) => {
        const t = (i + 1) * framesPerSlide
        return (
          <AbsoluteFill key={i} style={{
            background: '#000000',
            opacity: interpolate(frame, [t - 4, t, t + 8], [0, 0.9, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
            pointerEvents: 'none',
          }} />
        )
      })}

    </AbsoluteFill>
  )
}

export default PitchDeckVideo