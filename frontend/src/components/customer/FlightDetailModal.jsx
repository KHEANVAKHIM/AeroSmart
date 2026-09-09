import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import {
  X,
  Share2,
  Clock,
  Briefcase,
  Luggage,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Calendar,
  ChevronRight,
  Plane,
  Sparkles,
  Info,
} from 'lucide-react'
import { formatTime, formatDate, formatDuration } from '../../utils/format'
import { useCurrency } from '../../context/CurrencyContext'
import { useBooking } from '../../context/BookingContext'
import { useLanguage } from '../../context/LanguageContext'
import AirlineLogo from '../common/AirlineLogo'

export default function FlightDetailModal({ flight, isOpen, onClose }) {
  const navigate = useNavigate()
  const { setSelectedFlight } = useBooking()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [selectedExtra, setSelectedExtra] = useState(false)

  if (!isOpen || !flight) return null

  const handleSelectAndContinue = () => {
    setSelectedFlight(flight)
    onClose()
    navigate(`/flights/${flight.id}/seats`)
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isDirect = flight.stops === 0
  const destinationCity = flight.arrivalAirport?.city || 'Destination'
  const destinationCountry = flight.arrivalAirport?.country || ''
  const flexPrice = flight.basePrice * 0.15

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 flex flex-col w-full max-w-2xl max-h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {t('modal.yourFlightTo').replace('{city}', destinationCity)}
            </h2>
            <p className="text-xs text-slate-500">
              {flight.departureAirport?.city} ({flight.departureAirport?.code}) → {destinationCity} ({flight.arrivalAirport?.code})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#006ce4] hover:bg-[#ebf3ff] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? t('modal.copied') : t('modal.shareFlight')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-slate-800">
          {/* Flight Summary Card */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-900">
                {t('modal.flightTo').replace('{city}', destinationCity)}
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                {isDirect ? t('flights.direct') : `${flight.stops} ${t('flights.stop')}`} · {formatDuration(flight.durationMinutes)}
              </span>
            </div>

            {/* Segment Details */}
            <div className="space-y-4">
              {/* Departure Point */}
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full border-2 border-[#006ce4] bg-white mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {formatDate(flight.departureTime)} · {formatTime(flight.departureTime)}
                  </p>
                  <p className="text-xs text-slate-600 font-semibold">
                    {flight.departureAirport?.code} · {flight.departureAirport?.name || flight.departureAirport?.city}
                  </p>
                </div>
              </div>

              {/* Airline & Aircraft Segment Box */}
              <div className="ml-1.5 pl-5 border-l-2 border-dashed border-slate-300 py-2 space-y-2">
                <div className="flex items-center gap-3">
                  <AirlineLogo airline={flight.airline} size="sm" isCircle={true} />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{flight.airline}</p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {flight.flightNumber} · Economy Class · Airbus A321neo
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium bg-white px-3 py-1.5 rounded-md border border-slate-200 w-fit">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('flights.flightTime')} {formatDuration(flight.durationMinutes)}</span>
                </div>
              </div>

              {/* Arrival Point */}
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-[#006ce4] mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {formatDate(flight.arrivalTime)} · {formatTime(flight.arrivalTime)}
                  </p>
                  <p className="text-xs text-slate-600 font-semibold">
                    {flight.arrivalAirport?.code} · {flight.arrivalAirport?.name || flight.arrivalAirport?.city}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Baggage Section (Booking.com style) */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('modal.baggage')}</h3>
              <p className="text-xs text-slate-500">{t('modal.baggageDesc')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Personal Item */}
              <div className="flex items-start justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t('modal.personalItem')}</p>
                    <p className="text-[11px] text-slate-500">{t('modal.personalItemDesc')}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#008009] bg-[#e7f7ed] px-2 py-0.5 rounded">
                  {t('modal.included')}
                </span>
              </div>

              {/* Checked bag */}
              <div className="flex items-start justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                    <Luggage className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t('modal.checkedBag')}</p>
                    <p className="text-[11px] text-slate-500">{t('modal.checkedBagDesc')}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#008009] bg-[#e7f7ed] px-2 py-0.5 rounded">
                  {t('modal.included')}
                </span>
              </div>
            </div>
          </div>

          {/* Fare Rules */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">{t('modal.fareRules')}</h3>
            <p className="text-xs text-slate-500">{t('modal.fareRulesDesc')}</p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('modal.changePolicy')}</span>
            </div>
          </div>

          {/* Extras you might like */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('modal.extras')}</h3>
              <p className="text-xs text-slate-500">{t('modal.extrasDesc')}</p>
            </div>

            <div
              onClick={() => setSelectedExtra(!selectedExtra)}
              className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedExtra
                  ? 'border-[#006ce4] bg-[#ebf3ff]'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedExtra}
                  onChange={() => {}}
                  className="mt-1 rounded text-[#006ce4] focus:ring-[#006ce4]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900">{t('modal.flexibleTicket')}</p>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {t('modal.recommended')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t('modal.flexibleTicketDesc')}</p>
                  <p className="text-[11px] font-bold text-[#006ce4] mt-1">
                    +{formatPrice(flexPrice, 'VND')}
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">{t('modal.availableNext')}</span>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white sticky bottom-0 z-10">
          <div>
            <span className="text-xs text-slate-500 block">{t('modal.totalFare')}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                {formatPrice(flight.basePrice + (selectedExtra ? flexPrice : 0), 'VND')}
              </span>
              <span className="text-xs text-slate-500 font-medium">{t('modal.perPassenger')}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSelectAndContinue}
            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold text-sm shadow-md transition-all duration-150"
          >
            <span>{t('modal.continue')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
