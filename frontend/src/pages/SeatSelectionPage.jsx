import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Plane,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Armchair,
  AlertCircle,
  Lock,
  ChevronRight,
} from 'lucide-react'
import { flightApi, bookingApi, extractErrorMessage } from '../api/client'
import InteractiveSeatMap from '../components/customer/InteractiveSeatMap'
import AirlineLogo from '../components/common/AirlineLogo'
import { formatVND, formatTime, formatDate } from '../utils/format'
import { useBooking } from '../context/BookingContext'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'

export default function SeatSelectionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const {
    selectedFlight,
    setSelectedFlight,
    selectedSeats,
    selectSeat,
    passengers,
    setHeldBooking,
  } = useBooking()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()

  const [flight, setFlight] = useState(selectedFlight)
  const [seatMap, setSeatMap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [holding, setHolding] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      flightApi.getById(id),
      flightApi.getSeats(id),
    ])
      .then(([fData, sData]) => {
        setFlight(fData)
        setSelectedFlight(fData)
        setSeatMap(sData)
      })
      .catch((err) => {
        setError(extractErrorMessage(err, 'Failed to load flight seats.'))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id, setSelectedFlight])

  const currentSelectedSeat = selectedSeats[0] || null

  const handleHoldAndProceed = async () => {
    if (!currentSelectedSeat) return

    if (!isAuthenticated) {
      // Store intended path and redirect to login
      navigate(`/login?redirect=/flights/${id}/seats`)
      return
    }

    setHolding(true)
    setError(null)

    try {
      const passengerPayload = [
        {
          fullName: passengers[0]?.fullName || 'Passenger 1',
          passportNumber: passengers[0]?.passportNumber || 'PASSPORT_DOC',
          seatNumber: currentSelectedSeat.seatNumber,
        },
      ]

      const holdRes = await bookingApi.holdSeat({
        flightId: Number(id),
        seatNumbers: [currentSelectedSeat.seatNumber],
        passengers: passengerPayload,
      })

      setHeldBooking(holdRes)
      navigate('/checkout')
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to hold seat. It may have been locked by another customer.'))
      // Refresh seat map
      flightApi.getSeats(id).then(setSeatMap).catch(() => {})
    } finally {
      setHolding(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent mx-auto" />
          <p className="text-sm font-semibold text-slate-600">{t('seat.loadingMap')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-28">
      {/* Flight Header Bar */}
      <div className="border-b border-slate-200 bg-white py-4 shadow-sm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <AirlineLogo airline={flight?.airline} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-navy-950">
                  {flight?.flightNumber} · {flight?.airline}
                </h1>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  {flight?.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {flight?.departureAirport?.city} ({flight?.departureAirport?.code}) →{' '}
                {flight?.arrivalAirport?.city} ({flight?.arrivalAirport?.code}) ·{' '}
                {formatDate(flight?.departureTime)} · {t('flights.departs')} {formatTime(flight?.departureTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-cyan-50 border border-cyan-200 px-3 py-1.5 text-xs text-cyan-800 font-semibold">
            <Lock className="h-3.5 w-3.5" />
            <span>{t('badge.holdingGuarantee')}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-8">
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
            <p>{error}</p>
          </div>
        )}

        {/* Seat Map */}
        <InteractiveSeatMap
          seats={seatMap?.seats || []}
          selectedSeat={currentSelectedSeat}
          onSelectSeat={selectSeat}
          disabled={holding}
        />
      </div>

      {/* Fixed Bottom Action Drawer */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-md p-4 shadow-2xl">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-900 text-cyan-400 font-bold">
              <Armchair className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">{t('seat.selectedCabinSeat')}</p>
              {currentSelectedSeat ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-navy-950">
                    {t('seat.seatSelected')
                      .replace('{seatNo}', currentSelectedSeat.seatNumber)
                      .replace('{class}', currentSelectedSeat.seatClass === 'BUSINESS' ? t('seat.business') : t('seat.economy'))}
                  </span>
                  <span className="text-lg font-bold text-cyan-600">
                    {formatPrice(currentSelectedSeat.price, 'VND')}
                  </span>
                </div>
              ) : (
                <p className="text-sm font-semibold text-slate-400">
                  {t('seat.tapSeatPrompt')}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={!currentSelectedSeat || holding}
            onClick={handleHoldAndProceed}
            className="w-full sm:w-auto btn-primary py-3.5 px-8 text-sm font-bold shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {holding ? (
              <span>{t('seat.acquiringLock')}</span>
            ) : (
              <>
                <span>{t('seat.lockSeatCTA')}</span>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
