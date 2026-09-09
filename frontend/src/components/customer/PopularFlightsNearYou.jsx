import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plane, MapPin } from 'lucide-react'
import { destinationsApi } from '../../api/client'
import { useBooking } from '../../context/BookingContext'
import { useCurrency } from '../../context/CurrencyContext'
import { useLanguage } from '../../context/LanguageContext'
import { todayInputValue } from '../../utils/format'

export default function PopularFlightsNearYou() {
  const [activeTab, setActiveTab] = useState('INTERNATIONAL') // 'INTERNATIONAL' | 'DOMESTIC'
  const [selectedOrigin, setSelectedOrigin] = useState('ALL')
  const [serverDeals, setServerDeals] = useState(null)
  const scrollRef = useRef(null)
  const navigate = useNavigate()
  const { updateSearchCriteria } = useBooking()
  const { formatPrice } = useCurrency()
  const { t, language } = useLanguage()

  useEffect(() => {
    destinationsApi
      .listDeals()
      .then((data) => {
        if (data && data.length > 0) {
          setServerDeals(data)
        }
      })
      .catch(() => {})
  }, [])

  const ORIGIN_HUBS = [
    { code: 'ALL', nameEn: 'All departure points', nameVi: 'Tất cả điểm đi', nameKm: 'គ្រប់ចំណុចចេញដំណើរ' },
    { code: 'HAN', nameEn: 'Hanoi (HAN)', nameVi: 'Hà Nội (HAN)', nameKm: 'ហាណូយ (HAN)' },
    { code: 'SGN', nameEn: 'Ho Chi Minh (SGN)', nameVi: 'TP. Hồ Chí Minh (SGN)', nameKm: 'ទីក្រុងហូជីមិញ (SGN)' },
    { code: 'DAD', nameEn: 'Da Nang (DAD)', nameVi: 'Đà Nẵng (DAD)', nameKm: 'ដាណាំង (DAD)' },
    { code: 'PNH', nameEn: 'Phnom Penh (PNH)', nameVi: 'Phnom Penh (PNH)', nameKm: 'ភ្នំពេញ (PNH)' },
    { code: 'SAI', nameEn: 'Siem Reap (SAI)', nameVi: 'Siem Reap (SAI)', nameKm: 'សៀមរាប (SAI)' },
    { code: 'BKK', nameEn: 'Bangkok (BKK)', nameVi: 'Bangkok (BKK)', nameKm: 'បាងកក (BKK)' },
    { code: 'SIN', nameEn: 'Singapore (SIN)', nameVi: 'Singapore (SIN)', nameKm: 'សិង្ហបុរី (SIN)' },
  ]

  const FLIGHT_DEALS = {
    INTERNATIONAL: [
      {
        id: 'sai-deal',
        origin: 'HAN',
        destination: 'SAI',
        destCityEn: 'Siem Reap (Angkor)',
        destCityVi: 'Siem Reap (Angkor)',
        destCityKm: 'សៀមរាប (អង្គរ)',
        countryEn: 'Cambodia',
        countryVi: 'Campuchia',
        countryKm: 'កម្ពុជា',
        originCityEn: 'Hanoi',
        originCityVi: 'Hà Nội',
        originCityKm: 'ហាណូយ',
        datesEn: 'Sep 13 - Sep 16 · Round-trip',
        datesVi: '13 Th9 - 16 Th9 · Khứ hồi',
        datesKm: '13 កញ្ញា - 16 កញ្ញា · ទៅមក',
        price: 2450000,
        image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=700&q=80',
      },
      {
        id: 'pnh-deal',
        origin: 'SGN',
        destination: 'PNH',
        destCityEn: 'Phnom Penh',
        destCityVi: 'Phnom Penh',
        destCityKm: 'ភ្នំពេញ',
        countryEn: 'Cambodia',
        countryVi: 'Campuchia',
        countryKm: 'កម្ពុជា',
        originCityEn: 'Ho Chi Minh City',
        originCityVi: 'TP. Hồ Chí Minh',
        originCityKm: 'ទីក្រុងហូជីមិញ',
        datesEn: 'Sep 12 - Sep 15 · Round-trip',
        datesVi: '12 Th9 - 15 Th9 · Khứ hồi',
        datesKm: '12 កញ្ញា - 15 កញ្ញា · ទៅមក',
        price: 1750000,
        image: 'https://images.unsplash.com/photo-1583252927237-772b16644fcf?auto=format&fit=crop&w=700&q=80',
      },
      {
        id: 'bkk-deal',
        origin: 'HAN',
        destination: 'BKK',
        destCityEn: 'Bangkok',
        destCityVi: 'Bangkok',
        destCityKm: 'បាងកក',
        countryEn: 'Thailand',
        countryVi: 'Thái Lan',
        countryKm: 'ថៃ',
        originCityEn: 'Hanoi',
        originCityVi: 'Hà Nội',
        originCityKm: 'ហាណូយ',
        datesEn: 'Sep 11 - Sep 13 · Round-trip',
        datesVi: '11 Th9 - 13 Th9 · Khứ hồi',
        datesKm: '11 កញ្ញា - 13 កញ្ញា · ទៅមក',
        price: 1890000,
        image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=700&q=80',
      },
      {
        id: 'sin-deal',
        origin: 'SGN',
        destination: 'SIN',
        destCityEn: 'Singapore',
        destCityVi: 'Singapore',
        destCityKm: 'សិង្ហបុរី',
        countryEn: 'Singapore',
        countryVi: 'Singapore',
        countryKm: 'សិង្ហបុរី',
        originCityEn: 'Ho Chi Minh City',
        originCityVi: 'TP. Hồ Chí Minh',
        originCityKm: 'ទីក្រុងហូជីមិញ',
        datesEn: 'Sep 15 - Sep 18 · Round-trip',
        datesVi: '15 Th9 - 18 Th9 · Khứ hồi',
        datesKm: '15 កញ្ញា - 18 កញ្ញា · ទៅមក',
        price: 2190000,
        image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=700&q=80',
      },
      {
        id: 'nrt-deal',
        origin: 'HAN',
        destination: 'NRT',
        destCityEn: 'Tokyo (Narita)',
        destCityVi: 'Tokyo (Narita)',
        destCityKm: 'តូក្យូ (ណារីតា)',
        countryEn: 'Japan',
        countryVi: 'Nhật Bản',
        countryKm: 'ជប៉ុន',
        originCityEn: 'Hanoi',
        originCityVi: 'Hà Nội',
        originCityKm: 'ហាណូយ',
        datesEn: 'Sep 9 - Sep 11 · Round-trip',
        datesVi: '09 Th9 - 11 Th9 · Khứ hồi',
        datesKm: '09 កញ្ញា - 11 កញ្ញា · ទៅមក',
        price: 4890000,
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=700&q=80',
      },
      {
        id: 'icn-deal',
        origin: 'DAD',
        destination: 'ICN',
        destCityEn: 'Seoul (Incheon)',
        destCityVi: 'Seoul (Incheon)',
        destCityKm: 'សេអ៊ូល (អ៊ិនឈុន)',
        countryEn: 'South Korea',
        countryVi: 'Hàn Quốc',
        countryKm: 'កូរ៉េខាងត្បូង',
        originCityEn: 'Da Nang',
        originCityVi: 'Đà Nẵng',
        originCityKm: 'ដាណាំង',
        datesEn: 'Sep 16 - Sep 20 · Round-trip',
        datesVi: '16 Th9 - 20 Th9 · Khứ hồi',
        datesKm: '16 កញ្ញា - 20 កញ្ញា · ទៅមក',
        price: 3250000,
        image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=700&q=80',
      },
      {
        id: 'cdg-deal',
        origin: 'HAN',
        destination: 'CDG',
        destCityEn: 'Paris',
        destCityVi: 'Paris',
        destCityKm: 'ប៉ារីស',
        countryEn: 'France',
        countryVi: 'Pháp',
        countryKm: 'បារាំង',
        originCityEn: 'Hanoi',
        originCityVi: 'Hà Nội',
        originCityKm: 'ហាណូយ',
        datesEn: 'Sep 20 - Sep 28 · Round-trip',
        datesVi: '20 Th9 - 28 Th9 · Khứ hồi',
        datesKm: '20 កញ្ញា - 28 កញ្ញា · ទៅមក',
        price: 14200000,
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=80',
      },
      {
        id: 'lhr-deal',
        origin: 'SGN',
        destination: 'LHR',
        destCityEn: 'London',
        destCityVi: 'London',
        destCityKm: 'ឡុងដ៍',
        countryEn: 'United Kingdom',
        countryVi: 'Vương Quốc Anh',
        countryKm: 'ចក្រភពអង់គ្លេស',
        originCityEn: 'Ho Chi Minh City',
        originCityVi: 'TP. Hồ Chí Minh',
        originCityKm: 'ទីក្រុងហូជីមិញ',
        datesEn: 'Sep 22 - Sep 30 · Round-trip',
        datesVi: '22 Th9 - 30 Th9 · Khứ hồi',
        datesKm: '22 កញ្ញា - 30 កញ្ញា · ទៅមក',
        price: 15600000,
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80',
      },
    ],
    DOMESTIC: [
      {
        id: 'sgn-dest',
        origin: 'HAN',
        destination: 'SGN',
        destCityEn: 'Ho Chi Minh City',
        destCityVi: 'TP. Hồ Chí Minh',
        destCityKm: 'ទីក្រុងហូជីមិញ',
        countryEn: 'Vietnam',
        countryVi: 'Việt Nam',
        countryKm: 'វៀតណាម',
        originCityEn: 'Hanoi',
        originCityVi: 'Hà Nội',
        originCityKm: 'ហាណូយ',
        datesEn: 'Sep 10 - Sep 12 · Round-trip',
        datesVi: '10 Th9 - 12 Th9 · Khứ hồi',
        datesKm: '10 កញ្ញា - 12 កញ្ញា · ទៅមក',
        price: 1290000,
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=700&q=80',
      },
      {
        id: 'dad-dest',
        origin: 'SGN',
        destination: 'DAD',
        destCityEn: 'Da Nang',
        destCityVi: 'Đà Nẵng',
        destCityKm: 'ដាណាំង',
        countryEn: 'Vietnam',
        countryVi: 'Việt Nam',
        countryKm: 'វៀតណាម',
        originCityEn: 'Ho Chi Minh City',
        originCityVi: 'TP. Hồ Chí Minh',
        originCityKm: 'ទីក្រុងហូជីមិញ',
        datesEn: 'Sep 11 - Sep 14 · Round-trip',
        datesVi: '11 Th9 - 14 Th9 · Khứ hồi',
        datesKm: '11 កញ្ញា - 14 កញ្ញា · ទៅមក',
        price: 890000,
        image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=700&q=80',
      },
      {
        id: 'pqc-dest',
        origin: 'SGN',
        destination: 'PQC',
        destCityEn: 'Phu Quoc Island',
        destCityVi: 'Đảo Phú Quốc',
        destCityKm: 'កោះត្រល់ (ភូកុក)',
        countryEn: 'Vietnam',
        countryVi: 'Việt Nam',
        countryKm: 'វៀតណាម',
        originCityEn: 'Ho Chi Minh City',
        originCityVi: 'TP. Hồ Chí Minh',
        originCityKm: 'ទីក្រុងហូជីមិញ',
        datesEn: 'Sep 12 - Sep 15 · Round-trip',
        datesVi: '12 Th9 - 15 Th9 · Khứ hồi',
        datesKm: '12 កញ្ញា - 15 កញ្ញា · ទៅមក',
        price: 990000,
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80',
      },
      {
        id: 'han-dest',
        origin: 'DAD',
        destination: 'HAN',
        destCityEn: 'Hanoi',
        destCityVi: 'Hà Nội',
        destCityKm: 'ហាណូយ',
        countryEn: 'Vietnam',
        countryVi: 'Việt Nam',
        countryKm: 'វៀតណាម',
        originCityEn: 'Da Nang',
        originCityVi: 'Đà Nẵng',
        originCityKm: 'ដាណាំង',
        datesEn: 'Sep 10 - Sep 13 · Round-trip',
        datesVi: '10 Th9 - 13 Th9 · Khứ hồi',
        datesKm: '10 កញ្ញា - 13 កញ្ញា · ទៅមក',
        price: 820000,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=80',
      },
      {
        id: 'dli-dest',
        origin: 'HAN',
        destination: 'DLI',
        destCityEn: 'Da Lat',
        destCityVi: 'Đà Lạt',
        destCityKm: 'ដាឡាត់',
        countryEn: 'Vietnam',
        countryVi: 'Việt Nam',
        countryKm: 'វៀតណាម',
        originCityEn: 'Hanoi',
        originCityVi: 'Hà Nội',
        originCityKm: 'ហាណូយ',
        datesEn: 'Sep 15 - Sep 18 · Round-trip',
        datesVi: '15 Th9 - 18 Th9 · Khứ hồi',
        datesKm: '15 កញ្ញា - 18 កញ្ញា · ទៅមក',
        price: 1120000,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80',
      },
      {
        id: 'cxr-dest',
        origin: 'SGN',
        destination: 'CXR',
        destCityEn: 'Nha Trang',
        destCityVi: 'Nha Trang',
        destCityKm: 'ញ៉ាត្រាង',
        countryEn: 'Vietnam',
        countryVi: 'Việt Nam',
        countryKm: 'វៀតណាម',
        originCityEn: 'Ho Chi Minh City',
        originCityVi: 'TP. Hồ Chí Minh',
        originCityKm: 'ទីក្រុងហូជីមិញ',
        datesEn: 'Sep 14 - Sep 17 · Round-trip',
        datesVi: '14 Th9 - 17 Th9 · Khứ hồi',
        datesKm: '14 កញ្ញា - 17 កញ្ញា · ទៅមក',
        price: 790000,
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=700&q=80',
      },
    ],
  }

  const allCategoryDeals = serverDeals && serverDeals.length > 0
    ? serverDeals.filter((d) => d.category === activeTab && d.active)
    : FLIGHT_DEALS[activeTab] || []

  const items =
    selectedOrigin === 'ALL'
      ? allCategoryDeals
      : allCategoryDeals.filter((d) => d.origin === selectedOrigin)

  const displayItems = items.length > 0 ? items : allCategoryDeals

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleSelectDeal = (deal) => {
    updateSearchCriteria({
      origin: deal.origin,
      destination: deal.destination,
      departureDate: todayInputValue(),
      passengers: 1,
      tripType: 'ROUND_TRIP',
    })
    navigate(
      `/flights?origin=${deal.origin}&destination=${deal.destination}&departureDate=${todayInputValue()}&passengers=1`
    )
  }

  const getDestinationName = (item) => {
    if (language === 'vi') return item.destCityVi || item.titleVi || item.titleEn
    if (language === 'km') return item.destCityKm || item.titleKm || item.titleEn
    return item.destCityEn || item.titleEn
  }

  const getCountryName = (item) => {
    if (language === 'vi') return item.countryVi || ''
    if (language === 'km') return item.countryKm || ''
    return item.countryEn || ''
  }

  const getOriginCityName = (item) => {
    if (language === 'vi') return item.originCityVi || item.origin
    if (language === 'km') return item.originCityKm || item.origin
    return item.originCityEn || item.origin
  }

  const getItemDates = (item) => {
    if (language === 'vi') return item.datesVi || item.datesEn || 'Khứ hồi'
    if (language === 'km') return item.datesKm || item.datesEn || 'ទៅមក'
    return item.datesEn || 'Round-trip'
  }

  const getHubName = (hub) => {
    if (language === 'vi') return hub.nameVi
    if (language === 'km') return hub.nameKm
    return hub.nameEn
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header (Trip.com & Booking.com Signature Style) */}
      <div className="mb-4">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {t('home.popularNearYouTitle')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('home.popularNearYouSubtitle')}
        </p>
      </div>

      {/* Tabs & Origin Departure Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-navy-800 mb-6 pb-2 text-sm">
        {/* Category Tabs: International / National (Domestic) */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('INTERNATIONAL')}
            className={`pb-2.5 font-bold text-base transition-all relative ${
              activeTab === 'INTERNATIONAL'
                ? 'text-[#006ce4] dark:text-sky-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('home.tabInternational')}
            {activeTab === 'INTERNATIONAL' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006ce4] dark:bg-sky-400 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DOMESTIC')}
            className={`pb-2.5 font-bold text-base transition-all relative ${
              activeTab === 'DOMESTIC'
                ? 'text-[#006ce4] dark:text-sky-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('home.tabDomestic')}
            {activeTab === 'DOMESTIC' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006ce4] dark:bg-sky-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Departure Origin Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 mr-1 shrink-0 font-medium">
            <MapPin className="h-3.5 w-3.5" />
            <span>{t('home.departureFrom') || 'Departing from'}:</span>
          </div>
          {ORIGIN_HUBS.map((hub) => {
            const isSelected = selectedOrigin === hub.code
            return (
              <button
                key={hub.code}
                type="button"
                onClick={() => setSelectedOrigin(hub.code)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#006ce4] text-white border-[#006ce4] shadow-sm'
                    : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-navy-900 dark:text-slate-300 dark:border-navy-800 hover:bg-slate-200'
                }`}
              >
                {getHubName(hub)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-200 shadow-xl border border-slate-200 dark:border-navy-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-50 hover:scale-105"
          aria-label="Previous flights"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-200 shadow-xl border border-slate-200 dark:border-navy-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-50 hover:scale-105"
          aria-label="Next flights"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-5 overflow-x-auto scrollbar-none pb-4 pt-1 snap-x scroll-smooth"
        >
          {displayItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectDeal(item)}
              className="w-[270px] sm:w-[290px] shrink-0 snap-start cursor-pointer group/card flex flex-col"
            >
              {/* Card Photo (Trip.com / Booking.com aspect-ratio) */}
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-navy-900 relative shadow-sm border border-slate-200/60 dark:border-navy-800">
                <img
                  src={item.imageUrl || item.image}
                  alt={getDestinationName(item)}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                />

                {/* Top-Right Airport Code Route Badge */}
                <div className="absolute top-3 right-3 rounded-lg bg-white/95 dark:bg-navy-950/95 backdrop-blur-sm px-2.5 py-1 text-[11px] font-black text-navy-950 dark:text-sky-300 shadow-md border border-black/5 dark:border-white/10 flex items-center gap-1.5">
                  <Plane className="h-3 w-3 text-[#006ce4]" />
                  <span>{item.origin} → {item.destination}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="mt-3">
                {/* Destination Name as Primary Heading */}
                <h3 className="font-black text-slate-900 dark:text-white text-base group-hover/card:text-[#006ce4] dark:group-hover/card:text-sky-400 transition-colors truncate">
                  {getDestinationName(item)}
                  {getCountryName(item) && (
                    <span className="text-xs font-normal text-slate-400 ml-1.5">
                      · {getCountryName(item)}
                    </span>
                  )}
                </h3>

                {/* Subtitle with departure origin context & travel dates */}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <span>{t('home.departureFrom') || 'From'}:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{getOriginCityName(item)}</span>
                  <span>·</span>
                  <span className="truncate">{getItemDates(item)}</span>
                </p>

                {/* Price */}
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-400">
                    {t('home.faresFrom')}:
                  </span>
                  <span className="text-base font-black text-[#003580] dark:text-sky-400">
                    {formatPrice(item.price, 'VND')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
