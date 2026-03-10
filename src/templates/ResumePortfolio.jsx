import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { TextLayer } from '../remotion/components/TextLayer'
import { ImageLayer } from '../remotion/components/ImageLayer'

export const ResumePortfolio = ({
  fullName = 'Your Name',
  role = 'Your Role',
  skills = 'Skill One, Skill Two, Skill Three',
  experience = '3+ Years Experience',
  contact = 'hello@yourname.com',
  primaryColor = '#4F46E5',
  secondaryColor = '#7C3AED',
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

  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideRight = (start) =>
    spring({ frame: Math.max(0, frame - start), fps, from: -60, to: 0, config: { damping: 12 } })

  const slideLeft = (start) =>
    spring({ frame: Math.max(0, frame - start), fps, from: 60, to: 0, config: { damping: 12 } })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const getBg = () => {
    if (style === 'Elegant') return `linear-gradient(135deg, #0A0A14 0%, #14141F 100%)`
    if (style === 'Bold') return `linear-gradient(135deg, ${primaryColor}22 0%, #0F0F0F 60%)`
    return '#0F0F0F'
  }

  const toneColor = tone === 'Creative' ? primaryColor : tone === 'Minimal' ? '#888888' : primaryColor

  return (
    <AbsoluteFill style={{ background: getBg(), fontFamily, opacity: outroOpacity }}>
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 6, background: `linear-gradient(180deg, ${primaryColor}, ${secondaryColor})` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 50%, ${primaryColor}11 0%, transparent 60%)` }} />

      {layout === 'Centered' ? (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 100 }}>
          {photoPath ? (
            <div style={{ opacity: fadeIn(0, 25) }}>
              <ImageLayer src={photoPath} style={{ width: 200, height: 200, borderRadius: '50%', objectFit: 'cover', border: `4px solid ${primaryColor}` }} />
            </div>
          ) : (
            <div style={{ width: 200, height: 200, borderRadius: '50%', background: `linear-gradient(135deg, ${primaryColor}44, ${secondaryColor}44)`, border: `4px solid ${primaryColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, opacity: fadeIn(0, 25) }}>
              👤
            </div>
          )}
          <TextLayer text={fullName} style={{ fontSize: 72, fontWeight: 800, color: '#FFFFFF', opacity: fadeIn(15, 35), textAlign: 'center', letterSpacing: '-2px' }} />
          <TextLayer text={role} style={{ fontSize: 28, fontWeight: 400, color: toneColor, opacity: fadeIn(20, 40), textAlign: 'center' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', opacity: fadeIn(30, 50) }}>
            {skillsArray.map((skill, i) => (
              <div key={i} style={{ background: `${primaryColor}22`, border: `1px solid ${primaryColor}44`, borderRadius: 8, padding: '8px 20px', color: '#FFFFFF', fontSize: 16, fontWeight: 500 }}>
                {skill}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 32, opacity: fadeIn(45, 65) }}>
            <div style={{ color: '#AAAAAA', fontSize: 18 }}>💼 {experience}</div>
            <div style={{ color: '#AAAAAA', fontSize: 18 }}>✉️ {contact}</div>
          </div>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', padding: '0 100px' }}>
          <div style={{ width: 300, height: 300, flexShrink: 0, marginRight: 80, opacity: fadeIn(0, 25), transform: `translateX(${slideRight(0)}px)` }}>
            {photoPath ? (
              <ImageLayer src={photoPath} style={{ width: 300, height: 300, borderRadius: '50%', objectFit: 'cover', border: `4px solid ${primaryColor}` }} />
            ) : (
              <div style={{ width: 300, height: 300, borderRadius: '50%', background: `linear-gradient(135deg, ${primaryColor}44, ${secondaryColor}44)`, border: `4px solid ${primaryColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>
                👤
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: toneColor, fontSize: 16, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', opacity: fadeIn(10, 30), transform: `translateX(${slideLeft(10)}px)`, marginBottom: 12 }}>Portfolio</div>
            <TextLayer text={fullName} style={{ fontSize: 72, fontWeight: 800, color: '#FFFFFF', opacity: fadeIn(15, 35), transform: `translateX(${slideLeft(15)}px)`, marginBottom: 8, letterSpacing: '-2px' }} />
            <TextLayer text={role} style={{ fontSize: 28, fontWeight: 400, color: toneColor, opacity: fadeIn(20, 40), transform: `translateX(${slideLeft(20)}px)`, marginBottom: 32 }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32, opacity: fadeIn(30, 50) }}>
              {skillsArray.map((skill, i) => (
                <div key={i} style={{ background: `${primaryColor}22`, border: `1px solid ${primaryColor}44`, borderRadius: 8, padding: '8px 20px', color: '#FFFFFF', fontSize: 16, fontWeight: 500 }}>
                  {skill}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 32, opacity: fadeIn(45, 65) }}>
              <div style={{ color: '#AAAAAA', fontSize: 18 }}>💼 {experience}</div>
              <div style={{ color: '#AAAAAA', fontSize: 18 }}>✉️ {contact}</div>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  )
}

export default ResumePortfolio