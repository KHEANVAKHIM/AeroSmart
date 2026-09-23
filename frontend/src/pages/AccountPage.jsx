import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Camera,
  Ticket,
  Sparkles,
  Plane,
  Save,
  Globe,
  Award,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { userApi, extractErrorMessage } from '../api/client'
import { GoogleGlyph, FacebookGlyph, AppleGlyph, WeChatGlyph } from '../components/auth/AuthModal'

export default function AccountPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('PROFILE') // 'PROFILE', 'SECURITY', 'ACCOUNTS'

  // Profile Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [passportNo, setPassportNo] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login?redirect=/account')
      return
    }

    if (isAuthenticated) {
      userApi
        .getProfile()
        .then((profile) => {
          setFullName(profile.fullName || '')
          setEmail(profile.email || '')
          setPhone(profile.phone || '')
          setPassportNo(profile.passportNo || '')
          setAvatarUrl(profile.avatarUrl || '')
        })
        .catch(() => {
          if (user) {
            setFullName(user.fullName || '')
            setEmail(user.email || '')
            setPhone(user.phone || '')
            setPassportNo(user.passportNo || '')
            setAvatarUrl(user.avatarUrl || '')
          }
        })
    }
  }, [isAuthenticated, authLoading, navigate, user])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      const updated = await userApi.updateProfile({
        fullName,
        phone,
        passportNo,
        avatarUrl,
      })
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(null), 4000)
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to update profile.'))
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.')
      return
    }

    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      await userApi.changePassword({
        currentPassword,
        newPassword,
      })
      setMessage('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setMessage(null), 4000)
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to change password.'))
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    )
  }

  const provider = user?.provider || 'LOCAL'
  const isSocial = provider !== 'LOCAL'

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 dark:bg-navy-950 transition-colors">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Profile Top Banner / Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-navy-800 dark:bg-navy-900">
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-cyan-400/10 to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* User Avatar */}
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="h-20 w-20 rounded-2xl object-cover ring-4 ring-cyan-500/20 shadow-md"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-2xl font-black text-white shadow-md">
                    {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow dark:bg-navy-800">
                  {provider === 'GOOGLE' && <GoogleGlyph className="h-3.5 w-3.5" />}
                  {provider === 'FACEBOOK' && <FacebookGlyph className="h-3.5 w-3.5" />}
                  {provider === 'APPLE' && <AppleGlyph className="h-3.5 w-3.5 text-black dark:text-white" />}
                  {provider === 'LOCAL' && <Shield className="h-3.5 w-3.5 text-cyan-600" />}
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {fullName || 'Passenger'}
                  </h1>
                  <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-[11px] font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                    {user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Verified Traveler'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{email}</span>
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Award className="h-3.5 w-3.5" />
                    <span>AeroSmart Member Tier</span>
                  </span>
                  <span>•</span>
                  <span>Auth: {provider}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Link
                to="/my-bookings"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-navy-700 dark:bg-navy-800 dark:hover:bg-navy-750 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
              >
                <Ticket className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                <span>My Bookings</span>
              </Link>
              <Link
                to="/flights"
                className="btn-primary py-2 px-4 text-xs font-bold shadow-sm"
              >
                <Plane className="h-4 w-4" />
                <span>Book Flight</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Status Alerts */}
        {message && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200 animate-fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300 animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-navy-800 gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('PROFILE')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'PROFILE'
                ? 'border-[#006ce4] text-[#006ce4] dark:border-cyan-400 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Personal Information
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SECURITY')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'SECURITY'
                ? 'border-[#006ce4] text-[#006ce4] dark:border-cyan-400 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Security & Password
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ACCOUNTS')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'ACCOUNTS'
                ? 'border-[#006ce4] text-[#006ce4] dark:border-cyan-400 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Connected Social Accounts
          </button>
        </div>

        {/* Tab 1: Personal Information Form */}
        {activeTab === 'PROFILE' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-navy-800 dark:bg-navy-900 animate-fade-in">
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Legal Name (as on Passport/ID)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Nguyen Van An"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-sm text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-white"
                    />
                    <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 pl-10 text-sm text-slate-500 dark:border-navy-700 dark:bg-navy-950 dark:text-slate-400"
                    />
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+84 987 654 321"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-sm text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-white"
                    />
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Passport / National ID Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={passportNo}
                      onChange={(e) => setPassportNo(e.target.value)}
                      placeholder="e.g. C12345678"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-sm text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-white"
                    />
                    <CreditCard className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Avatar Image URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pl-10 text-sm text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-white"
                    />
                    <Camera className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2 py-2.5 px-6 text-sm font-bold shadow-md shadow-cyan-500/20"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Security & Password */}
        {activeTab === 'SECURITY' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-navy-800 dark:bg-navy-900 animate-fade-in">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Change Account Password
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Ensure your account is using a secure password to protect your bookings and seat locks.
            </p>

            <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
              {!isSocial && (
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-cyan-500 dark:border-navy-700 dark:bg-navy-950 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-cyan-500 dark:border-navy-700 dark:bg-navy-950 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-cyan-500 dark:border-navy-700 dark:bg-navy-950 dark:text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2 py-2.5 px-6 text-sm font-bold shadow-md shadow-cyan-500/20"
                >
                  <KeyRound className="h-4 w-4" />
                  <span>{saving ? 'Updating Password...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Connected Social Accounts */}
        {activeTab === 'ACCOUNTS' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-navy-800 dark:bg-navy-900 animate-fade-in space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Connected Social Authentication Providers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in with 1-click using your linked social identities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Google */}
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-200 dark:border-navy-700">
                    <GoogleGlyph className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Google</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {provider === 'GOOGLE' ? 'Currently Connected' : 'Available for 1-click login'}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    provider === 'GOOGLE'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-navy-800 dark:text-slate-300'
                  }`}
                >
                  {provider === 'GOOGLE' ? 'Active' : 'Linked'}
                </span>
              </div>

              {/* Facebook */}
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/20">
                    <FacebookGlyph className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Facebook</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {provider === 'FACEBOOK' ? 'Currently Connected' : 'Available for 1-click login'}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    provider === 'FACEBOOK'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-navy-800 dark:text-slate-300'
                  }`}
                >
                  {provider === 'FACEBOOK' ? 'Active' : 'Linked'}
                </span>
              </div>

              {/* Apple */}
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 dark:bg-navy-800">
                    <AppleGlyph className="h-5 w-5 text-black dark:text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Apple ID</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {provider === 'APPLE' ? 'Currently Connected' : 'Available for 1-click login'}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    provider === 'APPLE'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-navy-800 dark:text-slate-300'
                  }`}
                >
                  {provider === 'APPLE' ? 'Active' : 'Ready'}
                </span>
              </div>

              {/* WeChat */}
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                    <WeChatGlyph className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">WeChat</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {provider === 'WECHAT' ? 'Currently Connected' : 'Available for 1-click login'}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    provider === 'WECHAT'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-navy-800 dark:text-slate-300'
                  }`}
                >
                  {provider === 'WECHAT' ? 'Active' : 'Ready'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
