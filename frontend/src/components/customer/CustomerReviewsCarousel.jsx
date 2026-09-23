import React from 'react'
import { Star, BadgeCheck, Quote, ThumbsUp } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function CustomerReviewsCarousel() {
  const { language } = useLanguage()
  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const reviews = [
    {
      id: 1,
      name: 'TS. Nguyễn Hoàng Nam',
      role: isVi ? 'Doanh nhân · Hà Nội' : 'Managing Director · Hanoi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      route: 'Hà Nội (HAN) ⇄ TP.HCM (SGN)',
      flightType: 'Business Class',
      rating: 5,
      comment: isVi
        ? 'Tính năng khóa giữ ghế 15 phút thực sự cứu cánh khi mình thanh toán công tác cho cả đoàn. Phòng chờ Lotus Lounge phục vụ phở bò nóng rất ngon!'
        : 'The 15-minute distributed lock guarantee is a game changer for group business travel. Lotus Lounge service was impeccable!',
    },
    {
      id: 2,
      name: 'Trần Mai Linh & Gia đình',
      role: isVi ? 'Du khách tự túc · Đà Nẵng' : 'Family Vacation · Da Nang',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      route: 'Đà Nẵng (DAD) ⇄ Bangkok (BKK)',
      flightType: 'Flight + Hotel Combo',
      rating: 5,
      comment: isVi
        ? 'Đặt combo vé máy bay và resort 5 sao Phú Quốc tiết kiệm được hơn 4 triệu đồng. Xe limousine đón tận nơi đúng giờ, tài xế cực kỳ thân thiện.'
        : 'Saved over $180 booking the flight + luxury resort combo. Chauffeur transfer was waiting right at arrival hall!',
    },
    {
      id: 3,
      name: 'David Harrison',
      role: 'Global Tech Consultant · Singapore',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      route: 'TP.HCM (SGN) ⇄ Siem Reap (SAI)',
      flightType: 'Fast-Track Priority',
      rating: 5,
      comment: isVi
        ? 'Gói an ninh Fast-Track giúp tôi vượt qua cổng soi chiếu Nội Bài chỉ trong 5 phút vào giờ cao điểm. Trải nghiệm công nghệ tuyệt vời!'
        : 'Fast-Track priority took me through busy airport security in under 5 minutes. Best travel booking experience in SE Asia.',
    },
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{isVi ? 'ĐÁNH GIÁ TỪ HÀNH KHÁCH' : 'VERIFIED PASSENGER REVIEWS'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight">
            {isVi ? 'Được Tin Dùng Bởi Hơn 500,000+ Du Khách' : 'Trusted by 500,000+ Satisfied Travelers'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isVi
              ? 'Lắng nghe những chia sẻ thực tế từ các doanh nhân, chuyên gia và gia đình đã trải nghiệm dịch vụ của AeroSmart.'
              : 'Real feedback from business professionals, experts, and families flying with AeroSmart.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-3xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-[#003580] transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                    <BadgeCheck className="h-3 w-3" />
                    <span>{isVi ? 'ĐÃ XÁC THỰC BAY' : 'VERIFIED FLIGHT'}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-navy-800 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="h-11 w-11 rounded-full object-cover border-2 border-[#003580]/20"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-navy-950 dark:text-white truncate">
                    {rev.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">{rev.role}</p>
                  <span className="text-[10px] font-mono text-[#006ce4] dark:text-sky-400 font-bold block truncate">
                    {rev.route}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
