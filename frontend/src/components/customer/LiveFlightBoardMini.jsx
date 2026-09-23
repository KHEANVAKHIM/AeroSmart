import React, { useState } from 'react'
import { Plane, Search, Clock, MapPin, Radio, ShieldCheck, ArrowRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function LiveFlightBoardMini() {
  const { language } = useLanguage()
  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const [searchFilter, setSearchFilter] = useState('')
  const [boardType, setBoardType] = useState('DEPARTURE') // 'DEPARTURE' | 'ARRIVAL'

  const liveFlights = [
    {
      flightNo: 'VN-HASG1',
      airline: 'Vietnam Airlines',
      route: 'Hà Nội (HAN) → TP.HCM (SGN)',
      schedTime: '15:30',
      estTime: '15:30',
      gate: '12A',
      terminal: 'T1',
      belt: 'B4',
      status: 'ĐÚNG GIỜ',
      statusEn: 'ON TIME',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      flightNo: 'VJ-SGDA2',
      airline: 'Vietjet Air',
      route: 'TP.HCM (SGN) → Đà Nẵng (DAD)',
      schedTime: '15:45',
      estTime: '15:50',
      gate: '06',
      terminal: 'T1',
      belt: 'B2',
      status: 'ĐANG LÊN MÁY BAY',
      statusEn: 'BOARDING',
      statusColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 animate-pulse',
    },
    {
      flightNo: 'QH-HADA3',
      airline: 'Bamboo Airways',
      route: 'Hà Nội (HAN) → Đà Nẵng (DAD)',
      schedTime: '16:15',
      estTime: '16:15',
      gate: '08B',
      terminal: 'T1',
      belt: 'B1',
      status: 'ĐÚNG GIỜ',
      statusEn: 'ON TIME',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      flightNo: 'K6-SAI01',
      airline: 'Cambodia Angkor Air',
      route: 'TP.HCM (SGN) → Siem Reap (SAI)',
      schedTime: '16:40',
      estTime: '16:40',
      gate: '24',
      terminal: 'T2 Quốc tế',
      belt: 'B7',
      status: 'CHUẨN BỊ BAY',
      statusEn: 'SCHEDULED',
      statusColor: 'bg-sky-100 text-[#003580] border-sky-300 dark:bg-sky-950 dark:text-sky-200',
    },
    {
      flightNo: 'TG-BKKS1',
      airline: 'Thai Airways',
      route: 'Bangkok (BKK) → TP.HCM (SGN)',
      schedTime: '17:10',
      estTime: '17:10',
      gate: '19',
      terminal: 'T2 Quốc tế',
      belt: 'B6',
      status: 'ĐÃ CẤT CÁNH',
      statusEn: 'DEPARTED',
      statusColor: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-200',
    },
  ]

  const filtered = liveFlights.filter(
    (f) =>
      f.flightNo.toLowerCase().includes(searchFilter.toLowerCase()) ||
      f.route.toLowerCase().includes(searchFilter.toLowerCase()) ||
      f.airline.toLowerCase().includes(searchFilter.toLowerCase())
  )

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="rounded-3xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#00205B] px-6 py-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-400/30">
              <Radio className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider mb-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE RADAR DISPATCH · TỰ ĐỘNG CẬP NHẬT</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {isVi ? 'Bảng Thông Tin Chuyến Bay Trực Tiếp' : (isKm ? 'ព័ត៌មានជើងហោះហើរផ្ទាល់' : 'Live Flight Status Board')}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={isVi ? 'Tra số hiệu hoặc điểm đến...' : 'Search flight or city...'}
                className="w-full rounded-xl bg-navy-950 border border-white/20 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-navy-950 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-navy-800">
              <tr>
                <th className="py-3 px-4 sm:px-6">{isVi ? 'Số hiệu' : 'Flight'}</th>
                <th className="py-3 px-4">{isVi ? 'Hãng bay' : 'Airline'}</th>
                <th className="py-3 px-4">{isVi ? 'Hành trình' : 'Route'}</th>
                <th className="py-3 px-4">{isVi ? 'Giờ bay' : 'Time'}</th>
                <th className="py-3 px-4">{isVi ? 'Cổng / Ga' : 'Gate / Terminal'}</th>
                <th className="py-3 px-4">{isVi ? 'Băng chuyền' : 'Baggage'}</th>
                <th className="py-3 px-4 text-right sm:pr-6">{isVi ? 'Trạng thái' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800 font-medium">
              {filtered.map((f, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-sky-50/50 dark:hover:bg-navy-950/50 transition-colors"
                >
                  <td className="py-3.5 px-4 sm:px-6 font-mono font-black text-[#003580] dark:text-sky-300">
                    {f.flightNo}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-navy-950 dark:text-white">
                    {f.airline}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {f.route}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-navy-950 dark:text-white">
                    {f.schedTime}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                    Cổng <span className="font-bold text-navy-950 dark:text-white">{f.gate}</span> ({f.terminal})
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                    {f.belt}
                  </td>
                  <td className="py-3.5 px-4 text-right sm:pr-6">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase ${f.statusColor}`}>
                      ● {isVi ? f.status : f.statusEn}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
