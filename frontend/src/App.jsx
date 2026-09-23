import { Routes, Route, Navigate } from 'react-router-dom'
import CustomerLayout from './components/layout/CustomerLayout'
import AdminLayout from './components/layout/AdminLayout'

// Customer Core Pages
import HomePage from './pages/HomePage'
import FlightSearchPage from './pages/FlightSearchPage'
import SeatSelectionPage from './pages/SeatSelectionPage'
import CheckoutPage from './pages/CheckoutPage'
import BookingSuccessPage from './pages/BookingSuccessPage'
import MyBookingsPage from './pages/MyBookingsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AccountPage from './pages/AccountPage'
import CheckInPage from './pages/CheckInPage'

// Product Specific Booking Pages
import StaysPage from './pages/StaysPage'
import FlightHotelPage from './pages/FlightHotelPage'
import CarRentalPage from './pages/CarRentalPage'
import AttractionsPage from './pages/AttractionsPage'
import AirportTaxisPage from './pages/AirportTaxisPage'

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminFlightsPage from './pages/admin/AdminFlightsPage'
import AdminBookingsPage from './pages/admin/AdminBookingsPage'
import AdminAirportsPage from './pages/admin/AdminAirportsPage'
import AdminDestinationsPage from './pages/admin/AdminDestinationsPage'
import AdminTelemetryPage from './pages/admin/AdminTelemetryPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminServicesPage from './pages/admin/AdminServicesPage'

export default function App() {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/flights" element={<FlightSearchPage />} />
        <Route path="/flights/:id/seats" element={<SeatSelectionPage />} />
        
        {/* Product Navigation Pages */}
        <Route path="/stays" element={<StaysPage />} />
        <Route path="/flight-hotel" element={<FlightHotelPage />} />
        <Route path="/packages" element={<FlightHotelPage />} />
        <Route path="/car-rental" element={<CarRentalPage />} />
        <Route path="/cars" element={<CarRentalPage />} />
        <Route path="/attractions" element={<AttractionsPage />} />
        <Route path="/airport-taxis" element={<AirportTaxisPage />} />
        <Route path="/taxis" element={<AirportTaxisPage />} />

        {/* Booking & User Flows */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkin" element={<CheckInPage />} />
        <Route path="/booking-success/:reference" element={<BookingSuccessPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/profile" element={<AccountPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="flights" element={<AdminFlightsPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="airports" element={<AdminAirportsPage />} />
        <Route path="destinations" element={<AdminDestinationsPage />} />
        <Route path="telemetry" element={<AdminTelemetryPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
