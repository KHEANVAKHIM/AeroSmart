import { BOOKING_STATUS, FLIGHT_STATUS } from './constants'

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 0,
})

/** 1890000 -> "1.890.000 ₫" */
export function formatVND(amount, { withSymbol = true } = {}) {
  const value = Number(amount)
  if (!Number.isFinite(value)) return withSymbol ? '0 ₫' : '0'
  const formatted = vndFormatter.format(Math.round(value))
  return withSymbol ? `${formatted} ₫` : formatted
}

/**
 * Backend sends ISO-8601 without a timezone (`2026-09-05T08:30:00`), which JS
 * parses as local time — exactly what we want for displaying local schedules.
 */
export function parseDate(value) {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const pad = (n) => String(n).padStart(2, '0')

/** "08:30" */
export function formatTime(value) {
  const date = parseDate(value)
  if (!date) return '--:--'
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** "Sat, 05 Sep 2026" */
export function formatDate(value) {
  const date = parseDate(value)
  if (!date) return '—'
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** "05 Sep 2026 · 08:30" */
export function formatDateTime(value) {
  const date = parseDate(value)
  if (!date) return '—'
  const day = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  return `${day} · ${formatTime(date)}`
}

/** Date -> "2026-09-05" for API params and <input type="date"> */
export function toDateInputValue(value) {
  const date = parseDate(value)
  if (!date) return ''
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayInputValue() {
  return toDateInputValue(new Date())
}

/** 130 -> "2h 10m" */
export function formatDuration(minutes) {
  const total = Number(minutes)
  if (!Number.isFinite(total) || total <= 0) return '—'
  const h = Math.floor(total / 60)
  const m = Math.round(total % 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/** 0 -> "Non-stop", 1 -> "1 stop", 2 -> "2 stops" */
export function formatStops(stops) {
  const n = Number(stops) || 0
  if (n <= 0) return 'Non-stop'
  return n === 1 ? '1 stop' : `${n} stops`
}

export function flightStatusColor(status) {
  return FLIGHT_STATUS[status]?.badge || 'bg-slate-100 text-slate-700 border-slate-200'
}

export function flightStatusLabel(status) {
  return FLIGHT_STATUS[status]?.label || status || 'Unknown'
}

export function bookingStatusColor(status) {
  return BOOKING_STATUS[status]?.badge || 'bg-slate-100 text-slate-700 border-slate-200'
}

export function bookingStatusLabel(status) {
  return BOOKING_STATUS[status]?.label || status || 'Unknown'
}

export function bookingStatusDot(status) {
  return BOOKING_STATUS[status]?.dot || 'bg-slate-400'
}

/** Generic helper kept for convenience: resolves either status family. */
export function statusColor(status) {
  return FLIGHT_STATUS[status]?.badge || bookingStatusColor(status)
}

/** "Nguyen Van An" -> "NA" */
export function initialsOf(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** "ROLE_ADMIN" -> "Admin" */
export function roleLabel(role) {
  if (!role) return 'Guest'
  return role === 'ROLE_ADMIN' ? 'Admin' : 'Passenger'
}

export function formatAirportLabel(airport) {
  if (!airport) return ''
  return `${airport.code} — ${airport.city}, ${airport.country}`
}
