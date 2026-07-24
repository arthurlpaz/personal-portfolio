import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import logo from '@/assets/arthur-logo-dark.svg'
import { useI18n } from '@/i18n/useI18n'

const hrefs = ['#about', '#expertise', '#projects', '#timeline', '#contact'] as const

export default function Nav() {
  const { t, lang, toggle } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState('')

  const links = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.expertise, href: '#expertise' },
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.timeline, href: '#timeline' },
    { label: t.nav.contact, href: '#contact' },
  ]

  // Scroll progress for the top bar. The spring keeps it from twitching on
  // trackpad/momentum scrolling without lagging behind.
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })

  useEffect(() => {
    // The raw scroll event can fire dozens of times per frame; reading
    // offsetTop inside it forces layout every time. Coalesce into one rAF.
    let frame = 0
    const measure = () => {
      frame = 0
      setScrolled(window.scrollY > 60)
      // Uses the module-level `hrefs`, not the localised `links`: the effect
      // must not re-subscribe every time the language changes.
      for (let i = hrefs.length - 1; i >= 0; i--) {
        const s = document.querySelector(hrefs[i]) as HTMLElement | null
        if (s && s.offsetTop - 200 <= window.scrollY) {
          setActive(hrefs[i])
          break
        }
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-lg shadow-black/20' : ''
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group" aria-label={t.nav.home}>
          <img src={logo} alt="" className="h-8 w-8 transition-transform group-hover:scale-105" />
          <span className="font-mono text-[13px] font-medium lowercase tracking-[0.14em] text-ghost/80 transition-colors group-hover:text-teal">
            personal<span className="text-steel">.</span>portfolio
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className={`relative px-3.5 py-2 text-sm font-medium transition-colors ${
                active === href
                  ? 'text-teal'
                  : 'text-ghost/50 hover:text-ghost/90'
              }`}
            >
              {label}
              {active === href && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-3 right-3 h-px bg-teal"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Discoverability for the palette — the shortcut is invisible otherwise. */}
        <kbd
          className="ml-3 hidden items-center gap-0.5 rounded border border-border/60 bg-secondary/40
            px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline-flex"
          aria-hidden
        >
          ⌘K
        </kbd>

        <button
          onClick={toggle}
          aria-label={t.nav.switchTo}
          title={t.nav.switchTo}
          className="ml-2 flex items-center gap-1 rounded-md border border-border/60 bg-secondary/30
            px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors
            hover:border-teal/40 hover:text-teal active:scale-95"
        >
          <span className={lang === 'pt' ? 'text-teal' : ''}>PT</span>
          <span className="opacity-30">/</span>
          <span className={lang === 'en' ? 'text-teal' : ''}>EN</span>
        </button>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-md
            transition-transform active:scale-90"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="w-5 h-px bg-ghost"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-5 h-px bg-ghost"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="w-5 h-px bg-ghost"
          />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {links.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="text-ghost/70 hover:text-teal transition-colors text-lg font-display"
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading progress. scaleX on a fixed-width bar — no layout, GPU only. */}
      <motion.div
        style={{ scaleX: progress }}
        className="absolute bottom-0 left-0 right-0 h-px origin-left
          bg-gradient-to-r from-steel via-azure to-teal"
        aria-hidden
      />
    </motion.header>
  )
}
