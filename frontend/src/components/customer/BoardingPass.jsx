import { Plane, QrCode, CheckCircle, Download, Printer, Smartphone, FileText } from 'lucide-react'
import { formatVND, formatTime, formatDate } from '../../utils/format'
import AirlineLogo from '../common/AirlineLogo'
import { useLanguage } from '../../context/LanguageContext'
import { useCurrency } from '../../context/CurrencyContext'
import { bookingApi } from '../../api/client'

export default function BoardingPass({ booking }) {
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()

  if (!booking) return null

  const flight = booking.flight
  const passenger = booking.passengers?.[0]
  const seatNumber = passenger?.seatNumber || '12A'
  const seatClass = passenger?.seatClass === 'BUSINESS' ? t('seat.business') : t('seat.economy')

  const handleDownload = (format) => {
    const url = bookingApi.getDocumentUrl(booking.bookingReference, format)
    window.open(url, '_blank')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Boarding Pass Ticket Card */}
      <div className="boarding-pass overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Top Airline Header */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-cyan-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AirlineLogo airline={flight?.airline} size="lg" className="rounded-xl shadow" />
            <div>
              <p className="text-xs uppercase tracking-widest text-cyan-300 font-bold">
                {t('myBookings.boardingPass')}
              </p>
              <h2 className="text-lg font-black text-white tracking-tight">
                {flight?.airline || 'AeroSmart Airways'}
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="rounded-full bg-emerald-500/20 border border-emerald-400 px-3 py-1 text-xs font-bold text-emerald-300">
              {booking.status}
            </span>
            <p className="mt-1 text-xs font-mono text-cyan-200">
              PNR: <strong className="text-white">{booking.bookingReference}</strong>
            </p>
          </div>
        </div>

        {/* Middle Route & Flight Details */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Route & Times */}
            <div className="md:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-black text-navy-950">
                    {flight?.departureAirport?.code}
                  </p>
                  <p className="text-xs font-semibold text-slate-500">
                    {flight?.departureAirport?.city}
                  </p>
                  <p className="text-sm font-bold text-navy-800 mt-1">
                    {formatTime(flight?.departureTime)}
                  </p>
                </div>

                <div className="flex flex-col items-center px-4">
                  <span className="text-xs font-mono font-bold text-cyan-600 mb-1">
                    {flight?.flightNumber}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="h-[2px] w-12 sm:w-20 bg-slate-300" />
                    <Plane className="h-4 w-4 text-navy-900 rotate-90" />
                    <div className="h-[2px] w-12 sm:w-20 bg-slate-300" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">{t('myBookings.flight')}</span>
                </div>

                <div className="text-right">
                  <p className="text-4xl font-black text-navy-950">
                    {flight?.arrivalAirport?.code}
                  </p>
                  <p className="text-xs font-semibold text-slate-500">
                    {flight?.arrivalAirport?.city}
                  </p>
                  <p className="text-sm font-bold text-navy-800 mt-1">
                    {formatTime(flight?.arrivalTime)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">{t('bookingSuccess.passenger')}</span>
                  <strong className="text-sm font-bold text-navy-900 uppercase">
                    {passenger?.fullName || booking.userFullName || 'Passenger'}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">{t('search.departureDate')}</span>
                  <strong className="text-sm font-bold text-navy-900">
                    {formatDate(flight?.departureTime)}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">{t('checkout.passportNo')}</span>
                  <strong className="text-sm font-bold text-navy-900">
                    {passenger?.passportNumber || 'VERIFIED'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Perforated Divider (Desktop) */}
            <div className="hidden md:flex md:col-span-1 justify-center relative">
              <div className="h-48 border-r-2 border-dashed border-slate-300" />
              <div className="absolute -top-10 h-6 w-6 rounded-full bg-slate-100" />
              <div className="absolute -bottom-10 h-6 w-6 rounded-full bg-slate-100" />
            </div>

            {/* Right Stub: Seat & Gate */}
            <div className="md:col-span-3 flex flex-col items-center justify-center space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
              <div>
                <span className="text-slate-400 text-xs uppercase tracking-wider block">{t('bookingSuccess.seatNumber')}</span>
                <span className="text-3xl font-black text-cyan-600">{seatNumber}</span>
                <span className="block text-[11px] font-semibold text-slate-600 mt-0.5">
                  {seatClass}
                </span>
              </div>

              {/* Simulated QR Code */}
              <div className="rounded-xl border-2 border-slate-300 bg-white p-2 shadow-inner">
                <QrCode className="h-20 w-20 text-navy-950" />
              </div>
              <span className="text-[10px] font-mono text-slate-400">Scan at boarding gate</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Transaction Metadata */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Settled via {booking.paymentMethod || 'VNPay'} · TxID: {booking.transactionId || 'VNP_SETTLED'}</span>
          <span>{t('checkout.totalPayable')}: <strong className="text-navy-900 font-bold">{formatPrice(booking.totalAmount, 'VND')}</strong></span>
        </div>
      </div>

      {/* Multi-format Document Generators (Factory Method Pattern) */}
      <div className="no-print mt-6 rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Official Travel Documents (Factory Method Generated)
          </span>
          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
            Factory Pattern
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleDownload('PDF')}
            className="btn-primary py-2.5 px-4 text-xs font-bold shadow-md flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>IATA PDF Ticket</span>
          </button>

          <button
            type="button"
            onClick={() => handleDownload('WALLET')}
            className="btn-outline py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50"
          >
            <Smartphone className="h-4 w-4 text-slate-700" />
            <span>Apple Wallet Pass</span>
          </button>

          <button
            type="button"
            onClick={() => handleDownload('HTML')}
            className="btn-outline py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50"
          >
            <FileText className="h-4 w-4 text-cyan-600" />
            <span>Tax Receipt / Invoice</span>
          </button>
        </div>
      </div>
    </div>
  )
}

