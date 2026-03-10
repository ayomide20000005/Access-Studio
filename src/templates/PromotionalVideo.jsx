import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { TextLayer } from '../remotion/components/TextLayer'
import { ImageLayer } from '../remotion/components/ImageLayer'

export const PromotionalVideo = ({
  brandName = 'Your Brand',
  offer = 'Special Offer',
  discount = '50% OFF',
  expiryDate = 'Limited Time Only',
  callToAction = 'Shop Now',
  primaryColor = '#DC2626',
  secondaryColor = '#D97706',
  logoPath = null,
  fontFamily = 'Inter',
  energy = 'High Energy',
  style = 'Bold',
  emphasis = 'Discount',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start) =>
    spring({ frame: Math.max(0, frame - start), fps, from: 50, to: 0, config: { damping: 12 } })

  const pulseSpeed = energy === 'High Energy' ? 20 : energy === 'Subtle' ? 60 : 30
  const pulse = interpolate(frame % pulseSpeed, [0, pulseSpeed / 2, pulseSpeed], [1, 1.05, 1])
  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const getBg = () => {
    if (style === 'Elegant') return `linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)`
    if (style === 'Minimal') return '#0F0F0F'
    if (style === 'Playful') return `linear-gradient(135deg, ${primaryColor}44 0%, ${secondaryColor}44 100%)`
    return '#0F0F0F'
  }

  const mainContent = emphasis === 'Brand' ? brandName : emphasis === 'Urgency' ? expiryDate : discount

  return (
    <AbsoluteFill style={{ background: getBg(), fontFamily, opacity: outroOpacity }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, ${primaryColor}33 0%, transparent 60%)`, transform: `scale(${pulse})` }} />

      {logoPath && (
        <div style={{ position: 'absolute', top: 60, left: 60, opacity: fadeIn(0, 20) }}>
          <ImageLayer src={logoPath} style={{ width: 100, height: 'auto' }} />
        </div>
      )}

      <div style={{ position: 'absolute', top: 60, right: 60, background: secondaryColor, borderRadius: 50, padding: '8px 24px', color: '#FFFFFF', fontSize: 16, fontWeight: 700, opacity: fadeIn(10, 30) }}>
        ⏰ {expiryDate}
      </div>

      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <TextLayer text={brandName} style={{ fontSize: 24, fontWeight: 600, color: '#AAAAAA', letterSpacing: 6, textTransform: 'uppercase', opacity: fadeIn(0, 20), marginBottom: 16 }} />
        <TextLayer text={offer} style={{ fontSize: 52, fontWeight: 700, color: '#FFFFFF', opacity: fadeIn(10, 30), transform: `translateY(${slideUp(10)}px)`, textAlign: 'center', marginBottom: 16 }} />
        <div style={{ fontSize: 140, fontWeight: 900, color: primaryColor, opacity: fadeIn(20, 40), transform: `translateY(${slideUp(20)}px) scale(${pulse})`, textAlign: 'center', lineHeight: 1, marginBottom: 40, textShadow: `0 0 60px ${primaryColor}66` }}>
          {mainContent}
        </div>
        <div style={{ background: primaryColor, borderRadius: 50, padding: '20px 64px', color: '#FFFFFF', fontSize: 24, fontWeight: 800, opacity: fadeIn(40, 60), transform: `scale(${pulse})` }}>
          {callToAction} →
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

export default PromotionalVideo