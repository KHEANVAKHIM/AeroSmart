import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import {
  Plane,
  ArrowLeftRight,
  Calendar,
  Users,
  Search,
  Sparkles,
  Hotel,
  Globe,
  Car,
  Compass,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Luggage,
} from 'lucide-react'
import { flightApi } from '../../api/client'
import { useBooking } from '../../context/BookingContext'
import { useLanguage } from '../../context/LanguageContext'
import { todayInputValue } from '../../utils/format'
import NewServicesModal from './NewServicesModal'

const DEFAULT_AIRPORTS = [
  // National / Domestic Vietnam
  { code: 'HAN', name: 'Noi Bai Int\'l', city: 'Hanoi', country: 'Vietnam' },
  { code: 'SGN', name: 'Tan Son Nhat Int\'l', city: 'Ho Chi Minh City', country: 'Vietnam' },
  { code: 'DAD', name: 'Da Nang Int\'l', city: 'Da Nang', country: 'Vietnam' },
  { code: 'PQC', name: 'Phu Quoc Int\'l', city: 'Phu Quoc', country: 'Vietnam' },
  { code: 'CXR', name: 'Cam Ranh Int\'l', city: 'Nha Trang', country: 'Vietnam' },
  { code: 'DLI', name: 'Lien Khuong', city: 'Da Lat', country: 'Vietnam' },
  { code: 'HPH', name: 'Cat Bi Int\'l', city: 'Hai Phong', country: 'Vietnam' },
  { code: 'HUI', name: 'Phu Bai Int\'l', city: 'Hue', country: 'Vietnam' },
  // International Hubs
  { code: 'SAI', name: 'Siem Reap Angkor Int\'l', city: 'Siem Reap', country: 'Cambodia' },
  { code: 'PNH', name: 'Phnom Penh Int\'l', city: 'Phnom Penh', country: 'Cambodia' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
  { code: 'NRT', name: 'Narita Int\'l', city: 'Tokyo', country: 'Japan' },
  { code: 'ICN', name: 'Incheon Int\'l', city: 'Seoul', country: 'South Korea' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
]

export default function FlightSearchHero({ initialCompact = false }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { searchCriteria, updateSearchCriteria, activeProductTab = 'flights', setActiveProductTab } = useBooking()
  const { language, t } = useLanguage()

  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const [airports, setAirports] = useState(DEFAULT_AIRPORTS)
  const [modalService, setModalService] = useState(null)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)

  // URL params fallback
  const urlOrigin = searchParams.get('origin')
  const urlDest = searchParams.get('destination')
  const urlDate = searchParams.get('departureDate')
  const urlPax = searchParams.get('passengers')
  const urlType = searchParams.get('tripType')

  // 1. FLIGHTS FORM STATE
  const [tripType, setTripType] = useState(urlType || searchCriteria.tripType || 'ONE_WAY')
  const [origin, setOrigin] = useState(urlOrigin || searchCriteria.origin || 'HAN')
  const [destination, setDestination] = useState(urlDest || searchCriteria.destination || 'SGN')
  const [departureDate, setDepartureDate] = useState(urlDate || searchCriteria.departureDate || todayInputValue())
  const [returnDate, setReturnDate] = useState(searchCriteria.returnDate || '')
  const [passengers, setPassengers] = useState(urlPax ? Number(urlPax) : (searchCriteria.passengers || 1))

  // 2. STAYS FORM STATE
  const [stayDestination, setStayDestination] = useState('Phú Quốc (PQC), Việt Nam')
  const [checkInDate, setCheckInDate] = useState(todayInputValue())
  const [checkOutDate, setCheckOutDate] = useState('')
  const [stayGuests, setStayGuests] = useState('2 người lớn · 0 trẻ em · 1 phòng')

  // 3. FLIGHT + HOTEL (PACKAGE) STATE
  const [pkgOrigin, setPkgOrigin] = useState('HAN')
  const [pkgDest, setPkgDest] = useState('PQC')
  const [pkgDepartDate, setPkgDepartDate] = useState(todayInputValue())
  const [pkgReturnDate, setPkgReturnDate] = useState('')
  const [pkgRooms, setPkgRooms] = useState('1 phòng, 2 khách')

  // 4. CAR RENTAL STATE
  const [carLocation, setCarLocation] = useState('Sân bay Quốc tế Nội Bài (HAN)')
  const [carPickDate, setCarPickDate] = useState(todayInputValue())
  const [carPickTime, setCarPickTime] = useState('10:00')
  const [carDropDate, setCarDropDate] = useState('')
  const [carDropTime, setCarDropTime] = useState('10:00')
  const [carDriverAge, setCarDriverAge] = useState(true)

  // 5. ATTRACTIONS STATE
  const [attractionLoc, setAttractionLoc] = useState('VinWonders & Safari Phú Quốc')
  const [attractionDate, setAttractionDate] = useState(todayInputValue())
  const [attractionCategory, setAttractionCategory] = useState('ALL')

  // 6. AIRPORT TAXIS STATE
  const [taxiPickAirport, setTaxiPickAirport] = useState('Sân bay Nội Bài (HAN) - Ga T1/T2')
  const [taxiDropAddress, setTaxiDropAddress] = useState('Khách sạn Trung tâm Quận Hoàn Kiếm, Hà Nội')
  const [taxiDate, setTaxiDate] = useState(todayInputValue())
  const [taxiTime, setTaxiTime] = useState('08:30')
  const [taxiPax, setTaxiPax] = useState('2 khách, 2 vali')

  useEffect(() => {
    flightApi
      .listAirports()
      .then((data) => {
        if (data && data.length > 0) setAirports(data)
      })
      .catch(() => {})
  }, [])

  // Sync state if URL params change
  useEffect(() => {
    if (urlOrigin) setOrigin(urlOrigin)
    if (urlDest) setDestination(urlDest)
    if (urlDate) setDepartureDate(urlDate)
    if (urlPax) setPassengers(Number(urlPax))
    if (urlType) setTripType(urlType)
  }, [urlOrigin, urlDest, urlDate, urlPax, urlType])

  const handleSwapAirports = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
  }

  // Handle Search for Flights
  const handleSearchFlights = (e) => {
    e?.preventDefault()
    updateSearchCriteria({
      origin,
      destination,
      departureDate,
      returnDate: tripType === 'ROUND_TRIP' ? returnDate : '',
      passengers,
      tripType,
    })
    navigate(
      `/flights?origin=${origin}&destination=${destination}&departureDate=${departureDate}&passengers=${passengers}&tripType=${tripType}`
    )
    if (location.pathname === '/flights') {
      setTimeout(() => {
        window.scrollTo({ top: 350, behavior: 'smooth' })
      }, 100)
    }
  }

  // Handle Search for Stays (Hotels / Resorts)
  const handleSearchStays = (e) => {
    e?.preventDefault()
    if (setActiveProductTab) setActiveProductTab('stays')
    navigate('/stays')
  }

  // Handle Search for Flight + Hotel
  const handleSearchPackage = (e) => {
    e?.preventDefault()
    if (setActiveProductTab) setActiveProductTab('package')
    navigate('/flight-hotel')
  }

  // Handle Search for Car Rentals
  const handleSearchCars = (e) => {
    e?.preventDefault()
    if (setActiveProductTab) setActiveProductTab('cars')
    navigate('/car-rental')
  }

  // Handle Search for Attractions
  const handleSearchAttractions = (e) => {
    e?.preventDefault()
    if (setActiveProductTab) setActiveProductTab('attractions')
    navigate('/attractions')
  }

  // Handle Search for Airport Taxis
  const handleSearchTaxis = (e) => {
    e?.preventDefault()
    if (setActiveProductTab) setActiveProductTab('taxis')
    navigate('/airport-taxis')
  }

  const navProducts = [
    { id: 'stays', label: isVi ? 'Chỗ nghỉ' : (isKm ? 'កន្លែងស្នាក់នៅ' : 'Stays'), icon: Hotel },
    { id: 'flights', label: isVi ? 'Chuyến bay' : (isKm ? 'ជើងហោះហើរ' : 'Flights'), icon: Plane },
    { id: 'package', label: isVi ? 'Chuyến bay + K.sạn' : (isKm ? 'សំបុត្រ + សណ្ឋាគារ' : 'Flight + Hotel'), icon: Globe },
    { id: 'cars', label: isVi ? 'Thuê xe' : (isKm ? 'ជួលរថយន្ត' : 'Car rental'), icon: Car },
    { id: 'attractions', label: isVi ? 'Địa điểm tham quan' : (isKm ? 'កន្លែងកម្សាន្ត' : 'Attractions'), icon: Compass },
    { id: 'taxis', label: isVi ? 'Taxi sân bay' : (isKm ? 'តាក់ស៊ីព្រលាន' : 'Airport taxis'), icon: Car },
  ]

  return (
    <div id="search-hero-section" className={`w-full ${initialCompact ? 'py-4' : 'py-6 md:py-12'}`}>
      <div className="mx-auto max-w-6xl">
        {!initialCompact && (
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-sky-200 backdrop-blur-md shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Smart Booking, Seamless Journey · AeroSmart 2026</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm">
              {activeProductTab === 'stays' && (isVi ? 'Tìm & Đặt Phòng Khách Sạn / Resort Đẳng Cấp' : (isKm ? 'ស្វែងរកកន្លែងស្នាក់នៅ & សណ្ឋាគារ' : 'Find Your Ideal Hotel & Luxury Stay'))}
              {activeProductTab === 'flights' && (t('home.heroTitle') || 'Tìm Chuyến Bay Trực Tuyến Tốt Nhất')}
              {activeProductTab === 'package' && (isVi ? 'Gói Combo Tiết Kiệm: Vé Máy Bay + Khách Sạn' : (isKm ? 'កញ្ចប់សំបុត្រយន្តហោះ + សណ្ឋាគារ' : 'Save with Flight + Hotel Packages'))}
              {activeProductTab === 'cars' && (isVi ? 'Thuê Xe Tự Lái & Xe Đưa Đón Cao Cấp' : (isKm ? 'ជួលរថយន្តទំនើប' : 'Car Rentals for Any Kind of Trip'))}
              {activeProductTab === 'attractions' && (isVi ? 'Vé Tham Quan, Tour & Trải Nghiệm Du Lịch' : (isKm ? 'កន្លែងកម្សាន្ត និងដំណើរកម្សាន្ត' : 'Attractions, Activities & Experiences'))}
              {activeProductTab === 'taxis' && (isVi ? 'Taxi & Xe Limousine Đưa Đón Sân Bay Tận Nơi' : (isKm ? 'តាក់ស៊ីព្រលានយន្តហោះ' : 'Airport Taxis & Chauffeur Transfers'))}
            </h1>
            <p className="mx-auto max-w-2xl text-xs sm:text-sm text-sky-100/90 font-medium leading-relaxed">
              {activeProductTab === 'stays' && (isVi ? 'Hơn 500+ khách sạn 5 sao, resort ven biển với giá tốt nhất và xác nhận tức thì.' : '500+ luxury hotels and beach resorts with instant confirmation.')}
              {activeProductTab === 'flights' && (t('home.heroSubtitle') || 'Tra cứu hàng trăm chuyến bay nội địa và quốc tế với khóa ghế Redisson 15 phút.')}
              {activeProductTab === 'package' && (isVi ? 'Tiết kiệm đến 30% khi đặt trọn gói vé máy bay cùng khách sạn nghỉ dưỡng cao cấp.' : 'Save up to 30% when booking your flight and luxury hotel together.')}
              {activeProductTab === 'cars' && (isVi ? 'Đa dạng dòng xe từ Sedan, SUV đến Limousine VIP, thủ tục nhanh gọn không phát sinh chi phí.' : 'Great prices on luxury cars, SUVs and minivans with flexible cancellation.')}
              {activeProductTab === 'attractions' && (isVi ? 'Khám phá các điểm tham quan nổi tiếng, công viên giải trí và tour văn hóa đặc sắc.' : 'Skip the line at top attractions, theme parks, and cultural tours.')}
              {activeProductTab === 'taxis' && (isVi ? 'Tài xế đón đúng giờ tại ga đến, giá cước trọn gói cố định không lo phụ phí kẹt xe.' : 'Reliable, low-cost airport transfers with professional drivers and flight tracking.')}
            </p>
          </div>
        )}

        {/* Multi-Product Search Card */}
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur-xl md:p-8 text-navy-950 dark:border-navy-800 dark:bg-navy-900/95 dark:text-white transition-colors">
          
          {/* Top Product Tabs Bar (Signature Booking.com Style) */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-6 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-navy-800 pb-4">
            {navProducts.map((prod) => {
              const Icon = prod.icon
              const isActive = activeProductTab === prod.id
              return (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => setActiveProductTab && setActiveProductTab(prod.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border shadow-sm ${
                    isActive
                      ? 'bg-[#003580] text-white border-[#003580] shadow-md dark:bg-sky-500 dark:text-navy-950 dark:border-sky-400 scale-105'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100 dark:bg-navy-800 dark:text-slate-200 dark:border-navy-700'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${prod.id === 'flights' ? '-rotate-45' : ''}`} />
                  <span>{prod.label}</span>
                </button>
              )
            })}
          </div>

          {/* ================= FORM 1: FLIGHTS SEARCH ================= */}
          {activeProductTab === 'flights' && (
            <div>
              {/* Trip Type Tabs */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setTripType('ONE_WAY')}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                    tripType === 'ONE_WAY'
                      ? 'bg-[#003580] text-white shadow-sm dark:bg-[#006ce4]'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800'
                  }`}
                >
                  {t('search.oneWay')}
                </button>
                <button
                  type="button"
                  onClick={() => setTripType('ROUND_TRIP')}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                    tripType === 'ROUND_TRIP'
                      ? 'bg-[#003580] text-white shadow-sm dark:bg-[#006ce4]'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800'
                  }`}
                >
                  {t('search.roundTrip')}
                </button>
              </div>

              {/* Flight Search Form */}
              <form onSubmit={handleSearchFlights} className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                <div className="md:col-span-3">
                  <label className="label text-slate-700 dark:text-slate-300">{t('search.from')}</label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="input font-semibold text-slate-900 dark:text-white cursor-pointer"
                  >
                    {airports.map((a) => (
                      <option key={a.code} value={a.code}>
                        {a.city} ({a.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="hidden md:flex md:col-span-1 items-end justify-center pb-2">
                  <button
                    type="button"
                    onClick={handleSwapAirports}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-600 hover:border-[#006ce4] hover:bg-[#ebf3ff] hover:text-[#003580] transition-all shadow-sm"
                    title="Swap"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="md:col-span-3">
                  <label className="label text-slate-700 dark:text-slate-300">{t('search.to')}</label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="input font-semibold text-slate-900 dark:text-white cursor-pointer"
                  >
                    {airports.map((a) => (
                      <option key={a.code} value={a.code} disabled={a.code === origin}>
                        {a.city} ({a.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className={tripType === 'ROUND_TRIP' ? 'md:col-span-2' : 'md:col-span-3'}>
                  <label className="label text-slate-700 dark:text-slate-300">{t('search.departureDate')}</label>
                  <input
                    type="date"
                    value={departureDate}
                    min={todayInputValue()}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="input font-medium"
                    required
                  />
                </div>

                {tripType === 'ROUND_TRIP' && (
                  <div className="md:col-span-2">
                    <label className="label text-slate-700 dark:text-slate-300">{t('search.returnDate')}</label>
                    <input
                      type="date"
                      value={returnDate}
                      min={departureDate || todayInputValue()}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="input font-medium"
                    />
                  </div>
                )}

                <div className={tripType === 'ROUND_TRIP' ? 'md:col-span-1' : 'md:col-span-2'}>
                  <label className="label text-slate-700 dark:text-slate-300">{t('search.passengers')}</label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="input font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? t('search.guest') : t('search.guests')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-12 mt-2">
                  <button
                    type="submit"
                    className="w-full btn-yellow py-3.5 text-base font-black shadow-md flex items-center justify-center gap-2"
                  >
                    <Search className="h-5 w-5" />
                    <span>{isVi ? 'Tìm Chuyến Bay' : (isKm ? 'ស្វែងរកជើងហោះហើរ' : 'Search Flights')}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= FORM 2: STAYS / HOTELS SEARCH ================= */}
          {activeProductTab === 'stays' && (
            <form onSubmit={handleSearchStays} className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              <div className="md:col-span-4">
                <label className="label text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#006ce4]" />
                  <span>{isVi ? 'Bạn muốn đến đâu?' : (isKm ? 'តើអ្នកចង់ទៅណា?' : 'Where are you going?')}</span>
                </label>
                <input
                  type="text"
                  value={stayDestination}
                  onChange={(e) => setStayDestination(e.target.value)}
                  placeholder="Ví dụ: Phú Quốc, Đà Nẵng, Hà Nội, Nha Trang, Bangkok..."
                  className="input font-semibold"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="label text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#006ce4]" />
                  <span>{isVi ? 'Ngày nhận phòng' : 'Check-in'}</span>
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  min={todayInputValue()}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="input font-medium"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="label text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#006ce4]" />
                  <span>{isVi ? 'Ngày trả phòng' : 'Check-out'}</span>
                </label>
                <input
                  type="date"
                  value={checkOutDate}
                  min={checkInDate || todayInputValue()}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="input font-medium"
                />
              </div>

              <div className="md:col-span-4">
                <label className="label text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-[#006ce4]" />
                  <span>{isVi ? 'Số khách & phòng' : 'Guests & Rooms'}</span>
                </label>
                <select
                  value={stayGuests}
                  onChange={(e) => setStayGuests(e.target.value)}
                  className="input font-semibold"
                >
                  <option value="1 người lớn · 1 phòng">{isVi ? '1 người lớn · 1 phòng' : '1 adult · 1 room'}</option>
                  <option value="2 người lớn · 0 trẻ em · 1 phòng">{isVi ? '2 người lớn · 0 trẻ em · 1 phòng' : '2 adults · 0 children · 1 room'}</option>
                  <option value="2 người lớn · 1 trẻ em · 1 phòng">{isVi ? '2 người lớn · 1 trẻ em · 1 phòng' : '2 adults · 1 child · 1 room'}</option>
                  <option value="Gia đình (4 người) · 2 phòng">{isVi ? 'Gia đình (4 người) · 2 phòng' : 'Family (4 guests) · 2 rooms'}</option>
                  <option value="Đoàn công tác · 3 phòng">{isVi ? 'Đoàn công tác · 3 phòng' : 'Group · 3 rooms'}</option>
                </select>
              </div>

              <div className="md:col-span-12 mt-2">
                <button
                  type="submit"
                  className="w-full btn-yellow py-3.5 text-base font-black shadow-md flex items-center justify-center gap-2"
                >
                  <Search className="h-5 w-5" />
                  <span>{isVi ? 'Tìm Chỗ Nghỉ & Resort 5 Sao' : (isKm ? 'ស្វែងរកសណ្ឋាគារ & រីសត' : 'Search Stays & 5-Star Resorts')}</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= FORM 3: FLIGHT + HOTEL COMBO ================= */}
          {activeProductTab === 'package' && (
            <form onSubmit={handleSearchPackage} className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              <div className="md:col-span-3">
                <label className="label text-slate-700 dark:text-slate-300">{isVi ? 'Khởi hành từ' : 'Flying from'}</label>
                <select
                  value={pkgOrigin}
                  onChange={(e) => setPkgOrigin(e.target.value)}
                  className="input font-semibold"
                >
                  {airports.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.city} ({a.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="label text-slate-700 dark:text-slate-300">{isVi ? 'Điểm đến & Nghỉ dưỡng' : 'Going to'}</label>
                <select
                  value={pkgDest}
                  onChange={(e) => setPkgDest(e.target.value)}
                  className="input font-semibold"
                >
                  <option value="PQC">Phú Quốc (PQC) · Vinpearl & InterContinental</option>
                  <option value="DAD">Đà Nẵng (DAD) · Furama & Hyatt Regency</option>
                  <option value="CXR">Nha Trang (CXR) · Amiana & Sheraton</option>
                  <option value="BKK">Bangkok (BKK) · Siam Kempinski</option>
                  <option value="SIN">Singapore (SIN) · Marina Bay Sands</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="label text-slate-700 dark:text-slate-300">{isVi ? 'Ngày đi' : 'Depart'}</label>
                <input
                  type="date"
                  value={pkgDepartDate}
                  min={todayInputValue()}
                  onChange={(e) => setPkgDepartDate(e.target.value)}
                  className="input font-medium"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="label text-slate-700 dark:text-slate-300">{isVi ? 'Ngày về' : 'Return'}</label>
                <input
                  type="date"
                  value={pkgReturnDate}
                  min={pkgDepartDate || todayInputValue()}
                  onChange={(e) => setPkgReturnDate(e.target.value)}
                  className="input font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label text-slate-700 dark:text-slate-300">{isVi ? 'Phòng & Khách' : 'Rooms'}</label>
                <select
                  value={pkgRooms}
                  onChange={(e) => setPkgRooms(e.target.value)}
                  className="input font-semibold"
                >
                  <option value="1 phòng, 2 khách">{isVi ? '1 phòng, 2 khách' : '1 room, 2 guests'}</option>
                  <option value="1 phòng, 1 khách">{isVi ? '1 phòng, 1 khách' : '1 room, 1 guest'}</option>
                  <option value="2 phòng, 4 khách">{isVi ? '2 phòng, 4 khách' : '2 rooms, 4 guests'}</option>
                </select>
              </div>

              <div className="md:col-span-12 mt-2">
                <button
                  type="submit"
                  className="w-full btn-yellow py-3.5 text-base font-black shadow-md flex items-center justify-center gap-2"
                >
                  <Search className="h-5 w-5" />
                  <span>{isVi ? 'Tìm Gói Combo Vé + Khách Sạn (Tiết kiệm 30%)' : (isKm ? 'ស្វែងរកកញ្ចប់ Combo' : 'Search Flight + Hotel Packages')}</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= FORM 4: CAR RENTALS ================= */}
          {activeProductTab === 'cars' && (
            <form onSubmit={handleSearchCars} className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              <div className="md:col-span-4">
                <label className="label text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#006ce4]" />
                  <span>{isVi ? 'Địa điểm nhận xe' : 'Pick-up Location'}</span>
                </label>
                <select
                  value={carLocation}
                  onChange={(e) => setCarLocation(e.target.value)}
                  className="input font-semibold"
                >
                  <option value="Sân bay Quốc tế Nội Bài (HAN)">Sân bay Quốc tế Nội Bài (HAN) - Hà Nội</option>
                  <option value="Sân bay Quốc tế Tân Sơn Nhất (SGN)">Sân bay Quốc tế Tân Sơn Nhất (SGN) - TP. HCM</option>
                  <option value="Sân bay Quốc tế Đà Nẵng (DAD)">Sân bay Quốc tế Đà Nẵng (DAD)</option>
                  <option value="Sân bay Quốc tế Phú Quốc (PQC)">Sân bay Quốc tế Phú Quốc (PQC)</option>
                  <option value="Sân bay Siem Reap Angkor (SAI)">Sân bay Siem Reap Angkor (SAI) - Cambodia</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="label text-slate-700 dark:text-slate-300">{isVi ? 'Ngày nhận xe' : 'Pick-up Date'}</label>
                <input
                  type="date"
                  value={carPickDate}
                  min={todayInputValue()}
                  onChange={(e) => setCarPickDate(e.target.value)}
                  className="input font-medium"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="label text-slate-700 dark:text-slate-300">{isVi ? 'Giờ nhận' : 'Time'}</label>
                <select
                  value={carPickTime}
                  onChange={(e) => setCarPickTime(e.target.value)}
                  className="input font-semibold"
                >
                  {['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="label text-slate-700 dark:text-slate-300">{isVi ? 'Ngày trả xe' : 'Drop-off Date'}</label>
                <input
                  type="date"
                  value={carDropDate}
                  min={carPickDate || todayInputValue()}
                  onChange={(e) => setCarDropDate(e.target.value)}
                  className="input font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label text-slate-700 dark:text-slate-300">{isVi ? 'Giờ trả' : 'Time'}</label>
                <select
                  value={carDropTime}
                  onChange={(e) => setCarDropTime(e.target.value)}
                  className="input font-semibold"
                >
                  {['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-12 flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={carDriverAge}
                    onChange={(e) => setCarDriverAge(e.target.checked)}
                    className="rounded border-slate-300 text-[#006ce4] focus:ring-[#006ce4]"
                  />
                  <span>{isVi ? 'Độ tuổi tài xế từ 25 - 65 tuổi (Bảo hiểm đầy đủ)' : 'Driver aged between 25 - 65 (Full insurance included)'}</span>
                </label>
              </div>

              <div className="md:col-span-12 mt-2">
                <button
                  type="submit"
                  className="w-full btn-yellow py-3.5 text-base font-black shadow-md flex items-center justify-center gap-2"
                >
                  <Search className="h-5 w-5" />
                  <span>{isVi ? 'Tìm Xe Tự Lái & Limousine' : (isKm ? 'ស្វែងរកជួលរថយន្ត' : 'Search Car Rentals & Chauffeurs')}</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= FORM 5: ATTRACTIONS SEARCH ================= */}
          {activeProductTab === 'attractions' && (
            <form onSubmit={handleSearchAttractions} className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              <div className="md:col-span-5">
                <label className="label text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-[#006ce4]" />
                  <span>{isVi ? 'Địa điểm hoặc hoạt động trải nghiệm' : 'Destination or Activity'}</span>
                </label>
                <input
                  type="text"
                  value={attractionLoc}
                  onChange={(e) => setAttractionLoc(e.target.value)}
                  placeholder="Ví dụ: VinWonders Phú Quốc, Ba Na Hills, Vịnh Hạ Long, Angkor Wat..."
                  className="input font-semibold"
                  required
                />
              </div>

              <div className="md:col-span-3">
                <label className="label text-slate-700 dark:text-slate-300">{isVi ? 'Ngày tham quan' : 'Visit Date'}</label>
                <input
                  type="date"
                  value={attractionDate}
                  min={todayInputValue()}
                  onChange={(e) => setAttractionDate(e.target.value)}
                  className="input font-medium"
                  required
                />
              </div>

              <div className="md:col-span-4">
                <label className="label text-slate-700 dark:text-slate-300">{isVi ? 'Loại trải nghiệm' : 'Category'}</label>
                <select
                  value={attractionCategory}
                  onChange={(e) => setAttractionCategory(e.target.value)}
                  className="input font-semibold"
                >
                  <option value="ALL">{isVi ? 'Tất cả các loại vé & tour' : 'All Attractions & Passes'}</option>
                  <option value="PARK">{isVi ? 'Công viên giải trí & Theme Park' : 'Theme Parks'}</option>
                  <option value="CRUISE">{isVi ? 'Du thuyền & Tour biển đảo' : 'Cruises & Island Tours'}</option>
                  <option value="CULTURE">{isVi ? 'Di sản văn hóa & Bảo tàng' : 'Cultural Heritage'}</option>
                </select>
              </div>

              <div className="md:col-span-12 mt-2">
                <button
                  type="submit"
                  className="w-full btn-yellow py-3.5 text-base font-black shadow-md flex items-center justify-center gap-2"
                >
                  <Search className="h-5 w-5" />
                  <span>{isVi ? 'Tìm Vé Tham Quan & Tour' : (isKm ? 'ស្វែងរកសំបុត្រ & ដំណើរកម្សាន្ត' : 'Search Attractions & Tours')}</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= FORM 6: AIRPORT TAXIS SEARCH ================= */}
          {activeProductTab === 'taxis' && (
            <form onSubmit={handleSearchTaxis} className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              <div className="md:col-span-4">
                <label className="label text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-500" />
                  <span>{isVi ? 'Điểm đón (Sân bay / Địa chỉ)' : 'Pick-up Location'}</span>
                </label>
                <select
                  value={taxiPickAirport}
                  onChange={(e) => setTaxiPickAirport(e.target.value)}
                  className="input font-semibold"
                >
                  <option value="Sân bay Nội Bài (HAN) - Ga T1/T2">Sân bay Nội Bài (HAN) - Ga T1/T2 (Hà Nội)</option>
                  <option value="Sân bay Tân Sơn Nhất (SGN) - Ga Quốc nội/Quốc tế">Sân bay Tân Sơn Nhất (SGN) - Ga T1/T2 (TP. HCM)</option>
                  <option value="Sân bay Đà Nẵng (DAD)">Sân bay Quốc tế Đà Nẵng (DAD)</option>
                  <option value="Sân bay Phú Quốc (PQC)">Sân bay Quốc tế Phú Quốc (PQC)</option>
                  <option value="Sân bay Siem Reap (SAI)">Sân bay Quốc tế Siem Reap (SAI)</option>
                </select>
              </div>

              <div className="md:col-span-4">
                <label className="label text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-[#006ce4]" />
                  <span>{isVi ? 'Điểm trả (Khách sạn / Địa chỉ)' : 'Drop-off Address'}</span>
                </label>
                <input
                  type="text"
                  value={taxiDropAddress}
                  onChange={(e) => setTaxiDropAddress(e.target.value)}
                  placeholder="Nhập tên khách sạn hoặc địa chỉ điểm đến..."
                  className="input font-semibold"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="label text-slate-700 dark:text-slate-300">{isVi ? 'Ngày đón' : 'Pick-up Date'}</label>
                <input
                  type="date"
                  value={taxiDate}
                  min={todayInputValue()}
                  onChange={(e) => setTaxiDate(e.target.value)}
                  className="input font-medium"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="label text-slate-700 dark:text-slate-300">{isVi ? 'Giờ bay hạ cánh' : 'Flight Time'}</label>
                <select
                  value={taxiTime}
                  onChange={(e) => setTaxiTime(e.target.value)}
                  className="input font-semibold"
                >
                  {['06:00', '07:30', '08:30', '10:00', '12:00', '14:30', '16:00', '18:00', '20:30', '22:00', '23:30'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-12 mt-2">
                <button
                  type="submit"
                  className="w-full btn-yellow py-3.5 text-base font-black shadow-md flex items-center justify-center gap-2"
                >
                  <Search className="h-5 w-5" />
                  <span>{isVi ? 'Tìm Taxi Sân Bay (Giá Trọn Gói Cố Định)' : (isKm ? 'ស្វែងរកតាក់ស៊ីព្រលាន' : 'Search Airport Taxis & Transfers')}</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* Integrated Research & Booking Modal */}
      <NewServicesModal
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false)
          setModalService(null)
        }}
        initialService={modalService}
        initialMode="EXPLORE"
      />
    </div>
  )
}

