import React, { useState, useMemo } from 'react'
import {
  Globe,
  Plane,
  Building2,
  Calendar,
  Users,
  Search,
  Sparkles,
  Check,
  Star,
  Tag,
  ArrowRight,
  ShieldCheck,
  X,
  CheckCircle2,
  MapPin,
  Clock,
  Utensils
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'

const COMBO_PACKAGES = [
  {
    id: 'combo-pq-vinpearl',
    title: 'Combo Phú Quốc Thiên Đường 3N2Đ',
    titleEn: 'Phu Quoc Island Paradise Combo 3D2N',
    titleKm: 'កញ្ចប់ដំណើរកម្សាន្តកោះត្រល់ ៣ថ្ងៃ២យប់',
    origin: 'Hà Nội (HAN)',
    destination: 'Phú Quốc (PQC)',
    airline: 'Vietnam Airlines',
    hotel: 'Vinpearl Resort & Spa Phú Quốc (5 Sao)',
    duration: '3 Ngày 2 Đêm',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
    originalPrice: 7500000,
    comboPrice: 4950000,
    saving: 'Tiết kiệm 34%',
    badge: 'COMBO BÁN CHẠY NHẤT',
    highlights: [
      'Vé máy bay khứ hồi Vietnam Airlines bao gồm 23kg hành lý ký gửi',
      '2 đêm nghỉ dưỡng tại Vinpearl Resort & Spa Phú Quốc 5 sao sát biển',
      'Buffet sáng hải sản cao cấp hàng ngày',
      'Vé vui chơi không giới hạn tại VinWonders & Vinpearl Safari',
      'Xe Limousine đưa đón sân bay Phú Quốc 2 chiều miễn phí'
    ]
  },
  {
    id: 'combo-dad-intercon',
    title: 'Combo Nghỉ Dưỡng Thượng Lưu Đà Nẵng - Hội An 4N3Đ',
    titleEn: 'Luxury Danang & Hoi An Heritage 4D3N',
    titleKm: 'កញ្ចប់ដំណើរកម្សាន្តដាណាំង ៤ថ្ងៃ៣យប់',
    origin: 'TP. Hồ Chí Minh (SGN)',
    destination: 'Đà Nẵng (DAD)',
    airline: 'Bamboo Airways',
    hotel: 'InterContinental Danang Sun Peninsula Resort (5 Sao)',
    duration: '4 Ngày 3 Đêm',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop&q=80',
    originalPrice: 16500000,
    comboPrice: 11900000,
    saving: 'Tiết kiệm 28%',
    badge: 'ĐẲNG CẤP THƯƠNG GIA',
    highlights: [
      'Vé máy bay khứ hồi Bamboo Airways hạng thương gia / Eco Flex',
      '3 đêm tại Resort bán đảo Sơn Trà kiến trúc Bill Bensley nổi tiếng',
      'Bao gồm bữa sáng phong cách Pháp & trà chiều view biển',
      'Miễn phí cáp treo Nam Tram và tour khám phá rừng nguyên sinh Sơn Trà',
      'Xe Mercedes đưa đón sân bay Quốc tế Đà Nẵng tận sảnh'
    ]
  },
  {
    id: 'combo-rep-angkor',
    title: 'Combo Khám Phá Kỳ Quan Angkor Wat (Siem Reap) 3N2Đ',
    titleEn: 'Mystical Angkor Wat Heritage Flight + Hotel 3D2N',
    titleKm: 'កញ្ចប់ដំណើរកម្សាន្តប្រាសាទអង្គរវត្ត ៣ថ្ងៃ២យប់',
    origin: 'Hà Nội (HAN)',
    destination: 'Siem Reap (SAI)',
    airline: 'Cambodia Angkor Air',
    hotel: 'Sofitel Angkor Phokeethra Golf & Spa Resort (5 Sao)',
    duration: '3 Ngày 2 Đêm',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=80',
    originalPrice: 9800000,
    comboPrice: 6850000,
    saving: 'Tiết kiệm 30%',
    badge: 'TOUR DI SẢN QUỐC TẾ',
    highlights: [
      'Vé bay thẳng khứ hồi HAN ⇌ SAI với Cambodia Angkor Air',
      '2 đêm tại khách sạn Sofitel phong cách Pháp thuộc địa cổ điển',
      'Vé VIP đón bình minh tại đền Angkor Wat kèm hướng dẫn viên',
      'Tặng 1 buổi liệu trình thư giãn Akoya Spa & trà chiều Khmer',
      'Xe đưa đón riêng sân bay mới Siem Reap Angkor (SAI)'
    ]
  },
  {
    id: 'combo-bkk-peninsula',
    title: 'Combo Bangkok Mua Sắm & Chill Sông Chao Phraya 4N3Đ',
    titleEn: 'Bangkok Shopping & Riverfront Luxury 4D3N',
    titleKm: 'កញ្ចប់ដំណើរកម្សាន្តបាងកក ៤ថ្ងៃ៣យប់',
    origin: 'TP. Hồ Chí Minh (SGN)',
    destination: 'Bangkok (BKK)',
    airline: 'Vietjet Air / Thai Airways',
    hotel: 'The Peninsula Bangkok Luxury Riverfront (5 Sao)',
    duration: '4 Ngày 3 Đêm',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format&fit=crop&q=80',
    originalPrice: 11500000,
    comboPrice: 7990000,
    saving: 'Tiết kiệm 31%',
    badge: 'HOT TREND MÙA THU',
    highlights: [
      'Vé máy bay khứ hồi SGN ⇌ BKK Suvarnabhumi',
      '3 đêm phòng Deluxe Riverview ngắm toàn cảnh sông Bangkok',
      'Du thuyền riêng đưa đón miến phí sang trung tâm thương mại ICONSIAM',
      'Bao gồm ăn sáng thượng hạng và quầy cocktail Sunset Sky Bar',
      'Đưa đón sân bay Suvarnabhumi bằng xe Toyota Camry VIP'
    ]
  }
]

export default function FlightHotelPage() {
  const { formatPrice } = useCurrency()
  const { language } = useLanguage()

  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const [origin, setOrigin] = useState('HAN')
  const [destination, setDestination] = useState('PQC')
  const [departureDate, setDepartureDate] = useState('2026-10-20')
  const [returnDate, setReturnDate] = useState('2026-10-23')
  const [selectedCombo, setSelectedCombo] = useState(null)
  const [bookingSuccess, setBookingSuccess] = useState(null)
  const [leadGuest, setLeadGuest] = useState({ name: '', phone: '', email: '', passengers: 2 })

  const handleOpenBooking = (combo) => {
    setSelectedCombo(combo)
    setBookingSuccess(null)
  }

  const handleConfirmCombo = (e) => {
    e.preventDefault()
    if (!leadGuest.name || !leadGuest.phone) {
      alert(isVi ? 'Vui lòng điền họ tên và số điện thoại!' : 'Please enter name and phone number!')
      return
    }
    const refCode = 'COMBO-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setBookingSuccess({
      refCode,
      title: selectedCombo.title,
      airline: selectedCombo.airline,
      hotel: selectedCombo.hotel,
      dates: `${departureDate} → ${returnDate}`,
      totalPrice: selectedCombo.comboPrice * leadGuest.passengers,
      leadGuest: leadGuest.name,
      phone: leadGuest.phone,
      passengers: leadGuest.passengers
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 pb-20">
      {/* 1. HERO HEADER */}
      <section className="relative bg-gradient-to-br from-[#003580] via-[#004bb5] to-[#00224f] pt-8 pb-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-sky-200 backdrop-blur-md">
            <Globe className="h-3.5 w-3.5 text-amber-300" />
            <span>AeroSmart Packages · Gói Combo Vé Máy Bay + Khách Sạn 5 Sao</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {isVi ? 'Đặt Trọn Gói Máy Bay + Khách Sạn: Tiết Kiệm Đến 35%' : 'Flight + Hotel Packages: Save up to 35%'}
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 max-w-2xl font-medium">
            {isVi
              ? 'Tận hưởng chuyến đi hoàn hảo không lo lắng với trọn bộ vé máy bay khứ hồi, khách sạn nghỉ dưỡng 5 sao, buffet sáng và xe đưa đón sân bay.'
              : 'Complete vacation packages bundled with round-trip flights, 5-star luxury resorts, daily breakfast, and private airport transfers.'}
          </p>

          {/* Quick Filter Box */}
          <div className="rounded-2xl border border-white/20 bg-white p-3 sm:p-4 shadow-2xl dark:bg-navy-900 text-slate-800 dark:text-white">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  {isVi ? 'Điểm khởi hành' : 'Departure'}
                </label>
                <div className="relative flex items-center">
                  <Plane className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  >
                    <option value="HAN">Hà Nội (HAN)</option>
                    <option value="SGN">TP. Hồ Chí Minh (SGN)</option>
                    <option value="DAD">Đà Nẵng (DAD)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  {isVi ? 'Điểm đến nghỉ dưỡng' : 'Destination'}
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  >
                    <option value="PQC">Phú Quốc (PQC)</option>
                    <option value="DAD">Đà Nẵng (DAD)</option>
                    <option value="SAI">Siem Reap (SAI - Angkor)</option>
                    <option value="BKK">Bangkok (BKK)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  {isVi ? 'Ngày đi' : 'Depart Date'}
                </label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  {isVi ? 'Số người đi' : 'Travelers'}
                </label>
                <div className="relative flex items-center">
                  <Users className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <select
                    value={leadGuest.passengers}
                    onChange={(e) => setLeadGuest({ ...leadGuest, passengers: parseInt(e.target.value, 10) })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  >
                    <option value={1}>1 {isVi ? 'khách' : 'guest'}</option>
                    <option value={2}>2 {isVi ? 'khách (Đôi bạn / Vợ chồng)' : 'guests'}</option>
                    <option value={4}>4 {isVi ? 'khách (Gia đình)' : 'guests'}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMBO PACKAGES CARDS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {isVi ? 'Các Gói Combo Máy Bay + Khách Sạn Đang Ưu Đãi Khủng' : 'Featured Flight + Hotel Bundles'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isVi ? 'Đã bao gồm thuế, phí sân bay và dịch vụ đưa đón trọn gói' : 'Includes flight taxes, baggage, and luxury hotel stay'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COMBO_PACKAGES.map((combo) => (
            <div
              key={combo.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 dark:border-navy-800 dark:bg-navy-900 flex flex-col justify-between"
            >
              <div>
                {/* Photo & Badge */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-navy-800">
                  <img
                    src={combo.image}
                    alt={combo.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-black text-white shadow-md">
                      {combo.saving}
                    </span>
                    <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-amber-300 shadow-md">
                      {combo.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 rounded-xl bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-black text-slate-900 shadow-md dark:bg-navy-900/90 dark:text-white">
                    {combo.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#003580] dark:text-sky-400 mb-1">
                      <Plane className="h-3.5 w-3.5" />
                      <span>{combo.origin} ⇌ {combo.destination}</span>
                      <span>·</span>
                      <span>{combo.airline}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-[#003580] dark:group-hover:text-sky-400 transition-colors">
                      {isVi ? combo.title : combo.titleEn}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1">
                      <Building2 className="h-3.5 w-3.5 text-amber-500" />
                      <span>{combo.hotel}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-navy-800/60 border border-slate-100 dark:border-navy-700/60 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      {isVi ? 'Đặc quyền gói combo bao gồm:' : 'Package inclusions:'}
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
                      {combo.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Price & Book */}
              <div className="p-5 pt-0 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between mt-4">
                <div>
                  <span className="text-xs text-slate-400 line-through block">{formatPrice(combo.originalPrice)}</span>
                  <div className="text-2xl font-black text-[#003580] dark:text-sky-400">
                    {formatPrice(combo.comboPrice)}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">/ 1 người lớn (Trọn gói)</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenBooking(combo)}
                  className="flex items-center gap-2 rounded-2xl bg-[#003580] px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-[#002660] dark:bg-sky-500 dark:text-navy-950 dark:hover:bg-sky-400 active:scale-95 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isVi ? 'Đặt Gói Combo' : 'Book Combo'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BOOKING MODAL */}
      {selectedCombo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-navy-800 dark:bg-navy-900 dark:text-white max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedCombo(null)}
              className="absolute top-4 right-4 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>

            {!bookingSuccess ? (
              <form onSubmit={handleConfirmCombo} className="space-y-4">
                <div className="border-b border-slate-100 dark:border-navy-800 pb-3">
                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-900 uppercase dark:bg-amber-950 dark:text-amber-300">
                    {selectedCombo.saving}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {selectedCombo.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedCombo.airline} + {selectedCombo.hotel}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {isVi ? 'Họ và tên trưởng đoàn *' : 'Lead Traveler Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={leadGuest.name}
                      onChange={(e) => setLeadGuest({ ...leadGuest, name: e.target.value })}
                      placeholder="NGUYEN VAN A"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold uppercase focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        {isVi ? 'Số điện thoại *' : 'Phone *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={leadGuest.phone}
                        onChange={(e) => setLeadGuest({ ...leadGuest, phone: e.target.value })}
                        placeholder="0901 234 567"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        {isVi ? 'Số lượng khách đi' : 'Travelers'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={leadGuest.passengers}
                        onChange={(e) => setLeadGuest({ ...leadGuest, passengers: parseInt(e.target.value, 10) || 1 })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-navy-800 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500">Tổng gói ({leadGuest.passengers} khách):</span>
                    <div className="text-2xl font-black text-[#003580] dark:text-sky-400">
                      {formatPrice(selectedCombo.comboPrice * leadGuest.passengers)}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isVi ? 'Xác Nhận Giữ Combo' : 'Confirm Package'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {isVi ? 'Đặt Gói Combo Thành Công!' : 'Package Booked!'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Mã xác nhận: <strong className="text-[#003580] dark:text-sky-400 text-sm font-black">{bookingSuccess.refCode}</strong>
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-navy-800 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gói combo:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{bookingSuccess.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Khách hàng:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{bookingSuccess.leadGuest} ({bookingSuccess.phone})</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-navy-700 pt-2 text-sm">
                    <span className="font-bold">Tổng thanh toán:</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">{formatPrice(bookingSuccess.totalPrice)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCombo(null)}
                  className="rounded-xl bg-[#003580] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#002660] transition-all dark:bg-sky-500 dark:text-navy-950"
                >
                  Hoàn tất
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
