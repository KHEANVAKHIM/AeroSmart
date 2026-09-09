import { useState, useEffect } from 'react'
import { X, Users, Printer, Download, Search, Plane, Armchair } from 'lucide-react'
import { adminApi } from '../../api/client'

export default function ManifestModal({ flightId, isOpen, onClose }) {
  const [manifest, setManifest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (isOpen && flightId) {
      setLoading(true)
      setSearch('')
      adminApi
        .manifest(flightId)
        .then(setManifest)
        .catch(() => {})
        .finally(() => {
          setLoading(false)
        })
    }
  }, [isOpen, flightId])

  if (!isOpen) return null

  const filteredPassengers = (manifest?.passengers || []).filter((p) => {
    if (!search.trim()) return true
    const q = search.trim().toLowerCase()
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.passportNumber.toLowerCase().includes(q) ||
      (p.seatNumber && p.seatNumber.toLowerCase().includes(q))
    )
  })

  const handleExportCSV = () => {
    if (!manifest?.passengers?.length) return
    const headers = ['No', 'Full Name', 'Passport / ID', 'Seat Number', 'Seat Class']
    const rows = manifest.passengers.map((p, idx) => [
      idx + 1,
      `"${p.fullName.replace(/"/g, '""')}"`,
      `"${p.passportNumber}"`,
      `"${p.seatNumber || ''}"`,
      `"${p.seatClass || ''}"`,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `Flight_${manifest.flightNumber}_Passenger_Manifest.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-navy-950">
                Flight {manifest?.flightNumber} Passenger Manifest
              </h3>
              <p className="text-xs text-slate-500">
                {manifest?.airline} · {manifest?.origin} → {manifest?.destination} · {manifest?.departureTime}
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

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Loading passenger manifest...
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl text-xs">
              <span className="text-slate-600">
                Total Confirmed Passengers: <strong className="text-navy-950">{manifest?.totalPassengers || 0}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={!manifest?.passengers?.length}
                  className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1 disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Manifest</span>
                </button>
              </div>
            </div>

            {/* Quick search */}
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50/50">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search passenger legal name, passport doc, seat..."
                className="w-full bg-transparent text-navy-950 placeholder-slate-400 outline-none text-xs"
              />
            </div>

            <div className="max-h-80 overflow-y-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Passenger Legal Name</th>
                    <th className="px-4 py-3">Passport / ID</th>
                    <th className="px-4 py-3">Seat</th>
                    <th className="px-4 py-3">Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredPassengers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        {manifest?.passengers?.length === 0
                          ? 'No passengers have booked on this flight yet.'
                          : 'No matching passengers found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredPassengers.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="px-4 py-3 font-bold text-navy-950 uppercase">{p.fullName}</td>
                        <td className="px-4 py-3 font-mono">{p.passportNumber}</td>
                        <td className="px-4 py-3 font-bold text-cyan-700">{p.seatNumber}</td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold">
                            {p.seatClass}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
