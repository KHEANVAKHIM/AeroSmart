import { useState } from 'react'
import {
  X,
  Ticket,
  Plane,
  Clock,
  User,
  CreditCard,
  Printer,
  XCircle,
  CheckCircle,
  AlertTriangle,
  QrCode,
} from 'lucide-react'
import { adminApi, extractErrorMessage } from '../../api/client'
import { formatVND, formatDate, formatTime, bookingStatusColor } from '../../utils/format'
import AirlineLogo from '../common/AirlineLogo'

export default function BookingDetailModal({ booking, isOpen, onClose, onBookingUpdated }) {
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen || !booking) return null

  const handleCancel = async () => {
    if (
      !window.confirm(
        `Are you sure you want to force-cancel booking ${booking.bookingReference}? This will release the seat lock immediately.`
      )
    ) {
      return
    }

    setCancelling(true)
    setError(null)

    try {
      await adminApi.cancelBooking(booking.id)
      onBookingUpdated()
      onClose()
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to cancel booking.'))
    } finally {
      setCancelling(false)
    }
  }

  const isCancelled = booking.status === 'CANCELLED'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 font-bold">
              <Ticket className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-navy-950">
                  Booking #{booking.bookingReference}
                </h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${bookingStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Created on {formatDate(booking.createdAt)} at {formatTime(booking.createdAt)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Flight Summary Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AirlineLogo airline={booking.flight?.airline} size="md" />
              <div>
                <p className="text-sm font-bold text-navy-950">{booking.flight?.flightNumber}</p>
                <p className="text-xs text-slate-500 font-medium">{booking.flight?.airline}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Transaction</span>
              <span className="text-base font-black text-navy-950">{formatVND(booking.totalAmount)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
            <div>
              <span className="font-bold text-navy-900">{booking.flight?.departureAirport?.code}</span> ({booking.flight?.departureAirport?.city})
              <p className="text-[11px] text-slate-500">{formatTime(booking.flight?.departureTime)} · {formatDate(booking.flight?.departureTime)}</p>
            </div>
            <span className="text-slate-400 font-mono">→</span>
            <div className="text-right">
              <span className="font-bold text-navy-900">{booking.flight?.arrivalAirport?.code}</span> ({booking.flight?.arrivalAirport?.city})
              <p className="text-[11px] text-slate-500">{formatTime(booking.flight?.arrivalTime)} · {formatDate(booking.flight?.arrivalTime)}</p>
            </div>
          </div>
        </div>

        {/* Passengers & Assigned Seats */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Manifest Passengers ({booking.passengers?.length || 0})
          </h4>
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
            {booking.passengers?.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 bg-white text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 font-bold font-mono">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-navy-950 uppercase block">{p.fullName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">Doc: {p.passportNumber}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-cyan-50 border border-cyan-200 px-2.5 py-1 text-xs font-bold text-cyan-800">
                    Seat {p.seatNumber || 'Unassigned'} ({p.seatClass || 'ECONOMY'})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Settlement Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs">
          <div>
            <span className="text-slate-400 block">Customer Account</span>
            <strong className="text-navy-900 truncate block">{booking.userEmail || 'Guest'}</strong>
          </div>

          <div>
            <span className="text-slate-400 block">Payment Strategy</span>
            <strong className="text-navy-900 block">{booking.paymentMethod || 'VNPay'}</strong>
          </div>

          <div>
            <span className="text-slate-400 block">Gateway TxID</span>
            <strong className="font-mono text-cyan-700 block truncate">{booking.transactionId || 'PENDING_SETTLEMENT'}</strong>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-outline py-2 px-4 text-xs font-bold flex items-center gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Receipt & Pass</span>
          </button>

          <div className="flex items-center gap-2">
            {!isCancelled && (
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancel}
                className="btn-danger py-2 px-4 text-xs font-bold flex items-center gap-1.5"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>{cancelling ? 'Cancelling...' : 'Cancel & Release Seat'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="btn-primary py-2 px-4 text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
