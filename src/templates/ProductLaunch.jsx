import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export const ProductLaunch = ({
  productName = 'Acces Studio',
  tagline = 'Create stunning videos in minutes',
  launchDate = 'Available Now',
  chatMessages = 'Make me a product launch video, Here is your cinematic product launch video!, Now add a promo section, Done — with animation and transitions',
  features = 'AI-Powered Templates, No Timeline Needed, Export in 4K',
  callToAction = 'Try It Free',
  price = 'Free & Open Source',
  primaryColor = '#7C3AED',
  secondaryColor = '#4F46E5',
  accentColor = '#06B6D4',
  logoPath = null,
  fontFamily = 'Inter',
  pace = 'Medium',
  launchFeel = 'Hype',
  colorVibe = 'Dark Luxury',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const damping = pace === 'Fast' ? 20 : pace === 'Slow' ? 8 : 12

  const messagesArray = typeof chatMessages === 'string'
    ? chatMessages.split(',').map(m => m.trim()).filter(Boolean)
    : chatMessages

  const featuresArray = typeof features === 'string'
    ? features.split(',').map(f => f.trim()).filter(Boolean)
    : features

  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, distance = 40) =>
    spring({ frame: Math.max(0, frame - start), fps, from: distance, to: 0, config: { damping, stiffness: 100 } })

  const slideRight = (start) =>
    spring({ frame: Math.max(0, frame - start), fps, from: -60, to: 0, config: { damping } })

  const slideLeft = (start) =>
    spring({ frame: Math.max(0, frame - start), fps, from: 60, to: 0, config: { damping } })

  const scaleIn = (start) =>
    spring({ frame: Math.max(0, frame - start), fps, from: 0.85, to: 1, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  // Scene timing — proportional to total duration
  const SCENE1_END = Math.floor(durationInFrames * 0.20)  // 20% — Brand intro
  const SCENE2_END = Math.floor(durationInFrames * 0.50)  // 50% — Chat demo
  const SCENE3_END = Math.floor(durationInFrames * 0.75)  // 75% — Features
  const SCENE4_END = durationInFrames                     // 100% — CTA

  const currentScene =
    frame < SCENE1_END ? 0 :
    frame < SCENE2_END ? 1 :
    frame < SCENE3_END ? 2 : 3

  const sceneFrame = (sceneStart) => frame - sceneStart

  // Typing cursor blink
  const cursorBlink = Math.floor(frame / 15) % 2 === 0

  // Glowing particle positions
  const particles = [
    { x: 15, y: 20, size: 2, speed: 0.8 },
    { x: 85, y: 15, size: 1.5, speed: 1.2 },
    { x: 25, y: 75, size: 2.5, speed: 0.6 },
    { x: 70, y: 80, size: 1, speed: 1.5 },
    { x: 50, y: 10, size: 2, speed: 0.9 },
    { x: 90, y: 60, size: 1.5, speed: 1.1 },
    { x: 10, y: 50, size: 1, speed: 0.7 },
    { x: 60, y: 90, size: 2, speed: 1.3 },
  ]

  const getBackground = () => {
    if (colorVibe === 'Bright Pop') return `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
    if (colorVibe === 'Monochrome') return '#050505'
    return '#060608'
  }

  return (
    <AbsoluteFill style={{ background: getBackground(), fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Ambient background glow */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 20% 50%, ${primaryColor}18 0%, transparent 55%),
                     radial-gradient(ellipse at 80% 30%, ${secondaryColor}12 0%, transparent 50%),
                     radial-gradient(ellipse at 60% 80%, ${accentColor}10 0%, transparent 45%)`,
      }} />

      {/* Subtle grid */}
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${primaryColor}08 1px, transparent 1px), linear-gradient(90deg, ${primaryColor}08 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: `${(p.y + Math.sin((frame * p.speed * 0.05) + i) * 3)}%`,
          width: p.size * 3,
          height: p.size * 3,
          borderRadius: '50%',
          background: i % 2 === 0 ? primaryColor : accentColor,
          opacity: interpolate(frame % (120 / p.speed), [0, 60 / p.speed, 120 / p.speed], [0.2, 0.7, 0.2]),
          boxShadow: `0 0 ${p.size * 4}px ${i % 2 === 0 ? primaryColor : accentColor}`,
        }} />
      ))}

      {/* ============ SCENE 1: Brand Intro ============ */}
      {currentScene === 0 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Logo or icon */}
          <div style={{
            width: 100,
            height: 100,
            borderRadius: 28,
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 44,
            opacity: fadeIn(0, 20),
            transform: `scale(${scaleIn(0)}) translateY(${slideUp(0)}px)`,
            marginBottom: 40,
            boxShadow: `0 0 60px ${primaryColor}44`,
          }}>
            🎬
          </div>

          {/* Brand name */}
          <div style={{
            fontSize: 96,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(10, 30),
            transform: `translateY(${slideUp(10)}px)`,
            letterSpacing: '-3px',
            lineHeight: 1,
            textAlign: 'center',
            marginBottom: 20,
          }}>
            {productName}
          </div>

          {/* Tagline with animated underline */}
          <div style={{
            fontSize: 26,
            fontWeight: 400,
            color: accentColor,
            opacity: fadeIn(20, 40),
            transform: `translateY(${slideUp(20)}px)`,
            textAlign: 'center',
            letterSpacing: 1,
          }}>
            {tagline}
          </div>

          {/* Launch date badge */}
          <div style={{
            marginTop: 48,
            background: `${primaryColor}22`,
            border: `1px solid ${primaryColor}55`,
            borderRadius: 50,
            padding: '10px 28px',
            color: primaryColor,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: 'uppercase',
            opacity: fadeIn(30, 50),
          }}>
            ✦ {launchDate}
          </div>

          {/* Scanning line effect */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${accentColor}66, transparent)`,
            top: `${interpolate(frame, [0, SCENE1_END], [0, 100], { extrapolateRight: 'clamp' })}%`,
            opacity: 0.6,
          }} />
        </AbsoluteFill>
      )}

      {/* ============ SCENE 2: Chat Demo ============ */}
      {currentScene === 1 && (() => {
        const sf = sceneFrame(SCENE1_END)
        const msgDelay = 18
        return (
          <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 120px' }}>

            {/* Left label */}
            <div style={{
              position: 'absolute',
              left: 80,
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: fadeIn(SCENE1_END, SCENE1_END + 20),
            }}>
              <div style={{ color: accentColor, fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>
                See it in action
              </div>
              <div style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-1px', maxWidth: 280 }}>
                Just describe what you need
              </div>
            </div>

            {/* Chat window */}
            <div style={{
              position: 'absolute',
              right: 80,
              width: 560,
              background: '#0E0E14',
              border: `1px solid ${primaryColor}33`,
              borderRadius: 20,
              overflow: 'hidden',
              opacity: fadeIn(SCENE1_END + 5, SCENE1_END + 25),
              transform: `translateX(${slideLeft(SCENE1_END + 5)}px)`,
              boxShadow: `0 0 80px ${primaryColor}22`,
            }}>

              {/* Window chrome */}
              <div style={{
                background: '#13131A',
                padding: '14px 20px',
                borderBottom: `1px solid ${primaryColor}22`,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
                <div style={{ marginLeft: 12, color: '#555', fontSize: 13 }}>{productName} — AI Studio</div>
              </div>

              {/* Messages */}
              <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 300 }}>
                {messagesArray.map((msg, i) => {
                  const isUser = i % 2 === 0
                  const msgStart = SCENE1_END + 10 + i * msgDelay
                  const visible = frame > msgStart
                  if (!visible) return null

                  return (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: isUser ? 'flex-end' : 'flex-start',
                      opacity: interpolate(frame, [msgStart, msgStart + 10], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                      transform: `translateY(${spring({ frame: Math.max(0, frame - msgStart), fps, from: 15, to: 0, config: { damping: 14 } })}px)`,
                    }}>
                      {!isUser && (
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: 10,
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 14,
                          marginRight: 10,
                          flexShrink: 0,
                        }}>
                          ✦
                        </div>
                      )}
                      <div style={{
                        background: isUser
                          ? `linear-gradient(135deg, ${primaryColor}88, ${secondaryColor}88)`
                          : '#1A1A26',
                        border: isUser ? 'none' : `1px solid ${primaryColor}22`,
                        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        padding: '10px 16px',
                        color: '#FFFFFF',
                        fontSize: 15,
                        lineHeight: 1.5,
                        maxWidth: 340,
                      }}>
                        {msg}
                        {/* Typing cursor on last visible AI message */}
                        {!isUser && i === messagesArray.filter((_, j) => frame > SCENE1_END + 10 + j * msgDelay).length - 1 && cursorBlink && (
                          <span style={{ display: 'inline-block', width: 2, height: 14, background: accentColor, marginLeft: 3, verticalAlign: 'middle' }} />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Input bar */}
              <div style={{
                padding: '12px 20px',
                borderTop: `1px solid ${primaryColor}22`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#0A0A12',
              }}>
                <div style={{
                  flex: 1,
                  background: '#16161E',
                  border: `1px solid ${primaryColor}33`,
                  borderRadius: 10,
                  padding: '10px 14px',
                  color: '#555',
                  fontSize: 14,
                }}>
                  Describe your video...
                </div>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: primaryColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                }}>
                  ↑
                </div>
              </div>
            </div>
          </AbsoluteFill>
        )
      })()}

      {/* ============ SCENE 3: Features ============ */}
      {currentScene === 2 && (() => {
        const sf = sceneFrame(SCENE2_END)
        return (
          <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 100px' }}>

            <div style={{
              color: accentColor,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: 'uppercase',
              opacity: fadeIn(SCENE2_END, SCENE2_END + 15),
              marginBottom: 24,
            }}>
              ✦ Everything you need
            </div>

            <div style={{
              fontSize: 64,
              fontWeight: 800,
              color: '#FFFFFF',
              opacity: fadeIn(SCENE2_END + 5, SCENE2_END + 25),
              transform: `translateY(${slideUp(SCENE2_END + 5)}px)`,
              textAlign: 'center',
              letterSpacing: '-2px',
              marginBottom: 64,
            }}>
              Built different.
            </div>

            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
              {featuresArray.map((feature, i) => {
                const featureStart = SCENE2_END + 20 + i * 12
                const icons = ['⚡', '🎯', '🚀', '✨', '🔥', '💎']
                return (
                  <div key={i} style={{
                    background: '#0E0E18',
                    border: `1px solid ${primaryColor}33`,
                    borderRadius: 20,
                    padding: '32px 40px',
                    minWidth: 240,
                    opacity: interpolate(frame, [featureStart, featureStart + 15], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                    transform: `translateY(${spring({ frame: Math.max(0, frame - featureStart), fps, from: 40, to: 0, config: { damping } })}px)`,
                    boxShadow: `0 0 40px ${primaryColor}11`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {/* Card glow top */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 1,
                      background: `linear-gradient(90deg, transparent, ${primaryColor}88, transparent)`,
                    }} />
                    <div style={{ fontSize: 36, marginBottom: 16 }}>{icons[i % icons.length]}</div>
                    <div style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 600, lineHeight: 1.3 }}>{feature}</div>
                  </div>
                )
              })}
            </div>
          </AbsoluteFill>
        )
      })()}

      {/* ============ SCENE 4: CTA ============ */}
      {currentScene === 3 && (() => {
        const sf = sceneFrame(SCENE3_END)
        const pulse = interpolate(frame % 40, [0, 20, 40], [1, 1.03, 1])
        return (
          <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

            {/* Big glow behind CTA */}
            <div style={{
              position: 'absolute',
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${primaryColor}22 0%, transparent 70%)`,
              transform: `scale(${pulse})`,
            }} />

            <div style={{
              color: accentColor,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: 'uppercase',
              opacity: fadeIn(SCENE3_END, SCENE3_END + 15),
              marginBottom: 24,
            }}>
              ✦ Start creating
            </div>

            <div style={{
              fontSize: 80,
              fontWeight: 900,
              color: '#FFFFFF',
              opacity: fadeIn(SCENE3_END + 5, SCENE3_END + 25),
              transform: `translateY(${slideUp(SCENE3_END + 5)}px)`,
              textAlign: 'center',
              letterSpacing: '-3px',
              lineHeight: 1,
              marginBottom: 16,
            }}>
              {productName}
            </div>

            <div style={{
              fontSize: 22,
              color: '#888',
              opacity: fadeIn(SCENE3_END + 15, SCENE3_END + 35),
              marginBottom: 56,
              textAlign: 'center',
            }}>
              {price}
            </div>

            <div style={{
              opacity: fadeIn(SCENE3_END + 25, SCENE3_END + 45),
              transform: `translateY(${slideUp(SCENE3_END + 25)}px) scale(${pulse})`,
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                borderRadius: 60,
                padding: '20px 64px',
                color: '#FFFFFF',
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 0.5,
                boxShadow: `0 0 60px ${primaryColor}55`,
              }}>
                {callToAction} →
              </div>
            </div>

            {/* Bottom tagline */}
            <div style={{
              position: 'absolute',
              bottom: 60,
              color: '#333',
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: 3,
              textTransform: 'uppercase',
              opacity: fadeIn(SCENE3_END + 40, SCENE3_END + 60),
            }}>
              {tagline}
            </div>
          </AbsoluteFill>
        )
      })()}

      {/* Scene transition overlay */}
      {[SCENE1_END, SCENE2_END, SCENE3_END].map((t, i) => (
        <AbsoluteFill key={i} style={{
          background: '#000000',
          opacity: interpolate(frame, [t - 5, t, t + 8], [0, 0.8, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
          pointerEvents: 'none',
        }} />
      ))}

    </AbsoluteFill>
  )
}

export default ProductLaunch