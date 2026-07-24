import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useI18n } from '@/i18n/useI18n'

// Colours stay here; the labels come from the dictionary, matched by index.
const statColors = ['#e879f9', '#4682B4', '#2dd4bf', '#8bb8e0']

export default function About() {
  const { t } = useI18n()
  const stats = t.about.stats.map((stat, i) => ({ ...stat, color: statColors[i] }))
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="relative py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-3">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-mono text-xs text-steel tracking-widest uppercase mb-4 block"
            >
              {t.about.label}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="font-display text-3xl sm:text-4xl font-bold text-ghost mb-8 leading-tight"
            >
              {t.about.headingPre}
              <span className="text-azure">{t.about.headingEm1}</span>
              {t.about.headingMid}
              <span className="text-teal">{t.about.headingEm2}</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="space-y-5 text-ghost/50 leading-relaxed"
            >
              {t.about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
              <p>
                {t.about.closingPre}
                <span className="text-azure">{t.about.closingEm}</span>
                {t.about.closingPost}
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            {/* About stat style: minimal, boxless — left color tick + big colored number */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-9">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="relative pl-4"
                >
                  <span
                    className="absolute left-0 top-1.5 h-8 w-0.5 rounded-full"
                    style={{ background: stat.color }}
                    aria-hidden
                  />
                  <div className="font-display text-3xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm font-medium text-ghost/70">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
