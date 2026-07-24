import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useI18n } from '@/i18n/useI18n'

/** `?` opens the shortcut sheet. Without it, none of the rest is findable. */
export default function ShortcutsDialog() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return
      if (e.key === '?') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const shortcuts = [
    { keys: ['⌘', 'K'], label: t.shortcuts.openPalette },
    { keys: ['?'], label: t.shortcuts.showShortcuts },
    { keys: ['Esc'], label: t.shortcuts.close },
  ]

  const secrets = [
    { hint: '↑↑↓↓←→←→ B A', label: t.shortcuts.secrets.konami },
    { hint: t.shortcuts.secrets.wordsHint, label: t.shortcuts.secrets.words },
    { hint: t.shortcuts.secrets.doubleClickHint, label: t.shortcuts.secrets.doubleClick },
    { hint: t.shortcuts.secrets.idleHint, label: t.shortcuts.secrets.idle },
    { hint: 'arthur.help()', label: t.shortcuts.secrets.console },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{t.shortcuts.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {shortcuts.map(({ keys, label }) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="flex gap-1">
                {keys.map((k) => (
                  <kbd
                    key={k}
                    className="rounded border border-border/60 bg-secondary/40 px-1.5 py-0.5 font-mono text-[11px]"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-2 border-t border-border/50 pt-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-steel">
            {t.shortcuts.hiddenAround}
          </p>
          <div className="space-y-2">
            {secrets.map(({ hint, label }) => (
              <div key={hint} className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-xs text-teal">{hint}</span>
                <span className="text-right text-xs text-muted-foreground/70">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
