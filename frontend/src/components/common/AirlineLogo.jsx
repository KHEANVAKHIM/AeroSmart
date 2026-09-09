import React from 'react'

export function getAirlineMeta(airlineName = '') {
  const name = airlineName.toLowerCase().trim()

  if (name.includes('vietnam airlines')) {
    return {
      name: 'Vietnam Airlines',
      code: 'VN',
      bgColor: 'bg-[#005574]',
      textColor: 'text-[#DCAE5B]',
      accentColor: '#DCAE5B',
      borderColor: 'border-[#005574]',
      badgeBg: 'bg-[#005574]/10 text-[#005574]',
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <rect width="40" height="40" rx="8" fill="#005574" />
          {/* Golden Lotus stylization */}
          <path d="M20 9C20 9 14 17 14 24C14 27.3 16.7 30 20 30C23.3 30 26 27.3 26 24C26 17 20 9 20 9Z" fill="#DCAE5B" opacity="0.9" />
          <path d="M20 14C20 14 16 20 16 24.5C16 26.7 17.8 28.5 20 28.5C22.2 28.5 24 26.7 24 24.5C24 20 20 14 20 14Z" fill="#F4D37A" />
          <path d="M11 20C11 20 14 26 18 27.5C16.5 25.5 15.5 23 15.5 20.5C15.5 18 11 20 11 20Z" fill="#DCAE5B" />
          <path d="M29 20C29 20 26 26 22 27.5C23.5 25.5 24.5 23 24.5 20.5C24.5 18 29 20 29 20Z" fill="#DCAE5B" />
        </svg>
      ),
    }
  }

  if (name.includes('vietjet')) {
    return {
      name: 'Vietjet Air',
      code: 'VJ',
      bgColor: 'bg-[#DA251C]',
      textColor: 'text-[#FFD100]',
      accentColor: '#DA251C',
      borderColor: 'border-[#DA251C]',
      badgeBg: 'bg-[#DA251C]/10 text-[#DA251C]',
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <rect width="40" height="40" rx="8" fill="#DA251C" />
          {/* Vietjet double yellow swoosh */}
          <path d="M8 26C16 26 24 20 32 12C28 17 20 22 10 23L8 26Z" fill="#FFD100" />
          <path d="M12 28C19 28 26 23 33 16C29 20 22 25 14 26L12 28Z" fill="#FFFFFF" />
          <text x="20" y="34" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="sans-serif">vietjet</text>
        </svg>
      ),
    }
  }

  if (name.includes('bamboo')) {
    return {
      name: 'Bamboo Airways',
      code: 'QH',
      bgColor: 'bg-[#006B3F]',
      textColor: 'text-white',
      accentColor: '#006B3F',
      borderColor: 'border-[#006B3F]',
      badgeBg: 'bg-[#006B3F]/10 text-[#006B3F]',
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <rect width="40" height="40" rx="8" fill="#0E2B4B" />
          {/* Bamboo leaf fan emblem */}
          <path d="M14 28C14 28 16 16 26 12C24 16 20 22 14 28Z" fill="#00AA4F" />
          <path d="M17 28C17 28 20 18 29 16C27 20 23 24 17 28Z" fill="#88D444" />
          <path d="M12 28C12 28 13 20 21 16C19 20 16 24 12 28Z" fill="#008037" />
        </svg>
      ),
    }
  }

  if (name.includes('singapore')) {
    return {
      name: 'Singapore Airlines',
      code: 'SQ',
      bgColor: 'bg-[#002244]',
      textColor: 'text-[#EAA11F]',
      accentColor: '#EAA11F',
      borderColor: 'border-[#002244]',
      badgeBg: 'bg-[#002244]/10 text-[#002244]',
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <rect width="40" height="40" rx="8" fill="#002244" />
          {/* KrisBird Gold Wing Icon */}
          <path d="M10 24C15 22 22 17 30 11C28 15 24 20 17 24L10 24Z" fill="#EAA11F" />
          <path d="M14 26C19 24 25 20 32 15C29 19 25 23 19 26L14 26Z" fill="#FAD172" />
          <path d="M18 28C22 27 27 24 33 20C30 23 26 26 21 28L18 28Z" fill="#EAA11F" />
          <circle cx="28" cy="11" r="1.5" fill="#FFFFFF" />
        </svg>
      ),
    }
  }

  if (name.includes('thai')) {
    return {
      name: 'Thai Airways',
      code: 'TG',
      bgColor: 'bg-[#2D1457]',
      textColor: 'text-[#E5007D]',
      accentColor: '#7A1C6A',
      borderColor: 'border-[#2D1457]',
      badgeBg: 'bg-[#2D1457]/10 text-[#2D1457]',
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <rect width="40" height="40" rx="8" fill="#2D1457" />
          {/* Thai Silk Orchid Motif */}
          <path d="M12 20C12 15 16 12 20 12C24 12 28 15 28 20C28 25 24 28 20 28C16 28 12 25 12 20Z" fill="#7A1C6A" />
          <path d="M16 20C16 16.5 18 14.5 20 14.5C22 14.5 24 16.5 24 20C24 23.5 22 25.5 20 25.5C18 25.5 16 23.5 16 20Z" fill="#E5007D" />
          <path d="M20 14.5L25 20L20 25.5L15 20Z" fill="#FFC72C" />
        </svg>
      ),
    }
  }

  if (name.includes('airasia')) {
    return {
      name: 'AirAsia',
      code: 'AK',
      bgColor: 'bg-[#ED1C24]',
      textColor: 'text-white',
      accentColor: '#ED1C24',
      borderColor: 'border-[#ED1C24]',
      badgeBg: 'bg-[#ED1C24]/10 text-[#ED1C24]',
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <rect width="40" height="40" rx="8" fill="#ED1C24" />
          <circle cx="20" cy="20" r="14" fill="#ED1C24" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="20" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">air</text>
        </svg>
      ),
    }
  }

  if (name.includes('scoot')) {
    return {
      name: 'Scoot',
      code: 'TR',
      bgColor: 'bg-[#FFDE00]',
      textColor: 'text-black',
      accentColor: '#FFDE00',
      borderColor: 'border-[#FFDE00]',
      badgeBg: 'bg-[#FFDE00]/20 text-slate-900',
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <rect width="40" height="40" rx="8" fill="#FFDE00" />
          <circle cx="20" cy="20" r="13" fill="#111111" />
          <text x="20" y="24" textAnchor="middle" fill="#FFDE00" fontSize="8" fontWeight="bold" fontFamily="sans-serif">scoot</text>
        </svg>
      ),
    }
  }

  if (name.includes('vietravel')) {
    return {
      name: 'Vietravel Airlines',
      code: 'VU',
      bgColor: 'bg-[#00458C]',
      textColor: 'text-[#FFCC00]',
      accentColor: '#FFCC00',
      borderColor: 'border-[#00458C]',
      badgeBg: 'bg-[#00458C]/10 text-[#00458C]',
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <rect width="40" height="40" rx="8" fill="#00458C" />
          <path d="M10 22C16 16 26 14 30 18C24 20 18 24 10 22Z" fill="#FFCC00" />
          <circle cx="27" cy="16" r="3" fill="#FFCC00" />
        </svg>
      ),
    }
  }

  if (name.includes('cambodia') || name.includes('angkor')) {
    return {
      name: 'Cambodia Angkor Air',
      code: 'K6',
      bgColor: 'bg-[#5C068C]',
      textColor: 'text-[#F1A93B]',
      accentColor: '#5C068C',
      borderColor: 'border-[#5C068C]',
      badgeBg: 'bg-[#5C068C]/10 text-[#5C068C]',
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <rect width="40" height="40" rx="8" fill="#5C068C" />
          {/* Angkor Wat stylized towers */}
          <path d="M12 28V20L15 17L18 20V28H12Z" fill="#F1A93B" />
          <path d="M17 28V16L20 12L23 16V28H17Z" fill="#FFD100" />
          <path d="M22 28V20L25 17L28 20V28H22Z" fill="#F1A93B" />
        </svg>
      ),
    }
  }

  if (name.includes('japan airlines') || name.includes('jal')) {
    return {
      name: 'Japan Airlines',
      code: 'JL',
      bgColor: 'bg-[#CC0000]',
      textColor: 'text-white',
      accentColor: '#CC0000',
      borderColor: 'border-[#CC0000]',
      badgeBg: 'bg-[#CC0000]/10 text-[#CC0000]',
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <rect width="40" height="40" rx="8" fill="#FFFFFF" stroke="#E5E7EB" />
          <circle cx="20" cy="20" r="14" fill="#CC0000" />
          <path d="M13 22C16 18 24 15 28 17C24 20 18 24 13 22Z" fill="#FFFFFF" />
        </svg>
      ),
    }
  }

  if (name.includes('korean air') || name.includes('korean')) {
    return {
      name: 'Korean Air',
      code: 'KE',
      bgColor: 'bg-[#00256C]',
      textColor: 'text-[#0086D6]',
      accentColor: '#0086D6',
      borderColor: 'border-[#00256C]',
      badgeBg: 'bg-[#00256C]/10 text-[#00256C]',
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <rect width="40" height="40" rx="8" fill="#00256C" />
          {/* Taegeuk Yin-Yang swirl */}
          <circle cx="20" cy="20" r="11" fill="#C60C30" />
          <path d="M20 9C26 9 31 14 31 20C31 26 26 31 20 31C14 31 9 26 9 20C9 14 14 9 20 9Z" fill="#0086D6" />
          <path d="M20 9C15 9 11 13 11 17.5C11 22 20 22 20 26.5C20 31 24.5 31 29 27C27 16 23 9 20 9Z" fill="#C60C30" />
        </svg>
      ),
    }
  }

  if (name.includes('air france')) {
    return {
      name: 'Air France',
      code: 'AF',
      bgColor: 'bg-[#002157]',
      textColor: 'text-[#ED0000]',
      accentColor: '#ED0000',
      borderColor: 'border-[#002157]',
      badgeBg: 'bg-[#002157]/10 text-[#002157]',
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <rect width="40" height="40" rx="8" fill="#002157" />
          <path d="M8 20L32 12L24 28L18 22L8 20Z" fill="#FFFFFF" />
          <path d="M28 10L32 12L28 16Z" fill="#ED0000" />
        </svg>
      ),
    }
  }

  if (name.includes('british airways') || name.includes('british')) {
    return {
      name: 'British Airways',
      code: 'BA',
      bgColor: 'bg-[#075AAA]',
      textColor: 'text-[#EB2226]',
      accentColor: '#EB2226',
      borderColor: 'border-[#075AAA]',
      badgeBg: 'bg-[#075AAA]/10 text-[#075AAA]',
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <rect width="40" height="40" rx="8" fill="#075AAA" />
          {/* Speedmarque ribbon */}
          <path d="M8 26C16 24 26 18 32 12C28 16 18 24 8 26Z" fill="#EB2226" />
          <path d="M12 28C20 26 28 20 34 15C30 18 22 26 12 28Z" fill="#FFFFFF" />
        </svg>
      ),
    }
  }

  if (name.includes('emirates')) {
    return {
      name: 'Emirates',
      code: 'EK',
      bgColor: 'bg-[#D71921]',
      textColor: 'text-white',
      accentColor: '#D71921',
      borderColor: 'border-[#D71921]',
      badgeBg: 'bg-[#D71921]/10 text-[#D71921]',
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <rect width="40" height="40" rx="8" fill="#D71921" />
          <text x="20" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="serif">Emirates</text>
        </svg>
      ),
    }
  }

  if (name.includes('cathay')) {
    return {
      name: 'Cathay Pacific',
      code: 'CX',
      bgColor: 'bg-[#006564]',
      textColor: 'text-white',
      accentColor: '#006564',
      borderColor: 'border-[#006564]',
      badgeBg: 'bg-[#006564]/10 text-[#006564]',
      icon: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <circle cx="20" cy="20" r="20" fill="#006564" />
          <path d="M10 24C16 20 25 14 32 16C26 18 18 22 10 24Z" fill="#FFFFFF" />
          <path d="M14 26C19 23 26 18 31 20C26 22 20 24 14 26Z" fill="#C0392B" />
        </svg>
      ),
    }
  }

  // Default AeroSmart brand
  return {
    name: airlineName || 'AeroSmart Airways',
    code: 'AS',
    bgColor: 'bg-[#003580]',
    textColor: 'text-[#006ce4]',
    accentColor: '#006ce4',
    borderColor: 'border-[#003580]',
    badgeBg: 'bg-[#003580]/10 text-[#003580]',
    icon: (
      <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
        <circle cx="20" cy="20" r="20" fill="#003580" />
        <path d="M12 24L28 14M28 14L23 26M28 14L16 17" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  }
}

export default function AirlineLogo({ airline, size = 'md', isCircle = true, className = '' }) {
  const meta = getAirlineMeta(airline)

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  }

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 overflow-hidden ${
        isCircle ? 'rounded-full' : 'rounded-lg'
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title={meta.name}
    >
      {meta.icon}
    </div>
  )
}
