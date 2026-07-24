import { useEffect, useState } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  ArrowUpRight,
  Briefcase,
  Check,
  Copy,
  FolderGit2,
  Home,
  Mail,
  Route,
  Sparkles,
  User,
} from 'lucide-react'

import { useI18n } from '@/i18n/useI18n'

const EMAIL = 'arthurpcristovao@gmail.com'

const sectionIcons = [
  { key: 'home', href: '#conteudo', Icon: Home },
  { key: 'about', href: '#about', Icon: User },
  { key: 'expertise', href: '#expertise', Icon: Sparkles },
  { key: 'projects', href: '#projects', Icon: FolderGit2 },
  { key: 'timeline', href: '#timeline', Icon: Route },
  { key: 'contact', href: '#contact', Icon: Mail },
] as const

const links = [
  { label: 'GitHub', href: 'https://github.com/arthurlpaz', Icon: FolderGit2 },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arthurlpaz/', Icon: Briefcase },
]

/**
 * Cmd/Ctrl+K palette. A technical visitor reaches for this by reflex, so the
 * cost of not having it is higher than it looks.
 */
export default function CommandPalette() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(t)
  }, [copied])

  // Close first, then act: the dialog restores focus on close, which would
  // otherwise fight the scroll or steal focus back from the new tab.
  const run = (action: () => void) => {
    setOpen(false)
    requestAnimationFrame(action)
  }

  const sections = sectionIcons.map(({ key, href, Icon }) => ({
    label: t.nav[key],
    href,
    Icon,
  }))

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t.palette.placeholder} />
      <CommandList>
        <CommandEmpty>{t.palette.empty}</CommandEmpty>

        <CommandGroup heading={t.palette.goTo}>
          {sections.map(({ label, href, Icon }) => (
            <CommandItem
              key={href}
              value={`${t.palette.goTo} ${label}`}
              onSelect={() =>
                run(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }))
              }
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t.palette.links}>
          {links.map(({ label, href, Icon }) => (
            <CommandItem
              key={href}
              value={label}
              onSelect={() => run(() => window.open(href, '_blank', 'noopener,noreferrer'))}
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-40" />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t.palette.actions}>
          <CommandItem
            value={t.palette.copyEmail}
            onSelect={() => {
              navigator.clipboard.writeText(EMAIL).then(() => setCopied(true))
              setOpen(false)
            }}
          >
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {t.palette.copyEmail}
            <span className="ml-auto font-mono text-xs opacity-40">{EMAIL}</span>
          </CommandItem>
          <CommandItem
            value={t.palette.sendEmail}
            onSelect={() => run(() => { window.location.href = `mailto:${EMAIL}` })}
          >
            <Mail className="mr-2 h-4 w-4" />
            {t.palette.sendEmail}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
