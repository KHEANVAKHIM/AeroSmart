import { createContext, useContext, useEffect, useState } from 'react'
import { SUPPORTED_LANGUAGES, translations } from '../i18n/translations'

const LANG_KEY = 'aerosmart_lang'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [langCode, setLangCode] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY)
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved
      }
      // Check browser language
      const navLang = navigator.language?.slice(0, 2)?.toLowerCase()
      if (navLang === 'vi' || navLang === 'km') {
        return navLang
      }
    } catch {
      // ignore
    }
    return 'en'
  })

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, langCode)
      document.documentElement.lang = langCode
    } catch {
      // ignore
    }
  }, [langCode])

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === langCode) || SUPPORTED_LANGUAGES[0]

  /**
   * Helper to retrieve nested translation string e.g. t('nav.flights')
   */
  const t = (path, fallback = '') => {
    const dict = translations[langCode] || translations.en
    const parts = path.split('.')
    let current = dict

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part]
      } else {
        // Fallback to English
        let enCurrent = translations.en
        for (const enPart of parts) {
          if (enCurrent && typeof enCurrent === 'object' && enPart in enCurrent) {
            enCurrent = enCurrent[enPart]
          } else {
            return fallback || path
          }
        }
        return enCurrent || fallback || path
      }
    }

    return typeof current === 'string' ? current : fallback || path
  }

  return (
    <LanguageContext.Provider
      value={{
        language: currentLanguage,
        langCode,
        setLanguage: setLangCode,
        supportedLanguages: SUPPORTED_LANGUAGES,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
