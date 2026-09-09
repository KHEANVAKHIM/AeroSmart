import { useNavigate } from 'react-router-dom'
import { Plane, AlertCircle, ArrowLeft } from 'lucide-react'
import CheckoutFlow from '../components/customer/CheckoutFlow'
import { useBooking } from '../context/BookingContext'
import { useLanguage } from '../context/LanguageContext'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const {
    heldBooking,
    selectedFlight,
    passengers,
    setPassengers,
    setHeldBooking,
  } = useBooking()

  if (!heldBooking) {
    return (
      <div className="mx-auto max-w-xl py-20 px-4 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-3" />
          <h2 className="text-lg font-bold text-navy-950">{t('checkout.noHoldTitle')}</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            {t('checkout.noHoldDesc')}
          </p>
          <button
            type="button"
            onClick={() => navigate('/flights')}
            className="btn-primary py-2.5 px-6 text-sm font-bold"
          >
            {t('checkout.findFlights')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('checkout.backToSeats')}</span>
        </button>
      </div>

      <CheckoutFlow
        booking={heldBooking}
        flight={selectedFlight}
        passengers={passengers}
        onUpdatePassengers={setPassengers}
        onBookingSuccess={(confirmed) => {
          setHeldBooking(null)
          navigate(`/booking-success/${confirmed.bookingReference}`)
        }}
      />
    </div>
  )
}
