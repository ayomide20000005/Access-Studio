// LOCATION: src/templates/TutorialVideo.jsx

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

// ── Circular progress — defined OUTSIDE component to avoid re-creation every frame ──
const CircularProgress = ({ frame, fps, percent, size, strokeWidth, color, startFrame }) => {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const animated = interpolate(frame, [startFrame, startFrame + 35], [0, percent], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
  const offset = circ - (animated / 100) * circ
  const glow = interpolate(frame % 40, [0, 20, 40], [0.6, 1, 0.6])
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`${color}22`} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px ${color})` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: glow,
      }}>
        <div style={{ fontSize: size * 0.22, fontWeight: 800, color, lineHeight: 1 }}>
          {Math.round(animated)}%
        </div>
      </div>
    </div>
  )
}

// ── Checkmark draw — defined OUTSIDE component ──
const CheckmarkDraw = ({ frame, startFrame, size, color }) => {
  const progress = interpolate(frame, [startFrame, startFrame + 20], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
  const dashLength = 30
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx={12} cy={12} r={11} fill={`${color}22`} stroke={color} strokeWidth={1.5} />
      <path
        d="M7 12.5l3.5 3.5 6.5-7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashLength}
        strokeDashoffset={dashLength * (1 - progress)}
      />
    </svg>
  )
}

export const TutorialVideo = ({
  tutorialTitle = 'How To Master This In Minutes',
  instructorName = 'Your Name',
  difficulty = 'Beginner',
  clipDuration = '10 min',
  steps = 'Open the app and sign in, Configure your settings, Run your first project, Export and share',
  tips = 'Pro tip: Use keyboard shortcuts to save time',
  callToAction = 'Watch Full Tutorial',
  primaryColor = '#6366F1',
  secondaryColor = '#14B8A6',
  accentColor = '#F59E0B',
  fontFamily = 'Inter',
  layout = 'Step by Step',
  tone = 'Friendly',
  pace = 'Medium',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const stepsArray = typeof steps === 'string'
    ? steps.split(',').map(s => s.trim()).filter(Boolean)
    : Array.isArray(steps) ? steps : []

  const safeStepsLength = Math.max(stepsArray.length, 1)
  const damping = pace === 'Fast' ? 22 : pace === 'Slow' ? 8 : 12

  // ── Proportional scene timing ──
  const S1 = Math.floor(durationInFrames * 0.18) // Title + overview
  const S2 = Math.floor(durationInFrames * 0.82) // Steps scene ends
  const S3 = durationInFrames                     // Recap + CTA

  const scene = frame < S1 ? 0 : frame < S2 ? 1 : 2

  // ── Step timing within scene 2 ──
  const stepsDuration = S2 - S1
  const framesPerStep = Math.max(1, Math.floor(stepsDuration / safeStepsLength))
  const currentStepIndex = Math.min(
    Math.floor(Math.max(0, frame - S1) / framesPerStep),
    safeStepsLength - 1
  )
  const stepFrame = Math.max(0, frame - S1) % framesPerStep
  const totalProgress = interpolate(frame, [S1, S2], [0, 100], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  // ── Helpers ──
  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, dist = 50) =>
    spring({ frame: Math.max(0, frame - start), fps, from: dist, to: 0, config: { damping } })

  const scaleSpring = (start, from = 0.7) =>
    spring({ frame: Math.max(0, frame - start), fps, from, to: 1, config: { damping } })

  const outroOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const flashOpacity = (t) =>
    interpolate(frame, [t - 3, t, t + 8], [0, 0.88, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const toneColor = tone === 'Casual' ? accentColor : tone === 'Professional' ? secondaryColor : primaryColor

  const difficultyColors = { Beginner: '#22C55E', Intermediate: accentColor, Advanced: '#EF4444' }
  const diffColor = difficultyColors[difficulty] || primaryColor

  return (
    <AbsoluteFill style={{ background: '#0D1117', fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Background glow */}
      <AbsoluteFill style={{
        background: `
          radial-gradient(ellipse at 30% 40%, ${primaryColor}10 0%, transparent 50%),
          radial-gradient(ellipse at 70% 60%, ${secondaryColor}0C 0%, transparent 50%)
        `,
      }} />

      {/* Subtle grid lines */}
      <AbsoluteFill style={{
        backgroundImage: `
          linear-gradient(${primaryColor}08 1px, transparent 1px),
          linear-gradient(90deg, ${primaryColor}08 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        opacity: 0.6,
        pointerEvents: 'none',
      }} />

      {/* ══════════════════════════════════
          SCENE 0 — Title + Overview
      ══════════════════════════════════ */}
      {scene === 0 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 120px' }}>

          {/* Badges */}
          <div style={{
            display: 'flex', gap: 14, marginBottom: 44,
            opacity: fadeIn(0, 18),
            transform: `translateY(${slideUp(0, 20)}px)`,
          }}>
            <div style={{
              background: `${diffColor}22`, border: `1px solid ${diffColor}44`,
              borderRadius: 50, padding: '8px 22px',
              color: diffColor, fontSize: 14, fontWeight: 700,
            }}>
              {difficulty}
            </div>
            <div style={{
              background: '#FFFFFF08', border: '1px solid #FFFFFF14',
              borderRadius: 50, padding: '8px 22px',
              color: '#888', fontSize: 14, fontWeight: 500,
            }}>
              ⏱ {clipDuration}
            </div>
            <div style={{
              background: '#FFFFFF08', border: '1px solid #FFFFFF14',
              borderRadius: 50, padding: '8px 22px',
              color: '#888', fontSize: 14, fontWeight: 500,
            }}>
              📋 {stepsArray.length} Steps
            </div>
          </div>

          {/* Title — kinetic word stagger */}
          <div style={{ textAlign: 'center', maxWidth: 1200 }}>
            {tutorialTitle.split(' ').map((word, i) => {
              const wStart = 8 + i * 5
              const op = interpolate(frame, [wStart, wStart + 12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
              const y = spring({ frame: Math.max(0, frame - wStart), fps, from: 35, to: 0, config: { damping } })
              return (
                <span key={i} style={{
                  fontSize: 80, fontWeight: 900, color: '#FFFFFF',
                  opacity: op,
                  transform: `translateY(${y}px)`,
                  display: 'inline-block',
                  letterSpacing: '-2px', lineHeight: 1.1,
                  marginRight: 16,
                }}>
                  {word}
                </span>
              )
            })}
          </div>

          {/* Underline draw */}
          <div style={{
            height: 3,
            width: interpolate(frame, [20, 50], [0, 300], { extrapolateRight: 'clamp' }),
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
            borderRadius: 2, marginTop: 16, marginBottom: 32,
            boxShadow: `0 0 14px ${primaryColor}88`,
          }} />

          {/* Instructor card */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 18,
            background: '#FFFFFF06', border: '1px solid #FFFFFF10',
            borderRadius: 60, padding: '14px 28px',
            opacity: fadeIn(26, 42),
            transform: `translateY(${slideUp(26, 20)}px)`,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0,
            }}>
              👤
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 600 }}>{instructorName}</div>
              <div style={{ color: '#555', fontSize: 13 }}>Instructor</div>
            </div>
          </div>

          {/* Progress preview bar */}
          <div style={{
            position: 'absolute', bottom: 52, left: 120, right: 120,
            opacity: fadeIn(32, 46),
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#444', fontSize: 13 }}>Your Progress</span>
              <span style={{ color: primaryColor, fontSize: 13, fontWeight: 700 }}>0%</span>
            </div>
            <div style={{ height: 4, background: '#FFFFFF10', borderRadius: 2 }} />
          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 1 — Steps with sidebar
      ══════════════════════════════════ */}
      {scene === 1 && (
        <AbsoluteFill>

          {/* Top progress bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 4, background: '#FFFFFF08', zIndex: 10,
          }}>
            <div style={{
              height: '100%',
              width: `${totalProgress}%`,
              background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 2,
              boxShadow: `0 0 8px ${primaryColor}88`,
            }} />
          </div>

          {/* Header bar */}
          <div style={{
            position: 'absolute', top: 4, left: 0, right: 0,
            height: 68,
            background: '#0A0E18',
            borderBottom: '1px solid #FFFFFF10',
            display: 'flex', alignItems: 'center',
            paddingLeft: 36, paddingRight: 36,
            justifyContent: 'space-between',
            zIndex: 10,
          }}>
            <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700, letterSpacing: '-0.5px' }}>
              {tutorialTitle}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <CircularProgress
                frame={frame}
                fps={fps}
                percent={(currentStepIndex + 1) / safeStepsLength * 100}
                size={42}
                strokeWidth={4}
                color={toneColor}
                startFrame={S1 + currentStepIndex * framesPerStep}
              />
              <div style={{ color: toneColor, fontSize: 14, fontWeight: 700 }}>
                Step {currentStepIndex + 1} / {stepsArray.length}
              </div>
            </div>
          </div>

          {/* Left sidebar */}
          <div style={{
            position: 'absolute', top: 72, left: 0, bottom: 0,
            width: 300,
            background: '#090D15',
            borderRight: '1px solid #FFFFFF0A',
            padding: '20px 14px',
            display: 'flex', flexDirection: 'column', gap: 6,
            overflow: 'hidden',
            zIndex: 5,
          }}>
            {stepsArray.map((step, i) => {
              const isActive = i === currentStepIndex
              const isDone = i < currentStepIndex
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '10px 12px', borderRadius: 10,
                  background: isActive ? `${toneColor}15` : 'transparent',
                  border: `1px solid ${isActive ? toneColor + '33' : 'transparent'}`,
                }}>
                  <div style={{ flexShrink: 0, marginTop: 2 }}>
                    {isDone ? (
                      <CheckmarkDraw
                        frame={frame}
                        startFrame={S1 + i * framesPerStep + 5}
                        size={22}
                        color={toneColor}
                      />
                    ) : (
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: isActive ? `${toneColor}33` : '#FFFFFF08',
                        border: `2px solid ${isActive ? toneColor : '#FFFFFF15'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700,
                        color: isActive ? toneColor : '#444',
                      }}>
                        {i + 1}
                      </div>
                    )}
                  </div>
                  <div style={{
                    color: isActive ? '#FFFFFF' : isDone ? '#555' : '#333',
                    fontSize: 13, fontWeight: isActive ? 600 : 400,
                    lineHeight: 1.4,
                  }}>
                    {step}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Main content area — NO transform scale to avoid clipping */}
          <div style={{
            position: 'absolute', top: 72, left: 300, right: 0, bottom: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '60px 80px',
          }}>

            {/* Ghost step number */}
            <div style={{
              position: 'absolute',
              fontSize: 220, fontWeight: 900,
              color: `${toneColor}08`,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -55%)',
              letterSpacing: '-10px',
              userSelect: 'none', lineHeight: 1,
              pointerEvents: 'none',
            }}>
              {String(currentStepIndex + 1).padStart(2, '0')}
            </div>

            {/* Step label */}
            <div style={{
              color: toneColor, fontSize: 12, fontWeight: 700,
              letterSpacing: 5, textTransform: 'uppercase',
              opacity: interpolate(stepFrame, [0, 14], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
              marginBottom: 18,
              filter: `drop-shadow(0 0 6px ${toneColor})`,
            }}>
              Step {currentStepIndex + 1}
            </div>

            {/* Step text */}
            <div style={{
              fontSize: 56, fontWeight: 800, color: '#FFFFFF',
              textAlign: 'center', lineHeight: 1.2, letterSpacing: '-1.5px',
              opacity: interpolate(stepFrame, [4, 20], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
              transform: `translateY(${spring({ frame: Math.max(0, stepFrame - 4), fps, from: 30, to: 0, config: { damping } })}px)`,
              maxWidth: 860, position: 'relative', zIndex: 1,
            }}>
              {stepsArray[currentStepIndex] || ''}
            </div>

            {/* Step progress bar */}
            <div style={{
              marginTop: 44, width: 180, height: 3,
              background: '#FFFFFF10', borderRadius: 2,
            }}>
              <div style={{
                height: '100%',
                width: `${interpolate(stepFrame, [0, framesPerStep], [0, 100], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })}%`,
                background: toneColor, borderRadius: 2,
              }} />
            </div>

            {/* Pro tip on last step */}
            {currentStepIndex === stepsArray.length - 1 && tips && (
              <div style={{
                marginTop: 40,
                background: `${accentColor}15`, border: `1px solid ${accentColor}33`,
                borderRadius: 14, padding: '16px 32px',
                opacity: interpolate(stepFrame, [18, 34], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                maxWidth: 700, textAlign: 'center',
              }}>
                <span style={{ color: accentColor, fontSize: 17, fontWeight: 600 }}>💡 {tips}</span>
              </div>
            )}

          </div>

        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════
          SCENE 2 — Recap + CTA
      ══════════════════════════════════ */}
      {scene === 2 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Bloom */}
          <div style={{
            position: 'absolute', width: 700, height: 700, borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 65%)`,
            transform: `scale(${interpolate(frame % 60, [0, 30, 60], [0.95, 1.05, 0.95])})`,
            pointerEvents: 'none',
          }} />

          {/* Completion circle */}
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 44,
            opacity: fadeIn(S2, S2 + 18),
            transform: `scale(${scaleSpring(S2, 0.4)})`,
            marginBottom: 32,
            boxShadow: `0 0 60px ${primaryColor}55`,
          }}>
            ✓
          </div>

          <div style={{
            color: primaryColor, fontSize: 13, fontWeight: 700,
            letterSpacing: 5, textTransform: 'uppercase',
            opacity: fadeIn(S2 + 10, S2 + 24),
            marginBottom: 16,
            filter: `drop-shadow(0 0 8px ${primaryColor})`,
          }}>
            You're ready
          </div>

          <div style={{
            fontSize: 72, fontWeight: 900, color: '#FFFFFF',
            opacity: fadeIn(S2 + 16, S2 + 32),
            transform: `translateY(${slideUp(S2 + 16, 40)}px)`,
            textAlign: 'center', letterSpacing: '-2px', lineHeight: 1.1,
            marginBottom: 44, maxWidth: 1000,
          }}>
            {tutorialTitle}
          </div>

          {/* Step checkmarks row */}
          <div style={{
            display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center',
            marginBottom: 48,
            opacity: fadeIn(S2 + 26, S2 + 40),
          }}>
            {stepsArray.map((_, i) => (
              <div key={i} style={{
                width: 32, height: 32, borderRadius: '50%',
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: '#FFFFFF',
                boxShadow: `0 0 12px ${primaryColor}55`,
                transform: `scale(${spring({ frame: Math.max(0, frame - (S2 + 26 + i * 6)), fps, from: 0, to: 1, config: { damping: 7 } })})`,
              }}>
                ✓
              </div>
            ))}
          </div>

          <div style={{
            opacity: fadeIn(S2 + 36, S2 + 50),
            transform: `scale(${scaleSpring(S2 + 36, 0.8)})`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 60, padding: '22px 80px',
              color: '#FFFFFF', fontSize: 24, fontWeight: 800,
              boxShadow: `0 0 55px ${primaryColor}55, 0 0 110px ${primaryColor}22`,
            }}>
              {callToAction} →
            </div>
          </div>

        </AbsoluteFill>
      )}

      {/* Scene flash transitions */}
      {[S1, S2].map((t, i) => (
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

export default TutorialVideo