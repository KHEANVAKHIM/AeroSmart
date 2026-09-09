import { useState, useEffect } from 'react'
import { X, Image as ImageIcon, Sparkles, MapPin, DollarSign, Calendar, Globe } from 'lucide-react'
import { adminApi, extractErrorMessage } from '../../api/client'

export default function DestinationDealModal({ deal, isOpen, onClose, onSaved }) {
  const isEdit = Boolean(deal?.id)

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    titleEn: '',
    titleVi: '',
    titleKm: '',
    category: 'INTERNATIONAL',
    imageUrl: '',
    price: '',
    datesEn: '',
    datesVi: '',
    datesKm: '',
    displayOrder: 0,
    active: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (deal) {
      setFormData({
        origin: deal.origin || '',
        destination: deal.destination || '',
        titleEn: deal.titleEn || '',
        titleVi: deal.titleVi || '',
        titleKm: deal.titleKm || '',
        category: deal.category || 'INTERNATIONAL',
        imageUrl: deal.imageUrl || '',
        price: deal.price || '',
        datesEn: deal.datesEn || '',
        datesVi: deal.datesVi || '',
        datesKm: deal.datesKm || '',
        displayOrder: deal.displayOrder || 0,
        active: deal.active !== undefined ? deal.active : true,
      })
    } else {
      setFormData({
        origin: 'HAN',
        destination: 'BKK',
        titleEn: 'Hanoi to Bangkok',
        titleVi: 'Hà Nội đến Bangkok',
        titleKm: 'ហាណូយ ទៅ បាងកក',
        category: 'INTERNATIONAL',
        imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=700&q=80',
        price: '1890000',
        datesEn: 'Sep 11 - Sep 13 · Round-trip',
        datesVi: '11 Th9 - 13 Th9 · Khứ hồi',
        datesKm: '11 កញ្ញា - 13 កញ្ញា · ទៅមក',
        displayOrder: 0,
        active: true,
      })
    }
    setError(null)
  }, [deal, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        displayOrder: Number(formData.displayOrder),
      }

      if (isEdit) {
        await adminApi.updateDestinationDeal(deal.id, payload)
      } else {
        await adminApi.createDestinationDeal(payload)
      }

      onSaved()
      onClose()
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to save destination deal.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <ImageIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-navy-950">
                {isEdit ? 'Edit Destination Deal' : 'Add New Destination Deal & Photo'}
              </h3>
              <p className="text-xs text-slate-500">
                Configure promotional cards, destination imagery, and flight pricing shown on the homepage.
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
          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 mb-1 block">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none font-semibold text-navy-950 bg-slate-50"
              >
                <option value="INTERNATIONAL">International (Quốc tế)</option>
                <option value="DOMESTIC">Domestic (Nội địa)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1 block">Display Status</label>
              <select
                value={formData.active ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none font-semibold text-navy-950 bg-slate-50"
              >
                <option value="true">Active (Visible on Homepage)</option>
                <option value="false">Inactive (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Route & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 mb-1 block">Origin Airport Code</label>
              <input
                type="text"
                required
                maxLength={3}
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value.toUpperCase() })}
                placeholder="e.g. HAN"
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none uppercase font-mono font-bold text-navy-950"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1 block">Destination Code</label>
              <input
                type="text"
                required
                maxLength={3}
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value.toUpperCase() })}
                placeholder="e.g. BKK"
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none uppercase font-mono font-bold text-navy-950"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1 block">Base Price (VND)</label>
              <input
                type="number"
                required
                min={0}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="1890000"
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none font-bold text-navy-950"
              />
            </div>
          </div>

          {/* Titles in 3 languages */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
              Multi-Language Destination Titles
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">🇺🇸 English Title</label>
                <input
                  type="text"
                  required
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="Hanoi to Bangkok"
                  className="w-full rounded-xl border border-slate-200 p-2 outline-none font-medium bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">🇻🇳 Tiếng Việt Title</label>
                <input
                  type="text"
                  value={formData.titleVi}
                  onChange={(e) => setFormData({ ...formData, titleVi: e.target.value })}
                  placeholder="Hà Nội đến Bangkok"
                  className="w-full rounded-xl border border-slate-200 p-2 outline-none font-medium bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">🇰🇭 Khmer Title</label>
                <input
                  type="text"
                  value={formData.titleKm}
                  onChange={(e) => setFormData({ ...formData, titleKm: e.target.value })}
                  placeholder="ហាណូយ ទៅ បាងកក"
                  className="w-full rounded-xl border border-slate-200 p-2 outline-none font-medium bg-white font-khmer"
                />
              </div>
            </div>
          </div>

          {/* Image URL & Live Preview */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block">Image URL</label>
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
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="h-20 w-28 rounded-xl object-cover border border-slate-200 shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=700&q=80'
                  }}
                />
                <div className="text-xs text-slate-500 space-y-1">
                  <p className="font-bold text-navy-950">Live Photo Preview</p>
                  <p className="text-[11px]">Will be displayed in 4:3 card ratio on customer homepage carousel.</p>
                </div>
              </div>
            )}
          </div>

          {/* Dates format & Display Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 mb-1 block">Dates Summary (EN)</label>
              <input
                type="text"
                value={formData.datesEn}
                onChange={(e) => setFormData({ ...formData, datesEn: e.target.value })}
                placeholder="Sep 11 - Sep 13 · Round-trip"
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none font-medium text-navy-950"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1 block">Display Order (Lower = First)</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none font-medium text-navy-950"
              />
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
              {loading ? 'Saving...' : isEdit ? 'Update Deal' : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
