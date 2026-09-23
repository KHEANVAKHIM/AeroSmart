export const TRIP_TYPES = {
  ONE_WAY: 'ONE_WAY',
  ROUND_TRIP: 'ROUND_TRIP',
}

export const SEAT_CLASSES = {
  ECONOMY: {
    key: 'ECONOMY',
    label: 'Economy',
    short: 'ECO',
    description: 'Standard legroom, 1 cabin bag + 20kg checked',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  BUSINESS: {
    key: 'BUSINESS',
    label: 'Business',
    short: 'BIZ',
    description: 'Lie-flat seat, lounge access, 2 × 32kg checked',
    badge: 'bg-accent-50 text-accent-700 border-accent-200',
  },
}

export const SEAT_STATUS = {
  AVAILABLE: 'AVAILABLE',
  HELD: 'HELD',
  BOOKED: 'BOOKED',
}

export const PAYMENT_METHODS = [
  {
    id: 'VIETQR',
    name: 'VietQR (Quét mã Napas 247)',
    tagline: 'Quét mã QR từ mọi App Ngân hàng',
    initials: 'QR',
    brandClass: 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white',
    ringClass: 'peer-checked:border-emerald-600 peer-checked:ring-emerald-600/30',
  },
  {
    id: 'VNPAY',
    name: 'VNPay',
    tagline: 'Bank transfer, ATM & QR',
    initials: 'VN',
    brandClass: 'bg-[#0d5cb6] text-white',
    ringClass: 'peer-checked:border-[#0d5cb6] peer-checked:ring-[#0d5cb6]/30',
  },
  {
    id: 'MOMO',
    name: 'MoMo',
    tagline: 'MoMo e-wallet balance',
    initials: 'MO',
    brandClass: 'bg-[#a50064] text-white',
    ringClass: 'peer-checked:border-[#a50064] peer-checked:ring-[#a50064]/30',
  },
]

export const BOOKING_STATUS = {
  PENDING: {
    label: 'Pending',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  },
  SEAT_HELD: {
    label: 'Seat held',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  CONFIRMED: {
    label: 'Confirmed',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  COMPLETED: {
    label: 'Completed',
    badge: 'bg-navy-50 text-navy-700 border-navy-200',
    dot: 'bg-navy-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
  EXPIRED: {
    label: 'Expired',
    badge: 'bg-slate-100 text-slate-500 border-slate-200',
    dot: 'bg-slate-400',
  },
}

export const FLIGHT_STATUS = {
  SCHEDULED: { label: 'Scheduled', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  DELAYED: { label: 'Delayed', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  COMPLETED: { label: 'Completed', badge: 'bg-navy-50 text-navy-700 border-navy-200' },
  CANCELLED: { label: 'Cancelled', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
}

export const DEPARTURE_BUCKETS = [
  { id: 'MORNING', label: 'Morning', range: '05:00 – 11:59', from: 5, to: 12 },
  { id: 'AFTERNOON', label: 'Afternoon', range: '12:00 – 17:59', from: 12, to: 18 },
  { id: 'EVENING', label: 'Evening', range: '18:00 – 22:59', from: 18, to: 23 },
  { id: 'NIGHT', label: 'Night', range: '23:00 – 04:59', from: 23, to: 5 },
]

export const SORT_OPTIONS = [
  { id: 'PRICE_ASC', label: 'Price — lowest first' },
  { id: 'PRICE_DESC', label: 'Price — highest first' },
  { id: 'DURATION_ASC', label: 'Duration — shortest first' },
  { id: 'DEPARTURE_ASC', label: 'Departure — earliest first' },
  { id: 'DEPARTURE_DESC', label: 'Departure — latest first' },
]

export const POPULAR_ROUTES = [
  { origin: 'HAN', destination: 'SGN', label: 'Hanoi → Ho Chi Minh City', fromPrice: 1290000 },
  { origin: 'SGN', destination: 'DAD', label: 'Ho Chi Minh City → Da Nang', fromPrice: 890000 },
  { origin: 'HAN', destination: 'DAD', label: 'Hanoi → Da Nang', fromPrice: 790000 },
  { origin: 'SGN', destination: 'PQC', label: 'Ho Chi Minh City → Phu Quoc', fromPrice: 990000 },
  { origin: 'HAN', destination: 'CXR', label: 'Hanoi → Nha Trang', fromPrice: 1190000 },
  { origin: 'DAD', destination: 'SGN', label: 'Da Nang → Ho Chi Minh City', fromPrice: 860000 },
]

export const MAX_PASSENGERS = 9
export const HOLD_MINUTES = 15
export const TAX_RATE = 0.1
