import { Outlet } from 'react-router-dom'
import Header from '../common/Header'
import Footer from './Footer'
import AeroMateWidget from '../customer/AeroMateWidget'

export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-navy-950 font-sans selection:bg-cyan-500 selection:text-navy-950 transition-colors duration-200 dark:bg-navy-950 dark:text-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AeroMateWidget />
    </div>
  )
}
