import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Armchair,
  Car,
  Utensils,
  Zap,
  ShieldCheck,
  Hotel,
  Star,
  Ticket,
  DollarSign,
  Layers,
  X,
  Save,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import {
  getAllServices,
  saveAllServices,
  resetToDefaultServices,
  getBookedServiceVouchers,
} from '../../data/airlineServicesData'
import { useCurrency } from '../../context/CurrencyContext'

export default function AdminServicesPage() {
  const { formatPrice } = useCurrency()

  const [services, setServices] = useState([])
  const [vouchers, setVouchers] = useState([])
  const [activeTab, setActiveTab] = useState('CATALOG') // 'CATALOG' | 'VOUCHERS'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    id: '',
    category: 'lounge',
    categoryLabel: 'Phòng chờ Thương gia',
    title: '',
    titleEn: '',
    titleKm: '',
    price: 350000,
    unit: '/ khách',
    unitEn: '/ pax',
    rating: 4.9,
    badge: 'HOT · VIP',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200',
    coverImg: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
    desc: '',
    descEn: '',
    isActive: true,
  })

  // Load Data
  const loadData = () => {
    setServices(getAllServices())
    setVouchers(getBookedServiceVouchers())
  }

  useEffect(() => {
    loadData()
  }, [])

  // KPI calculations
  const totalServices = services.length
  const activeCount = services.filter((s) => s.isActive !== false).length
  const totalVouchersCount = vouchers.length
  const totalRevenue = vouchers.reduce((sum, v) => sum + (Number(v.totalAmount) || 0), 0)

  // Filtered Services
  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory
    const matchesStatus =
      selectedStatus === 'ALL' ||
      (selectedStatus === 'ACTIVE' && s.isActive !== false) ||
      (selectedStatus === 'INACTIVE' && s.isActive === false)
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Toggle Active Status
  const handleToggleStatus = (id) => {
    const updated = services.map((s) =>
      s.id === id ? { ...s, isActive: s.isActive === false ? true : false } : s
    )
    setServices(updated)
    saveAllServices(updated)
  }

  // Delete Service
  const handleDeleteService = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này khỏi hệ thống?')) {
      const updated = services.filter((s) => s.id !== id)
      setServices(updated)
      saveAllServices(updated)
    }
  }

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingService(null)
    setFormData({
      id: `srv-${Date.now()}`,
      category: 'lounge',
      categoryLabel: 'Phòng chờ Thương gia',
      title: '',
      titleEn: '',
      titleKm: '',
      price: 250000,
      unit: '/ khách',
      unitEn: '/ pax',
      rating: 4.9,
      badge: 'MỚI',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200',
      coverImg: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
      desc: '',
      descEn: '',
      isActive: true,
    })
    setIsModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (service) => {
    setEditingService(service)
    setFormData({ ...service })
    setIsModalOpen(true)
  }

  // Save Service (Add / Update)
  const handleSaveForm = (e) => {
    e.preventDefault()
    let updated = []
    if (editingService) {
      updated = services.map((s) => (s.id === editingService.id ? { ...formData } : s))
    } else {
      updated = [formData, ...services]
    }
    setServices(updated)
    saveAllServices(updated)
    setIsModalOpen(false)
  }

  // Reset Default
  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục danh mục 18 dịch vụ mặc định của AeroSmart?')) {
      const defs = resetToDefaultServices()
      setServices(defs)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/15 text-accent-400 border border-accent-500/30 px-3 py-1 text-xs font-black uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>OPERATIONS ANCILLARIES ENGINE</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Quản Lý Dịch Vụ & Tiện Ích Hàng Không (Ancillaries)
          </h1>
          <p className="text-xs text-slate-400">
            Cấu hình danh mục dịch vụ bổ trợ, định giá theo chặng, thư viện ảnh và quản lý vouchers của khách hàng.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-navy-800/80 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-navy-700 hover:text-white transition-all shadow"
            title="Khôi phục danh mục mặc định"
          >
            <RefreshCw className="h-3.5 w-3.5 text-sky-400" />
            <span>Mặc Định</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-xl bg-accent-500 hover:bg-accent-400 px-4 py-2 text-xs font-black text-navy-950 transition-all shadow-lg shadow-accent-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm Dịch Vụ Mới</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/5 bg-navy-900/90 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Số Dịch Vụ</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalServices}</span>
            <span className="text-xs text-slate-400">dịch vụ trong kho</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-navy-900/90 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đang Kích Hoạt</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">{activeCount}</span>
            <span className="text-xs text-slate-400">sẵn sàng bán trên web</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-navy-900/90 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vouchers Đã Phát Hành</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Ticket className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-300">{totalVouchersCount}</span>
            <span className="text-xs text-slate-400">đã được khách đăng ký</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-navy-900/90 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Doanh Thu Tiện Ích</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-black text-amber-400">
              {formatPrice(totalRevenue, 'VND')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Sub Tabs */}
      <div className="flex border-b border-white/10 gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('CATALOG')}
          className={`pb-3 text-sm font-bold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'CATALOG'
              ? 'border-accent-500 text-accent-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Danh Mục Dịch Vụ ({services.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('VOUCHERS')}
          className={`pb-3 text-sm font-bold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'VOUCHERS'
              ? 'border-accent-500 text-accent-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Ticket className="h-4 w-4" />
          <span>Đơn Hàng & Vouchers Đã Cấp ({vouchers.length})</span>
        </button>
      </div>

      {/* TAB 1: CATALOG MANAGEMENT */}
      {activeTab === 'CATALOG' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-navy-900/60 p-4 rounded-2xl border border-white/5">
            <div className="sm:col-span-6 relative">
              <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm dịch vụ theo tên, mã hoặc loại..."
                className="w-full rounded-xl bg-navy-950 border border-white/10 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-500"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl bg-navy-950 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-500"
              >
                <option value="ALL">Tất cả danh mục (All Categories)</option>
                <option value="lounge">Phòng chờ Thương gia (Lounge)</option>
                <option value="transfer">Xe Đưa Đón Sân Bay (Transfer)</option>
                <option value="dining">Ẩm Thực Trên Mây (Dining)</option>
                <option value="fasttrack">Lối Đi Ưu Tiên (Fast-Track)</option>
                <option value="insurance">Bảo Hiểm Du Lịch (Insurance)</option>
                <option value="hotel">Combo Khách Sạn (Flight + Hotel)</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-xl bg-navy-950 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-500"
              >
                <option value="ALL">Tất cả trạng thái (All Status)</option>
                <option value="ACTIVE">Đang kích hoạt (Active Only)</option>
                <option value="INACTIVE">Tạm dừng bán (Inactive Only)</option>
              </select>
            </div>
          </div>

          {/* Service Cards Grid in Admin */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                  service.isActive !== false
                    ? 'border-white/10 bg-navy-900/80 hover:border-accent-500/50'
                    : 'border-white/5 bg-navy-950/60 opacity-60'
                }`}
              >
                <div>
                  <div className="relative aspect-[16/9] overflow-hidden bg-navy-950">
                    <img
                      src={service.coverImg}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-2.5 left-2.5">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm ${service.badgeColor}`}>
                        {service.badge}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(service.id)}
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 shadow-md transition-all ${
                          service.isActive !== false
                            ? 'bg-emerald-500/90 text-white border-emerald-400 hover:bg-emerald-600'
                            : 'bg-rose-500/90 text-white border-rose-400 hover:bg-rose-600'
                        }`}
                      >
                        {service.isActive !== false ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        <span>{service.isActive !== false ? 'Kích hoạt' : 'Tạm dừng'}</span>
                      </button>
                    </div>

                    <div className="absolute bottom-2 left-3 right-3 text-white flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-accent-400">
                        {service.categoryLabel || service.category}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                        <Star className="h-3 w-3 fill-amber-300" />
                        <span>{service.rating} ({service.reviewCount || 0})</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-black text-white line-clamp-1">{service.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{service.desc}</p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Giá niêm yết</span>
                      <span className="text-base font-black text-accent-400">
                        {formatPrice(service.price, 'VND')}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">{service.unit}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(service)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                        title="Chỉnh sửa dịch vụ"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(service.id)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 transition-colors"
                        title="Xóa dịch vụ"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BOOKED VOUCHERS MANAGEMENT */}
      {activeTab === 'VOUCHERS' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-navy-900/80 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-navy-950/40">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Ticket className="h-4 w-4 text-accent-400" />
                <span>Danh Sách Vouchers Điện Tử Đã Cấp</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Tổng: {vouchers.length} đơn</span>
            </div>

            {vouchers.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <Ticket className="h-10 w-10 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">Chưa có voucher nào được phát hành trong hệ thống.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-navy-950 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Mã Voucher</th>
                      <th className="py-3 px-4">Tên Dịch Vụ</th>
                      <th className="py-3 px-4">Hành Khách</th>
                      <th className="py-3 px-4">Ngày Áp Dụng</th>
                      <th className="py-3 px-4">Chi Tiết Gói</th>
                      <th className="py-3 px-4">Giá Trị</th>
                      <th className="py-3 px-4">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {vouchers.map((v) => (
                      <tr key={v.voucherId} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-accent-400">{v.voucherId}</td>
                        <td className="py-3.5 px-4 font-semibold text-white">{v.title}</td>
                        <td className="py-3.5 px-4 font-bold uppercase text-slate-200">{v.passengerName}</td>
                        <td className="py-3.5 px-4 font-mono">{v.date}</td>
                        <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">{v.details}</td>
                        <td className="py-3.5 px-4 font-mono font-black text-emerald-400">
                          {formatPrice(v.totalAmount, 'VND')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                            ● {v.status || 'CONFIRMED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-navy-900 border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent-400" />
                <span>{editingService ? 'Chỉnh Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Mã Dịch Vụ (ID)</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full rounded-xl bg-navy-950 border border-white/10 px-3 py-2 text-white font-mono"
                    required
                    disabled={!!editingService}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Phân Loại (Category)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const cat = e.target.value
                      const labels = {
                        lounge: 'Phòng chờ Thương gia',
                        transfer: 'Xe Đưa Đón Sân Bay',
                        dining: 'Ẩm Thực Trên Mây',
                        fasttrack: 'Lối Đi Ưu Tiên',
                        insurance: 'Bảo Hiểm Du Lịch',
                        hotel: 'Combo Khách Sạn',
                      }
                      setFormData({ ...formData, category: cat, categoryLabel: labels[cat] || cat })
                    }}
                    className="w-full rounded-xl bg-navy-950 border border-white/10 px-3 py-2 text-white"
                  >
                    <option value="lounge">Phòng chờ Thương gia (Lounge)</option>
                    <option value="transfer">Xe Đưa Đón Sân Bay (Transfer)</option>
                    <option value="dining">Ẩm Thực Trên Mây (Dining)</option>
                    <option value="fasttrack">Lối Đi Ưu Tiên (Fast-Track)</option>
                    <option value="insurance">Bảo Hiểm Du Lịch (Insurance)</option>
                    <option value="hotel">Combo Khách Sạn (Flight + Hotel)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Tên Dịch Vụ (Tiếng Việt)</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl bg-navy-950 border border-white/10 px-3 py-2 text-white"
                    placeholder="e.g. Lotus Lounge VIP - Sân bay Nội Bài"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Tên Dịch Vụ (English)</label>
                  <input
                    type="text"
                    value={formData.titleEn || ''}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full rounded-xl bg-navy-950 border border-white/10 px-3 py-2 text-white"
                    placeholder="e.g. Lotus Lounge VIP - Hanoi Noi Bai Airport"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Giá Niêm Yết (VND)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full rounded-xl bg-navy-950 border border-white/10 px-3 py-2 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Đơn Vị Tính (Unit)</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full rounded-xl bg-navy-950 border border-white/10 px-3 py-2 text-white"
                    placeholder="e.g. / khách, / chuyến, / phần"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nhãn Huy Hiệu (Badge)</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full rounded-xl bg-navy-950 border border-white/10 px-3 py-2 text-white"
                    placeholder="e.g. HOT · VIP, BÁN CHẠY"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Đánh Giá (Rating)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full rounded-xl bg-navy-950 border border-white/10 px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Đường Dẫn Hình Ảnh Bìa (Photo URL)</label>
                  <input
                    type="url"
                    value={formData.coverImg}
                    onChange={(e) => setFormData({ ...formData, coverImg: e.target.value })}
                    className="w-full rounded-xl bg-navy-950 border border-white/10 px-3 py-2 text-white font-mono text-[11px]"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Mô Tả Chi Tiết (Description)</label>
                  <textarea
                    rows={3}
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    className="w-full rounded-xl bg-navy-950 border border-white/10 px-3 py-2 text-white"
                    placeholder="Mô tả quyền lợi và thông số nổi bật..."
                    required
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-navy-950 text-accent-500"
                  />
                  <label htmlFor="isActiveCheck" className="text-xs font-bold text-white">
                    Kích hoạt dịch vụ này trên hệ thống bán vé khách hàng
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-accent-500 hover:bg-accent-400 px-6 py-2.5 text-xs font-black text-navy-950 shadow-lg shadow-accent-500/20"
                >
                  <Save className="h-4 w-4" />
                  <span>Lưu Dịch Vụ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
