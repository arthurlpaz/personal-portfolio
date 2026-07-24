import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'

/**
 * Back-to-top affordance. Appears only once the hero is out of the way, so it
 * never competes with the first screen.
 */
export default function ScrollToTop() {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      setVisible(window.scrollY > window.innerHeight * 0.9)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={toTop}
          aria-label={t.common.backToTop}
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          className="glass glow-border fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center
            justify-center rounded-full text-ghost/60 transition-colors
            hover:border-teal/40 hover:text-teal"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
