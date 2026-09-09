import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Plane,
  Filter,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
  Clock,
  Sparkles,
} from 'lucide-react'
import { flightApi } from '../api/client'
import FlightCard from '../components/customer/FlightCard'
import FlightSearchHero from '../components/customer/FlightSearchHero'
import AirlineLogo from '../components/common/AirlineLogo'
import { SORT_OPTIONS, DEPARTURE_BUCKETS } from '../utils/constants'
import { formatVND } from '../utils/format'
import { useLanguage } from '../context/LanguageContext'

export default function FlightSearchPage() {
  const [searchParams] = useSearchParams()
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const { t, langCode } = useLanguage()

  // Filters
  const [selectedAirlines, setSelectedAirlines] = useState([])
  const [maxStops, setMaxStops] = useState(null)
  const [selectedBucket, setSelectedBucket] = useState(null)
  const [sortBy, setSortBy] = useState('PRICE_ASC')

  const origin = searchParams.get('origin') || 'HAN'
  const destination = searchParams.get('destination') || 'SGN'
  const departureDate = searchParams.get('departureDate') || ''
  const passengers = searchParams.get('passengers') || 1

  useEffect(() => {
    setLoading(true)
    flightApi
      .search({
        origin,
        destination,
        departureDate,
        passengers,
        sortBy,
      })
      .then((data) => {
        setFlights(data || [])
      })
      .catch((err) => {
        console.error('Flight search error:', err)
        setFlights([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [origin, destination, departureDate, passengers, sortBy])

  // Extract unique airlines from returned flights
  const availableAirlines = Array.from(new Set(flights.map((f) => f.airline).filter(Boolean)))

  // Apply client-side filters
  const filteredFlights = flights.filter((f) => {
    if (selectedAirlines.length > 0 && !selectedAirlines.includes(f.airline)) {
      return false
    }
    if (maxStops !== null && f.stops > maxStops) {
      return false
    }
    if (selectedBucket) {
      const depHour = new Date(f.departureTime).getHours()
      const bucket = DEPARTURE_BUCKETS.find((b) => b.id === selectedBucket)
      if (bucket) {
        if (bucket.from < bucket.to) {
          if (depHour < bucket.from || depHour >= bucket.to) return false
        } else {
          // Wrap around (e.g. night 23 - 5)
          if (depHour < bucket.from && depHour >= bucket.to) return false
        }
      }
    }
    return true
  })

  const resetFilters = () => {
    setSelectedAirlines([])
    setMaxStops(null)
    setSelectedBucket(null)
    setSortBy('PRICE_ASC')
  }

  const getSortOptionLabel = (id) => {
    switch (id) {
      case 'PRICE_ASC':
        return t('flights.priceLowest')
      case 'PRICE_DESC':
        return t('flights.priceHighest')
      case 'DURATION_ASC':
        return t('flights.durationShortest')
      case 'DEP_TIME_ASC':
        return t('flights.departureEarliest')
      default:
        return id
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Top Search Bar */}
      <div className="border-b border-slate-200 bg-white py-4 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FlightSearchHero initialCompact={true} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-900">{t('flights.filters')}</span>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-semibold text-[#006ce4] hover:underline"
                >
                  {t('flights.reset')}
                </button>
              </div>

              {/* Stops Filter with counts and prices */}
              <div className="py-4 border-b border-slate-100 space-y-3">
                <h4 className="font-bold text-xs text-slate-900">{t('flights.stops')}</h4>
                <label className="flex items-start justify-between text-xs text-slate-800 cursor-pointer group">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="stopsFilter"
                      checked={maxStops === null}
                      onChange={() => setMaxStops(null)}
                      className="mt-0.5 text-[#006ce4] focus:ring-[#006ce4]"
                    />
                    <div>
                      <span className="font-medium">{t('flights.any')}</span>
                      <p className="text-[11px] text-slate-500">From VND 890,000</p>
                    </div>
                  </div>
                  <span className="text-slate-500 text-xs">{flights.length}</span>
                </label>

                <label className="flex items-start justify-between text-xs text-slate-800 cursor-pointer group">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="stopsFilter"
                      checked={maxStops === 0}
                      onChange={() => setMaxStops(0)}
                      className="mt-0.5 text-[#006ce4] focus:ring-[#006ce4]"
                    />
                    <div>
                      <span className="font-medium">{t('flights.directOnly')}</span>
                      <p className="text-[11px] text-slate-500">From VND 890,000</p>
                    </div>
                  </div>
                  <span className="text-slate-500 text-xs">
                    {flights.filter((f) => f.stops === 0).length}
                  </span>
                </label>

                <label className="flex items-start justify-between text-xs text-slate-800 cursor-pointer group">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="stopsFilter"
                      checked={maxStops === 1}
                      onChange={() => setMaxStops(1)}
                      className="mt-0.5 text-[#006ce4] focus:ring-[#006ce4]"
                    />
                    <div>
                      <span className="font-medium">{t('flights.oneStopMax')}</span>
                      <p className="text-[11px] text-slate-500">From VND 1,650,000</p>
                    </div>
                  </div>
                  <span className="text-slate-500 text-xs">
                    {flights.filter((f) => f.stops <= 1).length}
                  </span>
                </label>
              </div>

              {/* Airlines */}
              <div className="py-4 border-b border-slate-100 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900">{t('flights.airlines')}</h4>
                {availableAirlines.length === 0 && (
                  <p className="text-xs text-slate-400">{t('flights.noAirlines')}</p>
                )}
                {availableAirlines.map((airline) => {
                  const count = flights.filter((f) => f.airline === airline).length
                  return (
                    <label
                      key={airline}
                      className="flex items-center justify-between text-xs text-slate-800 cursor-pointer hover:text-[#003580] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={selectedAirlines.includes(airline)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAirlines([...selectedAirlines, airline])
                            } else {
                              setSelectedAirlines(selectedAirlines.filter((a) => a !== airline))
                            }
                          }}
                          className="rounded text-[#006ce4] focus:ring-[#006ce4]"
                        />
                        <AirlineLogo airline={airline} size="sm" isCircle={true} />
                        <span className="font-medium truncate max-w-[140px]">{airline}</span>
                      </div>
                      <span className="text-slate-500 text-xs">{count}</span>
                    </label>
                  )
                })}
              </div>

              {/* Flight times */}
              <div className="pt-4 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900">{t('flights.flightTimes')}</h4>
                <p className="text-[11px] text-slate-500 font-semibold uppercase">{t('flights.departs')}</p>
                {DEPARTURE_BUCKETS.map((bucket) => {
                  const isChecked = selectedBucket === bucket.id
                  return (
                    <label
                      key={bucket.id}
                      className="flex items-center justify-between text-xs text-slate-800 cursor-pointer hover:text-[#003580]"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setSelectedBucket(isChecked ? null : bucket.id)
                          }
                          className="rounded text-[#006ce4] focus:ring-[#006ce4]"
                        />
                        <span>{bucket.label} ({bucket.hours})</span>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* Flight Search Results */}
          <section className="lg:col-span-9 space-y-4">
            {/* Results Header with Sorting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
              <p className="text-sm font-semibold text-navy-950">
                {t('flights.foundFlights').replace('{count}', filteredFlights.length)}{' '}
                {t('flights.from')} <strong className="uppercase">{origin}</strong> {t('flights.to')} <strong className="uppercase">{destination}</strong>
              </p>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">{t('flights.sort')}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-navy-900 focus:border-cyan-500 focus:outline-none"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {getSortOptionLabel(opt.id)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Flight Cards Feed */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-44 rounded-3xl skeleton" />
                ))}
              </div>
            ) : filteredFlights.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
                <Plane className="mx-auto h-12 w-12 text-slate-300 -rotate-45 mb-3" />
                <h3 className="text-base font-bold text-navy-950">{t('flights.noFlights')}</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                  {t('flights.noFlightsDesc')
                    .replace('{origin}', origin)
                    .replace('{destination}', destination)}
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn-outline py-2 px-4 text-xs font-bold"
                >
                  {t('flights.resetAllFilters')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFlights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
