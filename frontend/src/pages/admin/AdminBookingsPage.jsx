import { useState, useEffect, useMemo } from 'react'
import {
  Ticket,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink,
  Eye,
  Calendar,
  Filter,
  RotateCcw,
  X,
} from 'lucide-react'
import { adminApi, extractErrorMessage } from '../../api/client'
import { formatVND, formatDate, formatTime, bookingStatusColor } from '../../utils/format'
import BookingDetailModal from '../../components/admin/BookingDetailModal'

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [query, setQuery] = useState('')
  const [dateType, setDateType] = useState('bookingDate') // 'bookingDate' or 'flightDate'
  const [selectedDate, setSelectedDate] = useState('')
  const [quickDateTab, setQuickDateTab] = useState('ALL') // 'ALL', 'TODAY', 'YESTERDAY'
  const [error, setError] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const todayStr = useMemo(() => {
    const d = new Date()
    return d.toISOString().split('T')[0]
  }, [])

  const yesterdayStr = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return d.toISOString().split('T')[0]
  }, [])

  const handleQuickDate = (tab) => {
    setQuickDateTab(tab)
    if (tab === 'ALL') {
      setSelectedDate('')
    } else if (tab === 'TODAY') {
      setSelectedDate(todayStr)
    } else if (tab === 'YESTERDAY') {
      setSelectedDate(yesterdayStr)
    }
  }

  const handleCustomDateChange = (val) => {
    setSelectedDate(val)
    if (!val) {
      setQuickDateTab('ALL')
    } else if (val === todayStr) {
      setQuickDateTab('TODAY')
    } else if (val === yesterdayStr) {
      setQuickDateTab('YESTERDAY')
    } else {
      setQuickDateTab('CUSTOM')
    }
  }

  const handleResetFilters = () => {
    setStatusFilter('')
    setQuery('')
    setSelectedDate('')
    setQuickDateTab('ALL')
  }

  const loadBookings = () => {
    setLoading(true)
    const params = {}
    if (statusFilter) params.status = statusFilter
    if (query.trim()) params.q = query.trim()
    if (selectedDate) {
      if (dateType === 'flightDate') {
        params.flightDate = selectedDate
      } else {
        params.bookingDate = selectedDate
      }
    }

    adminApi
      .listBookings(params)
      .then(setBookings)
      .catch((err) => {
        setError(extractErrorMessage(err, 'Failed to load bookings list.'))
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadBookings()
  }, [statusFilter, query, selectedDate, dateType])

  const handleQuickCancel = async (booking) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${booking.bookingReference}?`)) {
      return
    }

    try {
      await adminApi.cancelBooking(booking.id)
      loadBookings()
    } catch (err) {
      alert(extractErrorMessage(err, 'Failed to cancel booking.'))
    }
  }

  const isFiltered = Boolean(statusFilter || query || selectedDate)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-navy-950">Bookings & Passenger Manifests</h1>
            <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-bold text-navy-700">
              {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review customer reservations, search by booking or departure date, and manage Redisson seat locks.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['', 'CONFIRMED', 'SEAT_HELD', 'CANCELLED'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  statusFilter === s
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s ? s.replace('_', ' ') : 'ALL STATUSES'}
              </button>
            ))}
          </div>

          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />

          {/* Search Input */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 flex-1 min-w-[220px]">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reference, email, passenger..."
              className="w-full bg-transparent text-xs text-navy-950 placeholder-slate-400 outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5">
            <Calendar className="h-4 w-4 text-blue-600 shrink-0" />
            <select
              value={dateType}
              onChange={(e) => setDateType(e.target.value)}
              className="text-xs font-bold bg-transparent text-slate-600 outline-none cursor-pointer"
            >
              <option value="bookingDate">Booked On:</option>
              <option value="flightDate">Flight Date:</option>
            </select>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleCustomDateChange(e.target.value)}
              className="text-xs bg-transparent font-bold text-navy-950 outline-none cursor-pointer"
            />
            {selectedDate && (
              <button
                type="button"
                onClick={() => handleQuickDate('ALL')}
                title="Clear date filter"
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Reset button */}
          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors border border-rose-200"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Quick Date Tabs */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 overflow-x-auto text-xs">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 uppercase tracking-wider">Quick Date:</span>
          <button
            type="button"
            onClick={() => handleQuickDate('ALL')}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              quickDateTab === 'ALL'
                ? 'bg-navy-950 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Dates
          </button>
          <button
            type="button"
            onClick={() => handleQuickDate('TODAY')}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              quickDateTab === 'TODAY'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Today ({todayStr})
          </button>
          <button
            type="button"
            onClick={() => handleQuickDate('YESTERDAY')}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              quickDateTab === 'YESTERDAY'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Yesterday ({yesterdayStr})
          </button>
          {quickDateTab === 'CUSTOM' && selectedDate && (
            <span className="px-3 py-1 rounded-xl font-bold bg-amber-500 text-white text-xs shadow-sm">
              Custom Date: {selectedDate}
            </span>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Reference</th>
                <th className="px-6 py-3.5">Flight</th>
                <th className="px-6 py-3.5">Passenger</th>
                <th className="px-6 py-3.5">Seat</th>
                <th className="px-6 py-3.5">Total Fare</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Payment / Tx</th>
                <th className="px-6 py-3.5">Created At</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-400">
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-400">
                    No bookings found matching filter
                  </td>
                </tr>
              ) : (
                bookings.map((b) => {
                  const isCancelled = b.status === 'CANCELLED'
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-navy-950">
                        {b.bookingReference}
                      </td>
                      <td className="px-6 py-4 font-semibold text-navy-900">
                        {b.flight?.flightNumber} ({b.flight?.departureAirport?.code} → {b.flight?.arrivalAirport?.code})
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-navy-950 uppercase">
                          {b.passengers?.[0]?.fullName || b.userFullName}
                        </div>
                        <div className="text-[11px] text-slate-400">{b.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-cyan-700">
                        {b.passengers?.[0]?.seatNumber || '—'}
                      </td>
                      <td className="px-6 py-4 font-bold text-navy-950">
                        {formatVND(b.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${bookingStatusColor(
                            b.status
                          )}`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="font-bold">{b.paymentMethod || '—'}</div>
                        <div className="text-[10px] font-mono text-slate-400 truncate max-w-[130px]">
                          {b.transactionId || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(b.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(b)}
                            title="Inspect Booking Details"
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-300 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {!isCancelled && (
                            <button
                              type="button"
                              onClick={() => handleQuickCancel(b)}
                              title="Cancel Booking & Release Seat"
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 transition-colors"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        onBookingUpdated={loadBookings}
      />
    </div>
  )
}
