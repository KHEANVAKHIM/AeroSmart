import axios from 'axios'

export const TOKEN_KEY = 'aerosmart_token'
export const USER_KEY = 'aerosmart_user'

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

/** Requests that must never trigger the global 401 -> /login redirect. */
const AUTH_ENTRY_PATHS = ['/auth/login', '/auth/register']

const isAuthEntry = (url = '') => AUTH_ENTRY_PATHS.some((p) => url.includes(p))

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const url = error?.config?.url || ''

    if (status === 401 && !isAuthEntry(url)) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

/**
 * Pulls the human readable text out of the backend error envelope
 * `{timestamp,status,error,message,fieldErrors:{}}`.
 */
export function extractErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data
  if (!data) return error?.message || fallback
  if (typeof data === 'string') return data
  if (data.message) return data.message
  const fieldErrors = data.fieldErrors
  if (fieldErrors && typeof fieldErrors === 'object') {
    const first = Object.values(fieldErrors)[0]
    if (first) return String(first)
  }
  return data.error || fallback
}

export function extractFieldErrors(error) {
  const fieldErrors = error?.response?.data?.fieldErrors
  return fieldErrors && typeof fieldErrors === 'object' ? fieldErrors : {}
}

/* ------------------------------------------------------------------ auth */
export const authApi = {
  register: (payload) => client.post('/auth/register', payload).then((r) => r.data),
  login: (payload) => client.post('/auth/login', payload).then((r) => r.data),
  socialLogin: (payload) => client.post('/auth/social-login', payload).then((r) => r.data),
  sendCode: (payload) => client.post('/auth/send-code', payload).then((r) => r.data),
  verifyCode: (payload) => client.post('/auth/verify-code', payload).then((r) => r.data),
  me: () => client.get('/auth/me').then((r) => r.data),
}

/* --------------------------------------------------------------- flights */
export const flightApi = {
  search: (criteria) =>
    client
      .get('/flights/search', {
        params: {
          origin: criteria.origin,
          destination: criteria.destination,
          departureDate: criteria.departureDate,
          returnDate: criteria.returnDate || '',
          passengers: criteria.passengers || 1,
          tripType: criteria.tripType || 'ONE_WAY',
        },
      })
      .then((r) => r.data),
  getById: (id) => client.get(`/flights/${id}`).then((r) => r.data),
  getSeats: (id) => client.get(`/flights/${id}/seats`).then((r) => r.data),
  listAirports: () => client.get('/airports').then((r) => r.data),
}

/* -------------------------------------------------------------- bookings */
export const bookingApi = {
  holdSeat: (payload) => client.post('/bookings/hold-seat', payload).then((r) => r.data),
  confirm: (payload) => client.post('/bookings/confirm', payload).then((r) => r.data),
  myBookings: () => client.get('/bookings/my-bookings').then((r) => r.data),
  getByReference: (reference) => client.get(`/bookings/${reference}`).then((r) => r.data),
  cancel: (id) => client.post(`/bookings/${id}/cancel`).then((r) => r.data),
}

/* ----------------------------------------------------------------- ai */
export const aiApi = {
  chat: (payload) => client.post('/ai/chat', payload).then((r) => r.data),
}

/* ------------------------------------------------------- destinations */
export const destinationsApi = {
  listDeals: (params) => client.get('/destinations/deals', { params }).then((r) => r.data),
  listCountries: () => client.get('/destinations/countries').then((r) => r.data),
}

/* ----------------------------------------------------------------- admin */
export const adminApi = {
  stats: () => client.get('/admin/stats').then((r) => r.data),
  listFlights: (params) => client.get('/admin/flights', { params }).then((r) => r.data),
  createFlight: (payload) => client.post('/admin/flights', payload).then((r) => r.data),
  updateFlight: (id, payload) => client.put(`/admin/flights/${id}`, payload).then((r) => r.data),
  deleteFlight: (id) => client.delete(`/admin/flights/${id}`).then((r) => r.data),
  updateStatus: (id, status) =>
    client.patch(`/admin/flights/${id}/status`, { status }).then((r) => r.data),
  listBookings: (params) => client.get('/admin/bookings', { params }).then((r) => r.data),
  cancelBooking: (id) => client.post(`/admin/bookings/${id}/cancel`).then((r) => r.data),
  manifest: (flightId) => client.get(`/admin/flights/${flightId}/manifest`).then((r) => r.data),
  listAirports: () => client.get('/admin/airports').then((r) => r.data),
  createAirport: (payload) => client.post('/admin/airports', payload).then((r) => r.data),
  updateAirport: (code, payload) => client.put(`/admin/airports/${code}`, payload).then((r) => r.data),
  deleteAirport: (code) => client.delete(`/admin/airports/${code}`).then((r) => r.data),
  listDestinationDeals: () => client.get('/admin/destination-deals').then((r) => r.data),
  createDestinationDeal: (payload) => client.post('/admin/destination-deals', payload).then((r) => r.data),
  updateDestinationDeal: (id, payload) => client.put(`/admin/destination-deals/${id}`, payload).then((r) => r.data),
  toggleDestinationDeal: (id) => client.patch(`/admin/destination-deals/${id}/toggle`).then((r) => r.data),
  deleteDestinationDeal: (id) => client.delete(`/admin/destination-deals/${id}`).then((r) => r.data),
  listCountries: () => client.get('/admin/countries').then((r) => r.data),
  createCountry: (payload) => client.post('/admin/countries', payload).then((r) => r.data),
  updateCountry: (id, payload) => client.put(`/admin/countries/${id}`, payload).then((r) => r.data),
  toggleCountry: (id) => client.patch(`/admin/countries/${id}/toggle`).then((r) => r.data),
  deleteCountry: (id) => client.delete(`/admin/countries/${id}`).then((r) => r.data),
}

export default client

