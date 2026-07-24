import { useEffect } from 'react'
import { toast } from 'sonner'
import { useKonami } from '@/hooks/useKonami'
import { useI18n } from '@/i18n/useI18n'

/**
 * Acknowledges the Konami code. The visual payoff lives in AIMotifs (the field
 * lights up and the training run converges); this just tells the visitor that
 * what they did was intentional and not a glitch.
 */
export default function KonamiToast() {
  const { t } = useI18n()
  const hits = useKonami()

  useEffect(() => {
    if (hits === 0) return
    toast(t.secretWords.konami.title, {
      description: t.secretWords.konami.description,
      duration: 6000,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hits])

  return null
}
