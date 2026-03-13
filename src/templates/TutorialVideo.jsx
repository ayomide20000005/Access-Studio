import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export const TutorialVideo = ({
  tutorialTitle = 'How To Master This In Minutes',
  instructorName = 'Your Name',
  instructorRole = 'Expert Instructor',
  steps = 'Open the app and sign in, Configure your settings, Run your first project, Export and share',
  tips = 'Pro tip: Use keyboard shortcuts to save time',
  difficulty = 'Beginner',
  duration = '5 min read',
  callToAction = 'Watch Full Tutorial',
  primaryColor = '#059669',
  secondaryColor = '#0891B2',
  accentColor = '#F59E0B',
  fontFamily = 'Inter',
  pace = 'Medium',
  tone = 'Friendly',
  layout = 'Step by Step',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const damping = pace === 'Fast' ? 20 : pace === 'Slow' ? 8 : 12

  const stepsArray = typeof steps === 'string'
    ? steps.split(',').map(s => s.trim()).filter(Boolean)
    : steps

  // Proportional scene timing
  const S1 = Math.floor(durationInFrames * 0.18)  // Intro
  const S2 = Math.floor(durationInFrames * 0.82)  // Steps (longest scene)
  const S3 = durationInFrames                      // CTA

  // Within S2, each step gets equal time
  const stepsSceneDuration = S2 - S1
  const framesPerStep = Math.floor(stepsSceneDuration / stepsArray.length)
  const currentStepIndex = Math.min(
    Math.floor((frame - S1) / framesPerStep),
    stepsArray.length - 1
  )
  const stepFrame = (frame - S1) % framesPerStep

  const currentScene = frame < S1 ? 0 : frame < S2 ? 1 : 2

  const fadeIn = (start, end) =>
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  const slideUp = (start, dist = 50) =>
    spring({ frame: Math.max(0, frame - start), fps, from: dist, to: 0, config: { damping, stiffness: 100 } })

  const outroOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' })

  const toneColor = tone === 'Casual' ? accentColor : tone === 'Professional' ? secondaryColor : primaryColor

  const difficultyColors = {
    Beginner: '#22C55E',
    Intermediate: accentColor,
    Advanced: '#EF4444',
  }
  const diffColor = difficultyColors[difficulty] || primaryColor

  // Progress percentage for current step
  const stepProgress = interpolate(stepFrame, [0, framesPerStep], [0, 100], { extrapolateRight: 'clamp' })
  const totalProgress = interpolate(frame, [S1, S2], [0, 100], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  return (
    <AbsoluteFill style={{ background: '#07090E', fontFamily, opacity: outroOpacity, overflow: 'hidden' }}>

      {/* Background gradient */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 10% 20%, ${primaryColor}10 0%, transparent 50%),
                     radial-gradient(ellipse at 90% 80%, ${secondaryColor}0C 0%, transparent 50%)`,
      }} />

      {/* ===== SCENE 1: Intro ===== */}
      {currentScene === 0 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 120px' }}>

          {/* Top badges */}
          <div style={{
            display: 'flex',
            gap: 16,
            marginBottom: 48,
            opacity: fadeIn(0, 18),
            transform: `translateY(${slideUp(0, 20)}px)`,
          }}>
            <div style={{
              background: `${diffColor}22`,
              border: `1px solid ${diffColor}44`,
              borderRadius: 50,
              padding: '8px 20px',
              color: diffColor,
              fontSize: 14,
              fontWeight: 600,
            }}>
              {difficulty}
            </div>
            <div style={{
              background: '#1A1A2A',
              border: '1px solid #2A2A3A',
              borderRadius: 50,
              padding: '8px 20px',
              color: '#888',
              fontSize: 14,
              fontWeight: 500,
            }}>
              ⏱ {duration}
            </div>
            <div style={{
              background: '#1A1A2A',
              border: '1px solid #2A2A3A',
              borderRadius: 50,
              padding: '8px 20px',
              color: '#888',
              fontSize: 14,
              fontWeight: 500,
            }}>
              📋 {stepsArray.length} Steps
            </div>
          </div>

          {/* Main title */}
          <div style={{
            fontSize: 88,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(8, 25),
            transform: `translateY(${slideUp(8, 50)}px)`,
            textAlign: 'center',
            letterSpacing: '-3px',
            lineHeight: 1.05,
            marginBottom: 32,
            maxWidth: 1300,
          }}>
            {tutorialTitle}
          </div>

          {/* Instructor card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            background: '#0F0F1A',
            border: '1px solid #1E1E2E',
            borderRadius: 60,
            padding: '14px 28px',
            opacity: fadeIn(20, 38),
            transform: `translateY(${slideUp(20, 20)}px)`,
          }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}>
              👤
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 600 }}>{instructorName}</div>
              <div style={{ color: '#666', fontSize: 13, marginTop: 2 }}>{instructorRole}</div>
            </div>
          </div>

          {/* Progress bar preview */}
          <div style={{
            position: 'absolute',
            bottom: 60,
            left: 120,
            right: 120,
            opacity: fadeIn(28, 45),
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: '#555', fontSize: 13, fontWeight: 500 }}>Your Progress</span>
              <span style={{ color: primaryColor, fontSize: 13, fontWeight: 600 }}>0%</span>
            </div>
            <div style={{ height: 4, background: '#1A1A2A', borderRadius: 2 }}>
              <div style={{ height: '100%', width: '0%', background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`, borderRadius: 2 }} />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 2: Steps ===== */}
      {currentScene === 1 && (
        <AbsoluteFill>

          {/* Top progress bar */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 4,
            background: '#1A1A2A',
            zIndex: 10,
          }}>
            <div style={{
              height: '100%',
              width: `${totalProgress}%`,
              background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 2,
              transition: 'width 0.1s',
            }} />
          </div>

          {/* Header bar */}
          <div style={{
            position: 'absolute',
            top: 4, left: 0, right: 0,
            height: 72,
            background: '#0A0A14',
            borderBottom: '1px solid #1A1A2A',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 40,
            paddingRight: 40,
            justifyContent: 'space-between',
          }}>
            <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>{tutorialTitle}</div>
            <div style={{ color: toneColor, fontSize: 15, fontWeight: 600 }}>
              Step {Math.max(1, currentStepIndex + 1)} of {stepsArray.length}
            </div>
          </div>

          {/* Left sidebar — step list */}
          <div style={{
            position: 'absolute',
            top: 76,
            left: 0,
            bottom: 0,
            width: 340,
            background: '#090912',
            borderRight: '1px solid #1A1A2A',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            overflowY: 'hidden',
          }}>
            {stepsArray.map((step, i) => {
              const isActive = i === currentStepIndex
              const isDone = i < currentStepIndex
              return (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: isActive ? `${toneColor}18` : 'transparent',
                  border: `1px solid ${isActive ? toneColor + '44' : 'transparent'}`,
                  transition: 'all 0.3s',
                }}>
                  <div style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: isDone ? toneColor : isActive ? `${toneColor}33` : '#1A1A2A',
                    border: `2px solid ${isDone || isActive ? toneColor : '#2A2A3A'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    color: isDone ? '#FFFFFF' : isActive ? toneColor : '#555',
                    flexShrink: 0,
                    transition: 'all 0.3s',
                  }}>
                    {isDone ? '✓' : i + 1}
                  </div>
                  <div style={{
                    color: isActive ? '#FFFFFF' : isDone ? '#888' : '#444',
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                    lineHeight: 1.4,
                    paddingTop: 4,
                    transition: 'all 0.3s',
                  }}>
                    {step}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Main content area */}
          <div style={{
            position: 'absolute',
            top: 76,
            left: 340,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 80px',
          }}>

            {/* Step number */}
            <div style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 5,
              textTransform: 'uppercase',
              color: toneColor,
              opacity: interpolate(stepFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
              marginBottom: 20,
            }}>
              Step {currentStepIndex + 1}
            </div>

            {/* Step content - big */}
            <div style={{
              fontSize: 56,
              fontWeight: 800,
              color: '#FFFFFF',
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: '-1.5px',
              opacity: interpolate(stepFrame, [5, 22], [0, 1], { extrapolateRight: 'clamp' }),
              transform: `translateY(${spring({ frame: Math.max(0, stepFrame - 5), fps, from: 30, to: 0, config: { damping } })}px)`,
              maxWidth: 900,
            }}>
              {stepsArray[Math.max(0, currentStepIndex)]}
            </div>

            {/* Step progress indicator */}
            <div style={{
              marginTop: 48,
              width: 200,
              height: 3,
              background: '#1A1A2A',
              borderRadius: 2,
            }}>
              <div style={{
                height: '100%',
                width: `${stepProgress}%`,
                background: toneColor,
                borderRadius: 2,
              }} />
            </div>

            {/* Tip (shows on last step) */}
            {currentStepIndex === stepsArray.length - 1 && (
              <div style={{
                marginTop: 40,
                background: `${accentColor}15`,
                border: `1px solid ${accentColor}33`,
                borderRadius: 14,
                padding: '16px 32px',
                opacity: interpolate(stepFrame, [20, 38], [0, 1], { extrapolateRight: 'clamp' }),
                maxWidth: 700,
                textAlign: 'center',
              }}>
                <span style={{ color: accentColor, fontSize: 18, fontWeight: 600 }}>💡 {tips}</span>
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* ===== SCENE 3: CTA ===== */}
      {currentScene === 2 && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 120px' }}>

          {/* Completion check */}
          <div style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 44,
            opacity: fadeIn(S2, S2 + 18),
            transform: `scale(${spring({ frame: Math.max(0, frame - S2), fps, from: 0.5, to: 1, config: { damping: 8 } })})`,
            marginBottom: 36,
            boxShadow: `0 0 60px ${primaryColor}44`,
          }}>
            ✓
          </div>

          <div style={{
            color: primaryColor,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: 'uppercase',
            opacity: fadeIn(S2 + 10, S2 + 25),
            marginBottom: 16,
          }}>
            You're ready
          </div>

          <div style={{
            fontSize: 72,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: fadeIn(S2 + 15, S2 + 32),
            transform: `translateY(${slideUp(S2 + 15)}px)`,
            textAlign: 'center',
            letterSpacing: '-2px',
            lineHeight: 1.1,
            marginBottom: 48,
            maxWidth: 1100,
          }}>
            {tutorialTitle}
          </div>

          <div style={{
            opacity: fadeIn(S2 + 28, S2 + 45),
            transform: `translateY(${slideUp(S2 + 28, 25)}px)`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: 60,
              padding: '22px 72px',
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: 800,
              boxShadow: `0 0 50px ${primaryColor}44`,
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
          opacity: interpolate(frame, [t - 4, t, t + 10], [0, 0.85, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
          pointerEvents: 'none',
        }} />
      ))}

    </AbsoluteFill>
  )
}

export default TutorialVideo