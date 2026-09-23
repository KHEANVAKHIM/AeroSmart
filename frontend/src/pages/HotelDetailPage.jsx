import React, { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  Star,
  ShieldCheck,
  Check,
  Sparkles,
  Wifi,
  Coffee,
  Waves,
  Car,
  Utensils,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  X,
  CreditCard,
  Bed,
  Info,
  Award,
  Phone,
  User,
  Heart
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'
import { LUXURY_HOTELS } from '../data/mockTravelData'

export default function HotelDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { formatPrice } = useCurrency()
  const { language } = useLanguage()

  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const hotel = useMemo(() => {
    return LUXURY_HOTELS.find((h) => h.id === id) || LUXURY_HOTELS[0]
  }, [id])

  const [activeImage, setActiveImage] = useState(0)
  const [checkInDate, setCheckInDate] = useState('2026-10-15')
  const [checkOutDate, setCheckOutDate] = useState('2026-10-18')
  const [guestCount, setGuestCount] = useState('2 người lớn, 1 phòng')

  // Booking Modal
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(null)

  const stayNights = 3

  const handleSelectRoom = (room) => {
    setSelectedRoom(room)
  }

  const handleConfirmBooking = (e) => {
    e.preventDefault()
    if (!guestName || !guestPhone || !selectedRoom) return
    const refCode = 'STAY-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setBookingSuccess({
      refCode,
      hotelName: hotel.name,
      roomName: selectedRoom.name,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights: stayNights,
      totalPrice: selectedRoom.price * stayNights,
      guestName,
      guestPhone
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 pb-20">
      {/* 1. BREADCRUMB & BACK BUTTON */}
      <div className="border-b border-slate-200 bg-white dark:border-navy-800 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-[#003580] dark:hover:text-sky-400 font-medium">
              {isVi ? 'Trang chủ' : 'Home'}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/stays" className="hover:text-[#003580] dark:hover:text-sky-400 font-medium">
              {isVi ? 'Chỗ nghỉ & Khách sạn' : 'Stays'}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
              {hotel.name}
            </span>
          </div>

          <button
            onClick={() => navigate('/stays')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006ce4] hover:underline dark:text-sky-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isVi ? 'Quay lại danh sách khách sạn' : 'Back to Hotels'}</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {/* 2. HOTEL TITLE & RATING HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(hotel.stars || 5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                5-Star Luxury Resort
              </span>
              <span className="rounded-md bg-sky-100 text-[#003580] dark:bg-sky-950/70 dark:text-sky-300 px-2 py-0.5 text-xs font-bold">
                {hotel.city}, {hotel.country}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {hotel.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#003580] dark:text-sky-400 shrink-0" />
              <span>{hotel.location}</span>
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-900 dark:text-white">
                  {hotel.rating >= 4.8 ? (isVi ? 'Xuất sắc' : 'Exceptional') : (isVi ? 'Rất tốt' : 'Very Good')}
                </span>
                <span className="text-[11px] text-slate-400">{hotel.reviews} {isVi ? 'đánh giá thực tế' : 'verified reviews'}</span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003580] text-sm font-black text-white dark:bg-sky-500 dark:text-navy-950">
                {hotel.rating}
              </div>
            </div>
          </div>
        </div>

        {/* 3. MAIN GALLERY */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-navy-800 dark:bg-navy-900 mb-8">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-navy-950">
            <img
              src={hotel.gallery?.[activeImage] || hotel.image}
              alt={hotel.name}
              className="h-full w-full object-cover transition-all duration-300"
            />
            <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
              {activeImage + 1} / {(hotel.gallery || [hotel.image]).length} Ảnh Resort & Phòng
            </div>
          </div>

          {/* Thumbnails */}
          {hotel.gallery && hotel.gallery.length > 1 && (
            <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
              {hotel.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
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

        {/* 4. OVERVIEW & AMENITIES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-8 space-y-6">
            
            {/* Description */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900 space-y-3">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {isVi ? 'Giới thiệu tổng quan chỗ nghỉ' : 'About the Property'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {hotel.description}
              </p>

              {hotel.highlights && (
                <div className="pt-3 border-t border-slate-100 dark:border-navy-800 space-y-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    {isVi ? 'Điểm nổi bật nhất' : 'Key Highlights'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {hotel.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Popular Amenities */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900 space-y-3">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#003580] dark:text-sky-400" />
                <span>{isVi ? 'Tiện nghi & Dịch vụ khách sạn 5 sao' : 'Hotel Amenities'}</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {hotel.amenities.map((amen, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-xs font-semibold text-slate-700 dark:bg-navy-800 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{amen}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Date Widget */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg dark:border-navy-800 dark:bg-navy-900 space-y-4">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {isVi ? 'Thông tin lưu trú' : 'Stay Dates'}
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    {isVi ? 'Ngày nhận phòng' : 'Check-in'}
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    {isVi ? 'Ngày trả phòng' : 'Check-out'}
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    {isVi ? 'Số khách' : 'Guests'}
                  </label>
                  <input
                    type="text"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-sky-50 p-3 text-xs text-[#003580] dark:bg-sky-950/50 dark:text-sky-300 font-medium">
                💡 {isVi ? 'Chọn hạng phòng bên dưới để đặt chỗ với giá ưu đãi độc quyền AeroSmart.' : 'Select your preferred room type below.'}
              </div>
            </div>
          </div>
        </div>

        {/* 5. ROOM SELECTION TABLE (PDP ROOM LIST) */}
        <div id="room-selection" className="space-y-4 mb-12">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bed className="h-6 w-6 text-[#003580] dark:text-sky-400" />
            <span>{isVi ? 'Các hạng phòng còn trống' : 'Available Room Types'}</span>
          </h2>

          <div className="space-y-4">
            {(hotel.rooms || []).map((room, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-[#003580] dark:border-navy-800 dark:bg-navy-900 dark:hover:border-sky-500"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Room Details (7 Cols) */}
                  <div className="lg:col-span-7 space-y-2.5">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {room.name}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold bg-slate-100 dark:bg-navy-800 px-2 py-1 rounded-md">
                        📐 {room.size}
                      </span>
                      <span className="font-semibold bg-slate-100 dark:bg-navy-800 px-2 py-1 rounded-md">
                        🛏️ {room.bed}
                      </span>
                    </div>

                    <div className="space-y-1 pt-1">
                      {(room.perks || ['Ăn sáng buffet miễn phí', 'Hủy phòng miễn phí']).map((perk, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          <Check className="h-3.5 w-3.5" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Room Price & Action (5 Cols) */}
                  <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-navy-800 pt-4 lg:pt-0 lg:pl-6">
                    <div>
                      <span className="text-[11px] text-slate-400 block text-left lg:text-right">
                        {isVi ? 'Giá 1 đêm cho 2 khách' : 'Price per night for 2 guests'}
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-[#003580] dark:text-sky-400 text-left lg:text-right">
                        {formatPrice(room.price)}
                      </div>
                      <span className="text-[11px] text-slate-400 block text-left lg:text-right">
                        {isVi ? 'Đã bao gồm thuế & phí phục vụ' : 'Includes taxes & charges'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectRoom(room)}
                      className="w-full sm:w-auto rounded-xl bg-[#003580] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-900 active:scale-98 dark:bg-sky-500 dark:text-navy-950 dark:hover:bg-sky-400"
                    >
                      {isVi ? 'Đặt Phòng Này' : 'Select Room'}
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BOOKING MODAL */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-navy-900 border border-slate-200 dark:border-navy-700 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#003580] dark:text-sky-400" />
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {bookingSuccess ? (isVi ? 'Đặt Phòng Thành Công!' : 'Booking Confirmed!') : (isVi ? 'Xác Nhận Đặt Phòng' : 'Confirm Room Booking')}
                </h3>
              </div>
              <button
                onClick={() => { setSelectedRoom(null); setBookingSuccess(null) }}
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
                    {isVi ? 'Mã xác nhận đặt phòng' : 'Confirmation Reference'}
                  </span>
                  <div className="text-2xl font-black text-emerald-900 dark:text-emerald-200 tracking-wider mt-1">
                    {bookingSuccess.refCode}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 text-xs dark:bg-navy-800">
                  <div className="flex justify-between"><span className="text-slate-400">Khách sạn:</span><span className="font-bold text-slate-800 dark:text-white">{bookingSuccess.hotelName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Hạng phòng:</span><span className="font-bold text-slate-800 dark:text-white">{bookingSuccess.roomName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Thời gian:</span><span className="font-bold text-slate-800 dark:text-white">{bookingSuccess.checkIn} → {bookingSuccess.checkOut} ({bookingSuccess.nights} đêm)</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Khách đại diện:</span><span className="font-bold text-slate-800 dark:text-white">{bookingSuccess.guestName} - {bookingSuccess.guestPhone}</span></div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 dark:border-navy-700"><span className="text-slate-400">Tổng thanh toán:</span><span className="font-black text-sm text-[#003580] dark:text-sky-400">{formatPrice(bookingSuccess.totalPrice)}</span></div>
                </div>

                <button
                  type="button"
                  onClick={() => { setSelectedRoom(null); setBookingSuccess(null) }}
                  className="w-full rounded-xl bg-[#003580] py-2.5 text-xs font-bold text-white shadow dark:bg-sky-500 dark:text-navy-950"
                >
                  {isVi ? 'Hoàn Tất' : 'Done'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="py-4 space-y-4">
                <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                  <div><strong>Khách sạn:</strong> {hotel.name}</div>
                  <div><strong>Hạng phòng:</strong> {selectedRoom.name} ({selectedRoom.size})</div>
                  <div><strong>Lưu trú:</strong> {checkInDate} → {checkOutDate} ({stayNights} đêm)</div>
                  <div className="text-sm font-black text-[#003580] dark:text-sky-400 pt-1">
                    Tổng tiền: {formatPrice(selectedRoom.price * stayNights)}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isVi ? 'Họ và tên khách đại diện' : 'Lead Guest Full Name'} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isVi ? 'Số điện thoại nhận tin nhắn xác nhận' : 'Phone Number'} *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRoom(null)}
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-navy-700 dark:text-slate-300 dark:hover:bg-navy-800"
                  >
                    {isVi ? 'Đóng' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#003580] py-2.5 text-xs font-bold text-white shadow dark:bg-sky-500 dark:text-navy-950 hover:bg-blue-900"
                  >
                    {isVi ? 'Xác Nhận Đặt Phòng' : 'Confirm Booking'}
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
