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
  primaryColor = '#6366F1',
  secondaryColor = '#8B5CF6',
  accentColor = '#EC4899',
  photoPath = null,
  fontFamily = 'Inter',
  layout = 'Centered',
  tone = 'Professional',
  style = 'Clean',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const skillsArray = typeof skills === 'string'
    ? skills.split(',').map(s => s.trim()).filter(Boolean)
    : skills

  const companiesArray = typeof companies === 'string'
    ? companies.split(',').map(c => c.trim()).filter(Boolean)
    : companies

  // Proportional scene timing
  const S1 = Math.floor(durationInFrames * 0.20)  // Identity intro
  const S2 = Math.floor(durationInFrames * 0.45)  // Skills
  const S3 = Math.floor(durationInFrames * 0.70)  // Experience + achievement
  const S4 = durationInFrames                      // Contact CTA

  const currentScene = frame < S1 ? 0 : frame < S2 ? 1 : frame < S3 ? 2 : 3

  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, dist = 50) =>
    spring({ frame: Math.max(0, frame - start), fps, from: dist, to: 0, config: { damping: 12, stiffness: 100 } })

  const slideRight = (start) =>
    spring({ frame: Math.max(0, frame - start), fps, from: -70, to: 0, config: { damping: 12 } })

  const scaleIn = (start, from = 0.7) =>
    spring({ frame: Math.max(0, frame - start), fps, from, to: 1, config: { damping: 10 } })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const toneColor = tone === 'Creative' ? accentColor : tone === 'Bold' ? primaryColor : secondaryColor

  // Animated gradient border on avatar
  const gradientAngle = interpolate(frame, [0, durationInFrames], [0, 360])

  return (
    <AbsoluteFill style={{ background: '#07070D', fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Vertical accent bar left */}
      <div style={{
        position: 'absolute',
        top: 0, bottom: 0,
        left: 0,
        width: 6,
        background: `linear-gradient(180deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
        opacity: 0.8,
      }} />

      {/* Background glow */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 30% 50%, ${primaryColor}10 0%, transparent 55%),
                     radial-gradient(ellipse at 75% 30%, ${accentColor}0C 0%, transparent 50%)`,
      }} />

      {/* ===== SCENE 1: Identity Intro ===== */}
      {currentScene === 0 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 120px' }}>

          {/* Avatar */}
          <div style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: `conic-gradient(from ${gradientAngle}deg, ${primaryColor}, ${secondaryColor}, ${accentColor}, ${primaryColor})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: fadeIn(0, 18),
            transform: `scale(${scaleIn(0, 0.4)})`,
            marginBottom: 36,
            boxShadow: `0 0 60px ${primaryColor}33`,
          }}>
            <div style={{
              width: 128,
              height: 128,
              borderRadius: '50%',
              background: '#0A0A14',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 52,
            }}>
              👤
            </div>
          </div>

          {/* Name */}
          <div style={{
            fontSize: 96,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(10, 26),
            transform: `translateY(${slideUp(10, 50)}px)`,
            textAlign: 'center',
            letterSpacing: '-3px',
            lineHeight: 1,
            marginBottom: 16,
          }}>
            {fullName}
          </div>

          {/* Animated color bar */}
          <div style={{
            height: 3,
            width: interpolate(frame, [18, 45], [0, 300], { extrapolateRight: 'clamp' }),
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
            borderRadius: 2,
            marginBottom: 20,
          }} />

          {/* Title */}
          <div style={{
            fontSize: 26,
            fontWeight: 400,
            color: toneColor,
            opacity: fadeIn(22, 38),
            transform: `translateY(${slideUp(22, 25)}px)`,
            textAlign: 'center',
            letterSpacing: 0.5,
            marginBottom: 20,
          }}>
            {title}
          </div>

          {/* Bio */}
          <div style={{
            fontSize: 20,
            fontWeight: 300,
            color: '#666',
            opacity: fadeIn(30, 46),
            textAlign: 'center',
            maxWidth: 700,
            lineHeight: 1.6,
          }}>
            {bio}
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 2: Skills ===== */}
      {currentScene === 1 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 120px' }}>

          <div style={{
            color: toneColor,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 5,
            textTransform: 'uppercase',
            opacity: fadeIn(S1, S1 + 15),
            marginBottom: 20,
          }}>
            What I do
          </div>

          <div style={{
            fontSize: 64,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(S1 + 8, S1 + 24),
            transform: `translateY(${slideUp(S1 + 8, 40)}px)`,
            textAlign: 'center',
            letterSpacing: '-2px',
            marginBottom: 60,
          }}>
            Skills & Expertise
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', maxWidth: 1100 }}>
            {skillsArray.map((skill, i) => {
              const sStart = S1 + 18 + i * 12
              const colors = [primaryColor, secondaryColor, accentColor]
              const c = colors[i % 3]
              return (
                <div key={i} style={{
                  background: `${c}15`,
                  border: `1px solid ${c}44`,
                  borderRadius: 14,
                  padding: '16px 28px',
                  opacity: interpolate(frame, [sStart, sStart + 12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                  transform: `translateY(${spring({ frame: Math.max(0, frame - sStart), fps, from: 30, to: 0, config: { damping: 12 } })}px)`,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: 2,
                    background: `linear-gradient(90deg, transparent, ${c}, transparent)`,
                  }} />
                  <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 600 }}>{skill}</div>
                </div>
              )
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 3: Experience ===== */}
      {currentScene === 2 && (
        <AbsoluteFill style={{ display: 'flex', padding: '80px 100px', alignItems: 'center', gap: 80 }}>

          {/* Left — experience */}
          <div style={{ flex: 1 }}>
            <div style={{
              color: toneColor,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 5,
              textTransform: 'uppercase',
              opacity: fadeIn(S2, S2 + 15),
              marginBottom: 32,
            }}>
              Experience
            </div>

            <div style={{
              fontSize: 52,
              fontWeight: 800,
              color: '#FFFFFF',
              opacity: fadeIn(S2 + 8, S2 + 24),
              transform: `translateX(${slideRight(S2 + 8)}px)`,
              letterSpacing: '-1.5px',
              lineHeight: 1.2,
              marginBottom: 28,
            }}>
              {experience}
            </div>

            {/* Companies */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 36 }}>
              {companiesArray.map((company, i) => {
                const cStart = S2 + 18 + i * 12
                return (
                  <div key={i} style={{
                    background: '#0E0E18',
                    border: '1px solid #1E1E2E',
                    borderRadius: 10,
                    padding: '10px 22px',
                    color: '#AAAAAA',
                    fontSize: 16,
                    fontWeight: 500,
                    opacity: interpolate(frame, [cStart, cStart + 12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                    transform: `translateX(${spring({ frame: Math.max(0, frame - cStart), fps, from: -30, to: 0, config: { damping: 12 } })}px)`,
                  }}>
                    {company}
                  </div>
                )
              })}
            </div>

            <div style={{
              color: '#555',
              fontSize: 16,
              opacity: fadeIn(S2 + 40, S2 + 55),
            }}>
              🎓 {education}
            </div>
          </div>

          {/* Divider */}
          <div style={{
            width: 1,
            alignSelf: 'stretch',
            background: `linear-gradient(180deg, transparent, ${primaryColor}44, transparent)`,
            opacity: fadeIn(S2, S2 + 20),
          }} />

          {/* Right — achievement */}
          <div style={{ flex: 1 }}>
            <div style={{
              color: accentColor,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 5,
              textTransform: 'uppercase',
              opacity: fadeIn(S2 + 10, S2 + 25),
              marginBottom: 32,
            }}>
              Key Achievement
            </div>

            <div style={{
              background: '#0C0C18',
              border: `1px solid ${accentColor}33`,
              borderRadius: 20,
              padding: '36px 40px',
              opacity: fadeIn(S2 + 18, S2 + 35),
              transform: `translateY(${spring({ frame: Math.max(0, frame - S2 - 18), fps, from: 40, to: 0, config: { damping: 12 } })}px)`,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
              }} />
              <div style={{ color: accentColor, fontSize: 48, marginBottom: 16 }}>🏆</div>
              <div style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 700, lineHeight: 1.4 }}>{achievement}</div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 4: Contact CTA ===== */}
      {currentScene === 3 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          <div style={{
            position: 'absolute',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 65%)`,
            transform: `scale(${interpolate(frame % 60, [0, 30, 60], [1, 1.05, 1])})`,
          }} />

          {/* Avatar small */}
          <div style={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            background: `conic-gradient(from ${gradientAngle}deg, ${primaryColor}, ${accentColor}, ${primaryColor})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: fadeIn(S3, S3 + 15),
            transform: `scale(${scaleIn(S3, 0.5)})`,
            marginBottom: 28,
          }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#0A0A14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>
              👤
            </div>
          </div>

          <div style={{
            fontSize: 88,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(S3 + 8, S3 + 24),
            transform: `translateY(${slideUp(S3 + 8, 40)}px)`,
            textAlign: 'center',
            letterSpacing: '-3px',
            lineHeight: 1,
            marginBottom: 12,
          }}>
            {fullName}
          </div>

          <div style={{
            color: toneColor,
            fontSize: 22,
            fontWeight: 400,
            opacity: fadeIn(S3 + 16, S3 + 30),
            marginBottom: 12,
          }}>
            {title}
          </div>

          <div style={{
            color: '#555',
            fontSize: 18,
            opacity: fadeIn(S3 + 22, S3 + 36),
            marginBottom: 48,
          }}>
            {portfolioUrl}
          </div>

          <div style={{
            display: 'flex',
            gap: 20,
            opacity: fadeIn(S3 + 30, S3 + 46),
            transform: `translateY(${slideUp(S3 + 30, 25)}px)`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 60,
              padding: '20px 60px',
              color: '#FFFFFF',
              fontSize: 20,
              fontWeight: 800,
              boxShadow: `0 0 50px ${primaryColor}44`,
            }}>
              Hire Me →
            </div>
            <div style={{
              background: 'transparent',
              border: `2px solid ${primaryColor}55`,
              borderRadius: 60,
              padding: '20px 40px',
              color: '#FFFFFF',
              fontSize: 20,
              fontWeight: 600,
            }}>
              {contact}
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

export default ResumePortfolio