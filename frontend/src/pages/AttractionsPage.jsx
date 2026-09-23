import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
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
  Filter,
  ArrowUpDown,
  RotateCcw,
  Search
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
    tags: ['Cầu Vàng bàn tay khổng lồ', 'Làng Pháp cổ kính', 'Cáp treo kỷ lục Guinness', 'Buffet trưa Á-Âu'],
    category: 'THEME_PARK',
    categoryLabel: 'Công viên giải trí'
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
    tags: ['Hướng dẫn viên tiếng Việt/Anh', 'Xe đưa đón tận khách sạn', 'Bữa sáng picnic trước Angkor'],
    category: 'CULTURAL_TOUR',
    categoryLabel: 'Tour văn hóa & di sản'
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
    tags: ['Buffet hải sản tươi sống', 'Chèo thuyền Kayak Hang Luồn', 'Bể sục Jacuzzi boong tàu'],
    category: 'BOAT_TOUR',
    categoryLabel: 'Du thuyền biển đảo'
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
    tags: ['Cung điện Hải Vương hình Rùa', 'Vườn thú bán hoang dã Safari', 'Show diễn Once triệu đô'],
    category: 'THEME_PARK',
    categoryLabel: 'Công viên giải trí'
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
    duration: '4 giờ (Sáng / Chiều)',
    price: 750000,
    originalPrice: 950000,
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format&fit=crop&q=80',
    tags: ['Vé vào cổng chính thức', 'Lối đi VIP ưu tiên không xếp hàng', 'HDV chuyên nghiệp'],
    category: 'CULTURAL_TOUR',
    categoryLabel: 'Tour văn hóa & di sản'
  }
]

export default function AttractionsPage() {
  const { formatPrice } = useCurrency()
  const { language } = useLanguage()

  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  // Search parameters
  const [searchLocation, setSearchLocation] = useState('')
  const [tourDate, setTourDate] = useState('2026-10-18')

  // Sidebar Filters
  const [selectedCities, setSelectedCities] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceBucket, setPriceBucket] = useState('ALL')
  const [sortBy, setSortBy] = useState('POPULAR')

  // Modal
  const [selectedTour, setSelectedTour] = useState(null)
  const [ticketCount, setTicketCount] = useState({ adult: 2, child: 0 })
  const [buyerInfo, setBuyerInfo] = useState({ name: '', phone: '', email: '' })
  const [bookingSuccess, setBookingSuccess] = useState(null)

  const resetFilters = () => {
    setSelectedCities([])
    setSelectedCategories([])
    setPriceBucket('ALL')
    setSortBy('POPULAR')
    setSearchLocation('')
  }

  const filteredAttractions = useMemo(() => {
    return ATTRACTIONS.filter((attr) => {
      if (searchLocation.trim()) {
        const q = searchLocation.toLowerCase().trim()
        const matchTitle = attr.title.toLowerCase().includes(q) || attr.titleEn.toLowerCase().includes(q)
        const matchCity = attr.city.toLowerCase().includes(q)
        if (!matchTitle && !matchCity) return false
      }
      if (selectedCities.length > 0 && !selectedCities.includes(attr.city)) return false
      if (selectedCategories.length > 0 && !selectedCategories.includes(attr.category)) return false

      if (priceBucket === 'UNDER_1M' && attr.price >= 1000000) return false
      if (priceBucket === 'OVER_1M' && attr.price < 1000000) return false

      return true
    }).sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.price - b.price
      if (sortBy === 'PRICE_DESC') return b.price - a.price
      if (sortBy === 'RATING') return b.rating - a.rating
      return b.reviews - a.reviews
    })
  }, [searchLocation, selectedCities, selectedCategories, priceBucket, sortBy])

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
    <div className="min-h-screen bg-slate-100/70 dark:bg-navy-950 pb-16">
      {/* 1. TOP ROYAL BLUE SEARCH HERO BANNER */}
      <section className="relative bg-[#003580] pt-6 pb-10 px-4 sm:px-6 lg:px-8 text-white shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-sky-200 backdrop-blur-md">
            <Compass className="h-3.5 w-3.5 text-amber-300" />
            <span>AeroSmart Attractions · Vé Tham Quan & Hoạt Động Trải Nghiệm</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white">
            {isVi ? 'Khám Phá Vé Tham Quan & Tour Trải Nghiệm Độc Đáo' : 'Discover Tours, Activities & Attraction Tickets'}
          </h1>

          <div className="rounded-2xl border border-white/20 bg-white p-3 sm:p-4 shadow-2xl dark:bg-navy-900 text-slate-800 dark:text-white">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 items-end">
              <div className="lg:col-span-5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {isVi ? 'Điểm đến / Tên địa điểm' : 'Destination / Attraction'}
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder={isVi ? 'Bà Nà Hills, Angkor Wat, Vịnh Hạ Long...' : 'Theme park, tour or city...'}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="lg:col-span-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {isVi ? 'Ngày tham quan dự kiến' : 'Visit Date'}
                </label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <input
                    type="date"
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>
              </div>

              {/* SEARCH BUTTON */}
              <div className="lg:col-span-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('attractions-results-section')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full h-[42px] flex items-center justify-center gap-2 rounded-xl bg-[#006ce4] hover:bg-[#0057b8] active:scale-95 text-white font-black text-sm shadow-md transition-all dark:bg-sky-500 dark:text-navy-950 dark:hover:bg-sky-400"
                >
                  <Search className="h-4 w-4 stroke-[2.5]" />
                  <span>{isVi ? 'Tìm Vé Tham Quan' : 'Search Tickets'}</span>
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
                    {isVi ? 'Bộ lọc Địa điểm' : 'Attraction Filters'}
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

              {/* Destinations */}
              <div className="py-4 border-b border-slate-100 dark:border-navy-800 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  {isVi ? 'Thành phố / Điểm đến' : 'Destinations'}
                </h4>
                {['Đà Nẵng', 'Siem Reap', 'Quảng Ninh', 'Phú Quốc', 'Bangkok'].map((city) => {
                  const count = ATTRACTIONS.filter((a) => a.city === city).length
                  const isChecked = selectedCities.includes(city)
                  return (
                    <label key={city} className="flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 cursor-pointer group">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedCities([...selectedCities, city])
                            else setSelectedCities(selectedCities.filter((c) => c !== city))
                          }}
                          className="rounded text-[#006ce4] focus:ring-[#006ce4]"
                        />
                        <span className="font-medium group-hover:text-[#003580] dark:group-hover:text-sky-400 transition-colors">{city}</span>
                      </div>
                      <span className="text-slate-400 text-xs font-semibold">{count}</span>
                    </label>
                  )
                })}
              </div>

              {/* Category */}
              <div className="py-4 border-b border-slate-100 dark:border-navy-800 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  {isVi ? 'Thể loại trải nghiệm' : 'Category'}
                </h4>
                {[
                  { id: 'THEME_PARK', label: isVi ? 'Công viên giải trí' : 'Theme Parks' },
                  { id: 'CULTURAL_TOUR', label: isVi ? 'Tour văn hóa & di sản' : 'Cultural Tours' },
                  { id: 'BOAT_TOUR', label: isVi ? 'Du thuyền biển đảo' : 'Cruises & Boat' }
                ].map((cat) => {
                  const isChecked = selectedCategories.includes(cat.id)
                  return (
                    <label key={cat.id} className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCategories([...selectedCategories, cat.id])
                          else setSelectedCategories(selectedCategories.filter((c) => c !== cat.id))
                        }}
                        className="rounded text-[#006ce4] focus:ring-[#006ce4]"
                      />
                      <span className="font-medium">{cat.label}</span>
                    </label>
                  )
                })}
              </div>

              {/* Price */}
              <div className="pt-4 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  {isVi ? 'Mức giá vé' : 'Ticket Price'}
                </h4>
                {[
                  { id: 'ALL', label: isVi ? 'Tất cả mức giá' : 'All Prices' },
                  { id: 'UNDER_1M', label: isVi ? 'Dưới 1.000.000đ' : 'Under 1,000,000đ' },
                  { id: 'OVER_1M', label: isVi ? 'Từ 1.000.000đ trở lên' : 'From 1,000,000đ' }
                ].map((p) => (
                  <label key={p.id} className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="attrPriceFilter"
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
                {isVi ? `Tìm thấy ${filteredAttractions.length} vé tham quan & tour trải nghiệm` : `Found ${filteredAttractions.length} attractions`}
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
                  <option value="POPULAR">{isVi ? 'Phổ biến nhất' : 'Most Popular'}</option>
                  <option value="PRICE_ASC">{isVi ? 'Giá vé thấp nhất' : 'Price: Low to High'}</option>
                  <option value="PRICE_DESC">{isVi ? 'Giá vé cao nhất' : 'Price: High to Low'}</option>
                  <option value="RATING">{isVi ? 'Đánh giá cao nhất' : 'Highest Rated'}</option>
                </select>
              </div>
            </div>

            {/* Attractions Cards */}
            {filteredAttractions.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-navy-800 dark:bg-navy-900">
                <Compass className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isVi ? 'Không tìm thấy vé tham quan phù hợp' : 'No attractions match your filters'}
                </h3>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-xl bg-[#003580] px-4 py-2 text-xs font-bold text-white dark:bg-sky-500 dark:text-navy-950"
                >
                  {isVi ? 'Xem tất cả vé' : 'Reset Filters'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAttractions.map((attr) => (
                  <div
                    key={attr.id}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 dark:border-navy-800 dark:bg-navy-900"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                      {/* Photo */}
                      <div className="relative md:col-span-4 h-52 md:h-auto overflow-hidden bg-slate-100 dark:bg-navy-800">
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

                      {/* Middle Details */}
                      <div className="md:col-span-5 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 dark:border-navy-800">
                        <div className="space-y-2">
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

                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 text-xs text-slate-500 dark:text-slate-400">
                          <span>Phân loại: </span>
                          <strong className="text-slate-800 dark:text-slate-200">{attr.categoryLabel}</strong>
                        </div>
                      </div>

                      {/* Right Price & CTA */}
                      <div className="md:col-span-3 p-5 flex flex-col justify-between bg-slate-50/50 dark:bg-navy-900/50">
                        <div className="space-y-2 text-right">
                          <span className="text-[11px] text-slate-400 line-through block">
                            {formatPrice(attr.originalPrice)}
                          </span>
                          <div className="text-xl font-black text-[#003580] dark:text-sky-400">
                            {formatPrice(attr.price)}
                          </div>
                          <span className="text-[10px] text-slate-500 block">/ 1 vé điện tử QR</span>
                        </div>

                        <div className="mt-4 space-y-2">
                          <Link
                            to={`/attractions/${attr.id}`}
                            className="w-full flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#003580] bg-white py-2 text-xs font-bold text-[#003580] hover:bg-sky-50 dark:border-sky-400 dark:bg-navy-900 dark:text-sky-300 dark:hover:bg-navy-800 transition-all"
                          >
                            <span>{isVi ? 'Xem Chi Tiết Điểm Đến' : 'View Details'}</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenBooking(attr)}
                            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#003580] py-2 text-xs font-bold text-white shadow-md hover:bg-[#002660] dark:bg-sky-500 dark:text-navy-950 dark:hover:bg-sky-400 active:scale-95 transition-all"
                          >
                            <Ticket className="h-3.5 w-3.5" />
                            <span>{isVi ? 'Mua Vé Nhanh' : 'Get Tickets'}</span>
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
