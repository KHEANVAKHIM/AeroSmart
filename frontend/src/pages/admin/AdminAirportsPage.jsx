import { useState, useEffect } from 'react'
import {
  Building2,
  Plus,
  Search,
  Edit3,
  Trash2,
  AlertCircle,
  MapPin,
  CheckCircle,
  X,
  Globe,
} from 'lucide-react'
import { adminApi, extractErrorMessage } from '../../api/client'

export default function AdminAirportsPage() {
  const [airports, setAirports] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAirport, setEditingAirport] = useState(null)
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('Vietnam')
  const [modalSubmitting, setModalSubmitting] = useState(false)
  const [modalError, setModalError] = useState(null)

  const loadAirports = () => {
    setLoading(true)
    adminApi
      .listAirports()
      .then(setAirports)
      .catch((err) => {
        setError(extractErrorMessage(err, 'Failed to load airport hubs.'))
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadAirports()
  }, [])

  const handleOpenAdd = () => {
    setEditingAirport(null)
    setCode('')
    setName('')
    setCity('')
    setCountry('Vietnam')
    setModalError(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (airport) => {
    setEditingAirport(airport)
    setCode(airport.code)
    setName(airport.name)
    setCity(airport.city)
    setCountry(airport.country)
    setModalError(null)
    setModalOpen(true)
  }

  const handleDelete = async (airport) => {
    if (!window.confirm(`Are you sure you want to delete airport hub ${airport.code} (${airport.city})?`)) {
      return
    }

    try {
      await adminApi.deleteAirport(airport.code)
      loadAirports()
    } catch (err) {
      alert(extractErrorMessage(err, 'Failed to delete airport hub.'))
    }
  }

  const handleModalSubmit = async (e) => {
    e.preventDefault()
    setModalSubmitting(true)
    setModalError(null)

    try {
      if (editingAirport) {
        await adminApi.updateAirport(editingAirport.code, {
          code: code.trim().toUpperCase(),
          name: name.trim(),
          city: city.trim(),
          country: country.trim(),
        })
      } else {
        await adminApi.createAirport({
          code: code.trim().toUpperCase(),
          name: name.trim(),
          city: city.trim(),
          country: country.trim(),
        })
      }
      loadAirports()
      setModalOpen(false)
    } catch (err) {
      setModalError(extractErrorMessage(err, 'Failed to save airport hub.'))
    } finally {
      setModalSubmitting(false)
    }
  }

  const filteredAirports = airports.filter((a) => {
    if (!search.trim()) return true
    const q = search.trim().toLowerCase()
    return (
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950">Airport & Hub Network</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage international & domestic airport IATA codes, cities, and country destinations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-primary py-2.5 px-4 text-xs font-bold shadow-md flex items-center gap-2 self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Airport</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by IATA code, airport name, or city..."
          className="w-full text-xs text-navy-950 placeholder-slate-400 outline-none"
        />
      </div>

      {/* Datatable */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">IATA Code</th>
                <th className="px-6 py-3.5">Airport Name</th>
                <th className="px-6 py-3.5">City Hub</th>
                <th className="px-6 py-3.5">Country</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    Loading airport hubs...
                  </td>
                </tr>
              ) : filteredAirports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No airport hubs found
                  </td>
                </tr>
              ) : (
                filteredAirports.map((a) => (
                  <tr key={a.code} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-black text-cyan-700 text-sm">
                      {a.code}
                    </td>
                    <td className="px-6 py-4 font-bold text-navy-950">
                      {a.name}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {a.city}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold">
                        {a.country}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(a)}
                          title="Edit Airport"
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(a)}
                          title="Delete Airport"
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                  <Building2 className="h-5 w-5" />
                </span>
                <h3 className="text-base font-bold text-navy-950">
                  {editingAirport ? `Edit Airport Hub (${editingAirport.code})` : 'Add New Airport Hub'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="space-y-4 text-xs">
              <div>
                <label className="label">IATA Code (3 letters)</label>
                <input
                  type="text"
                  required
                  maxLength={3}
                  disabled={Boolean(editingAirport)}
                  placeholder="e.g. DAD, HAN, SIN"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="input uppercase font-mono font-bold"
                />
              </div>

              <div>
                <label className="label">Full Airport Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Da Nang International Airport"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">City Hub</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Da Nang"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input font-medium"
                  />
                </div>

                <div>
                  <label className="label">Country</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vietnam"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="input font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-ghost py-2.5 px-4 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="btn-primary py-2.5 px-6 text-xs font-bold"
                >
                  {modalSubmitting ? 'Saving...' : editingAirport ? 'Save Changes' : 'Create Airport Hub'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
