import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { pt, type Dictionary } from './pt'
import { en } from './en'
import { LanguageContext, type Lang } from './useI18n'

const dictionaries: Record<Lang, Dictionary> = { pt, en }

const STORAGE_KEY = 'lang'
const PARAM = 'lang'

/**
 * Resolution order: an explicit `?lang=` in the URL wins, then a previous
 * choice, then the browser. English is the fallback when nothing matches —
 * the site targets an international audience by default.
 */
function detectLang(): Lang {
  if (typeof window === 'undefined') return 'en'

  const param = new URLSearchParams(window.location.search).get(PARAM)
  if (param) {
    const normalised = param.toLowerCase()
    if (normalised.startsWith('pt')) return 'pt'
    if (normalised.startsWith('en')) return 'en'
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'pt' || stored === 'en') return stored

  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    window.localStorage.setItem(STORAGE_KEY, next)

    // Keep the URL shareable without adding a history entry per toggle.
    const url = new URL(window.location.href)
    url.searchParams.set(PARAM, next)
    window.history.replaceState({}, '', url)
  }, [])

  const toggle = useCallback(() => {
    setLang(lang === 'pt' ? 'en' : 'pt')
  }, [lang, setLang])

  // Screen readers and search engines both read these off the document, so
  // they have to follow the toggle rather than stay at their build-time value.
  useEffect(() => {
    const t = dictionaries[lang]
    document.documentElement.lang = t.meta.htmlLang
    document.title = t.meta.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t.meta.description)
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, t: dictionaries[lang], setLang, toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}
