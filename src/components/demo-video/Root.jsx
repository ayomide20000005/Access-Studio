import { Composition } from 'remotion'
import { DemoVideoComposition } from './Composition'

export const Root = () => {
  return (
    <Composition
      id="DemoVideo"
      component={DemoVideoComposition}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        productName: 'Acces Studio',
        tagline: 'Create videos in minutes',
        keyFeatures: 'No code, Offline, Fast',
        callToAction: 'Try it today',
        primaryColor: '#7C3AED',
        secondaryColor: '#4F46E5',
        fontFamily: 'Inter',
        duration: 10,
        selectedStyles: {
          videoStyle: 'Minimal',
          mood: 'Energetic',
          animation: 'Smooth',
          background: 'Gradient',
        },
      }}
    />
  )
}