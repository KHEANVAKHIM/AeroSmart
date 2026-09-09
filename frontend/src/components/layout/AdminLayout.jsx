import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import AdminSidebar from '../admin/AdminSidebar'
import AdminTopbar from '../admin/AdminTopbar'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-navy-950 text-white">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent mx-auto"></div>
          <p className="text-sm font-semibold tracking-wide text-cyan-200">Authenticating Operations Console...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          collapsed ? 'lg:pl-[76px]' : 'lg:pl-64'
        }`}
      >
        <AdminTopbar onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="flex-1 bg-white p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Bottom Blue Footer Bar */}
        <footer className="mt-auto border-t border-blue-900/30 bg-[#003580] px-4 sm:px-8 py-3.5 text-white shadow-inner">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-white tracking-wide">AeroSmart Operations Console</span>
              <span className="hidden md:inline text-sky-200/80">· Real-time Flight & Hub Control</span>
            </div>
            <div className="text-[11px] text-sky-200/90 font-medium">
              © {new Date().getFullYear()} AeroSmart Network · 24/7 Multi-Hub Synchronization
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
