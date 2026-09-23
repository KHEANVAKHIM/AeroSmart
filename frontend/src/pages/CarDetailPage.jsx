import React, { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
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
  Star,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Phone,
  User,
  Info,
  ShieldAlert,
  Award,
  Key
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'
import { CAR_FLEET } from '../data/mockTravelData'

export default function CarDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { formatPrice } = useCurrency()
  const { language } = useLanguage()

  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const car = useMemo(() => {
    return CAR_FLEET.find((c) => c.id === id) || CAR_FLEET[0]
  }, [id])

  const [activeImage, setActiveImage] = useState(0)
  const [pickupDate, setPickupDate] = useState('2026-10-15')
  const [pickupTime, setPickupTime] = useState('09:00')
  const [returnDate, setReturnDate] = useState('2026-10-18')
  const [returnTime, setReturnTime] = useState('18:00')
  const [selectedLocation, setSelectedLocation] = useState(car.pickupLocations[0] || 'Sân bay Quốc tế Nội Bài')
  const [upgradeInsurance, setUpgradeInsurance] = useState(false)

  // Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [renterName, setRenterName] = useState('')
  const [renterPhone, setRenterPhone] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(null)

  // Calculate days (default 3 days)
  const rentalDays = 3
  const dailyPrice = car.pricePerDay
  const insuranceCost = upgradeInsurance ? (car.insurance.upgradePrice || 0) * rentalDays : 0
  const totalPrice = dailyPrice * rentalDays + insuranceCost

  const handleBookNow = () => {
    setBookingModalOpen(true)
  }

  const handleConfirmBooking = (e) => {
    e.preventDefault()
    if (!renterName || !renterPhone) return
    const refCode = 'CAR-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setBookingSuccess({
      refCode,
      carName: car.name,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      location: selectedLocation,
      insurance: upgradeInsurance ? car.insurance.upgradeTitle : car.insurance.included,
      totalPrice,
      renterName,
      renterPhone
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 pb-20">
      {/* 1. TOP BREADCRUMB & BACK BUTTON */}
      <div className="border-b border-slate-200 bg-white dark:border-navy-800 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-[#003580] dark:hover:text-sky-400 font-medium">
              {isVi ? 'Trang chủ' : 'Home'}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/car-rental" className="hover:text-[#003580] dark:hover:text-sky-400 font-medium">
              {isVi ? 'Thuê xe tự lái & Có tài' : 'Car Rental'}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
              {car.name}
            </span>
          </div>

          <button
            onClick={() => navigate('/car-rental')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006ce4] hover:underline dark:text-sky-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isVi ? 'Quay lại danh sách xe' : 'Back to Cars'}</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {/* 2. HEADER INFO TITLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-md bg-[#003580] px-2.5 py-0.5 text-xs font-bold text-white">
                {car.categoryLabel}
              </span>
              <span className="rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 px-2.5 py-0.5 text-xs font-bold">
                {car.type === 'SELF_DRIVE' ? (isVi ? 'Tự lái' : 'Self Drive') : (isVi ? 'Có tài xế riêng' : 'With Chauffeur')}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{car.rating}</span>
                <span className="text-slate-400 font-normal">({car.reviews} {isVi ? 'đánh giá' : 'reviews'})</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {car.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-sky-600" />
              <span>{car.provider?.name || 'AeroSmart Premium Car Rental'}</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {car.provider?.completedTrips || '3,400+'} {isVi ? 'chuyến đi thành công' : 'completed trips'}
              </span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(car.originalPrice)}/{isVi ? 'ngày' : 'day'}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#003580] dark:text-sky-400">
              {formatPrice(car.pricePerDay)}
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">/{isVi ? 'ngày' : 'day'}</span>
            </div>
          </div>
        </div>

        {/* 3. MAIN GRID (GALLERY & DETAILS ON LEFT, BOOKING BOX ON RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT 8 COLUMNS: GALLERY & SPECS & DETAILS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Photo Gallery */}
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-navy-800 dark:bg-navy-900 overflow-hidden">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-navy-950">
                <img
                  src={car.gallery?.[activeImage] || car.image}
                  alt={car.name}
                  className="h-full w-full object-cover transition-all duration-300"
                />
                <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md">
                  {activeImage + 1} / {(car.gallery || [car.image]).length} Ảnh
                </div>
              </div>

              {/* Thumbnails */}
              {car.gallery && car.gallery.length > 1 && (
                <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                  {car.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        activeImage === idx
                          ? 'border-[#003580] shadow-md dark:border-sky-400'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-navy-800 dark:bg-navy-900 flex items-center gap-3">
                <div className="rounded-xl bg-sky-50 p-2.5 text-[#003580] dark:bg-sky-950/60 dark:text-sky-300">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase">{isVi ? 'Số ghế' : 'Seats'}</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-white">{car.seats} {isVi ? 'Chỗ ngồi' : 'Seats'}</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-navy-800 dark:bg-navy-900 flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase">{isVi ? 'Hành lý' : 'Luggage'}</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-white">{car.bags} {isVi ? 'Vali lớn' : 'Bags'}</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-navy-800 dark:bg-navy-900 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase">{isVi ? 'Hộp số' : 'Transmission'}</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-white">{car.transmission}</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-navy-800 dark:bg-navy-900 flex items-center gap-3">
                <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">
                  <Fuel className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase">{isVi ? 'Nhiên liệu' : 'Fuel'}</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-white truncate max-w-[100px]">{car.fuel}</span>
                </div>
              </div>
            </div>

            {/* Features & Equipment */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-navy-800 dark:bg-navy-900 space-y-3">
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#003580] dark:text-sky-400" />
                <span>{isVi ? 'Trang bị & Tiện nghi xe nổi bật' : 'Features & Equipment'}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {(car.features || car.tags).map((f, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insurance Policies */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-navy-800 dark:bg-navy-900 space-y-4">
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isVi ? 'Gói bảo hiểm an tâm trọn hành trình' : 'Insurance & Coverage'}</span>
              </h2>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 dark:border-emerald-800 dark:bg-emerald-950/40">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                      {isVi ? 'Gói bảo hiểm tiêu chuẩn (Đã bao gồm)' : 'Standard Insurance Included'}
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-0.5">
                      {car.insurance?.included}
                    </p>
                  </div>
                </div>
              </div>

              {car.insurance?.upgradePrice > 0 && (
                <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3.5 dark:border-sky-800 dark:bg-sky-950/40 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="h-5 w-5 text-[#003580] dark:text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {car.insurance.upgradeTitle}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {isVi ? 'Miễn trừ 100% bồi thường thiệt hại thân vỏ do va chạm không may.' : 'Zero deductible for collision damage.'}
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 shrink-0 cursor-pointer">
                    <span className="text-xs font-bold text-[#003580] dark:text-sky-300">
                      +{formatPrice(car.insurance.upgradePrice)}/{isVi ? 'ngày' : 'day'}
                    </span>
                    <input
                      type="checkbox"
                      checked={upgradeInsurance}
                      onChange={(e) => setUpgradeInsurance(e.target.checked)}
                      className="h-4 w-4 rounded text-[#003580] focus:ring-[#003580]"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Rental Terms & Policies */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-navy-800 dark:bg-navy-900 space-y-3">
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="h-4 w-4 text-[#003580] dark:text-sky-400" />
                <span>{isVi ? 'Quy định & Thủ tục nhận xe' : 'Requirements & Policies'}</span>
              </h2>
              <div className="space-y-2">
                {(car.policies || []).map((pol, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600 dark:bg-navy-800 dark:text-slate-300">
                      {idx + 1}
                    </span>
                    <span>{pol}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT 4 COLUMNS: STICKY BOOKING WIDGET */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-navy-800 dark:bg-navy-900 space-y-5">
              
              <div className="border-b border-slate-100 pb-3 dark:border-navy-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{isVi ? 'Tóm tắt chi phí' : 'Price Summary'}</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {formatPrice(car.pricePerDay)} x {rentalDays} {isVi ? 'ngày' : 'days'}
                  </span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {formatPrice(dailyPrice * rentalDays)}
                  </span>
                </div>
                {upgradeInsurance && (
                  <div className="flex items-baseline justify-between mt-1 text-xs text-sky-600 dark:text-sky-400">
                    <span>Bảo hiểm Super Waiver</span>
                    <span>+{formatPrice(insuranceCost)}</span>
                  </div>
                )}
              </div>

              {/* Booking Inputs */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    {isVi ? 'Điểm nhận & trả xe' : 'Pick-up Location'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    >
                      {car.pickupLocations.map((loc, i) => (
                        <option key={i} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                      {isVi ? 'Ngày nhận xe' : 'Pick-up Date'}
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                      {isVi ? 'Giờ nhận' : 'Time'}
                    </label>
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                      {isVi ? 'Ngày trả xe' : 'Return Date'}
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                      {isVi ? 'Giờ trả' : 'Time'}
                    </label>
                    <input
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Total & Action Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-navy-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{isVi ? 'Tổng thanh toán' : 'Total'}</span>
                  <span className="text-2xl font-black text-[#003580] dark:text-sky-400">{formatPrice(totalPrice)}</span>
                </div>

                <button
                  type="button"
                  onClick={handleBookNow}
                  className="w-full rounded-xl bg-[#003580] py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-900 active:scale-98 dark:bg-sky-500 dark:text-navy-950 dark:hover:bg-sky-400 flex items-center justify-center gap-2"
                >
                  <Key className="h-4 w-4" />
                  <span>{isVi ? 'Tiến hành Giữ Xe Ngay' : 'Book Vehicle Now'}</span>
                </button>

                <p className="text-[11px] text-center text-slate-400 mt-2">
                  ✓ {isVi ? 'Miễn phí hủy trong 24h · Xác nhận tức thì' : 'Free cancellation within 24h'}
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* BOOKING MODAL */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-navy-900 border border-slate-200 dark:border-navy-700 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-[#003580] dark:text-sky-400" />
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {bookingSuccess ? (isVi ? 'Đặt Xe Thành Công!' : 'Booking Confirmed!') : (isVi ? 'Xác Nhận Giữ Xe' : 'Confirm Rental')}
                </h3>
              </div>
              <button
                onClick={() => { setBookingModalOpen(false); setBookingSuccess(null) }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-navy-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-4 space-y-4">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center dark:bg-emerald-950/40 dark:border-emerald-800">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider dark:text-emerald-300">
                    {isVi ? 'Mã đặt xe giữ chỗ của bạn' : 'Rental Reference Code'}
                  </span>
                  <div className="text-2xl font-black text-emerald-900 dark:text-emerald-200 tracking-wider mt-1">
                    {bookingSuccess.refCode}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 text-xs dark:bg-navy-800">
                  <div className="flex justify-between"><span className="text-slate-400">Dòng xe:</span><span className="font-bold text-slate-800 dark:text-white">{bookingSuccess.carName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Điểm nhận:</span><span className="font-bold text-slate-800 dark:text-white">{bookingSuccess.location}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Thời gian:</span><span className="font-bold text-slate-800 dark:text-white">{bookingSuccess.pickupDate} ({bookingSuccess.pickupTime}) → {bookingSuccess.returnDate}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Người thuê:</span><span className="font-bold text-slate-800 dark:text-white">{bookingSuccess.renterName} - {bookingSuccess.renterPhone}</span></div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 dark:border-navy-700"><span className="text-slate-400">Tổng thanh toán:</span><span className="font-black text-sm text-[#003580] dark:text-sky-400">{formatPrice(bookingSuccess.totalPrice)}</span></div>
                </div>

                <button
                  type="button"
                  onClick={() => { setBookingModalOpen(false); setBookingSuccess(null) }}
                  className="w-full rounded-xl bg-[#003580] py-2.5 text-xs font-bold text-white shadow dark:bg-sky-500 dark:text-navy-950"
                >
                  {isVi ? 'Hoàn Tất' : 'Done'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="py-4 space-y-4">
                <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                  <div><strong>Xe:</strong> {car.name} ({car.categoryLabel})</div>
                  <div><strong>Nhận xe:</strong> {pickupDate} lúc {pickupTime} tại {selectedLocation}</div>
                  <div><strong>Trả xe:</strong> {returnDate} lúc {returnTime}</div>
                  <div className="text-sm font-black text-[#003580] dark:text-sky-400 pt-1">
                    Tổng cộng: {formatPrice(totalPrice)} ({rentalDays} ngày)
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isVi ? 'Họ và tên người lái xe' : 'Driver Full Name'} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={renterName}
                      onChange={(e) => setRenterName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isVi ? 'Số điện thoại nhận xác nhận' : 'Phone Number'} *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={renterPhone}
                      onChange={(e) => setRenterPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-navy-700 dark:text-slate-300 dark:hover:bg-navy-800"
                  >
                    {isVi ? 'Đóng' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#003580] py-2.5 text-xs font-bold text-white shadow dark:bg-sky-500 dark:text-navy-950 hover:bg-blue-900"
                  >
                    {isVi ? 'Xác Nhận Giữ Xe' : 'Confirm Rental'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  )
}
