import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { TextLayer } from '../remotion/components/TextLayer'
import { ImageLayer } from '../remotion/components/ImageLayer'

export const ProductLaunch = ({
  productName = 'Product Name',
  launchDate = 'Coming Soon',
  keyBenefits = 'Benefit One, Benefit Two, Benefit Three',
  price = '$99',
  callToAction = 'Pre-order Now',
  primaryColor = '#4F46E5',
  secondaryColor = '#7C3AED',
  logoPath = null,
  fontFamily = 'Inter',
  launchFeel = 'Hype',
  colorVibe = 'Dark Luxury',
  pace = 'Medium',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const benefitsArray = typeof keyBenefits === 'string'
    ? keyBenefits.split(',').map(b => b.trim()).filter(Boolean)
    : keyBenefits

  const damping = pace === 'Fast' ? 20 : pace === 'Slow' ? 8 : 12

  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start) =>
    spring({ frame: Math.max(0, frame - start), fps, from: 50, to: 0, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const scaleIn = spring({ frame, fps, from: 0.8, to: 1, config: { damping } })

  const getBackground = () => {
    if (colorVibe === 'Bright Pop') return `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
    if (colorVibe === 'Monochrome') return '#0A0A0A'
    return '#0A0A0F'
  }

  const getFeel = () => {
    if (launchFeel === 'Premium') return { titleSize: 100, spacing: '-4px' }
    if (launchFeel === 'Dramatic') return { titleSize: 110, spacing: '-5px' }
    if (launchFeel === 'Clean') return { titleSize: 80, spacing: '-2px' }
    return { titleSize: 96, spacing: '-3px' }
  }

  const { titleSize, spacing } = getFeel()

  return (
    <AbsoluteFill style={{ background: getBackground(), fontFamily, opacity: outroOpacity }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${primaryColor}11 1px, transparent 1px), linear-gradient(90deg, ${primaryColor}11 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {logoPath && (
        <div style={{ position: 'absolute', top: 60, left: 60, opacity: fadeIn(0, 20) }}>
          <ImageLayer src={logoPath} style={{ width: 100, height: 'auto' }} />
        </div>
      )}

      <div style={{ position: 'absolute', top: 60, right: 60, background: `${primaryColor}33`, border: `1px solid ${primaryColor}`, borderRadius: 50, padding: '8px 24px', color: primaryColor, fontSize: 16, fontWeight: 600, opacity: fadeIn(10, 30) }}>
        📅 {launchDate}
      </div>

      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: primaryColor, fontSize: 16, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', opacity: fadeIn(0, 20), marginBottom: 24 }}>
          ✦ Introducing
        </div>

        <TextLayer
          text={productName}
          style={{
            fontSize: titleSize,
            fontWeight: 900,
            color: colorVibe === 'Monochrome' ? '#FFFFFF' : '#FFFFFF',
            opacity: fadeIn(5, 25),
            transform: `translateY(${slideUp(5)}px) scale(${scaleIn})`,
            textAlign: 'center',
            marginBottom: 32,
            letterSpacing: spacing,
            lineHeight: 1,
          }}
        />

        <div style={{ display: 'flex', gap: 16, marginBottom: 48, opacity: fadeIn(25, 45), flexWrap: 'wrap', justifyContent: 'center' }}>
          {benefitsArray.map((benefit, i) => (
            <div key={i} style={{ color: '#AAAAAA', fontSize: 18, opacity: interpolate(frame, [25 + i * 6, 45 + i * 6], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) }}>
              {i > 0 && <span style={{ marginRight: 16, color: primaryColor }}>·</span>}
              {benefit}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32, opacity: fadeIn(40, 60) }}>
          <div style={{ color: '#FFFFFF', fontSize: 48, fontWeight: 700 }}>{price}</div>
          <div style={{ background: primaryColor, borderRadius: 50, padding: '16px 48px', color: '#FFFFFF', fontSize: 20, fontWeight: 700 }}>
            {callToAction} →
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

export default ProductLaunch