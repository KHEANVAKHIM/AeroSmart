import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  DollarSign,
  Plane,
  Armchair,
  TrendingUp,
  Ticket,
  Calendar,
  ChevronRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import { adminApi } from '../../api/client'
import { formatVND, formatDate, formatTime, bookingStatusColor } from '../../utils/format'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      adminApi.stats(),
      adminApi.listBookings({}),
    ])
      .then(([statsData, bookingsData]) => {
        setStats(statsData)
        setRecentBookings(bookingsData ? bookingsData.slice(0, 6) : [])
      })
      .catch((err) => {
        setError('Failed to fetch operational stats.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 rounded-3xl skeleton" />
          ))}
        </div>
      </div>
    )
  }

  const kpis = [
    {
      title: 'Total Revenue',
      value: formatVND(stats?.totalRevenue || 0),
      subtitle: 'Confirmed reservations',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Active Flights',
      value: stats?.activeFlights || 0,
      subtitle: 'Scheduled & operational',
      icon: Plane,
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-600',
    },
    {
      title: 'Booked Seats',
      value: stats?.bookedSeats || 0,
      subtitle: `${stats?.availableSeats || 0} seats available`,
      icon: Armchair,
      color: 'from-indigo-500 to-purple-600',
      textColor: 'text-indigo-600',
    },
    {
      title: 'Conversion Rate',
      value: `${stats?.conversionRate || 0}%`,
      subtitle: `${stats?.totalBookings || 0} total bookings created`,
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600',
    },
  ]

  const maxRevenue = Math.max(
    ...(stats?.revenueTrend?.map((t) => Number(t.revenue)) || [1]),
    1
  )

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950">Operations Console Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time fleet telemetry, seat allocations, and financial performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/flights"
            className="btn-primary py-2.5 px-4 text-xs font-bold shadow-md"
          >
            Flight Schedule Manager
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <p>{error}</p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <div
              key={idx}
              className="card-hover p-6 rounded-3xl border border-slate-200 bg-white"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {kpi.title}
                </span>
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${kpi.color} text-white shadow-md`}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="text-2xl font-black text-navy-950">{kpi.value}</p>
              <p className="text-xs text-slate-400 mt-1">{kpi.subtitle}</p>
            </div>
          )
        })}
      </div>

      {/* 7-Day Revenue Trend Chart */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-navy-950">Daily Confirmed Revenue (Past 7 Days)</h2>
            <p className="text-xs text-slate-500">Trend of settled VNPay & MoMo ticket payments</p>
          </div>
          <span className="rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1 text-xs font-bold text-cyan-800">
            Live Stream
          </span>
        </div>

        {/* Visual Revenue Bars */}
        <div className="h-48 flex items-end justify-between gap-2 sm:gap-6 pt-6 px-2">
          {stats?.revenueTrend?.map((point, idx) => {
            const rev = Number(point.revenue) || 0
            const heightPct = Math.max(12, Math.round((rev / maxRevenue) * 100))
            const formattedDay = new Date(point.date).toLocaleDateString('en-GB', {
              weekday: 'short',
              day: 'numeric',
            })

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatVND(rev)}
                </div>
                <div className="w-full max-w-[48px] rounded-t-xl bg-slate-100 relative h-36 flex items-end overflow-hidden">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full rounded-t-xl bg-gradient-to-t from-cyan-600 to-accent-400 group-hover:from-cyan-500 group-hover:to-accent-300 transition-all duration-300 shadow-sm"
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-600">{formattedDay}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-navy-950">Recent Bookings Manifest</h2>
            <p className="text-xs text-slate-500">Latest passenger transactions and held seats</p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Reference</th>
                <th className="px-6 py-3.5">Flight</th>
                <th className="px-6 py-3.5">Passenger</th>
                <th className="px-6 py-3.5">Seat</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Booked At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No bookings recorded yet
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-navy-950">
                      {b.bookingReference}
                    </td>
                    <td className="px-6 py-4 font-semibold text-navy-900">
                      {b.flight?.flightNumber} ({b.flight?.departureAirport?.code} → {b.flight?.arrivalAirport?.code})
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {b.passengers?.[0]?.fullName || b.userFullName}
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
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(b.createdAt)} {formatTime(b.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
