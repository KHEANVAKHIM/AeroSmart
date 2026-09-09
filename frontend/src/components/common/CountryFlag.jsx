import React, { useState } from 'react'

export default function CountryFlag({ countryCode = 'us', size = 'md', className = '' }) {
  const [hasError, setHasError] = useState(false)
  const code = (countryCode || 'us').toLowerCase().trim()

  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  }

  // Real SVG Circular Flags from CDN or FlagCDN
  const flagUrl = `https://hatscripts.github.io/circle-flags/flags/${code}.svg`
  const fallbackUrl = `https://flagcdn.com/w40/${code}.png`

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden shadow-sm border border-slate-200/60 bg-slate-100 ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      {!hasError ? (
        <img
          src={flagUrl}
          alt={code.toUpperCase()}
          onError={(e) => {
            if (e.target.src !== fallbackUrl) {
              e.target.src = fallbackUrl
            } else {
              setHasError(true)
            }
          }}
          className="w-full h-full object-cover rounded-full select-none pointer-events-none"
          loading="lazy"
        />
      ) : (
        <span className="text-[10px] font-bold uppercase text-slate-600">
          {code.slice(0, 2)}
        </span>
      )}
    </div>
  )
}
