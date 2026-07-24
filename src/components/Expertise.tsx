import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  BrainCircuit,
  Boxes,
  Server,
  LineChart,
  FlaskConical,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/i18n/useI18n'
import type { Dictionary } from '@/i18n/pt'

type DomainId = keyof Dictionary['expertise']['domains']

interface Domain {
  id: DomainId
  title: string
  Icon: LucideIcon
  color: string
  description: string
  skills: string[]
}

/**
 * Presentation only — the icon and colour of each domain. Titles, descriptions
 * and skill lists live in the dictionaries, keyed by the same ids.
 *
 * Ordering rule for this whole page: most current / highest-signal first.
 * Domains are listed by how central they are to the profile today (LLMs and
 * agents lead), and the `skills` inside each card follow the same rule.
 *
 * Keep this list at exactly 6 entries: the grid is meant to read as two full
 * rows of three, with no gap on the last row.
 */
const domainStyles: { id: DomainId; Icon: LucideIcon; color: string }[] = [
  { id: 'llm', Icon: Sparkles, color: '#e879f9' },
  { id: 'ml', Icon: BrainCircuit, color: '#4682B4' },
  { id: 'mlops', Icon: Boxes, color: '#2dd4bf' },
  { id: 'backend', Icon: Server, color: '#a78bfa' },
  { id: 'research', Icon: FlaskConical, color: '#34d399' },
  { id: 'frontend', Icon: LineChart, color: '#fb923c' },
]

function DomainCard({ domain, index }: { domain: Domain; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const { Icon } = domain

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      {/*
        Glass surface like every other card on the page — the blur is what
        separates the text from the animated particle field behind it.
        `flex-col` + a growing description pins the badge row to the bottom, so
        cards in the same row share a baseline no matter how long the copy is.
      */}
      <div
        className="group glass glow-border lift lift-tinted relative flex h-full flex-col
          overflow-hidden rounded-xl p-6 pl-7"
        style={{ ['--pc' as string]: domain.color }}
      >
        <span
          className="absolute left-0 top-6 bottom-6 w-1 rounded-full transition-all duration-300 group-hover:top-4 group-hover:bottom-4"
          style={{ background: domain.color }}
          aria-hidden
        />
        <div className="mb-3 flex items-center gap-3">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors duration-300"
            style={{ background: `${domain.color}1a`, color: domain.color }}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </span>
          <h3 className="font-display text-lg font-semibold text-foreground">{domain.title}</h3>
        </div>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">
          {domain.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {domain.skills.map((skill, i) => (
            <Badge
              key={skill}
              variant="secondary"
              // The list is ordered by current relevance, so the first entry
              // carries the domain colour — the rule becomes visible instead of
              // living only in the source. No hover state: these are labels,
              // not controls.
              // The shadcn `secondary` variant ships a hover state; the hover
              // class is pinned to the resting value to cancel it.
              className={`border font-mono text-[11px] font-normal ${
                i === 0
                  ? ''
                  : 'border-transparent bg-secondary/50 text-muted-foreground hover:bg-secondary/50'
              }`}
              style={
                i === 0
                  ? {
                      background: `${domain.color}1f`,
                      color: domain.color,
                      borderColor: `${domain.color}40`,
                    }
                  : undefined
              }
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Expertise() {
  const { t } = useI18n()
  const domains: Domain[] = domainStyles.map(({ id, Icon, color }) => ({
    id,
    Icon,
    color,
    ...t.expertise.domains[id],
  }))
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="expertise" className="py-28 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            {t.expertise.heading}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">{t.expertise.subheading}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {domains.map((domain, i) => (
            <DomainCard key={domain.id} domain={domain} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
