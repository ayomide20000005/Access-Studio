import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { TextLayer } from '../remotion/components/TextLayer'
import { ImageLayer } from '../remotion/components/ImageLayer'

export const EventAnnouncement = ({
  eventName = 'Your Event Name',
  date = 'January 1, 2025',
  location = 'City, Country',
  description = 'Join us for an amazing event',
  registerLink = 'register.yoursite.com',
  primaryColor = '#0891B2',
  secondaryColor = '#7C3AED',
  logoPath = null,
  fontFamily = 'Inter',
  vibe = 'Exciting',
  style = 'Bold',
  pace = 'Medium',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const damping = pace === 'Fast' ? 20 : pace === 'Slow' ? 8 : 12

  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start) =>
    spring({ frame: Math.max(0, frame - start), fps, from: 50, to: 0, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })
  const wave = interpolate(frame % 60, [0, 30, 60], [-4, 4, -4])

  const vibeColor = vibe === 'Formal' ? '#4F46E5' : vibe === 'Casual' ? '#F59E0B' : vibe === 'Luxury' ? '#D97706' : primaryColor

  const getBg = () => {
    if (style === 'Minimal') return '#0F0F0F'
    if (style === 'Cinematic') return `linear-gradient(180deg, #000000 0%, #0F0F0F 50%, #000000 100%)`
    return '#0F0F0F'
  }

  return (
    <AbsoluteFill style={{ background: getBg(), fontFamily, opacity: outroOpacity }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, ${vibeColor}33 0%, transparent 60%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 80% 80%, ${secondaryColor}22 0%, transparent 50%)` }} />

      {logoPath && (
        <div style={{ position: 'absolute', top: 60, left: 60, opacity: fadeIn(0, 20) }}>
          <ImageLayer src={logoPath} style={{ width: 80, height: 'auto' }} />
        </div>
      )}

      <div style={{ position: 'absolute', top: 60, right: 60, display: 'flex', gap: 12, opacity: fadeIn(10, 30) }}>
        <div style={{ background: `${vibeColor}33`, border: `1px solid ${vibeColor}`, borderRadius: 50, padding: '8px 20px', color: vibeColor, fontSize: 16, fontWeight: 600 }}>
          📅 {date}
        </div>
        <div style={{ background: '#1A1A1A', border: '1px solid #2E2E2E', borderRadius: 50, padding: '8px 20px', color: '#AAAAAA', fontSize: 16, fontWeight: 500 }}>
          📍 {location}
        </div>
      </div>

      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 100 }}>
        <div style={{ color: vibeColor, fontSize: 18, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', opacity: fadeIn(0, 20), marginBottom: 24, transform: `translateY(${wave}px)` }}>
          ✦ You're Invited
        </div>

        <TextLayer
          text={eventName}
          style={{ fontSize: 80, fontWeight: 900, color: '#FFFFFF', opacity: fadeIn(10, 30), transform: `translateY(${slideUp(10)}px)`, textAlign: 'center', marginBottom: 24, letterSpacing: '-2px', lineHeight: 1.1 }}
        />

        <TextLayer
          text={description}
          style={{ fontSize: 24, fontWeight: 400, color: '#AAAAAA', opacity: fadeIn(25, 45), transform: `translateY(${slideUp(25)}px)`, textAlign: 'center', maxWidth: 800, lineHeight: 1.6, marginBottom: 48 }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: fadeIn(40, 60) }}>
          <div style={{ background: `linear-gradient(135deg, ${vibeColor}, ${secondaryColor})`, borderRadius: 50, padding: '18px 56px', color: '#FFFFFF', fontSize: 22, fontWeight: 700, transform: `translateY(${slideUp(40)}px)` }}>
            Register Now →
          </div>
          <div style={{ color: '#666', fontSize: 16 }}>{registerLink}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

export default EventAnnouncement