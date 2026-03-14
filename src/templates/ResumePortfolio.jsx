// LOCATION: src/templates/ResumePortfolio.jsx

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export const ResumePortfolio = ({
  fullName = 'Your Name',
  title = 'Product Designer & Developer',
  bio = 'I build beautiful digital products that people love to use',
  skills = 'UI/UX Design, React Development, Motion Design, Brand Strategy',
  experience = '5+ Years Experience',
  companies = 'Google, Airbnb, Stripe',
  achievement = 'Led team that grew revenue by 300%',
  education = 'BSc Computer Science, MIT',
  contact = 'hello@yourname.com',
  portfolioUrl = 'yourname.com',
  primaryColor = '#7C3AED',
  secondaryColor = '#4F46E5',
  accentColor = '#EC4899',
  fontFamily = 'Inter',
  layout = 'Centered',
  tone = 'Professional',
  style = 'Clean',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const skillsArray = typeof skills === 'string'
    ? skills.split(',').map(s => s.trim()).filter(Boolean)
    : Array.isArray(skills) ? skills : []

  const companiesArray = typeof companies === 'string'
    ? companies.split(',').map(c => c.trim()).filter(Boolean)
    : Array.isArray(companies) ? companies : []

  const damping = 12

  // ── Proportional scene timing ──
  const S1 = Math.floor(durationInFrames * 0.22) // Identity intro
  const S2 = Math.floor(durationInFrames * 0.48) // Skills
  const S3 = Math.floor(durationInFrames * 0.74) // Experience + achievement
  const S4 = durationInFrames                     // Contact CTA

  const scene = frame < S1 ? 0 : frame < S2 ? 1 : frame < S3 ? 2 : 3

  // ── Helpers ──
  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, dist = 50) =>
    spring({ frame: Math.max(0, frame - start), fps, from: dist, to: 0, config: { damping } })

  const slideRight = (start, dist = 60) =>
    spring({ frame: Math.max(0, frame - start), fps, from: -dist, to: 0, config: { damping } })

  const slideLeft = (start, dist = 60) =>
    spring({ frame: Math.max(0, frame - start), fps, from: dist, to: 0, config: { damping } })

  const scaleSpring = (start, from = 0.7) =>
    spring({ frame: Math.max(0, frame - start), fps, from, to: 1, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const flashOpacity = (t) =>
    interpolate(frame, [t - 3, t, t + 8], [0, 0.6, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const toneColor = tone === 'Creative' ? accentColor : tone === 'Bold' ? primaryColor : secondaryColor

  // ── Rotating gradient border angle for avatar ──
  const gradientAngle = interpolate(frame, [0, durationInFrames], [0, 360])

  // ── Skill bar fill ──
  const SkillBar = ({ skill, index, startFrame }) => {
    const percent = 70 + (index * 7) % 30
    const barW = interpolate(frame, [startFrame + index * 10, startFrame + index * 10 + 35], [0, percent], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    const op = interpolate(frame, [startFrame + index * 8, startFrame + index * 8 + 12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    return (
      <div style={{ opacity: op, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: '#4A3728', fontSize: 15, fontWeight: 600 }}>{skill}</span>
          <span style={{ color: toneColor, fontSize: 13, fontWeight: 700 }}>{Math.round(barW)}%</span>
        </div>
        <div style={{ height: 6, background: '#D4B8A0', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${barW}%`,
            background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
            borderRadius: 3,
            boxShadow: `0 0 8px ${primaryColor}55`,
          }} />
        </div>
      </div>
    )
  }

  // ── Bubble pop achievement ──
  const BubblePop = ({ text, startFrame, color = primaryColor }) => {
    const sc = spring({ frame: Math.max(0, frame - startFrame), fps, from: 0, to: 1, config: { damping: 5, stiffness: 200 } })
    const op = interpolate(frame, [startFrame, startFrame + 8], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    return (
      <div style={{
        background: `${color}18`,
        border: `1.5px solid ${color}44`,
        borderRadius: 14, padding: '14px 24px',
        opacity: op, transform: `scale(${sc})`,
        display: 'inline-block',
        boxShadow: `0 4px 16px ${color}22`,
      }}>
        <span style={{ color: '#2D1B00', fontSize: 17, fontWeight: 600 }}>{text}</span>
      </div>
    )
  }

  // ── Name split reveal — halves slide in from sides ──
  const NameSplitReveal = ({ name, startFrame, fontSize = 96 }) => {
    const words = name.split(' ')
    const mid = Math.ceil(words.length / 2)
    const firstHalf = words.slice(0, mid).join(' ')
    const secondHalf = words.slice(mid).join(' ')
    const xFirst = spring({ frame: Math.max(0, frame - startFrame), fps, from: -80, to: 0, config: { damping } })
    const xSecond = spring({ frame: Math.max(0, frame - startFrame), fps, from: 80, to: 0, config: { damping } })
    const op = interpolate(frame, [startFrame, startFrame + 12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    return (
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', opacity: op }}>
        <span style={{
          fontSize, fontWeight: 900, color: '#2D1B00',
          transform: `translateX(${xFirst}px)`,
          display: 'inline-block', letterSpacing: '-3px', lineHeight: 1,
        }}>
          {firstHalf}
        </span>
        {secondHalf && (
          <span style={{
            fontSize, fontWeight: 900, color: primaryColor,
            transform: `translateX(${xSecond}px)`,
            display: 'inline-block', letterSpacing: '-3px', lineHeight: 1,
          }}>
            {secondHalf}
          </span>
        )}
      </div>
    )
  }

  return (
    <AbsoluteFill style={{ background: '#E8D5C4', fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Warm ivory peach base */}
      <AbsoluteFill style={{
        background: `
          radial-gradient(ellipse at 20% 30%, ${primaryColor}14 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, ${accentColor}10 0%, transparent 50%),
          linear-gradient(160deg, #F0DDD0 0%, #E8D5C4 50%, #DCC5B0 100%)
        `,
      }} />

      {/* Diagonal accent lines */}
      <AbsoluteFill style={{
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 55px,
          ${primaryColor}05 55px,
          ${primaryColor}05 56px
        )`,
        pointerEvents: 'none',
      }} />

      {/* Left accent bar */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0,
        width: 6,
        background: `linear-gradient(180deg, ${primaryColor}, ${accentColor}, ${secondaryColor})`,
        opacity: 0.85,
      }} />

      {/* ══════════════════════════════════
          SCENE 0 — Identity Intro
      ══════════════════════════════════ */}
      {scene === 0 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 120px' }}>

          {/* Rotating gradient avatar */}
          <div style={{
            width: 150, height: 150, borderRadius: '50%',
            background: `conic-gradient(from ${gradientAngle}deg, ${primaryColor}, ${accentColor}, ${secondaryColor}, ${primaryColor})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: fadeIn(0, 18),
            transform: `scale(${scaleSpring(0, 0.4)})`,
            marginBottom: 32,
            boxShadow: `0 8px 40px ${primaryColor}33, 0 4px 20px rgba(0,0,0,0.1)`,
          }}>
            <div style={{
              width: 136, height: 136, borderRadius: '50%',
              background: '#E8D5C4',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 56,
            }}>
              👤
            </div>
          </div>

          {/* Name split reveal */}
          <NameSplitReveal name={fullName} startFrame={8} fontSize={96} />

          {/* Animated underline */}
          <div style={{
            height: 4,
            width: interpolate(frame, [16, 46], [0, 340], { extrapolateRight: 'clamp' }),
            background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
            borderRadius: 2, marginTop: 12, marginBottom: 20,
            boxShadow: `0 2px 12px ${primaryColor}44`,
          }} />

          {/* Title */}
          <div style={{
            fontSize: 24, fontWeight: 500, color: toneColor,
            opacity: fadeIn(20, 34),
            transform: `translateY(${slideUp(20, 20)}px)`,
            textAlign: 'center', letterSpacing: 0.5, marginBottom: 18,
          }}>
            {title}
          </div>

          {/* Bio */}
          <div style={{
            fontSize: 18, fontWeight: 300, color: '#6B4F3A',
            opacity: fadeIn(26, 40),
            textAlign: 'center', maxWidth: 700, lineHeight: 1.6,
          }}>
            {bio}
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 1 — Skills
      ══════════════════════════════════ */}
      {scene === 1 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 140px' }}>

          <div style={{
            color: toneColor, fontSize: 12, fontWeight: 700,
            letterSpacing: 6, textTransform: 'uppercase',
            opacity: fadeIn(S1, S1 + 14), marginBottom: 18,
          }}>
            What I do
          </div>

          <div style={{
            fontSize: 62, fontWeight: 900, color: '#2D1B00',
            opacity: fadeIn(S1 + 8, S1 + 22),
            transform: `translateY(${slideUp(S1 + 8, 40)}px)`,
            textAlign: 'center', letterSpacing: '-2px', marginBottom: 48,
          }}>
            Skills & Expertise
          </div>

          {/* Skill bars */}
          <div style={{ width: '100%', maxWidth: 900 }}>
            {skillsArray.map((skill, i) => (
              <SkillBar key={i} skill={skill} index={i} startFrame={S1 + 20} />
            ))}
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 2 — Experience + Achievement
      ══════════════════════════════════ */}
      {scene === 2 && (
        <AbsoluteFill style={{ display: 'flex', padding: '80px 100px', alignItems: 'center', gap: 80 }}>

          {/* Left — experience */}
          <div style={{ flex: 1 }}>
            <div style={{
              color: toneColor, fontSize: 12, fontWeight: 700,
              letterSpacing: 6, textTransform: 'uppercase',
              opacity: fadeIn(S2, S2 + 14), marginBottom: 28,
            }}>
              Experience
            </div>

            <div style={{
              fontSize: 52, fontWeight: 800, color: '#2D1B00',
              opacity: fadeIn(S2 + 8, S2 + 22),
              transform: `translateX(${slideRight(S2 + 8, 50)}px)`,
              letterSpacing: '-1.5px', lineHeight: 1.2, marginBottom: 24,
            }}>
              {experience}
            </div>

            {/* Companies */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
              {companiesArray.map((company, i) => {
                const cStart = S2 + 18 + i * 12
                return (
                  <div key={i} style={{
                    background: '#FFFFFF',
                    border: '1px solid #C4A882',
                    borderRadius: 10, padding: '8px 20px',
                    color: '#4A3728', fontSize: 15, fontWeight: 500,
                    opacity: interpolate(frame, [cStart, cStart + 12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                    transform: `translateX(${spring({ frame: Math.max(0, frame - cStart), fps, from: -28, to: 0, config: { damping } })}px)`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                  }}>
                    {company}
                  </div>
                )
              })}
            </div>

            <div style={{ color: '#8B6A54', fontSize: 15, opacity: fadeIn(S2 + 36, S2 + 48) }}>
              🎓 {education}
            </div>
          </div>

          {/* Divider */}
          <div style={{
            width: 1, alignSelf: 'stretch',
            background: `linear-gradient(180deg, transparent, ${primaryColor}33, transparent)`,
            opacity: fadeIn(S2, S2 + 18),
          }} />

          {/* Right — achievement */}
          <div style={{ flex: 1 }}>
            <div style={{
              color: accentColor, fontSize: 12, fontWeight: 700,
              letterSpacing: 6, textTransform: 'uppercase',
              opacity: fadeIn(S2 + 10, S2 + 24), marginBottom: 28,
            }}>
              Key Achievement
            </div>

            <div style={{
              background: '#FFFFFF',
              border: `1px solid ${primaryColor}33`,
              borderRadius: 20, padding: '32px 36px',
              opacity: fadeIn(S2 + 16, S2 + 30),
              transform: `translateY(${spring({ frame: Math.max(0, frame - S2 - 16), fps, from: 40, to: 0, config: { damping } })}px)`,
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
              }} />
              <div style={{ color: accentColor, fontSize: 42, marginBottom: 14 }}>🏆</div>
              <div style={{ color: '#2D1B00', fontSize: 22, fontWeight: 700, lineHeight: 1.4 }}>
                {achievement}
              </div>
            </div>

            {/* Bubble pop skill highlights */}
            <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {skillsArray.slice(0, 3).map((skill, i) => (
                <BubblePop key={i} text={skill} startFrame={S2 + 38 + i * 10} color={[primaryColor, secondaryColor, accentColor][i % 3]} />
              ))}
            </div>
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 3 — Contact CTA
      ══════════════════════════════════ */}
      {scene === 3 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Subtle bloom */}
          <div style={{
            position: 'absolute', width: 700, height: 700, borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}12 0%, transparent 65%)`,
            transform: `scale(${interpolate(frame % 60, [0, 30, 60], [0.97, 1.04, 0.97])})`,
            pointerEvents: 'none',
          }} />

          {/* Avatar small */}
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: `conic-gradient(from ${gradientAngle}deg, ${primaryColor}, ${accentColor}, ${primaryColor})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: fadeIn(S3, S3 + 14),
            transform: `scale(${scaleSpring(S3, 0.4)})`,
            marginBottom: 24,
            boxShadow: `0 8px 30px ${primaryColor}33`,
          }}>
            <div style={{
              width: 78, height: 78, borderRadius: '50%',
              background: '#E8D5C4',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34,
            }}>👤</div>
          </div>

          {/* Name split again */}
          <NameSplitReveal name={fullName} startFrame={S3 + 6} fontSize={88} />

          <div style={{
            fontSize: 22, fontWeight: 400, color: toneColor,
            opacity: fadeIn(S3 + 14, S3 + 26),
            marginTop: 12, marginBottom: 8,
          }}>
            {title}
          </div>

          <div style={{
            color: '#8B6A54', fontSize: 16,
            opacity: fadeIn(S3 + 20, S3 + 32),
            marginBottom: 44,
          }}>
            {portfolioUrl}
          </div>

          {/* Parallax fade CTA buttons */}
          <div style={{
            display: 'flex', gap: 18,
            opacity: fadeIn(S3 + 28, S3 + 42),
            transform: `translateY(${slideUp(S3 + 28, 25)}px)`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 60, padding: '18px 56px',
              color: '#FFFFFF', fontSize: 20, fontWeight: 800,
              boxShadow: `0 8px 30px ${primaryColor}44`,
            }}>
              Hire Me →
            </div>
            <div style={{
              background: '#FFFFFF',
              border: `2px solid ${primaryColor}44`,
              borderRadius: 60, padding: '18px 36px',
              color: '#2D1B00', fontSize: 18, fontWeight: 600,
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            }}>
              {contact}
            </div>
          </div>

        </AbsoluteFill>
      )}

      {/* Scene flash transitions — warm white */}
      {[S1, S2, S3].map((t, i) => (
        <AbsoluteFill key={i} style={{
          background: '#F5EDE0',
          opacity: flashOpacity(t),
          pointerEvents: 'none',
          zIndex: 50,
        }} />
      ))}

    </AbsoluteFill>
  )
}

export default ResumePortfolio