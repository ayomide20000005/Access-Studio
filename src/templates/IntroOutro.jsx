import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { TextLayer } from '../remotion/components/TextLayer'
import { ImageLayer } from '../remotion/components/ImageLayer'

export const IntroOutro = ({
  channelName = 'Your Channel',
  tagline = 'Subscribe for more',
  socialLinks = '@yourchannel',
  primaryColor = '#D97706',
  secondaryColor = '#DC2626',
  logoPath = null,
  fontFamily = 'Inter',
  type = 'Intro',
  style = 'Dynamic',
  animation = 'Smooth',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const linksArray = typeof socialLinks === 'string'
    ? socialLinks.split(',').map(l => l.trim()).filter(Boolean)
    : socialLinks

  const isIntro = type === 'Intro' || type === 'Both'
  const damping = animation === 'Snappy' ? 20 : animation === 'Bounce' ? 6 : 12

  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const scaleIn = spring({ frame, fps, from: isIntro ? 0.5 : 1.2, to: 1, config: { damping, stiffness: 80 } })
  const rotate = interpolate(frame, [0, durationInFrames], [0, isIntro ? 360 : -360])
  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const getBg = () => {
    if (style === 'Minimal') return '#0F0F0F'
    if (style === 'Cinematic') return `linear-gradient(180deg, #000000 0%, #0F0F0F 50%, #000000 100%)`
    if (style === 'Playful') return `linear-gradient(135deg, ${primaryColor}33 0%, ${secondaryColor}22 100%)`
    return '#0F0F0F'
  }

  return (
    <AbsoluteFill style={{ background: getBg(), fontFamily, opacity: outroOpacity }}>
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 600, height: 600, borderRadius: '50%', border: `2px solid ${primaryColor}33`, transform: `rotate(${rotate}deg)` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 400, height: 400, borderRadius: '50%', border: `2px solid ${secondaryColor}22`, transform: `rotate(${-rotate}deg)` }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        {logoPath ? (
          <div style={{ opacity: fadeIn(0, 20), transform: `scale(${scaleIn})` }}>
            <ImageLayer src={logoPath} style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }} />
          </div>
        ) : (
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, opacity: fadeIn(0, 20), transform: `scale(${scaleIn})` }}>
            🎬
          </div>
        )}

        <TextLayer text={channelName} style={{ fontSize: 64, fontWeight: 800, color: '#FFFFFF', opacity: fadeIn(10, 30), textAlign: 'center', letterSpacing: '-2px' }} />
        <TextLayer text={tagline} style={{ fontSize: 24, fontWeight: 400, color: primaryColor, opacity: fadeIn(20, 40), textAlign: 'center' }} />

        <div style={{ display: 'flex', gap: 16, opacity: fadeIn(30, 50), flexWrap: 'wrap', justifyContent: 'center' }}>
          {linksArray.map((link, i) => (
            <div key={i} style={{ background: `${primaryColor}22`, border: `1px solid ${primaryColor}44`, borderRadius: 50, padding: '8px 20px', color: primaryColor, fontSize: 16, fontWeight: 500 }}>
              {link}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

export default IntroOutro