import React, { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Globe,
  Plane,
  Building2,
  Calendar,
  Users,
  Star,
  ShieldCheck,
  Check,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  X,
  MapPin,
  Clock,
  Award,
  Phone,
  User,
  Heart
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'
import { COMBO_PACKAGES } from '../data/mockTravelData'

export default function PackageDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { formatPrice } = useCurrency()
  const { language } = useLanguage()

  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const combo = useMemo(() => {
    return COMBO_PACKAGES.find((c) => c.id === id) || COMBO_PACKAGES[0]
  }, [id])

  const [activeImage, setActiveImage] = useState(0)
  const [departDate, setDepartDate] = useState('2026-10-15')
  const [passengerCount, setPassengerCount] = useState(2)

  // Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [buyerName, setBuyerName] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(null)

  const totalPrice = combo.pricePerPerson * passengerCount

  const handleConfirmBooking = (e) => {
    e.preventDefault()
    if (!buyerName || !buyerPhone) return
    const refCode = 'COMBO-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setBookingSuccess({
      refCode,
      comboTitle: combo.title,
      flightRoute: combo.flightRoute,
      hotelName: combo.hotelName,
      departDate,
      passengers: passengerCount,
      totalPrice,
      buyerName,
      buyerPhone
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 pb-20">
      {/* 1. BREADCRUMB */}
      <div className="border-b border-slate-200 bg-white dark:border-navy-800 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-[#003580] dark:hover:text-sky-400 font-medium">
              {isVi ? 'Trang chủ' : 'Home'}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/flight-hotel" className="hover:text-[#003580] dark:hover:text-sky-400 font-medium">
              {isVi ? 'Gói Flight + Hotel' : 'Flight + Hotel'}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
              {combo.title}
            </span>
          </div>

          <button
            onClick={() => navigate('/flight-hotel')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006ce4] hover:underline dark:text-sky-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isVi ? 'Quay lại danh sách Combo' : 'Back to Packages'}</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {/* 2. TITLE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-md bg-[#003580] px-2.5 py-0.5 text-xs font-bold text-white">
                {combo.duration}
              </span>
              <span className="rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 px-2.5 py-0.5 text-xs font-bold">
                {combo.savings}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{combo.rating}</span>
                <span className="text-slate-400 font-normal">({combo.reviews} {isVi ? 'đánh giá' : 'reviews'})</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {combo.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#003580] dark:text-sky-400" />
              <span>{combo.origin} ➔ {combo.destination}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(combo.originalPrice)}/{isVi ? 'người' : 'pax'}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#003580] dark:text-sky-400">
              {formatPrice(combo.pricePerPerson)}
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">/{isVi ? 'khách' : 'person'}</span>
            </div>
          </div>
        </div>

        {/* 3. MAIN GALLERY */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-navy-800 dark:bg-navy-900 mb-8">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-navy-950">
            <img
              src={combo.gallery?.[activeImage] || combo.image}
              alt={combo.title}
              className="h-full w-full object-cover transition-all duration-300"
            />
          </div>
        </div>

        {/* 4. DETAILS & ITINERARY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* Highlights Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900 space-y-3">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#003580] dark:text-sky-400" />
                <span>{isVi ? 'Đặc quyền Combo trọn gói bao gồm' : 'Package Inclusions'}</span>
              </h2>
              <div className="space-y-2 pt-1">
                {(combo.inclusions || []).map((inc, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Itinerary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900 space-y-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#003580] dark:text-sky-400" />
                <span>{isVi ? 'Lịch trình trải nghiệm gợi ý' : 'Suggested Daily Itinerary'}</span>
              </h2>
              <div className="space-y-3">
                {(combo.itinerary || []).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5 dark:bg-navy-800">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#003580] text-xs font-black text-white dark:bg-sky-500 dark:text-navy-950">
                      N{item.day}
                    </span>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {isVi ? `Ngày ${item.day}` : `Day ${item.day}`}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sticky Booking Widget */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-navy-800 dark:bg-navy-900 space-y-4">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {isVi ? 'Đặt Gói Combo Nghỉ Dưỡng' : 'Book Travel Package'}
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    {isVi ? 'Ngày khởi hành dự kiến' : 'Departure Date'}
                  </label>
                  <input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    {isVi ? 'Số lượng hành khách' : 'Passengers'}
                  </label>
                  <select
                    value={passengerCount}
                    onChange={(e) => setPassengerCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  >
                    <option value={1}>1 Khách</option>
                    <option value={2}>2 Khách (Khuyên dùng)</option>
                    <option value={3}>3 Khách</option>
                    <option value={4}>4 Khách (Gia đình)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-navy-800">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">{isVi ? 'Tổng thanh toán' : 'Total'}</span>
                  <span className="text-2xl font-black text-[#003580] dark:text-sky-400">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full rounded-xl bg-[#003580] py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-900 active:scale-98 dark:bg-sky-500 dark:text-navy-950 dark:hover:bg-sky-400"
                >
                  {isVi ? 'Giữ Chỗ Combo Ngay' : 'Book Package Now'}
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-navy-900 border border-slate-200 dark:border-navy-700 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-[#003580] dark:text-sky-400" />
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {bookingSuccess ? (isVi ? 'Đặt Combo Thành Công!' : 'Package Booked!') : (isVi ? 'Xác Nhận Đặt Gói Combo' : 'Confirm Package Booking')}
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
                    {isVi ? 'Mã giữ chỗ Combo của bạn' : 'Combo Reference Code'}
                  </span>
                  <div className="text-2xl font-black text-emerald-900 dark:text-emerald-200 tracking-wider mt-1">
                    {bookingSuccess.refCode}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 text-xs dark:bg-navy-800">
                  <div className="flex justify-between"><span className="text-slate-400">Gói Combo:</span><span className="font-bold text-slate-800 dark:text-white">{bookingSuccess.comboTitle}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Chuyến bay:</span><span className="font-bold text-slate-800 dark:text-white">{bookingSuccess.flightRoute}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Khởi hành:</span><span className="font-bold text-slate-800 dark:text-white">{bookingSuccess.departDate} ({bookingSuccess.passengers} khách)</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Người đại diện:</span><span className="font-bold text-slate-800 dark:text-white">{bookingSuccess.buyerName} - {bookingSuccess.buyerPhone}</span></div>
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
                  <div><strong>Gói:</strong> {combo.title}</div>
                  <div><strong>Khởi hành:</strong> {departDate} ({passengerCount} khách)</div>
                  <div className="text-sm font-black text-[#003580] dark:text-sky-400 pt-1">
                    Tổng cộng: {formatPrice(totalPrice)}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isVi ? 'Họ và tên khách đại diện' : 'Lead Traveler Full Name'} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isVi ? 'Số điện thoại nhận tin nhắn vé' : 'Phone Number'} *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
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
                    {isVi ? 'Xác Nhận Giữ Chỗ' : 'Confirm Booking'}
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
