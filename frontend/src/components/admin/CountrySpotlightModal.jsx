import { useState, useEffect } from 'react'
import { X, Globe, Image as ImageIcon, MapPin } from 'lucide-react'
import { adminApi, extractErrorMessage } from '../../api/client'
import CountryFlag from '../common/CountryFlag'

export default function CountrySpotlightModal({ country, isOpen, onClose, onSaved }) {
  const isEdit = Boolean(country?.id)

  const [formData, setFormData] = useState({
    countryCode: 'gb',
    nameEn: '',
    nameVi: '',
    nameKm: '',
    targetDestination: 'LHR',
    imageUrl: '',
    displayOrder: 0,
    active: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (country) {
      setFormData({
        countryCode: country.countryCode || 'gb',
        nameEn: country.nameEn || '',
        nameVi: country.nameVi || '',
        nameKm: country.nameKm || '',
        targetDestination: country.targetDestination || 'LHR',
        imageUrl: country.imageUrl || '',
        displayOrder: country.displayOrder || 0,
        active: country.active !== undefined ? country.active : true,
      })
    } else {
      setFormData({
        countryCode: 'gb',
        nameEn: 'United Kingdom',
        nameVi: 'Vương Quốc Anh',
        nameKm: 'ចក្រភពអង់គ្លេស',
        targetDestination: 'LHR',
        imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80',
        displayOrder: 0,
        active: true,
      })
    }
    setError(null)
  }, [country, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        countryCode: formData.countryCode.toLowerCase().trim(),
        targetDestination: formData.targetDestination.toUpperCase().trim(),
        displayOrder: Number(formData.displayOrder),
      }

      if (isEdit) {
        await adminApi.updateCountry(country.id, payload)
      } else {
        await adminApi.createCountry(payload)
      }

      onSaved()
      onClose()
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to save country spotlight.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
              <Globe className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-navy-950">
                {isEdit ? 'Edit Explore Country' : 'Add New Explore Country & Photo'}
              </h3>
              <p className="text-xs text-slate-500">
                Manage destination country cards, circular flag badges, and scenery photos on the homepage.
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
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Country Code & Flag Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 mb-1 block">
                ISO 2-Letter Country Code (e.g. gb, fr, kh, sg, vn, th, jp, kr, us)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  required
                  maxLength={2}
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value.toLowerCase() })}
                  placeholder="e.g. gb"
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none font-mono font-bold text-navy-950 uppercase"
                />
                <div className="flex items-center justify-center p-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                  <CountryFlag countryCode={formData.countryCode} size="lg" />
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1 block">Target Destination Airport</label>
              <input
                type="text"
                required
                maxLength={3}
                value={formData.targetDestination}
                onChange={(e) => setFormData({ ...formData, targetDestination: e.target.value.toUpperCase() })}
                placeholder="e.g. LHR, CDG, SAI, SIN, DAD, BKK"
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none font-mono font-bold text-navy-950 uppercase"
              />
            </div>
          </div>

          {/* Titles in 3 languages */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
              Multi-Language Country Names
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">🇺🇸 English Name</label>
                <input
                  type="text"
                  required
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="United Kingdom"
                  className="w-full rounded-xl border border-slate-200 p-2 outline-none font-medium bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">🇻🇳 Tiếng Việt</label>
                <input
                  type="text"
                  value={formData.nameVi}
                  onChange={(e) => setFormData({ ...formData, nameVi: e.target.value })}
                  placeholder="Vương Quốc Anh"
                  className="w-full rounded-xl border border-slate-200 p-2 outline-none font-medium bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">🇰🇭 Khmer</label>
                <input
                  type="text"
                  value={formData.nameKm}
                  onChange={(e) => setFormData({ ...formData, nameKm: e.target.value })}
                  placeholder="ចក្រភពអង់គ្លេស"
                  className="w-full rounded-xl border border-slate-200 p-2 outline-none font-medium bg-white font-khmer"
                />
              </div>
            </div>
          </div>

          {/* Image URL & Live Preview */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block">Country Scenery Photo URL</label>
            <input
              type="url"
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-slate-200 p-2.5 outline-none text-xs text-navy-950 font-mono"
            />
            {formData.imageUrl && (
              <div className="mt-2 flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="relative h-24 w-20 rounded-xl overflow-hidden shadow-sm border border-slate-200 shrink-0">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80'
                    }}
                  />
                  <div className="absolute bottom-1 left-1 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded text-[9px] text-white">
                    <CountryFlag countryCode={formData.countryCode} size="xs" />
                  </div>
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <p className="font-bold text-navy-950">Live Vertical Card Preview (4:5 Ratio)</p>
                  <p className="text-[11px]">Will be displayed in "Explore by country" section with circular flag.</p>
                </div>
              </div>
            )}
          </div>

          {/* Status & Display Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 mb-1 block">Display Order</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none font-medium text-navy-950"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1 block">Visibility Status</label>
              <select
                value={formData.active ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none font-semibold text-navy-950 bg-slate-50"
              >
                <option value="true">Active (Visible)</option>
                <option value="false">Inactive (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline py-2.5 px-4 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-2.5 px-5 text-xs font-bold disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Country' : 'Add Country'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
