import { useNavigate } from 'react-router-dom'
import {
  Plane,
  ShieldCheck,
  Sparkles,
  Clock,
  ArrowRight,
  Armchair,
  CheckCircle,
  CreditCard,
  Zap,
} from 'lucide-react'
import FlightSearchHero from '../components/customer/FlightSearchHero'
import PopularFlightsNearYou from '../components/customer/PopularFlightsNearYou'
import ExploreByCountry from '../components/customer/ExploreByCountry'
import { useLanguage } from '../context/LanguageContext'

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with Search (Booking.com signature Blue Banner) */}
      <section className="relative overflow-hidden bg-[#003580] px-4 pt-10 pb-20 sm:px-6 lg:px-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        <FlightSearchHero />
      </section>

      {/* Popular Flights Near You (Booking.com Visual Destination Carousel) */}
      <PopularFlightsNearYou />

      {/* Explore By Country (Booking.com signature Country Photos Carousel) */}
      <ExploreByCountry />

      {/* Value Pillars Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#00224f] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-blue-900/60">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#006ce4]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#006ce4]/20 text-sky-300 border border-sky-400/30">
                <Clock className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-bold text-white">{t('home.pillar1Title')}</h3>
              <p className="text-xs leading-relaxed text-slate-300">
                {t('home.pillar1Desc')}
              </p>
            </div>

            <div className="space-y-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                <Armchair className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-bold text-white">{t('home.pillar2Title')}</h3>
              <p className="text-xs leading-relaxed text-slate-300">
                {t('home.pillar2Desc')}
              </p>
            </div>

            <div className="space-y-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                <Sparkles className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-bold text-white">{t('home.pillar3Title')}</h3>
              <p className="text-xs leading-relaxed text-slate-300">
                {t('home.pillar3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
