import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail,
  Lock,
  User,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { extractErrorMessage } from '../api/client'
import {
  GoogleGlyph,
  FacebookGlyph,
  AppleGlyph,
  WeChatGlyph,
} from '../components/auth/AuthModal'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loginWithSocial } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successToast, setSuccessToast] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const user = await register(fullName, email, password)
      setSuccessToast(`Welcome to AeroSmart, ${user.fullName}! Account created successfully.`)
      setTimeout(() => {
        navigate('/')
      }, 800)
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to create account. Please check inputs.'))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError(null)

    try {
      const mockGoogleUser = {
        provider: 'GOOGLE',
        providerId: 'google_' + Math.floor(Math.random() * 1000000000),
        email: 'passenger.google' + Math.floor(Math.random() * 1000) + '@aerosmart.com',
        fullName: 'Google Traveler',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop',
      }

      const user = await loginWithSocial(mockGoogleUser)
      setSuccessToast(`Google Sign-In successful! Welcome, ${user.fullName}!`)
      setTimeout(() => {
        navigate('/')
      }, 800)
    } catch (err) {
      setError(extractErrorMessage(err, 'Google sign up failed.'))
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
      setSuccessToast(`Facebook sign-up successful! Welcome, ${user.fullName}!`)
      setTimeout(() => {
        navigate('/')
      }, 800)
    } catch (err) {
      setError(extractErrorMessage(err, 'Facebook sign up failed.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-100 dark:bg-navy-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="w-full max-w-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <Link to="/" className="inline-flex items-center">
            <span className="text-3xl font-black text-[#003580] dark:text-white">
              Aero<span className="text-[#006ce4]">Smart</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Create your passenger account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign up with Google, Facebook, or your email address
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:border-navy-800 dark:bg-navy-900 space-y-5 transition-colors">
          {successToast && (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-300 p-3.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{successToast}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Social Sign Up Section */}
          <div className="space-y-2.5">
            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#2872FA] hover:bg-[#1f63e0] py-3 px-4 text-sm font-bold text-white shadow-md transition-all active:scale-[0.99]"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white p-0.5 shadow-sm">
                <GoogleGlyph className="h-4 w-4" />
              </div>
              <span>Sign up with Google</span>
            </button>

            {/* Continue with Facebook */}
            <button
              type="button"
              onClick={handleFacebookSignUp}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-navy-700 dark:bg-navy-800 dark:hover:bg-navy-750 py-2.5 px-4 text-sm font-bold text-slate-800 dark:text-white shadow-sm transition-all"
            >
              <FacebookGlyph className="h-5 w-5" />
              <span>Sign up with Facebook</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200 dark:border-navy-800" />
            <span className="absolute bg-white dark:bg-navy-900 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Or sign up with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Full Legal Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyen Van An"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 pl-10 text-sm text-slate-900 focus:border-[#2872FA] focus:bg-white focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-white"
                />
                <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 pl-10 text-sm text-slate-900 focus:border-[#2872FA] focus:bg-white focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-white"
                />
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 pl-10 text-sm text-slate-900 focus:border-[#2872FA] focus:bg-white focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-white"
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
              <Link to="/login" className="font-bold text-[#006ce4] dark:text-cyan-400 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
