import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Plane,
  Search,
  X,
  Clock,
  MapPin,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Activity,
} from 'lucide-react'
import { formatTime, formatDate } from '../../utils/format'
import AirlineLogo from '../common/AirlineLogo'
import { useLanguage } from '../../context/LanguageContext'

export default function FlightStatusModal({ isOpen, onClose }) {
  const { language, t } = useLanguage()
  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const [query, setQuery] = useState('VN-HASG1-0921')
  const [flightStatus, setFlightStatus] = useState({
    flightNumber: 'VN-HASG1-0921',
    airline: 'Vietnam Airlines',
    aircraft: 'Airbus A321-200 (VN-A698)',
    status: 'ON_TIME', // 'ON_TIME' | 'BOARDING' | 'DEPARTED' | 'LANDED'
    departureAirport: { code: 'HAN', name: 'Noi Bai International', city: 'Hanoi', terminal: 'T1', gate: 'Gate 04' },
    arrivalAirport: { code: 'SGN', name: 'Tan Son Nhat International', city: 'Ho Chi Minh City', terminal: 'T1', gate: 'Gate 12' },
    scheduledDeparture: '2026-09-21T08:30:00',
    estimatedDeparture: '2026-09-21T08:30:00',
    scheduledArrival: '2026-09-21T10:00:00',
    estimatedArrival: '2026-09-21T10:00:00',
    baggageClaim: 'Carousel 03',
  })
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(true)

  if (!isOpen) return null

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setTimeout(() => {
      const isVJ = query.toUpperCase().startsWith('VJ')
      setFlightStatus({
        flightNumber: query.trim().toUpperCase(),
        airline: isVJ ? 'Vietjet Air' : 'Vietnam Airlines',
        aircraft: 'Airbus A321 Neo',
        status: 'ON_TIME',
        departureAirport: { code: 'HAN', name: 'Noi Bai International', city: 'Hanoi', terminal: 'T1', gate: 'Gate 04' },
        arrivalAirport: { code: 'SGN', name: 'Tan Son Nhat International', city: 'Ho Chi Minh City', terminal: 'T1', gate: 'Gate 12' },
        scheduledDeparture: new Date().toISOString(),
        estimatedDeparture: new Date().toISOString(),
        scheduledArrival: new Date(Date.now() + 90 * 60000).toISOString(),
        estimatedArrival: new Date(Date.now() + 90 * 60000).toISOString(),
        baggageClaim: 'Carousel 03',
      })
      setSearched(true)
      setLoading(false)
    }, 400)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ON_TIME':
        return (
          <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-400/30 px-3 py-1 text-xs font-bold">
            ● {isVi ? 'ĐÚNG GIỜ' : (isKm ? 'ទាន់ពេលវេលា' : 'ON TIME')}
          </span>
        )
      case 'BOARDING':
        return (
          <span className="rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-400/30 px-3 py-1 text-xs font-bold animate-pulse">
            ● {isVi ? 'ĐANG ĐÓN KHÁCH' : (isKm ? 'កំពុងឡើងយន្តហោះ' : 'BOARDING')}
          </span>
        )
      case 'DEPARTED':
        return (
          <span className="rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-400/30 px-3 py-1 text-xs font-bold">
            ● {isVi ? 'ĐANG BAY' : (isKm ? 'កំពុងហោះហើរ' : 'EN ROUTE')}
          </span>
        )
      default:
        return (
          <span className="rounded-full bg-slate-500/15 text-slate-600 dark:text-slate-300 px-3 py-1 text-xs font-bold">
            ● {isVi ? 'ĐÃ HẠ CÁNH' : (isKm ? 'បានចុះចត' : 'LANDED')}
          </span>
        )
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-navy-950/75 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop Click */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 relative z-10">
        <div
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 dark:bg-navy-900 dark:border-navy-700 my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-[#003580] px-6 py-5 text-white flex items-center justify-between border-b border-blue-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm shadow-md">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                  AeroRadar Live Tracking
                </span>
                <h3 className="text-lg font-black text-white">
                  {isVi ? 'Tình trạng Chuyến bay Trực tiếp' : (isKm ? 'ស្ថានភាពជើងហោះហើរផ្ទាល់' : 'Live Flight Radar Status')}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={isVi ? 'Nhập số hiệu chuyến bay (VD: VN-HASG1-0921, VJ123)...' : (isKm ? 'បញ្ចូលលេខជើងហោះហើរ...' : 'Enter flight number (e.g. VN-HASG1-0921, VJ123)...')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-bold uppercase tracking-wider text-navy-950 focus:border-[#003580] focus:bg-white focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary py-2.5 px-5 text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                {loading ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Search className="h-3.5 w-3.5" />}
                <span>{isVi ? 'Tra cứu' : (isKm ? 'ស្វែងរក' : 'Track')}</span>
              </button>
            </form>

            {/* Flight Status Result Card */}
            {searched && flightStatus && (
              <div className="rounded-2xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 overflow-hidden shadow-sm space-y-4 p-5">
                {/* Top Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800 gap-3">
                  <div className="flex items-center gap-3">
                    <AirlineLogo airline={flightStatus.airline} size="md" />
                    <div>
                      <h4 className="text-base font-black text-navy-950 dark:text-white">
                        {flightStatus.airline} · <span className="text-[#006ce4] font-mono">{flightStatus.flightNumber}</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isVi ? 'Tàu bay:' : (isKm ? 'យន្តហោះ:' : 'Aircraft:')} {flightStatus.aircraft}
                      </p>
                    </div>
                  </div>

                  <div>
                    {getStatusBadge(flightStatus.status)}
                  </div>
                </div>

                {/* Route & Schedule Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Departure */}
                  <div className="md:col-span-5 space-y-1">
                    <span className="text-xs text-slate-400 font-medium">{isVi ? 'Khởi hành' : (isKm ? 'ចេញដំណើរ' : 'Departure')}</span>
                    <p className="text-2xl font-black text-navy-950 dark:text-white font-mono">
                      {flightStatus.departureAirport.code}
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {flightStatus.departureAirport.city}
                    </p>
                    <p className="text-sm font-bold text-[#006ce4]">
                      {formatTime(flightStatus.scheduledDeparture)}
                    </p>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      <span className="inline-block rounded bg-slate-100 dark:bg-navy-800 px-2 py-0.5 font-bold mr-1">
                        {flightStatus.departureAirport.terminal}
                      </span>
                      <span className="inline-block rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 px-2 py-0.5 font-bold">
                        {flightStatus.departureAirport.gate}
                      </span>
                    </div>
                  </div>

                  {/* Center Route Arrow */}
                  <div className="md:col-span-2 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-slate-400">1h30m</span>
                    <div className="flex items-center gap-1 my-1">
                      <div className="h-[2px] w-6 bg-slate-300 dark:bg-navy-700" />
                      <Plane className="h-4 w-4 text-[#003580] dark:text-sky-400 rotate-90" />
                      <div className="h-[2px] w-6 bg-slate-300 dark:bg-navy-700" />
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold">{isVi ? 'Bay thẳng' : (isKm ? 'ហោះត្រង់' : 'Direct')}</span>
                  </div>

                  {/* Arrival */}
                  <div className="md:col-span-5 text-right space-y-1">
                    <span className="text-xs text-slate-400 font-medium">{isVi ? 'Hạ cánh' : (isKm ? 'មកដល់' : 'Arrival')}</span>
                    <p className="text-2xl font-black text-navy-950 dark:text-white font-mono">
                      {flightStatus.arrivalAirport.code}
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {flightStatus.arrivalAirport.city}
                    </p>
                    <p className="text-sm font-bold text-[#006ce4]">
                      {formatTime(flightStatus.scheduledArrival)}
                    </p>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      <span className="inline-block rounded bg-slate-100 dark:bg-navy-800 px-2 py-0.5 font-bold mr-1">
                        {flightStatus.arrivalAirport.terminal}
                      </span>
                      <span className="inline-block rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 font-bold">
                        {flightStatus.baggageClaim}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 dark:bg-navy-950 px-6 py-4 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isVi ? 'Dữ liệu bay đồng bộ trực tiếp với Đài Kiểm Soát Không Lưu' : (isKm ? 'ទិន្នន័យស្របគ្នាផ្ទាល់ជាមួយប៉មត្រួតពិនិត្យ' : 'Real-time telemetry synced with Air Traffic Control')}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="btn-outline py-2 px-5 text-xs font-bold"
            >
              {isVi ? 'Đóng' : (isKm ? 'បិទ' : 'Close')}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
