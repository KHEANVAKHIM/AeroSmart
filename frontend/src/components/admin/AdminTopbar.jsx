import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Search, Bell, Radio } from 'lucide-react'

const ROUTE_META = [
  { path: '/admin/flights', title: 'Flight Schedule', crumb: 'Flights' },
  { path: '/admin/bookings', title: 'Bookings & Manifests', crumb: 'Bookings' },
  { path: '/admin/telemetry', title: 'System Telemetry', crumb: 'Telemetry' },
  { path: '/admin', title: 'Dashboard', crumb: 'Dashboard' },
]

function metaFor(pathname) {
  return (
    ROUTE_META.find((m) => pathname === m.path || pathname.startsWith(`${m.path}/`)) ?? {
      title: 'Dashboard',
      crumb: 'Dashboard',
    }
  )
}

export default function AdminTopbar({ onOpenMobileNav }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [term, setTerm] = useState('')
  const [bellOpen, setBellOpen] = useState(false)
  const [bellSeen, setBellSeen] = useState(false)
  const bellRef = useRef(null)

  const meta = metaFor(location.pathname)

  useEffect(() => {
    if (!bellOpen) return undefined
    const onDocClick = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) setBellOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [bellOpen])

  const submitSearch = (event) => {
    event.preventDefault()
    const q = term.trim()
    if (!q) return
    const target = /^as-?\d/i.test(q) ? '/admin/flights' : '/admin/bookings'
    navigate(`${target}?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-navy-900 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-base font-bold text-navy-900 sm:text-lg">{meta.title}</h1>
          <nav aria-label="Breadcrumb" className="hidden sm:block">
            <ol className="flex items-center gap-1.5 text-xs text-slate-500">
              <li>Admin</li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-accent-600">{meta.crumb}</li>
            </ol>
          </nav>
        </div>

        <form onSubmit={submitSearch} className="ml-auto hidden md:block" role="search">
          <label className="relative block">
            <span className="sr-only">Search flights or bookings</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search flight no. or booking ref…"
              className="w-64 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-navy-900 outline-none transition focus:border-accent-500 focus:bg-white focus:ring-2 focus:ring-accent-500/25 lg:w-80"
            />
          </label>
        </form>

        <div className="relative ml-auto md:ml-0" ref={bellRef}>
          <button
            type="button"
            onClick={() => {
              setBellOpen((open) => !open)
              setBellSeen(true)
            }}
            className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-navy-900"
            aria-label="Notifications"
            aria-expanded={bellOpen}
          >
            <Bell className="h-5 w-5" />
            {!bellSeen && (
              <span
                className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"
                aria-hidden="true"
              />
            )}
          </button>
          {bellOpen && (
            <div className="absolute right-0 mt-2 w-72 animate-fade-in rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
              <p className="text-sm font-semibold text-navy-900">Notifications</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                You are all caught up. Operational alerts appear here when the ops event stream is connected.
              </p>
            </div>
          )}
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
          <Radio className="h-3 w-3 animate-pulse-soft" aria-hidden="true" />
          Live
        </span>
      </div>
    </header>
  )
}
