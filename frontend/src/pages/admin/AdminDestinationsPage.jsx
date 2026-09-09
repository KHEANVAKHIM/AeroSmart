import { useState, useEffect } from 'react'
import {
  Image as ImageIcon,
  Plus,
  Search,
  Edit3,
  Trash2,
  AlertCircle,
  Eye,
  EyeOff,
  Plane,
  Globe,
  RotateCcw,
} from 'lucide-react'
import { adminApi, extractErrorMessage } from '../../api/client'
import { formatVND } from '../../utils/format'
import DestinationDealModal from '../../components/admin/DestinationDealModal'
import CountrySpotlightModal from '../../components/admin/CountrySpotlightModal'
import CountryFlag from '../../components/common/CountryFlag'

export default function AdminDestinationsPage() {
  const [mainTab, setMainTab] = useState('DEALS') // 'DEALS' or 'COUNTRIES'

  // Deals state
  const [deals, setDeals] = useState([])
  const [loadingDeals, setLoadingDeals] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('ALL') // 'ALL', 'INTERNATIONAL', 'DOMESTIC'
  const [dealModalOpen, setDealModalOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)

  // Countries state
  const [countries, setCountries] = useState([])
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [countryModalOpen, setCountryModalOpen] = useState(false)
  const [editingCountry, setEditingCountry] = useState(null)

  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)

  const loadDeals = () => {
    setLoadingDeals(true)
    adminApi
      .listDestinationDeals()
      .then(setDeals)
      .catch((err) => {
        setError(extractErrorMessage(err, 'Failed to load destination deals.'))
      })
      .finally(() => {
        setLoadingDeals(false)
      })
  }

  const loadCountries = () => {
    setLoadingCountries(true)
    adminApi
      .listCountries()
      .then(setCountries)
      .catch((err) => {
        setError(extractErrorMessage(err, 'Failed to load country spotlights.'))
      })
      .finally(() => {
        setLoadingCountries(false)
      })
  }

  useEffect(() => {
    loadDeals()
    loadCountries()
  }, [])

  // Deal handlers
  const handleToggleDeal = async (deal) => {
    try {
      await adminApi.toggleDestinationDeal(deal.id)
      loadDeals()
    } catch (err) {
      alert(extractErrorMessage(err, 'Failed to toggle deal status.'))
    }
  }

  const handleDeleteDeal = async (deal) => {
    if (!window.confirm(`Are you sure you want to delete deal "${deal.titleEn}" (${deal.origin} → ${deal.destination})?`)) {
      return
    }

    try {
      await adminApi.deleteDestinationDeal(deal.id)
      loadDeals()
    } catch (err) {
      alert(extractErrorMessage(err, 'Failed to delete deal.'))
    }
  }

  // Country handlers
  const handleToggleCountry = async (c) => {
    try {
      await adminApi.toggleCountry(c.id)
      loadCountries()
    } catch (err) {
      alert(extractErrorMessage(err, 'Failed to toggle country status.'))
    }
  }

  const handleDeleteCountry = async (c) => {
    if (!window.confirm(`Are you sure you want to delete country "${c.nameEn}" (${c.countryCode.toUpperCase()})?`)) {
      return
    }

    try {
      await adminApi.deleteCountry(c.id)
      loadCountries()
    } catch (err) {
      alert(extractErrorMessage(err, 'Failed to delete country.'))
    }
  }

  // Filter deals
  const filteredDeals = deals.filter((d) => {
    if (categoryFilter !== 'ALL' && d.category !== categoryFilter) return false
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      const matchRoute = `${d.origin} ${d.destination}`.toLowerCase().includes(q)
      const matchTitle = (d.titleEn || '').toLowerCase().includes(q) || (d.titleVi || '').toLowerCase().includes(q)
      if (!matchRoute && !matchTitle) return false
    }
    return true
  })

  // Filter countries
  const filteredCountries = countries.filter((c) => {
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      const matchCode = (c.countryCode || '').toLowerCase().includes(q)
      const matchDest = (c.targetDestination || '').toLowerCase().includes(q)
      const matchName = (c.nameEn || '').toLowerCase().includes(q) || (c.nameVi || '').toLowerCase().includes(q)
      if (!matchCode && !matchDest && !matchName) return false
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-navy-950">Destinations & Homepage Media Manager</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage promotional flight cards, country discovery spotlights, country flags, and high-res imagery for the customer homepage.
          </p>
        </div>

        {mainTab === 'DEALS' ? (
          <button
            type="button"
            onClick={() => {
              setEditingDeal(null)
              setDealModalOpen(true)
            }}
            className="btn-primary py-2.5 px-4 text-xs font-bold shadow-md flex items-center gap-2 self-start"
          >
            <Plus className="h-4 w-4" />
            <span>Add Flight Deal</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditingCountry(null)
              setCountryModalOpen(true)
            }}
            className="btn-primary py-2.5 px-4 text-xs font-bold shadow-md flex items-center gap-2 self-start"
          >
            <Plus className="h-4 w-4" />
            <span>Add Explore Country</span>
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Section Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 text-sm">
        <button
          type="button"
          onClick={() => {
            setMainTab('DEALS')
            setSearch('')
          }}
          className={`flex items-center gap-2 pb-3 font-bold transition-all relative ${
            mainTab === 'DEALS'
              ? 'text-blue-600 font-black'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Plane className="h-4 w-4" />
          <span>Popular Flights Deals ({deals.length})</span>
          {mainTab === 'DEALS' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setMainTab('COUNTRIES')
            setSearch('')
          }}
          className={`flex items-center gap-2 pb-3 font-bold transition-all relative ${
            mainTab === 'COUNTRIES'
              ? 'text-blue-600 font-black'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>Explore By Country ({countries.length})</span>
          {mainTab === 'COUNTRIES' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        {mainTab === 'DEALS' ? (
          <div className="flex items-center gap-2">
            {['ALL', 'INTERNATIONAL', 'DOMESTIC'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  categoryFilter === cat
                    ? 'bg-navy-950 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'ALL CATEGORIES' : cat}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-500 font-semibold">
            Showing <strong className="text-navy-950">{filteredCountries.length}</strong> active country cards on homepage carousel
          </div>
        )}

        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={mainTab === 'DEALS' ? 'Search route or city...' : 'Search country name or code...'}
            className="w-full bg-transparent text-xs text-navy-950 placeholder-slate-400 outline-none"
          />
        </div>
      </div>

      {/* 1. Deals Table */}
      {mainTab === 'DEALS' && (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Photo</th>
                  <th className="px-6 py-3.5">Route</th>
                  <th className="px-6 py-3.5">Titles (EN / VI / KM)</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Base Fare</th>
                  <th className="px-6 py-3.5">Order</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loadingDeals ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                      Loading destination deals...
                    </td>
                  </tr>
                ) : filteredDeals.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                      No destination deals found matching filter
                    </td>
                  </tr>
                ) : (
                  filteredDeals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="h-14 w-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative group">
                          <img
                            src={deal.imageUrl}
                            alt={deal.titleEn}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=700&q=80'
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-navy-950">
                          <span>{deal.origin}</span>
                          <Plane className="h-3 w-3 text-blue-600" />
                          <span>{deal.destination}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{deal.datesEn || '—'}</div>
                      </td>
                      <td className="px-6 py-4 max-w-[220px]">
                        <div className="font-bold text-navy-950">{deal.titleEn}</div>
                        <div className="text-[11px] text-slate-500 truncate">{deal.titleVi || '—'}</div>
                        <div className="text-[11px] text-slate-400 font-khmer truncate">{deal.titleKm || '—'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            deal.category === 'INTERNATIONAL'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {deal.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-navy-950">
                        {formatVND(deal.price)}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-500 font-semibold">
                        #{deal.displayOrder}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleDeal(deal)}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all ${
                            deal.active
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {deal.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          <span>{deal.active ? 'ACTIVE' : 'INACTIVE'}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDeal(deal)
                              setDealModalOpen(true)
                            }}
                            title="Edit Deal & Photo"
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDeal(deal)}
                            title="Delete Deal"
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
      )}

      {/* 2. Countries Table */}
      {mainTab === 'COUNTRIES' && (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Flag & Photo</th>
                  <th className="px-6 py-3.5">Country (EN / VI / KM)</th>
                  <th className="px-6 py-3.5">ISO Code</th>
                  <th className="px-6 py-3.5">Target Destination</th>
                  <th className="px-6 py-3.5">Order</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loadingCountries ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                      Loading country spotlights...
                    </td>
                  </tr>
                ) : filteredCountries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                      No country spotlights found
                    </td>
                  </tr>
                ) : (
                  filteredCountries.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <CountryFlag countryCode={c.countryCode} size="lg" className="shadow-sm" />
                          <div className="h-14 w-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                            <img
                              src={c.imageUrl}
                              alt={c.nameEn}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80'
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-[220px]">
                        <div className="font-bold text-navy-950 text-sm">{c.nameEn}</div>
                        <div className="text-[11px] text-slate-500">{c.nameVi || '—'}</div>
                        <div className="text-[11px] text-slate-400 font-khmer">{c.nameKm || '—'}</div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold uppercase text-slate-700">
                        {c.countryCode}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 font-mono font-bold text-blue-700">
                          {c.targetDestination}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-500 font-semibold">
                        #{c.displayOrder}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleCountry(c)}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all ${
                            c.active
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {c.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          <span>{c.active ? 'ACTIVE' : 'INACTIVE'}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCountry(c)
                              setCountryModalOpen(true)
                            }}
                            title="Edit Country & Photo"
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCountry(c)}
                            title="Delete Country"
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
      )}

      {/* Modals */}
      <DestinationDealModal
        deal={editingDeal}
        isOpen={dealModalOpen}
        onClose={() => {
          setDealModalOpen(false)
          setEditingDeal(null)
        }}
        onSaved={loadDeals}
      />

      <CountrySpotlightModal
        country={editingCountry}
        isOpen={countryModalOpen}
        onClose={() => {
          setCountryModalOpen(false)
          setEditingCountry(null)
        }}
        onSaved={loadCountries}
      />
    </div>
  )
}

