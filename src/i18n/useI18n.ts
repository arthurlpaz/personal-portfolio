import { createContext, useContext } from 'react'
import type { Dictionary } from './pt'

export type Lang = 'pt' | 'en'

export interface LanguageValue {
  lang: Lang
  t: Dictionary
  setLang: (lang: Lang) => void
  toggle: () => void
}

export const LanguageContext = createContext<LanguageValue | null>(null)

export function useI18n() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useI18n must be used inside a LanguageProvider')
  return ctx
}
