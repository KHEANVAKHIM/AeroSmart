import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Plane,
  Sun,
  Moon,
  Globe,
  Coins,
  Check,
  User,
  LogOut,
  LayoutDashboard,
  Ticket,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useCurrency } from '../../context/CurrencyContext'
import { useLanguage } from '../../context/LanguageContext'
import LanguageModal from './LanguageModal'
import CountryFlag from './CountryFlag'

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { theme, isDark, setTheme, toggleTheme } = useTheme()
  const { currency, setCurrency, supportedCurrencies } = useCurrency()
  const { language, setLanguage, supportedLanguages, t } = useLanguage()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false)
  const [languageModalOpen, setLanguageModalOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const currencyRef = useRef(null)
  const languageRef = useRef(null)
  const userRef = useRef(null)

  // Click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setCurrencyDropdownOpen(false)
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setLanguageDropdownOpen(false)
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-colors duration-200 dark:border-navy-800/80 dark:bg-navy-950/95 dark:text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="group flex flex-col justify-center">
          <span className="text-2xl font-black tracking-tight text-[#003580] dark:text-white transition-colors group-hover:text-[#006ce4]">
            Aero<span className="text-[#006ce4]">Smart</span>
          </span>
          <span className="hidden text-[10px] tracking-wide text-slate-500 dark:text-navy-300 sm:block -mt-0.5">
            {t('brand.slogan')}
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `transition-colors ${
                isActive
                  ? 'text-[#006ce4] dark:text-sky-400 font-bold'
                  : 'text-slate-600 hover:text-[#006ce4] dark:text-slate-300 dark:hover:text-sky-300'
              }`
            }
          >
            {t('nav.flights')}
          </NavLink>
          <NavLink
            to="/flights"
            className={({ isActive }) =>
              `transition-colors ${
                isActive
                  ? 'text-[#006ce4] dark:text-sky-400 font-bold'
                  : 'text-slate-600 hover:text-[#006ce4] dark:text-slate-300 dark:hover:text-sky-300'
              }`
            }
          >
            {t('nav.explore')}
          </NavLink>
          <NavLink
            to="/my-bookings"
            className={({ isActive }) =>
              `transition-colors ${
                isActive
                  ? 'text-[#006ce4] dark:text-sky-400 font-bold'
                  : 'text-slate-600 hover:text-[#006ce4] dark:text-slate-300 dark:hover:text-sky-300'
              }`
            }
          >
            {t('nav.myBookings')}
          </NavLink>
        </nav>

        {/* Right Controls Cluster */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Multi-Currency Dropdown */}
          <div className="relative" ref={currencyRef}>
            <button
              type="button"
              onClick={() => {
                setCurrencyDropdownOpen(!currencyDropdownOpen)
                setLanguageDropdownOpen(false)
                setUserDropdownOpen(false)
              }}
              title={t('controls.currency')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-cyan-400 hover:bg-slate-100 transition-all dark:border-navy-800 dark:bg-navy-900/80 dark:text-slate-200 dark:hover:border-cyan-500/50"
            >
              <span>{currency.flag}</span>
              <span>{currency.code}</span>
              <span className="text-slate-400 dark:text-slate-500">({currency.symbol})</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 animate-fade-in rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:border-navy-700 dark:bg-navy-900 dark:ring-white/10">
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
                          ? 'bg-cyan-50 font-bold text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-navy-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span className="font-semibold">{c.code}</span>
                        <span className="text-slate-400 font-normal text-[11px]">({c.symbol})</span>
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Language Selector Button (Booking.com Style) */}
          <button
            type="button"
            onClick={() => {
              setLanguageModalOpen(true)
              setCurrencyDropdownOpen(false)
              setUserDropdownOpen(false)
            }}
            title={t('controls.language')}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-[#006ce4] hover:bg-slate-100 transition-all dark:border-navy-800 dark:bg-navy-900/80 dark:text-slate-200 dark:hover:border-cyan-500/50"
          >
            <CountryFlag countryCode={language.countryCode || language.code} size="sm" />
            <span className="font-semibold">{language.label || language.name}</span>
          </button>

          {/* Theme Switcher: Segmented Pill showing Light & Dark */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100/90 p-1 transition-colors dark:border-navy-700 dark:bg-navy-900/90">
            <button
              type="button"
              onClick={() => setTheme('light')}
              title={t('controls.lightMode')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                !isDark
                  ? 'bg-white text-navy-950 shadow-sm'
                  : 'text-slate-500 hover:text-navy-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Sun className={`h-3.5 w-3.5 ${!isDark ? 'text-amber-500 fill-amber-400' : 'text-slate-400'}`} />
              <span>{t('controls.lightMode')}</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              title={t('controls.darkMode')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                isDark
                  ? 'bg-navy-800 text-white shadow-sm ring-1 ring-cyan-400/30'
                  : 'text-slate-500 hover:text-navy-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Moon className={`h-3.5 w-3.5 ${isDark ? 'text-cyan-300 fill-cyan-300' : 'text-slate-400'}`} />
              <span>{t('controls.darkMode')}</span>
            </button>
          </div>

          <div className="h-5 w-[1px] bg-slate-200 dark:bg-navy-800 mx-1" />

          {/* Auth Action Buttons */}
          {isAuthenticated ? (
            <div className="relative" ref={userRef}>
              <button
                type="button"
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen)
                  setCurrencyDropdownOpen(false)
                  setLanguageDropdownOpen(false)
                }}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-navy-900 hover:border-cyan-400 transition-all dark:border-navy-700 dark:bg-navy-800/80 dark:text-white"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/20 text-xs font-bold text-cyan-700 dark:text-cyan-300">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="max-w-[110px] truncate">{user?.fullName || user?.email}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 animate-fade-in rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl ring-1 ring-black/5 dark:border-navy-700 dark:bg-navy-900 dark:ring-white/10">
                  <div className="border-b border-slate-100 dark:border-navy-800 px-3 py-2">
                    <p className="text-[11px] text-slate-400 dark:text-navy-300">{t('auth.signedInAs')}</p>
                    <p className="truncate text-xs font-bold text-navy-950 dark:text-white">{user?.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300">
                      {isAdmin ? t('auth.admin') : t('auth.passenger')}
                    </span>
                  </div>

                  <div className="py-1">
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
                    <Link
                      to="/my-bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                    >
                      <Ticket className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      <span>{t('nav.myBookings')}</span>
                    </Link>
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
                className="rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-navy-950 dark:text-slate-200 dark:hover:text-white transition-colors"
              >
                {t('auth.signIn')}
              </Link>
              <Link
                to="/register"
                className="btn-primary py-1.5 px-3.5 text-xs font-bold shadow-sm"
              >
                {t('auth.register')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Action Cluster */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 dark:border-navy-800 dark:bg-navy-900 dark:text-slate-300"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-navy-800" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-navy-900"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-4 shadow-xl dark:border-navy-800 dark:bg-navy-950 animate-slide-up">
          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-navy-900"
            >
              {t('nav.flights')}
            </Link>
            <Link
              to="/flights"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-navy-900"
            >
              {t('nav.explore')}
            </Link>
            <Link
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-navy-900"
            >
              {t('nav.myBookings')}
            </Link>
          </nav>

          {/* Segmented Controls: Currency & Language */}
          <div className="border-t border-slate-100 dark:border-navy-800 pt-4 space-y-3">
            {/* Currency Selector */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {t('controls.currency')}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {supportedCurrencies.map((c) => {
                  const isSelected = c.code === currency.code
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setCurrency(c.code)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
                          : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-navy-800 dark:bg-navy-900 dark:text-slate-400'
                      }`}
                    >
                      <span>{c.flag}</span>
                      <span>{c.code}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Language Selector */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {t('controls.language')}
              </p>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setLanguageModalOpen(true)
                }}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 hover:border-[#006ce4] dark:border-navy-800 dark:bg-navy-900 dark:text-slate-200"
              >
                <div className="flex items-center gap-3">
                  <CountryFlag countryCode={language.countryCode || language.code} size="md" />
                  <span className="font-bold text-sm">{language.label}</span>
                </div>
                <span className="text-xs text-[#006ce4] font-semibold">Change</span>
              </button>
            </div>

            {/* Theme Selector */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {t('controls.theme')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false) || setTheme('light')}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-2 text-xs font-bold transition-all ${
                    !isDark
                      ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-navy-800 dark:bg-navy-900 dark:text-slate-400'
                  }`}
                >
                  <Sun className={`h-4 w-4 ${!isDark ? 'text-amber-500 fill-amber-400' : ''}`} />
                  <span>{t('controls.lightMode')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false) || setTheme('dark')}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-2 text-xs font-bold transition-all ${
                    isDark
                      ? 'border-cyan-500 bg-cyan-950 text-cyan-300 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-navy-800 dark:bg-navy-900 dark:text-slate-400'
                  }`}
                >
                  <Moon className={`h-4 w-4 ${isDark ? 'text-cyan-300 fill-cyan-300' : ''}`} />
                  <span>{t('controls.darkMode')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Auth Controls */}
          <div className="border-t border-slate-100 dark:border-navy-800 pt-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('auth.signedInAs')}</p>
                  <p className="text-sm font-bold text-navy-950 dark:text-white truncate">{user?.email}</p>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-cyan-700 dark:text-cyan-300 hover:bg-slate-100 dark:hover:bg-navy-900"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>{t('nav.adminPortal')}</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('auth.signOut')}</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-navy-950 dark:border-navy-800 dark:bg-navy-900 dark:text-white"
                >
                  {t('auth.signIn')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center btn-primary py-2.5 text-xs font-bold shadow-md"
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking.com Select Your Language Modal */}
      <LanguageModal
        isOpen={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
      />
    </header>
  )
}
