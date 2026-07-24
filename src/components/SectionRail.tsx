import { useEffect, useState } from 'react'
import { useI18n } from '@/i18n/useI18n'

const hrefs = ['#about', '#expertise', '#projects', '#timeline', '#contact'] as const

/**
 * Vertical section markers. The top progress bar answers "how much is left";
 * this answers "where am I", and lets the visitor jump without the header.
 * Desktop only — on small screens it would sit on top of the content.
 */
export default function SectionRail() {
  const { t } = useI18n()
  const [active, setActive] = useState('')

  const sections = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.expertise, href: '#expertise' },
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.timeline, href: '#timeline' },
    { label: t.nav.contact, href: '#contact' },
  ]

  useEffect(() => {
    // Same rAF-coalesced pattern as the nav: reading offsetTop on every raw
    // scroll event forces layout.
    let frame = 0
    const measure = () => {
      frame = 0
      // Module-level `hrefs`, so the effect does not re-subscribe per language.
      for (let i = hrefs.length - 1; i >= 0; i--) {
        const el = document.querySelector(hrefs[i]) as HTMLElement | null
        if (el && el.offsetTop - 200 <= window.scrollY) {
          setActive(hrefs[i])
          return
        }
      }
      setActive('')
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
    <nav
      aria-label={t.nav.sections}
      className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex"
    >
      {sections.map(({ label, href }) => {
        const isActive = active === href
        return (
          <a
            key={href}
            href={href}
            aria-current={isActive ? 'true' : undefined}
            className="group flex items-center gap-2.5 rounded py-0.5"
          >
            <span
              className="font-mono text-[10px] uppercase tracking-widest text-ghost/0
                transition-colors duration-300 group-hover:text-ghost/50
                group-focus-visible:text-ghost/50"
            >
              {label}
            </span>
            <span
              className={`block h-px transition-all duration-300 ${
                isActive
                  ? 'w-6 bg-teal'
                  : 'w-3 bg-ghost/20 group-hover:w-5 group-hover:bg-ghost/40'
              }`}
            />
          </a>
        )
      })}
    </nav>
  )
}
