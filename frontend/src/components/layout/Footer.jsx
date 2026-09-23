import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plane,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Lock,
  Sparkles,
  CreditCard,
  Headphones,
  CheckCircle2,
  ExternalLink,
  Send,
  Check,
  ChevronRight,
  Globe,
  Coins,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useCurrency } from '../../context/CurrencyContext'

// High-fidelity SVG Logos for Social & Chat Platforms
function FacebookIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function YoutubeIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function LineIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.365 9.864c0-4.048-4.108-7.34-9.176-7.34-5.067 0-9.176 3.292-9.176 7.34 0 3.626 3.253 6.666 7.649 7.218.298.064.703.197.806.452.092.23.06.589.03.821l-.128.77c-.039.234-.18 1.096.96.598 1.14-.498 6.155-3.626 8.396-6.208 1.15-1.393 1.639-2.584 1.639-3.651zm-13.43 1.704h-1.57a.382.382 0 0 1-.382-.382V7.794c0-.21.171-.382.382-.382h1.57c.21 0 .382.172.382.382v.426a.382.382 0 0 1-.382.382h-1.07v1.077h1.07c.21 0 .382.172.382.382v.426a.382.382 0 0 1-.382.382zm2.664 0h-.518a.382.382 0 0 1-.382-.382V7.794c0-.21.171-.382.382-.382h.518c.211 0 .382.172.382.382v3.392a.382.382 0 0 1-.382.382zm4.331 0h-.55a.382.382 0 0 1-.345-.22l-1.688-2.274v2.112c0 .21-.172.382-.382.382h-.474a.382.382 0 0 1-.382-.382V7.794c0-.21.171-.382.382-.382h.55c.143 0 .274.08.345.22l1.688 2.275V7.794c0-.21.171-.382.382-.382h.474c.21 0 .382.172.382.382v3.392c0 .21-.172.382-.382.382zm3.328-2.316a.382.382 0 0 1-.382.382h-1.07v.512h1.07c.21 0 .382.172.382.382v.426a.382.382 0 0 1-.382.382h-1.57a.382.382 0 0 1-.382-.382V7.794c0-.21.171-.382.382-.382h1.57c.21 0 .382.172.382.382v.426a.382.382 0 0 1-.382.382h-1.07v.512h1.07c.21 0 .382.172.382.382v.426z" />
    </svg>
  )
}

function TelegramIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

function ZaloIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="currentColor">
      <path d="M24 4C12.95 4 4 12.95 4 24c0 3.54.93 6.86 2.56 9.75L4 44l10.59-2.5A19.86 19.86 0 0 0 24 44c11.05 0 20-8.95 20-20S35.05 4 24 4zm-7.6 25.4h-3.8v-1.7l3.8-6.1h-3.8v-1.9h6.1v1.6l-3.8 6.2h3.8v1.9zm8.5 0h-2.4l-1.1-2.6h-3.4l-1.1 2.6h-2.4l4.2-9.7h2l4.2 9.7zm-4.3-4.5l-1-2.5-1 2.5h2zm7.9 4.5h-2.3v-9.7h2.3v9.7zm8.5 0h-5.8v-9.7h2.3v7.7h3.5v2z" />
    </svg>
  )
}

// Crisp Vector Payment Gateway Badges
function VisaBadge() {
  return (
    <div className="flex h-11 w-20 items-center justify-center rounded-xl border border-slate-200 bg-white px-2 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md dark:border-navy-700 dark:bg-navy-900">
      <svg className="h-5 w-auto" viewBox="0 0 48 16" fill="none">
        <path
          d="M19.06 1.34l-3.23 13.32h-3.45L15.61 1.34h3.45zm13.78 8.64l1.83-5.04.99 5.04h-2.82zm3.84 4.68h3.19L37.1 1.34h-2.95c-.66 0-1.22.39-1.47.98l-5.18 12.34h3.63l.72-2.01h4.43l.4 2.01zm-10.02-4.8c-.01-3.17-4.37-3.35-4.34-4.77.01-.43.42-.89 1.33-1.01.45-.06 1.7-.11 3.12.54l.55-2.6A9.45 9.45 0 0 0 33.66.8c-3.3 0-5.63 1.76-5.65 4.27-.03 1.86 1.66 2.89 2.92 3.51 1.3.63 1.74 1.04 1.73 1.61-.01.87-1.04 1.27-2 1.28-1.68.02-2.65-.25-4.08-.88l-.57 2.69c.75.34 2.13.64 3.57.66 3.5 0 5.78-1.73 5.8-4.41zM11.66 1.34L7.54 12.31l-.44-2.22c-.75-2.58-3.09-5.38-5.71-6.77l3.05 11.34h3.65l5.43-13.32H11.66z"
          fill="#1A1F71"
        />
        <path d="M4.62 1.34H.02L0 1.55c4.01 1.02 6.66 3.49 7.75 6.44l-1.12-5.7c-.19-.74-.74-.93-1.42-.95H4.62v.01z" fill="#F7B600" />
      </svg>
    </div>
  )
}

function MastercardBadge() {
  return (
    <div className="flex h-11 w-20 items-center justify-center rounded-xl border border-slate-200 bg-white px-2 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md dark:border-navy-700 dark:bg-navy-900">
      <svg className="h-6 w-auto" viewBox="0 0 36 24" fill="none">
        <circle cx="13" cy="12" r="9" fill="#EB001B" />
        <circle cx="23" cy="12" r="9" fill="#F79E1B" fillOpacity="0.9" />
      </svg>
    </div>
  )
}

function VnPayBadge() {
  return (
    <div className="flex h-11 w-20 items-center justify-center rounded-xl border border-blue-200 bg-white px-1.5 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md dark:border-navy-700 dark:bg-navy-900">
      <div className="flex items-center text-xs font-black tracking-tight">
        <span className="text-[#005BAA]">VN</span>
        <span className="text-[#ED1C24]">PAY</span>
      </div>
    </div>
  )
}

function MoMoBadge() {
  return (
    <div className="flex h-11 w-20 items-center justify-center rounded-xl border border-pink-300 bg-gradient-to-br from-pink-500 to-[#A50064] text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md">
      <span className="font-mono text-sm font-extrabold uppercase tracking-tight text-white">
        mo<span className="underline decoration-white decoration-2">mo</span>
      </span>
    </div>
  )
}

function JcbBadge() {
  return (
    <div className="flex h-11 w-20 items-center justify-center rounded-xl border border-slate-200 bg-white px-2 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md dark:border-navy-700 dark:bg-navy-900">
      <div className="flex items-center gap-0.5">
        <span className="h-4 w-2 rounded-sm bg-[#0E4294]" />
        <span className="h-4 w-2 rounded-sm bg-[#EE1C25]" />
        <span className="h-4 w-2 rounded-sm bg-[#008938]" />
        <span className="ml-1 text-[11px] font-black text-navy-950 dark:text-white">JCB</span>
      </div>
    </div>
  )
}

function NapasBadge() {
  return (
    <div className="flex h-11 w-20 items-center justify-center rounded-xl border border-cyan-200 bg-white px-2 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md dark:border-navy-700 dark:bg-navy-900">
      <span className="text-[11px] font-black tracking-wider text-[#0082C8] dark:text-cyan-400">
        NAPAS
      </span>
    </div>
  )
}

function ApplePayBadge() {
  return (
    <div className="flex h-11 w-20 items-center justify-center rounded-xl border border-slate-200 bg-white px-2 text-navy-950 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md dark:border-navy-700 dark:bg-navy-900 dark:text-white">
      <span className="text-xs font-bold tracking-tight"> Pay</span>
    </div>
  )
}

function GooglePayBadge() {
  return (
    <div className="flex h-11 w-20 items-center justify-center rounded-xl border border-slate-200 bg-white px-2 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md dark:border-navy-700 dark:bg-navy-900">
      <span className="text-xs font-bold text-slate-800 dark:text-white">
        <span className="text-blue-500">G</span>Pay
      </span>
    </div>
  )
}

function KhqrBadge() {
  return (
    <div className="flex h-11 w-20 items-center justify-center rounded-xl border border-red-200 bg-[#E11925] px-2 text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md">
      <span className="text-[11px] font-black tracking-widest uppercase">
        KHQR
      </span>
    </div>
  )
}

export default function Footer() {
  const { t } = useLanguage()
  const { currency } = useCurrency()
  const [subscribedEmail, setSubscribedEmail] = useState('')
  const [subscribedDone, setSubscribedDone] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!subscribedEmail) return
    setSubscribedDone(true)
    setTimeout(() => {
      setSubscribedEmail('')
      setSubscribedDone(false)
    }, 4000)
  }

  const socialLinks = [
    {
      name: 'Facebook',
      handle: '@AeroSmartAviation',
      href: 'https://facebook.com',
      icon: FacebookIcon,
      hoverClass: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
      color: 'text-[#1877F2]',
    },
    {
      name: 'YouTube',
      handle: 'AeroSmart Official',
      href: 'https://youtube.com',
      icon: YoutubeIcon,
      hoverClass: 'hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]',
      color: 'text-[#FF0000]',
    },
    {
      name: 'LINE',
      handle: '@aerosmart_vn',
      href: 'https://line.me',
      icon: LineIcon,
      hoverClass: 'hover:bg-[#06C755] hover:text-white hover:border-[#06C755]',
      color: 'text-[#06C755]',
    },
    {
      name: 'Telegram',
      handle: '@aerosmart_bot',
      href: 'https://t.me',
      icon: TelegramIcon,
      hoverClass: 'hover:bg-[#229ED9] hover:text-white hover:border-[#229ED9]',
      color: 'text-[#229ED9]',
    },
    {
      name: 'Zalo OA',
      handle: 'AeroSmart Booking',
      href: 'https://zalo.me',
      icon: ZaloIcon,
      hoverClass: 'hover:bg-[#0068FF] hover:text-white hover:border-[#0068FF]',
      color: 'text-[#0068FF]',
    },
  ]

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 transition-colors duration-200 dark:border-navy-800 dark:bg-navy-950 dark:text-slate-400">
      {/* 1. Newsletter / Deal Alerts Banner */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-cyan-50/40 to-slate-50 px-4 py-8 dark:border-navy-850 dark:from-navy-900/90 dark:via-navy-900/60 dark:to-navy-950 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t('footer.dealBadge')}</span>
            </div>
            <h3 className="text-lg font-bold text-navy-950 dark:text-white sm:text-xl">
              {t('footer.dealTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('footer.dealDesc')}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubscribe}
            className="flex w-full max-w-md items-center gap-2"
          >
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={subscribedEmail}
                onChange={(e) => setSubscribedEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder')}
                className="input pl-10 text-xs shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="btn-primary flex items-center gap-1.5 whitespace-nowrap py-2.5 px-4 text-xs font-bold shadow-md"
            >
              {subscribedDone ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>{t('footer.subscribed')}</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>{t('footer.subscribe')}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* 3. Main Footer Matrix */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 mb-12">
          {/* Column 1: Brand & Social Media Ecosystem */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex flex-col justify-center">
              <span className="text-2xl font-black tracking-tight text-navy-950 dark:text-white">
                Aero<span className="text-cyan-600 dark:text-cyan-400">Smart</span>
              </span>
            </div>

            <p className="max-w-sm text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {t('footer.brandDesc')}
            </p>

            {/* Live Telemetry Pill */}
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-navy-700 dark:bg-navy-900 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('brand.sla')}</span>
            </div>

            {/* Social & Chat Buttons */}
            <div className="pt-2">
              <span className="mb-2.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('footer.channelsTitle')}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {socialLinks.map((s) => {
                  const Icon = s.icon
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${s.name} Official Channel: ${s.handle}`}
                      className={`group flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition-all dark:border-navy-700 dark:bg-navy-900 dark:text-slate-300 ${s.hoverClass}`}
                    >
                      <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                      <span className="text-[11px]">{s.name}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Column 2: 24/7 Direct Contact & Support Hotline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white">
              {t('footer.contactTitle')}
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400 mt-0.5" />
                <div>
                  <span className="block font-bold text-navy-900 dark:text-white">{t('footer.hotline')}</span>
                  <a
                    href="tel:19006868"
                    className="font-mono font-bold text-cyan-700 dark:text-cyan-300 hover:underline"
                  >
                    1900 6868 (Vietnam)
                  </a>
                  <span className="block font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    +855 23 999 888 (Cambodia)
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400 mt-0.5" />
                <div>
                  <span className="block font-bold text-navy-900 dark:text-white">{t('footer.emailDesk')}</span>
                  <a
                    href="mailto:support@aerosmart.com"
                    className="text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-300"
                  >
                    support@aerosmart.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400 mt-0.5" />
                <div>
                  <span className="block font-bold text-navy-900 dark:text-white">{t('footer.headquarters')}</span>
                  <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {t('footer.hqAddress')}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Flight Network & Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white">
              {t('footer.flightNetwork')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/flights?origin=HAN&destination=SGN" className="hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1">
                  <span>Hanoi (HAN) ⇄ Ho Chi Minh (SGN)</span>
                </Link>
              </li>
              <li>
                <Link to="/flights?origin=DAD&destination=HAN" className="hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1">
                  <span>Da Nang (DAD) ⇄ Hanoi (HAN)</span>
                </Link>
              </li>
              <li>
                <Link to="/flights?origin=PQC&destination=SGN" className="hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1">
                  <span>Phu Quoc (PQC) ⇄ Ho Chi Minh (SGN)</span>
                </Link>
              </li>
              <li>
                <Link to="/flights?origin=CXR&destination=HAN" className="hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1">
                  <span>Cam Ranh Nha Trang (CXR) ⇄ HAN</span>
                </Link>
              </li>
              <li>
                <Link to="/flights?origin=HAN&destination=SIN" className="hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1">
                  <span>Singapore Changi (SIN) & Bangkok (BKK)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Passenger Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white">
              {t('footer.passengerServices')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/my-bookings" className="hover:text-cyan-600 dark:hover:text-cyan-400">
                  {t('footer.onlineCheckIn')}
                </Link>
              </li>
              <li>
                <Link to="/flights" className="hover:text-cyan-600 dark:hover:text-cyan-400">
                  {t('footer.realtimeLock')}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-cyan-600 dark:hover:text-cyan-400">
                  {t('footer.adminConsole')}
                </Link>
              </li>
              <li>
                <span className="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer">
                  {t('footer.baggageRules')}
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer">
                  {t('footer.rights')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Payment Gateways & Banking Partners */}
        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 dark:border-navy-800 dark:bg-navy-900/60 mb-10 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white">
                  {t('footer.paymentMethodsTitle')}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t('footer.paymentMethodsSubtitle')}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Lock className="h-3.5 w-3.5" />
              <span>{t('footer.encryption')}</span>
            </div>
          </div>

          {/* Payment Badges Grid */}
          <div className="flex flex-wrap items-center gap-3">
            <VisaBadge />
            <MastercardBadge />
            <VnPayBadge />
            <MoMoBadge />
            <JcbBadge />
            <NapasBadge />
            <ApplePayBadge />
            <GooglePayBadge />
            <KhqrBadge />
          </div>
        </div>

        {/* 5. Bottom Copyright, Legal & Metadata */}
        <div className="border-t border-slate-200 pt-6 dark:border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>{t('footer.copyright').replace('{year}', new Date().getFullYear())}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer">
              {t('footer.carriage')}
            </span>
            <span>·</span>
            <span className="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer">
              {t('footer.privacy')}
            </span>
            <span>·</span>
            <span className="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer">
              {t('footer.baggageGuide')}
            </span>
            <span>·</span>
            <span className="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer">
              {t('footer.security')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
