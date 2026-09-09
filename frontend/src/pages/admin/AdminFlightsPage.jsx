import { useState, useEffect, useMemo } from 'react'
import {
  Plane,
  Plus,
  Search,
  Users,
  Edit3,
  Trash2,
  AlertCircle,
  Clock,
  CheckCircle,
  Calendar,
  Filter,
  RotateCcw,
  X,
} from 'lucide-react'
import { adminApi, extractErrorMessage } from '../../api/client'
import AirlineLogo from '../../components/common/AirlineLogo'
import { formatVND, formatDate, formatTime, flightStatusColor } from '../../utils/format'
import AddFlightModal from '../../components/admin/AddFlightModal'
import EditFlightModal from '../../components/admin/EditFlightModal'
import ManifestModal from '../../components/admin/ManifestModal'

export default function AdminFlightsPage() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [quickDateTab, setQuickDateTab] = useState('ALL') // 'ALL', 'TODAY', 'TOMORROW'
  const [statusFilter, setStatusFilter] = useState('')
  const [error, setError] = useState(null)

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editingFlight, setEditingFlight] = useState(null)
  const [manifestFlightId, setManifestFlightId] = useState(null)

  // Helper to calculate date string for today / tomorrow in YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date()
    return d.toISOString().split('T')[0]
  }, [])

  const tomorrowStr = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  }, [])

  const handleQuickDate = (tab) => {
    setQuickDateTab(tab)
    if (tab === 'ALL') {
      setDepartureDate('')
    } else if (tab === 'TODAY') {
      setDepartureDate(todayStr)
    } else if (tab === 'TOMORROW') {
      setDepartureDate(tomorrowStr)
    }
  }

  const handleCustomDateChange = (val) => {
    setDepartureDate(val)
    if (!val) {
      setQuickDateTab('ALL')
    } else if (val === todayStr) {
      setQuickDateTab('TODAY')
    } else if (val === tomorrowStr) {
      setQuickDateTab('TOMORROW')
    } else {
      setQuickDateTab('CUSTOM')
    }
  }

  const handleResetFilters = () => {
    setSearch('')
    setDepartureDate('')
    setQuickDateTab('ALL')
    setStatusFilter('')
  }

  const loadFlights = () => {
    setLoading(true)
    const params = {}
    if (search.trim()) params.q = search.trim()
    if (departureDate) params.departureDate = departureDate
    if (statusFilter) params.status = statusFilter

    adminApi
      .listFlights(params)
      .then(setFlights)
      .catch((err) => {
        setError(extractErrorMessage(err, 'Failed to load flight schedule.'))
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadFlights()
  }, [search, departureDate, statusFilter])

  const handleStatusChange = async (flightId, newStatus) => {
    try {
      await adminApi.updateStatus(flightId, newStatus)
      loadFlights()
    } catch (err) {
      alert(extractErrorMessage(err, 'Failed to update flight status.'))
    }
  }

  const handleDelete = async (flightId, flightNumber) => {
    if (!window.confirm(`Are you sure you want to delete flight ${flightNumber}? This will remove its seats and schedules.`)) {
      return
    }

    try {
      await adminApi.deleteFlight(flightId)
      loadFlights()
    } catch (err) {
      alert(extractErrorMessage(err, 'Failed to delete flight.'))
    }
  }

  const isFiltered = Boolean(search || departureDate || statusFilter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-navy-950">Flight Schedule Manager</h1>
            <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-bold text-navy-700">
              {flights.length} {flights.length === 1 ? 'flight' : 'flights'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search by flight date, status, route, and manage passenger manifests or schedule changes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="btn-primary py-2.5 px-4 text-xs font-bold shadow-md flex items-center gap-2 self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule New Flight</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="flex items-center gap-2.5 bg-slate-50 px-3.5 py-2.5 rounded-2xl border border-slate-200 flex-1 min-w-[240px]">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search flight no, airline, city, or airport code..."
              className="w-full text-xs bg-transparent text-navy-950 placeholder-slate-400 outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200">
            <Calendar className="h-4 w-4 text-blue-600 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Date:</span>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => handleCustomDateChange(e.target.value)}
              className="text-xs bg-transparent text-navy-950 font-bold outline-none cursor-pointer"
            />
            {departureDate && (
              <button
                type="button"
                onClick={() => handleQuickDate('ALL')}
                title="Clear date"
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200">
            <Filter className="h-4 w-4 text-amber-600 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-transparent font-bold text-navy-950 outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="DELAYED">DELAYED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
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
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 uppercase tracking-wider">Quick Filter:</span>
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
            onClick={() => handleQuickDate('TOMORROW')}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              quickDateTab === 'TOMORROW'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tomorrow ({tomorrowStr})
          </button>
          {quickDateTab === 'CUSTOM' && departureDate && (
            <span className="px-3 py-1 rounded-xl font-bold bg-amber-500 text-white text-xs shadow-sm">
              Custom Date: {departureDate}
            </span>
          )}
        </div>
      </div>

      {/* Datatable */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Flight No.</th>
                <th className="px-6 py-3.5">Airline</th>
                <th className="px-6 py-3.5">Route</th>
                <th className="px-6 py-3.5">Schedule</th>
                <th className="px-6 py-3.5">Base Fare</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    Loading flight data...
                  </td>
                </tr>
              ) : flights.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No flights found
                  </td>
                </tr>
              ) : (
                flights.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-navy-950">
                      {f.flightNumber}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <AirlineLogo airline={f.airline} size="sm" />
                        <span>{f.airline}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-navy-900">
                      <span className="font-bold">{f.departureAirport?.code}</span> ({f.departureAirport?.city}) →{' '}
                      <span className="font-bold">{f.arrivalAirport?.code}</span> ({f.arrivalAirport?.city})
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div>{formatDate(f.departureTime)}</div>
                      <div className="text-[11px] text-slate-400">
                        {formatTime(f.departureTime)} — {formatTime(f.arrivalTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-navy-950">
                      {formatVND(f.basePrice)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={f.status}
                        onChange={(e) => handleStatusChange(f.id, e.target.value)}
                        className={`rounded-lg border px-2 py-1 text-xs font-bold ${flightStatusColor(
                          f.status
                        )}`}
                      >
                        <option value="SCHEDULED">SCHEDULED</option>
                        <option value="DELAYED">DELAYED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingFlight(f)}
                          title="Edit Flight"
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setManifestFlightId(f.id)}
                          title="View Manifest"
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-300 transition-colors"
                        >
                          <Users className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(f.id, f.flightNumber)}
                          title="Delete Flight"
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddFlightModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onFlightCreated={loadFlights}
      />

      <EditFlightModal
        flight={editingFlight}
        isOpen={Boolean(editingFlight)}
        onClose={() => setEditingFlight(null)}
        onFlightUpdated={loadFlights}
      />

      <ManifestModal
        flightId={manifestFlightId}
        isOpen={Boolean(manifestFlightId)}
        onClose={() => setManifestFlightId(null)}
      />
    </div>
  )
}
