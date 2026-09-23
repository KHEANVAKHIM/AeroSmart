import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
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
  Filter,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'

const COMBO_PACKAGES = [
  {
    id: 'combo-pq-vinpearl',
    title: 'Combo Phú Quốc Thiên Đường 3N2Đ',
    titleEn: 'Phu Quoc Island Paradise Combo 3D2N',
    titleKm: 'កញ្ចប់ដំណើរកម្សាន្តកោះត្រល់ ៣ថ្ងៃ២យប់',
    origin: 'HAN',
    originName: 'Hà Nội (HAN)',
    destination: 'PQC',
    destinationName: 'Phú Quốc (PQC)',
    airline: 'Vietnam Airlines',
    hotel: 'Vinpearl Resort & Spa Phú Quốc (5 Sao)',
    duration: '3 Ngày 2 Đêm',
    durationDays: 3,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
    originalPrice: 7500000,
    comboPrice: 4950000,
    saving: 'Tiết kiệm 34%',
    badge: 'BÁN CHẠY NHẤT',
    highlights: [
      'Vé máy bay khứ hồi Vietnam Airlines (23kg hành lý)',
      '2 đêm nghỉ dưỡng Vinpearl Resort 5 sao sát biển',
      'Buffet sáng hải sản cao cấp hàng ngày',
      'Vé vui chơi không giới hạn VinWonders & Safari',
      'Xe Limousine đưa đón sân bay Phú Quốc 2 chiều'
    ]
  },
  {
    id: 'combo-dad-intercon',
    title: 'Combo Nghỉ Dưỡng Thượng Lưu Đà Nẵng - Hội An 4N3Đ',
    titleEn: 'Luxury Danang & Hoi An Heritage 4D3N',
    titleKm: 'កញ្ចប់ដំណើរកម្សាន្តដាណាំង ៤ថ្ងៃ៣យប់',
    origin: 'SGN',
    originName: 'TP. Hồ Chí Minh (SGN)',
    destination: 'DAD',
    destinationName: 'Đà Nẵng (DAD)',
    airline: 'Bamboo Airways',
    hotel: 'InterContinental Danang Sun Peninsula Resort (5 Sao)',
    duration: '4 Ngày 3 Đêm',
    durationDays: 4,
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop&q=80',
    originalPrice: 16500000,
    comboPrice: 11900000,
    saving: 'Tiết kiệm 28%',
    badge: 'THƯƠNG GIA VIP',
    highlights: [
      'Vé máy bay khứ hồi Bamboo Airways hạng Eco Flex',
      '3 đêm tại Resort bán đảo Sơn Trà kiến trúc Bill Bensley',
      'Bao gồm bữa sáng phong cách Pháp & trà chiều view biển',
      'Miễn phí cáp treo Nam Tram và tour ngắm voọc chà vá',
      'Xe Mercedes đưa đón sân bay Đà Nẵng tận sảnh'
    ]
  },
  {
    id: 'combo-rep-angkor',
    title: 'Combo Khám Phá Kỳ Quan Angkor Wat (Siem Reap) 3N2Đ',
    titleEn: 'Mystical Angkor Wat Heritage Flight + Hotel 3D2N',
    titleKm: 'កញ្ចប់ដំណើរកម្សាន្តប្រាសាទអង្គរវត្ត ៣ថ្ងៃ២យប់',
    origin: 'HAN',
    originName: 'Hà Nội (HAN)',
    destination: 'SAI',
    destinationName: 'Siem Reap (SAI)',
    airline: 'Cambodia Angkor Air',
    hotel: 'Sofitel Angkor Phokeethra Golf & Spa Resort (5 Sao)',
    duration: '3 Ngày 2 Đêm',
    durationDays: 3,
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=80',
    originalPrice: 9800000,
    comboPrice: 6850000,
    saving: 'Tiết kiệm 30%',
    badge: 'TOUR DI SẢN QUỐC TẾ',
    highlights: [
      'Vé bay thẳng khứ hồi HAN ⇌ SAI Cambodia Angkor Air',
      '2 đêm tại khách sạn Sofitel thuộc địa Pháp cổ điển',
      'Vé VIP đón bình minh tại đền Angkor Wat kèm HDV',
      'Tặng 1 liệu trình Akoya Spa & trà chiều Khmer',
      'Xe đưa đón riêng sân bay mới Siem Reap Angkor (SAI)'
    ]
  },
  {
    id: 'combo-bkk-peninsula',
    title: 'Combo Bangkok Mua Sắm & Chill Sông Chao Phraya 4N3Đ',
    titleEn: 'Bangkok Shopping & Riverfront Luxury 4D3N',
    titleKm: 'កញ្ចប់ដំណើរកម្សាន្តបាងកក ៤ថ្ងៃ៣យប់',
    origin: 'SGN',
    originName: 'TP. Hồ Chí Minh (SGN)',
    destination: 'BKK',
    destinationName: 'Bangkok (BKK)',
    airline: 'Vietjet Air',
    hotel: 'The Peninsula Bangkok Luxury Riverfront (5 Sao)',
    duration: '4 Ngày 3 Đêm',
    durationDays: 4,
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format&fit=crop&q=80',
    originalPrice: 11500000,
    comboPrice: 7990000,
    saving: 'Tiết kiệm 31%',
    badge: 'HOT TREND MÙA THU',
    highlights: [
      'Vé máy bay khứ hồi SGN ⇌ BKK Suvarnabhumi',
      '3 đêm phòng Deluxe Riverview ngắm toàn cảnh sông',
      'Thuyền riêng đưa đón miễn phí sang TTTM ICONSIAM',
      'Bao gồm ăn sáng thượng hạng và quầy cocktail Sunset',
      'Đưa đón sân bay Suvarnabhumi bằng xe Toyota Camry VIP'
    ]
  }
]

export default function FlightHotelPage() {
  const { formatPrice } = useCurrency()
  const { language } = useLanguage()

  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  // Search parameters
  const [origin, setOrigin] = useState('ALL')
  const [destination, setDestination] = useState('ALL')
  const [departureDate, setDepartureDate] = useState('2026-10-20')
  const [returnDate, setReturnDate] = useState('2026-10-23')

  // Sidebar Filters
  const [selectedAirlines, setSelectedAirlines] = useState([])
  const [selectedDurations, setSelectedDurations] = useState([])
  const [priceBucket, setPriceBucket] = useState('ALL')
  const [sortBy, setSortBy] = useState('PRICE_ASC')

  // Modal
  const [selectedCombo, setSelectedCombo] = useState(null)
  const [bookingSuccess, setBookingSuccess] = useState(null)
  const [leadGuest, setLeadGuest] = useState({ name: '', phone: '', email: '', passengers: 2 })

  const resetFilters = () => {
    setOrigin('ALL')
    setDestination('ALL')
    setSelectedAirlines([])
    setSelectedDurations([])
    setPriceBucket('ALL')
    setSortBy('PRICE_ASC')
  }

  const filteredCombos = useMemo(() => {
    return COMBO_PACKAGES.filter((combo) => {
      if (origin !== 'ALL' && combo.origin !== origin) return false
      if (destination !== 'ALL' && combo.destination !== destination) return false
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(combo.airline)) return false
      if (selectedDurations.length > 0 && !selectedDurations.includes(combo.durationDays)) return false

      if (priceBucket === 'UNDER_6M' && combo.comboPrice >= 6000000) return false
      if (priceBucket === '6M_TO_10M' && (combo.comboPrice < 6000000 || combo.comboPrice > 10000000)) return false
      if (priceBucket === 'OVER_10M' && combo.comboPrice <= 10000000) return false

      return true
    }).sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.comboPrice - b.comboPrice
      if (sortBy === 'PRICE_DESC') return b.comboPrice - a.comboPrice
      return b.originalPrice - a.originalPrice
    })
  }, [origin, destination, selectedAirlines, selectedDurations, priceBucket, sortBy])

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
    <div className="min-h-screen bg-slate-100/70 dark:bg-navy-950 pb-16">
      {/* 1. TOP ROYAL BLUE SEARCH HERO BANNER */}
      <section className="relative bg-[#003580] pt-6 pb-10 px-4 sm:px-6 lg:px-8 text-white shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-sky-200 backdrop-blur-md">
            <Globe className="h-3.5 w-3.5 text-amber-300" />
            <span>AeroSmart Packages · Gói Combo Vé Máy Bay + Khách Sạn 5 Sao</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white">
            {isVi ? 'Gói Combo Tiết Kiệm: Vé Máy Bay + Khách Sạn' : 'Save with Flight + Hotel Packages'}
          </h1>

          <div className="rounded-2xl border border-white/20 bg-white p-3 sm:p-4 shadow-2xl dark:bg-navy-900 text-slate-800 dark:text-white">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 items-end">
              <div className="lg:col-span-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {isVi ? 'Điểm khởi hành' : 'Departure'}
                </label>
                <div className="relative flex items-center">
                  <Plane className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  >
                    <option value="ALL">{isVi ? 'Tất cả điểm đi' : 'All Origins'}</option>
                    <option value="HAN">Hà Nội (HAN)</option>
                    <option value="SGN">TP. Hồ Chí Minh (SGN)</option>
                  </select>
                </div>
              </div>

              <div className="lg:col-span-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {isVi ? 'Điểm đến nghỉ dưỡng' : 'Destination'}
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  >
                    <option value="ALL">{isVi ? 'Tất cả điểm đến' : 'All Destinations'}</option>
                    <option value="PQC">Phú Quốc (PQC)</option>
                    <option value="DAD">Đà Nẵng (DAD)</option>
                    <option value="SAI">Siem Reap (SAI)</option>
                    <option value="BKK">Bangkok (BKK)</option>
                  </select>
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {isVi ? 'Khởi hành' : 'Depart Date'}
                </label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-2 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {isVi ? 'Số người' : 'Travelers'}
                </label>
                <div className="relative flex items-center">
                  <Users className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <select
                    value={leadGuest.passengers}
                    onChange={(e) => setLeadGuest({ ...leadGuest, passengers: parseInt(e.target.value, 10) })}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-2 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  >
                    <option value={1}>1 {isVi ? 'khách' : 'guest'}</option>
                    <option value={2}>2 {isVi ? 'khách (Đôi bạn)' : 'guests'}</option>
                    <option value={4}>4 {isVi ? 'khách (Gia đình)' : 'guests'}</option>
                  </select>
                </div>
              </div>

              {/* SEARCH BUTTON */}
              <div className="lg:col-span-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('combo-results-section')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full h-[42px] flex items-center justify-center gap-2 rounded-xl bg-[#006ce4] hover:bg-[#0057b8] active:scale-95 text-white font-black text-sm shadow-md transition-all dark:bg-sky-500 dark:text-navy-950 dark:hover:bg-sky-400"
                >
                  <Search className="h-4 w-4 stroke-[2.5]" />
                  <span>{isVi ? 'Tìm Combo' : 'Search'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN 12-COLUMN LAYOUT (SIDEBAR FILTERS + RESULTS FEED) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* FILTERS SIDEBAR (3 Cols) */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-navy-800 dark:bg-navy-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {isVi ? 'Bộ lọc Combo' : 'Combo Filters'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs font-semibold text-[#006ce4] hover:underline dark:text-sky-400"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{isVi ? 'Đặt lại' : 'Reset'}</span>
                </button>
              </div>

              {/* Airlines */}
              <div className="py-4 border-b border-slate-100 dark:border-navy-800 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  {isVi ? 'Hãng hàng không' : 'Airlines'}
                </h4>
                {['Vietnam Airlines', 'Bamboo Airways', 'Cambodia Angkor Air', 'Vietjet Air'].map((airline) => {
                  const isChecked = selectedAirlines.includes(airline)
                  return (
                    <label key={airline} className="flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 cursor-pointer group">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedAirlines([...selectedAirlines, airline])
                            else setSelectedAirlines(selectedAirlines.filter((a) => a !== airline))
                          }}
                          className="rounded text-[#006ce4] focus:ring-[#006ce4]"
                        />
                        <span className="font-medium">{airline}</span>
                      </div>
                    </label>
                  )
                })}
              </div>

              {/* Duration */}
              <div className="py-4 border-b border-slate-100 dark:border-navy-800 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  {isVi ? 'Thời gian hành trình' : 'Duration'}
                </h4>
                {[
                  { days: 3, label: isVi ? '3 Ngày 2 Đêm' : '3 Days 2 Nights' },
                  { days: 4, label: isVi ? '4 Ngày 3 Đêm' : '4 Days 3 Nights' }
                ].map((d) => {
                  const isChecked = selectedDurations.includes(d.days)
                  return (
                    <label key={d.days} className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedDurations([...selectedDurations, d.days])
                          else setSelectedDurations(selectedDurations.filter((dur) => dur !== d.days))
                        }}
                        className="rounded text-[#006ce4] focus:ring-[#006ce4]"
                      />
                      <span className="font-medium">{d.label}</span>
                    </label>
                  )
                })}
              </div>

              {/* Price Range */}
              <div className="pt-4 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  {isVi ? 'Khoảng giá trọn gói' : 'Price per person'}
                </h4>
                {[
                  { id: 'ALL', label: isVi ? 'Tất cả mức giá' : 'All Prices' },
                  { id: 'UNDER_6M', label: isVi ? 'Dưới 6.000.000đ' : 'Under 6M VND' },
                  { id: '6M_TO_10M', label: isVi ? '6.000.000đ - 10.000.000đ' : '6M - 10M VND' },
                  { id: 'OVER_10M', label: isVi ? 'Trên 10.000.000đ (VIP)' : 'Over 10M VND' }
                ].map((p) => (
                  <label key={p.id} className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="comboPriceFilter"
                      checked={priceBucket === p.id}
                      onChange={() => setPriceBucket(p.id)}
                      className="text-[#006ce4] focus:ring-[#006ce4]"
                    />
                    <span className="font-medium">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* RESULTS FEED (9 Cols) */}
          <section className="lg:col-span-9 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm dark:border-navy-800 dark:bg-navy-900">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {isVi ? `Tìm thấy ${filteredCombos.length} gói combo máy bay + khách sạn ưu đãi` : `Found ${filteredCombos.length} vacation packages`}
              </p>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {isVi ? 'Sắp xếp:' : 'Sort:'}
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                >
                  <option value="PRICE_ASC">{isVi ? 'Giá thấp nhất' : 'Price: Low to High'}</option>
                  <option value="PRICE_DESC">{isVi ? 'Giá cao nhất' : 'Price: High to Low'}</option>
                </select>
              </div>
            </div>

            {/* Cards Feed */}
            {filteredCombos.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-navy-800 dark:bg-navy-900">
                <Globe className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isVi ? 'Không tìm thấy gói combo phù hợp' : 'No packages match your filters'}
                </h3>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-xl bg-[#003580] px-4 py-2 text-xs font-bold text-white dark:bg-sky-500 dark:text-navy-950"
                >
                  {isVi ? 'Xem tất cả gói combo' : 'Reset Filters'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCombos.map((combo) => (
                  <div
                    key={combo.id}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 dark:border-navy-800 dark:bg-navy-900"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                      {/* Photo */}
                      <div className="relative md:col-span-4 h-56 md:h-auto overflow-hidden bg-slate-100 dark:bg-navy-800">
                        <img
                          src={combo.image}
                          alt={combo.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow-md uppercase">
                            {combo.saving}
                          </span>
                          <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-amber-300 shadow-md">
                            {combo.badge}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3 rounded-xl bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-slate-900 shadow-md dark:bg-navy-900/90 dark:text-white">
                          {combo.duration}
                        </div>
                      </div>

                      {/* Middle */}
                      <div className="md:col-span-5 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 dark:border-navy-800">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-xs text-[#003580] dark:text-sky-400 font-bold">
                            <Plane className="h-3.5 w-3.5" />
                            <span>{combo.originName} ⇌ {combo.destinationName}</span>
                          </div>
                          <h3 className="text-base font-black text-slate-900 group-hover:text-[#003580] dark:text-white dark:group-hover:text-sky-400 transition-colors">
                            {isVi ? combo.title : combo.titleEn}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                            <Building2 className="h-3.5 w-3.5 text-amber-500" />
                            <span>{combo.hotel}</span>
                          </div>

                          {/* Inclusions */}
                          <div className="pt-2 space-y-1">
                            {combo.highlights.slice(0, 3).map((h, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                                <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                                <span className="line-clamp-1">{h}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 text-xs text-slate-500 dark:text-slate-400">
                          <span>Hãng bay: </span>
                          <strong className="text-slate-800 dark:text-slate-200">{combo.airline}</strong>
                        </div>
                      </div>

                      {/* Right Price & Book */}
                      <div className="md:col-span-3 p-5 flex flex-col justify-between bg-slate-50/50 dark:bg-navy-900/50">
                        <div className="space-y-2 text-right">
                          <span className="text-[11px] text-slate-400 line-through block">
                            {formatPrice(combo.originalPrice)}
                          </span>
                          <div className="text-xl font-black text-[#003580] dark:text-sky-400">
                            {formatPrice(combo.comboPrice)}
                          </div>
                          <span className="text-[10px] text-slate-500 block">/ 1 người lớn (Trọn gói)</span>
                        </div>

                        <div className="mt-4 space-y-2">
                          <Link
                            to={`/flight-hotel/${combo.id}`}
                            className="w-full flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#003580] bg-white py-2 text-xs font-bold text-[#003580] hover:bg-sky-50 dark:border-sky-400 dark:bg-navy-900 dark:text-sky-300 dark:hover:bg-navy-800 transition-all"
                          >
                            <span>{isVi ? 'Xem Chi Tiết Combo' : 'View Details'}</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenBooking(combo)}
                            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#003580] py-2 text-xs font-bold text-white shadow-md hover:bg-[#002660] dark:bg-sky-500 dark:text-navy-950 dark:hover:bg-sky-400 active:scale-95 transition-all"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>{isVi ? 'Đặt Nhanh' : 'Book Now'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

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
