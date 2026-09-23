import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Flame, Clock, Copy, Check, ArrowRight, Sparkles, Plane, Tag } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function FlashSaleBanner() {
  const { language } = useLanguage()
  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 19 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return { hours: 5, minutes: 59, seconds: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCopyCode = () => {
    navigator.clipboard.writeText('AEROSMART2026')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const promoRoutes = [
    { from: 'Hà Nội (HAN)', to: 'TP.HCM (SGN)', price: '799.000đ', off: '-35%' },
    { from: 'Đà Nẵng (DAD)', to: 'Bangkok (BKK)', price: '1.299.000đ', off: '-25%' },
    { from: 'TP.HCM (SGN)', to: 'Siem Reap (SAI)', price: '1.450.000đ', off: '-30%' },
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#00205B] via-[#003580] to-[#0A4B9C] p-6 sm:p-10 text-white shadow-2xl border border-blue-900/60">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Promotion Info & Countdown */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-navy-950 px-3 py-1 text-xs font-black uppercase tracking-wider shadow">
                <Flame className="h-3.5 w-3.5 fill-navy-950" />
                <span>FLASH SALE GIỜ VÀNG 2026</span>
              </span>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-amber-300 border border-white/15">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {isVi
                ? 'Mở Bán Vé Mùa Thu Vàng 2026 · Giảm Tới 35%'
                : (isKm ? 'ការលក់សំបុត្រពិសេស ២០២៦ · បញ្ចុះតម្លៃ ៣៥%' : 'Autumn Wings 2026 Flash Sale · Save Up To 35%')}
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
              {isVi
                ? 'Áp dụng cho tất cả chuyến bay nội địa và Đông Nam Á. Nhập mã ưu đãi độc quyền khi thanh toán để nhận ngay giảm giá.'
                : (isKm
                  ? 'អនុវត្តសម្រាប់រាល់ជើងហោះហើរក្នុងស្រុក និងអាស៊ីអាគ្នេយ៍។ បញ្ចូលកូដបញ្ចុះតម្លៃដើម្បីទទួលបានការសន្សំ។'
                  : 'Valid across all domestic and Southeast Asia network flights. Enter the exclusive coupon at checkout.')}
            </p>

            {/* Promo Code Copy Box */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 text-xs">
                <Tag className="h-4 w-4 text-amber-300" />
                <span className="text-slate-300">{isVi ? 'Mã ưu đãi:' : 'Coupon Code:'}</span>
                <span className="font-mono font-black text-amber-300 tracking-wider text-sm">AEROSMART2026</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="ml-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-navy-950 font-bold px-2.5 py-1 text-[11px] transition-all flex items-center gap-1 shadow"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? (isVi ? 'Đã sao chép' : 'Copied') : (isVi ? 'Sao Chép' : 'Copy')}</span>
                </button>
              </div>

              <Link
                to="/flights"
                className="inline-flex items-center gap-2 rounded-2xl bg-white text-[#003580] hover:bg-slate-100 px-6 py-2.5 text-xs font-black shadow-xl transition-all group"
              >
                <span>{isVi ? 'Săn Vé Giờ Vàng Ngay' : 'Book Flash Deals Now'}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Route Highlights */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {isVi ? '⚡ Các Chặng Bay Giảm Sâu Hôm Nay:' : '⚡ Top Discounted Routes Today:'}
            </span>

            <div className="space-y-2.5">
              {promoRoutes.map((r, i) => (
                <Link
                  key={i}
                  to="/flights"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/20 text-sky-300 border border-sky-400/30">
                      <Plane className="h-4 w-4 -rotate-45" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                        {r.from} → {r.to}
                      </div>
                      <span className="text-[10px] text-slate-300">Chuyến bay thẳng hàng ngày</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-amber-300 block font-mono">{r.price}</span>
                    <span className="inline-block text-[9px] font-black uppercase text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      {r.off}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
