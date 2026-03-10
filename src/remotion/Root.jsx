import { Composition } from 'remotion'
import { MainComposition } from './compositions/MainComposition'
import { DemoVideo } from '../templates/DemoVideo'
import { ProductLaunch } from '../templates/ProductLaunch'
import { ExplainerVideo } from '../templates/ExplainerVideo'
import { PromotionalVideo } from '../templates/PromotionalVideo'
import { TutorialVideo } from '../templates/TutorialVideo'
import { IntroOutro } from '../templates/IntroOutro'
import { SocialMediaClip } from '../templates/SocialMediaClip'
import { PitchDeckVideo } from '../templates/PitchDeckVideo'
import { ResumePortfolio } from '../templates/ResumePortfolio'
import { EventAnnouncement } from '../templates/EventAnnouncement'

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="MainComposition"
        component={MainComposition}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          templateId: 'demo-video',
          inputs: {},
          selectedStyles: {},
        }}
      />
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          productName: 'Your Product',
          tagline: 'Your Tagline',
          keyFeatures: ['Feature One', 'Feature Two', 'Feature Three'],
          callToAction: 'Try it today',
          primaryColor: '#7C3AED',
          secondaryColor: '#4F46E5',
          logoPath: null,
          fontFamily: 'Inter',
          videoStyle: 'Minimal',
          mood: 'Professional',
          animation: 'Smooth',
          background: 'Gradient',
        }}
      />
      <Composition
        id="ProductLaunch"
        component={ProductLaunch}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          productName: 'Product Name',
          launchDate: 'Coming Soon',
          keyBenefits: ['Benefit One', 'Benefit Two', 'Benefit Three'],
          price: '$99',
          callToAction: 'Pre-order Now',
          primaryColor: '#4F46E5',
          secondaryColor: '#7C3AED',
          logoPath: null,
          fontFamily: 'Inter',
          launchFeel: 'Hype',
          colorVibe: 'Dark Luxury',
          pace: 'Medium',
        }}
      />
      <Composition
        id="ExplainerVideo"
        component={ExplainerVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          topic: 'Your Topic',
          problem: 'The problem people face',
          solution: 'Your amazing solution',
          howItWorks: ['Step One', 'Step Two', 'Step Three'],
          callToAction: 'Learn More',
          primaryColor: '#0891B2',
          secondaryColor: '#7C3AED',
          fontFamily: 'Inter',
          style: 'Simple',
          tone: 'Friendly',
          pace: 'Medium',
        }}
      />
      <Composition
        id="PromotionalVideo"
        component={PromotionalVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          brandName: 'Your Brand',
          offer: 'Special Offer',
          discount: '50% OFF',
          expiryDate: 'Limited Time Only',
          callToAction: 'Shop Now',
          primaryColor: '#DC2626',
          secondaryColor: '#D97706',
          logoPath: null,
          fontFamily: 'Inter',
          energy: 'High Energy',
          style: 'Bold',
          emphasis: 'Discount',
        }}
      />
      <Composition
        id="TutorialVideo"
        component={TutorialVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          tutorialTitle: 'How To Do Something',
          steps: ['Step One', 'Step Two', 'Step Three'],
          tips: 'Pro tip: Always save your work',
          callToAction: 'Watch Full Tutorial',
          primaryColor: '#059669',
          secondaryColor: '#0891B2',
          fontFamily: 'Inter',
          layout: 'Step by Step',
          tone: 'Friendly',
          pace: 'Medium',
        }}
      />
      <Composition
        id="IntroOutro"
        component={IntroOutro}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          channelName: 'Your Channel',
          tagline: 'Subscribe for more',
          socialLinks: ['@yourchannel'],
          primaryColor: '#D97706',
          secondaryColor: '#DC2626',
          logoPath: null,
          fontFamily: 'Inter',
          type: 'Intro',
          style: 'Dynamic',
          animation: 'Smooth',
        }}
      />
      <Composition
        id="SocialMediaClip"
        component={SocialMediaClip}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          caption: 'Your Caption Here',
          hashtags: ['#viral', '#trending', '#fyp'],
          platform: 'tiktok',
          callToAction: 'Follow for more',
          primaryColor: '#DB2777',
          secondaryColor: '#7C3AED',
          fontFamily: 'Inter',
          format: 'Square',
          style: 'Bold',
          energy: 'High',
        }}
      />
      <Composition
        id="PitchDeckVideo"
        component={PitchDeckVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          companyName: 'Your Company',
          problem: 'The problem we solve',
          solution: 'Our unique solution',
          marketSize: '$1B Market',
          team: 'World class team',
          ask: 'Raising $500K',
          primaryColor: '#7C3AED',
          secondaryColor: '#4F46E5',
          logoPath: null,
          fontFamily: 'Inter',
          tone: 'Confident',
          style: 'Startup',
          pace: 'Medium',
        }}
      />
      <Composition
        id="ResumePortfolio"
        component={ResumePortfolio}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          fullName: 'Your Name',
          role: 'Your Role',
          skills: ['Skill One', 'Skill Two', 'Skill Three'],
          experience: '3+ Years Experience',
          contact: 'hello@yourname.com',
          primaryColor: '#4F46E5',
          secondaryColor: '#7C3AED',
          photoPath: null,
          fontFamily: 'Inter',
          layout: 'Centered',
          tone: 'Professional',
          style: 'Clean',
        }}
      />
      <Composition
        id="EventAnnouncement"
        component={EventAnnouncement}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          eventName: 'Your Event Name',
          date: 'January 1, 2025',
          location: 'City, Country',
          description: 'Join us for an amazing event',
          registerLink: 'register.yoursite.com',
          primaryColor: '#0891B2',
          secondaryColor: '#7C3AED',
          logoPath: null,
          fontFamily: 'Inter',
          vibe: 'Exciting',
          style: 'Bold',
          pace: 'Medium',
        }}
      />
    </>
  )
}