import { useState } from 'react'
import {
  Activity,
  Server,
  Database,
  Lock,
  Cpu,
  Radio,
  CheckCircle2,
  RefreshCw,
  Zap,
} from 'lucide-react'

export default function AdminTelemetryPage() {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950">System Telemetry & Concurrency</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status of distributed seat locking, Redis cluster latency, and database health.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="btn-outline py-2 px-3 text-xs font-bold flex items-center gap-1.5 self-start"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Cluster Nodes & Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card p-6 rounded-3xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Redis Distributed Lock
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
              <Lock className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-lg font-bold text-navy-950">Active Redisson Engine</span>
          </div>
          <div className="mt-4 space-y-1.5 text-xs text-slate-500 font-mono">
            <p>Key Pattern: seat:lock:&#123;id&#125;:&#123;seat&#125;</p>
            <p>TTL Window: 15 minutes (900s)</p>
            <p>Sweep Frequency: 60 seconds</p>
          </div>
        </div>

        <div className="card p-6 rounded-3xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              PostgreSQL Database
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              <Database className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-lg font-bold text-navy-950">HikariCP Pool Healthy</span>
          </div>
          <div className="mt-4 space-y-1.5 text-xs text-slate-500 font-mono">
            <p>Target: aerosmart_db (Port 5432)</p>
            <p>Batch Size: 50 inserts/sec</p>
            <p>Dialect: PostgreSQL 16</p>
          </div>
        </div>

        <div className="card p-6 rounded-3xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              AI Concierge Core
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <Cpu className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-lg font-bold text-navy-950">AeroMate Tool Runner</span>
          </div>
          <div className="mt-4 space-y-1.5 text-xs text-slate-500 font-mono">
            <p>Tools: searchFlights, checkStatus</p>
            <p>Response Latency: &lt; 25ms</p>
            <p>Status: Ready 24/7</p>
          </div>
        </div>
      </div>

      {/* Concurrency Architecture Showcase */}
      <div className="rounded-3xl border border-navy-800 bg-navy-950 p-6 sm:p-8 text-white">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Zap className="h-5 w-5 text-cyan-400" />
          <span>Distributed Concurrency Control Architecture</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6 max-w-3xl">
          To prevent double booking under high flight booking traffic, AeroSmart coordinates seat allocation across two coordinated layers:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-2xl border border-navy-800 bg-navy-900/90 p-4 space-y-2">
            <span className="font-bold text-cyan-400 block text-sm">1. Redis Lock Acquisition</span>
            <p className="text-slate-300 leading-relaxed">
              When a customer selects a seat, a distributed lock with key <code className="text-cyan-300 font-mono">seat:lock:&#123;flightId&#125;:&#123;seatNumber&#125;</code> is acquired via Redisson with a 15-minute TTL.
            </p>
          </div>

          <div className="rounded-2xl border border-navy-800 bg-navy-900/90 p-4 space-y-2">
            <span className="font-bold text-cyan-400 block text-sm">2. State Machine Transition</span>
            <p className="text-slate-300 leading-relaxed">
              The booking transitions from <code className="text-amber-300">PENDING</code> to <code className="text-amber-300">SEAT_HELD</code>, setting the seat status in the database to <code className="text-amber-300">HELD</code>.
            </p>
          </div>

          <div className="rounded-2xl border border-navy-800 bg-navy-900/90 p-4 space-y-2">
            <span className="font-bold text-cyan-400 block text-sm">3. Eviction & Settlement</span>
            <p className="text-slate-300 leading-relaxed">
              Upon successful payment via VNPay/MoMo, status becomes <code className="text-emerald-400">CONFIRMED</code>. If the timer lapses without payment, the scheduled eviction sweeper automatically releases the lock.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
