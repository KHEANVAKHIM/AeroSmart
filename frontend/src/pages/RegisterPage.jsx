import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plane,
  Lock,
  Mail,
  User,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { extractErrorMessage } from '../api/client'

function FacebookGlyph({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function MessengerGlyph({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.082.3 2.235.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.26 5.888-3.26-6.559 6.963z" />
    </svg>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loginWithSocial } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [incomingMessage, setIncomingMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await register(fullName, email, password)
      navigate('/')
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to create account. Please check inputs.'))
    } finally {
      setLoading(false)
    }
  }

  const handleFacebookSignUp = async () => {
    setLoading(true)
    setError(null)

    try {
      const mockFbUser = {
        provider: 'FACEBOOK',
        providerId: 'fb_' + Math.floor(Math.random() * 1000000000),
        email: 'passenger.fb' + Math.floor(Math.random() * 1000) + '@aerosmart.com',
        fullName: 'Facebook Passenger',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop',
      }

      const user = await loginWithSocial(mockFbUser)

      setIncomingMessage({
        sender: 'Facebook Messenger',
        body: `Welcome to AeroSmart, ${user.fullName}! Your passenger profile has been initialized.`,
      })

      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      setError(extractErrorMessage(err, 'Facebook sign up failed.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-navy-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center">
            <span className="text-3xl font-black text-navy-950 dark:text-white">
              Aero<span className="text-cyan-600 dark:text-cyan-400">Smart</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-navy-900 dark:text-white">Create your passenger account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign up with Email or connect via Facebook
          </p>
        </div>

        {/* Incoming Messenger Notification Simulation */}
        {incomingMessage && (
          <div className="rounded-2xl border border-cyan-300 bg-cyan-50 dark:border-cyan-700 dark:bg-cyan-950/80 p-4 shadow-lg animate-bounce-in relative">
            <button
              type="button"
              onClick={() => setIncomingMessage(null)}
              className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1877F2] text-white">
                <MessengerGlyph className="h-5 w-5" />
              </div>
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-navy-950 dark:text-white">
                  <span>{incomingMessage.sender}</span>
                  <span className="text-[10px] rounded-full bg-cyan-200 dark:bg-cyan-900 px-1.5 py-0.2 text-cyan-900 dark:text-cyan-200">
                    Just now
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  {incomingMessage.body}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md dark:border-navy-800 dark:bg-navy-900 space-y-5 transition-colors">
          {/* 1-Click Facebook Sign Up */}
          <button
            type="button"
            onClick={handleFacebookSignUp}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#1877F2] py-2.5 px-4 text-xs font-bold text-white shadow-md hover:bg-[#166fe5] transition-all"
          >
            <FacebookGlyph className="h-4 w-4" />
            <span>Sign up with Facebook</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200 dark:border-navy-800" />
            <span className="absolute bg-white dark:bg-navy-900 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Or with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Legal Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyen Van An"
                  className="input pl-10"
                />
                <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input pl-10"
                />
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="label">Password (min 6 characters)</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10"
                />
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-sm font-bold shadow-lg shadow-cyan-500/20 mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
