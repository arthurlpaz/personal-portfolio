import { useEffect, useRef, useState } from 'react'

interface Match {
  word: string
  /** Increments on every match so repeats re-trigger effects. */
  hits: number
}

/**
 * Watches for words typed anywhere on the page. Keeps a rolling buffer instead
 * of an index per word, so overlapping words all resolve from one pass.
 */
export function useSecretWords(words: string[]): Match {
  const [match, setMatch] = useState<Match>({ word: '', hits: 0 })
  const wordsRef = useRef(words)
  wordsRef.current = words

  useEffect(() => {
    const longest = Math.max(...wordsRef.current.map((w) => w.length))
    let buffer = ''

    const onKey = (e: KeyboardEvent) => {
      // Never swallow input the visitor meant for a field.
      const el = document.activeElement
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key.length !== 1) return

      buffer = (buffer + e.key.toLowerCase()).slice(-longest)
      const found = wordsRef.current.find((w) => buffer.endsWith(w))
      if (found) {
        buffer = ''
        setMatch((m) => ({ word: found, hits: m.hits + 1 }))
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return match
}
