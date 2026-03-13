// LOCATION: src/templates/ExplainerVideo.jsx

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export const ExplainerVideo = ({
  topic = 'Your Topic',
  problem = 'The problem people face every single day',
  solution = 'Your amazing solution that changes everything',
  howItWorks = 'Step One, Step Two, Step Three, Step Four',
  stats = '10x faster, 50% cheaper, 99% accurate',
  callToAction = 'Learn More',
  primaryColor = '#14B8A6',
  secondaryColor = '#6366F1',
  accentColor = '#F59E0B',
  fontFamily = 'Inter',
  style = 'Simple',
  tone = 'Friendly',
  pace = 'Medium',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const stepsArray = typeof howItWorks === 'string'
    ? howItWorks.split(',').map(s => s.trim()).filter(Boolean)
    : Array.isArray(howItWorks) ? howItWorks : []

  const statsArray = typeof stats === 'string'
    ? stats.split(',').map(s => s.trim()).filter(Boolean)
    : Array.isArray(stats) ? stats : []

  const damping = pace === 'Fast' ? 22 : pace === 'Slow' ? 8 : 12

  // ── Proportional scene timing ──
  const S1 = Math.floor(durationInFrames * 0.18)
  const S2 = Math.floor(durationInFrames * 0.38)
  const S3 = Math.floor(durationInFrames * 0.58)
  const S4 = Math.floor(durationInFrames * 0.80)

  const scene = frame < S1 ? 0 : frame < S2 ? 1 : frame < S3 ? 2 : frame < S4 ? 3 : 4

  // ── Helpers ──
  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const scaleSpring = (start, from = 0.7) =>
    spring({ frame: Math.max(0, frame - start), fps, from, to: 1, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const flashOpacity = (t) =>
    interpolate(frame, [t - 3, t, t + 8], [0, 0.9, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const toneColor = tone === 'Casual' ? accentColor : tone === 'Serious' ? '#6B7280' : tone === 'Professional' ? secondaryColor : primaryColor

  // ── Kinetic word-by-word reveal ──
  const KineticText = ({ text, startFrame, fontSize = 60, color = '#FFFFFF', stagger = 8 }) => {
    const words = text.split(' ')
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 12px', alignItems: 'center' }}>
        {words.map((word, i) => {
          const wStart = startFrame + i * stagger
          const op = interpolate(frame, [wStart, wStart + 12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
          const y = spring({ frame: Math.max(0, frame - wStart), fps, from: 30, to: 0, config: { damping } })
          const sc = spring({ frame: Math.max(0, frame - wStart), fps, from: 0.7, to: 1, config: { damping: 8 } })
          return (
            <span key={i} style={{
              fontSize, fontWeight: 800, color,
              opacity: op,
              transform: `translateY(${y}px) scale(${sc})`,
              display: 'inline-block',
              letterSpacing: '-1px',
              lineHeight: 1.2,
            }}>
              {word}
            </span>
          )
        })}
      </div>
    )
  }

  // ── Bubble pop ──
  const BubblePop = ({ text, startFrame, color = primaryColor, fontSize = 22 }) => {
    const sc = spring({ frame: Math.max(0, frame - startFrame), fps, from: 0, to: 1, config: { damping: 6, stiffness: 200 } })
    const op = interpolate(frame, [startFrame, startFrame + 8], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    return (
      <div style={{
        background: `${color}20`,
        border: `1.5px solid ${color}55`,
        borderRadius: 50,
        padding: '12px 28px',
        color, fontSize, fontWeight: 700,
        opacity: op,
        transform: `scale(${sc})`,
        display: 'inline-block',
        boxShadow: `0 0 20px ${color}33`,
      }}>
        {text}
      </div>
    )
  }

  // ── Underline draw ──
  const UnderlineDraw = ({ startFrame, width = 200, color = primaryColor }) => (
    <div style={{
      height: 3,
      width: interpolate(frame, [startFrame, startFrame + 30], [0, width], { extrapolateRight: 'clamp' }),
      background: `linear-gradient(90deg, ${color}, ${secondaryColor})`,
      borderRadius: 2,
      boxShadow: `0 0 12px ${color}88`,
      margin: '10px auto 0',
    }} />
  )

  // ── Chart bar build-up ──
  const ChartBar = ({ label, percent, startFrame, color = primaryColor, index = 0 }) => {
    const barWidth = interpolate(frame, [startFrame + index * 12, startFrame + index * 12 + 35], [0, percent], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    const op = interpolate(frame, [startFrame + index * 8, startFrame + index * 8 + 12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    return (
      <div style={{ opacity: op, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>{label}</span>
          <span style={{ color, fontSize: 14, fontWeight: 700 }}>{Math.round(barWidth)}%</span>
        </div>
        <div style={{ height: 8, background: '#111', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${barWidth}%`,
            background: `linear-gradient(90deg, ${color}, ${secondaryColor})`,
            borderRadius: 4,
            boxShadow: `0 0 10px ${color}88`,
          }} />
        </div>
      </div>
    )
  }

  // ── Big chapter number ──
  const ChapterNumber = ({ num, color = primaryColor }) => (
    <div style={{
      position: 'absolute',
      fontSize: 300,
      fontWeight: 900,
      color: `${color}08`,
      top: '50%', left: '50%',
      transform: 'translate(-50%, -52%)',
      letterSpacing: '-15px',
      userSelect: 'none',
      lineHeight: 1,
      pointerEvents: 'none',
    }}>
      {num}
    </div>
  )

  return (
    <AbsoluteFill style={{ background: '#06060F', fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Fixed background glow */}
      <AbsoluteFill style={{
        background: `
          radial-gradient(ellipse at 25% 50%, ${primaryColor}12 0%, transparent 50%),
          radial-gradient(ellipse at 75% 50%, ${secondaryColor}0E 0%, transparent 50%)
        `,
      }} />

      {/* ══════════════════════════════════
          SCENE 1 — Topic Intro
      ══════════════════════════════════ */}
      {scene === 0 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 120px' }}>
          <ChapterNumber num="01" color={primaryColor} />

          <div style={{
            color: toneColor, fontSize: 13, fontWeight: 700, letterSpacing: 7,
            textTransform: 'uppercase',
            opacity: fadeIn(0, 14), marginBottom: 28,
            display: 'flex', alignItems: 'center', gap: 14,
            filter: `drop-shadow(0 0 8px ${toneColor})`,
          }}>
            <div style={{ width: 36, height: 1, background: toneColor }} />
            Explainer
            <div style={{ width: 36, height: 1, background: toneColor }} />
          </div>

          <KineticText text={topic} startFrame={6} fontSize={88} color="#FFFFFF" stagger={6} />
          <UnderlineDraw startFrame={20} width={320} color={primaryColor} />

          <div style={{ display: 'flex', gap: 16, marginTop: 44, flexWrap: 'wrap', justifyContent: 'center' }}>
            {statsArray.map((stat, i) => (
              <BubblePop key={i} text={stat} startFrame={28 + i * 12} color={[primaryColor, secondaryColor, accentColor][i % 3]} fontSize={18} />
            ))}
          </div>
        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 2 — Problem
      ══════════════════════════════════ */}
      {scene === 1 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 140px' }}>
          <ChapterNumber num="02" color="#EF4444" />

          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 4,
            background: 'linear-gradient(90deg, transparent, #EF444488, transparent)',
            opacity: fadeIn(S1, S1 + 20),
          }} />

          <div style={{ fontSize: 56, opacity: fadeIn(S1, S1 + 15), transform: `scale(${scaleSpring(S1, 0.4)})`, marginBottom: 20 }}>⚠️</div>

          <div style={{
            color: '#EF4444', fontSize: 12, fontWeight: 700, letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: fadeIn(S1 + 6, S1 + 20), marginBottom: 28,
            filter: 'drop-shadow(0 0 8px #EF4444)',
          }}>
            The Problem
          </div>

          <KineticText text={problem} startFrame={S1 + 12} fontSize={56} color="#FFFFFF" stagger={5} />
          <UnderlineDraw startFrame={S1 + 28} width={280} color="#EF4444" />
        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 3 — Solution + Charts
      ══════════════════════════════════ */}
      {scene === 2 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 140px' }}>
          <ChapterNumber num="03" color={primaryColor} />

          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 4,
            background: `linear-gradient(90deg, transparent, ${primaryColor}88, transparent)`,
            opacity: fadeIn(S2, S2 + 20),
          }} />

          <div style={{ fontSize: 56, opacity: fadeIn(S2, S2 + 15), transform: `scale(${scaleSpring(S2, 0.4)})`, marginBottom: 20 }}>💡</div>

          <div style={{
            color: toneColor, fontSize: 12, fontWeight: 700, letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: fadeIn(S2 + 6, S2 + 20), marginBottom: 28,
            filter: `drop-shadow(0 0 8px ${toneColor})`,
          }}>
            The Solution
          </div>

          <KineticText text={solution} startFrame={S2 + 12} fontSize={52} color="#FFFFFF" stagger={5} />
          <UnderlineDraw startFrame={S2 + 28} width={280} color={primaryColor} />

          <div style={{ marginTop: 44, width: 580, opacity: fadeIn(S2 + 30, S2 + 45) }}>
            <ChartBar label="Performance" percent={92} startFrame={S2 + 32} color={primaryColor} index={0} />
            <ChartBar label="Efficiency" percent={85} startFrame={S2 + 32} color={secondaryColor} index={1} />
            <ChartBar label="Accuracy" percent={97} startFrame={S2 + 32} color={accentColor} index={2} />
          </div>
        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 4 — How It Works
      ══════════════════════════════════ */}
      {scene === 3 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 80px' }}>
          <ChapterNumber num="04" color={secondaryColor} />

          <div style={{
            color: toneColor, fontSize: 12, fontWeight: 700, letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: fadeIn(S3, S3 + 14), marginBottom: 52,
            filter: `drop-shadow(0 0 8px ${toneColor})`,
          }}>
            How It Works
          </div>

          <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1400 }}>
            {stepsArray.map((step, i) => {
              const sStart = S3 + 12 + i * 16
              const sOp = interpolate(frame, [sStart, sStart + 14], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
              const sY = spring({ frame: Math.max(0, frame - sStart), fps, from: 40, to: 0, config: { damping } })
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                    opacity: sOp, transform: `translateY(${sY}px)`,
                    maxWidth: 220, padding: '0 20px',
                  }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 26, fontWeight: 900, color: '#FFFFFF',
                      boxShadow: `0 0 24px ${primaryColor}55`,
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 600, textAlign: 'center', lineHeight: 1.4 }}>
                      {step}
                    </div>
                  </div>
                  {i < stepsArray.length - 1 && (
                    <div style={{
                      color: `${primaryColor}55`, fontSize: 28, marginTop: 18,
                      opacity: interpolate(frame, [sStart + 10, sStart + 22], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                    }}>
                      →
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 5 — CTA
      ══════════════════════════════════ */}
      {scene === 4 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <ChapterNumber num="05" color={primaryColor} />

          <div style={{
            position: 'absolute', width: 700, height: 700, borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 65%)`,
            transform: `scale(${interpolate(frame % 60, [0, 30, 60], [0.95, 1.05, 0.95])})`,
            pointerEvents: 'none',
          }} />

          <div style={{
            color: toneColor, fontSize: 12, fontWeight: 700, letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: fadeIn(S4, S4 + 14), marginBottom: 20,
            filter: `drop-shadow(0 0 8px ${toneColor})`,
          }}>
            Get Started
          </div>

          <KineticText text={topic} startFrame={S4 + 6} fontSize={80} color="#FFFFFF" stagger={5} />
          <UnderlineDraw startFrame={S4 + 22} width={300} color={primaryColor} />

          <div style={{ display: 'flex', gap: 16, marginTop: 36, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 44 }}>
            {statsArray.map((stat, i) => (
              <BubblePop key={i} text={stat} startFrame={S4 + 28 + i * 10} color={[primaryColor, secondaryColor, accentColor][i % 3]} fontSize={16} />
            ))}
          </div>

          <div style={{
            opacity: fadeIn(S4 + 36, S4 + 50),
            transform: `scale(${scaleSpring(S4 + 36, 0.8)})`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 60, padding: '22px 80px',
              color: '#FFFFFF', fontSize: 24, fontWeight: 800,
              boxShadow: `0 0 55px ${primaryColor}55, 0 0 110px ${primaryColor}22`,
              letterSpacing: 0.5,
            }}>
              {callToAction} →
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene flash transitions */}
      {[S1, S2, S3, S4].map((t, i) => (
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

export default ExplainerVideo