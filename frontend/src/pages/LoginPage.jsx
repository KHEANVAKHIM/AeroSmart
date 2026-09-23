import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Mail,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  X,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { extractErrorMessage } from '../api/client'
import {
  GoogleGlyph,
  FacebookGlyph,
  AppleGlyph,
  WeChatGlyph,
} from '../components/auth/AuthModal'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const { login, loginWithSocial, sendOtpCode, verifyOtpCode } = useAuth()

  // Steps: 'MAIN', 'PASSWORD', 'OTP', 'GOOGLE_MODAL'
  const [step, setStep] = useState('MAIN')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // OTP State
  const [otpTarget, setOtpTarget] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpChannel, setOtpChannel] = useState('EMAIL')
  const [incomingMessage, setIncomingMessage] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successToast, setSuccessToast] = useState(null)

  // Handle email submit in Step 1
  const handleEmailContinue = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    setError(null)
    setStep('PASSWORD')
  }

  // Password Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const loggedUser = await login(email, password)
      setSuccessToast(`Welcome back, ${loggedUser.fullName}!`)
      setTimeout(() => {
        if (loggedUser.role === 'ROLE_ADMIN' || loggedUser.role === 'ADMIN') {
          navigate('/admin')
        } else {
          navigate(redirect)
        }
      }, 700)
    } catch (err) {
      setError(extractErrorMessage(err, 'Invalid credentials. Please verify email and password.'))
    } finally {
      setLoading(false)
    }
  }

  // Continue with Google
  const handleGoogleSignIn = async (accountEmail = 'passenger.google@aerosmart.com', accountName = 'Google Traveler') => {
    setLoading(true)
    setError(null)
    try {
      const googleUser = {
        provider: 'GOOGLE',
        providerId: 'google_' + Math.floor(Math.random() * 1000000000),
        email: accountEmail,
        fullName: accountName,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop',
      }
      const user = await loginWithSocial(googleUser)
      setSuccessToast(`Google Sign-In successful! Welcome, ${user.fullName}!`)
      setTimeout(() => {
        navigate(redirect)
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
      const mockFbUser = {
        provider: 'FACEBOOK',
        providerId: 'fb_1029384756',
        email: 'passenger.facebook@aerosmart.com',
        fullName: 'Alex Nguyen (Facebook)',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop',
      }

      const user = await loginWithSocial(mockFbUser)
      setSuccessToast(`Facebook connected! Welcome, ${user.fullName}!`)

      setIncomingMessage({
        sender: 'Facebook Messenger',
        title: 'AeroSmart Security Bot',
        body: `Hi ${user.fullName}, your Facebook account was successfully connected to AeroSmart.`,
      })

      setTimeout(() => {
        navigate(redirect)
      }, 1000)
    } catch (err) {
      setError(extractErrorMessage(err, 'Facebook connection failed.'))
    } finally {
      setLoading(false)
    }
  }

  // Continue with Apple
  const handleAppleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const appleUser = {
        provider: 'APPLE',
        providerId: 'apple_88337722',
        email: 'passenger.apple@aerosmart.com',
        fullName: 'Apple Traveler',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop',
      }
      const user = await loginWithSocial(appleUser)
      setSuccessToast(`Apple Sign-In successful! Welcome, ${user.fullName}!`)
      setTimeout(() => {
        navigate(redirect)
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
      const weChatUser = {
        provider: 'WECHAT',
        providerId: 'wechat_55667788',
        email: 'passenger.wechat@aerosmart.com',
        fullName: 'WeChat Traveler',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop',
      }
      const user = await loginWithSocial(weChatUser)
      setSuccessToast(`WeChat Sign-In successful! Welcome, ${user.fullName}!`)
      setTimeout(() => {
        navigate(redirect)
      }, 700)
    } catch (err) {
      setError(extractErrorMessage(err, 'WeChat Sign-In failed.'))
    } finally {
      setLoading(false)
    }
  }

  // Fast demo fill
  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setStep('PASSWORD')
  }

  // QR Code Instant Login
  const handleQrInstantLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const qrUser = {
        provider: 'AEROSMART_APP_QR',
        providerId: 'qr_app_' + Date.now(),
        email: 'app.qr.user@aerosmart.com',
        fullName: 'AeroSmart Mobile Passenger',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop',
      }
      const user = await loginWithSocial(qrUser)
      setSuccessToast('QR Scan Verified! Logged in via Mobile App.')
      setTimeout(() => {
        navigate(redirect)
      }, 700)
    } catch (err) {
      setError(extractErrorMessage(err, 'QR login simulation failed.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-100 dark:bg-navy-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="w-full max-w-4xl">
        {/* Brand Header */}
        <div className="text-center mb-6 space-y-1">
          <Link to="/" className="inline-flex items-center">
            <span className="text-3xl font-black text-[#003580] dark:text-white">
              Aero<span className="text-[#006ce4]">Smart</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intelligent Flight Platform · Smart Booking, Seamless Journey
          </p>
        </div>

        {/* Incoming Messenger Notification Simulator */}
        {incomingMessage && (
          <div className="mb-4 rounded-2xl border border-cyan-300 bg-cyan-50 dark:border-cyan-700 dark:bg-cyan-950/80 p-4 shadow-lg animate-bounce-in relative">
            <button
              type="button"
              onClick={() => setIncomingMessage(null)}
              className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1877F2] text-white">
                <FacebookGlyph className="h-5 w-5 fill-white" />
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

        {/* Demo Fast-Switch Bar */}
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white dark:border-navy-800 dark:bg-navy-900/90 p-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
              <ShieldCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span>Quick 1-Click Access:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@aerosmart.com', 'admin123')}
                className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-800 hover:bg-slate-100 dark:border-navy-700 dark:bg-navy-800 dark:text-slate-200"
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('passenger@aerosmart.com', 'user123')}
                className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-800 hover:bg-slate-100 dark:border-navy-700 dark:bg-navy-800 dark:text-slate-200"
              >
                Passenger Demo
              </button>
              <button
                type="button"
                onClick={() => handleGoogleSignIn()}
                className="rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
              >
                Google 1-Click
              </button>
              <button
                type="button"
                onClick={handleFacebookSignIn}
                className="rounded-xl border border-[#1877F2]/30 bg-[#1877F2]/10 px-2.5 py-1 text-[11px] font-bold text-[#1877F2] hover:bg-[#1877F2]/20 dark:bg-[#1877F2]/20 dark:text-cyan-200"
              >
                Facebook 1-Click
              </button>
            </div>
          </div>
        </div>

        {/* Main Card (Trip.com exact layout) */}
        <div className="flex flex-col md:flex-row overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-navy-800 dark:bg-navy-900 transition-colors">
          {/* Left Form Area */}
          <div className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
            <div>
              {/* Header Title */}
              <div className="mb-5">
                {step !== 'MAIN' && (
                  <button
                    type="button"
                    onClick={() => {
                      setStep('MAIN')
                      setError(null)
                    }}
                    className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to all login options</span>
                  </button>
                )}

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  {step === 'PASSWORD' ? 'Enter your password' : 'Sign in/register'}
                </h1>

                {/* Membership Rewards & Manage Bookings Perks Badges */}
                <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
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

              {/* Error Alert */}
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* MAIN STEP: Email + Google + Facebook + Apple + WeChat */}
              {step === 'MAIN' && (
                <div className="space-y-4">
                  {/* Continue with Email */}
                  <form onSubmit={handleEmailContinue} className="space-y-3">
                    <div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Please enter an email address"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2872FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2872FA]/20 dark:border-navy-700 dark:bg-navy-950 dark:text-white dark:placeholder:text-slate-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-slate-200 hover:bg-slate-300 dark:bg-navy-800 dark:hover:bg-navy-700 py-3 text-sm font-bold text-slate-800 dark:text-slate-200 transition-all shadow-sm"
                    >
                      Continue with email
                    </button>
                  </form>

                  {/* 'or' Separator */}
                  <div className="relative my-4 flex items-center justify-center">
                    <div className="w-full border-t border-slate-200 dark:border-navy-800" />
                    <span className="absolute bg-white px-3 text-xs font-medium text-slate-400 dark:bg-navy-900">
                      or
                    </span>
                  </div>

                  {/* 1. Continue with Google (Primary highlight as requested) */}
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => handleGoogleSignIn()}
                      disabled={loading}
                      className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#2872FA] hover:bg-[#1f63e0] py-3 px-4 text-sm font-bold text-white shadow-md transition-all active:scale-[0.99]"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white p-0.5 shadow-sm">
                        <GoogleGlyph className="h-4 w-4" />
                      </div>
                      <span>Continue with Google</span>
                    </button>

                    {/* 2. Continue with Apple */}
                    <button
                      type="button"
                      onClick={handleAppleSignIn}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-navy-700 dark:bg-navy-800 dark:hover:bg-navy-750 py-3 px-4 text-sm font-bold text-slate-800 dark:text-white shadow-sm transition-all"
                    >
                      <AppleGlyph className="h-5 w-5 text-black dark:text-white" />
                      <span>Continue with Apple</span>
                    </button>

                    {/* 3. Continue with Facebook (Requested) */}
                    <button
                      type="button"
                      onClick={handleFacebookSignIn}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-navy-700 dark:bg-navy-800 dark:hover:bg-navy-750 py-3 px-4 text-sm font-bold text-slate-800 dark:text-white shadow-sm transition-all"
                    >
                      <FacebookGlyph className="h-5 w-5" />
                      <span>Continue with Facebook</span>
                    </button>

                    {/* 4. Continue with WeChat */}
                    <button
                      type="button"
                      onClick={handleWeChatSignIn}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-navy-700 dark:bg-navy-800 dark:hover:bg-navy-750 py-3 px-4 text-sm font-bold text-slate-800 dark:text-white shadow-sm transition-all"
                    >
                      <WeChatGlyph className="h-5 w-5" />
                      <span>Continue with WeChat</span>
                    </button>
                  </div>
                </div>
              )}

              {/* PASSWORD STEP */}
              {step === 'PASSWORD' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4 animate-fade-in">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Email address
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
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 pl-10 text-sm text-slate-900 focus:border-[#2872FA] focus:bg-white focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-white"
                      />
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3 text-sm font-bold shadow-lg shadow-cyan-500/20"
                  >
                    {loading ? 'Authenticating...' : 'Sign In'}
                  </button>

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <Link
                      to="/register"
                      className="font-bold text-[#006ce4] hover:underline dark:text-cyan-400"
                    >
                      Need an account? Register
                    </Link>
                  </div>
                </form>
              )}
            </div>

            {/* Legal Disclaimer at Bottom (Trip.com exact wording) */}
            <div className="mt-8 border-t border-slate-100 dark:border-navy-800 pt-4 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
              By signing in or registering, you are deemed to have agreed to the AeroSmart{' '}
              <span className="underline cursor-pointer hover:text-cyan-600">Terms and Conditions</span> and{' '}
              <span className="underline cursor-pointer hover:text-cyan-600">Privacy Statement</span>.
            </div>
          </div>

          {/* Right QR Code Section (Trip.com exact right panel) */}
          <div className="hidden md:flex w-80 shrink-0 flex-col items-center justify-center border-l border-slate-200 bg-slate-50/70 p-8 text-center dark:border-navy-800 dark:bg-navy-950/60">
            {/* QR Pattern with AeroSmart Badge */}
            <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-md dark:border-navy-700 dark:bg-navy-900">
              <svg
                className="h-44 w-44 text-slate-900 dark:text-white"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                {/* 3 Corner Markers */}
                <rect x="5" y="5" width="26" height="26" rx="4" />
                <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
                <rect x="13" y="13" width="10" height="10" rx="1" />

                <rect x="69" y="5" width="26" height="26" rx="4" />
                <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
                <rect x="77" y="13" width="10" height="10" rx="1" />

                <rect x="5" y="69" width="26" height="26" rx="4" />
                <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
                <rect x="13" y="77" width="10" height="10" rx="1" />

                {/* QR Matrix Bits */}
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

              {/* Logo in Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-xl bg-[#006ce4] px-2 py-1 shadow-md text-[10px] font-black tracking-wider text-white">
                  Trip.
                </div>
              </div>
            </div>

            <h2 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
              Use the Trip.com app to sign in with a QR code
            </h2>

            {/* Instruction Steps */}
            <div className="mt-4 space-y-2 text-left text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700 dark:bg-navy-800 dark:text-slate-300">
                  1
                </span>
                <span>Open the Trip.com app</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700 dark:bg-navy-800 dark:text-slate-300">
                  2
                </span>
                <span>Go to <strong>Account</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700 dark:bg-navy-800 dark:text-slate-300">
                  3
                </span>
                <span>Tap <strong>[ - ]</strong> in the top-right corner or go to (Settings) &gt; Scan QR code</span>
              </div>
            </div>

            {/* Instant test QR button */}
            <button
              type="button"
              onClick={handleQrInstantLogin}
              className="mt-5 w-full rounded-xl border border-cyan-300 bg-cyan-50/80 hover:bg-cyan-100 dark:border-cyan-800 dark:bg-cyan-950/60 dark:hover:bg-cyan-900 py-2 text-xs font-bold text-cyan-800 dark:text-cyan-300 transition-all"
            >
              ⚡ Instant QR Code Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
