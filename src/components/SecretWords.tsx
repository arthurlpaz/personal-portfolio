import { useEffect } from 'react'
import { toast } from 'sonner'
import { useSecretWords } from '@/hooks/useSecretWords'
import { useI18n } from '@/i18n/useI18n'

const EMAIL = 'arthurpcristovao@gmail.com'

// The typed trigger stays the same in both languages; only the reply is
// localised. `42` maps to `answer` because a key cannot start with a digit.
const words = ['sudo', 'claude', 'hire', 'train', '42']

/**
 * Words typed anywhere on the page. Discoverable through the console banner,
 * which points at the palette and the Konami code — one hint leads to the next.
 */
export default function SecretWords() {
  const { t } = useI18n()
  const { word, hits } = useSecretWords(words)

  useEffect(() => {
    if (hits === 0) return
    const key = word === '42' ? 'answer' : (word as 'sudo' | 'claude' | 'hire' | 'train')
    const res = t.secretWords[key]
    if (!res) return
    if (word === 'hire') navigator.clipboard?.writeText(EMAIL).catch(() => {})
    toast(res.title, { description: res.description, duration: 5000 })
    // `t` is intentionally out of the deps: the toast should fire on the typed
    // word, not again when the language changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word, hits])

  return null
}
