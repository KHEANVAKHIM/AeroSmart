import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  Mail,
  Lock,
  User,
  AlertCircle,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Smartphone,
  ArrowLeft,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { extractErrorMessage } from '../../api/client'

export function GoogleGlyph({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

export function FacebookGlyph({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export function AppleGlyph({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.98.6-2.61 1.34-.56.64-1.05 1.68-.92 2.71 1 .08 2.01-.48 2.61-1.2z" />
    </svg>
  )
}

export function WeChatGlyph({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#07C160">
      <path d="M8.691 2.188C3.891 2.188 0 5.478 0 9.534c0 2.212 1.17 4.195 3.003 5.517l-.767 2.302 2.757-1.378c1.13.332 2.348.517 3.614.517.159 0 .317-.003.475-.01-.318-.846-.49-1.761-.49-2.715 0-4.341 4.175-7.86 9.327-7.86.353 0 .701.018 1.045.051C17.65 4.607 13.528 2.188 8.691 2.188zm-2.22 3.892c.677 0 1.226.549 1.226 1.226 0 .678-.549 1.227-1.226 1.227-.678 0-1.227-.549-1.227-1.227 0-.677.549-1.226 1.227-1.226zm5.828 0c.678 0 1.227.549 1.227 1.226 0 .678-.549 1.227-1.226 1.227-.677 0-1.226-.549-1.226-1.227 0-.677.549-1.226 1.226-1.226zm6.368 4.417c-4.18 0-7.57 2.875-7.57 6.421 0 3.547 3.39 6.422 7.57 6.422 1.01 0 1.977-.168 2.868-.474l2.193 1.096-.61-1.832c1.472-1.077 2.404-2.673 2.404-4.455 0-3.546-3.39-6.421-7.57-6.421zm-2.839 3.424c.542 0 .981.439.981.982 0 .542-.439.981-.981.981-.542 0-.982-.439-.982-.981 0-.543.44-.982.982-.982zm4.908 0c.542 0 .981.439.981.982 0 .542-.439.981-.981.981-.542 0-.981-.439-.981-.981 0-.543.439-.982.981-.982z" />
    </svg>
  )
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'SIGNIN' }) {
  const navigate = useNavigate()
  const { login, register, loginWithSocial } = useAuth()

  // Tabs: 'SIGNIN' vs 'REGISTER'
  const [authTab, setAuthTab] = useState(defaultMode === 'REGISTER' ? 'REGISTER' : 'SIGNIN')

  // Sign-in sub-step: 'MAIN' vs 'PASSWORD'
  const [signInStep, setSignInStep] = useState('MAIN')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successToast, setSuccessToast] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setAuthTab(defaultMode === 'REGISTER' ? 'REGISTER' : 'SIGNIN')
      setSignInStep('MAIN')
      setError(null)
      setSuccessToast(null)
    }
  }, [isOpen, defaultMode])

  if (!isOpen) return null

  const handleClose = () => {
    setSignInStep('MAIN')
    setError(null)
    setEmail('')
    setPassword('')
    setFullName('')
    onClose()
  }

  // Continue with Email button click in Sign-In
  const handleEmailContinue = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    setError(null)
    setSignInStep('PASSWORD')
  }

  // Password Sign-In Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const loggedUser = await login(email, password)
      setSuccessToast(`Welcome back, ${loggedUser.fullName || 'Passenger'}!`)
      setTimeout(() => {
        handleClose()
        if (loggedUser.role === 'ROLE_ADMIN' || loggedUser.role === 'ADMIN') {
          navigate('/admin')
        }
      }, 700)
    } catch (err) {
      setError(extractErrorMessage(err, 'Invalid credentials. Please verify email and password.'))
    } finally {
      setLoading(false)
    }
  }

  // Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const newUser = await register(fullName, email, password)
      setSuccessToast(`Account created! Welcome to AeroSmart, ${newUser.fullName}!`)
      setTimeout(() => {
        handleClose()
      }, 700)
    } catch (err) {
      setError(extractErrorMessage(err, 'Registration failed. Please check inputs.'))
    } finally {
      setLoading(false)
    }
  }

  // Continue with Google
  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const googleUserPayload = {
        provider: 'GOOGLE',
        providerId: 'google_' + Math.floor(Math.random() * 1000000000),
        email: 'passenger.google@aerosmart.com',
        fullName: 'Google Traveler',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop',
      }
      const user = await loginWithSocial(googleUserPayload)
      setSuccessToast(`Google Sign-In successful! Welcome, ${user.fullName}!`)
      setTimeout(() => {
        handleClose()
      }, 700)
    } catch (err) {
      setError(extractErrorMessage(err, 'Google Sign-In failed.'))
    } finally {
      setLoading(false)
    }
  }

  // Continue with Facebook
  const handleFacebookSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const fbUserPayload = {
        provider: 'FACEBOOK',
        providerId: 'fb_1029384756',
        email: 'passenger.facebook@aerosmart.com',
        fullName: 'Facebook Traveler',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop',
      }
      const user = await loginWithSocial(fbUserPayload)
      setSuccessToast(`Facebook connected! Welcome, ${user.fullName}!`)
      setTimeout(() => {
        handleClose()
      }, 700)
    } catch (err) {
      setError(extractErrorMessage(err, 'Facebook Sign-In failed.'))
    } finally {
      setLoading(false)
    }
  }

  // Continue with Apple
  const handleAppleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const appleUserPayload = {
        provider: 'APPLE',
        providerId: 'apple_88337722',
        email: 'passenger.apple@aerosmart.com',
        fullName: 'Apple Traveler',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop',
      }
      const user = await loginWithSocial(appleUserPayload)
      setSuccessToast(`Apple Sign-In successful! Welcome, ${user.fullName}!`)
      setTimeout(() => {
        handleClose()
      }, 700)
    } catch (err) {
      setError(extractErrorMessage(err, 'Apple Sign-In failed.'))
    } finally {
      setLoading(false)
    }
  }

  // Continue with WeChat
  const handleWeChatSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const weChatPayload = {
        provider: 'WECHAT',
        providerId: 'wechat_55667788',
        email: 'passenger.wechat@aerosmart.com',
        fullName: 'WeChat Traveler',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop',
      }
      const user = await loginWithSocial(weChatPayload)
      setSuccessToast(`WeChat Sign-In successful! Welcome, ${user.fullName}!`)
      setTimeout(() => {
        handleClose()
      }, 700)
    } catch (err) {
      setError(extractErrorMessage(err, 'WeChat Sign-In failed.'))
    } finally {
      setLoading(false)
    }
  }

  // QR Code Instant Login
  const handleQrCodeLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const qrUserPayload = {
        provider: 'AEROSMART_APP_QR',
        providerId: 'qr_app_' + Date.now(),
        email: 'app.qr.user@aerosmart.com',
        fullName: 'AeroSmart Mobile Passenger',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop',
      }
      const user = await loginWithSocial(qrUserPayload)
      setSuccessToast(`QR Code Verified! Logged in via AeroSmart Mobile App.`)
      setTimeout(() => {
        handleClose()
      }, 700)
    } catch (err) {
      setError(extractErrorMessage(err, 'QR verification failed.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-3 sm:p-6 backdrop-blur-sm flex min-h-full items-center justify-center animate-fade-in">
      {/* Outer Modal Container with vertical centering and max-height scrolling */}
      <div className="relative my-auto flex w-full max-w-4xl max-h-[92vh] flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl transition-all dark:bg-navy-900 md:flex-row border border-slate-200 dark:border-navy-700">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 dark:bg-navy-800 dark:text-slate-400 dark:hover:bg-navy-700 dark:hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Section: Sign in / Register Form (Trip.com exact style) */}
        <div className="flex-1 p-5 sm:p-8 md:p-9 flex flex-col justify-between">
          <div>
            {/* Mode Switcher Tabs: Sign In vs Register */}
            <div className="mb-4 flex items-center gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-navy-950 w-full max-w-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('SIGNIN')
                  setSignInStep('MAIN')
                  setError(null)
                }}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                  authTab === 'SIGNIN'
                    ? 'bg-white text-navy-950 shadow-sm dark:bg-navy-800 dark:text-white'
                    : 'text-slate-500 hover:text-navy-900 dark:text-slate-400'
                }`}
              >
                Sign In (Đăng nhập)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('REGISTER')
                  setError(null)
                }}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                  authTab === 'REGISTER'
                    ? 'bg-white text-[#006ce4] shadow-sm dark:bg-navy-800 dark:text-cyan-300'
                    : 'text-slate-500 hover:text-navy-900 dark:text-slate-400'
                }`}
              >
                Register (Đăng ký)
              </button>
            </div>

            {/* Header Title */}
            <div className="mb-4">
              {authTab === 'SIGNIN' && signInStep === 'PASSWORD' && (
                <button
                  type="button"
                  onClick={() => {
                    setSignInStep('MAIN')
                    setError(null)
                  }}
                  className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to login options</span>
                </button>
              )}

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {authTab === 'REGISTER'
                  ? 'Create account'
                  : signInStep === 'PASSWORD'
                  ? 'Enter password'
                  : 'Sign in to AeroSmart'}
              </h2>

              {/* Badges / Perks */}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] text-amber-950 font-black">
                    T
                  </span>
                  Membership rewards
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-cyan-600 dark:text-cyan-400">📅</span>
                  Manage bookings with ease
                </span>
              </div>
            </div>

            {/* Success Toast */}
            {successToast && (
              <div className="mb-4 flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-300 p-3.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{successToast}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* ================= SIGN IN TAB ================= */}
            {authTab === 'SIGNIN' && (
              <>
                {signInStep === 'MAIN' ? (
                  <div className="space-y-3.5">
                    {/* Email Input + Continue with Email */}
                    <form onSubmit={handleEmailContinue} className="space-y-2.5">
                      <div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Please enter an email address"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-navy-700 dark:bg-navy-950 dark:text-white dark:placeholder:text-slate-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-2xl bg-slate-200 hover:bg-slate-300 dark:bg-navy-800 dark:hover:bg-navy-700 py-2.5 text-sm font-bold text-slate-800 dark:text-slate-200 transition-all shadow-sm"
                      >
                        Continue with email
                      </button>
                    </form>

                    {/* 'or' Separator */}
                    <div className="relative my-3 flex items-center justify-center">
                      <div className="w-full border-t border-slate-200 dark:border-navy-700" />
                      <span className="absolute bg-white px-3 text-xs font-medium text-slate-400 dark:bg-navy-900">
                        or
                      </span>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#2872FA] hover:bg-[#1f63e0] py-2.5 px-4 text-sm font-bold text-white shadow-md transition-all active:scale-[0.99]"
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white p-0.5">
                          <GoogleGlyph className="h-3.5 w-3.5" />
                        </div>
                        <span>Continue with Google</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleAppleSignIn}
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-navy-700 dark:bg-navy-800 dark:hover:bg-navy-750 py-2.5 px-4 text-sm font-bold text-slate-800 dark:text-white shadow-sm transition-all"
                      >
                        <AppleGlyph className="h-4 w-4 text-black dark:text-white" />
                        <span>Continue with Apple</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleFacebookSignIn}
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-navy-700 dark:bg-navy-800 dark:hover:bg-navy-750 py-2.5 px-4 text-sm font-bold text-slate-800 dark:text-white shadow-sm transition-all"
                      >
                        <FacebookGlyph className="h-4 w-4" />
                        <span>Continue with Facebook</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleWeChatSignIn}
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-navy-700 dark:bg-navy-800 dark:hover:bg-navy-750 py-2.5 px-4 text-sm font-bold text-slate-800 dark:text-white shadow-sm transition-all"
                      >
                        <WeChatGlyph className="h-4 w-4" />
                        <span>Continue with WeChat</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Password Step */
                  <form onSubmit={handlePasswordSubmit} className="space-y-4 animate-fade-in">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Email
                      </label>
                      <input
                        type="email"
                        disabled
                        value={email}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-600 dark:border-navy-700 dark:bg-navy-950 dark:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-sm text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-white"
                        />
                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-3 text-sm font-bold shadow-md shadow-cyan-500/20"
                    >
                      {loading ? 'Authenticating...' : 'Sign In'}
                    </button>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setAuthTab('REGISTER')}
                        className="font-bold text-[#006ce4] hover:underline dark:text-cyan-400"
                      >
                        Don't have an account? Register
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail('admin@aerosmart.com')
                          setPassword('admin123')
                        }}
                        className="text-slate-400 hover:underline"
                      >
                        Demo Admin
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* ================= REGISTER TAB ================= */}
            {authTab === 'REGISTER' && (
              <div className="space-y-4 animate-fade-in">
                {/* 1-Click Social Sign-Up */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#2872FA] hover:bg-[#1f63e0] py-2.5 px-4 text-sm font-bold text-white shadow-md transition-all active:scale-[0.99]"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white p-0.5">
                      <GoogleGlyph className="h-3.5 w-3.5" />
                    </div>
                    <span>Sign up with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFacebookSignIn}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-navy-700 dark:bg-navy-800 dark:hover:bg-navy-750 py-2.5 px-4 text-sm font-bold text-slate-800 dark:text-white shadow-sm transition-all"
                  >
                    <FacebookGlyph className="h-4 w-4" />
                    <span>Sign up with Facebook</span>
                  </button>
                </div>

                {/* Separator */}
                <div className="relative my-3 flex items-center justify-center">
                  <div className="w-full border-t border-slate-200 dark:border-navy-700" />
                  <span className="absolute bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:bg-navy-900">
                    Or with email
                  </span>
                </div>

                {/* Email Registration Form */}
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
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
                        placeholder="e.g. Nguyen Van An"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-sm text-slate-900 focus:border-cyan-500 dark:border-navy-700 dark:bg-navy-950 dark:text-white"
                      />
                      <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-sm text-slate-900 focus:border-cyan-500 dark:border-navy-700 dark:bg-navy-950 dark:text-white"
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
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-sm text-slate-900 focus:border-cyan-500 dark:border-navy-700 dark:bg-navy-950 dark:text-white"
                      />
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-2.5 text-sm font-bold shadow-md shadow-cyan-500/20"
                  >
                    {loading ? 'Creating Account...' : 'Create Account (Đăng ký)'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Legal disclaimer */}
          <div className="mt-5 border-t border-slate-100 dark:border-navy-800 pt-3 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
            By signing in or registering, you are deemed to have agreed to the AeroSmart{' '}
            <span className="underline cursor-pointer hover:text-cyan-600">Terms and Conditions</span> and{' '}
            <span className="underline cursor-pointer hover:text-cyan-600">Privacy Statement</span>.
          </div>
        </div>

        {/* Right Section: QR Code scan panel */}
        <div className="hidden md:flex w-80 shrink-0 flex-col items-center justify-center border-l border-slate-200 bg-slate-50/70 p-6 text-center dark:border-navy-800 dark:bg-navy-950/60">
          <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-md dark:border-navy-700 dark:bg-navy-900">
            <svg
              className="h-40 w-40 text-slate-900 dark:text-white"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <rect x="5" y="5" width="26" height="26" rx="4" />
              <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
              <rect x="13" y="13" width="10" height="10" rx="1" />

              <rect x="69" y="5" width="26" height="26" rx="4" />
              <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
              <rect x="77" y="13" width="10" height="10" rx="1" />

              <rect x="5" y="69" width="26" height="26" rx="4" />
              <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
              <rect x="13" y="77" width="10" height="10" rx="1" />

              <rect x="35" y="8" width="5" height="5" />
              <rect x="45" y="8" width="5" height="5" />
              <rect x="55" y="8" width="5" height="5" />
              <rect x="35" y="18" width="5" height="5" />
              <rect x="50" y="18" width="8" height="5" />
              <rect x="35" y="26" width="6" height="6" />
              <rect x="45" y="26" width="6" height="6" />

              <rect x="8" y="35" width="5" height="5" />
              <rect x="18" y="35" width="5" height="5" />
              <rect x="8" y="45" width="5" height="5" />
              <rect x="18" y="45" width="5" height="5" />
              <rect x="8" y="55" width="5" height="5" />
              <rect x="18" y="55" width="5" height="5" />

              <rect x="69" y="35" width="6" height="6" />
              <rect x="80" y="35" width="6" height="6" />
              <rect x="75" y="45" width="8" height="5" />
              <rect x="69" y="55" width="5" height="5" />
              <rect x="82" y="55" width="5" height="5" />

              <rect x="35" y="69" width="5" height="5" />
              <rect x="45" y="69" width="5" height="5" />
              <rect x="55" y="69" width="5" height="5" />
              <rect x="35" y="80" width="8" height="5" />
              <rect x="50" y="80" width="6" height="6" />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-xl bg-[#006ce4] px-2 py-1 shadow-md text-[10px] font-black tracking-wider text-white">
                Aero.
              </div>
            </div>
          </div>

          <h3 className="mt-3 text-xs font-bold text-slate-900 dark:text-white">
            Use the AeroSmart app to sign in with a QR code
          </h3>

          <div className="mt-3 space-y-1.5 text-left text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-start gap-2">
              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[9px] font-bold text-slate-700 dark:bg-navy-800 dark:text-slate-300">
                1
              </span>
              <span>Open the AeroSmart app</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[9px] font-bold text-slate-700 dark:bg-navy-800 dark:text-slate-300">
                2
              </span>
              <span>Go to <strong>Account</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[9px] font-bold text-slate-700 dark:bg-navy-800 dark:text-slate-300">
                3
              </span>
              <span>Tap [ - ] or Settings &gt; Scan QR code</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleQrCodeLogin}
            className="mt-4 w-full rounded-xl border border-cyan-300 bg-cyan-50/80 hover:bg-cyan-100 dark:border-cyan-800 dark:bg-cyan-950/60 dark:hover:bg-cyan-900 py-1.5 text-xs font-bold text-cyan-800 dark:text-cyan-300 transition-all"
          >
            ⚡ Test QR Sign In
          </button>
        </div>
      </div>
    </div>
  )
}
