import { useState, useEffect } from 'react'
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Search,
  Filter,
  MoreVertical,
  KeyRound,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mail,
  Phone,
  Calendar,
  Lock,
  RefreshCw,
  X,
  UserCheck,
  UserX,
} from 'lucide-react'
import { adminApi, extractErrorMessage } from '../../api/client'
import { GoogleGlyph, FacebookGlyph, AppleGlyph, WeChatGlyph } from '../../components/auth/AuthModal'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionSuccess, setActionSuccess] = useState(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [providerFilter, setProviderFilter] = useState('ALL')

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [resetPassUser, setResetPassUser] = useState(null)
  const [newPasswordVal, setNewPasswordVal] = useState('')

  // Create Form State
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'ROLE_USER',
    phone: '',
    passportNo: '',
    provider: 'LOCAL',
  })
  const [submitting, setSubmitting] = useState(false)

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await adminApi.listUsers({
        q: searchQuery || undefined,
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
        provider: providerFilter !== 'ALL' ? providerFilter : undefined,
      })
      setUsers(data)
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to fetch user accounts.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [roleFilter, providerFilter])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadUsers()
  }

  // Create User Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await adminApi.createUser(createForm)
      setCreateModalOpen(false)
      setCreateForm({
        fullName: '',
        email: '',
        password: '',
        role: 'ROLE_USER',
        phone: '',
        passportNo: '',
        provider: 'LOCAL',
      })
      setActionSuccess('New user account created successfully!')
      setTimeout(() => setActionSuccess(null), 3500)
      loadUsers()
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to create user.'))
    } finally {
      setSubmitting(false)
    }
  }

  // Edit User Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editUser) return
    setSubmitting(true)
    setError(null)
    try {
      await adminApi.updateUser(editUser.id, {
        fullName: editUser.fullName,
        email: editUser.email,
        role: editUser.role,
        phone: editUser.phone,
        passportNo: editUser.passportNo,
        avatarUrl: editUser.avatarUrl,
        active: editUser.active,
      })
      setEditUser(null)
      setActionSuccess('User profile updated successfully!')
      setTimeout(() => setActionSuccess(null), 3500)
      loadUsers()
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to update user.'))
    } finally {
      setSubmitting(false)
    }
  }

  // Change Role
  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminApi.changeUserRole(userId, newRole)
      setActionSuccess(`Role updated to ${newRole === 'ROLE_ADMIN' ? 'Admin' : 'Passenger'}`)
      setTimeout(() => setActionSuccess(null), 3000)
      loadUsers()
    } catch (err) {
      alert(extractErrorMessage(err, 'Failed to change role.'))
    }
  }

  // Toggle Status
  const handleToggleStatus = async (userId) => {
    try {
      await adminApi.toggleUserStatus(userId)
      loadUsers()
    } catch (err) {
      alert(extractErrorMessage(err, 'Failed to toggle status.'))
    }
  }

  // Reset Password Submit
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault()
    if (!resetPassUser || !newPasswordVal.trim()) return
    setSubmitting(true)
    try {
      await adminApi.resetUserPassword(resetPassUser.id, newPasswordVal.trim())
      setResetPassUser(null)
      setNewPasswordVal('')
      setActionSuccess('Password reset successfully!')
      setTimeout(() => setActionSuccess(null), 3500)
    } catch (err) {
      alert(extractErrorMessage(err, 'Failed to reset password.'))
    } finally {
      setSubmitting(false)
    }
  }

  // Delete User
  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to permanently delete account ${userEmail}?`)) {
      return
    }
    try {
      await adminApi.deleteUser(userId)
      setActionSuccess('User deleted successfully.')
      setTimeout(() => setActionSuccess(null), 3000)
      loadUsers()
    } catch (err) {
      alert(extractErrorMessage(err, 'Failed to delete user.'))
    }
  }

  // KPI Calculations
  const totalCount = users.length
  const adminCount = users.filter((u) => u.role === 'ROLE_ADMIN').length
  const passengerCount = users.filter((u) => u.role === 'ROLE_USER').length
  const socialCount = users.filter((u) => u.provider && u.provider !== 'LOCAL').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            User Accounts & Access Management
          </h1>
          <p className="text-xs text-slate-500">
            Control passenger profiles, administrator permissions, and OAuth authentication credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="btn-primary flex items-center gap-2 py-2.5 px-4 text-xs font-bold shadow-md shadow-cyan-500/20"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New Account</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Registered</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{totalCount}</div>
          <span className="text-[11px] text-slate-400">All registered identities</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Administrators</span>
            <ShieldCheck className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-purple-700">{adminCount}</div>
          <span className="text-[11px] text-slate-400">Operations Console Access</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Passengers</span>
            <UserCheck className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-cyan-700">{passengerCount}</div>
          <span className="text-[11px] text-slate-400">Standard travelers</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Social Sign-Ins</span>
            <GoogleGlyph className="h-4 w-4" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600">{socialCount}</div>
          <span className="text-[11px] text-slate-400">Google, FB, Apple, WeChat</span>
        </div>
      </div>

      {/* Alerts */}
      {actionSuccess && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-300 p-3.5 text-xs font-bold text-emerald-800 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-700 animate-fade-in">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone number..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none"
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </form>

          <div className="flex flex-wrap items-center gap-2">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="ROLE_ADMIN">Admins Only</option>
              <option value="ROLE_USER">Passengers Only</option>
            </select>

            {/* Provider Filter */}
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Providers</option>
              <option value="LOCAL">Email/Password (Local)</option>
              <option value="GOOGLE">Google OAuth</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="APPLE">Apple</option>
              <option value="WECHAT">WeChat</option>
            </select>

            <button
              type="button"
              onClick={loadUsers}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/80 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Role & Access</th>
                <th className="py-3.5 px-4">Auth Provider</th>
                <th className="py-3.5 px-4">Phone / Passport</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
                    <p className="mt-2 text-xs font-semibold">Loading accounts...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No accounts found matching your filters.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isAdmin = u.role === 'ROLE_ADMIN'
                  const prov = u.provider || 'LOCAL'
                  const isActive = u.active !== false

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {u.avatarUrl ? (
                            <img
                              src={u.avatarUrl}
                              alt={u.fullName}
                              className="h-8 w-8 rounded-xl object-cover ring-1 ring-slate-200"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 font-bold text-white text-xs">
                              {u.fullName ? u.fullName.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-900 block">{u.fullName}</span>
                            <span className="text-[11px] text-slate-500">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className={`rounded-lg py-1 px-2 text-[11px] font-bold border ${
                            isAdmin
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                          }`}
                        >
                          <option value="ROLE_USER">Passenger</option>
                          <option value="ROLE_ADMIN">Administrator</option>
                        </select>
                      </td>

                      {/* Provider */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-700">
                          {prov === 'GOOGLE' && <GoogleGlyph className="h-3.5 w-3.5" />}
                          {prov === 'FACEBOOK' && <FacebookGlyph className="h-3.5 w-3.5" />}
                          {prov === 'APPLE' && <AppleGlyph className="h-3.5 w-3.5" />}
                          {prov === 'WECHAT' && <WeChatGlyph className="h-3.5 w-3.5" />}
                          {prov === 'LOCAL' && <Mail className="h-3.5 w-3.5 text-slate-400" />}
                          <span>{prov}</span>
                        </div>
                      </td>

                      {/* Phone / Passport */}
                      <td className="py-3.5 px-4 text-[11px]">
                        <div>{u.phone || <span className="text-slate-400">None</span>}</div>
                        <div className="text-slate-400">{u.passportNo ? `ID: ${u.passportNo}` : ''}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u.id)}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          {isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          <span>{isActive ? 'Active' : 'Locked'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditUser({ ...u })}
                            title="Edit User"
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setResetPassUser(u)}
                            title="Reset Password"
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            title="Delete Account"
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Account</h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                  placeholder="e.g. Tran Van B"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="user@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Account Role</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="ROLE_USER">Passenger</option>
                    <option value="ROLE_ADMIN">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Provider</label>
                  <select
                    value={createForm.provider}
                    onChange={(e) => setCreateForm({ ...createForm, provider: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="LOCAL">Local Email</option>
                    <option value="GOOGLE">Google</option>
                    <option value="FACEBOOK">Facebook</option>
                    <option value="APPLE">Apple</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    placeholder="+84 987 654 321"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Passport/ID</label>
                  <input
                    type="text"
                    value={createForm.passportNo}
                    onChange={(e) => setCreateForm({ ...createForm, passportNo: e.target.value })}
                    placeholder="C12345678"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-2 px-5 text-xs font-bold shadow-md"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit User Profile (#{editUser.id})</h3>
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={editUser.fullName || ''}
                  onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editUser.email || ''}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Role</label>
                  <select
                    value={editUser.role}
                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="ROLE_USER">Passenger</option>
                    <option value="ROLE_ADMIN">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={editUser.phone || ''}
                    onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Passport/ID</label>
                  <input
                    type="text"
                    value={editUser.passportNo || ''}
                    onChange={(e) => setEditUser({ ...editUser, passportNo: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Avatar URL</label>
                <input
                  type="url"
                  value={editUser.avatarUrl || ''}
                  onChange={(e) => setEditUser({ ...editUser, avatarUrl: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-2 px-5 text-xs font-bold shadow-md"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetPassUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Reset Password</h3>
              <button
                type="button"
                onClick={() => setResetPassUser(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Set a new password for account: <strong>{resetPassUser.email}</strong>
            </p>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPasswordVal}
                  onChange={(e) => setNewPasswordVal(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetPassUser(null)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-1.5 px-4 text-xs font-bold shadow-sm"
                >
                  {submitting ? 'Resetting...' : 'Set Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
