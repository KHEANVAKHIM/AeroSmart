import { useState, useEffect } from 'react'
import {
  QrCode,
  Copy,
  Check,
  X,
  Clock,
  ShieldCheck,
  AlertCircle,
  Building2,
  User,
  CreditCard,
  Sparkles,
  ArrowRight,
  Barcode,
  Smartphone,
  CheckCircle2,
} from 'lucide-react'
import { useCurrency } from '../../context/CurrencyContext'
import { useLanguage } from '../../context/LanguageContext'

export default function VietQrModal({
  isOpen,
  onClose,
  onConfirmPayment,
  bookingRef,
  amount,
  loading,
}) {
  const { formatPrice } = useCurrency()
  const { language } = useLanguage()
  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'
  const [activeTab, setActiveTab] = useState('QR') // 'QR' | 'PAYCODE'
  const [copiedField, setCopiedField] = useState(null)
  const [countdown, setCountdown] = useState(900) // 15 mins

  useEffect(() => {
    if (!isOpen) return
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [isOpen])

  if (!isOpen) return null

  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60

  const bankInfo = {
    bankName: 'MBBank (Ngân hàng TMCP Quân Đội)',
    bankCode: 'MB',
    accountNo: '0987654321',
    accountName: 'AEROSMART AIRWAYS CORP',
    memo: `AEROSMART ${bookingRef || 'FLIGHT'}`,
    payCode: `PAY-${(bookingRef || 'AERO').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    amount: amount || 0,
  }

  // VietQR Dynamic Image URL
  const vietQrUrl = `https://img.vietqr.io/image/MB-0987654321-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
    bankInfo.memo
  )}&accountName=${encodeURIComponent(bankInfo.accountName)}`

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 dark:bg-navy-900 dark:border-navy-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with VietQR / Napas 247 Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-navy-950 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white font-black shadow-lg">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  {isVi ? 'Napas 24/7 · Cổng Thanh Toán Hàng Không' : (isKm ? 'ច្រកទូទាត់ប្រាក់ ២៤/៧' : 'Napas 24/7 · Aviation Payment Gateway')}
                </span>
                <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-200 border border-emerald-400/30">
                  {isVi ? 'Khớp lệnh tự động' : (isKm ? 'ស្វ័យប្រវត្តិ' : 'Auto Matching')}
                </span>
              </div>
              <h3 className="text-lg font-black text-white">
                {isVi ? 'Thanh toán vé máy bay AeroSmart' : (isKm ? 'ទូទាត់សំបុត្រយន្តហោះ AeroSmart' : 'Pay for AeroSmart Flight Ticket')}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher: QR Code vs Pay Code */}
        <div className="flex border-b border-slate-200 bg-slate-50 dark:bg-navy-950 dark:border-navy-800 px-6 pt-3 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('QR')}
            className={`pb-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'QR'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <QrCode className="h-4 w-4" />
            <span>{isVi ? 'Quét mã VietQR (Khuyên dùng)' : (isKm ? 'ស្កេនកូដ QR' : 'Scan VietQR (Recommended)')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PAYCODE')}
            className={`pb-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'PAYCODE'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Barcode className="h-4 w-4" />
            <span>{isVi ? 'Mã thanh toán / Chuyển khoản (Pay Code)' : (isKm ? 'កូដទូទាត់' : 'Payment Code / Pay Code')}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'QR' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Col: Dynamic QR Code Box */}
              <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-50 dark:bg-navy-950/60 p-4 rounded-2xl border border-slate-200 dark:border-navy-800 text-center">
                <div className="relative group">
                  <div className="overflow-hidden rounded-2xl border-2 border-emerald-500 bg-white p-2 shadow-md">
                    <img
                      src={vietQrUrl}
                      alt="VietQR Payment Code"
                      className="h-52 w-52 object-contain rounded-xl"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                          `00020101021238570010A00000072701270006970422011309876543210208QRIBFTTA5303704540${amount}5802VN62250821${bankInfo.memo}6304`
                        )}`
                      }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>
                      {isVi ? 'Hết hạn sau: ' : (isKm ? 'ផុតកំណត់ក្នុង: ' : 'Expires in: ')}
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  {isVi ? 'Mở app Ngân hàng bất kỳ để quét mã' : (isKm ? 'បើកកម្មវិធីធនាគារណាមួយដើម្បីស្កេន' : 'Open any Banking App to scan code')}
                </p>
              </div>

              {/* Right Col: Transfer Details */}
              <div className="md:col-span-7 space-y-3">
                <div className="rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-3 text-xs text-emerald-900 dark:text-emerald-200">
                  <div className="flex items-center justify-between font-bold">
                    <span>{isVi ? 'Tổng tiền thanh toán:' : (isKm ? 'ចំនួនទឹកប្រាក់សរុប:' : 'Total Amount:')}</span>
                    <span className="text-base font-black text-emerald-700 dark:text-emerald-400">
                      {formatPrice(amount, 'VND')}
                    </span>
                  </div>
                </div>

                {/* Bank Account Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950/40">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          {isVi ? 'Ngân hàng' : (isKm ? 'ធនាគារ' : 'Bank')}
                        </span>
                        <span className="font-bold text-navy-900 dark:text-white">{bankInfo.bankName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950/40">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          {isVi ? 'Số tài khoản' : (isKm ? 'លេខគណនី' : 'Account Number')}
                        </span>
                        <span className="font-mono font-bold text-sm text-navy-950 dark:text-white">{bankInfo.accountNo}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankInfo.accountNo, 'accountNo')}
                      className="inline-flex items-center gap-1 rounded-lg bg-white dark:bg-navy-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-navy-700 hover:bg-slate-100 shadow-sm"
                    >
                      {copiedField === 'accountNo' ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-600">{isVi ? 'Đã chép' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>{isVi ? 'Sao chép' : (isKm ? 'ចម្លង' : 'Copy')}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30">
                    <div>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-bold">
                        {isVi ? 'Nội dung chuyển khoản (Bắt buộc)' : (isKm ? 'ខ្លឹមសារផ្ទេរប្រាក់ (ចាំបាច់)' : 'Transfer Memo / Reference (Required)')}
                      </span>
                      <span className="font-mono font-bold text-sm text-emerald-900 dark:text-emerald-200">{bankInfo.memo}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankInfo.memo, 'memo')}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm"
                    >
                      {copiedField === 'memo' ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>{isVi ? 'Đã chép' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>{isVi ? 'Sao chép' : (isKm ? 'ចម្លង' : 'Copy')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Pay Code & Counter Payment Tab */
            <div className="space-y-4">
              <div className="rounded-2xl border-2 border-dashed border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 p-5 text-center">
                <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block mb-1">
                  {isVi ? 'Mã Thanh Toán Định Danh (Pay Code)' : (isKm ? 'កូដទូទាត់' : 'Unique Payment Identifier (Pay Code)')}
                </span>
                <p className="font-mono text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-widest">
                  {bankInfo.payCode}
                </p>
                <div className="mt-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleCopy(bankInfo.payCode, 'payCode')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow"
                  >
                    {copiedField === 'payCode' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedField === 'payCode' ? (isVi ? 'Đã sao chép mã' : 'Copied') : (isVi ? 'Sao chép Mã Thanh Toán' : (isKm ? 'ចម្លងកូដ' : 'Copy Pay Code'))}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950/40">
                  <span className="font-bold text-navy-900 dark:text-white block mb-1">
                    {isVi ? '🏪 Thanh toán tại cửa hàng tiện lợi' : '🏪 Pay at Convenience Stores'}
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    {isVi ? 'Đưa mã trên cho thu ngân tại WinMart, Circle K, 7-Eleven, FPT Shop hoặc Viettel Post để nộp tiền mặt.' : 'Show this code to cashiers at WinMart, Circle K, 7-Eleven, or partner stores.'}
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950/40">
                  <span className="font-bold text-navy-900 dark:text-white block mb-1">
                    {isVi ? '🏦 Chuyển khoản qua App Ngân hàng' : '🏦 Mobile Banking Transfer'}
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    {isVi ? `Nhập số tài khoản ${bankInfo.accountNo} (MBBank) với nội dung là ${bankInfo.memo}.` : `Transfer to account ${bankInfo.accountNo} (MBBank) with memo ${bankInfo.memo}.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-navy-950 px-6 py-4 border-t border-slate-200 dark:border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              {isVi ? 'Hệ thống tự động kích hoạt vé sau khi tiền vào tài khoản' : (isKm ? 'ប្រព័ន្ធនឹងបើកសំបុត្រដោយស្វ័យប្រវត្តិ' : 'Automated instant e-ticket issuance upon payment receipt')}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="btn-outline flex-1 sm:flex-initial py-2.5 px-4 text-xs font-bold"
            >
              {isVi ? 'Hủy' : (isKm ? 'បោះបង់' : 'Cancel')}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={onConfirmPayment}
              className="btn-primary flex-1 sm:flex-initial py-2.5 px-6 text-xs font-bold shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800"
            >
              {loading ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{isVi ? 'Đang khớp lệnh thanh toán...' : (isKm ? 'កំពុងដំណើរការ...' : 'Matching payment...')}</span>
                </>
              ) : (
                <>
                  <span>{isVi ? 'Xác nhận đã thanh toán xong' : (isKm ? 'បញ្ជាក់ការទូទាត់' : 'I have completed payment')}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

