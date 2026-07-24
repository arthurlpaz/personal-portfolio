import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useI18n } from '@/i18n/useI18n'

function GitHubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

const NAME_LINES = ['Arthur Lincoln', 'da Paz Cristovão']

const nameContainer: Variants = {
  initial: {},
  animate: { transition: { delayChildren: 0.12, staggerChildren: 0.035 } },
}

// Each letter resolves out of a blur — it reads like the name is coming into
// focus rather than sliding in. Only transform/opacity/filter, no layout.
const letter: Variants = {
  initial: { opacity: 0, y: '0.4em', filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    y: '0em',
    filter: 'blur(0px)',
    // Kept short on purpose: blur is a costly paint at display sizes, and a
    // 0.55s window means ~14 letters are blurred at once instead of ~21.
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
}

/**
 * The name, in two stages:
 *
 *  1. Entrance — letter by letter, each resolving out of a blur.
 *  2. Settled — the per-letter spans are dropped and a gradient drifts through
 *     the letters on a 16s seamless loop (`.name-breathe`), so the name keeps
 *     pulling the eye long after the page has loaded.
 *
 * The stages have to be mutually exclusive: `filter: blur()` promotes every
 * letter to its own layer, which would break the `background-clip: text` the
 * gradient depends on. Dropping the spans also releases ~30 layers.
 */
function AnimatedName({ className }: { className: string }) {
  const reduced = useReducedMotion()
  const [settled, setSettled] = useState(false)
  const settledRef = useRef<HTMLHeadingElement>(null)
  const onScreen = useInView(settledRef, { margin: '-10% 0px' })
  const label = NAME_LINES.join(' ')

  // Once settled, the per-letter spans are gone and the gradient takes over.
  if (reduced || settled) {
    return (
      <h1
        ref={settledRef}
        // Easter egg: double-click replays the entrance. Cheap to offer, and
        // people who liked the animation always want to see it again.
        onDoubleClick={() => !reduced && setSettled(false)}
        className={`${className} name-breathe ${onScreen ? '' : 'is-paused'}`}
      >
        {NAME_LINES[0]}
        <br />
        {NAME_LINES[1]}
      </h1>
    )
  }

  return (
    <motion.h1
      variants={nameContainer}
      initial="initial"
      animate="animate"
      onAnimationComplete={() => setSettled(true)}
      className={className}
      aria-label={label}
    >
      {NAME_LINES.map((line, li) => (
        <span key={li} className="block" aria-hidden>
          {line.split(' ').map((word, wi) => (
            // Words stay unbreakable so the stagger never splits one across lines.
            <span key={wi} className="inline-block whitespace-nowrap">
              {word.split('').map((char, ci) => (
                <motion.span key={ci} variants={letter} className="inline-block">
                  {char}
                </motion.span>
              ))}
              {wi < line.split(' ').length - 1 && ' '}
            </span>
          ))}
        </span>
      ))}
    </motion.h1>
  )
}

export default function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative min-h-screen flex items-center px-6">
      <div className="max-w-6xl mx-auto w-full py-24">
       <div className="max-w-3xl">
        <motion.div
          {...fade}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <Avatar className="h-11 w-11 border border-border">
            <AvatarImage src="https://github.com/arthurlpaz.png" alt="Arthur Lincoln da Paz" />
            <AvatarFallback className="bg-secondary text-foreground font-display">AL</AvatarFallback>
          </Avatar>
          <span className="font-mono text-sm text-muted-foreground">{t.hero.location}</span>
        </motion.div>

        <AnimatedName
          className="font-display font-bold text-foreground leading-[1.02] tracking-tight
            text-5xl sm:text-6xl lg:text-7xl"
        />

        <motion.p
          {...fade}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="font-mono text-sm text-steel mt-5"
        >
          {t.hero.roles}
        </motion.p>

        <motion.p
          {...fade}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="max-w-2xl text-lg text-muted-foreground leading-relaxed mt-7"
        >
          {t.hero.introPre}
          <span className="text-azure">{t.hero.introEm}</span>
          {t.hero.introPost}
        </motion.p>

        <motion.div
          {...fade}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="flex flex-wrap items-center gap-3 mt-10"
        >
          <Button asChild variant="outline" size="lg" className="gap-2 border-border">
            <a href="#projects">
              {t.hero.ctaProjects}
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
          <Button asChild variant="ghost" size="lg" className="gap-2">
            <a href="https://github.com/arthurlpaz" target="_blank" rel="noopener noreferrer">
              <GitHubIcon /> GitHub
            </a>
          </Button>
          <Button asChild variant="ghost" size="lg" className="gap-2">
            <a
              href="https://www.linkedin.com/in/arthurlpaz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon /> LinkedIn
            </a>
          </Button>
        </motion.div>
       </div>
      </div>

      {/* Scroll cue — tells the visitor there is more below the fold. */}
      <motion.a
        href="#about"
        aria-label={t.hero.scrollAria}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2
          rounded text-muted-foreground/50 transition-colors hover:text-teal sm:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.25em]">{t.hero.scrollCue}</span>
        <motion.span
          className="block h-8 w-px bg-gradient-to-b from-steel/60 to-transparent"
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 1, 0.3] }}
          style={{ originY: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.a>
    </section>
  )
}
