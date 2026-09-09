import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock,
  ShieldCheck,
  CreditCard,
  QrCode,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Plane,
} from 'lucide-react'
import useCountdown from '../../hooks/useCountdown'
import { bookingApi, extractErrorMessage } from '../../api/client'
import { formatTime, formatDate } from '../../utils/format'
import { PAYMENT_METHODS } from '../../utils/constants'
import { useCurrency } from '../../context/CurrencyContext'
import { useLanguage } from '../../context/LanguageContext'

export default function CheckoutFlow({
  booking,
  flight,
  passengers,
  onUpdatePassengers,
  onBookingSuccess,
}) {
  const navigate = useNavigate()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()
  const [paymentMethod, setPaymentMethod] = useState('VNPAY')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 15-minute countdown against booking.holdExpiresAt
  const { minutes, seconds, expired } = useCountdown(booking?.holdExpiresAt)

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers]
    updated[index] = { ...updated[index], [field]: value }
    onUpdatePassengers(updated)
  }

  const handleConfirm = async (e) => {
    e.preventDefault()
    if (expired) {
      setError('Seat hold duration has expired. Please reselect your seats on the cabin map.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const confirmed = await bookingApi.confirm({
        bookingId: booking.id || booking.bookingId,
        paymentMethod,
      })
      if (onBookingSuccess) {
        onBookingSuccess(confirmed)
      } else {
        navigate(`/booking-success/${confirmed.bookingReference}`)
      }
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to complete transaction. Please check details.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl py-6">
      {/* 15-minute Distributed Hold Countdown Banner */}
      <div
        className={`mb-6 rounded-2xl p-4 transition-all ${
          expired
            ? 'border-2 border-rose-500 bg-rose-50 text-rose-900'
            : 'border border-amber-300 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent text-navy-950'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                expired ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white animate-pulse'
              }`}
            >
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold">
                {expired ? t('checkout.noHoldTitle') : t('badge.holdingGuarantee')}
              </p>
              <p className="text-xs text-slate-600">
                {expired
                  ? t('checkout.noHoldDesc')
                  : t('footer.brandDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('checkout.holdExpiresIn')}:
            </span>
            <span
              className={`font-mono text-2xl font-black ${
                expired ? 'text-rose-600' : 'text-amber-600'
              }`}
            >
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleConfirm} className="space-y-6">
        {/* Passenger Information */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-cyan-600" />
            <span>{t('checkout.contactInfo')}</span>
          </h2>

          <div className="space-y-4">
            {passengers.map((p, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {t('auth.passenger')} #{idx + 1}
                  </span>
                  <span className="rounded-full bg-cyan-100 border border-cyan-300 px-2.5 py-0.5 text-xs font-bold text-cyan-800">
                    {t('checkout.heldSeat')}: {p.seatNumber || 'Pending'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">{t('checkout.fullName')}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NGUYEN VAN AN"
                      value={p.fullName}
                      onChange={(e) => handlePassengerChange(idx, 'fullName', e.target.value)}
                      className="input uppercase"
                    />
                  </div>

                  <div>
                    <label className="label">{t('checkout.passportNo')}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. B1234567"
                      value={p.passportNumber}
                      onChange={(e) => handlePassengerChange(idx, 'passportNumber', e.target.value)}
                      className="input uppercase"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Gateway Selection */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy-900 mb-2 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-cyan-600" />
            <span>{t('checkout.paymentMethod')}</span>
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            {t('checkout.mockNotice')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = paymentMethod === method.id
              return (
                <label
                  key={method.id}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50/50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black shadow-sm ${method.brandClass}`}
                    >
                      {method.initials}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-navy-900">{method.name}</p>
                      <p className="text-xs text-slate-500">{method.tagline}</p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="paymentStrategy"
                    value={method.id}
                    checked={isSelected}
                    onChange={() => setPaymentMethod(method.id)}
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
                  />
                </label>
              )
            })}
          </div>
        </div>

        {/* Fare Summary & Submit */}
        <div className="rounded-3xl border border-navy-800 bg-navy-950 p-6 text-white shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-navy-800">
            <div>
              <p className="text-xs text-cyan-300 font-medium">{t('bookingSuccess.bookingRef')}</p>
              <p className="text-lg font-mono font-bold text-white">
                {booking?.bookingReference || 'PENDING'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">{t('checkout.totalPayable')}</p>
              <p className="text-2xl font-extrabold text-cyan-400">
                {formatPrice(booking?.totalAmount || 0, 'VND')}
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>{t('footer.encryption')}</span>
            </div>

            <button
              type="submit"
              disabled={loading || expired}
              className="w-full sm:w-auto btn-primary py-3.5 px-8 text-base font-bold shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <span>{t('checkout.processingPayment')}</span>
              ) : (
                <span>{t('checkout.payNow')} ({paymentMethod})</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
