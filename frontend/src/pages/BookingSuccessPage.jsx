import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Plane, ArrowRight, AlertCircle, Home } from 'lucide-react'
import { bookingApi, extractErrorMessage } from '../api/client'
import BoardingPass from '../components/customer/BoardingPass'
import { useLanguage } from '../context/LanguageContext'

export default function BookingSuccessPage() {
  const { reference } = useParams()
  const { t } = useLanguage()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    bookingApi
      .getByReference(reference)
      .then(setBooking)
      .catch((err) => {
        setError(extractErrorMessage(err, 'Could not retrieve booking details.'))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [reference])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent mx-auto" />
          <p className="text-sm font-semibold text-slate-600">{t('checkout.processingPayment')}</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-lg py-20 px-4 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-3" />
          <h2 className="text-lg font-bold text-navy-950">{t('checkout.noHoldTitle')}</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            {t('checkout.noHoldDesc')}
          </p>
          <Link to="/" className="btn-primary py-2.5 px-6 text-sm font-bold">
            {t('checkout.findFlights')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl mb-8 text-center space-y-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
          {t('bookingSuccess.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {t('bookingSuccess.subtitle')}
        </p>
      </div>

      <BoardingPass booking={booking} />

      <div className="no-print mx-auto max-w-3xl mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6">
        <Link
          to="/my-bookings"
          className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1.5"
        >
          <span>{t('bookingSuccess.viewAllBookings')}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          to="/"
          className="text-xs font-semibold text-slate-500 hover:text-navy-900 flex items-center gap-1.5"
        >
          <Home className="h-4 w-4" />
          <span>{t('myBookings.bookNew')}</span>
        </Link>
      </div>
    </div>
  )
}
