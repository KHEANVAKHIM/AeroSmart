import React from 'react'

// Home Page Luxury Components
import FlightSearchHero from '../components/customer/FlightSearchHero'
import FlashSaleBanner from '../components/customer/FlashSaleBanner'
import PopularFlightsNearYou from '../components/customer/PopularFlightsNearYou'
import ExploreByCountry from '../components/customer/ExploreByCountry'
import ServicesShowcaseSection from '../components/customer/ServicesShowcaseSection'
import CabinExperienceShowcase from '../components/customer/CabinExperienceShowcase'
import CustomerReviewsCarousel from '../components/customer/CustomerReviewsCarousel'
import LoyaltyRewardsBanner from '../components/customer/LoyaltyRewardsBanner'

export default function HomePage() {
  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. Hero Search Section (Booking.com Signature Blue Banner) */}
      <section className="relative overflow-hidden bg-[#003580] px-4 pt-10 pb-20 sm:px-6 lg:px-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        <FlightSearchHero />
      </section>

      {/* 2. Flash Sale Promo Deals with Countdown */}
      <FlashSaleBanner />

      {/* 3. Popular Flights Near You (Booking.com Visual Destination Carousel) */}
      <PopularFlightsNearYou />

      {/* 4. Explore By Country (Destination Photo Hub) */}
      <ExploreByCountry />

      {/* 5. Airline Ancillary Services & Extras Showcase (Lounges, Chauffeurs, Sky Dining, Fast-Track, Insurance, Hotels) */}
      <ServicesShowcaseSection />

      {/* 6. Fleet & Cabin Experience Showcase (First / Business / Premium / Economy) */}
      <CabinExperienceShowcase />

      {/* 7. Verified Traveler Reviews & Testimonials Carousel */}
      <CustomerReviewsCarousel />

      {/* 8. AeroSmart Club Loyalty Rewards & Mobile App QR Download */}
      <LoyaltyRewardsBanner />
    </div>
  )
}

