// LOCATION: src/templates/DemoVideo.jsx

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export const DemoVideo = ({
  productName = 'Your Product',
  tagline = 'The best solution for your needs',
  keyFeatures = 'Feature One, Feature Two, Feature Three',
  featureDetails = 'Blazing fast performance, Zero learning curve, Works everywhere',
  callToAction = 'Try it today',
  primaryColor = '#14B8A6',
  secondaryColor = '#0EA5E9',
  accentColor = '#6366F1',
  fontFamily = 'Inter',
  videoStyle = 'Minimal',
  mood = 'Professional',
  animation = 'Smooth',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const featuresArray = typeof keyFeatures === 'string'
    ? keyFeatures.split(',').map(f => f.trim()).filter(Boolean)
    : Array.isArray(keyFeatures) ? keyFeatures : []

  const detailsArray = typeof featureDetails === 'string'
    ? featureDetails.split(',').map(f => f.trim()).filter(Boolean)
    : Array.isArray(featureDetails) ? featureDetails : []

  const damping = animation === 'Snappy' ? 22 : animation === 'Cinematic' ? 7 : 12

  // ── Proportional scene timing ──
  const S1 = Math.floor(durationInFrames * 0.20)
  const S2 = Math.floor(durationInFrames * 0.55)
  const S3 = Math.floor(durationInFrames * 0.80)

  const scene = frame < S1 ? 0 : frame < S2 ? 1 : frame < S3 ? 2 : 3

  // ── Helpers ──
  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, dist = 50) =>
    spring({ frame: Math.max(0, frame - start), fps, from: dist, to: 0, config: { damping } })

  const scaleSpring = (start, from = 0.7) =>
    spring({ frame: Math.max(0, frame - start), fps, from, to: 1, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const flashOpacity = (t) =>
    interpolate(frame, [t - 3, t, t + 8], [0, 0.9, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  // ── Typewriter text effect ──
  const TypewriterText = ({ text, startFrame, fontSize = 18, color = primaryColor }) => {
    const charsToShow = Math.floor(
      interpolate(frame, [startFrame, startFrame + text.length * 1.5], [0, text.length], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    )
    const cursorBlink = interpolate(frame % 20, [0, 10, 20], [1, 0, 1])
    return (
      <div style={{ fontFamily: 'monospace', fontSize, color, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 2 }}>
        {text.slice(0, charsToShow)}
        <span style={{ opacity: cursorBlink, color, marginLeft: 1 }}>|</span>
      </div>
    )
  }

  // ── Circular progress loader ──
  const CircularProgress = ({ percent, size = 80, strokeWidth = 6, color = primaryColor, startFrame = 0 }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const animatedPercent = interpolate(frame, [startFrame, startFrame + 40], [0, percent], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    const strokeDashoffset = circumference - (animatedPercent / 100) * circumference
    const glowOp = interpolate(frame % 40, [0, 20, 40], [0.5, 1, 0.5])
    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={`${color}22`} strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size * 0.22,
          fontWeight: 700,
          color,
          opacity: glowOp,
        }}>
          {Math.round(animatedPercent)}%
        </div>
      </div>
    )
  }

  // ── HUD corner bracket ──
  const HUDBracket = ({ size = 20, color = primaryColor, position = 'tl', opacity = 1 }) => {
    const styles = {
      tl: { top: 0, left: 0, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` },
      tr: { top: 0, right: 0, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` },
      bl: { bottom: 0, left: 0, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` },
      br: { bottom: 0, right: 0, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` },
    }
    return (
      <div style={{ position: 'absolute', width: size, height: size, opacity, ...styles[position] }} />
    )
  }

  // ── Soft glitch overlay ──
  const glitchIntensity = scene === 1
    ? interpolate(frame % 90, [0, 2, 4, 86, 88, 90], [0, 1, 0, 0, 0.5, 0])
    : 0

  // ── Parallax pan ──
  const parallaxX = interpolate(frame, [0, durationInFrames], [0, -30], { extrapolateRight: 'clamp' })
  const parallaxY = interpolate(frame, [0, durationInFrames], [0, -12], { extrapolateRight: 'clamp' })

  // ── Feature screen timing ──
  const featureSlotDuration = Math.max(1, Math.floor((S2 - S1) / Math.max(featuresArray.length, 1)))
  const currentFeatureIndex = Math.min(
    Math.floor(Math.max(0, frame - S1) / featureSlotDuration),
    Math.max(0, featuresArray.length - 1)
  )
  const featureSlotFrame = Math.max(0, frame - S1) % featureSlotDuration

  // ── Data stream chars ──
  const dataChars = '01アイウエオ#@%&10110'

  return (
    <AbsoluteFill style={{ background: '#050810', fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Parallax background glow */}
      <AbsoluteFill style={{
        background: `
          radial-gradient(ellipse at 15% 50%, ${primaryColor}14 0%, transparent 45%),
          radial-gradient(ellipse at 85% 40%, ${secondaryColor}10 0%, transparent 45%),
          radial-gradient(ellipse at 50% 90%, ${accentColor}0A 0%, transparent 40%)
        `,
        transform: `translateX(${parallaxX}px) translateY(${parallaxY}px) scale(1.05)`,
      }} />

      {/* Data stream background */}
      {Array.from({ length: 8 }).map((_, col) => (
        <div key={col} style={{
          position: 'absolute',
          top: 0,
          left: `${10 + col * 12}%`,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          opacity: 0.04,
          pointerEvents: 'none',
        }}>
          {Array.from({ length: 20 }).map((_, row) => {
            const charIndex = Math.floor((frame * 0.3 + col * 7 + row * 3) % dataChars.length)
            return (
              <div key={row} style={{ fontSize: 12, fontFamily: 'monospace', color: primaryColor, lineHeight: 1.4 }}>
                {dataChars[charIndex]}
              </div>
            )
          })}
        </div>
      ))}

      {/* Scanlines */}
      <AbsoluteFill style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        opacity: 0.05,
        pointerEvents: 'none',
        zIndex: 99,
      }} />

      {/* Soft glitch overlay */}
      {glitchIntensity > 0 && (
        <>
          <AbsoluteFill style={{
            background: `${primaryColor}08`,
            transform: `translateX(${glitchIntensity * 6}px)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            zIndex: 97,
          }} />
          <AbsoluteFill style={{
            background: `${secondaryColor}08`,
            transform: `translateX(${-glitchIntensity * 4}px) translateY(${glitchIntensity * 2}px)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            zIndex: 97,
          }} />
        </>
      )}

      {/* ══════════════════════════════════
          SCENE 1 — App Overview
      ══════════════════════════════════ */}
      {scene === 0 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 140px' }}>

          {/* HUD top line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
            opacity: fadeIn(0, 20),
          }} />

          {/* Status indicator */}
          <div style={{
            position: 'absolute', top: 24,
            display: 'flex', alignItems: 'center', gap: 12,
            opacity: fadeIn(0, 18),
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }} />
            <TypewriterText text="SYSTEM INITIALIZED" startFrame={4} fontSize={13} color={`${primaryColor}88`} />
          </div>

          {/* Product name */}
          <div style={{
            fontSize: videoStyle === 'Bold' ? 100 : 84,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(6, 22),
            transform: `translateY(${slideUp(6, 60)}px) scale(${scaleSpring(6, 0.8)})`,
            textAlign: 'center',
            letterSpacing: '-3px',
            lineHeight: 1,
            marginBottom: 20,
            textShadow: `0 0 60px ${primaryColor}33`,
          }}>
            {productName}
          </div>

          {/* Animated underline */}
          <div style={{
            height: 2,
            width: interpolate(frame, [14, 42], [0, 300], { extrapolateRight: 'clamp' }),
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
            borderRadius: 1,
            marginBottom: 22,
            boxShadow: `0 0 12px ${primaryColor}88`,
          }} />

          {/* Tagline */}
          <div style={{
            fontSize: 24,
            fontWeight: 300,
            color: '#777',
            opacity: fadeIn(18, 34),
            transform: `translateY(${slideUp(18, 25)}px)`,
            textAlign: 'center',
            letterSpacing: 1,
            marginBottom: 52,
          }}>
            {tagline}
          </div>

          {/* Mock screen */}
          <div style={{
            width: 760, height: 400,
            background: '#0A0C14',
            border: `1px solid ${primaryColor}33`,
            borderRadius: 12,
            position: 'relative',
            opacity: fadeIn(22, 38),
            transform: `scale(${scaleSpring(22, 0.88)})`,
            overflow: 'hidden',
            boxShadow: `0 0 40px ${primaryColor}22, inset 0 0 40px ${primaryColor}08`,
          }}>
            <HUDBracket size={22} color={primaryColor} position="tl" opacity={0.8} />
            <HUDBracket size={22} color={primaryColor} position="tr" opacity={0.8} />
            <HUDBracket size={22} color={primaryColor} position="bl" opacity={0.8} />
            <HUDBracket size={22} color={primaryColor} position="br" opacity={0.8} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${primaryColor}88, transparent)` }} />
            <div style={{ padding: '28px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                {['#EF4444', '#F59E0B', '#22C55E'].map((c, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                ))}
                <div style={{ flex: 1, height: 1, background: `${primaryColor}22`, marginLeft: 8 }} />
              </div>
              {[80, 60, 90, 45, 70].map((w, i) => (
                <div key={i} style={{
                  height: 8,
                  width: `${w}%`,
                  background: i === 0 ? `${primaryColor}44` : `${primaryColor}18`,
                  borderRadius: 4,
                  marginBottom: 14,
                  opacity: interpolate(frame, [26 + i * 3, 36 + i * 3], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                }} />
              ))}
              <div style={{
                position: 'absolute', bottom: 32, right: 32,
                width: 60, height: 60,
                borderRadius: '50%',
                border: `2px solid ${primaryColor}`,
                boxShadow: `0 0 20px ${primaryColor}66`,
                transform: `scale(${interpolate(frame % 40, [0, 20, 40], [1, 1.15, 1])})`,
                opacity: fadeIn(30, 42),
              }} />
            </div>
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 2 — Feature Screens
      ══════════════════════════════════ */}
      {scene === 1 && (
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', padding: '60px 80px', gap: 60 }}>

          {/* Left — feature info */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              color: primaryColor,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 5,
              textTransform: 'uppercase',
              opacity: fadeIn(S1, S1 + 14),
              marginBottom: 20,
              filter: `drop-shadow(0 0 6px ${primaryColor})`,
            }}>
              Feature {currentFeatureIndex + 1} / {featuresArray.length}
            </div>

            {featuresArray.map((feature, i) => {
              if (i !== currentFeatureIndex) return null
              const eOp = interpolate(featureSlotFrame, [0, 14], [0, 1], { extrapolateRight: 'clamp' })
              const eX = spring({ frame: Math.max(0, featureSlotFrame), fps, from: -50, to: 0, config: { damping } })
              return (
                <div key={i} style={{ opacity: eOp, transform: `translateX(${eX}px)` }}>
                  <div style={{
                    fontSize: 56,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    letterSpacing: '-1.5px',
                    lineHeight: 1.1,
                    marginBottom: 20,
                    textShadow: `0 0 40px ${primaryColor}33`,
                  }}>
                    {feature}
                  </div>
                  {detailsArray[i] && (
                    <div style={{ marginBottom: 28 }}>
                      <TypewriterText
                        text={detailsArray[i]}
                        startFrame={featureSlotFrame > 10 ? featureSlotFrame - 10 : 0}
                        fontSize={18}
                        color="#666"
                      />
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <CircularProgress
                      percent={70 + i * 10}
                      size={72}
                      strokeWidth={5}
                      color={primaryColor}
                      startFrame={featureSlotFrame > 5 ? featureSlotFrame - 5 : 0}
                    />
                    <div style={{ color: '#555', fontSize: 15, fontWeight: 500 }}>Performance Score</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right — mock screen */}
          <div style={{
            flex: 1.2, height: 500,
            background: '#080B12',
            border: `1px solid ${primaryColor}33`,
            borderRadius: 14,
            position: 'relative',
            overflow: 'hidden',
            opacity: fadeIn(S1, S1 + 18),
            transform: `scale(${scaleSpring(S1, 0.9)})`,
            boxShadow: `0 0 50px ${primaryColor}18, inset 0 0 30px ${primaryColor}06`,
          }}>
            <HUDBracket size={20} color={primaryColor} position="tl" opacity={0.7} />
            <HUDBracket size={20} color={primaryColor} position="tr" opacity={0.7} />
            <HUDBracket size={20} color={primaryColor} position="bl" opacity={0.7} />
            <HUDBracket size={20} color={primaryColor} position="br" opacity={0.7} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)` }} />
            <div style={{ padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
                {['#EF4444', '#F59E0B', '#22C55E'].map((c, i) => (
                  <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
                ))}
              </div>
              {[90, 65, 80, 50, 75, 88].map((w, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <div style={{ height: 6, width: '30%', background: `${primaryColor}22`, borderRadius: 3 }} />
                    <div style={{ height: 6, width: '12%', background: `${primaryColor}22`, borderRadius: 3 }} />
                  </div>
                  <div style={{ height: 6, background: '#111', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${interpolate(featureSlotFrame, [5 + i * 3, 25 + i * 3], [0, w], { extrapolateRight: 'clamp' })}%`,
                      background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                      borderRadius: 3,
                      boxShadow: `0 0 8px ${primaryColor}88`,
                    }} />
                  </div>
                </div>
              ))}
              <div style={{
                position: 'absolute', bottom: 36, right: 36,
                width: 50, height: 50,
                borderRadius: '50%',
                border: `2px solid ${primaryColor}`,
                boxShadow: `0 0 18px ${primaryColor}66`,
                transform: `scale(${interpolate(frame % 40, [0, 20, 40], [1, 1.18, 1])})`,
              }} />
            </div>
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 3 — Summary
      ══════════════════════════════════ */}
      {scene === 2 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 140px' }}>

          <div style={{
            color: primaryColor,
            fontSize: 12, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase',
            opacity: fadeIn(S2, S2 + 14),
            marginBottom: 48,
            filter: `drop-shadow(0 0 8px ${primaryColor})`,
          }}>
            Everything You Need
          </div>

          <div style={{
            fontSize: 72, fontWeight: 900, color: '#FFFFFF',
            opacity: fadeIn(S2 + 8, S2 + 24),
            transform: `translateY(${slideUp(S2 + 8, 40)}px)`,
            textAlign: 'center', letterSpacing: '-2px', lineHeight: 1.1,
            marginBottom: 52,
            textShadow: `0 0 50px ${primaryColor}33`,
          }}>
            {productName}
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            {featuresArray.map((feature, i) => {
              const cStart = S2 + 18 + i * 14
              return (
                <div key={i} style={{
                  background: '#0A0C14',
                  border: `1px solid ${primaryColor}33`,
                  borderRadius: 14,
                  padding: '18px 28px',
                  opacity: interpolate(frame, [cStart, cStart + 12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                  transform: `translateY(${spring({ frame: Math.max(0, frame - cStart), fps, from: 30, to: 0, config: { damping } })}px)`,
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)` }} />
                  <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 600 }}>✓ {feature}</div>
                </div>
              )
            })}
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 4 — CTA
      ══════════════════════════════════ */}
      {scene === 3 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${primaryColor}66, transparent)`, opacity: fadeIn(S3, S3 + 15) }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${primaryColor}66, transparent)`, opacity: fadeIn(S3, S3 + 15) }} />

          <div style={{
            position: 'absolute', width: 700, height: 700,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 65%)`,
            transform: `scale(${interpolate(frame % 60, [0, 30, 60], [0.95, 1.05, 0.95])})`,
            pointerEvents: 'none',
          }} />

          <div style={{
            color: primaryColor, fontSize: 13, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase',
            opacity: fadeIn(S3, S3 + 14),
            marginBottom: 20,
            filter: `drop-shadow(0 0 8px ${primaryColor})`,
          }}>
            Ready to start?
          </div>

          <div style={{
            fontSize: 88, fontWeight: 900, color: '#FFFFFF',
            opacity: fadeIn(S3 + 6, S3 + 22),
            transform: `translateY(${slideUp(S3 + 6, 45)}px)`,
            textAlign: 'center', letterSpacing: '-3px',
            marginBottom: 16,
            textShadow: `0 0 60px ${primaryColor}33`,
          }}>
            {productName}
          </div>

          <div style={{ color: '#555', fontSize: 20, opacity: fadeIn(S3 + 14, S3 + 28), marginBottom: 44, textAlign: 'center' }}>
            {tagline}
          </div>

          <div style={{
            opacity: fadeIn(S3 + 20, S3 + 35),
            transform: `scale(${scaleSpring(S3 + 20, 0.8)})`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 60,
              padding: '22px 80px',
              color: '#FFFFFF',
              fontSize: 24, fontWeight: 800,
              boxShadow: `0 0 55px ${primaryColor}55, 0 0 110px ${primaryColor}22`,
              letterSpacing: 0.5,
            }}>
              {callToAction} →
            </div>
          </div>

        </AbsoluteFill>
      )}

      {/* Scene flash transitions */}
      {[S1, S2, S3].map((t, i) => (
        <AbsoluteFill key={i} style={{
          background: '#000000',
          opacity: flashOpacity(t),
          pointerEvents: 'none',
          zIndex: 50,
        }} />
      ))}

    </AbsoluteFill>
  )
}

export default DemoVideo