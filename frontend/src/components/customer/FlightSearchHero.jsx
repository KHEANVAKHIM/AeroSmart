import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plane, ArrowLeftRight, Calendar, Users, Search, Sparkles } from 'lucide-react'
import { flightApi } from '../../api/client'
import { useBooking } from '../../context/BookingContext'
import { useLanguage } from '../../context/LanguageContext'
import { todayInputValue } from '../../utils/format'

const DEFAULT_AIRPORTS = [
  // National / Domestic Vietnam
  { code: 'HAN', name: 'Noi Bai Int\'l', city: 'Hanoi', country: 'Vietnam' },
  { code: 'SGN', name: 'Tan Son Nhat Int\'l', city: 'Ho Chi Minh City', country: 'Vietnam' },
  { code: 'DAD', name: 'Da Nang Int\'l', city: 'Da Nang', country: 'Vietnam' },
  { code: 'PQC', name: 'Phu Quoc Int\'l', city: 'Phu Quoc', country: 'Vietnam' },
  { code: 'CXR', name: 'Cam Ranh Int\'l', city: 'Nha Trang', country: 'Vietnam' },
  { code: 'DLI', name: 'Lien Khuong', city: 'Da Lat', country: 'Vietnam' },
  { code: 'HPH', name: 'Cat Bi Int\'l', city: 'Hai Phong', country: 'Vietnam' },
  { code: 'HUI', name: 'Phu Bai Int\'l', city: 'Hue', country: 'Vietnam' },
  // International Hubs
  { code: 'SAI', name: 'Siem Reap Angkor Int\'l', city: 'Siem Reap', country: 'Cambodia' },
  { code: 'PNH', name: 'Phnom Penh Int\'l', city: 'Phnom Penh', country: 'Cambodia' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
  { code: 'NRT', name: 'Narita Int\'l', city: 'Tokyo', country: 'Japan' },
  { code: 'ICN', name: 'Incheon Int\'l', city: 'Seoul', country: 'South Korea' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
]

export default function FlightSearchHero({ initialCompact = false }) {
  const navigate = useNavigate()
  const { searchCriteria, updateSearchCriteria } = useBooking()
  const { t } = useLanguage()

  const [airports, setAirports] = useState(DEFAULT_AIRPORTS)
  const [tripType, setTripType] = useState(searchCriteria.tripType || 'ONE_WAY')
  const [origin, setOrigin] = useState(searchCriteria.origin || 'HAN')
  const [destination, setDestination] = useState(searchCriteria.destination || 'SGN')
  const [departureDate, setDepartureDate] = useState(searchCriteria.departureDate || todayInputValue())
  const [returnDate, setReturnDate] = useState(searchCriteria.returnDate || '')
  const [passengers, setPassengers] = useState(searchCriteria.passengers || 1)

  useEffect(() => {
    flightApi
      .listAirports()
      .then((data) => {
        if (data && data.length > 0) setAirports(data)
      })
      .catch(() => {})
  }, [])

  const handleSwapAirports = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
  }

  const handleSearch = (e) => {
    e?.preventDefault()
    updateSearchCriteria({
      origin,
      destination,
      departureDate,
      returnDate: tripType === 'ROUND_TRIP' ? returnDate : '',
      passengers,
      tripType,
    })
    navigate(
      `/flights?origin=${origin}&destination=${destination}&departureDate=${departureDate}&passengers=${passengers}&tripType=${tripType}`
    )
  }

  return (
    <div className={`w-full ${initialCompact ? 'py-4' : 'py-8 md:py-16'}`}>
      <div className="mx-auto max-w-6xl">
        {!initialCompact && (
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-semibold text-cyan-800 dark:border-cyan-500/30 dark:bg-cyan-950/60 dark:text-cyan-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" />
              <span>Smart Booking, Seamless Journey · Powered by AeroSmart</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-navy-950 dark:text-white">
              {t('home.heroTitle')}
            </h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-300">
              {t('home.heroSubtitle')}
            </p>
          </div>
        )}

        {/* Flight Search Card */}
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur-xl md:p-8 text-navy-950 dark:border-navy-800 dark:bg-navy-900/95 dark:text-white transition-colors">
          {/* Trip Type Tabs */}
          <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-navy-800 pb-4">
            <button
              type="button"
              onClick={() => setTripType('ONE_WAY')}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                tripType === 'ONE_WAY'
                  ? 'bg-[#003580] text-white shadow-sm dark:bg-[#006ce4]'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800'
              }`}
            >
              {t('search.oneWay')}
            </button>
            <button
              type="button"
              onClick={() => setTripType('ROUND_TRIP')}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                tripType === 'ROUND_TRIP'
                  ? 'bg-[#003580] text-white shadow-sm dark:bg-[#006ce4]'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800'
              }`}
            >
              {t('search.roundTrip')}
            </button>
          </div>

          {/* Search Inputs Grid */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* Origin */}
            <div className="md:col-span-3">
              <label className="label text-slate-700">{t('search.from')}</label>
              <div className="relative">
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="input font-semibold text-slate-900 cursor-pointer"
                >
                  {airports.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.city} ({a.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="hidden md:flex md:col-span-1 items-end justify-center pb-2">
              <button
                type="button"
                onClick={handleSwapAirports}
                className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-600 hover:border-[#006ce4] hover:bg-[#ebf3ff] hover:text-[#003580] transition-all shadow-sm"
                title="Swap"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>
            </div>

            {/* Destination */}
            <div className="md:col-span-3">
              <label className="label text-slate-700">{t('search.to')}</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="input font-semibold text-slate-900 cursor-pointer"
              >
                {airports.map((a) => (
                  <option key={a.code} value={a.code} disabled={a.code === origin}>
                    {a.city} ({a.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Departure Date */}
            <div className={tripType === 'ROUND_TRIP' ? 'md:col-span-2' : 'md:col-span-3'}>
              <label className="label text-slate-700">{t('search.departureDate')}</label>
              <div className="relative">
                <input
                  type="date"
                  value={departureDate}
                  min={todayInputValue()}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="input font-medium"
                  required
                />
              </div>
            </div>

            {/* Return Date (if Round-trip) */}
            {tripType === 'ROUND_TRIP' && (
              <div className="md:col-span-2">
                <label className="label text-slate-700">{t('search.returnDate')}</label>
                <input
                  type="date"
                  value={returnDate}
                  min={departureDate || todayInputValue()}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="input font-medium"
                />
              </div>
            )}

            {/* Passengers & Submit */}
            <div className={tripType === 'ROUND_TRIP' ? 'md:col-span-1' : 'md:col-span-2'}>
              <label className="label text-slate-700">{t('search.passengers')}</label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="input font-semibold"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? t('search.guest') : t('search.guests')}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-12 mt-2">
              <button
                type="submit"
                className="w-full btn-yellow py-3.5 text-base font-black shadow-md flex items-center justify-center gap-2"
              >
                <Search className="h-5 w-5" />
                <span>{t('search.searchButton')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
