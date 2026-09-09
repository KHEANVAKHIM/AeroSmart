import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Plane,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Send,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { extractErrorMessage } from '../api/client'

// Facebook Official SVG Logo
function FacebookGlyph({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

// Facebook Messenger Official SVG Logo
function MessengerGlyph({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.082.3 2.235.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.26 5.888-3.26-6.559 6.963z" />
    </svg>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const { login, loginWithSocial, sendOtpCode, verifyOtpCode } = useAuth()

  // Tabs: 'PASSWORD' vs 'OTP'
  const [authMethod, setAuthMethod] = useState('PASSWORD')
  const [otpChannel, setOtpChannel] = useState('EMAIL') // 'EMAIL' or 'MESSENGER'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // OTP Flow
  const [otpTarget, setOtpTarget] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [incomingMessage, setIncomingMessage] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Standard Email & Password Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const loggedUser = await login(email, password)
      if (loggedUser.role === 'ROLE_ADMIN' || loggedUser.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate(redirect)
      }
    } catch (err) {
      setError(extractErrorMessage(err, 'Invalid credentials. Please verify email and password.'))
    } finally {
      setLoading(false)
    }
  }

  // 1-Click Facebook OAuth Connect
  const handleFacebookConnect = async () => {
    setLoading(true)
    setError(null)

    try {
      const mockFbUser = {
        provider: 'FACEBOOK',
        providerId: 'fb_1029384756',
        email: 'alex.facebook@aerosmart.com',
        fullName: 'Alex Nguyen (Facebook)',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop',
      }

      const user = await loginWithSocial(mockFbUser)

      // Simulate incoming welcome message to user's Facebook Messenger
      setIncomingMessage({
        sender: 'Facebook Messenger',
        title: 'AeroSmart Security Bot',
        body: `Hi ${user.fullName}, your Facebook account was successfully connected to AeroSmart.`,
        code: null,
      })

      setTimeout(() => {
        navigate(redirect)
      }, 1200)
    } catch (err) {
      setError(extractErrorMessage(err, 'Facebook connection failed.'))
    } finally {
      setLoading(false)
    }
  }

  // Dispatch OTP Code to Email or Facebook Messenger
  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!otpTarget) {
      setError('Please enter your destination Email or Facebook username.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const resp = await sendOtpCode(otpChannel, otpTarget, 'LOGIN')
      setOtpSent(true)

      // Simulate the incoming message received on user's device!
      setIncomingMessage({
        sender: otpChannel === 'MESSENGER' ? 'Facebook Messenger' : 'Email Inbox',
        title: otpChannel === 'MESSENGER' ? 'AeroSmart Security Bot' : 'AeroSmart Security Desk',
        body:
          otpChannel === 'MESSENGER'
            ? `Hi! Your Facebook Messenger verification code for AeroSmart is: ${resp.codePreview}`
            : `Your one-time login verification code is: ${resp.codePreview}`,
        code: resp.codePreview,
      })
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to dispatch verification code.'))
    } finally {
      setLoading(false)
    }
  }

  // Verify Code and Login
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otpCode) {
      setError('Please enter the 6-digit code.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const user = await verifyOtpCode(otpTarget, otpCode, '', otpChannel)
      if (user.role === 'ROLE_ADMIN' || user.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate(redirect)
      }
    } catch (err) {
      setError(extractErrorMessage(err, 'Invalid or expired code.'))
    } finally {
      setLoading(false)
    }
  }

  const fillCredentials = (demoEmail, demoPass) => {
    setAuthMethod('PASSWORD')
    setEmail(demoEmail)
    setPassword(demoPass)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-navy-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center">
            <span className="text-3xl font-black text-navy-950 dark:text-white">
              Aero<span className="text-cyan-600 dark:text-cyan-400">Smart</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-navy-900 dark:text-white">Sign in to your account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Connect via Email, Facebook, or instant Messenger OTP
          </p>
        </div>

        {/* Incoming Message Simulator Notification (User Requested: send Message to Email or FB) */}
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
                {incomingMessage.sender.includes('Messenger') ? (
                  <MessengerGlyph className="h-5 w-5" />
                ) : (
                  <Mail className="h-5 w-5" />
                )}
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
                {incomingMessage.code && (
                  <button
                    type="button"
                    onClick={() => setOtpCode(incomingMessage.code)}
                    className="mt-1 text-[11px] font-bold text-cyan-700 dark:text-cyan-300 underline"
                  >
                    Tap to auto-fill code: {incomingMessage.code}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Fast 1-Click Demo Accounts */}
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 dark:border-navy-800 dark:bg-navy-900/60 p-3.5 text-xs text-cyan-900 dark:text-cyan-200">
          <div className="flex items-center gap-1.5 font-bold mb-2 text-cyan-950 dark:text-white">
            <ShieldCheck className="h-4 w-4 text-cyan-700 dark:text-cyan-400" />
            <span>Fast 1-Click Demo Accounts:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin@aerosmart.com', 'admin123')}
              className="rounded-xl bg-white border border-cyan-300 py-1.5 px-2 text-[11px] font-bold text-navy-900 shadow-sm hover:bg-cyan-100 dark:bg-navy-800 dark:border-navy-700 dark:text-white"
            >
              Admin Demo
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('passenger@aerosmart.com', 'user123')}
              className="rounded-xl bg-white border border-cyan-300 py-1.5 px-2 text-[11px] font-bold text-navy-900 shadow-sm hover:bg-cyan-100 dark:bg-navy-800 dark:border-navy-700 dark:text-white"
            >
              Passenger
            </button>
            <button
              type="button"
              onClick={handleFacebookConnect}
              className="rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/30 py-1.5 px-2 text-[11px] font-bold text-[#1877F2] hover:bg-[#1877F2]/20 dark:bg-[#1877F2]/20 dark:text-cyan-200"
            >
              FB Passenger
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Main Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md dark:border-navy-800 dark:bg-navy-900 space-y-5 transition-colors">
          {/* Social Sign-In: Facebook & Google */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleFacebookConnect}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#1877F2] py-2.5 px-4 text-xs font-bold text-white shadow-md hover:bg-[#166fe5] transition-all"
            >
              <FacebookGlyph className="h-4 w-4" />
              <span>Continue with Facebook</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200 dark:border-navy-800" />
            <span className="absolute bg-white dark:bg-navy-900 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Or connect with
            </span>
          </div>

          {/* Method Switcher: Password vs Magic Code OTP */}
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-navy-950">
            <button
              type="button"
              onClick={() => setAuthMethod('PASSWORD')}
              className={`rounded-xl py-2 text-xs font-bold transition-all ${
                authMethod === 'PASSWORD'
                  ? 'bg-white text-navy-950 shadow-sm dark:bg-navy-800 dark:text-white'
                  : 'text-slate-500 hover:text-navy-900 dark:text-slate-400'
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('OTP')}
              className={`rounded-xl py-2 text-xs font-bold transition-all ${
                authMethod === 'OTP'
                  ? 'bg-white text-navy-950 shadow-sm dark:bg-navy-800 dark:text-white'
                  : 'text-slate-500 hover:text-navy-900 dark:text-slate-400'
              }`}
            >
              Message OTP (Email / FB)
            </button>
          </div>

          {/* Form Option 1: Standard Password */}
          {authMethod === 'PASSWORD' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
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
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          ) : (
            /* Form Option 2: Message OTP (User Requested: send Message to Email or FB) */
            <div className="space-y-4">
              {/* Channel Selector: Email vs FB Messenger */}
              <div>
                <label className="label">Delivery Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpChannel('EMAIL')}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-2 text-xs font-bold transition-all ${
                      otpChannel === 'EMAIL'
                        ? 'border-cyan-500 bg-cyan-50 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
                        : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-navy-800 dark:bg-navy-950'
                    }`}
                  >
                    <Mail className="h-4 w-4 text-cyan-600" />
                    <span>Send to Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpChannel('MESSENGER')}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-2 text-xs font-bold transition-all ${
                      otpChannel === 'MESSENGER'
                        ? 'border-[#1877F2] bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
                        : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-navy-800 dark:bg-navy-950'
                    }`}
                  >
                    <MessengerGlyph className="h-4 w-4 text-[#1877F2]" />
                    <span>Send to Messenger</span>
                  </button>
                </div>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <label className="label">
                      {otpChannel === 'MESSENGER'
                        ? 'Facebook Messenger ID / Phone'
                        : 'Email address'}
                    </label>
                    <input
                      type={otpChannel === 'EMAIL' ? 'email' : 'text'}
                      required
                      value={otpTarget}
                      onChange={(e) => setOtpTarget(e.target.value)}
                      placeholder={
                        otpChannel === 'MESSENGER'
                          ? 'alex.facebook or +84987654321'
                          : 'name@example.com'
                      }
                      className="input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-2.5 text-xs font-bold"
                  >
                    {loading
                      ? 'Dispatching Code...'
                      : `Send Code to ${otpChannel === 'MESSENGER' ? 'Messenger' : 'Email'}`}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3 animate-fade-in">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="label mb-0">6-Digit Verification Code</label>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] font-semibold text-cyan-600 hover:underline"
                      >
                        Change destination
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.trim())}
                      placeholder="123456"
                      className="input text-center text-lg font-mono font-bold tracking-widest"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-2.5 text-xs font-bold"
                  >
                    {loading ? 'Verifying...' : 'Verify & Sign In'}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
