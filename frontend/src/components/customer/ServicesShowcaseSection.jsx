import React, { useState, useEffect, useRef } from 'react'
import {
  Sparkles,
  Armchair,
  Car,
  Utensils,
  Zap,
  ShieldCheck,
  Hotel,
  Star,
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Flame,
  Layers,
} from 'lucide-react'
import { getAllServices } from '../../data/airlineServicesData'
import { useLanguage } from '../../context/LanguageContext'
import { useCurrency } from '../../context/CurrencyContext'
import NewServicesModal from './NewServicesModal'

export default function ServicesShowcaseSection() {
  const { language } = useLanguage()
  const { formatPrice } = useCurrency()
  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const [activeCategory, setActiveCategory] = useState('ALL')
  const [services, setServices] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInitialService, setSelectedInitialService] = useState(null)
  const [modalMode, setModalMode] = useState('EXPLORE')
  const scrollRef = useRef(null)

  useEffect(() => {
    const list = getAllServices().filter((s) => s.isActive !== false)
    setServices(list)
  }, [])

  const categories = [
    { id: 'ALL', label: isVi ? 'Tất cả Dịch vụ' : (isKm ? 'ទាំងអស់' : 'All Ancillaries'), icon: Sparkles },
    { id: 'lounge', label: isVi ? 'Phòng chờ VIP' : (isKm ? 'បន្ទប់ទទួលភ្ញៀវ VIP' : 'VIP Lounges'), icon: Armchair },
    { id: 'transfer', label: isVi ? 'Xe Đưa Đón' : (isKm ? 'រថយន្តជូនដំណើរ' : 'Limousine Transfers'), icon: Car },
    { id: 'dining', label: isVi ? 'Ẩm thực Trên Mây' : (isKm ? 'អាហារលើអាកាស' : 'Sky Dining'), icon: Utensils },
    { id: 'fasttrack', label: isVi ? 'Lối đi Ưu Tiên' : (isKm ? 'ច្រកទ្វារអាទិភាព' : 'Fast-Track'), icon: Zap },
    { id: 'insurance', label: isVi ? 'Bảo hiểm AeroCare' : (isKm ? 'ធានារ៉ាប់រង' : 'Travel Insurance'), icon: ShieldCheck },
    { id: 'hotel', label: isVi ? 'Combo Khách Sạn' : (isKm ? 'កញ្ចប់សណ្ឋាគារ' : 'Flight + Hotel'), icon: Hotel },
  ]

  const filteredServices =
    activeCategory === 'ALL'
      ? services
      : services.filter((s) => s.category === activeCategory)

  const handleOpenModal = (service = null, mode = 'EXPLORE') => {
    setSelectedInitialService(service)
    setModalMode(mode)
    setIsModalOpen(true)
  }

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 text-amber-600 dark:text-amber-300 border border-amber-400/30 px-3 py-1 text-xs font-black uppercase tracking-wider mb-2">
            <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>{isVi ? 'ĐẶC QUYỀN HÀNG KHÔNG 2026' : (isKm ? 'សេវាកម្មពិសេស ២០២៦' : '2026 EXCLUSIVE ANCILLARIES')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight">
            {isVi
              ? 'Dịch Vụ & Tiện Ích Bay Đẳng Cấp'
              : (isKm ? 'សេវាកម្ម & បទពិសោធន៍ធ្វើដំណើរពិសេស' : 'Premium Airline Services & Travel Extras')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {isVi
              ? 'Nâng tầm chuyến đi với hàng loạt lựa chọn phòng chờ thương gia, xe limousine sang trọng, ẩm thực nóng và bảo hiểm toàn diện.'
              : (isKm
                ? 'លើកកម្ពស់ការធ្វើដំណើររបស់អ្នកជាមួយបន្ទប់ VIP រថយន្តទំនើប និងអាហារក្តៅៗឈ្ងុយឆ្ងាញ់។'
                : 'Elevate your journey with VIP airport lounges, luxury private chauffeurs, hot sky dining, and comprehensive travel coverage.')}
          </p>
        </div>

        {/* Right Header Controls: Arrows + Explore All */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Navigation Arrows (Left / Right) */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-navy-900 p-1 rounded-full border border-slate-200/80 dark:border-navy-800">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 hover:text-[#003580] transition-all hover:scale-105"
              title={isVi ? 'Lướt sang trái' : 'Previous services'}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 hover:text-[#003580] transition-all hover:scale-105"
              title={isVi ? 'Lướt sang phải' : 'Next services'}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#006ce4] dark:text-sky-400 hover:text-[#003580] group px-3 py-1.5 rounded-full hover:bg-sky-50 dark:hover:bg-navy-900 transition-all"
          >
            <span>{isVi ? 'Xem tất cả' : (isKm ? 'មើលទាំងអស់' : 'View all')}</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id)
                if (scrollRef.current) scrollRef.current.scrollLeft = 0
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border shadow-sm ${
                isActive
                  ? 'bg-[#003580] text-white border-[#003580] shadow-md dark:bg-sky-500 dark:text-navy-950 dark:border-sky-400'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-navy-900 dark:text-slate-300 dark:border-navy-700'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* Horizontal Carousel with Floating Left & Right Arrow Buttons */}
      <div className="relative group/carousel mt-2">
        {/* Floating Left Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-200 shadow-xl border border-slate-200 dark:border-navy-700 opacity-90 group-hover/carousel:opacity-100 hover:scale-110 hover:bg-slate-50 transition-all"
          aria-label="Previous services"
        >
          <ChevronLeft className="h-5 w-5 text-[#003580] dark:text-sky-400" />
        </button>

        {/* Floating Right Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-200 shadow-xl border border-slate-200 dark:border-navy-700 opacity-90 group-hover/carousel:opacity-100 hover:scale-110 hover:bg-slate-50 transition-all"
          aria-label="Next services"
        >
          <ChevronRight className="h-5 w-5 text-[#003580] dark:text-sky-400" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-5 overflow-x-auto scrollbar-none pb-4 pt-1 snap-x scroll-smooth"
        >
          {filteredServices.map((service) => {
            const title = isVi ? service.title : (isKm ? service.titleKm || service.title : service.titleEn || service.title)
            const desc = isVi ? service.desc : (isKm ? service.descKm || service.desc : service.descEn || service.desc)
            const unit = isVi ? service.unit : (isKm ? service.unitKm || service.unit : service.unitEn || service.unit)

            return (
              <div
                key={service.id}
                className="w-[280px] sm:w-[310px] shrink-0 snap-start rounded-2xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 hover:border-[#003580] hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image Banner */}
                <div
                  className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-navy-950 cursor-pointer"
                  onClick={() => handleOpenModal(service, 'PREVIEW')}
                >
                  <img
                    src={service.coverImg}
                    alt={title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-2.5 left-2.5">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm ${service.badgeColor}`}>
                      {service.badge}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/20">
                      <Star className="h-3 w-3 fill-amber-300" />
                      <span>{service.rating}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 drop-shadow">
                      {service.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Body Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-black text-navy-950 dark:text-white group-hover:text-[#003580] dark:group-hover:text-sky-300 transition-colors line-clamp-2">
                      {title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-navy-800 space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          {isVi ? 'Giá chỉ từ' : (isKm ? 'តម្លៃចាប់ពី' : 'From')}
                        </span>
                        <span className="text-base font-black text-[#003580] dark:text-sky-300">
                          {formatPrice(service.price, 'VND')}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal">
                        {unit}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(service, 'PREVIEW')}
                        className="btn-outline py-2 px-2 text-[11px] font-bold flex items-center justify-center gap-1 hover:border-[#003580]"
                      >
                        <Camera className="h-3 w-3 text-[#006ce4]" />
                        <span>{isVi ? 'Xem Ảnh' : 'Photos'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenModal(service, 'CUSTOMIZE')}
                        className="btn-primary py-2 px-2 text-[11px] font-bold shadow-sm flex items-center justify-center gap-1"
                      >
                        <span>{isVi ? 'Đặt ngay' : (isKm ? 'កក់' : 'Book')}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      <NewServicesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialService={selectedInitialService}
        initialMode={modalMode}
      />
    </section>
  )
}

