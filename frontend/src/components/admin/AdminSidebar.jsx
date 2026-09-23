import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  PlaneTakeoff,
  TicketCheck,
  Building2,
  Activity,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ArrowLeft,
  X,
  Plane,
  Image as ImageIcon,
  Users,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/flights', label: 'Flight Schedule', icon: PlaneTakeoff },
  { to: '/admin/bookings', label: 'Bookings & Manifests', icon: TicketCheck },
  { to: '/admin/services', label: 'Services & Ancillaries', icon: Sparkles },
  { to: '/admin/users', label: 'User & Accounts', icon: Users },
  { to: '/admin/airports', label: 'Airports & Hubs', icon: Building2 },
  { to: '/admin/destinations', label: 'Destinations & Photos', icon: ImageIcon },
  { to: '/admin/telemetry', label: 'System Telemetry', icon: Activity },
]

function initialsOf(user) {
  const source = user?.fullName || user?.name || user?.email || 'Admin'
  const parts = String(source).replace(/@.*$/, '').split(/[\s._-]+/).filter(Boolean)
  if (parts.length === 0) return 'AD'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function NavItem({ item, collapsed, onNavigate }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        [
          'group relative flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-all duration-200',
          collapsed ? 'justify-center px-0' : 'px-3',
          isActive
            ? 'bg-navy-800/80 text-white shadow-[0_0_18px_-6px_rgba(6,182,212,0.75)]'
            : 'text-navy-200/80 hover:bg-navy-800/50 hover:text-white',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <span
            aria-hidden="true"
            className={[
              'absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full bg-accent-500 transition-all duration-200',
              isActive ? 'h-7 w-[3px] opacity-100' : 'h-0 w-[3px] opacity-0',
            ].join(' ')}
          />
          <Icon
            className={[
              'h-5 w-5 shrink-0 transition-colors',
              isActive ? 'text-accent-400' : 'text-navy-300 group-hover:text-accent-300',
            ].join(' ')}
          />
          {!collapsed && <span className="truncate">{item.label}</span>}
          {collapsed && (
            <span className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-md bg-navy-950 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg ring-1 ring-white/10 group-hover:block">
              {item.label}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

export default function AdminSidebar({
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}) {
  const { user, logout } = useAuth() ?? {}

  const displayName = user?.fullName || user?.name || 'Administrator'
  const displayEmail = user?.email || 'admin@aerosmart.io'

  return (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/5 bg-navy-900 transition-all duration-300 ease-out',
        collapsed ? 'lg:w-[76px]' : 'lg:w-64',
        'w-72',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ].join(' ')}
      aria-label="Admin navigation"
    >
      <div className={['flex items-center gap-3 px-4 py-5', collapsed ? 'lg:justify-center lg:px-0' : ''].join(' ')}>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 to-accent-500 shadow-lg">
          <Plane className="h-5 w-5 -rotate-45 text-white" aria-hidden="true" />
        </span>
        {!collapsed && (
          <span className="min-w-0">
            <span className="block truncate text-base font-bold tracking-tight text-white">AeroSmart</span>
            <span className="block truncate text-[11px] font-medium uppercase tracking-[0.18em] text-accent-400">
              Operations Console
            </span>
          </span>
        )}
        <button
          type="button"
          onClick={onCloseMobile}
          className="ml-auto rounded-md p-1.5 text-navy-200 hover:bg-navy-800 hover:text-white lg:hidden"
          aria-label="Close navigation menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className={['flex-1 space-y-1 overflow-y-auto pb-4', collapsed ? 'lg:px-2' : 'px-3'].join(' ')}>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} item={item} collapsed={collapsed} onNavigate={onCloseMobile} />
        ))}
      </nav>

      <button
        type="button"
        onClick={onToggleCollapse}
        className="mx-3 mb-3 hidden items-center justify-center gap-2 rounded-lg border border-white/5 bg-navy-800/60 py-2 text-xs font-semibold text-navy-200 transition hover:bg-navy-800 hover:text-white lg:flex"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-pressed={collapsed}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        {!collapsed && <span>Collapse</span>}
      </button>

      <div className={['border-t border-sky-800/40 bg-[#00224f] py-4 shadow-inner', collapsed ? 'lg:px-2' : 'px-3'].join(' ')}>
        <div className={['flex items-center gap-3', collapsed ? 'lg:justify-center' : ''].join(' ')}>
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-500/15 text-xs font-bold text-accent-300 ring-1 ring-accent-500/30"
            aria-hidden="true"
          >
            {initialsOf(user)}
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-white">{displayName}</span>
              <span className="block truncate text-xs text-navy-300">{displayEmail}</span>
            </span>
          )}
        </div>

        <div className={['mt-3 space-y-1', collapsed ? 'lg:space-y-2' : ''].join(' ')}>
          <Link
            to="/"
            onClick={onCloseMobile}
            title={collapsed ? 'Back to site' : undefined}
            className={[
              'flex items-center gap-2 rounded-lg py-2 text-sm text-navy-200 transition hover:bg-navy-800/60 hover:text-white',
              collapsed ? 'lg:justify-center lg:px-0' : 'px-3',
            ].join(' ')}
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Back to site</span>}
          </Link>
          <button
            type="button"
            onClick={() => logout?.()}
            title={collapsed ? 'Logout' : undefined}
            className={[
              'flex w-full items-center gap-2 rounded-lg py-2 text-sm text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200',
              collapsed ? 'lg:justify-center lg:px-0' : 'px-3',
            ].join(' ')}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
