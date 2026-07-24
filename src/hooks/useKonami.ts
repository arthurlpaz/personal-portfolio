import { useEffect, useState } from 'react'

const SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

/**
 * Konami code detector. Returns a counter rather than a boolean so the effect
 * can be re-triggered every time the sequence is entered again.
 */
export function useKonami() {
  const [hits, setHits] = useState(0)

  useEffect(() => {
    let index = 0
    const onKey = (e: KeyboardEvent) => {
      // Ignore while typing — the palette input would otherwise eat the arrows.
      const el = document.activeElement
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return

      const expected = SEQUENCE[index]
      const key = expected.length === 1 ? e.key.toLowerCase() : e.key

      if (key === expected) {
        index += 1
        if (index === SEQUENCE.length) {
          index = 0
          setHits((h) => h + 1)
        }
      } else {
        // Restart, but allow the failed key to open a fresh attempt.
        index = key === SEQUENCE[0] ? 1 : 0
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return hits
}
