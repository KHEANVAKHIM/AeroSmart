import { createContext, useContext, useEffect, useState } from 'react'

const CURRENCY_KEY = 'aerosmart_currency'

export const SUPPORTED_CURRENCIES = [
  {
    code: 'USD',
    symbol: '$',
    label: 'USD ($)',
    name: 'US Dollar',
    flag: '🇺🇸',
    rateFromUSD: 1, // Base
    locale: 'en-US',
  },
  {
    code: 'VND',
    symbol: '₫',
    label: 'VND (₫)',
    name: 'Vietnamese Đồng',
    flag: '🇻🇳',
    rateFromUSD: 25400,
    locale: 'vi-VN',
  },
  {
    code: 'KHR',
    symbol: '៛',
    label: 'KHR (៛)',
    name: 'Cambodian Riel',
    flag: '🇰🇭',
    rateFromUSD: 4100,
    locale: 'km-KH',
  },
]

const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }) {
  const [currencyCode, setCurrencyCode] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_KEY)
      if (saved && SUPPORTED_CURRENCIES.some((c) => c.code === saved)) {
        return saved
      }
    } catch {
      // ignore
    }
    return 'USD'
  })

  useEffect(() => {
    try {
      localStorage.setItem(CURRENCY_KEY, currencyCode)
    } catch {
      // ignore
    }
  }, [currencyCode])

  const currentCurrency =
    SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) || SUPPORTED_CURRENCIES[0]

  /**
   * Converts an amount from a given base currency (default 'USD' or 'VND')
   * into the currently selected currency, and returns a formatted string.
   */
  const formatPrice = (amount, baseCurrency = 'USD', options = {}) => {
    const numericAmount = Number(amount)
    if (!Number.isFinite(numericAmount) || numericAmount === 0) {
      if (currentCurrency.code === 'USD') return '$0'
      if (currentCurrency.code === 'VND') return '0 ₫'
      return '0 ៛'
    }

    // Convert from base currency to USD first
    let amountInUSD = numericAmount
    const base = SUPPORTED_CURRENCIES.find((c) => c.code === baseCurrency) || SUPPORTED_CURRENCIES[0]
    if (base.code !== 'USD') {
      amountInUSD = numericAmount / base.rateFromUSD
    }

    // Convert from USD to target selected currency
    const targetAmount = amountInUSD * currentCurrency.rateFromUSD

    if (currentCurrency.code === 'USD') {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: options.withDecimals ? 2 : 0,
        maximumFractionDigits: options.withDecimals ? 2 : 0,
      })
      return formatter.format(targetAmount)
    }

    if (currentCurrency.code === 'VND') {
      const formatter = new Intl.NumberFormat('vi-VN', {
        maximumFractionDigits: 0,
      })
      return `${formatter.format(Math.round(targetAmount))} ₫`
    }

    if (currentCurrency.code === 'KHR') {
      const formatter = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
      })
      return `${formatter.format(Math.round(targetAmount))} ៛`
    }

    return `${Math.round(targetAmount)} ${currentCurrency.symbol}`
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency: currentCurrency,
        currencyCode,
        setCurrency: setCurrencyCode,
        supportedCurrencies: SUPPORTED_CURRENCIES,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
