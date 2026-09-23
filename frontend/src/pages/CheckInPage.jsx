import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Plane,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Download,
  Printer,
  ArrowRight,
  ArrowLeft,
  User,
  Search,
  Luggage,
  Flame,
  BatteryCharging,
  ShieldAlert,
  Clock,
  Info,
  Calendar,
  Ticket,
} from 'lucide-react'
import { checkinApi, extractErrorMessage, bookingApi } from '../api/client'
import { formatTime, formatDate } from '../utils/format'
import AirlineLogo from '../components/common/AirlineLogo'
import BoardingPass from '../components/customer/BoardingPass'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function CheckInPage() {
  const { t, language } = useLanguage()
  const { isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()

  const [step, setStep] = useState(1) // 1: Lookup | 2: Safety & Seat | 3: Boarding Pass
  const [pnr, setPnr] = useState(searchParams.get('pnr') || '')
  const [passengerName, setPassengerName] = useState('')
  const [myRecentBookings, setMyRecentBookings] = useState([])
  const [booking, setBooking] = useState(null)
  const [selectedSeat, setSelectedSeat] = useState('')
  const [dangerousGoodsAccepted, setDangerousGoodsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [checkInResult, setCheckInResult] = useState(null)

  // Language-aware text helper
  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  // Load user's recent bookings for quick 1-click check-in
  useEffect(() => {
    if (isAuthenticated) {
      bookingApi.myBookings()
        .then((list) => {
          if (Array.isArray(list)) {
            const active = list.filter((b) => b.status === 'CONFIRMED' || b.status === 'SEAT_HELD')
            setMyRecentBookings(active)
            if (active.length > 0 && !pnr) {
              setPnr(active[0].bookingReference)
              const pName = active[0].passengers?.[0]?.fullName || active[0].userFullName || ''
              setPassengerName(pName)
            }
          }
        })
        .catch(() => {})
    }
  }, [isAuthenticated])

  // If PNR was passed via query parameter, auto-lookup
  useEffect(() => {
    const urlPnr = searchParams.get('pnr')
    if (urlPnr && urlPnr.trim()) {
      setPnr(urlPnr.trim().toUpperCase())
      handleLookup(null, urlPnr.trim().toUpperCase(), '')
    }
  }, [searchParams])

  const handleLookup = async (e, customPnr, customName) => {
    if (e) e.preventDefault()
    const targetPnr = (customPnr || pnr || '').trim().toUpperCase()
    const targetName = (customName || passengerName || '').trim()

    if (!targetPnr) {
      setError(isVi ? 'Vui lòng nhập Mã đặt chỗ (PNR) trên vé của bạn.' : (isKm ? 'សូមបញ្ចូលលេខកូដកក់ (PNR)' : 'Please enter your Booking Reference (PNR).'))
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await checkinApi.lookup({
        bookingReference: targetPnr,
        passengerName: targetName || null,
      })
      setBooking(data)
      const currentSeat = data.passengers?.[0]?.seatNumber || '12A'
      setSelectedSeat(currentSeat)
      setStep(2)
    } catch (err) {
      setError(
        extractErrorMessage(
          err,
          isVi
            ? 'Không tìm thấy thông tin đặt chỗ. Vui lòng kiểm tra lại mã PNR hoặc họ tên.'
            : (isKm ? 'រកមិនឃើញព័ត៌មានកក់ទេ។ សូមពិនិត្យលេខកូដ PNR ឡើងវិញ។' : 'Booking reference not found. Please verify your PNR or passenger name.')
        )
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteCheckIn = async () => {
    if (!dangerousGoodsAccepted) {
      setError(
        isVi
          ? 'Quý khách vui lòng xác nhận tuân thủ quy định an toàn hàng không IATA.'
          : (isKm ? 'សូមបញ្ជាក់ការយល់ព្រមតាមបទប្បញ្ញត្តិសុវត្ថិភាព IATA' : 'Please confirm compliance with IATA safety regulations before proceeding.')
      )
      return
    }

    setLoading(true)
    setError(null)
    try {
      const passenger = booking.passengers?.[0]
      const res = await checkinApi.complete({
        bookingReference: booking.bookingReference,
        passengerId: passenger?.id || 1,
        newSeatNumber: selectedSeat,
        dangerousGoodsAccepted: true,
      })
      setCheckInResult(res)
      if (res.booking) {
        setBooking(res.booking)
      }
      setStep(3)
    } catch (err) {
      setError(
        extractErrorMessage(
          err,
          isVi
            ? 'Không thể hoàn tất làm thủ tục. Vui lòng liên hệ quầy vé sân bay.'
            : (isKm ? 'មិនអាចបញ្ចប់ការឆែកអ៊ីនបានទេ។ សូមទាក់ទងបញ្ជរអាកាសយានដ្ឋាន។' : 'Unable to complete check-in. Please contact airport staff.')
        )
      )
    } finally {
      setLoading(false)
    }
  }

  const seatOptions = [
    { number: '1A', class: 'BUSINESS', type: 'Window', note: isVi ? 'Hạng thương gia cửa sổ' : (isKm ? 'ថ្នាក់ពាណិជ្ជកម្ម' : 'Business Window') },
    { number: '1C', class: 'BUSINESS', type: 'Aisle', note: isVi ? 'Hạng thương gia lối đi' : (isKm ? 'ថ្នាក់ពាណិជ្ជកម្ម' : 'Business Aisle') },
    { number: '2A', class: 'BUSINESS', type: 'Window', note: isVi ? 'Hạng thương gia cửa sổ' : (isKm ? 'ថ្នាក់ពាណិជ្ជកម្ម' : 'Business Window') },
    { number: '2C', class: 'BUSINESS', type: 'Aisle', note: isVi ? 'Hạng thương gia lối đi' : (isKm ? 'ថ្នាក់ពាណិជ្ជកម្ម' : 'Business Aisle') },
    { number: '4A', class: 'ECONOMY', type: 'Window', note: isVi ? 'Cửa sổ - Khoang trước' : (isKm ? 'បង្អួច' : 'Forward Window') },
    { number: '4C', class: 'ECONOMY', type: 'Aisle', note: isVi ? 'Lối đi - Thuận tiện' : (isKm ? 'ផ្លូវដើរ' : 'Forward Aisle') },
    { number: '5F', class: 'ECONOMY', type: 'Window', note: isVi ? 'Cửa sổ - Cánh bay' : (isKm ? 'បង្អួច' : 'Wing View Window') },
    { number: '12A', class: 'ECONOMY', type: 'Window', note: isVi ? 'Cửa sổ - Yên tĩnh' : (isKm ? 'បង្អួច' : 'Quiet Window') },
    { number: '12B', class: 'ECONOMY', type: 'Middle', note: isVi ? 'Ghế giữa tiêu chuẩn' : (isKm ? 'កណ្តាល' : 'Standard Middle') },
    { number: '12C', class: 'ECONOMY', type: 'Aisle', note: isVi ? 'Lối đi - Dễ di chuyển' : (isKm ? 'ផ្លូវដើរ' : 'Aisle Easy Access') },
    { number: '14A', class: 'ECONOMY', type: 'Window', note: isVi ? 'Cửa sổ - Sau cánh' : (isKm ? 'បង្អួច' : 'Aft Window') },
    { number: '14C', class: 'ECONOMY', type: 'Aisle', note: isVi ? 'Lối đi - Thoải mái' : (isKm ? 'ផ្លូវដើរ' : 'Aft Aisle') },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header Title Banner */}
        <div className="rounded-3xl bg-[#003580] dark:bg-navy-900 p-8 text-white shadow-xl relative overflow-hidden border border-blue-900/40">
          <div className="relative z-10 space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide backdrop-blur-sm text-sky-200 border border-white/20">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isVi ? 'Dịch vụ Làm thủ tục Trực tuyến (Web Check-in)' : (isKm ? 'សេវាកម្មឆែកអ៊ីនតាមអនឡាញ' : 'Online Check-in Service')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {isVi ? 'Làm thủ tục chuyến bay trực tuyến' : (isKm ? 'ឆែកអ៊ីនជើងហោះហើរតាមអនឡាញ' : 'Online Flight Check-in')}
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
              {isVi
                ? 'Mở từ 24 tiếng đến 60 phút trước giờ khởi hành. Quý khách có thể tự do xác nhận chỗ ngồi và nhận Thẻ lên tàu bay điện tử (Boarding Pass).'
                : (isKm
                  ? 'បើកពី ២៤ ម៉ោង ទៅ ៦០ នាទីមុនពេលចេញដំណើរ។ អ្នកដំណើរអាចជ្រើសរើសកៅអី និងទទួលប័ណ្ណឡើងយន្តហោះ។'
                  : 'Available from 24 hours up to 60 minutes before departure. Choose your preferred seat and receive your digital boarding pass instantly.')}
            </p>
          </div>
        </div>

        {/* Step Navigation Progress Bar */}
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-slate-200 dark:bg-navy-800 z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#003580] dark:bg-sky-500 transition-all duration-500 z-0"
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  step >= 1
                    ? 'bg-[#003580] text-white ring-4 ring-sky-100 dark:ring-sky-950'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                1
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1.5">
                {isVi ? 'Tra cứu vé' : (isKm ? 'ស្វែងរកការកក់' : 'Lookup')}
              </span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  step >= 2
                    ? 'bg-[#003580] text-white ring-4 ring-sky-100 dark:ring-sky-950'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                2
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1.5">
                {isVi ? 'Chọn ghế & An toàn' : (isKm ? 'ជ្រើសរើសកៅអី' : 'Seat & Safety')}
              </span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  step === 3
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                3
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1.5">
                {isVi ? 'Thẻ lên máy bay' : (isKm ? 'ប័ណ្ណឡើងយន្តហោះ' : 'Boarding Pass')}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-900/50 p-4 text-xs sm:text-sm text-rose-700 dark:text-rose-300 animate-fade-in">
            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* STEP 1: PNR LOOKUP FORM */}
        {step === 1 && (
          <div className="rounded-3xl border border-slate-200 bg-white dark:bg-navy-900 dark:border-navy-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-navy-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-[#003580] dark:bg-sky-950 dark:text-sky-300 font-bold">
                <Ticket className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-navy-950 dark:text-white">
                  {isVi ? 'Thông tin vé điện tử & Hành khách' : (isKm ? 'ព័ត៌មានសំបុត្រអេឡិចត្រូនិច' : 'Electronic Ticket & Passenger Info')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isVi ? 'Nhập mã đặt chỗ để tìm kiếm hồ sơ chuyến bay' : (isKm ? 'បញ្ចូលលេខកូដកក់ ៦ ខ្ទង់' : 'Enter your 6-character booking reference to retrieve flight details')}
                </p>
              </div>
            </div>

            <form onSubmit={handleLookup} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    {isVi ? 'Mã đặt chỗ (PNR)' : (isKm ? 'លេខកូដកក់ (PNR)' : 'Booking Reference (PNR)')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="VD: ASMVFYXH, PNR123"
                    value={pnr}
                    onChange={(e) => setPnr(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 dark:bg-navy-800 px-4 py-3 font-mono text-base font-bold uppercase tracking-wider text-navy-950 dark:text-white focus:border-[#003580] focus:bg-white focus:outline-none dark:border-navy-700"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {isVi ? 'Gồm 6–8 ký tự in hoa ghi trong phiếu xác nhận đặt vé' : (isKm ? 'មាន ៦-៨ តួអក្សរ' : '6–8 uppercase characters from your confirmation email')}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    {isVi ? 'Họ tên hành khách (Tùy chọn)' : (isKm ? 'ឈ្មោះអ្នកដំណើរ' : 'Passenger Full Name (Optional)')}
                  </label>
                  <input
                    type="text"
                    placeholder="VD: NGUYEN VAN AN"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 dark:bg-navy-800 px-4 py-3 text-sm font-semibold uppercase text-navy-950 dark:text-white focus:border-[#003580] focus:bg-white focus:outline-none dark:border-navy-700"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {isVi ? 'Khớp với tên trên hộ chiếu hoặc căn cước công dân' : (isKm ? 'ដូចនៅលើអត្តសញ្ញាណប័ណ្ណ' : 'Matching official passport or ID card')}
                  </span>
                </div>
              </div>

              {/* Quick Select from User's Active Bookings */}
              {myRecentBookings.length > 0 && (
                <div className="rounded-2xl bg-slate-50 dark:bg-navy-950 p-4 border border-slate-200 dark:border-navy-800 space-y-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                    {isVi ? 'Chuyến bay sẵn sàng làm thủ tục của bạn:' : (isKm ? 'ជើងហោះហើររបស់អ្នក:' : 'Your Active Eligible Bookings:')}
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {myRecentBookings.slice(0, 3).map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          setPnr(b.bookingReference)
                          const pName = b.passengers?.[0]?.fullName || b.userFullName || ''
                          setPassengerName(pName)
                          handleLookup(null, b.bookingReference, pName)
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#003580]/20 bg-white dark:bg-navy-900 px-3.5 py-2 text-xs font-bold text-navy-900 dark:text-white hover:border-[#003580] hover:shadow-sm transition-all"
                      >
                        <Plane className="h-3.5 w-3.5 text-[#006ce4]" />
                        <span className="font-mono text-[#003580] dark:text-sky-400 font-black">{b.bookingReference}</span>
                        <span className="text-slate-500 dark:text-slate-400 font-normal">
                          ({b.flight?.departureAirport?.code} → {b.flight?.arrivalAirport?.code})
                        </span>
                        <span className="rounded-md bg-[#003580] text-white px-2 py-0.5 text-[10px] font-bold">
                          {isVi ? 'Chọn vé này' : (isKm ? 'ជ្រើសរើស' : 'Select')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Info className="h-4 w-4 text-[#006ce4]" />
                  <span>{isVi ? 'Hành khách không có hành lý ký gửi có thể đến thẳng cửa an ninh' : (isKm ? 'អ្នកដំណើរគ្មានឥវ៉ាន់ផ្ញើអាចទៅកាន់ច្រកទ្វារសុវត្ថិភាពដោយផ្ទាល់' : 'Passengers without checked baggage may proceed directly to security')}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto btn-primary py-3 px-8 text-xs font-bold shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>{isVi ? 'Tìm kiếm & Tiếp tục' : (isKm ? 'បន្តទៅមុខ' : 'Search & Continue')}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: SAFETY DECLARATION & SEAT SELECTION */}
        {step === 2 && booking && (
          <div className="space-y-6 animate-fade-in">
            {/* Flight Summary Card */}
            <div className="rounded-3xl border border-slate-200 bg-white dark:bg-navy-900 dark:border-navy-800 p-6 sm:p-7 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-navy-800 gap-4">
                <div className="flex items-center gap-3.5">
                  <AirlineLogo airline={booking.flight?.airline} size="md" />
                  <div>
                    <h3 className="text-base font-bold text-navy-950 dark:text-white">
                      {booking.flight?.airline || 'AeroSmart Airways'} · <span className="font-mono text-[#003580] dark:text-sky-400">{booking.flight?.flightNumber}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      PNR: <strong className="font-mono text-navy-900 dark:text-white">{booking.bookingReference}</strong> · <span className="text-emerald-600 font-bold">CONFIRMED</span>
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 dark:bg-navy-950 px-4 py-2.5 border border-slate-200 dark:border-navy-800 text-right">
                  <span className="text-xs text-slate-400 block font-medium">{isVi ? 'Hành trình' : (isKm ? 'ផ្លូវហោះហើរ' : 'Route')}</span>
                  <span className="font-bold text-sm text-navy-900 dark:text-white">
                    {booking.flight?.departureAirport?.code} → {booking.flight?.arrivalAirport?.code}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    {formatDate(booking.flight?.departureTime)} · {formatTime(booking.flight?.departureTime)}
                  </span>
                </div>
              </div>

              {/* Passenger & Seat Selection Grid */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                <div className="md:col-span-5 p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2">
                  <span className="text-xs font-bold text-slate-500 block">
                    {isVi ? 'Hành khách' : (isKm ? 'អ្នកដំណើរ' : 'Passenger')}
                  </span>
                  <p className="text-base font-bold text-navy-950 dark:text-white uppercase">
                    {booking.passengers?.[0]?.fullName || booking.userFullName || 'Passenger'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ID: <strong className="text-slate-700 dark:text-slate-200">{booking.passengers?.[0]?.passportNumber || 'VERIFIED'}</strong>
                  </p>
                  <div className="pt-2 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{isVi ? 'Ghế đã chọn:' : (isKm ? 'កៅអី:' : 'Selected Seat:')}</span>
                    <span className="rounded-lg bg-[#003580] px-3 py-1 font-mono font-bold text-white">
                      {selectedSeat}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-7 p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isVi ? 'Chọn vị trí ghế ngồi (Seat Map)' : (isKm ? 'ជ្រើសរើសកៅអី' : 'Choose Your Seat (Seat Map)')}
                    </span>
                    <span className="text-xs text-emerald-600 font-bold">{isVi ? 'Miễn phí đổi ghế' : (isKm ? 'ឥតគិតថ្លៃ' : 'Free Selection')}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {seatOptions.map((s) => {
                      const isSelected = selectedSeat === s.number
                      return (
                        <button
                          key={s.number}
                          type="button"
                          onClick={() => setSelectedSeat(s.number)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-[#003580] bg-[#003580] text-white shadow-md'
                              : 'border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-black text-sm">{s.number}</span>
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-navy-800 text-slate-500'
                            }`}>
                              {s.type}
                            </span>
                          </div>
                          <p className={`text-[10px] mt-1 truncate ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                            {s.note}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* IATA Safety & Dangerous Goods Declaration */}
            <div className="rounded-3xl border border-slate-200 bg-white dark:bg-navy-900 dark:border-navy-800 p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-bold text-navy-950 dark:text-white">
                  {isVi ? 'Quy định an toàn hàng không (IATA Safety Regulations)' : (isKm ? 'បទប្បញ្ញត្តិសុវត្ថិភាពអាកាសចរណ៍' : 'Aviation Safety & Dangerous Goods Declaration (IATA)')}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start gap-3">
                  <BatteryCharging className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-navy-950 dark:text-white font-bold mb-0.5">{isVi ? 'Pin sạc dự phòng' : (isKm ? 'ថ្មសាក' : 'Power Banks')}</strong>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                      {isVi ? 'Chỉ để trong hành lý xách tay (<160Wh). Cấm gửi trong hành lý ký gửi.' : (isKm ? 'ដាក់តែក្នុងឥវ៉ាន់យួរដៃ' : 'Must be kept in carry-on luggage only. Prohibited in checked bags.')}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 flex items-start gap-3">
                  <Flame className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-navy-950 dark:text-white font-bold mb-0.5">{isVi ? 'Chất dễ cháy & Khí ga' : (isKm ? 'សារធាតុងាយឆេះ' : 'Flammable Materials')}</strong>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                      {isVi ? 'Cấm tuyệt đối mang theo bật lửa khò, bình xịt cay, chất nổ.' : (isKm ? 'ហាមឃាត់ដាច់ខាត' : 'Strictly prohibited in all baggage items.')}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/40 flex items-start gap-3">
                  <Luggage className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-navy-950 dark:text-white font-bold mb-0.5">{isVi ? 'Chất lỏng quốc tế' : (isKm ? 'វត្ថុរាវ' : 'Liquids & Aerosols')}</strong>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                      {isVi ? 'Mỗi bình chứa tối đa 100ml trong túi zip trong suốt 1 lít.' : (isKm ? 'មិនលើសពី ១០០ មីលីលីត្រ' : 'Max 100ml per container in 1L transparent sealable bag.')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkbox agreement */}
              <label className="flex items-start gap-3 p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/30 dark:border-emerald-900/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={dangerousGoodsAccepted}
                  onChange={(e) => setDangerousGoodsAccepted(e.target.checked)}
                  className="h-5 w-5 mt-0.5 rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-semibold text-emerald-950 dark:text-emerald-200 leading-relaxed">
                  {isVi
                    ? 'Tôi xác nhận đã đọc, hiểu rõ và cam kết hành lý không chứa bất kỳ chất cấm nào theo quy định an toàn hàng không của Cục Hàng không Dân dụng & IATA.'
                    : (isKm
                      ? 'ខ្ញុំបញ្ជាក់ថាបានអាន និងយល់ព្រមតាមបទប្បញ្ញត្តិសុវត្ថិភាពអាកាសចរណ៍ IATA។'
                      : 'I hereby declare that I have read and agree to comply with all civil aviation safety and IATA dangerous goods regulations.')}
                </span>
              </label>

              <div className="pt-2 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-outline py-2.5 px-5 text-xs font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{isVi ? 'Quay lại' : (isKm ? 'ត្រឡប់ក្រោយ' : 'Back')}</span>
                </button>

                <button
                  type="button"
                  disabled={loading || !dangerousGoodsAccepted}
                  onClick={handleCompleteCheckIn}
                  className="btn-primary py-3 px-8 text-xs font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{isVi ? 'Xác nhận & Xuất thẻ lên tàu bay' : (isKm ? 'បញ្ជាក់ និងចេញប័ណ្ណ' : 'Confirm & Issue Boarding Pass')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: BOARDING PASS ISSUED */}
        {step === 3 && booking && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 dark:bg-emerald-950/40 dark:border-emerald-900/50 p-6 text-center space-y-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-black text-emerald-950 dark:text-emerald-200">
                {isVi ? 'Làm thủ tục chuyến bay thành công!' : (isKm ? 'ឆែកអ៊ីនជោគជ័យ!' : 'Check-in Completed Successfully!')}
              </h2>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-lg mx-auto">
                {isVi
                  ? 'Thẻ lên tàu bay điện tử (e-Boarding Pass) đã được cấp và gửi đến email của quý khách. Vui lòng có mặt tại cửa khởi hành trước 30 phút.'
                  : (isKm
                    ? 'ប័ណ្ណឡើងយន្តហោះត្រូវបានបង្កើតរួចរាល់។ សូមមានវត្តមាននៅមាត់ទ្វារចេញដំណើរ ៣០ នាទីមុនពេលហោះហើរ។'
                    : 'Your electronic boarding pass is issued and ready. Please arrive at the boarding gate at least 30 minutes prior to departure.')}
              </p>
            </div>

            {/* Boarding Pass Component Preview */}
            <div className="rounded-3xl border border-slate-200 bg-white dark:bg-navy-900 dark:border-navy-800 p-6 sm:p-8 shadow-md">
              <BoardingPass
                booking={booking}
                passenger={booking.passengers?.[0]}
                flight={booking.flight}
              />

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-navy-800 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={bookingApi.getDocumentUrl(booking.bookingReference, 'PDF')}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>{isVi ? 'Tải vé điện tử PDF (IATA Standard)' : (isKm ? 'ទាញយកសំបុត្រ PDF' : 'Download PDF E-Ticket')}</span>
                </a>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-outline py-2.5 px-5 text-xs font-bold flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>{isVi ? 'In Thẻ lên tàu bay' : (isKm ? 'បោះពុម្ព' : 'Print Boarding Pass')}</span>
                </button>

                <Link
                  to="/my-bookings"
                  className="text-xs font-bold text-[#006ce4] dark:text-sky-400 hover:underline px-2"
                >
                  {isVi ? 'Xem danh sách vé của tôi →' : (isKm ? 'មើលការកក់របស់ខ្ញុំ →' : 'View My Bookings →')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
