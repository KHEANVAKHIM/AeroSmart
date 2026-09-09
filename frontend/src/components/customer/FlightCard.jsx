import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HelpCircle, ChevronDown, Luggage, Check, Briefcase } from 'lucide-react'
import { formatTime, formatDuration, formatDate } from '../../utils/format'
import { useBooking } from '../../context/BookingContext'
import { useCurrency } from '../../context/CurrencyContext'
import { useLanguage } from '../../context/LanguageContext'
import AirlineLogo from '../common/AirlineLogo'
import FlightDetailModal from './FlightDetailModal'

export default function FlightCard({ flight }) {
  const navigate = useNavigate()
  const { setSelectedFlight } = useBooking()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenDetails = () => {
    setIsModalOpen(true)
  }

  const isDirect = flight.stops === 0
  const isCheapest = flight.basePrice <= 1500000

  return (
    <div className="bg-white rounded-lg border border-slate-200 hover:border-[#006ce4] hover:shadow-md transition-all duration-150 p-4 mb-3">
      {/* Top Badges / Tags (Booking.com style) */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {isCheapest && isDirect && (
          <span className="bg-[#e7f7ed] text-[#008009] text-[11px] font-semibold px-2 py-0.5 rounded-sm">
            {t('flights.cheapestDirect')}
          </span>
        )}
        {flight.durationMinutes <= 120 && (
          <span className="bg-[#ebf3ff] text-[#006ce4] text-[11px] font-semibold px-2 py-0.5 rounded-sm">
            {t('flights.fastest')}
          </span>
        )}
        <span className="bg-[#e7f7ed] text-[#008009] text-[11px] font-semibold px-2 py-0.5 rounded-sm">
          {t('flights.flexibleUpgrade')}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left / Center: Flight Route & Timing */}
        <div className="flex-1">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Airline Logo Circle */}
            <div className="shrink-0">
              <AirlineLogo airline={flight.airline} size="md" isCircle={true} />
            </div>

            {/* Departure, Flight Path, Arrival */}
            <div className="flex-1 grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-5 max-w-xl">
              {/* Departure */}
              <div>
                <p className="text-lg sm:text-xl font-bold text-slate-900">
                  {formatTime(flight.departureTime)}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {flight.departureAirport?.code} · {formatDate(flight.departureTime)}
                </p>
              </div>

              {/* Path & Duration */}
              <div className="flex flex-col items-center px-1 sm:px-3">
                <div className="relative w-full flex items-center justify-center">
                  {/* Start circle dot */}
                  <span className="w-2 h-2 rounded-full border border-slate-400 bg-white shrink-0" />
                  {/* Line */}
                  <div className="h-[1px] w-full bg-slate-300" />
                  {/* Stops Pill Badge in Center */}
                  <span
                    className={`shrink-0 px-2 py-0.5 text-[11px] font-semibold rounded-full mx-1 ${
                      isDirect
                        ? 'bg-[#008009] text-white font-bold'
                        : 'border border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    {isDirect ? t('flights.direct') : `${flight.stops} ${flight.stops > 1 ? t('flights.stopsPlural') : t('flights.stop')}`}
                  </span>
                  {/* Line */}
                  <div className="h-[1px] w-full bg-slate-300" />
                  {/* End circle dot */}
                  <span className="w-2 h-2 rounded-full border border-slate-400 bg-white shrink-0" />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 font-medium">
                  {formatDuration(flight.durationMinutes)}
                </span>
              </div>

              {/* Arrival */}
              <div className="text-right">
                <p className="text-lg sm:text-xl font-bold text-slate-900">
                  {formatTime(flight.arrivalTime)}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {flight.arrivalAirport?.code} · {formatDate(flight.arrivalTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Airline Subtitle */}
          <div className="mt-2 pl-11 sm:pl-12">
            <span className="text-xs text-slate-500">
              {flight.airline} · {flight.flightNumber}
            </span>
          </div>
        </div>

        {/* Right: Fare, Baggage & Action CTA */}
        <div className="flex lg:flex-col items-end justify-between lg:justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-6 shrink-0 min-w-[200px]">
          {/* Baggage indicators (Booking.com style) */}
          <div className="flex flex-col items-start lg:items-end">
            <span className="text-[11px] text-slate-500 block mb-1">{t('flights.regularFare')}</span>
            <div className="flex items-center gap-1.5 text-slate-700">
              <div className="relative inline-flex items-center text-slate-600" title="Personal item included">
                <Briefcase className="w-4 h-4" />
                <span className="absolute -bottom-1 -right-1 bg-emerald-600 rounded-full p-[1px] text-white">
                  <Check className="w-2 h-2 stroke-[3]" />
                </span>
              </div>
              <div className="relative inline-flex items-center text-slate-600 ml-1" title="Cabin bag included">
                <Luggage className="w-4 h-4" />
                <span className="absolute -bottom-1 -right-1 bg-emerald-600 rounded-full p-[1px] text-white">
                  <Check className="w-2 h-2 stroke-[3]" />
                </span>
              </div>
            </div>
          </div>

          {/* Price & View Details Button */}
          <div className="text-right mt-2">
            <div className="flex items-center justify-end gap-1">
              <span className="text-lg sm:text-xl font-bold text-slate-900">
                {formatPrice(flight.basePrice, 'VND')}
              </span>
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600" />
            </div>

            <div
              onClick={handleOpenDetails}
              className="flex items-center justify-end gap-1 text-[11px] text-[#006ce4] hover:underline cursor-pointer font-medium mb-2"
            >
              <span>{t('flights.fareOptions')}</span>
              <ChevronDown className="w-3 h-3" />
            </div>

            <button
              type="button"
              onClick={handleOpenDetails}
              className="w-full sm:w-auto px-5 py-2 border border-[#006ce4] text-[#006ce4] hover:bg-[#ebf3ff] rounded-md text-sm font-bold transition-all duration-150 shadow-sm"
            >
              {t('flights.viewDetails')}
            </button>
          </div>
        </div>
      </div>

      {/* Booking.com View Details Popup Modal */}
      <FlightDetailModal
        flight={flight}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
