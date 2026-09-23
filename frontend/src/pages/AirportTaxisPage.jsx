import React, { useState, useMemo } from 'react'
import {
  Car,
  Plane,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Users,
  Briefcase,
  Check,
  Sparkles,
  X,
  CheckCircle2,
  Navigation,
  Phone,
  User,
  Info,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Search
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'

const AIRPORT_TAXI_FLEETS = [
  {
    id: 'taxi-standard-4',
    name: 'Standard Taxi 4 Chỗ (Toyota Vios / Hyundai Accent)',
    category: 'SEDAN',
    categoryLabel: 'Tiêu chuẩn 4 chỗ',
    seats: 4,
    bags: 2,
    baseFare: 280000,
    originalFare: 350000,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    tags: ['Tài xế đón tại sảnh đến', 'Miễn phí chờ 45 phút', 'Đã gồm phí cầu đường']
  },
  {
    id: 'taxi-premium-suv',
    name: 'Premium SUV 7 Chỗ (Toyota Fortuner / Mitsubishi Xpander)',
    category: 'SUV',
    categoryLabel: 'Gia đình & Nhóm 7 chỗ',
    seats: 7,
    bags: 4,
    baseFare: 420000,
    originalFare: 520000,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
    tags: ['Khoang hành lý rộng rãi', 'Miễn phí chờ 60 phút', 'Nước suối & khăn lạnh']
  },
  {
    id: 'taxi-limo-vip',
    name: 'VIP DCar President Limousine 9 Chỗ',
    category: 'LIMOUSINE',
    categoryLabel: 'Thương gia VIP 9 chỗ',
    seats: 9,
    bags: 7,
    baseFare: 850000,
    originalFare: 1100000,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=80',
    tags: ['Ghế massage bọc da cao cấp', 'Biển đón tên tại cửa ga ra', 'Đẳng cấp đối tác']
  }
]

export default function AirportTaxisPage() {
  const { formatPrice } = useCurrency()
  const { language } = useLanguage()

  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  // Search parameters
  const [tripDirection, setTripDirection] = useState('FROM_AIRPORT')
  const [airport, setAirport] = useState('HAN')
  const [destinationAddress, setDestinationAddress] = useState('Quận Hoàn Kiếm, Hà Nội')
  const [flightNumber, setFlightNumber] = useState('VN216')
  const [pickupDateTime, setPickupDateTime] = useState('2026-10-15T14:30')

  // Sidebar Filters
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [sortBy, setSortBy] = useState('PRICE_ASC')

  // Modal
  const [selectedTaxi, setSelectedTaxi] = useState(null)
  const [passengerInfo, setPassengerInfo] = useState({ name: '', phone: '' })
  const [bookingSuccess, setBookingSuccess] = useState(null)

  const resetFilters = () => {
    setSelectedCategories([])
    setSelectedSeats([])
    setSortBy('PRICE_ASC')
  }

  const filteredTaxis = useMemo(() => {
    return AIRPORT_TAXI_FLEETS.filter((taxi) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(taxi.category)) return false
      if (selectedSeats.length > 0 && !selectedSeats.includes(taxi.seats)) return false
      return true
    }).sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.baseFare - b.baseFare
      if (sortBy === 'PRICE_DESC') return b.baseFare - a.baseFare
      return a.seats - b.seats
    })
  }, [selectedCategories, selectedSeats, sortBy])

  const handleOpenBooking = (taxi) => {
    setSelectedTaxi(taxi)
    setBookingSuccess(null)
  }

  const handleConfirmTaxi = (e) => {
    e.preventDefault()
    if (!passengerInfo.name || !passengerInfo.phone) {
      alert(isVi ? 'Vui lòng nhập họ tên và số điện thoại!' : 'Please enter name and phone number!')
      return
    }
    const refCode = 'TAXI-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setBookingSuccess({
      refCode,
      taxiName: selectedTaxi.name,
      direction: tripDirection === 'FROM_AIRPORT' ? `Sân bay ${airport} → ${destinationAddress}` : `${destinationAddress} → Sân bay ${airport}`,
      flightNumber,
      dateTime: pickupDateTime,
      passengerName: passengerInfo.name,
      phone: passengerInfo.phone,
      totalPrice: selectedTaxi.baseFare
    })
  }

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-navy-950 pb-16">
      {/* 1. TOP ROYAL BLUE SEARCH HERO BANNER */}
      <section className="relative bg-[#003580] pt-6 pb-10 px-4 sm:px-6 lg:px-8 text-white shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-sky-200 backdrop-blur-md">
            <Car className="h-3.5 w-3.5 text-amber-300" />
            <span>AeroSmart Taxis · Đón Tiễn Sân Bay Trọn Gói Đúng Giờ</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white">
            {isVi ? 'Taxi Sân Bay Trọn Gói - Giá Cố Định Không Phát Sinh' : 'Book Reliable Airport Taxi Transfers'}
          </h1>

          <div className="rounded-2xl border border-white/20 bg-white p-3 sm:p-4 shadow-2xl dark:bg-navy-900 text-slate-800 dark:text-white">
            {/* Direction Tabs */}
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => setTripDirection('FROM_AIRPORT')}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  tripDirection === 'FROM_AIRPORT'
                    ? 'bg-[#003580] text-white shadow-md dark:bg-sky-500 dark:text-navy-950'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 dark:bg-navy-800 dark:text-slate-300 dark:border-navy-700'
                }`}
              >
                {isVi ? 'Đón từ Sân bay' : 'From Airport'}
              </button>
              <button
                type="button"
                onClick={() => setTripDirection('TO_AIRPORT')}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  tripDirection === 'TO_AIRPORT'
                    ? 'bg-[#003580] text-white shadow-md dark:bg-sky-500 dark:text-navy-950'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 dark:bg-navy-800 dark:text-slate-300 dark:border-navy-700'
                }`}
              >
                {isVi ? 'Đưa ra Sân bay' : 'To Airport'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 items-end">
              <div className="lg:col-span-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {isVi ? 'Sân bay' : 'Airport'}
                </label>
                <div className="relative flex items-center">
                  <Plane className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <select
                    value={airport}
                    onChange={(e) => setAirport(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  >
                    <option value="HAN">Nội Bài (Hà Nội - HAN)</option>
                    <option value="SGN">Tân Sơn Nhất (TP.HCM - SGN)</option>
                    <option value="DAD">Đà Nẵng (DAD)</option>
                    <option value="PQC">Phú Quốc (PQC)</option>
                    <option value="SAI">Siem Reap Angkor (SAI)</option>
                    <option value="BKK">Bangkok Suvarnabhumi (BKK)</option>
                  </select>
                </div>
              </div>

              <div className="lg:col-span-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {isVi ? 'Điểm đến / Khách sạn' : 'Destination'}
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <input
                    type="text"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    placeholder={isVi ? 'Số nhà, tên đường...' : 'Hotel or street...'}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {isVi ? 'Số hiệu bay' : 'Flight #'}
                </label>
                <div className="relative flex items-center">
                  <Navigation className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                    placeholder="VN216..."
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-2 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white uppercase"
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {isVi ? 'Giờ đón' : 'Pickup Time'}
                </label>
                <div className="relative flex items-center">
                  <Clock className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <input
                    type="datetime-local"
                    value={pickupDateTime}
                    onChange={(e) => setPickupDateTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-2 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>
              </div>

              {/* SEARCH BUTTON */}
              <div className="lg:col-span-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('taxi-results-section')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full h-[42px] flex items-center justify-center gap-2 rounded-xl bg-[#006ce4] hover:bg-[#0057b8] active:scale-95 text-white font-black text-sm shadow-md transition-all dark:bg-sky-500 dark:text-navy-950 dark:hover:bg-sky-400"
                >
                  <Search className="h-4 w-4 stroke-[2.5]" />
                  <span>{isVi ? 'Tìm Taxi' : 'Search'}</span>
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
                    {isVi ? 'Bộ lọc Loại xe' : 'Vehicle Filters'}
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

              {/* Class */}
              <div className="py-4 border-b border-slate-100 dark:border-navy-800 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  {isVi ? 'Phân khúc xe đưa đón' : 'Vehicle Class'}
                </h4>
                {[
                  { id: 'SEDAN', label: isVi ? 'Tiêu chuẩn 4 chỗ' : 'Standard 4-seat' },
                  { id: 'SUV', label: isVi ? 'SUV gia đình 7 chỗ' : 'SUV 7-seat' },
                  { id: 'LIMOUSINE', label: isVi ? 'VIP Limousine 9 chỗ' : 'VIP Limousine 9-seat' }
                ].map((c) => {
                  const isChecked = selectedCategories.includes(c.id)
                  return (
                    <label key={c.id} className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCategories([...selectedCategories, c.id])
                          else setSelectedCategories(selectedCategories.filter((cat) => cat !== c.id))
                        }}
                        className="rounded text-[#006ce4] focus:ring-[#006ce4]"
                      />
                      <span className="font-medium">{c.label}</span>
                    </label>
                  )
                })}
              </div>

              {/* Guaranteed benefits */}
              <div className="pt-4 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  {isVi ? 'Cam kết AeroSmart' : 'Guarantees'}
                </h4>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Giá trọn gói cố định (Đã gồm cầu đường & đỗ xe)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Tài xế chờ miễn phí 60 phút khi máy bay hạ cánh</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Biển đón tên tại cửa ga đến sân bay</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* RESULTS FEED (9 Cols) */}
          <section id="taxi-results-section" className="lg:col-span-9 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm dark:border-navy-800 dark:bg-navy-900">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {isVi ? `Tìm thấy ${filteredTaxis.length} lựa chọn xe đưa đón sân bay ${airport}` : `Found ${filteredTaxis.length} transfer vehicles`}
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
                  <option value="PRICE_ASC">{isVi ? 'Giá trọn gói thấp nhất' : 'Price: Low to High'}</option>
                  <option value="PRICE_DESC">{isVi ? 'Giá cao nhất' : 'Price: High to Low'}</option>
                </select>
              </div>
            </div>

            {/* Taxi Cards */}
            {filteredTaxis.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-navy-800 dark:bg-navy-900">
                <Car className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isVi ? 'Không tìm thấy dòng xe phù hợp' : 'No vehicles match your filters'}
                </h3>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-xl bg-[#003580] px-4 py-2 text-xs font-bold text-white dark:bg-sky-500 dark:text-navy-950"
                >
                  {isVi ? 'Xem tất cả xe' : 'Reset Filters'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTaxis.map((taxi) => (
                  <div
                    key={taxi.id}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 dark:border-navy-800 dark:bg-navy-900"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                      {/* Photo */}
                      <div className="relative md:col-span-4 h-52 md:h-auto overflow-hidden bg-slate-100 dark:bg-navy-800">
                        <img
                          src={taxi.image}
                          alt={taxi.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 rounded-full bg-[#003580]/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white">
                          {taxi.categoryLabel}
                        </div>
                      </div>

                      {/* Middle */}
                      <div className="md:col-span-5 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 dark:border-navy-800">
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-[#003580] dark:text-sky-400 uppercase tracking-wider block">
                            TAXI ĐƯA ĐÓN SÂN BAY
                          </span>
                          <h3 className="text-base font-black text-slate-900 group-hover:text-[#003580] dark:text-white dark:group-hover:text-sky-400 transition-colors">
                            {taxi.name}
                          </h3>

                          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-navy-800 p-2.5 rounded-xl">
                            <div className="flex items-center gap-1 font-medium">
                              <Users className="h-3.5 w-3.5 text-slate-400" />
                              <span>{taxi.seats} hành khách</span>
                            </div>
                            <div className="flex items-center gap-1 font-medium">
                              <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                              <span>{taxi.bags} kiện vali</span>
                            </div>
                          </div>

                          <div className="space-y-1 pt-1">
                            {taxi.tags.map((t, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                                <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                                <span>{t}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Price & CTA */}
                      <div className="md:col-span-3 p-5 flex flex-col justify-between bg-slate-50/50 dark:bg-navy-900/50">
                        <div className="space-y-2 text-right">
                          <span className="text-[11px] text-slate-400 line-through block">
                            {formatPrice(taxi.originalFare)}
                          </span>
                          <div className="text-xl font-black text-[#003580] dark:text-sky-400">
                            {formatPrice(taxi.baseFare)}
                          </div>
                          <span className="text-[10px] text-slate-500 block">/ chuyến (Trọn gói cố định)</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenBooking(taxi)}
                          className="mt-4 w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#003580] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#002660] dark:bg-sky-500 dark:text-navy-950 dark:hover:bg-sky-400 active:scale-95 transition-all"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>{isVi ? 'Đặt Xe Ngay' : 'Book Taxi'}</span>
                        </button>
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
      {selectedTaxi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-navy-800 dark:bg-navy-900 dark:text-white max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedTaxi(null)}
              className="absolute top-4 right-4 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>

            {!bookingSuccess ? (
              <form onSubmit={handleConfirmTaxi} className="space-y-4">
                <div className="border-b border-slate-100 dark:border-navy-800 pb-3">
                  <span className="text-xs font-bold text-[#003580] dark:text-sky-400 uppercase">
                    TAXI ĐƯA ĐÓN SÂN BAY {airport}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {selectedTaxi.name}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {isVi ? 'Họ và tên hành khách đi xe *' : 'Passenger Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={passengerInfo.name}
                      onChange={(e) => setPassengerInfo({ ...passengerInfo, name: e.target.value })}
                      placeholder="NGUYEN VAN A"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold uppercase focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {isVi ? 'Số điện thoại liên hệ tài xế *' : 'Passenger Phone *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={passengerInfo.phone}
                      onChange={(e) => setPassengerInfo({ ...passengerInfo, phone: e.target.value })}
                      placeholder="0912 345 678"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3 dark:bg-navy-800 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Lộ trình:</span>
                      <span className="font-bold">Sân bay {airport} ⇌ {destinationAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mã chuyến bay theo dõi:</span>
                      <span className="font-bold text-[#003580] dark:text-sky-400">{flightNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Thời gian đón:</span>
                      <span className="font-bold">{pickupDateTime.replace('T', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-navy-800 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500">Cước phí trọn gói cố định:</span>
                    <div className="text-2xl font-black text-[#003580] dark:text-sky-400">
                      {formatPrice(selectedTaxi.baseFare)}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isVi ? 'Xác Nhận Đặt Taxi' : 'Confirm Taxi'}</span>
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
                    {isVi ? 'Đặt Taxi Sân Bay Thành Công!' : 'Taxi Booked!'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Mã chuyến taxi: <strong className="text-[#003580] dark:text-sky-400 text-sm font-black">{bookingSuccess.refCode}</strong>
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-navy-800 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lộ trình:</span>
                    <span className="font-bold">{bookingSuccess.direction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hành khách:</span>
                    <span className="font-bold">{bookingSuccess.passengerName} ({bookingSuccess.phone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Chuyến bay theo dõi:</span>
                    <span className="font-bold">{bookingSuccess.flightNumber}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-navy-700 pt-2 text-sm">
                    <span className="font-bold">Tổng thanh toán:</span>
                    <span className="font-black text-emerald-600">{formatPrice(bookingSuccess.totalPrice)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTaxi(null)}
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
