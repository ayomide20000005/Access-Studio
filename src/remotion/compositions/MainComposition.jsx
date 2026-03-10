import { AbsoluteFill } from 'remotion'
import { DemoVideo } from '../../templates/DemoVideo'
import { ProductLaunch } from '../../templates/ProductLaunch'
import { ExplainerVideo } from '../../templates/ExplainerVideo'
import { PromotionalVideo } from '../../templates/PromotionalVideo'
import { TutorialVideo } from '../../templates/TutorialVideo'
import { IntroOutro } from '../../templates/IntroOutro'
import { SocialMediaClip } from '../../templates/SocialMediaClip'
import { PitchDeckVideo } from '../../templates/PitchDeckVideo'
import { ResumePortfolio } from '../../templates/ResumePortfolio'
import { EventAnnouncement } from '../../templates/EventAnnouncement'

const templateMap = {
  'demo-video': DemoVideo,
  'product-launch': ProductLaunch,
  'explainer-video': ExplainerVideo,
  'promotional-video': PromotionalVideo,
  'tutorial-video': TutorialVideo,
  'intro-outro': IntroOutro,
  'social-media-clip': SocialMediaClip,
  'pitch-deck-video': PitchDeckVideo,
  'resume-portfolio': ResumePortfolio,
  'event-announcement': EventAnnouncement,
}

export const MainComposition = ({ templateId, inputs, selectedStyles }) => {
  const TemplateComponent = templateMap[templateId]

  if (!TemplateComponent) {
    return (
      <AbsoluteFill
        style={{
          background: '#0F0F0F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: '#888', fontSize: 24 }}>Select a template to preview</p>
      </AbsoluteFill>
    )
  }

  return (
    <TemplateComponent
      {...inputs}
      {...selectedStyles}
    />
  )
}