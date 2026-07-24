import { motion, useInView, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { useI18n } from '@/i18n/useI18n'

export default function Timeline() {
  const { t } = useI18n()
  // The first entry is the current role; everything else is history.
  const events = t.timeline.events.map((event, i) => ({ ...event, active: i === 0 }))
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  // The rail fills from the moment the track enters the viewport until its end
  // reaches the middle of the screen.
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 80%', 'end 55%'],
  })
  const lineProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <section id="timeline" className="py-32 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          className="font-mono text-xs text-steel tracking-widest uppercase mb-4 block"
        >
          {t.timeline.label}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="font-display text-3xl sm:text-4xl font-bold text-ghost mb-16"
        >
          {t.timeline.heading}
        </motion.h2>

        <div className="relative" ref={trackRef}>
          {/* Static rail + a progress line that draws itself as the section scrolls. */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-steel/8" />
          <motion.div
            style={{ scaleY: lineProgress, originY: 0 }}
            className="absolute left-0 md:left-8 top-0 bottom-0 w-px
              bg-gradient-to-b from-steel/50 via-teal/30 to-transparent"
            aria-hidden
          />

          <div className="space-y-12">
            {events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
                className="relative pl-8 md:pl-20"
              >
                <div className="absolute left-0 md:left-8 top-1.5 -translate-x-1/2">
                  <div className={`w-3 h-3 rounded-full border-2 ${
                    event.active
                      ? 'border-teal bg-teal/30 shadow-lg shadow-teal/30'
                      : 'border-steel/40 bg-void'
                  }`} />
                </div>

                <div className="glass glow-border lift rounded-xl p-6">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
                    <span className="font-mono text-xs text-steel">{event.period}</span>
                    {event.active && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-teal">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                        {t.timeline.current}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ghost">
                    {event.title}
                  </h3>
                  <p className="text-sm text-ghost/40 mb-4">{event.org}</p>
                  <ul className="space-y-2">
                    {event.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-ghost/50">
                        <span className="w-1 h-1 rounded-full bg-steel/40 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
