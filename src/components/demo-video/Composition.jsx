import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Sequence,
} from 'remotion'
import { linearTiming, TransitionSeries } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'
import { ShapeProps, Triangle, Circle, Rect } from '@remotion/shapes'

export const DemoVideoComposition = ({
  productName = 'Acces Studio',
  tagline = 'Create videos in minutes',
  keyFeatures = 'No code, Offline, Fast',
  callToAction = 'Try it today',
  primaryColor = '#7C3AED',
  secondaryColor = '#4F46E5',
  fontFamily = 'Inter',
  duration = 10,
  selectedStyles = {},
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames, width, height } = useVideoConfig()

  const background = selectedStyles.background || 'Gradient'
  const animation = selectedStyles.animation || 'Smooth'
  const mood = selectedStyles.mood || 'Energetic'

  // Spring configs based on animation style
  const springConfig = animation === 'Snappy'
    ? { damping: 200, stiffness: 400 }
    : animation === 'Cinematic'
    ? { damping: 30, stiffness: 40 }
    : { damping: 80, stiffness: 120 }

  // Background color
  const bgColor = background === 'Dark' ? '#0A0A0A'
    : background === 'Light' ? '#F8F8F8'
    : '#0F0F1A'

  // Section timings
  const introEnd = fps * 3
  const featuresStart = fps * 3
  const featuresEnd = fps * 7
  const ctaStart = fps * 7

  // Intro animations
  const logoScale = spring({ frame, fps, config: springConfig })
  const logoOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })

  const titleY = interpolate(frame, [10, 40], [60, 0], { extrapolateRight: 'clamp' })
  const titleOpacity = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: 'clamp' })

  const taglineY = interpolate(frame, [25, 55], [40, 0], { extrapolateRight: 'clamp' })
  const taglineOpacity = interpolate(frame, [25, 55], [0, 1], { extrapolateRight: 'clamp' })

  // Features
  const features = keyFeatures ? keyFeatures.split(',').map(f => f.trim()) : []

  // CTA animations
  const ctaScale = spring({ frame: Math.max(0, frame - ctaStart), fps, config: springConfig })
  const ctaOpacity = interpolate(frame, [ctaStart, ctaStart + 20], [0, 1], { extrapolateRight: 'clamp' })

  // Outro fade
  const outroOpacity = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames - 5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Floating shapes
  const shape1Y = interpolate(frame, [0, durationInFrames], [0, -30])
  const shape2Y = interpolate(frame, [0, durationInFrames], [0, 20])
  const shape1Rotate = interpolate(frame, [0, durationInFrames], [0, 45])

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        background: background === 'Gradient'
          ? `linear-gradient(135deg, ${bgColor} 0%, ${primaryColor}22 50%, ${bgColor} 100%)`
          : bgColor,
        opacity: outroOpacity,
      }}
    >
      {/* Decorative background shapes */}
      <AbsoluteFill style={{ opacity: 0.15 }}>
        <div style={{
          position: 'absolute',
          top: 80,
          right: 120,
          transform: `translateY(${shape1Y}px) rotate(${shape1Rotate}deg)`,
        }}>
          <Rect width={200} height={200} fill={primaryColor} cornerRadius={20} />
        </div>
        <div style={{
          position: 'absolute',
          bottom: 100,
          left: 80,
          transform: `translateY(${shape2Y}px)`,
        }}>
          <Circle radius={120} fill={secondaryColor} />
        </div>
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '10%',
          transform: `translateY(${shape1Y * 0.5}px)`,
        }}>
          <Triangle length={80} fill={primaryColor} direction="up" />
        </div>
      </AbsoluteFill>

      {/* Intro section */}
      <Sequence from={0} durationInFrames={introEnd + fps}>
        <AbsoluteFill style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: 80,
        }}>
          {/* Logo / Brand mark */}
          <div style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            width: 80,
            height: 80,
            borderRadius: 20,
            background: primaryColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            boxShadow: `0 0 40px ${primaryColor}66`,
          }}>
            🎬
          </div>

          {/* Product name */}
          <div style={{
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
            fontSize: 72,
            fontWeight: 900,
            color: '#FFFFFF',
            textAlign: 'center',
            letterSpacing: -2,
            textShadow: `0 0 60px ${primaryColor}44`,
          }}>
            {productName}
          </div>

          {/* Tagline */}
          <div style={{
            transform: `translateY(${taglineY}px)`,
            opacity: taglineOpacity,
            fontSize: 28,
            fontWeight: 400,
            color: `${primaryColor}`,
            textAlign: 'center',
            letterSpacing: 1,
          }}>
            {tagline}
          </div>

          {/* Divider line */}
          <div style={{
            width: interpolate(frame, [40, 70], [0, 300], { extrapolateRight: 'clamp' }),
            height: 2,
            background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
            opacity: taglineOpacity,
          }} />
        </AbsoluteFill>
      </Sequence>

      {/* Features section */}
      <Sequence from={featuresStart} durationInFrames={featuresEnd - featuresStart + fps}>
        <AbsoluteFill style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          padding: 80,
        }}>
          <div style={{
            fontSize: 36,
            fontWeight: 700,
            color: '#FFFFFF',
            opacity: interpolate(frame - featuresStart, [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame - featuresStart, [0, 20], [20, 0], { extrapolateRight: 'clamp' })}px)`,
          }}>
            Why {productName}?
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            {features.map((feature, i) => {
              const featureOpacity = interpolate(
                frame - featuresStart,
                [i * 15, i * 15 + 25],
                [0, 1],
                { extrapolateRight: 'clamp' }
              )
              const featureY = interpolate(
                frame - featuresStart,
                [i * 15, i * 15 + 25],
                [30, 0],
                { extrapolateRight: 'clamp' }
              )
              const featureScale = spring({
                frame: Math.max(0, frame - featuresStart - i * 15),
                fps,
                config: springConfig,
              })

              return (
                <div
                  key={i}
                  style={{
                    opacity: featureOpacity,
                    transform: `translateY(${featureY}px) scale(${featureScale})`,
                    background: `${primaryColor}22`,
                    border: `1px solid ${primaryColor}66`,
                    borderRadius: 16,
                    padding: '16px 28px',
                    fontSize: 22,
                    fontWeight: 600,
                    color: '#FFFFFF',
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 8px 32px ${primaryColor}22`,
                  }}
                >
                  ✦ {feature}
                </div>
              )
            })}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* CTA section */}
      <Sequence from={ctaStart}>
        <AbsoluteFill style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          padding: 80,
        }}>
          <div style={{
            fontSize: 56,
            fontWeight: 900,
            color: '#FFFFFF',
            textAlign: 'center',
            opacity: ctaOpacity,
            transform: `scale(${ctaScale})`,
            textShadow: `0 0 40px ${primaryColor}66`,
          }}>
            Ready to start?
          </div>

          <div style={{
            opacity: interpolate(frame - ctaStart, [15, 35], [0, 1], { extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame - ctaStart, [15, 35], [20, 0], { extrapolateRight: 'clamp' })}px)`,
            background: primaryColor,
            borderRadius: 60,
            padding: '20px 52px',
            fontSize: 28,
            fontWeight: 700,
            color: '#FFFFFF',
            boxShadow: `0 0 60px ${primaryColor}66, 0 8px 32px rgba(0,0,0,0.4)`,
            letterSpacing: 0.5,
          }}>
            {callToAction}
          </div>

          {/* Pulsing ring */}
          <div style={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            border: `2px solid ${primaryColor}`,
            opacity: interpolate(
              frame - ctaStart,
              [0, 30],
              [0, 0.3],
              { extrapolateRight: 'clamp' }
            ) * Math.sin((frame - ctaStart) * 0.1) * 0.5 + 0.15,
            transform: `scale(${1 + interpolate(frame - ctaStart, [0, 60], [0, 0.3], { extrapolateRight: 'clamp' })})`,
          }} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}