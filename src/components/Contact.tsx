import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import logo from '@/assets/arthur-logo-dark.svg'

const EMAIL = 'arthurpcristovao@gmail.com'

/** Copy-to-clipboard for the email, so nobody has to select it by hand. */
function CopyEmail() {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <button
      onClick={() => navigator.clipboard.writeText(EMAIL).then(() => setCopied(true))}
      aria-label={copied ? t.contact.copiedAria : t.contact.copyAria}
      className="ml-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 align-middle
        text-[11px] text-ghost/30 transition-colors hover:bg-steel/10 hover:text-teal
        active:scale-95"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? t.contact.copied : t.contact.copy}
    </button>
  )
}

const links = [
  {
    label: 'GitHub',
    href: 'https://github.com/arthurlpaz',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/arthurlpaz/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:arthurpcristovao@gmail.com',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" />
      </svg>
    ),
  },
]

export default function Contact() {
  const { t } = useI18n()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="contact" className="py-32 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="font-mono text-xs text-steel tracking-widest uppercase mb-4 block"
        >
          {t.contact.label}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="font-display text-3xl sm:text-5xl font-bold text-ghost mb-6"
        >
          {t.contact.headingPre}
          <span className="text-teal">{t.contact.headingEm}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.25 }}
          className="text-ghost/40 text-lg max-w-xl mx-auto mb-12"
        >
          {t.contact.intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35 }}
          className="flex justify-center gap-4 mb-16"
        >
          {links.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group lift flex items-center gap-2.5 px-5 py-3 glass glow-border rounded-xl
                text-ghost/50 hover:text-ghost"
            >
              <span className="text-ghost/30 group-hover:text-steel transition-colors">
                {icon}
              </span>
              <span className="text-sm font-medium">{label}</span>
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-8 sm:p-12 glow-border max-w-2xl mx-auto relative overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(70,130,180,0.06) 0%, transparent 60%)',
            }}
          />
          <div className="relative">
            <div className="font-mono text-xs text-steel/60 mb-4">$ whoami</div>
            <div className="font-mono text-sm text-ghost/60 text-left space-y-1.5">
              <p><span className="text-steel">{t.contact.whoami.name}</span>: Arthur Lincoln da Paz Cristovão</p>
              <p><span className="text-steel">{t.contact.whoami.role}</span>: {t.contact.whoami.roleValue}</p>
              <p><span className="text-steel">{t.contact.whoami.location}</span>: {t.contact.whoami.locationValue}</p>
              <p><span className="text-steel">{t.contact.whoami.field}</span>: {t.contact.whoami.fieldValue}</p>
              <p><span className="text-steel">{t.contact.whoami.focus}</span>: [LLM Apps, Agents, Medical AI, MLOps, Research]</p>
              <p><span className="text-steel">email</span>: {EMAIL}<CopyEmail /></p>
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="mt-32 border-t border-ghost/5 pt-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm text-ghost/25">
            <img src={logo} alt="" className="h-5 w-5 opacity-60" />
            <span className="font-display">Arthur</span>
          </span>
          <span className="font-mono text-xs text-ghost/15">
            {t.contact.footerNote}
          </span>
          <span className="font-mono text-xs text-ghost/15">
            © {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </section>
  )
}
