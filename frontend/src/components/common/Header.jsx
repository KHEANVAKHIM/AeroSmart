import { useState, useRef, useEffect, useMemo } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Plane,
  Sun,
  Moon,
  Check,
  User,
  LogOut,
  LayoutDashboard,
  Ticket,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Bell,
  Activity,
  Luggage,
  Sparkles,
  Hotel,
  Globe,
  Car,
  Compass,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useCurrency } from '../../context/CurrencyContext'
import { useLanguage } from '../../context/LanguageContext'
import { useBooking } from '../../context/BookingContext'
import LanguageModal from './LanguageModal'
import CountryFlag from './CountryFlag'
import FlightStatusModal from '../customer/FlightStatusModal'
import BaggageInfoModal from '../customer/BaggageInfoModal'
import NewServicesModal from '../customer/NewServicesModal'
import LeftSidebar from './LeftSidebar'

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { currency, setCurrency, supportedCurrencies } = useCurrency()
  const { language, t } = useLanguage()
  const { activeProductTab = 'flights', setActiveProductTab } = useBooking()
  const navigate = useNavigate()
  const location = useLocation()

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false)
  const [languageModalOpen, setLanguageModalOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [flightStatusModalOpen, setFlightStatusModalOpen] = useState(false)
  const [baggageModalOpen, setBaggageModalOpen] = useState(false)
  const [newServicesModalOpen, setNewServicesModalOpen] = useState(false)
  const [selectedAncillary, setSelectedAncillary] = useState(null)
  const [unreadCount, setUnreadCount] = useState(2)

  const currencyRef = useRef(null)
  const userRef = useRef(null)
  const notificationRef = useRef(null)

  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const currentTab = useMemo(() => {
    const path = location.pathname
    if (path.startsWith('/stays')) return 'stays'
    if (path.startsWith('/flight-hotel') || path.startsWith('/packages')) return 'package'
    if (path.startsWith('/car')) return 'cars'
    if (path.startsWith('/attractions')) return 'attractions'
    if (path.startsWith('/airport-taxis') || path.startsWith('/taxis')) return 'taxis'
    if (path.startsWith('/flights')) return 'flights'
    return activeProductTab || 'flights'
  }, [location.pathname, activeProductTab])

  const handleSelectProductTab = (tabKey) => {
    if (setActiveProductTab) {
      setActiveProductTab(tabKey)
    }
    if (tabKey === 'stays') {
      navigate('/stays')
    } else if (tabKey === 'flights') {
      navigate('/')
      setTimeout(() => {
        const heroEl = document.getElementById('search-hero-section')
        if (heroEl) heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    } else if (tabKey === 'package') {
      navigate('/flight-hotel')
    } else if (tabKey === 'cars') {
      navigate('/car-rental')
    } else if (tabKey === 'attractions') {
      navigate('/attractions')
    } else if (tabKey === 'taxis') {
      navigate('/airport-taxis')
    }
  }

  // Dynamic notifications based on current language
  const notifications = [
    {
      id: 1,
      type: 'CHECKIN',
      title: isVi ? 'Chuyến bay đã mở Check-in' : (isKm ? 'ជើងហោះហើរបានបើកការឆែកអ៊ីន' : 'Flight Open for Online Check-in'),
      desc: isVi ? 'Chuyến bay HAN → SGN (VN-HASG1-0921) đã sẵn sàng làm thủ tục trực tuyến.' : (isKm ? 'ជើងហោះហើរ HAN → SGN រួចរាល់សម្រាប់ការឆែកអ៊ីន។' : 'Flight HAN → SGN (VN-HASG1-0921) is ready for online check-in.'),
      time: isVi ? '10 phút trước' : (isKm ? '១០ នាទីមុន' : '10m ago'),
      link: '/checkin',
    },
    {
      id: 2,
      type: 'GATE',
      title: isVi ? 'Cửa khởi hành đã mở: Gate 04' : (isKm ? 'ច្រកទ្វារឡើងយន្តហោះបើក: Gate 04' : 'Boarding Gate Open: Gate 04'),
      desc: isVi ? 'Nhà ga T1 đã bắt đầu đón khách lên tàu bay lúc 07:50.' : (isKm ? 'ស្ថានីយ T1 បានចាប់ផ្តើមទទួលអ្នកដំណើរ។' : 'Terminal T1 has commenced passenger boarding at 07:50.'),
      time: isVi ? '35 phút trước' : (isKm ? '៣៥ នាទីមុន' : '35m ago'),
      action: () => setFlightStatusModalOpen(true),
    },
    {
      id: 3,
      type: 'PROMO',
      title: isVi ? 'Ưu đãi Đặc Quyền Mùa Thu' : (isKm ? 'ការបញ្ចុះតម្លៃពិសេស' : 'Autumn Exclusive Flight Deals'),
      desc: isVi ? 'Giảm 20% các chặng bay Hà Nội - Đà Nẵng / Phú Quốc.' : (isKm ? 'បញ្ចុះតម្លៃ ២០% សម្រាប់ជើងហោះហើរពេញនិយម។' : 'Enjoy 20% discount on select domestic & regional flights.'),
      time: isVi ? '2 giờ trước' : (isKm ? '២ ម៉ោងមុន' : '2h ago'),
      link: '/flights',
    },
  ]

  // Click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setCurrencyDropdownOpen(false)
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-colors duration-200 dark:border-navy-800/80 dark:bg-navy-950/95 dark:text-white">
      {/* ROW 1: BRAND LOGO + CONTROLS & AUTH */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* CỤM ĐI TRÁI: Hamburger Drawer + Logo */}
        <div className="flex items-center gap-2.5 sm:gap-5 shrink-0">
          {/* Nút mở Menu Trái (Left Menu) */}
          <button
            type="button"
            onClick={() => setLeftSidebarOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 dark:border-navy-800 dark:bg-navy-900/80 px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 hover:border-[#003580] dark:text-slate-200 dark:hover:bg-navy-850 transition-all shadow-sm group"
            title="Menu bên trái (Left Menu)"
            aria-label="Open left menu"
          >
            <Menu className="h-4 w-4 text-[#003580] dark:text-sky-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-[#003580] dark:text-sky-300">Menu</span>
          </button>

          {/* Brand Logo on left */}
          <Link to="/" className="group flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#003580] text-white shadow-sm transition-transform group-hover:scale-105 dark:bg-[#006ce4]">
              <Plane className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-[#003580] dark:text-white transition-colors group-hover:text-[#006ce4]">
              Aero<span className="text-[#006ce4] dark:text-sky-400">Smart</span>
            </span>
          </Link>
        </div>

        {/* CỤM ĐI PHẢI: Tiền tệ, Ngôn ngữ, Thông báo, Giao diện, Tài khoản */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Multi-Currency Dropdown */}
          <div className="relative" ref={currencyRef}>
            <button
              type="button"
              onClick={() => {
                setCurrencyDropdownOpen(!currencyDropdownOpen)
                setUserDropdownOpen(false)
                setNotificationsOpen(false)
              }}
              title={t('controls.currency')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-[#003580] hover:bg-slate-100 transition-all dark:border-navy-800 dark:bg-navy-900/80 dark:text-slate-200 whitespace-nowrap"
            >
              <span>{currency.flag}</span>
              <span>{currency.code}</span>
              <span className="text-slate-400 dark:text-slate-500">({currency.symbol})</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 animate-fade-in rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:border-navy-700 dark:bg-navy-900 dark:ring-white/10 z-50">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t('controls.currency')}
                </div>
                {supportedCurrencies.map((c) => {
                  const isSelected = c.code === currency.code
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setCurrency(c.code)
                        setCurrencyDropdownOpen(false)
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                        isSelected
                          ? 'bg-sky-50 font-bold text-[#003580] dark:bg-cyan-950/60 dark:text-cyan-300'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-navy-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span className="font-semibold">{c.code}</span>
                        <span className="text-slate-400 font-normal text-[11px]">({c.symbol})</span>
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 text-[#006ce4] dark:text-cyan-400" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Language Selector Button */}
          <button
            type="button"
            onClick={() => {
              setLanguageModalOpen(true)
              setCurrencyDropdownOpen(false)
              setUserDropdownOpen(false)
              setNotificationsOpen(false)
            }}
            title={t('controls.language')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-[#003580] hover:bg-slate-100 transition-all dark:border-navy-800 dark:bg-navy-900/80 dark:text-slate-200 whitespace-nowrap"
          >
            <CountryFlag countryCode={language.countryCode || language.code} size="sm" />
            <span className="font-semibold">{language.label || language.name}</span>
          </button>

          {/* Notification Center Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen)
                setUserDropdownOpen(false)
                setCurrencyDropdownOpen(false)
                setUnreadCount(0)
              }}
              title={t('nav.notifications')}
              className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100 transition-all dark:border-navy-800 dark:bg-navy-900/80 dark:text-slate-300 dark:hover:bg-navy-800"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-white dark:ring-navy-950 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 animate-fade-in rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl ring-1 ring-black/5 dark:border-navy-700 dark:bg-navy-900 dark:ring-white/10 z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-navy-800">
                  <span className="text-xs font-bold text-navy-950 dark:text-white flex items-center gap-1.5">
                    <Bell className="h-3.5 w-3.5 text-[#006ce4]" />
                    <span>{t('nav.notifications')}</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">{t('nav.latest')}</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setNotificationsOpen(false)
                        if (n.action) n.action()
                      }}
                      className="p-2.5 rounded-xl border border-slate-100 dark:border-navy-800 hover:bg-slate-50 dark:hover:bg-navy-800/60 cursor-pointer transition-colors"
                    >
                      {n.link ? (
                        <Link to={n.link} className="block">
                          <p className="text-xs font-bold text-navy-900 dark:text-white flex items-center justify-between">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {n.desc}
                          </p>
                        </Link>
                      ) : (
                        <div>
                          <p className="text-xs font-bold text-navy-900 dark:text-white flex items-center justify-between">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {n.desc}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? t('controls.lightMode') : t('controls.darkMode')}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100 transition-all dark:border-navy-800 dark:bg-navy-900/80 dark:text-slate-300 dark:hover:bg-navy-800"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400 fill-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>

          <div className="h-5 w-[1px] bg-slate-200 dark:bg-navy-800 mx-0.5 hidden sm:block" />

          {/* Auth Action Buttons */}
          {isAuthenticated ? (
            <div className="relative" ref={userRef}>
              <button
                type="button"
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen)
                  setCurrencyDropdownOpen(false)
                  setNotificationsOpen(false)
                }}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-navy-900 hover:border-[#003580] transition-all dark:border-navy-700 dark:bg-navy-800/80 dark:text-white whitespace-nowrap"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#003580]/15 text-xs font-bold text-[#003580] dark:bg-sky-500/20 dark:text-sky-300">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="max-w-[120px] truncate hidden sm:inline">{user?.fullName || user?.email}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 animate-fade-in rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl ring-1 ring-black/5 dark:border-navy-700 dark:bg-navy-900 dark:ring-white/10 z-50">
                  <div className="border-b border-slate-100 dark:border-navy-800 px-3 py-2">
                    <p className="text-[11px] text-slate-400 dark:text-navy-300">{t('auth.signedInAs')}</p>
                    <p className="truncate text-xs font-bold text-navy-950 dark:text-white">{user?.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-[#003580] dark:bg-cyan-500/20 dark:text-cyan-300">
                      {isAdmin ? t('auth.admin') : t('auth.passenger')}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/my-bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                    >
                      <Ticket className="h-4 w-4 text-[#006ce4] dark:text-sky-400" />
                      <span>{t('nav.myBookings')}</span>
                    </Link>
                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <span>{t('auth.profileAndAccount') || 'Profile & Account'}</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>{t('nav.adminPortal')}</span>
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-slate-100 dark:border-navy-800 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false)
                        logout()
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('auth.signOut')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-navy-950 dark:text-slate-200 dark:hover:text-white transition-colors whitespace-nowrap"
              >
                {t('auth.signIn')}
              </Link>
              <Link
                to="/register"
                className="btn-primary py-1.5 px-3.5 text-xs font-bold shadow-sm whitespace-nowrap"
              >
                {t('auth.register')}
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setLeftSidebarOpen(true)}
            className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-navy-900 xl:hidden"
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* ROW 2: BOOKING.COM SIGNATURE 6-PRODUCT NAVIGATION BAR */}
      <div className="bg-[#003580] text-white border-t border-blue-900/50 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="mx-auto max-w-7xl flex items-center gap-1 sm:gap-2 py-2 overflow-x-auto no-scrollbar">
          {/* 1. Stays (Chỗ nghỉ) */}
          <button
            type="button"
            onClick={() => handleSelectProductTab('stays')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all group ${
              currentTab === 'stays'
                ? 'bg-white/20 border border-white font-bold text-white shadow-sm'
                : 'text-white/90 hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <Hotel className="h-4 w-4 text-slate-200 group-hover:scale-110 transition-transform" />
            <span>{isVi ? 'Chỗ nghỉ' : (isKm ? 'កន្លែងស្នាក់នៅ' : 'Stays')}</span>
          </button>

          {/* 2. Flights (Chuyến bay) */}
          <button
            type="button"
            onClick={() => handleSelectProductTab('flights')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-all group ${
              currentTab === 'flights'
                ? 'bg-white/20 border border-white font-bold text-white shadow-sm'
                : 'text-white/90 hover:text-white hover:bg-white/10 border border-transparent font-semibold'
            }`}
          >
            <Plane className="h-4 w-4 -rotate-45 group-hover:scale-110 transition-transform" />
            <span>{isVi ? 'Chuyến bay' : (isKm ? 'ជើងហោះហើរ' : 'Flights')}</span>
          </button>

          {/* 3. Flight + Hotel (Chuyến bay + Khách sạn) */}
          <button
            type="button"
            onClick={() => handleSelectProductTab('package')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all group ${
              currentTab === 'package'
                ? 'bg-white/20 border border-white font-bold text-white shadow-sm'
                : 'text-white/90 hover:text-white hover:bg-white/10 border border-transparent font-semibold'
            }`}
          >
            <Globe className="h-4 w-4 text-slate-200 group-hover:scale-110 transition-transform" />
            <span>{isVi ? 'Chuyến bay + K.sạn' : (isKm ? 'សំបុត្រ + សណ្ឋាគារ' : 'Flight + Hotel')}</span>
          </button>

          {/* 4. Car rental (Thuê xe) */}
          <button
            type="button"
            onClick={() => handleSelectProductTab('cars')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all group ${
              currentTab === 'cars'
                ? 'bg-white/20 border border-white font-bold text-white shadow-sm'
                : 'text-white/90 hover:text-white hover:bg-white/10 border border-transparent font-semibold'
            }`}
          >
            <Car className="h-4 w-4 text-slate-200 group-hover:scale-110 transition-transform" />
            <span>{isVi ? 'Thuê xe' : (isKm ? 'ជួលរថយន្ត' : 'Car rental')}</span>
          </button>

          {/* 5. Attractions (Địa điểm tham quan) */}
          <button
            type="button"
            onClick={() => handleSelectProductTab('attractions')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all group ${
              currentTab === 'attractions'
                ? 'bg-white/20 border border-white font-bold text-white shadow-sm'
                : 'text-white/90 hover:text-white hover:bg-white/10 border border-transparent font-semibold'
            }`}
          >
            <Compass className="h-4 w-4 text-slate-200 group-hover:scale-110 transition-transform" />
            <span>{isVi ? 'Địa điểm tham quan' : (isKm ? 'កន្លែងកម្សាន្ត' : 'Attractions')}</span>
          </button>

          {/* 6. Airport taxis (Taxi sân bay) */}
          <button
            type="button"
            onClick={() => handleSelectProductTab('taxis')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all group ${
              currentTab === 'taxis'
                ? 'bg-white/20 border border-white font-bold text-white shadow-sm'
                : 'text-white/90 hover:text-white hover:bg-white/10 border border-white/30 hover:border-white font-semibold'
            }`}
          >
            <Car className="h-4 w-4 text-amber-300 group-hover:scale-110 transition-transform" />
            <span>{isVi ? 'Taxi sân bay' : (isKm ? 'តាក់ស៊ីព្រលាន' : 'Airport taxis')}</span>
          </button>
        </div>
      </div>

      {/* Left-Side Navigation Drawer */}
      <LeftSidebar
        isOpen={leftSidebarOpen}
        onClose={() => setLeftSidebarOpen(false)}
        onOpenFlightStatus={() => setFlightStatusModalOpen(true)}
        onOpenBaggage={() => setBaggageModalOpen(true)}
        onOpenLanguage={() => setLanguageModalOpen(true)}
        onOpenNewServices={() => setNewServicesModalOpen(true)}
      />

      {/* Booking.com Select Your Language Modal */}
      <LanguageModal
        isOpen={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
      />

      {/* Flight Radar Live Status Modal */}
      <FlightStatusModal
        isOpen={flightStatusModalOpen}
        onClose={() => setFlightStatusModalOpen(false)}
      />

      {/* Baggage Guidelines & 24/7 Support Modal */}
      <BaggageInfoModal
        isOpen={baggageModalOpen}
        onClose={() => setBaggageModalOpen(false)}
      />

      {/* New Airline Services Modal */}
      <NewServicesModal
        isOpen={newServicesModalOpen}
        onClose={() => {
          setNewServicesModalOpen(false)
          setSelectedAncillary(null)
        }}
        initialService={selectedAncillary}
        initialMode={selectedAncillary ? 'CUSTOMIZE' : 'EXPLORE'}
      />
    </header>
  )
}


