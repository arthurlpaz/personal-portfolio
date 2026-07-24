import { lazy, Suspense } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Expertise from './components/Expertise'
import Projects from './components/Projects'
import Timeline from './components/Timeline'
import Contact from './components/Contact'
import ScrollToTop from './components/ScrollToTop'
import SectionRail from './components/SectionRail'
import CommandPalette from './components/CommandPalette'
import KonamiToast from './components/KonamiToast'
import SecretWords from './components/SecretWords'
import ShortcutsDialog from './components/ShortcutsDialog'
import { Toaster } from './components/ui/sonner'
import { useI18n } from './i18n/useI18n'

// The Three.js background is the single heaviest dependency in the bundle.
// Loading it lazily keeps it out of the initial chunk so text content paints
// first (better FCP); the canvas fades in once its chunk arrives.
const ParticleField = lazy(() => import('./components/ParticleField'))

export default function App() {
  const { t } = useI18n()

  return (
    <>
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>
      <a href="#conteudo" className="skip-link">{t.nav.skipToContent}</a>
      <Nav />
      <main id="conteudo">
        <Hero />
        <About />
        <Expertise />
        <Projects />
        <Timeline />
        <Contact />
      </main>
      <SectionRail />
      <ScrollToTop />
      <CommandPalette />
      <KonamiToast />
      <SecretWords />
      <ShortcutsDialog />
      <Toaster />
      <Analytics />
      <SpeedInsights />
    </>
  )
}
