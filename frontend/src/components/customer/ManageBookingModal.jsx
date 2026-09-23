import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Ticket,
  Search,
  X,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Plane,
  AlertCircle,
} from 'lucide-react'
import { checkinApi, bookingApi, extractErrorMessage } from '../../api/client'

export default function ManageBookingModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [pnr, setPnr] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const handleLookup = async (e) => {
    e.preventDefault()
    if (!pnr.trim()) {
      setError('Vui lòng nhập Mã đặt chỗ (PNR 6 ký tự).')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Validate PNR via check-in lookup or booking details
      const cleanPnr = pnr.trim().toUpperCase()
      const data = await checkinApi.lookup(cleanPnr, lastName.trim() || undefined)
      onClose()
      // If confirmed, navigate to check-in or booking success view
      navigate(`/checkin?pnr=${cleanPnr}`)
    } catch (err) {
      // Fallback: If not eligible for checkin yet, try redirecting to booking success
      const cleanPnr = pnr.trim().toUpperCase()
      if (cleanPnr.length >= 5) {
        onClose()
        navigate(`/booking-success/${cleanPnr}`)
      } else {
        setError(extractErrorMessage(err, 'Không tìm thấy thông tin đặt chỗ. Vui lòng kiểm tra lại mã PNR.'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 dark:bg-navy-900 dark:border-navy-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00205B] via-[#003580] to-[#0A4B9C] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm shadow-md">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                AeroSmart Manage Booking
              </span>
              <h3 className="text-lg font-black text-white">Quản lý Đặt chỗ & Tra cứu vé</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Nhập <strong>Mã đặt chỗ (PNR)</strong> và <strong>Họ hành khách</strong> để xem hành trình bay, tải vé điện tử (PDF Ticket), đổi chỗ ngồi hoặc làm thủ tục trực tuyến.
          </p>

          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Mã đặt chỗ / Mã vé (PNR) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: PNR789, VN-1234..."
                value={pnr}
                onChange={(e) => setPnr(e.target.value.toUpperCase())}
                maxLength={10}
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-mono font-bold tracking-widest text-navy-950 uppercase focus:border-[#003580] focus:bg-white focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Họ của hành khách (Không dấu hoặc có dấu)
              </label>
              <input
                type="text"
                placeholder="VD: NGUYEN, TRAN, LE..."
                value={lastName}
                onChange={(e) => setLastName(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-xs font-bold text-navy-950 uppercase focus:border-[#003580] focus:bg-white focus:outline-none dark:border-navy-700 dark:bg-navy-800 dark:text-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline py-2.5 px-5 text-xs font-bold"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 py-2.5 px-5 text-xs font-bold shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Tìm kiếm Đặt chỗ</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Help Badges */}
          <div className="rounded-2xl border border-slate-100 dark:border-navy-800 bg-slate-50/80 dark:bg-navy-950/60 p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-navy-900 dark:text-white">
              <ShieldCheck className="h-4 w-4 text-[#006ce4]" />
              <span>Dịch vụ hỗ trợ trực tuyến:</span>
            </div>
            <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
              <li>Làm thủ tục chuyến bay từ 24h đến 60 phút trước giờ khởi hành.</li>
              <li>Tải hóa đơn VAT & vé điện tử PDF chuẩn IATA.</li>
              <li>Đổi chỗ ngồi & mua thêm hành lý ký gửi ưu đãi tới 40%.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
