import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Ticket,
  Plane,
  Clock,
  QrCode,
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react'
import { bookingApi, extractErrorMessage } from '../api/client'
import AirlineLogo from '../components/common/AirlineLogo'
import { formatVND, formatTime, formatDate, bookingStatusColor } from '../utils/format'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useCurrency } from '../context/CurrencyContext'

export default function MyBookingsPage() {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)

  const loadBookings = () => {
    setLoading(true)
    bookingApi
      .myBookings()
      .then(setBookings)
      .catch((err) => {
        setError(extractErrorMessage(err, 'Failed to fetch your bookings.'))
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const handleCancel = async (bookingId) => {
    if (!window.confirm(t('myBookings.cancelConfirm'))) {
      return
    }

    setCancellingId(bookingId)
    try {
      await bookingApi.cancel(bookingId)
      loadBookings()
    } catch (err) {
      alert(extractErrorMessage(err, 'Unable to cancel booking.'))
    } finally {
      setCancellingId(null)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md py-20 px-4 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <Ticket className="mx-auto h-12 w-12 text-cyan-600 mb-3" />
          <h2 className="text-lg font-bold text-navy-950">{t('myBookings.signInRequired')}</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            {t('myBookings.signInDesc')}
          </p>
          <Link to="/login" className="btn-primary py-2.5 px-6 text-sm font-bold">
            {t('myBookings.signInCTA')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-950">{t('myBookings.title')}</h1>
            <p className="text-xs text-slate-500 mt-1">
              {t('myBookings.subtitle')}
            </p>
          </div>
          <Link to="/flights" className="btn-primary py-2.5 px-5 text-xs font-bold self-start">
            {t('myBookings.bookNew')}
          </Link>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-36 rounded-3xl skeleton" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
            <Plane className="mx-auto h-12 w-12 text-slate-300 -rotate-45 mb-3" />
            <h3 className="text-base font-bold text-navy-950">{t('myBookings.noBookings')}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
              {t('myBookings.noBookingsDesc')}
            </p>
            <Link to="/flights" className="btn-primary py-2.5 px-6 text-sm font-bold">
              {t('myBookings.findFlightsCTA')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const passenger = b.passengers?.[0]
              const isConfirmed = b.status === 'CONFIRMED'
              const isCancelled = b.status === 'CANCELLED'

              return (
                <div
                  key={b.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-cyan-400 hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="rounded-xl bg-navy-900 px-3 py-1 text-xs font-mono font-bold text-white">
                        {b.bookingReference}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${bookingStatusColor(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {t('myBookings.bookedOn')} {formatDate(b.createdAt)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">{t('myBookings.totalFare')}</span>
                      <span className="text-lg font-black text-navy-950">
                        {formatPrice(b.totalAmount, 'VND')}
                      </span>
                    </div>
                  </div>

                  <div className="py-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <AirlineLogo airline={b.flight?.airline} size="md" />
                      <div>
                        <p className="text-base font-bold text-navy-900">{b.flight?.flightNumber}</p>
                        <p className="text-xs text-slate-500 font-medium">{b.flight?.airline}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">{t('myBookings.route')}</p>
                      <p className="text-sm font-bold text-navy-900">
                        {b.flight?.departureAirport?.code} → {b.flight?.arrivalAirport?.code}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(b.flight?.departureTime)} · {formatTime(b.flight?.departureTime)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">{t('myBookings.passengerAndSeat')}</p>
                      <p className="text-sm font-bold text-navy-900">
                        {passenger?.fullName || b.userFullName}
                      </p>
                      <p className="text-xs text-cyan-600 font-semibold">
                        {t('myBookings.seat')} {passenger?.seatNumber || 'Unassigned'} ({passenger?.seatClass || 'ECO'})
                      </p>
                    </div>

                    <div className="flex sm:justify-end gap-2">
                      {isConfirmed && (
                        <Link
                          to={`/booking-success/${b.bookingReference}`}
                          className="btn-outline py-2 px-3 text-xs font-bold flex items-center gap-1.5"
                        >
                          <QrCode className="h-3.5 w-3.5" />
                          <span>{t('myBookings.boardingPass')}</span>
                        </Link>
                      )}

                      {!isCancelled && (
                        <button
                          type="button"
                          disabled={cancellingId === b.id}
                          onClick={() => handleCancel(b.id)}
                          className="btn-danger py-2 px-3 text-xs font-bold"
                        >
                          {cancellingId === b.id ? t('myBookings.cancelling') : t('myBookings.cancel')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
