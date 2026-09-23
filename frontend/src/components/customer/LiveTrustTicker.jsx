import React from 'react'
import { Zap, ShieldCheck, Ticket, Sparkles, Clock, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function LiveTrustTicker() {
  const { language } = useLanguage()
  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const items = [
    {
      icon: Zap,
      iconColor: 'text-amber-400',
      title: isVi ? 'Khóa Giữ Chỗ 15 Phút' : (isKm ? 'រក្សាកៅអី ១៥ នាទី' : '15-Min Guaranteed Hold'),
      desc: isVi ? 'Redisson Distributed Lock phân tán' : (isKm ? 'បច្ចេកវិទ្យាការពារកៅអី' : 'Distributed Lock Engine'),
    },
    {
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      title: isVi ? 'Đúng Giờ 99.4% OTP' : (isKm ? 'ទាន់ពេល ៩៩.៤%' : '99.4% On-Time Performance'),
      desc: isVi ? 'Chuẩn vận hành hàng không' : (isKm ? 'ស្តង់ដារអន្តរជាតិ' : 'Airline Operations SLA'),
    },
    {
      icon: Ticket,
      iconColor: 'text-sky-400',
      title: isVi ? '12,500+ Vé Tuần Này' : (isKm ? '១២,៥០០+ សំបុត្រ' : '12,500+ Bookings This Week'),
      desc: isVi ? 'Hành khách tin dùng toàn quốc' : (isKm ? 'ជឿជាក់ដោយអ្នកដំណើរ' : 'Verified passenger trust'),
    },
    {
      icon: Sparkles,
      iconColor: 'text-purple-400',
      title: isVi ? 'AI AeroMate 24/7' : (isKm ? 'ជំនួយការ AI ២៤/៧' : 'AI AeroMate Concierge'),
      desc: isVi ? 'Trợ lý tra cứu và hỗ trợ tự động' : (isKm ? 'ឆ្លើយតបស្វ័យប្រវត្តិ' : 'Live smart flight assistant'),
    },
  ]

  return (
    <div className="relative -mt-10 z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/20 bg-white/95 dark:bg-navy-900/95 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-navy-800">
          {items.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className={`flex items-center gap-3.5 ${idx > 0 ? 'pt-3 md:pt-0 md:pl-4' : ''} group`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-white dark:bg-navy-800 shadow-md group-hover:scale-110 transition-transform">
                  <Icon className={`h-5 w-5 ${item.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-navy-950 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {item.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
