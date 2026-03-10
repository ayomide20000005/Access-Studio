import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { TextLayer } from '../remotion/components/TextLayer'

export const SocialMediaClip = ({
  caption = 'Your Caption Here',
  hashtags = '#viral, #trending, #fyp',
  platform = 'tiktok',
  callToAction = 'Follow for more',
  primaryColor = '#DB2777',
  secondaryColor = '#7C3AED',
  fontFamily = 'Inter',
  format = 'Square',
  style = 'Bold',
  energy = 'High',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames, width, height } = useVideoConfig()

  const hashtagsArray = typeof hashtags === 'string'
    ? hashtags.split(',').map(h => h.trim()).filter(Boolean)
    : hashtags

  const isVertical = format === 'Vertical' || height > width
  const damping = energy === 'High' ? 8 : energy === 'Chill' ? 20 : 12

  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start) =>
    spring({ frame: Math.max(0, frame - start), fps, from: 40, to: 0, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const platformIcons = { tiktok: '🎵', instagram: '📸', twitter: '🐦', youtube: '▶️', linkedin: '💼' }

  const getBg = () => {
    if (style === 'Minimal') return '#0F0F0F'
    if (style === 'Clean') return '#F5F5F5'
    if (style === 'Trendy') return `conic-gradient(from 180deg, ${primaryColor}44, ${secondaryColor}44, ${primaryColor}44)`
    return `linear-gradient(160deg, ${primaryColor}44 0%, #0F0F0F 40%, ${secondaryColor}33 100%)`
  }

  const textColor = style === 'Clean' ? '#0F0F0F' : '#FFFFFF'

  return (
    <AbsoluteFill style={{ background: getBg(), fontFamily, opacity: outroOpacity }}>
      <div style={{ position: 'absolute', top: 40, left: 40, background: '#000000AA', backdropFilter: 'blur(10px)', borderRadius: 50, padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 8, opacity: fadeIn(0, 20) }}>
        <span style={{ fontSize: 20 }}>{platformIcons[platform] || '📱'}</span>
        <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 600, textTransform: 'capitalize' }}>{platform}</span>
      </div>

      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isVertical ? 60 : 100 }}>
        <TextLayer
          text={caption}
          style={{ fontSize: isVertical ? 52 : 64, fontWeight: 800, color: textColor, opacity: fadeIn(5, 25), transform: `translateY(${slideUp(5)}px)`, textAlign: 'center', lineHeight: 1.2, marginBottom: 40 }}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 40, opacity: fadeIn(20, 40) }}>
          {hashtagsArray.map((tag, i) => (
            <span key={i} style={{ color: primaryColor, fontSize: 22, fontWeight: 600, opacity: interpolate(frame, [20 + i * 5, 40 + i * 5], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) }}>
              {tag}
            </span>
          ))}
        </div>

        <div style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, borderRadius: 50, padding: '14px 40px', color: '#FFFFFF', fontSize: 20, fontWeight: 700, opacity: fadeIn(35, 55), transform: `translateY(${slideUp(35)}px)` }}>
          {callToAction} ↑
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

export default SocialMediaClip