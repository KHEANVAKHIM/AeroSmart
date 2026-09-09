import { createContext, useContext, useEffect, useState } from 'react'

const THEME_KEY = 'aerosmart_theme'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY)
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme
      }
    } catch {
      // ignore
    }
    return 'light'
  })

  const applyTheme = (t) => {
    const root = document.documentElement
    const body = document.body
    if (t === 'dark') {
      root.classList.add('dark')
      body?.classList.add('dark')
    } else {
      root.classList.remove('dark')
      body?.classList.remove('dark')
    }
    try {
      localStorage.setItem(THEME_KEY, t)
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setTheme = (newTheme) => {
    applyTheme(newTheme)
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  const isDark = theme === 'dark'

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
