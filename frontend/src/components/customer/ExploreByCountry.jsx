import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CountryFlag from '../common/CountryFlag'
import { destinationsApi } from '../../api/client'
import { useBooking } from '../../context/BookingContext'
import { useLanguage } from '../../context/LanguageContext'
import { todayInputValue } from '../../utils/format'

const DEFAULT_COUNTRIES = [
  {
    id: 1,
    countryCode: 'kh',
    nameEn: 'Cambodia',
    nameVi: 'Campuchia',
    nameKm: 'កម្ពុជា',
    targetDestination: 'SAI',
    imageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 2,
    countryCode: 'gb',
    nameEn: 'United Kingdom',
    nameVi: 'Vương Quốc Anh',
    nameKm: 'ចក្រភពអង់គ្លេស',
    targetDestination: 'LHR',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 3,
    countryCode: 'fr',
    nameEn: 'France',
    nameVi: 'Pháp',
    nameKm: 'បារាំង',
    targetDestination: 'CDG',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 4,
    countryCode: 'sg',
    nameEn: 'Singapore',
    nameVi: 'Singapore',
    nameKm: 'សិង្ហបុរី',
    targetDestination: 'SIN',
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 5,
    countryCode: 'vn',
    nameEn: 'Vietnam',
    nameVi: 'Việt Nam',
    nameKm: 'វៀតណាម',
    targetDestination: 'DAD',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 6,
    countryCode: 'th',
    nameEn: 'Thailand',
    nameVi: 'Thái Lan',
    nameKm: 'ថៃ',
    targetDestination: 'BKK',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 7,
    countryCode: 'jp',
    nameEn: 'Japan',
    nameVi: 'Nhật Bản',
    nameKm: 'ជប៉ុន',
    targetDestination: 'NRT',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 8,
    countryCode: 'kr',
    nameEn: 'South Korea',
    nameVi: 'Hàn Quốc',
    nameKm: 'កូរ៉េខាងត្បូង',
    targetDestination: 'ICN',
    imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=700&q=80',
  },
]

export default function ExploreByCountry() {
  const scrollRef = useRef(null)
  const navigate = useNavigate()
  const { updateSearchCriteria } = useBooking()
  const { t, language } = useLanguage()
  const [countries, setCountries] = useState(DEFAULT_COUNTRIES)

  useEffect(() => {
    destinationsApi
      .listCountries()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCountries(data)
        }
      })
      .catch((err) => {
        console.warn('Could not fetch country spotlights from server, using defaults:', err)
      })
  }, [])

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleSelectCountry = (country) => {
    const destination = country.targetDestination || 'HAN'
    updateSearchCriteria({
      destination,
      departureDate: todayInputValue(),
      passengers: 1,
      tripType: 'ONE_WAY',
    })
    navigate(`/flights?destination=${destination}&departureDate=${todayInputValue()}&passengers=1`)
  }

  const getCountryName = (country) => {
    if (language === 'vi') return country.nameVi || country.nameEn
    if (language === 'km') return country.nameKm || country.nameEn
    return country.nameEn || country.nameVi || 'Destination'
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {t('home.exploreByCountryTitle')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('home.exploreByCountrySubtitle')}
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-200 shadow-xl border border-slate-200 dark:border-navy-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-50 hover:scale-105"
          aria-label="Previous countries"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-200 shadow-xl border border-slate-200 dark:border-navy-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-50 hover:scale-105"
          aria-label="Next countries"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-4 pt-1 snap-x scroll-smooth"
        >
          {countries.map((country) => (
            <div
              key={country.id || country.countryCode}
              onClick={() => handleSelectCountry(country)}
              className="w-[240px] sm:w-[270px] shrink-0 snap-start cursor-pointer group/card relative rounded-2xl overflow-hidden shadow-md border border-slate-200/80 dark:border-navy-800 bg-slate-900 aspect-[4/5]"
            >
              {/* Country Background Photo */}
              <img
                src={country.imageUrl || country.image}
                alt={getCountryName(country)}
                loading="lazy"
                className="h-full w-full object-cover group-hover/card:scale-108 transition-transform duration-500 ease-out"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Bottom Label with Flag & Name */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2.5 z-10">
                <CountryFlag countryCode={country.countryCode} size="md" className="shadow-md shrink-0" />
                <span className="font-bold text-base text-white truncate drop-shadow-sm group-hover/card:text-sky-300 transition-colors">
                  {getCountryName(country)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
