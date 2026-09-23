import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock,
  ShieldCheck,
  CreditCard,
  Luggage,
  UtensilsCrossed,
  Shield,
  Sparkles,
  AlertTriangle,
  Lock,
  CheckCircle2,
  ChevronRight,
  QrCode,
} from 'lucide-react'
import useCountdown from '../../hooks/useCountdown'
import { bookingApi, extractErrorMessage } from '../../api/client'
import { PAYMENT_METHODS } from '../../utils/constants'
import { useCurrency } from '../../context/CurrencyContext'
import { useLanguage } from '../../context/LanguageContext'
import VietQrModal from './VietQrModal'

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
  const [paymentMethod, setPaymentMethod] = useState('VIETQR')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isVietQrOpen, setIsVietQrOpen] = useState(false)

  // Ancillaries Add-ons State (Decorator Pattern on Backend)
  const [extraBaggageKg, setExtraBaggageKg] = useState(0)
  const [mealCode, setMealCode] = useState('')
  const [hasInsurance, setHasInsurance] = useState(false)
  const [insurancePlan, setInsurancePlan] = useState('STANDARD')
  const [hasLounge, setHasLounge] = useState(false)

  // 15-minute countdown against booking.holdExpiresAt
  const { minutes, seconds, expired } = useCountdown(booking?.holdExpiresAt)

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers]
    updated[index] = { ...updated[index], [field]: value }
    onUpdatePassengers(updated)
  }

  // Calculate live ancillary total
  const basePrice = booking?.totalAmount || 0
  let baggagePrice = 0
  if (extraBaggageKg === 10) baggagePrice = 200000
  else if (extraBaggageKg === 20) baggagePrice = 350000
  else if (extraBaggageKg === 30) baggagePrice = 480000

  let mealPrice = 0
  if (mealCode === 'MEAL_CHICKEN_RICE') mealPrice = 120000
  else if (mealCode === 'MEAL_BEEF_STEAK') mealPrice = 150000
  else if (mealCode === 'MEAL_PASTA_BOLOGNESE') mealPrice = 110000
  else if (mealCode === 'MEAL_VEGAN_PLATTER') mealPrice = 95000

  let insurancePrice = 0
  if (hasInsurance) {
    insurancePrice = insurancePlan === 'PREMIUM' ? 189000 : 99000
  }

  const loungePrice = hasLounge ? 350000 : 0
  const grandTotal = basePrice + baggagePrice + mealPrice + insurancePrice + loungePrice

  const executePayment = async (methodToUse) => {
    setLoading(true)
    setError(null)

    try {
      const confirmed = await bookingApi.confirm({
        bookingId: booking.id || booking.bookingId,
        paymentMethod: methodToUse || paymentMethod,
        extraBaggageKg: Number(extraBaggageKg) || 0,
        mealCode: mealCode || null,
        hasInsurance: Boolean(hasInsurance),
        insurancePlan: hasInsurance ? insurancePlan : null,
        hasLounge: Boolean(hasLounge),
        passengers: passengers.map((p) => ({
          fullName: p.fullName,
          passportNumber: p.passportNumber,
          seatNumber: p.seatNumber,
          seatClass: p.seatClass || 'ECONOMY',
        })),
      })
      setIsVietQrOpen(false)
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

  const handleConfirm = async (e) => {
    e.preventDefault()
    if (expired) {
      setError('Seat hold duration has expired. Please reselect your seats on the cabin map.')
      return
    }

    if (paymentMethod === 'VIETQR') {
      setIsVietQrOpen(true)
      return
    }

    await executePayment(paymentMethod)
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
                  : 'Chain of Responsibility & Lock Integrity pipeline active'}
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

        {/* Ancillary Add-ons (Decorator Pattern Showcase) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span>Flight Ancillaries & Add-ons</span>
              </h2>
              <p className="text-xs text-slate-500">
                Customized dynamically via Decorator Pattern pricing engine
              </p>
            </div>
            <span className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
              Decorator Engine
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Extra Baggage */}
            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 hover:border-cyan-400 transition-all">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <Luggage className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy-900">Pre-paid Checked Baggage</h4>
                  <p className="text-[11px] text-slate-500">Save up to 40% vs airport counter</p>
                </div>
              </div>
              <select
                value={extraBaggageKg}
                onChange={(e) => setExtraBaggageKg(Number(e.target.value))}
                className="input text-xs py-2 mt-2 bg-white"
              >
                <option value={0}>Standard Included (7kg Cabin only) - +0₫</option>
                <option value={10}>+10kg Checked Luggage (+{formatPrice(200000, 'VND')})</option>
                <option value={20}>+20kg Checked Luggage (+{formatPrice(350000, 'VND')})</option>
                <option value={30}>+30kg Checked Luggage (+{formatPrice(480000, 'VND')})</option>
              </select>
            </div>

            {/* 2. In-Flight Gourmet Meal */}
            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 hover:border-cyan-400 transition-all">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <UtensilsCrossed className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy-900">In-Flight Gourmet Meal</h4>
                  <p className="text-[11px] text-slate-500">Chef-crafted hot culinary selection</p>
                </div>
              </div>
              <select
                value={mealCode}
                onChange={(e) => setMealCode(e.target.value)}
                className="input text-xs py-2 mt-2 bg-white"
              >
                <option value="">No Meal Selection - +0₫</option>
                <option value="MEAL_CHICKEN_RICE">Hainanese Chicken Rice (+{formatPrice(120000, 'VND')})</option>
                <option value="MEAL_BEEF_STEAK">Black Pepper Beef Tenderloin (+{formatPrice(150000, 'VND')})</option>
                <option value="MEAL_PASTA_BOLOGNESE">Classic Pasta Bolognese (+{formatPrice(110000, 'VND')})</option>
                <option value="MEAL_VEGAN_PLATTER">Organic Vegan Asian Platter (+{formatPrice(95000, 'VND')})</option>
              </select>
            </div>

            {/* 3. Travel Care Insurance */}
            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 hover:border-cyan-400 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-900">AeroSmart Travel Care</h4>
                    <p className="text-[11px] text-slate-500">Trip delays, luggage loss & medical</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasInsurance}
                  onChange={(e) => setHasInsurance(e.target.checked)}
                  className="h-4 w-4 rounded text-cyan-600 focus:ring-cyan-500"
                />
              </div>
              {hasInsurance && (
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setInsurancePlan('STANDARD')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                      insurancePlan === 'STANDARD'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Standard (+{formatPrice(99000, 'VND')})
                  </button>
                  <button
                    type="button"
                    onClick={() => setInsurancePlan('PREMIUM')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                      insurancePlan === 'PREMIUM'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Premium (+{formatPrice(189000, 'VND')})
                  </button>
                </div>
              )}
            </div>

            {/* 4. VIP Lounge & Fast-Track */}
            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 hover:border-cyan-400 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-900">Lotus Business Lounge</h4>
                    <p className="text-[11px] text-slate-500">Buffet dining + Fast-track Security</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasLounge}
                  onChange={(e) => setHasLounge(e.target.checked)}
                  className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500"
                />
              </div>
              <p className="mt-2 text-right text-xs font-bold text-purple-700">
                +{formatPrice(350000, 'VND')} / passenger
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Gateway Selection (Strategy Pattern) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-cyan-600" />
              <span>{t('checkout.paymentMethod')}</span>
            </h2>
            <span className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
              Strategy Pattern
            </span>
          </div>
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
          <div className="space-y-2 pb-4 border-b border-navy-800 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Base Airfare ({passengers.length} Passenger{passengers.length > 1 ? 's' : ''}):</span>
              <span className="font-mono font-semibold text-white">{formatPrice(basePrice, 'VND')}</span>
            </div>
            {baggagePrice > 0 && (
              <div className="flex justify-between text-cyan-300">
                <span>+ Checked Baggage ({extraBaggageKg}kg):</span>
                <span className="font-mono font-semibold">+{formatPrice(baggagePrice, 'VND')}</span>
              </div>
            )}
            {mealPrice > 0 && (
              <div className="flex justify-between text-amber-300">
                <span>+ In-Flight Meal Selection:</span>
                <span className="font-mono font-semibold">+{formatPrice(mealPrice, 'VND')}</span>
              </div>
            )}
            {insurancePrice > 0 && (
              <div className="flex justify-between text-emerald-300">
                <span>+ Travel Care Insurance ({insurancePlan}):</span>
                <span className="font-mono font-semibold">+{formatPrice(insurancePrice, 'VND')}</span>
              </div>
            )}
            {loungePrice > 0 && (
              <div className="flex justify-between text-purple-300">
                <span>+ Lotus Business Lounge & Fast-Track:</span>
                <span className="font-mono font-semibold">+{formatPrice(loungePrice, 'VND')}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between py-4 border-b border-navy-800">
            <div>
              <p className="text-xs text-cyan-300 font-medium">{t('bookingSuccess.bookingRef')}</p>
              <p className="text-lg font-mono font-bold text-white">
                {booking?.bookingReference || 'PENDING'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">{t('checkout.totalPayable')}</p>
              <p className="text-2xl font-extrabold text-cyan-400">
                {formatPrice(grandTotal, 'VND')}
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>Chain of Responsibility verified · Encrypted Gateway</span>
            </div>

            <button
              type="submit"
              disabled={loading || expired}
              className="w-full sm:w-auto btn-primary py-3.5 px-8 text-base font-bold shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <span>{t('checkout.processingPayment')}</span>
              ) : paymentMethod === 'VIETQR' ? (
                <span className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  <span>Quét mã VietQR thanh toán ({formatPrice(grandTotal, 'VND')})</span>
                </span>
              ) : (
                <span>{t('checkout.payNow')} ({paymentMethod})</span>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Interactive VietQR Napas 24/7 Dynamic Payment Modal */}
      <VietQrModal
        isOpen={isVietQrOpen}
        onClose={() => setIsVietQrOpen(false)}
        onConfirmPayment={() => executePayment('VIETQR')}
        bookingRef={booking?.bookingReference}
        amount={grandTotal}
        loading={loading}
      />
    </div>
  )
}


