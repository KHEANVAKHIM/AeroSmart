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
  Info
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'

const AIRPORT_TAXI_FLEETS = [
  {
    id: 'taxi-standard-4',
    name: 'Standard Taxi 4 Chỗ (Toyota Vios / Hyundai Accent)',
    category: 'Tiêu chuẩn 4 chỗ',
    seats: 4,
    bags: 2,
    baseFare: 280000,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    tags: ['Tài xế đón tại sảnh đến', 'Miễn phí chờ 45 phút', 'Đã gồm phí cầu đường']
  },
  {
    id: 'taxi-premium-suv',
    name: 'Premium SUV 7 Chỗ (Toyota Fortuner / Mitsubishi Xpander)',
    category: 'Gia đình & Nhóm 7 chỗ',
    seats: 7,
    bags: 4,
    baseFare: 420000,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
    tags: ['Khoang hành lý rộng rãi', 'Miễn phí chờ 60 phút khi máy bay hạ cánh', 'Nước suối & khăn lạnh']
  },
  {
    id: 'taxi-limo-vip',
    name: 'VIP DCar President Limousine 9 Chỗ',
    category: 'Thương gia VIP 9 chỗ',
    seats: 9,
    bags: 7,
    baseFare: 850000,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=80',
    tags: ['Ghế massage bọc da cao cấp', 'Biển đón tên tại cửa ga ra', 'Đẳng cấp đón tiếp đối tác']
  }
]

export default function AirportTaxisPage() {
  const { formatPrice } = useCurrency()
  const { language } = useLanguage()

  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const [tripDirection, setTripDirection] = useState('FROM_AIRPORT') // FROM_AIRPORT or TO_AIRPORT
  const [airport, setAirport] = useState('HAN')
  const [destinationAddress, setDestinationAddress] = useState('Quận Hoàn Kiếm, Hà Nội')
  const [flightNumber, setFlightNumber] = useState('VN216')
  const [pickupDateTime, setPickupDateTime] = useState('2026-10-15T14:30')
  const [selectedTaxi, setSelectedTaxi] = useState(null)
  const [passengerInfo, setPassengerInfo] = useState({ name: '', phone: '' })
  const [bookingSuccess, setBookingSuccess] = useState(null)

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
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 pb-20">
      {/* 1. HERO HEADER */}
      <section className="relative bg-[#003580] pt-8 pb-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md">
            <Car className="h-3.5 w-3.5" />
            <span>AeroSmart Express · Dịch Vụ Taxi & Limousine Đưa Đón Sân Bay Trọn Gói</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {isVi ? 'Đặt Taxi Sân Bay Giá Cố Định - Không Lo Phụ Phí' : 'Airport Taxi & Chauffeur Transfers at Fixed Prices'}
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 max-w-2xl font-medium">
            {isVi
              ? 'Tài xế theo dõi chuyến bay thực tế, đón đúng giờ tại sảnh đến. Miễn phí chờ 60 phút nếu máy bay hạ cánh trễ. Giá trọn gói đã gồm phí cầu đường và vé sân bay.'
              : 'Flight tracking included. Your driver waits at arrivals even if your flight is delayed, with zero hidden fees.'}
          </p>

          {/* Quick Search Form */}
          <div className="rounded-2xl border border-white/20 bg-white p-4 shadow-2xl dark:bg-navy-900 text-slate-800 dark:text-white">
            {/* Direction Tabs */}
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setTripDirection('FROM_AIRPORT')}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  tripDirection === 'FROM_AIRPORT'
                    ? 'bg-[#003580] text-white shadow-md dark:bg-sky-500 dark:text-navy-950'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300'
                }`}
              >
                {isVi ? 'Đón từ Sân bay về Khách sạn / Nhà' : 'From Airport to Hotel / City'}
              </button>
              <button
                type="button"
                onClick={() => setTripDirection('TO_AIRPORT')}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  tripDirection === 'TO_AIRPORT'
                    ? 'bg-[#003580] text-white shadow-md dark:bg-sky-500 dark:text-navy-950'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300'
                }`}
              >
                {isVi ? 'Đưa từ Nhà / Khách sạn ra Sân bay' : 'From City / Hotel to Airport'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  {isVi ? 'Sân bay' : 'Airport'}
                </label>
                <div className="relative flex items-center">
                  <Plane className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <select
                    value={airport}
                    onChange={(e) => setAirport(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
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

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  {isVi ? 'Địa chỉ khách sạn / Điểm đến' : 'Hotel / Drop-off Address'}
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <input
                    type="text"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    placeholder={isVi ? 'Số nhà, tên đường, khách sạn...' : 'Hotel name or street...'}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  {isVi ? 'Mã chuyến bay (để theo dõi)' : 'Flight Number'}
                </label>
                <div className="relative flex items-center">
                  <Navigation className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                    placeholder="VN216, VJ135..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  {isVi ? 'Ngày & Giờ đón' : 'Pickup Date & Time'}
                </label>
                <div className="relative flex items-center">
                  <Clock className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <input
                    type="datetime-local"
                    value={pickupDateTime}
                    onChange={(e) => setPickupDateTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLEETS LIST */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {isVi ? 'Chọn Loại Xe Đưa Đón Phù Hợp' : 'Select Vehicle Category'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isVi ? 'Giá cố định trọn gói không phụ thuộc tình trạng giao thông' : 'Guaranteed all-inclusive fixed rates'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AIRPORT_TAXI_FLEETS.map((taxi) => (
            <div
              key={taxi.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 dark:border-navy-800 dark:bg-navy-900 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-navy-800">
                  <img
                    src={taxi.image}
                    alt={taxi.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-[#003580]/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white">
                    {taxi.category}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-[#003580] dark:group-hover:text-sky-400 transition-colors">
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

              <div className="p-5 pt-0 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between mt-4">
                <div>
                  <div className="text-xl font-black text-[#003580] dark:text-sky-400">
                    {formatPrice(taxi.baseFare)}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">/ chuyến (Trọn gói)</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenBooking(taxi)}
                  className="flex items-center gap-1.5 rounded-2xl bg-[#003580] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#002660] dark:bg-sky-500 dark:text-navy-950 dark:hover:bg-sky-400 active:scale-95 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isVi ? 'Đặt Xe Ngay' : 'Book Taxi'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

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
