import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  Search,
  Star,
  ShieldCheck,
  Check,
  Sparkles,
  Wifi,
  Coffee,
  Waves,
  Car,
  Utensils,
  Filter,
  ArrowUpDown,
  X,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
  Hotel
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'

const LUXURY_HOTELS = [
  {
    id: 'hotel-pq-vinpearl',
    name: 'Vinpearl Resort & Spa Phú Quốc',
    nameEn: 'Vinpearl Resort & Spa Phu Quoc',
    nameKm: 'រីសត & ស្ប៉ា Vinpearl កោះត្រល់',
    location: 'Bãi Dài, Gành Dầu, Phú Quốc, Kiên Giang',
    city: 'Phú Quốc',
    country: 'Vietnam',
    rating: 4.9,
    reviews: 2450,
    scoreText: 'Xuất sắc',
    stars: 5,
    pricePerNight: 2850000,
    originalPrice: 3800000,
    discount: 'Giảm 25%',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    tags: ['Sát biển Bãi Dài', 'Bể bơi vô cực 5.000m²', 'Buffet sáng hải sản', 'Xe đưa đón sân bay'],
    amenities: ['wifi', 'pool', 'breakfast', 'transfer', 'spa', 'dining'],
    propertyType: 'RESORT',
    roomTypes: [
      { name: 'Deluxe King Hướng Biển', size: '42m²', bed: '1 Giường đôi cực lớn', price: 2850000 },
      { name: 'Executive Suite Ban Công Riêng', size: '68m²', bed: '1 Giường King + Sofa bed', price: 4200000 },
      { name: 'Villa 3 Phòng Ngủ Hồ Bơi Riêng', size: '190m²', bed: '3 Giường King', price: 8900000 }
    ],
    description: 'Nằm tại Bãi Dài nguyên sơ, resort 5 sao sở hữu bãi biển riêng thơ mộng, tổ hợp ẩm thực Á-Âu thượng hạng cùng dịch vụ chăm sóc sức khỏe Akoya Spa đẳng cấp.'
  },
  {
    id: 'hotel-dad-intercon',
    name: 'InterContinental Danang Sun Peninsula Resort',
    nameEn: 'InterContinental Danang Sun Peninsula Resort',
    nameKm: 'រីសត InterContinental ដាណាំង',
    location: 'Bán đảo Sơn Trà, Đà Nẵng',
    city: 'Đà Nẵng',
    country: 'Vietnam',
    rating: 5.0,
    reviews: 1890,
    scoreText: 'Tuyệt tác 5 sao',
    stars: 5,
    pricePerNight: 8500000,
    originalPrice: 10500000,
    discount: 'Đặc quyền VIP',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
    tags: ['Kiến trúc Bill Bensley', 'Bãi biển riêng tư', 'Nhà hàng Michelin 1888', 'Cáp treo Nam Tram'],
    amenities: ['wifi', 'pool', 'breakfast', 'transfer', 'spa', 'dining'],
    propertyType: 'RESORT',
    roomTypes: [
      { name: 'Resort Classic Oceanview King', size: '70m²', bed: '1 Giường King sang trọng', price: 8500000 },
      { name: 'Son Tra Terrace Suite', size: '84m²', bed: '1 Giường King + Bồn tắm view biển', price: 12500000 },
      { name: 'Heavenly Penthouse Pool Villa', size: '240m²', bed: '2 Phòng ngủ + Quản gia riêng', price: 25000000 }
    ],
    description: 'Kiệt tác nghỉ dưỡng ẩn mình giữa rừng nguyên sinh bán đảo Sơn Trà và biển Đông xanh ngọc, liên tiếp được vinh danh là Khu nghỉ dưỡng sang trọng bậc nhất thế giới.'
  },
  {
    id: 'hotel-rep-sofitel',
    name: 'Sofitel Angkor Phokeethra Golf & Spa Resort',
    nameEn: 'Sofitel Angkor Phokeethra Golf & Spa Resort',
    nameKm: 'រីសត Sofitel Angkor សៀមរាប',
    location: 'Vithei Charles de Gaulle, Siem Reap',
    city: 'Siem Reap',
    country: 'Cambodia',
    rating: 4.9,
    reviews: 1620,
    scoreText: 'Rất ấn tượng',
    stars: 5,
    pricePerNight: 3950000,
    originalPrice: 5200000,
    discount: 'Giảm 24%',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    tags: ['Gần đền Angkor Wat', 'Sân Golf 18 lỗ', 'Hồ bơi kiểu Pháp', 'Ẩm thực hoàng gia Khmer'],
    amenities: ['wifi', 'pool', 'breakfast', 'transfer', 'spa', 'dining'],
    propertyType: 'HOTEL',
    roomTypes: [
      { name: 'Superior Room Garden View', size: '36m²', bed: '1 Giường King hoặc 2 Twin', price: 3950000 },
      { name: 'Luxury Room Pool Access', size: '45m²', bed: '1 Giường King bước thẳng ra hồ bơi', price: 5400000 },
      { name: 'Prestige Suite Colonial Style', size: '90m²', bed: '1 Master Bedroom + Phòng khách riêng', price: 9200000 }
    ],
    description: 'Không gian thuộc địa Pháp quý phái kết hợp hài hòa với nét chạm khắc Khmer huyền bí, chỉ cách quần thể di sản thế giới Angkor Wat 10 phút di chuyển.'
  },
  {
    id: 'hotel-han-capella',
    name: 'Capella Hanoi - Boutique Luxury Hotel',
    nameEn: 'Capella Hanoi - Boutique Luxury Hotel',
    nameKm: 'សណ្ឋាគារប្រណិត Capella ហាណូយ',
    location: '11 Lê Phụng Hiểu, Hoàn Kiếm, Hà Nội',
    city: 'Hà Nội',
    country: 'Vietnam',
    rating: 4.9,
    reviews: 930,
    scoreText: 'Đẳng cấp 5 sao',
    stars: 5,
    pricePerNight: 6900000,
    originalPrice: 8200000,
    discount: 'Ưu đãi Thủ Đô',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80',
    tags: ['Gần Hồ Hoàn Kiếm & Nhà Hát Lớn', 'Nhà hàng 1 sao Michelin Hibana', 'Bể bơi nước nóng La Grotta'],
    amenities: ['wifi', 'pool', 'breakfast', 'spa', 'dining'],
    propertyType: 'BOUTIQUE',
    roomTypes: [
      { name: 'Premier Room Vintage Opera', size: '48m²', bed: '1 King Bed sang trọng', price: 6900000 },
      { name: 'Capella Suite Ban Công Phố Cổ', size: '75m²', bed: '1 King Bed + Bar cocktail riêng', price: 10800000 }
    ],
    description: 'Khách sạn phong cách nghệ thuật kịch nghệ Opera những năm 1920 được thiết kế bởi KTS huyền thoại Bill Bensley, liền kề Hồ Gươm cổ kính.'
  },
  {
    id: 'hotel-pnh-sokha',
    name: 'Sokha Phnom Penh Hotel & Residence',
    nameEn: 'Sokha Phnom Penh Hotel & Residence',
    nameKm: 'សណ្ឋាគារសុខា ភ្នំពេញ',
    location: 'Street Keo Chenda, Sangkat Chroy Changvar, Phnom Penh',
    city: 'Phnom Penh',
    country: 'Cambodia',
    rating: 4.8,
    reviews: 1340,
    scoreText: 'Tuyệt vời',
    stars: 5,
    pricePerNight: 2450000,
    originalPrice: 3100000,
    discount: 'Tiết kiệm 21%',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80',
    tags: ['View ngã 4 sông Mekong', 'Hồ bơi chân mây', 'Sky Bar ngắm hoàng hôn'],
    amenities: ['wifi', 'pool', 'breakfast', 'transfer', 'spa', 'dining'],
    propertyType: 'HOTEL',
    roomTypes: [
      { name: 'Deluxe River View King', size: '52m²', bed: '1 Giường King cực lớn', price: 2450000 },
      { name: 'Club Executive Mekong Suite', size: '85m²', bed: '1 Giường King + Quyền lợi Club Lounge', price: 4100000 }
    ],
    description: 'Khách sạn biểu tượng tại bán đảo Chroy Changvar với tầm nhìn bao quát toàn cảnh hợp lưu của 4 nhánh sông Mekong và Hoàng Cung Campuchia tráng lệ.'
  },
  {
    id: 'hotel-bkk-marina',
    name: 'The Peninsula Bangkok Luxury Riverfront',
    nameEn: 'The Peninsula Bangkok Luxury Riverfront',
    nameKm: 'សណ្ឋាគារ The Peninsula បាងកក',
    location: '333 Charoen Nakhon Rd, Khlong San, Bangkok',
    city: 'Bangkok',
    country: 'Thailand',
    rating: 4.9,
    reviews: 3120,
    scoreText: 'Xuất sắc',
    stars: 5,
    pricePerNight: 5800000,
    originalPrice: 7500000,
    discount: 'Giảm 23%',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80',
    tags: ['Ven sông Chao Phraya', 'Thuyền đưa đón riêng miễn phí', 'Hồ bơi 3 tầng view sông'],
    amenities: ['wifi', 'pool', 'breakfast', 'transfer', 'spa', 'dining'],
    propertyType: 'HOTEL',
    roomTypes: [
      { name: 'Deluxe River View Room', size: '47m²', bed: '1 Giường King sang trọng', price: 5800000 },
      { name: 'Grand Balcony River Suite', size: '88m²', bed: '1 King Bed + Ban công ngắm thuyền', price: 9600000 }
    ],
    description: 'Biểu tượng nghỉ dưỡng quý tộc ven dòng sông Chao Phraya huyền thoại, nổi tiếng với dịch vụ quản gia hoàn hảo và du thuyền đưa đón riêng.'
  }
]

export default function StaysPage() {
  const { formatPrice } = useCurrency()
  const { language } = useLanguage()

  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  // Search parameters
  const [destination, setDestination] = useState('')
  const [checkInDate, setCheckInDate] = useState('2026-10-15')
  const [checkOutDate, setCheckOutDate] = useState('2026-10-18')
  const [guestCount, setGuestCount] = useState('2 người lớn, 1 phòng')

  // Sidebar Filters
  const [selectedCities, setSelectedCities] = useState([])
  const [selectedStars, setSelectedStars] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [priceBucket, setPriceBucket] = useState('ALL')
  const [sortBy, setSortBy] = useState('PRICE_ASC')

  // Booking Modal
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(null)

  const resetFilters = () => {
    setSelectedCities([])
    setSelectedStars([])
    setSelectedTypes([])
    setSelectedAmenities([])
    setPriceBucket('ALL')
    setSortBy('PRICE_ASC')
    setDestination('')
  }

  const filteredHotels = useMemo(() => {
    return LUXURY_HOTELS.filter((hotel) => {
      if (destination.trim()) {
        const q = destination.toLowerCase().trim()
        const matchName = hotel.name.toLowerCase().includes(q) || hotel.nameEn.toLowerCase().includes(q)
        const matchCity = hotel.city.toLowerCase().includes(q)
        const matchCountry = hotel.country.toLowerCase().includes(q)
        if (!matchName && !matchCity && !matchCountry) return false
      }
      if (selectedCities.length > 0 && !selectedCities.includes(hotel.city)) {
        return false
      }
      if (selectedStars.length > 0 && !selectedStars.includes(hotel.stars)) {
        return false
      }
      if (selectedTypes.length > 0 && !selectedTypes.includes(hotel.propertyType)) {
        return false
      }
      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every((amen) => hotel.amenities.includes(amen))
        if (!hasAll) return false
      }
      if (priceBucket === 'UNDER_3M' && hotel.pricePerNight >= 3000000) return false
      if (priceBucket === '3M_TO_6M' && (hotel.pricePerNight < 3000000 || hotel.pricePerNight > 6000000)) return false
      if (priceBucket === 'OVER_6M' && hotel.pricePerNight <= 6000000) return false

      return true
    }).sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.pricePerNight - b.pricePerNight
      if (sortBy === 'PRICE_DESC') return b.pricePerNight - a.pricePerNight
      if (sortBy === 'RATING') return b.rating - a.rating
      return b.reviews - a.reviews
    })
  }, [destination, selectedCities, selectedStars, selectedTypes, selectedAmenities, priceBucket, sortBy])

  const handleOpenBooking = (hotel, room = null) => {
    setSelectedHotel(hotel)
    setSelectedRoom(room || hotel.roomTypes[0])
    setBookingSuccess(null)
  }

  const handleConfirmBooking = (e) => {
    e.preventDefault()
    if (!guestName || !guestPhone) {
      alert(isVi ? 'Vui lòng điền đầy đủ họ tên và số điện thoại!' : 'Please fill in guest name and phone number!')
      return
    }
    const refCode = 'STAY-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setBookingSuccess({
      refCode,
      hotelName: selectedHotel.name,
      roomName: selectedRoom.name,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice: selectedRoom.price * 3,
      guestName,
      guestPhone
    })
  }

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-navy-950 pb-16">
      {/* 1. TOP ROYAL BLUE SEARCH HERO BANNER */}
      <section className="relative bg-[#003580] pt-6 pb-10 px-4 sm:px-6 lg:px-8 text-white shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-sky-200 backdrop-blur-md">
            <Building2 className="h-3.5 w-3.5 text-amber-300" />
            <span>AeroSmart Stays · Khách Sạn & Resort Nghỉ Dưỡng 5 Sao</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white">
            {isVi ? 'Tìm & Đặt Chỗ Nghỉ Nghỉ Dưỡng Sang Trọng' : 'Find Your Dream Hotel & Luxury Resort'}
          </h1>

          <div className="rounded-2xl border border-white/20 bg-white p-3 sm:p-4 shadow-2xl dark:bg-navy-900 text-slate-800 dark:text-white">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 items-end">
              {/* Destination */}
              <div className="lg:col-span-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {isVi ? 'Điểm đến / Tên khách sạn' : 'Destination / Hotel'}
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={isVi ? 'Phú Quốc, Đà Nẵng, Siem Reap...' : 'City, hotel or beach...'}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Check-in Date */}
              <div className="lg:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {isVi ? 'Nhận phòng' : 'Check-in'}
                </label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-2 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Check-out Date */}
              <div className="lg:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {isVi ? 'Trả phòng' : 'Check-out'}
                </label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-2 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="lg:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {isVi ? 'Số khách' : 'Guests'}
                </label>
                <div className="relative flex items-center">
                  <Users className="absolute left-3 h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-2 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                  >
                    <option value="1 người lớn, 1 phòng">1 {isVi ? 'người' : 'pax'}, 1 {isVi ? 'phòng' : 'room'}</option>
                    <option value="2 người lớn, 1 phòng">2 {isVi ? 'người' : 'pax'}, 1 {isVi ? 'phòng' : 'room'}</option>
                    <option value="2 người lớn + 1 trẻ em, 1 phòng">2 {isVi ? 'lớn' : 'adults'} + 1 {isVi ? 'trẻ' : 'child'}</option>
                    <option value="4 người lớn, 2 phòng">4 {isVi ? 'người' : 'pax'}, 2 {isVi ? 'phòng' : 'rooms'}</option>
                  </select>
                </div>
              </div>

              {/* SEARCH BUTTON */}
              <div className="lg:col-span-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('stays-results-section')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full h-[42px] flex items-center justify-center gap-2 rounded-xl bg-[#006ce4] hover:bg-[#0057b8] active:scale-95 text-white font-black text-sm shadow-md transition-all dark:bg-sky-500 dark:text-navy-950 dark:hover:bg-sky-400"
                >
                  <Search className="h-4 w-4 stroke-[2.5]" />
                  <span>{isVi ? 'Tìm Kiếm' : 'Search'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN 12-COLUMN LAYOUT (SIDEBAR FILTERS + RESULTS FEED) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT FILTERS SIDEBAR (3 Cols) */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-navy-800 dark:bg-navy-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-[#003580] dark:text-sky-400" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {isVi ? 'Bộ lọc Chỗ nghỉ' : 'Filters'}
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

              {/* Filter 1: Destinations */}
              <div className="py-4 border-b border-slate-100 dark:border-navy-800 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  {isVi ? 'Điểm đến phổ biến' : 'Destinations'}
                </h4>
                {['Phú Quốc', 'Đà Nẵng', 'Siem Reap', 'Hà Nội', 'Phnom Penh', 'Bangkok'].map((c) => {
                  const count = LUXURY_HOTELS.filter((h) => h.city === c).length
                  const isChecked = selectedCities.includes(c)
                  return (
                    <label key={c} className="flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 cursor-pointer group">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedCities([...selectedCities, c])
                            else setSelectedCities(selectedCities.filter((city) => city !== c))
                          }}
                          className="rounded text-[#006ce4] focus:ring-[#006ce4]"
                        />
                        <span className="font-medium group-hover:text-[#003580] dark:group-hover:text-sky-400 transition-colors">{c}</span>
                      </div>
                      <span className="text-slate-400 text-xs font-semibold">{count}</span>
                    </label>
                  )
                })}
              </div>

              {/* Filter 2: Price Bucket */}
              <div className="py-4 border-b border-slate-100 dark:border-navy-800 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  {isVi ? 'Mức giá mỗi đêm' : 'Price per night'}
                </h4>
                {[
                  { id: 'ALL', label: isVi ? 'Tất cả mức giá' : 'All Prices' },
                  { id: 'UNDER_3M', label: isVi ? 'Dưới 3.000.000đ' : 'Under 3,000,000đ' },
                  { id: '3M_TO_6M', label: isVi ? '3.000.000đ - 6.000.000đ' : '3M - 6M VND' },
                  { id: 'OVER_6M', label: isVi ? 'Trên 6.000.000đ (VIP)' : 'Over 6,000,000đ' }
                ].map((p) => (
                  <label key={p.id} className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="priceBucketFilter"
                      checked={priceBucket === p.id}
                      onChange={() => setPriceBucket(p.id)}
                      className="text-[#006ce4] focus:ring-[#006ce4]"
                    />
                    <span className="font-medium">{p.label}</span>
                  </label>
                ))}
              </div>

              {/* Filter 3: Property Types */}
              <div className="py-4 border-b border-slate-100 dark:border-navy-800 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  {isVi ? 'Loại hình lưu trú' : 'Property Type'}
                </h4>
                {[
                  { id: 'RESORT', label: isVi ? 'Resort ven biển' : 'Beach Resort' },
                  { id: 'HOTEL', label: isVi ? 'Khách sạn 5 sao' : '5-Star Hotel' },
                  { id: 'BOUTIQUE', label: isVi ? 'Boutique Luxury' : 'Boutique Luxury' }
                ].map((type) => {
                  const count = LUXURY_HOTELS.filter((h) => h.propertyType === type.id).length
                  const isChecked = selectedTypes.includes(type.id)
                  return (
                    <label key={type.id} className="flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 cursor-pointer group">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedTypes([...selectedTypes, type.id])
                            else setSelectedTypes(selectedTypes.filter((t) => t !== type.id))
                          }}
                          className="rounded text-[#006ce4] focus:ring-[#006ce4]"
                        />
                        <span className="font-medium">{type.label}</span>
                      </div>
                      <span className="text-slate-400 text-xs font-semibold">{count}</span>
                    </label>
                  )
                })}
              </div>

              {/* Filter 4: Amenities */}
              <div className="pt-4 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  {isVi ? 'Tiện nghi đặc quyền' : 'Popular Amenities'}
                </h4>
                {[
                  { id: 'pool', label: isVi ? 'Bể bơi vô cực' : 'Infinity Pool' },
                  { id: 'breakfast', label: isVi ? 'Buffet sáng miễn phí' : 'Free Breakfast' },
                  { id: 'transfer', label: isVi ? 'Xe đón tiễn sân bay' : 'Airport Shuttle' },
                  { id: 'spa', label: isVi ? 'Spa & Chăm sóc sức khỏe' : 'Spa & Wellness' }
                ].map((amen) => {
                  const isChecked = selectedAmenities.includes(amen.id)
                  return (
                    <label key={amen.id} className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedAmenities([...selectedAmenities, amen.id])
                          else setSelectedAmenities(selectedAmenities.filter((a) => a !== amen.id))
                        }}
                        className="rounded text-[#006ce4] focus:ring-[#006ce4]"
                      />
                      <span className="font-medium">{amen.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* RIGHT RESULTS SECTION (9 Cols) */}
          <section id="stays-results-section" className="lg:col-span-9 space-y-4">
            {/* Results Header with Sorting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm dark:border-navy-800 dark:bg-navy-900">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {isVi ? `Tìm thấy ${filteredHotels.length} chỗ nghỉ & khách sạn phù hợp` : `Found ${filteredHotels.length} luxury stays`}
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
                  <option value="PRICE_ASC">{isVi ? 'Giá thấp nhất' : 'Price: Low to High'}</option>
                  <option value="PRICE_DESC">{isVi ? 'Giá cao nhất' : 'Price: High to Low'}</option>
                  <option value="RATING">{isVi ? 'Điểm đánh giá cao nhất' : 'Highest Rated'}</option>
                </select>
              </div>
            </div>

            {/* Hotel Cards Feed */}
            {filteredHotels.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-navy-800 dark:bg-navy-900">
                <Building2 className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isVi ? 'Không tìm thấy chỗ nghỉ phù hợp bộ lọc' : 'No properties match your filters'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  {isVi ? 'Hãy thử xóa bớt bộ lọc hoặc chọn mức giá khác.' : 'Try adjusting your filters.'}
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-xl bg-[#003580] px-4 py-2 text-xs font-bold text-white dark:bg-sky-500 dark:text-navy-950"
                >
                  {isVi ? 'Xem tất cả chỗ nghỉ' : 'Reset Filters'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHotels.map((hotel) => {
                  const displayName = isVi ? hotel.name : (isKm ? hotel.nameKm : hotel.nameEn)
                  return (
                    <div
                      key={hotel.id}
                      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 dark:border-navy-800 dark:bg-navy-900"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                        {/* Photo */}
                        <div className="relative md:col-span-4 h-56 md:h-auto overflow-hidden bg-slate-100 dark:bg-navy-800">
                          <img
                            src={hotel.image}
                            alt={displayName}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                            <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-black text-navy-950 shadow-md uppercase">
                              {hotel.discount}
                            </span>
                            <span className="rounded-full bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-slate-800 shadow-md">
                              {'★'.repeat(hotel.stars)} 5 SAO
                            </span>
                          </div>
                        </div>

                        {/* Middle Details */}
                        <div className="md:col-span-5 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 dark:border-navy-800">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-xs text-[#003580] dark:text-sky-400 font-bold">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{hotel.city}, {hotel.country}</span>
                            </div>
                            <h3 className="text-base font-black text-slate-900 group-hover:text-[#003580] dark:text-white dark:group-hover:text-sky-400 transition-colors">
                              {displayName}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                              {hotel.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {hotel.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                >
                                  <Check className="h-3 w-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 text-xs text-slate-500 dark:text-slate-400">
                            <span>{isVi ? 'Phòng tiêu chuẩn:' : 'Room:'} </span>
                            <strong className="text-slate-800 dark:text-slate-200">{hotel.roomTypes[0].name}</strong>
                          </div>
                        </div>

                        {/* Right Pricing & CTA */}
                        <div className="md:col-span-3 p-5 flex flex-col justify-between bg-slate-50/50 dark:bg-navy-900/50">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs font-bold text-slate-900 dark:text-white">{hotel.scoreText}</div>
                                <div className="text-[10px] text-slate-500">{hotel.reviews} {isVi ? 'đánh giá' : 'reviews'}</div>
                              </div>
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#003580] text-xs font-black text-white shadow-sm dark:bg-sky-500 dark:text-navy-950">
                                {hotel.rating}
                              </div>
                            </div>

                            <div className="pt-2 text-right">
                              <span className="text-[11px] text-slate-400 line-through">
                                {formatPrice(hotel.originalPrice)}
                              </span>
                              <div className="text-xl font-black text-[#003580] dark:text-sky-400">
                                {formatPrice(hotel.pricePerNight)}
                              </div>
                              <span className="text-[10px] text-slate-500">/ 1 đêm</span>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <Link
                              to={`/stays/${hotel.id}`}
                              className="w-full flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#003580] bg-white py-2 text-xs font-bold text-[#003580] hover:bg-sky-50 dark:border-sky-400 dark:bg-navy-900 dark:text-sky-300 dark:hover:bg-navy-800 transition-all"
                            >
                              <span>{isVi ? 'Xem Chi Tiết Khách Sạn' : 'View Details'}</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleOpenBooking(hotel)}
                              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#003580] py-2 text-xs font-bold text-white shadow-md hover:bg-[#002660] dark:bg-sky-500 dark:text-navy-950 dark:hover:bg-sky-400 active:scale-95 transition-all"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                              <span>{isVi ? 'Đặt Phòng Nhanh' : 'Quick Book'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* 3. BOOKING MODAL */}
      {selectedHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-navy-800 dark:bg-navy-900 dark:text-white max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedHotel(null)}
              className="absolute top-4 right-4 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>

            {!bookingSuccess ? (
              <form onSubmit={handleConfirmBooking} className="space-y-5">
                <div className="border-b border-slate-100 dark:border-navy-800 pb-4">
                  <div className="text-xs font-bold text-[#003580] dark:text-sky-400 uppercase tracking-wider">
                    {selectedHotel.city} · 5 SAO
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {selectedHotel.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedHotel.location}
                  </p>
                </div>

                {/* Select Room Type */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isVi ? 'Chọn Hạng Phòng Nghỉ Dưỡng:' : 'Select Room Type:'}
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedHotel.roomTypes.map((room, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedRoom(room)}
                        className={`cursor-pointer rounded-2xl border p-3.5 transition-all flex items-center justify-between ${
                          selectedRoom?.name === room.name
                            ? 'border-[#003580] bg-sky-50/60 shadow-sm dark:border-sky-400 dark:bg-sky-950/40'
                            : 'border-slate-200 hover:border-slate-300 dark:border-navy-800'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 dark:text-white">{room.name}</span>
                            <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-navy-700 dark:text-slate-300">
                              {room.size}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{room.bed}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-[#003580] dark:text-sky-400">
                            {formatPrice(room.price)}
                          </div>
                          <span className="text-[10px] text-slate-400">/ đêm</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-navy-800/60 border border-slate-200/80 dark:border-navy-700 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Nhận phòng:</span>
                    <p className="font-bold text-slate-900 dark:text-white">{checkInDate} (14:00)</p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Trả phòng:</span>
                    <p className="font-bold text-slate-900 dark:text-white">{checkOutDate} (12:00)</p>
                  </div>
                </div>

                {/* Guest Contact Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isVi ? 'Thông tin người đại diện đặt phòng:' : 'Guest Information:'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {isVi ? 'Họ và tên *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="NGUYEN VAN A"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {isVi ? 'Số điện thoại *' : 'Phone Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="0912 345 678"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#003580] focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Total & Submit */}
                <div className="border-t border-slate-100 dark:border-navy-800 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Tổng thanh toán dự kiến (3 đêm):</span>
                    <div className="text-2xl font-black text-[#003580] dark:text-sky-400">
                      {formatPrice((selectedRoom?.price || 0) * 3)}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isVi ? 'Xác Nhận Giữ Phòng' : 'Confirm Reservation'}</span>
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
                    {isVi ? 'Đặt Phòng Thành Công!' : 'Booking Confirmed!'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Mã xác nhận phòng: <strong className="text-[#003580] dark:text-sky-400 text-sm font-black">{bookingSuccess.refCode}</strong>
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-navy-800 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Khách sạn:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{bookingSuccess.hotelName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hạng phòng:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{bookingSuccess.roomName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thời gian:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{bookingSuccess.checkIn} → {bookingSuccess.checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Khách hàng:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{bookingSuccess.guestName} ({bookingSuccess.guestPhone})</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-navy-700 pt-2 text-sm">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Tổng thanh toán:</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">{formatPrice(bookingSuccess.totalPrice)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedHotel(null)}
                  className="rounded-xl bg-[#003580] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#002660] transition-all dark:bg-sky-500 dark:text-navy-950"
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
