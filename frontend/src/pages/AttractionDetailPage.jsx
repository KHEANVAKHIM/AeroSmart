import React, { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
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
  ChevronRight,
  ArrowLeft,
  Phone,
  User,
  Info
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'
import { ATTRACTIONS } from '../data/mockTravelData'

export default function AttractionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { formatPrice } = useCurrency()
  const { language } = useLanguage()

  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const attraction = useMemo(() => {
    return ATTRACTIONS.find((a) => a.id === id) || ATTRACTIONS[0]
  }, [id])

  const [activeImage, setActiveImage] = useState(0)
  const [visitDate, setVisitDate] = useState('2026-10-18')
  const [selectedTicket, setSelectedTicket] = useState(attraction.ticketOptions?.[0] || { id: 't1', name: 'Vé Tiêu Chuẩn', price: attraction.price })
  const [ticketQuantity, setTicketQuantity] = useState(2)

  // Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [visitorName, setVisitorName] = useState('')
  const [visitorPhone, setVisitorPhone] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(null)

  const totalPrice = selectedTicket.price * ticketQuantity

  const handleConfirmBooking = (e) => {
    e.preventDefault()
    if (!visitorName || !visitorPhone) return
    const refCode = 'TICKET-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setBookingSuccess({
      refCode,
      attractionTitle: attraction.title,
      ticketName: selectedTicket.name,
      visitDate,
      quantity: ticketQuantity,
      totalPrice,
      visitorName,
      visitorPhone
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
            <Link to="/attractions" className="hover:text-[#003580] dark:hover:text-sky-400 font-medium">
              {isVi ? 'Vé tham quan & Trải nghiệm' : 'Attractions'}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
              {attraction.title}
            </span>
          </div>

          <button
            onClick={() => navigate('/attractions')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006ce4] hover:underline dark:text-sky-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isVi ? 'Quay lại danh sách địa điểm' : 'Back to Attractions'}</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {/* 2. HEADER TITLE */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-md bg-[#003580] px-2.5 py-0.5 text-xs font-bold text-white">
                {attraction.categoryLabel}
              </span>
              <span className="rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 px-2.5 py-0.5 text-xs font-bold">
                {isVi ? 'Mã QR Vào Cổng Ngay' : 'Instant QR Ticket'}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{attraction.rating}</span>
                <span className="text-slate-400 font-normal">({attraction.reviews} {isVi ? 'đánh giá' : 'reviews'})</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {attraction.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#003580] dark:text-sky-400" />
              <span>{attraction.city}, {attraction.country}</span>
              <span>•</span>
              <Clock className="h-4 w-4 text-slate-400" />
              <span>{attraction.duration}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(attraction.originalPrice)}/{isVi ? 'vé' : 'ticket'}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#003580] dark:text-sky-400">
              {formatPrice(attraction.price)}
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">/{isVi ? 'vé' : 'ticket'}</span>
            </div>
          </div>
        </div>

        {/* 3. GALLERY */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-navy-800 dark:bg-navy-900 mb-8">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-navy-950">
            <img
              src={attraction.gallery?.[activeImage] || attraction.image}
              alt={attraction.title}
              className="h-full w-full object-cover transition-all duration-300"
            />
          </div>
        </div>

        {/* 4. DETAILS & TICKET OPTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* Highlights */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900 space-y-3">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#003580] dark:text-sky-400" />
                <span>{isVi ? 'Điểm nổi bật của trải nghiệm' : 'Experience Highlights'}</span>
              </h2>
              <div className="space-y-2 pt-1">
                {(attraction.highlights || attraction.tags).map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Options List */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900 space-y-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Ticket className="h-5 w-5 text-[#003580] dark:text-sky-400" />
                <span>{isVi ? 'Lựa chọn các gói vé tham quan' : 'Available Ticket Options'}</span>
              </h2>

              <div className="space-y-3">
                {(attraction.ticketOptions || []).map((tOption) => (
                  <div
                    key={tOption.id}
                    onClick={() => setSelectedTicket(tOption)}
                    className={`rounded-xl border p-4 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      selectedTicket.id === tOption.id
                        ? 'border-[#003580] bg-sky-50/50 shadow-md dark:border-sky-400 dark:bg-sky-950/30'
                        : 'border-slate-200 hover:border-slate-300 dark:border-navy-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={selectedTicket.id === tOption.id}
                          onChange={() => setSelectedTicket(tOption)}
                          className="text-[#003580] focus:ring-[#003580]"
                        />
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {tOption.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-5">
                        {tOption.desc}
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0 pl-5 sm:pl-0">
                      <span className="text-lg font-black text-[#003580] dark:text-sky-400">
                        {formatPrice(tOption.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Redemption Guide */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900 space-y-3">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <QrCode className="h-5 w-5 text-[#003580] dark:text-sky-400" />
                <span>{isVi ? 'Hướng dẫn đổi vé & Quy định sử dụng' : 'How to Use & Redemption'}</span>
              </h2>
              <div className="space-y-2">
                {(attraction.howToRedeem || []).map((guide, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600 dark:bg-navy-800 dark:text-slate-300">
                      {idx + 1}
                    </span>
                    <span>{guide}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sticky Booking Widget */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-navy-800 dark:bg-navy-900 space-y-4">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {isVi ? 'Đặt Vé Tham Quan Trực Tuyến' : 'Book Attraction Pass'}
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    {isVi ? 'Ngày tham quan' : 'Visit Date'}
                  </label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    {isVi ? 'Số lượng vé' : 'Quantity'}
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      className="h-9 w-9 rounded-xl border border-slate-200 font-black text-sm text-slate-700 hover:bg-slate-100 dark:border-navy-700 dark:text-white"
                    >
                      -
                    </button>
                    <span className="font-black text-base text-slate-900 dark:text-white">{ticketQuantity}</span>
                    <button
                      type="button"
                      onClick={() => setTicketQuantity(ticketQuantity + 1)}
                      className="h-9 w-9 rounded-xl border border-slate-200 font-black text-sm text-slate-700 hover:bg-slate-100 dark:border-navy-700 dark:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-navy-800">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">{isVi ? 'Tổng tiền vé' : 'Total Price'}</span>
                  <span className="text-2xl font-black text-[#003580] dark:text-sky-400">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full rounded-xl bg-[#003580] py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-900 active:scale-98 dark:bg-sky-500 dark:text-navy-950 dark:hover:bg-sky-400 flex items-center justify-center gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  <span>{isVi ? 'Mua Vé & Nhận Mã QR' : 'Book Tickets & Get QR'}</span>
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
                <Compass className="h-5 w-5 text-[#003580] dark:text-sky-400" />
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {bookingSuccess ? (isVi ? 'Xuất Vé Thành Công!' : 'Tickets Issued!') : (isVi ? 'Xác Nhận Đặt Vé Tham Quan' : 'Confirm Attraction Booking')}
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
                  <QrCode className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider dark:text-emerald-300">
                    {isVi ? 'Mã Vé Điện Tử QR Code' : 'Electronic Ticket Code'}
                  </span>
                  <div className="text-2xl font-black text-emerald-900 dark:text-emerald-200 tracking-wider mt-1">
                    {bookingSuccess.refCode}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 text-xs dark:bg-navy-800">
                  <div className="flex justify-between"><span className="text-slate-400">Địa điểm:</span><span className="font-bold text-slate-800 dark:text-white">{bookingSuccess.attractionTitle}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Gói vé:</span><span className="font-bold text-slate-800 dark:text-white">{bookingSuccess.ticketName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Ngày tham quan:</span><span className="font-bold text-slate-800 dark:text-white">{bookingSuccess.visitDate} ({bookingSuccess.quantity} vé)</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Người mua:</span><span className="font-bold text-slate-800 dark:text-white">{bookingSuccess.visitorName} - {bookingSuccess.visitorPhone}</span></div>
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
                  <div><strong>Địa điểm:</strong> {attraction.title}</div>
                  <div><strong>Loại vé:</strong> {selectedTicket.name}</div>
                  <div><strong>Ngày tham quan:</strong> {visitDate} ({ticketQuantity} vé)</div>
                  <div className="text-sm font-black text-[#003580] dark:text-sky-400 pt-1">
                    Tổng cộng: {formatPrice(totalPrice)}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isVi ? 'Họ và tên người nhận vé' : 'Visitor Full Name'} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isVi ? 'Số điện thoại nhận mã QR' : 'Phone Number'} *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
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
                    {isVi ? 'Xác Nhận Đặt Vé' : 'Confirm Ticket'}
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
