import React, { useState } from 'react'
import {
  Crown,
  Briefcase,
  Sparkles,
  Plane,
  Tv,
  Utensils,
  Wifi,
  Luggage,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function CabinExperienceShowcase() {
  const { language } = useLanguage()
  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const [activeTab, setActiveTab] = useState('BUSINESS') // 'FIRST' | 'BUSINESS' | 'PREMIUM' | 'ECONOMY'

  const cabinClasses = [
    {
      id: 'FIRST',
      name: isVi ? 'First Class Suite' : 'First Class Private Suite',
      tagline: isVi ? 'Đẳng Cấp Hoàng Gia & Buồng Ngủ Riêng Biệt' : 'Ultra-Luxury Private Sky Sanctuary',
      icon: Crown,
      badge: isVi ? 'HẠNG NHẤT ĐỘC BẢN' : 'FIRST CLASS LUXURY',
      badgeColor: 'bg-amber-400 text-navy-950 font-black',
      coverImg: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&auto=format&fit=crop&q=80',
      specs: [
        { label: isVi ? 'Độ ngả ghế' : 'Bed Angle', value: '180° Full Flat Bed' },
        { label: isVi ? 'Màn hình giải trí' : 'Entertainment', value: '32" 4K OLED Touchscreen' },
        { label: isVi ? 'Ẩm thực thượng hạng' : 'Dining', value: 'Caviar & Dom Pérignon Vintage' },
        { label: isVi ? 'Hành lý ký gửi' : 'Baggage Allowance', value: '50 kg + 2 kiện xách tay' },
      ],
      highlights: isVi
        ? [
            'Cửa buồng trượt riêng tư tuyệt đối có đèn điều chỉnh theo tâm trạng',
            'Bộ chăn ga gối đệm lông vũ cao cấp Frette của Ý',
            'Bộ sản phẩm dưỡng da cao cấp Bvlgari & tai nghe chống ồn Bose',
            'Xe limousine đón tận chân máy bay & phòng chờ VIP Tổng thống',
          ]
        : [
            'Full-height sliding private suite door with ambient mood lighting',
            'Italian Frette plush feather duvet & memory foam mattress',
            'Exclusive Bvlgari luxury skincare kit & Bose noise-cancelling headphones',
            'Tarmac VIP limousine transfer & Presidential airport lounge access',
          ],
    },
    {
      id: 'BUSINESS',
      name: isVi ? 'Business Class Lie-Flat' : 'Business Class Lie-Flat',
      tagline: isVi ? 'Không Gian Làm Việc & Nghỉ Ngơi Thương Gia' : 'Seamless Productivity & Rest at 35,000ft',
      icon: Briefcase,
      badge: isVi ? 'BÁN CHẠY NHẤT' : 'MOST POPULAR',
      badgeColor: 'bg-sky-500 text-white font-black',
      coverImg: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&auto=format&fit=crop&q=80',
      specs: [
        { label: isVi ? 'Độ ngả ghế' : 'Bed Angle', value: '180° Lie-Flat Bed' },
        { label: isVi ? 'Lối đi riêng' : 'Aisle Access', value: 'Cấu hình 1-2-1 trực tiếp' },
        { label: isVi ? 'Màn hình HD' : 'Screen', value: '18" Full HD Touchscreen' },
        { label: isVi ? 'Hành lý ký gửi' : 'Baggage', value: '40 kg + 2 kiện xách tay' },
      ],
      highlights: isVi
        ? [
            'Ghế ngả phẳng 180° thành giường ngủ êm ái dài 2 mét',
            'Bàn làm việc lớn tích hợp sạc không dây & cổng cắm máy tính đa năng',
            'Thực đơn ẩm thực 4 món nóng kèm bộ sưu tập rượu vang thượng hạng',
            'Ưu tiên check-in, soi chiếu an ninh Fast-Track & phòng chờ Lotus Lounge',
          ]
        : [
            '180-degree lie-flat bed extending to a spacious 2-meter length',
            'Large workstation with wireless phone charger & universal AC sockets',
            'Gourmet 4-course hot dining menu paired with sommelier wine selection',
            'Priority Fast-Track check-in, boarding & Lotus Lounge VIP pass',
          ],
    },
    {
      id: 'PREMIUM',
      name: isVi ? 'Premium Economy' : 'Premium Economy Class',
      tagline: isVi ? 'Khoảng Cách Ghế Rộng Rãi & Tiện Nghi Nâng Cấp' : 'Extra Legroom & Enhanced Comfort',
      icon: Sparkles,
      badge: isVi ? 'TIẾT KIỆM & THOẢI MÁI' : 'GREAT VALUE',
      badgeColor: 'bg-purple-500 text-white font-black',
      coverImg: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1000&auto=format&fit=crop&q=80',
      specs: [
        { label: isVi ? 'Khoảng cách ghế' : 'Seat Pitch', value: '38 inch (Rộng hơn 20%)' },
        { label: isVi ? 'Độ ngả lưng' : 'Recline', value: 'Ngả sâu 8 inch có đỡ chân' },
        { label: isVi ? 'Màn hình' : 'Screen', value: '13.3" HD Touchscreen' },
        { label: isVi ? 'Hành lý ký gửi' : 'Baggage', value: '30 kg tiêu chuẩn' },
      ],
      highlights: isVi
        ? [
            'Ghế đệm công thái học bọc da cao cấp có đệm đỡ bắp chân',
            'Cổng sạc USB tại từng ghế và Wi-Fi tốc độ cao trên chuyến bay',
            'Suất ăn nóng chọn trước kèm đồ uống chào mừng lúc lên máy bay',
            'Lên tàu bay bằng cửa ưu tiên (Priority Boarding)',
          ]
        : [
            'Ergonomic leather seating with dedicated calf & foot rests',
            'Individual USB charging ports & high-speed in-flight Wi-Fi',
            'Pre-selected gourmet hot meals with welcome beverage on board',
            'Priority boarding lane for swift embarking',
          ],
    },
    {
      id: 'ECONOMY',
      name: isVi ? 'Economy Smart' : 'Economy Smart Class',
      tagline: isVi ? 'Bay Thông Minh Với Chi Phí Tối Ưu' : 'Smart Value Travel with Modern Amenities',
      icon: Plane,
      badge: isVi ? 'GIÁ TỐT NHẤT' : 'BEST FARE',
      badgeColor: 'bg-emerald-500 text-white font-black',
      coverImg: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=1000&auto=format&fit=crop&q=80',
      specs: [
        { label: isVi ? 'Khoảng cách ghế' : 'Seat Pitch', value: '31 - 32 inch tiêu chuẩn' },
        { label: isVi ? 'Tựa đầu' : 'Headrest', value: 'Tựa đầu 6 hướng điều chỉnh' },
        { label: isVi ? 'Giải trí' : 'Entertainment', value: 'Hơn 500 phim & bài hát' },
        { label: isVi ? 'Hành lý ký gửi' : 'Baggage', value: '23 kg tiêu chuẩn' },
      ],
      highlights: isVi
        ? [
            'Ghế ngồi siêu mỏng thế hệ mới tối ưu không gian để chân',
            'Màn hình giải trí cảm ứng sắc nét với kho phim bom tấn phong phú',
            'Suất ăn nóng và nước uống miễn phí trên các chặng bay từ 1.5 giờ',
            'Đặt chỗ & chọn ghế trực quan 3D trước chuyến bay dễ dàng',
          ]
        : [
            'Next-gen ultra-slim seats optimizing knee and leg space',
            'HD touch display loaded with 500+ latest blockbuster movies',
            'Complimentary hot meals and beverages on flights over 1.5 hours',
            'Intuitive 3D seat map selection prior to departure',
          ],
    },
  ]

  const activeCabin = cabinClasses.find((c) => c.id === activeTab) || cabinClasses[1]

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 text-[#006ce4] dark:text-sky-400 border border-sky-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider">
            <Plane className="h-3.5 w-3.5 -rotate-45" />
            <span>{isVi ? 'ĐỘI BAY & KHÔNG GIAN KHOANG KHÁCH' : 'FLEET & CABIN EXPERIENCE'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight">
            {isVi ? 'Trải Nghiệm Đẳng Cấp Trên Từng Chuyến Bay' : 'Experience World-Class Cabin Comfort'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isVi
              ? 'Từ buồng ngủ riêng biệt First Class đến ghế ngồi Economy thông minh, tận hưởng chuyến đi êm ái và tiện nghi nhất.'
              : 'From private First Class suites to smart Economy comfort, discover your ideal travel space.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-inner max-w-full overflow-x-auto">
            {cabinClasses.map((cabin) => {
              const Icon = cabin.icon
              const isSelected = activeTab === cabin.id
              return (
                <button
                  key={cabin.id}
                  type="button"
                  onClick={() => setActiveTab(cabin.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#003580] text-white shadow-md dark:bg-sky-500 dark:text-navy-950'
                      : 'text-slate-600 dark:text-slate-300 hover:text-navy-950 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{cabin.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Active Cabin Content Display */}
        <div className="rounded-3xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 shadow-xl overflow-hidden animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 items-center">
            {/* Left Column: Photo & Specs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-900 shadow-lg group">
                <img
                  src={activeCabin.coverImg}
                  alt={activeCabin.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] uppercase px-3 py-1 rounded-full shadow ${activeCabin.badgeColor}`}>
                    {activeCabin.badge}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl sm:text-2xl font-black">{activeCabin.name}</h3>
                  <p className="text-xs text-slate-200 mt-0.5">{activeCabin.tagline}</p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activeCabin.specs.map((s, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800 text-center"
                  >
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">{s.label}</span>
                    <span className="text-xs font-black text-navy-950 dark:text-sky-300 mt-0.5 block truncate">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Highlights & Inclusions */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold text-accent-500 uppercase tracking-wider block mb-1">
                  {isVi ? 'Đặc quyền tiện nghi vượt trội' : 'Signature Amenities'}
                </span>
                <h4 className="text-lg sm:text-xl font-black text-navy-950 dark:text-white">
                  {isVi ? 'Những trải nghiệm bạn sẽ nhận được:' : 'What you will enjoy:'}
                </h4>
              </div>

              <div className="space-y-3">
                {activeCabin.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mt-0.5">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {h}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-navy-800">
                <a
                  href="/flights"
                  className="btn-primary py-3 px-6 text-xs font-bold shadow-lg inline-flex items-center gap-2 w-full justify-center"
                >
                  <span>{isVi ? `Tìm vé chặng bay hạng ${activeCabin.name}` : `Search Flights in ${activeCabin.name}`}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
