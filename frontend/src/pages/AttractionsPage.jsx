import React, { useState, useMemo } from 'react'
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  Star,
  Clock,
  QrCode,
  ShieldCheck,
  Check,
  X,
  CheckCircle2,
  Users,
  Ticket,
  ChevronRight
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'

const ATTRACTIONS = [
  {
    id: 'attr-bana-danang',
    title: 'Vé VIP Cáp Treo & Cầu Vàng Sun World Ba Na Hills',
    titleEn: 'Sun World Ba Na Hills Cable Car & Golden Bridge VIP Pass',
    titleKm: 'សំបុត្រទស្សនាស្ពានមាស Ba Na Hills ដាណាំង',
    city: 'Đà Nẵng',
    country: 'Vietnam',
    rating: 4.9,
    reviews: 5820,
    duration: 'Cả ngày (08:00 - 18:00)',
    price: 950000,
    originalPrice: 1200000,
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop&q=80',
    tags: ['Cầu Vàng bàn tay khổng lồ', 'Làng Pháp cổ kính', 'Cáp treo đạt kỷ lục Guinness', 'Buffet trưa Á-Âu'],
    category: 'THEME_PARK'
  },
  {
    id: 'attr-angkor-sunrise',
    title: 'Tour Đón Bình Minh Huyền Ảo & Khám Phá Quần Thể Angkor Wat',
    titleEn: 'Angkor Wat Sunrise Guided Heritage Tour & Angkor Thom',
    titleKm: 'ដំណើរកម្សាន្តទស្សនាថ្ងៃរះនៅប្រាសាទអង្គរវត្ត',
    city: 'Siem Reap',
    country: 'Cambodia',
    rating: 5.0,
    reviews: 4120,
    duration: '8 giờ (04:30 - 13:00)',
    price: 890000,
    originalPrice: 1150000,
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=80',
    tags: ['Hướng dẫn viên tiếng Việt/Anh', 'Xe Tuk Tuk / Limousine đón tận khách sạn', 'Bữa sáng picnic trước hồ sen Angkor'],
    category: 'CULTURAL_TOUR'
  },
  {
    id: 'attr-halong-cruise',
    title: 'Du Thuyền 5 Sao Khám Phá Vịnh Hạ Long & Hang Sửng Sốt',
    titleEn: 'Halong Bay 5-Star Day Cruise with Seafood Buffet & Kayak',
    titleKm: 'ជិះទូកកម្សាន្តលំដាប់ផ្កាយ ៥ នៅឈូងសមុទ្រ Halong',
    city: 'Quảng Ninh',
    country: 'Vietnam',
    rating: 4.9,
    reviews: 3290,
    duration: '6 giờ trên vịnh',
    price: 1350000,
    originalPrice: 1750000,
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80',
    tags: ['Buffet hải sản tươi sống', 'Chèo thuyền Kayak Hang Luồn', 'Bể sục Jacuzzi trên boong tàu', 'Đảo Titov'],
    category: 'BOAT_TOUR'
  },
  {
    id: 'attr-vinwonders-pq',
    title: 'Vé Trọn Gói Công Viên Giải Trí VinWonders & Safari Phú Quốc',
    titleEn: 'VinWonders Theme Park & Vinpearl Safari Phu Quoc Combo Pass',
    titleKm: 'សំបុត្រកម្សាន្ត VinWonders & Safari កោះត្រល់',
    city: 'Phú Quốc',
    country: 'Vietnam',
    rating: 4.8,
    reviews: 4680,
    duration: 'Vé vào cửa không giới hạn',
    price: 1250000,
    originalPrice: 1550000,
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
    tags: ['Cung điện Hải Vương hình Rùa', 'Vườn thú bán hoang dã lớn nhất VN', 'Show diễn triệu đô Once Show'],
    category: 'THEME_PARK'
  },
  {
    id: 'attr-bangkok-palace',
    title: 'Vé Tham Quan Đại Hoàng Cung & Chùa Phật Ngọc Wat Phra Kaew',
    titleEn: 'Grand Palace & Emerald Buddha Temple Guided Tour Bangkok',
    titleKm: 'សំបុត្រទស្សនាព្រះបរមរាជវាំងបាងកក',
    city: 'Bangkok',
    country: 'Thailand',
    rating: 4.9,
    reviews: 6200,
    duration: '4 giờ (Sáng hoặc Chiều)',
    price: 750000,
    originalPrice: 950000,
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format&fit=crop&q=80',
    tags: ['Bao gồm vé vào cổng chính thức', 'Lối đi ưu tiên không phải xếp hàng', 'Hướng dẫn viên chuyên nghiệp'],
    category: 'CULTURAL_TOUR'
  }
]

export default function AttractionsPage() {
  const { formatPrice } = useCurrency()
  const { language } = useLanguage()

  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const [selectedCity, setSelectedCity] = useState('ALL')
  const [selectedTour, setSelectedTour] = useState(null)
  const [tourDate, setTourDate] = useState('2026-10-18')
  const [ticketCount, setTicketCount] = useState({ adult: 2, child: 0 })
  const [buyerInfo, setBuyerInfo] = useState({ name: '', phone: '', email: '' })
  const [bookingSuccess, setBookingSuccess] = useState(null)

  const filteredAttractions = useMemo(() => {
    return ATTRACTIONS.filter((attr) => {
      if (selectedCity !== 'ALL' && attr.city !== selectedCity) return false
      return true
    })
  }, [selectedCity])

  const handleOpenBooking = (attr) => {
    setSelectedTour(attr)
    setBookingSuccess(null)
  }

  const handleConfirmTickets = (e) => {
    e.preventDefault()
    if (!buyerInfo.name || !buyerInfo.phone) {
      alert(isVi ? 'Vui lòng nhập họ tên và số điện thoại!' : 'Please enter name and phone number!')
      return
    }
    const refCode = 'TICKET-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    const total = selectedTour.price * ticketCount.adult + selectedTour.price * 0.7 * ticketCount.child
    setBookingSuccess({
      refCode,
      title: selectedTour.title,
      tourDate,
      adults: ticketCount.adult,
      children: ticketCount.child,
      totalPrice: total,
      buyerName: buyerInfo.name,
      phone: buyerInfo.phone
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 pb-20">
      {/* 1. HERO HEADER */}
      <section className="relative bg-gradient-to-r from-[#003580] via-[#004e92] to-[#002244] pt-8 pb-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-sky-200 backdrop-blur-md">
            <Compass className="h-3.5 w-3.5 text-amber-300" />
            <span>AeroSmart Attractions · Vé Tham Quan, Tour & Trải Nghiệm Văn Hóa</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {isVi ? 'Khám Phá Điểm Đến Tuyệt Hảo & Đặt Vé Tham Quan Ưu Tiên' : 'Explore Top Attractions & Skip-the-line Tickets'}
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 max-w-2xl font-medium">
            {isVi
              ? 'Nhận vé điện tử tức thì qua mã QR, không cần xếp hàng mua vé tại cổng. Hủy linh hoạt, hoàn tiền 100% trước 24h.'
              : 'Instant mobile e-tickets with QR codes. Skip the long ticket lines at world wonders, theme parks and cruises.'}
          </p>

          {/* City Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {['ALL', 'Đà Nẵng', 'Siem Reap', 'Quảng Ninh', 'Phú Quốc', 'Bangkok'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCity(c)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm ${
                  selectedCity === c
                    ? 'bg-white text-[#003580] shadow-md dark:bg-sky-400 dark:text-navy-950'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {c === 'ALL' ? (isVi ? 'Tất cả điểm đến' : 'All Destinations') : c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. ATTRACTIONS LIST */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {isVi ? 'Danh Sách Vé Trải Nghiệm & Tour Du Lịch Đặc Sắc' : 'Must-Visit Attractions & Experiences'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isVi ? 'Xác nhận tức thì · Mã QR quét trực tiếp tại cửa kiểm soát' : 'Instant digital voucher confirmation'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAttractions.map((attr) => (
            <div
              key={attr.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 dark:border-navy-800 dark:bg-navy-900 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-navy-800">
                  <img
                    src={attr.image}
                    alt={attr.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-black text-navy-950 shadow-md">
                    ★ {attr.rating} ({attr.reviews})
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-xl bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-sky-400" />
                    <span>{attr.city}, {attr.country}</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{attr.duration}</span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-[#003580] dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                    {isVi ? attr.title : (isKm ? attr.titleKm : attr.titleEn)}
                  </h3>

                  <div className="space-y-1 pt-1">
                    {attr.tags.slice(0, 3).map((t, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                        <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                        <span className="line-clamp-1">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between mt-4">
                <div>
                  <span className="text-[11px] text-slate-400 line-through block">{formatPrice(attr.originalPrice)}</span>
                  <div className="text-xl font-black text-[#003580] dark:text-sky-400">
                    {formatPrice(attr.price)}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">/ 1 vé điện tử</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenBooking(attr)}
                  className="flex items-center gap-1.5 rounded-2xl bg-[#003580] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#002660] dark:bg-sky-500 dark:text-navy-950 dark:hover:bg-sky-400 active:scale-95 transition-all"
                >
                  <Ticket className="h-3.5 w-3.5" />
                  <span>{isVi ? 'Mua Vé Ngay' : 'Get Tickets'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BOOKING MODAL */}
      {selectedTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-navy-800 dark:bg-navy-900 dark:text-white max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedTour(null)}
              className="absolute top-4 right-4 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>

            {!bookingSuccess ? (
              <form onSubmit={handleConfirmTickets} className="space-y-4">
                <div className="border-b border-slate-100 dark:border-navy-800 pb-3">
                  <span className="text-xs font-bold text-[#003580] dark:text-sky-400 uppercase">
                    {selectedTour.city} · VÉ ĐIỆN TỬ QR
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {selectedTour.title}
                  </h3>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    {isVi ? 'Ngày tham quan / trải nghiệm' : 'Visit Date'}
                  </label>
                  <input
                    type="date"
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>

                {/* Ticket Counts */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {isVi ? 'Vé Người lớn' : 'Adult Tickets'} ({formatPrice(selectedTour.price)})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={ticketCount.adult}
                      onChange={(e) => setTicketCount({ ...ticketCount, adult: parseInt(e.target.value, 10) || 1 })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {isVi ? 'Vé Trẻ em (Giảm 30%)' : 'Child Tickets'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={ticketCount.child}
                      onChange={(e) => setTicketCount({ ...ticketCount, child: parseInt(e.target.value, 10) || 0 })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {isVi ? 'Họ và tên người nhận vé *' : 'Recipient Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerInfo.name}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
                      placeholder="NGUYEN VAN A"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold uppercase focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {isVi ? 'Số điện thoại nhận mã QR *' : 'Phone for QR code *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={buyerInfo.phone}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
                      placeholder="0912 345 678"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-navy-800 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500">Tổng tiền vé ({ticketCount.adult + ticketCount.child} vé):</span>
                    <div className="text-2xl font-black text-[#003580] dark:text-sky-400">
                      {formatPrice(selectedTour.price * ticketCount.adult + selectedTour.price * 0.7 * ticketCount.child)}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>{isVi ? 'Xuất Vé Điện Tử' : 'Issue E-Tickets'}</span>
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
                    {isVi ? 'Xuất Vé Điện Tử Thành Công!' : 'Tickets Issued!'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Mã vé QR: <strong className="text-[#003580] dark:text-sky-400 text-sm font-black">{bookingSuccess.refCode}</strong>
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-navy-800 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Địa điểm:</span>
                    <span className="font-bold">{bookingSuccess.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ngày tham quan:</span>
                    <span className="font-bold">{bookingSuccess.tourDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số lượng vé:</span>
                    <span className="font-bold">{bookingSuccess.adults} Người lớn, {bookingSuccess.children} Trẻ em</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-navy-700 pt-2 text-sm">
                    <span className="font-bold">Tổng thanh toán:</span>
                    <span className="font-black text-emerald-600">{formatPrice(bookingSuccess.totalPrice)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTour(null)}
                  className="rounded-xl bg-[#003580] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#002660] dark:bg-sky-500 dark:text-navy-950"
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
