import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Car,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Fuel,
  Users,
  Briefcase,
  Check,
  Sparkles,
  X,
  CheckCircle2,
  Phone,
  User,
  Key,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Search
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'

const CAR_FLEET = [
  {
    id: 'car-sedan-camry',
    name: 'Toyota Camry 2.5Q Premium',
    category: 'SEDAN',
    categoryLabel: 'Sedan 4-5 Chỗ Hạng Sang',
    seats: 5,
    bags: 3,
    transmission: 'Tự động (Auto)',
    fuel: 'Xăng / Hybrid tiết kiệm',
    pricePerDay: 1350000,
    originalPrice: 1650000,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop&q=80',
    tags: ['Nội thất da cao cấp', 'Cửa sổ trời', 'Giao xe tại sân bay miễn phí'],
    type: 'SELF_DRIVE'
  },
  {
    id: 'car-suv-everest',
    name: 'Ford Everest Titanium 4x4',
    category: 'SUV',
    categoryLabel: 'SUV 7 Chỗ Gầm Cao',
    seats: 7,
    bags: 5,
    transmission: 'Tự động 10 cấp',
    fuel: 'Dầu Diesel êm ái',
    pricePerDay: 1750000,
    originalPrice: 2100000,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
    tags: ['Chống lật & 7 túi khí', 'Cốp điện thông minh', 'Thích hợp địa hình du lịch'],
    type: 'SELF_DRIVE'
  },
  {
    id: 'car-limo-dcar',
    name: 'DCar President VIP Limousine',
    category: 'LIMOUSINE',
    categoryLabel: 'Limousine Thương Gia 9 Chỗ',
    seats: 9,
    bags: 8,
    transmission: 'Tự động + Có tài xế riêng',
    fuel: 'Xăng / Diesel',
    pricePerDay: 2950000,
    originalPrice: 3800000,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    tags: ['Ghế massage thư giãn', 'TV Smart 32 inch + Wifi 5G', 'Bao gồm tài xế chuyên nghiệp'],
    type: 'WITH_DRIVER'
  },
  {
    id: 'car-merc-glc',
    name: 'Mercedes-Benz GLC 300 4MATIC',
    category: 'SUV',
    categoryLabel: 'Luxury SUV 5 Chỗ',
    seats: 5,
    bags: 4,
    transmission: 'Tự động 9G-TRONIC',
    fuel: 'Xăng cao cấp',
    pricePerDay: 3200000,
    originalPrice: 4000000,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80',
    tags: ['Âm thanh vòm Burmester', 'Cửa sổ trời Panorama', 'Đẳng cấp doanh nhân'],
    type: 'SELF_DRIVE'
  },
  {
    id: 'car-van-solati',
    name: 'Hyundai Solati VIP 16 Chỗ',
    category: 'VAN',
    categoryLabel: 'Minivan Du Lịch Đoàn',
    seats: 16,
    bags: 12,
    transmission: 'Số sàn / Tự động (Có tài xế)',
    fuel: 'Dầu Diesel',
    pricePerDay: 2600000,
    originalPrice: 3200000,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=80',
    tags: ['Trần cao thoáng mát', 'Khoang hành lý siêu rộng', 'Bao gồm tài xế & xăng dầu'],
    type: 'WITH_DRIVER'
  }
]

export default function CarRentalPage() {
  const { formatPrice } = useCurrency()
  const { language } = useLanguage()

  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  // Search parameters
  const [pickupCity, setPickupCity] = useState('HAN_AIRPORT')
  const [pickupDate, setPickupDate] = useState('2026-10-15')
  const [returnDate, setReturnDate] = useState('2026-10-18')

  // Sidebar Filters
  const [selectedDriverTypes, setSelectedDriverTypes] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [sortBy, setSortBy] = useState('PRICE_ASC')

  // Modal
  const [selectedCar, setSelectedCar] = useState(null)
  const [bookingSuccess, setBookingSuccess] = useState(null)
  const [renterInfo, setRenterInfo] = useState({ name: '', phone: '', driverOption: 'SELF_DRIVE' })

  const resetFilters = () => {
    setSelectedDriverTypes([])
    setSelectedCategories([])
    setSelectedSeats([])
    setSortBy('PRICE_ASC')
  }

  const filteredCars = useMemo(() => {
    return CAR_FLEET.filter((car) => {
      if (selectedDriverTypes.length > 0 && !selectedDriverTypes.includes(car.type)) return false
      if (selectedCategories.length > 0 && !selectedCategories.includes(car.category)) return false
      if (selectedSeats.length > 0 && !selectedSeats.includes(car.seats)) return false
      return true
    }).sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.pricePerDay - b.pricePerDay
      if (sortBy === 'PRICE_DESC') return b.pricePerDay - a.pricePerDay
      return a.seats - b.seats
    })
  }, [selectedDriverTypes, selectedCategories, selectedSeats, sortBy])

  const handleOpenBooking = (car) => {
    setSelectedCar(car)
    setRenterInfo({ ...renterInfo, driverOption: car.type })
    setBookingSuccess(null)
  }

  const handleConfirmCar = (e) => {
    e.preventDefault()
    if (!renterInfo.name || !renterInfo.phone) {
      alert(isVi ? 'Vui lòng nhập họ tên và số điện thoại!' : 'Please enter name and phone number!')
      return
    }
    const refCode = 'CAR-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setBookingSuccess({
      refCode,
      carName: selectedCar.name,
      pickupDate,
      returnDate,
      totalPrice: selectedCar.pricePerDay * 3,
      renterName: renterInfo.name,
      phone: renterInfo.phone
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
            <span>AeroSmart Drive · Dịch Vụ Thuê Xe Tự Lái & Có Tài Xế Cao Cấp</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white">
            {isVi ? 'Thuê Xe Tự Lái & Đưa Đón Sân Bay Giá Tốt Nhất' : 'Premium Car Rentals for Any Trip'}
          </h1>

          <div className="rounded-2xl border border-white/20 bg-white p-3 sm:p-4 shadow-2xl dark:bg-navy-900 text-slate-800 dark:text-white">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 items-end">
              <div className="lg:col-span-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {isVi ? 'Địa điểm nhận xe' : 'Pickup Location'}
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <select
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  >
                    <option value="HAN_AIRPORT">Sân bay Nội Bài (Hà Nội)</option>
                    <option value="SGN_AIRPORT">Sân bay Tân Sơn Nhất (TP.HCM)</option>
                    <option value="DAD_AIRPORT">Sân bay Đà Nẵng</option>
                    <option value="PQC_AIRPORT">Sân bay Phú Quốc</option>
                    <option value="SAI_AIRPORT">Sân bay Siem Reap (SAI)</option>
                  </select>
                </div>
              </div>

              <div className="lg:col-span-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {isVi ? 'Ngày nhận xe' : 'Pickup Date'}
                </label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="lg:col-span-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {isVi ? 'Ngày trả xe' : 'Return Date'}
                </label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>
              </div>

              {/* SEARCH BUTTON */}
              <div className="lg:col-span-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('car-results-section')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full h-[42px] flex items-center justify-center gap-2 rounded-xl bg-[#006ce4] hover:bg-[#0057b8] active:scale-95 text-white font-black text-sm shadow-md transition-all dark:bg-sky-500 dark:text-navy-950 dark:hover:bg-sky-400"
                >
                  <Search className="h-4 w-4 stroke-[2.5]" />
                  <span>{isVi ? 'Tìm Xe' : 'Search'}</span>
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
                    {isVi ? 'Bộ lọc Thuê xe' : 'Car Filters'}
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

              {/* Driver Option */}
              <div className="py-4 border-b border-slate-100 dark:border-navy-800 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  {isVi ? 'Hình thức thuê' : 'Rental Option'}
                </h4>
                {[
                  { id: 'SELF_DRIVE', label: isVi ? 'Xe tự lái' : 'Self-Drive' },
                  { id: 'WITH_DRIVER', label: isVi ? 'Có tài xế riêng' : 'With Chauffeur' }
                ].map((opt) => {
                  const isChecked = selectedDriverTypes.includes(opt.id)
                  return (
                    <label key={opt.id} className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedDriverTypes([...selectedDriverTypes, opt.id])
                          else setSelectedDriverTypes(selectedDriverTypes.filter((d) => d !== opt.id))
                        }}
                        className="rounded text-[#006ce4] focus:ring-[#006ce4]"
                      />
                      <span className="font-medium">{opt.label}</span>
                    </label>
                  )
                })}
              </div>

              {/* Car Type */}
              <div className="py-4 border-b border-slate-100 dark:border-navy-800 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  {isVi ? 'Phân khúc xe' : 'Vehicle Class'}
                </h4>
                {[
                  { id: 'SEDAN', label: 'Sedan 4-5 Chỗ' },
                  { id: 'SUV', label: 'SUV 5-7 Chỗ Gầm Cao' },
                  { id: 'LIMOUSINE', label: 'VIP Limousine 9 Chỗ' },
                  { id: 'VAN', label: 'Minivan 16 Chỗ' }
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

              {/* Seats */}
              <div className="pt-4 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  {isVi ? 'Số chỗ ngồi' : 'Seats'}
                </h4>
                {[5, 7, 9, 16].map((seats) => {
                  const isChecked = selectedSeats.includes(seats)
                  return (
                    <label key={seats} className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedSeats([...selectedSeats, seats])
                          else setSelectedSeats(selectedSeats.filter((s) => s !== seats))
                        }}
                        className="rounded text-[#006ce4] focus:ring-[#006ce4]"
                      />
                      <span className="font-medium">{seats} {isVi ? 'chỗ ngồi' : 'seats'}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* RESULTS FEED (9 Cols) */}
          <section id="car-results-section" className="lg:col-span-9 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm dark:border-navy-800 dark:bg-navy-900">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {isVi ? `Tìm thấy ${filteredCars.length} dòng xe sẵn sàng giao tại sân bay` : `Found ${filteredCars.length} vehicles`}
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
                  <option value="PRICE_ASC">{isVi ? 'Giá thuê thấp nhất' : 'Price: Low to High'}</option>
                  <option value="PRICE_DESC">{isVi ? 'Giá thuê cao nhất' : 'Price: High to Low'}</option>
                </select>
              </div>
            </div>

            {/* Cars Feed */}
            {filteredCars.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-navy-800 dark:bg-navy-900">
                <Car className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isVi ? 'Không tìm thấy dòng xe phù hợp' : 'No cars match your filters'}
                </h3>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-xl bg-[#003580] px-4 py-2 text-xs font-bold text-white dark:bg-sky-500 dark:text-navy-950"
                >
                  {isVi ? 'Xem tất cả dòng xe' : 'Reset Filters'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCars.map((car) => (
                  <div
                    key={car.id}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 dark:border-navy-800 dark:bg-navy-900"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                      {/* Photo */}
                      <div className="relative md:col-span-4 h-52 md:h-auto overflow-hidden bg-slate-100 dark:bg-navy-800">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 rounded-full bg-[#003580]/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                          {car.type === 'WITH_DRIVER' ? 'CÓ TÀI XẾ' : 'TỰ LÁI'}
                        </div>
                      </div>

                      {/* Middle Details */}
                      <div className="md:col-span-5 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 dark:border-navy-800">
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-[#003580] dark:text-sky-400 uppercase tracking-wider block">
                            {car.categoryLabel}
                          </span>
                          <h3 className="text-base font-black text-slate-900 group-hover:text-[#003580] dark:text-white dark:group-hover:text-sky-400 transition-colors">
                            {car.name}
                          </h3>

                          {/* Specs Grid */}
                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-navy-800 p-2.5 rounded-xl">
                            <div className="flex items-center gap-1.5 font-medium">
                              <Users className="h-3.5 w-3.5 text-slate-400" />
                              <span>{car.seats} chỗ ngồi</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-medium">
                              <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                              <span>{car.bags} vali</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-medium col-span-2">
                              <Fuel className="h-3.5 w-3.5 text-slate-400" />
                              <span>{car.transmission} · {car.fuel}</span>
                            </div>
                          </div>

                          <div className="space-y-1 pt-1">
                            {car.tags.map((t, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
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
                            {formatPrice(car.originalPrice)}
                          </span>
                          <div className="text-xl font-black text-[#003580] dark:text-sky-400">
                            {formatPrice(car.pricePerDay)}
                          </div>
                          <span className="text-[10px] text-slate-500 block">/ ngày (24 giờ)</span>
                        </div>

                        <div className="mt-4 space-y-2">
                          <Link
                            to={`/car-rental/${car.id}`}
                            className="w-full flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#003580] bg-white py-2 text-xs font-bold text-[#003580] hover:bg-sky-50 dark:border-sky-400 dark:bg-navy-900 dark:text-sky-300 dark:hover:bg-navy-800 transition-all"
                          >
                            <span>{isVi ? 'Xem Chi Tiết Xe' : 'View Details'}</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenBooking(car)}
                            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#003580] py-2 text-xs font-bold text-white shadow-md hover:bg-[#002660] dark:bg-sky-500 dark:text-navy-950 dark:hover:bg-sky-400 active:scale-95 transition-all"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>{isVi ? 'Thuê Xe Nhanh' : 'Rent Now'}</span>
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
      {selectedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-navy-800 dark:bg-navy-900 dark:text-white max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedCar(null)}
              className="absolute top-4 right-4 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>

            {!bookingSuccess ? (
              <form onSubmit={handleConfirmCar} className="space-y-4">
                <div className="border-b border-slate-100 dark:border-navy-800 pb-3">
                  <span className="rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-black text-sky-900 uppercase dark:bg-sky-950 dark:text-sky-300">
                    {selectedCar.categoryLabel}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {selectedCar.name}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {isVi ? 'Họ và tên người thuê *' : 'Renter Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={renterInfo.name}
                      onChange={(e) => setRenterInfo({ ...renterInfo, name: e.target.value })}
                      placeholder="NGUYEN VAN A"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold uppercase focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {isVi ? 'Số điện thoại *' : 'Phone *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={renterInfo.phone}
                      onChange={(e) => setRenterInfo({ ...renterInfo, phone: e.target.value })}
                      placeholder="0912 345 678"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3 dark:bg-navy-800 text-xs space-y-1">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Thời gian thuê:</span>
                      <span className="font-bold">{pickupDate} → {returnDate} (3 ngày)</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Bảo hiểm thân vỏ:</span>
                      <span className="font-bold text-emerald-600">Đã bao gồm 100%</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-navy-800 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500">Tổng chi phí dự kiến (3 ngày):</span>
                    <div className="text-2xl font-black text-[#003580] dark:text-sky-400">
                      {formatPrice(selectedCar.pricePerDay * 3)}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isVi ? 'Xác Nhận Giữ Xe' : 'Confirm Rental'}</span>
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
                    {isVi ? 'Đặt Thuê Xe Thành Công!' : 'Car Rental Confirmed!'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Mã đơn xe: <strong className="text-[#003580] dark:text-sky-400 text-sm font-black">{bookingSuccess.refCode}</strong>
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-navy-800 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dòng xe:</span>
                    <span className="font-bold">{bookingSuccess.carName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Khách hàng:</span>
                    <span className="font-bold">{bookingSuccess.renterName} ({bookingSuccess.phone})</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-navy-700 pt-2 text-sm">
                    <span className="font-bold">Tổng thanh toán:</span>
                    <span className="font-black text-emerald-600">{formatPrice(bookingSuccess.totalPrice)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCar(null)}
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
