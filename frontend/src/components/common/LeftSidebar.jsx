import React from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Plane,
  X,
  Compass,
  ShieldCheck,
  Ticket,
  Activity,
  Luggage,
  Sparkles,
  User,
  LogOut,
  LayoutDashboard,
  Globe,
  Coins,
  Sun,
  Moon,
  PhoneCall,
  ChevronRight,
  Headphones,
  Hotel,
  Car,
  Building2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useCurrency } from '../../context/CurrencyContext'
import { useLanguage } from '../../context/LanguageContext'
import CountryFlag from './CountryFlag'

export default function LeftSidebar({
  isOpen,
  onClose,
  onOpenFlightStatus,
  onOpenBaggage,
  onOpenLanguage,
  onOpenNewServices,
}) {
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { currency, setCurrency, supportedCurrencies } = useCurrency()
  const { language, t } = useLanguage()

  if (!isOpen) return null

  const handleNavClick = (path) => {
    onClose()
    if (path) navigate(path)
  }

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar Panel Sliding from Left */}
      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-80 sm:w-96 bg-white dark:bg-navy-950 shadow-2xl border-r border-slate-200 dark:border-navy-800 flex flex-col justify-between overflow-hidden animate-slideRight">
          {/* Top Brand Header */}
          <div className="bg-[#003580] dark:bg-navy-900 px-6 py-5 text-white flex items-center justify-between border-b border-blue-900/60">
            <Link
              to="/"
              onClick={onClose}
              className="group flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm shadow-md transition-transform group-hover:scale-105">
                <Plane className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white">
                  Aero<span className="text-sky-300">Smart</span>
                </span>
                <span className="text-[10px] tracking-wide text-sky-200/80 -mt-1 font-medium">
                  {t('brand.slogan')}
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Navigation Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Section: Dịch vụ Hàng không Mới & Tiện ích Độc quyền (Featured Services) */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 dark:from-navy-900/90 dark:to-sky-950/40 p-3.5 border border-sky-100 dark:border-navy-800">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#003580] dark:text-sky-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>{language?.code === 'vi' ? 'Dịch vụ Mới & Tiện ích' : (language?.code === 'km' ? 'សេវាកម្មថ្មី' : 'New Services & Extras')}</span>
                </span>
                <span className="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded-full animate-pulse">
                  HOT 2026
                </span>
              </div>

              <div className="space-y-1.5">
                {/* Dịch vụ mới (New Services Modal) */}
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    if (onOpenNewServices) onOpenNewServices()
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold bg-white dark:bg-navy-950 text-navy-950 dark:text-white hover:border-[#003580] hover:shadow-sm border border-slate-200/80 dark:border-navy-800 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-900 dark:text-white">
                        {t('nav.newServices')}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        {language?.code === 'vi' ? 'Phòng chờ VIP, Limousine, Suất ăn...' : 'Lounge, Limousine, Sky Dining...'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Tình trạng chuyến bay (Flight Status Radar) */}
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    if (onOpenFlightStatus) onOpenFlightStatus()
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold bg-white dark:bg-navy-950 text-navy-950 dark:text-white hover:border-[#003580] hover:shadow-sm border border-slate-200/80 dark:border-navy-800 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-900 dark:text-white">
                        {t('nav.flightStatus')}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        {language?.code === 'vi' ? 'Radar & Giờ cất/hạ cánh trực tiếp' : 'Live Flight Radar & Timetable'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                    LIVE
                  </span>
                </button>

                {/* Quy định hành lý (Baggage Guidelines) */}
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    if (onOpenBaggage) onOpenBaggage()
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold bg-white dark:bg-navy-950 text-navy-950 dark:text-white hover:border-[#003580] hover:shadow-sm border border-slate-200/80 dark:border-navy-800 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <Luggage className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-900 dark:text-white">
                        {t('nav.baggageHelp')}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        {language?.code === 'vi' ? 'Tiêu chuẩn xách tay & ký gửi' : 'Hand luggage & checked bag rules'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Section: Main Navigation */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-3">
                {language?.code === 'vi' ? 'Chuyến bay & Hành trình' : (language?.code === 'km' ? 'ជើងហោះហើរ' : 'Flights & Trips')}
              </p>
              <nav className="space-y-1">
                <NavLink
                  to="/"
                  onClick={onClose}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-sky-50 text-[#003580] font-black dark:bg-sky-950/60 dark:text-sky-300'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-navy-950 dark:text-slate-300 dark:hover:bg-navy-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Plane className="h-4 w-4 text-[#006ce4] shrink-0" />
                  <span>{t('nav.flights')}</span>
                </NavLink>

                <NavLink
                  to="/flights"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-sky-50 text-[#003580] font-black dark:bg-sky-950/60 dark:text-sky-300'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-navy-950 dark:text-slate-300 dark:hover:bg-navy-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Compass className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>{t('nav.explore')}</span>
                </NavLink>

                <NavLink
                  to="/stays"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-sky-50 text-[#003580] font-black dark:bg-sky-950/60 dark:text-sky-300'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-navy-950 dark:text-slate-300 dark:hover:bg-navy-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Hotel className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>{language?.code === 'vi' ? 'Chỗ nghỉ & Khách sạn' : 'Stays & Hotels'}</span>
                </NavLink>

                <NavLink
                  to="/flight-hotel"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-sky-50 text-[#003580] font-black dark:bg-sky-950/60 dark:text-sky-300'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-navy-950 dark:text-slate-300 dark:hover:bg-navy-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Globe className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{language?.code === 'vi' ? 'Gói Combo Máy bay + K.sạn' : 'Flight + Hotel Packages'}</span>
                </NavLink>

                <NavLink
                  to="/car-rental"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-sky-50 text-[#003580] font-black dark:bg-sky-950/60 dark:text-sky-300'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-navy-950 dark:text-slate-300 dark:hover:bg-navy-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Car className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>{language?.code === 'vi' ? 'Thuê xe tự lái & Có tài' : 'Car Rentals'}</span>
                </NavLink>

                <NavLink
                  to="/attractions"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-sky-50 text-[#003580] font-black dark:bg-sky-950/60 dark:text-sky-300'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-navy-950 dark:text-slate-300 dark:hover:bg-navy-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Compass className="h-4 w-4 text-rose-500 shrink-0" />
                  <span>{language?.code === 'vi' ? 'Địa điểm tham quan & Tour' : 'Attractions & Tours'}</span>
                </NavLink>

                <NavLink
                  to="/airport-taxis"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-sky-50 text-[#003580] font-black dark:bg-sky-950/60 dark:text-sky-300'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-navy-950 dark:text-slate-300 dark:hover:bg-navy-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Car className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>{language?.code === 'vi' ? 'Taxi đưa đón sân bay' : 'Airport Taxis'}</span>
                </NavLink>

                <NavLink
                  to="/checkin"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-black dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-navy-950 dark:text-slate-300 dark:hover:bg-navy-900 dark:hover:text-white'
                    }`
                  }
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{t('nav.checkIn')}</span>
                </NavLink>

                <NavLink
                  to="/my-bookings"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-sky-50 text-[#003580] font-black dark:bg-sky-950/60 dark:text-sky-300'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-navy-950 dark:text-slate-300 dark:hover:bg-navy-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Ticket className="h-4 w-4 text-indigo-500 shrink-0" />
                  <span>{t('nav.myBookings')}</span>
                </NavLink>
              </nav>
            </div>

            {/* Section: Account & Authentication */}
            <div className="pt-2 border-t border-slate-100 dark:border-navy-800">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-3">
                {language?.code === 'vi' ? 'Tài khoản thành viên' : (language?.code === 'km' ? 'គណនី' : 'Member Account')}
              </p>
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200/70 dark:border-navy-800">
                    <p className="text-[11px] text-slate-400">{t('auth.signedInAs')}</p>
                    <p className="text-xs font-bold text-navy-950 dark:text-white truncate">
                      {user?.fullName || user?.email}
                    </p>
                    <span className="mt-1 inline-block rounded-md bg-sky-100 dark:bg-sky-950 px-2 py-0.5 text-[10px] font-bold text-[#003580] dark:text-sky-300">
                      {isAdmin ? t('auth.admin') : t('auth.passenger')}
                    </span>
                  </div>

                  <Link
                    to="/account"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-900 transition-colors"
                  >
                    <User className="h-4 w-4 text-[#006ce4]" />
                    <span>{t('auth.profileAndAccount') || 'Profile & Account'}</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={onClose}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>{t('nav.adminPortal')}</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      logout()
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('auth.signOut')}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 dark:border-navy-800 dark:bg-navy-900 px-4 py-2.5 text-xs font-bold text-navy-950 dark:text-white hover:bg-slate-100 transition-colors"
                  >
                    <User className="h-4 w-4 text-slate-500" />
                    <span>{t('auth.signIn')}</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 rounded-2xl btn-primary px-4 py-2.5 text-xs font-bold shadow-md"
                  >
                    <span>{t('auth.register')}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Footer Controls: Language & Currency & Hotline */}
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-navy-800 bg-slate-50/90 dark:bg-navy-900/80 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              {/* Language Trigger */}
              <button
                type="button"
                onClick={() => {
                  onClose()
                  if (onOpenLanguage) onOpenLanguage()
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 py-2 px-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-[#003580] transition-all shadow-sm"
              >
                <CountryFlag countryCode={language.countryCode || language.code} size="sm" />
                <span className="truncate">{language.label || language.name}</span>
              </button>

              {/* Currency Selector */}
              <select
                value={currency.code}
                onChange={(e) => setCurrency(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 py-2 px-2 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm cursor-pointer outline-none focus:border-[#003580]"
                title={t('controls.currency')}
              >
                {supportedCurrencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 transition-all shadow-sm shrink-0"
                title={isDark ? t('controls.lightMode') : t('controls.darkMode')}
              >
                {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-navy-800" />}
              </button>
            </div>

            {/* Hotline 24/7 */}
            <div className="rounded-xl bg-blue-50/80 dark:bg-blue-950/40 p-2.5 border border-blue-100 dark:border-blue-900/40 flex items-center gap-2.5 text-xs text-blue-900 dark:text-blue-200">
              <PhoneCall className="h-4 w-4 text-[#006ce4] shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-semibold block">{language?.code === 'vi' ? 'Hotline CSKH 24/7:' : '24/7 Support Hotline:'}</span>
                <span className="font-bold font-mono text-xs text-[#003580] dark:text-sky-300">1900 1100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
