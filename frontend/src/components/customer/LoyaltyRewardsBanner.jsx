import React from 'react'
import { Award, QrCode, Smartphone, Gift, ArrowRight, ShieldCheck, Star } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function LoyaltyRewardsBanner() {
  const { language } = useLanguage()
  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#001433] via-[#00224f] to-[#003580] p-6 sm:p-10 text-white shadow-2xl border border-blue-900/60">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: AeroSmart Club Perks */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 px-3 py-1 text-xs font-black uppercase tracking-wider">
              <Award className="h-4 w-4" />
              <span>AEROSMART REWARDS CLUB 2026</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isVi
                ? 'Gia Nhập AeroSmart Club · Tích Dặm Đổi Vé Miễn Phí'
                : (isKm ? 'ចូលរួមជាសមាជិក AeroSmart Club ទទួលបានពិន្ទុ' : 'Join AeroSmart Club · Earn Miles For Free Flights')}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isVi
                ? 'Nhận ngay 500 dặm thưởng khi đăng ký tài khoản. Tích lũy dặm bay trên mọi chặng để nâng hạng thẻ Silver, Gold, Platinum và nhận đặc quyền vào phòng chờ VIP miễn phí.'
                : (isKm
                  ? 'ទទួលបាន ៥០០ ពិន្ទុសម្រាប់ការចុះឈ្មោះគណនីថ្មី។ ប្តូរយកសំបុត្រយន្តហោះ និងបន្ទប់ VIP។'
                  : 'Get 500 welcome miles on sign-up. Accumulate miles to unlock Silver, Gold, Platinum tiers and complimentary VIP lounge access.')}
            </p>

            {/* Perks Icons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="text-amber-400 font-black text-sm block">10 Dặm / 1 USD</span>
                <span className="text-[11px] text-slate-300">{isVi ? 'Tích lũy trên mọi giao dịch' : 'Earn on every purchase'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="text-sky-300 font-black text-sm block">+10kg Hành Lý</span>
                <span className="text-[11px] text-slate-300">{isVi ? 'Miễn cước cho hội viên Gold' : 'Complimentary for Gold+'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="text-emerald-300 font-black text-sm block">Lối Đi Ưu Tiên</span>
                <span className="text-[11px] text-slate-300">{isVi ? 'Fast-Track tại sân bay' : 'Fast-Track airport lane'}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-navy-950 font-black text-xs px-6 py-3 shadow-xl transition-all"
              >
                <span>{isVi ? 'Đăng Ký Hội Viên Miễn Phí' : 'Join AeroSmart Club Free'}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Mobile App Download QR */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 text-center space-y-3">
            <div className="p-3 bg-white rounded-2xl shadow-xl">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://aerosmart.io/download"
                alt="AeroSmart App QR Code"
                className="h-28 w-28 object-contain"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-black text-white flex items-center justify-center gap-1.5">
                <Smartphone className="h-4 w-4 text-sky-400" />
                <span>{isVi ? 'Tải Ứng Dụng AeroSmart' : 'Download Mobile App'}</span>
              </span>
              <p className="text-[10px] text-slate-300">
                {isVi ? 'Quét mã QR để nhận thông báo chuyến bay tức thì' : 'Scan to manage flights and real-time gate radar'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
