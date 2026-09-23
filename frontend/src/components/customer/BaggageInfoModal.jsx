import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Luggage,
  X,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Mail,
  Package,
  Info,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function BaggageInfoModal({ isOpen, onClose }) {
  const { language } = useLanguage()
  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const [activeTab, setActiveTab] = useState('CABIN') // 'CABIN' | 'CHECKED' | 'RESTRICTED' | 'CONTACT'

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-navy-950/75 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 relative z-10">
        <div
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 dark:bg-navy-900 dark:border-navy-700 my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#003580] px-6 py-5 text-white flex items-center justify-between border-b border-blue-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm shadow-md">
                <Luggage className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                  {isVi ? 'Cẩm nang Bay AeroSmart' : (isKm ? 'ការណែនាំអំពីការធ្វើដំណើរ AeroSmart' : 'AeroSmart Travel Guide')}
                </span>
                <h3 className="text-lg font-black text-white">
                  {isVi ? 'Quy định Hành lý & Hỗ trợ Khách hàng' : (isKm ? 'បទប្បញ្ញត្តិឥវ៉ាន់ & ការគាំទ្រ' : 'Baggage Allowances & Travel Guide')}
                </h3>
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

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 px-6 pt-3 gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('CABIN')}
              className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'CABIN'
                  ? 'border-[#006ce4] text-[#006ce4] dark:border-sky-400 dark:text-sky-300'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Luggage className="h-3.5 w-3.5" />
              <span>{isVi ? 'Hành lý Xách tay' : (isKm ? 'ឥវ៉ាន់យួរដៃ' : 'Cabin Baggage')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('CHECKED')}
              className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'CHECKED'
                  ? 'border-[#006ce4] text-[#006ce4] dark:border-sky-400 dark:text-sky-300'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Package className="h-3.5 w-3.5" />
              <span>{isVi ? 'Hành lý Ký gửi' : (isKm ? 'ឥវ៉ាន់ផ្ញើ' : 'Checked Baggage')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('RESTRICTED')}
              className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'RESTRICTED'
                  ? 'border-rose-500 text-rose-600 dark:border-rose-400 dark:text-rose-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{isVi ? 'Vật phẩm Cấm / Hạn chế' : (isKm ? 'វត្ថុហាមឃាត់' : 'Restricted Items')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('CONTACT')}
              className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'CONTACT'
                  ? 'border-[#006ce4] text-[#006ce4] dark:border-sky-400 dark:text-sky-300'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>{isVi ? 'Hỗ trợ 24/7' : (isKm ? 'ជំនួយ ២៤/៧' : 'Support 24/7')}</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6 space-y-4">
            {activeTab === 'CABIN' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 dark:border-navy-800 p-4 bg-white dark:bg-navy-950 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-navy-950 dark:text-white">
                    <Luggage className="h-5 w-5 text-[#006ce4]" />
                    <span>{isVi ? 'Tiêu chuẩn Hành lý xách tay (Carry-on)' : (isKm ? 'ស្តង់ដារឥវ៉ាន់យួរដៃ (Carry-on)' : 'Carry-on Cabin Baggage Allowance')}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl bg-slate-50 dark:bg-navy-900 p-3 border border-slate-100 dark:border-navy-800">
                      <p className="font-bold text-slate-700 dark:text-slate-200">
                        {isVi ? 'Hạng Phổ thông (Economy)' : (isKm ? 'ថ្នាក់ធម្មតា (Economy)' : 'Economy Class')}
                      </p>
                      <p className="text-xl font-black text-[#003580] dark:text-sky-300 mt-1">10 kg / 22 lbs</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {isVi ? '1 kiện chính (56 x 36 x 23 cm) + 1 túi phụ kiện nhỏ (40 x 30 x 15 cm)' : (isKm ? '១ កញ្ចប់ធំ (56 x 36 x 23 cm) + ១ កាបូបតូច (40 x 30 x 15 cm)' : '1 standard bag (56 x 36 x 23 cm) + 1 personal accessory (40 x 30 x 15 cm)')}
                      </p>
                    </div>
                    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 p-3 border border-amber-200 dark:border-amber-800">
                      <p className="font-bold text-amber-900 dark:text-amber-200">
                        {isVi ? 'Hạng Thương gia (Business)' : (isKm ? 'ថ្នាក់ពាណិជ្ជកម្ម (Business)' : 'Business Class')}
                      </p>
                      <p className="text-xl font-black text-amber-700 dark:text-amber-300 mt-1">18 kg / 40 lbs</p>
                      <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-1 leading-relaxed">
                        {isVi ? '2 kiện chính + 1 túi phụ kiện cá nhân (laptop, balo nhỏ)' : (isKm ? '២ កញ្ចប់ធំ + ១ កាបូបផ្ទាល់ខ្លួន (កុំព្យូទ័រយួរដៃ កាបូបតូច)' : '2 standard bags + 1 personal accessory item (laptop, small backpack)')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-sky-100 bg-sky-50 dark:border-sky-950 dark:bg-sky-950/40 p-3 text-xs text-sky-900 dark:text-sky-200 leading-relaxed">
                  <Info className="h-4 w-4 shrink-0 text-[#006ce4] mt-0.5" />
                  <span>
                    {isVi
                      ? 'Quy định chất lỏng trên các chuyến bay: Mỗi chai lọ tối đa 100ml, tổng dung tích không vượt quá 1 lít và phải được bảo quản trong túi zip trong suốt có thể đóng kín lại.'
                      : (isKm
                        ? 'បទប្បញ្ញត្តិវត្ថុរាវលើជើងហោះហើរ: ដបនីមួយៗមិនលើសពី 100ml សរុបមិនលើសពី 1 លីត្រ ដាក់ក្នុងថង់ថ្លាដែលអាចបិទជិត។'
                        : 'Liquid rules on flights: Containers must not exceed 100ml each, maximum total 1 liter packed inside a single transparent resealable plastic bag.')}
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'CHECKED' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 dark:border-navy-800 p-4 bg-white dark:bg-navy-950 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-navy-950 dark:text-white">
                    <Package className="h-5 w-5 text-[#006ce4]" />
                    <span>{isVi ? 'Tiêu chuẩn Hành lý Ký gửi (Checked Baggage)' : (isKm ? 'ស្តង់ដារឥវ៉ាន់ផ្ញើ (Checked Baggage)' : 'Checked Baggage Standard')}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl bg-slate-50 dark:bg-navy-900 p-3 border border-slate-100 dark:border-navy-800">
                      <p className="font-bold text-slate-700 dark:text-slate-200">
                        {isVi ? 'Hạng Phổ thông' : (isKm ? 'ថ្នាក់ធម្មតា' : 'Economy Class')}
                      </p>
                      <p className="text-xl font-black text-[#003580] dark:text-sky-300 mt-1">
                        {isVi ? '1 kiện 23 kg' : (isKm ? '១ កញ្ចប់ ២៣ គីឡូក្រាម' : '1 piece 23 kg')}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {isVi ? 'Tổng kích thước 3 chiều tối đa 158 cm (62 inch)' : (isKm ? 'ទំហំសរុបអតិបរមា ១៥៨ សង់ទីម៉ែត្រ' : 'Total dimensions max 158 cm (62 in)')}
                      </p>
                    </div>
                    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 p-3 border border-amber-200 dark:border-amber-800">
                      <p className="font-bold text-amber-900 dark:text-amber-200">
                        {isVi ? 'Hạng Thương gia' : (isKm ? 'ថ្នាក់ពាណិជ្ជកម្ម' : 'Business Class')}
                      </p>
                      <p className="text-xl font-black text-amber-700 dark:text-amber-300 mt-1">
                        {isVi ? '2 kiện 32 kg / kiện' : (isKm ? '២ កញ្ចប់ ៣២ គីឡូក្រាម/កញ្ចប់' : '2 pieces 32 kg each')}
                      </p>
                      <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-1 leading-relaxed">
                        {isVi ? 'Gắn thẻ ưu tiên nhận hành lý trước tại băng chuyền (Priority Tag)' : (isKm ? 'ភ្ជាប់ស្លាកអាទិភាពដើម្បីទទួលឥវ៉ាន់មុនគេនៅព្រលានយន្តហោះ' : 'Priority Tag for expedited baggage delivery at carousel')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/40 p-3.5 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <div>
                    <p className="font-bold">
                      {isVi ? 'Ưu đãi mua thêm hành lý trực tuyến' : (isKm ? 'ការបញ្ចុះតម្លៃទិញឥវ៉ាន់បន្ថែមតាមអ៊ីនធឺណិត' : 'Pre-purchase Baggage Discount')}
                    </p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                      {isVi
                        ? 'Tiết kiệm đến 40% chi phí so với mua trực tiếp tại quầy check-in sân bay.'
                        : (isKm
                          ? 'សន្សំបានរហូតដល់ 40% ធៀបនឹងការទិញផ្ទាល់នៅបញ្ជរព្រលានយន្តហោះ។'
                          : 'Save up to 40% when purchasing baggage online before arriving at airport.')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'RESTRICTED' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-rose-200 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-950/30 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-rose-800 dark:text-rose-300">
                    <AlertTriangle className="h-5 w-5 text-rose-600" />
                    <span>
                      {isVi ? 'Vật phẩm CẤM tuyệt đối mang lên tàu bay' : (isKm ? 'វត្ថុដែលត្រូវបានហាមឃាត់ទាំងស្រុង' : 'Prohibited Dangerous Goods & Restricted Items')}
                    </span>
                  </div>
                  <ul className="text-xs text-rose-900/90 dark:text-rose-200/90 space-y-1.5 list-disc list-inside leading-relaxed">
                    <li>{isVi ? 'Chất nổ, vật liệu nổ, pháo hoa, đạn dược và vũ khí.' : (isKm ? 'គ្រឿងផ្ទុះ ផាវ គ្រាប់រំសេវ និងអាវុធ។' : 'Explosives, fireworks, flares, ammunition and firearms.')}</li>
                    <li>{isVi ? 'Khí ga dễ cháy, bình xịt hơi cay, chất độc hóa học, chất phóng xạ.' : (isKm ? 'ឧស្ម័នងាយឆេះ ថ្នាំបាញ់ម្រេច ជាតិគីមីពុល វត្ថុធាតុវិទ្យុសកម្ម។' : 'Flammable gases, pepper sprays, toxic chemical substances, radioactive materials.')}</li>
                    <li>{isVi ? 'Pin Lithium dung lượng trên 160Wh hoặc thiết bị tự hành chạy bằng pin không tháo rời.' : (isKm ? 'ថ្មលីចូមលើសពី 160Wh ឬឧបករណ៍ស្វ័យប្រវត្តិ។' : 'Lithium batteries exceeding 160Wh or hoverboards with non-removable batteries.')}</li>
                    <li>{isVi ? 'Dao, kéo, vật sắc nhọn kim loại trong hành lý xách tay (phải gửi ký gửi).' : (isKm ? 'កាំបិត កន្ត្រៃ វត្ថុមុតស្រួចក្នុងឥវ៉ាន់យួរដៃ (ត្រូវផ្ញើក្នុងឥវ៉ាន់ធំ)។' : 'Knives, scissors, metal blades in cabin bags (must be packed in checked bags).')}</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30 p-3.5 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <strong>{isVi ? 'Lưu ý về Pin sạc dự phòng (Powerbank): ' : (isKm ? 'ការកត់សម្គាល់អំពី Powerbank: ' : 'Power Bank Rule: ')}</strong>
                  {isVi ? 'Bắt buộc để trong hành lý xách tay, tuyệt đối không được gửi trong hành lý ký gửi.' : (isKm ? 'ត្រូវតែទុកក្នុងឥវ៉ាន់យួរដៃ មិនត្រូវផ្ញើក្នុងឥវ៉ាន់ធំឡើយ។' : 'Must be packed in carry-on baggage only. Strictly prohibited in checked bags.')}
                </div>
              </div>
            )}

            {activeTab === 'CONTACT' && (
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-200 dark:border-navy-800 p-4 bg-white dark:bg-navy-950 space-y-3">
                  <h4 className="text-sm font-bold text-navy-950 dark:text-white">
                    {isVi ? 'Trung tâm Chăm sóc & Hỗ trợ Khách hàng 24/7' : (isKm ? 'មជ្ឈមណ្ឌលថែទាំអតិថិជន ២៤/៧' : '24/7 Passenger Support & Care Center')}
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800">
                      <PhoneCall className="h-5 w-5 text-[#006ce4]" />
                      <div>
                        <p className="text-[11px] text-slate-400">
                          {isVi ? 'Tổng đài đặt vé & hỗ trợ 24/7' : (isKm ? 'លេខទូរស័ព្ទទាន់ហេតុការណ៍ ២៤/៧' : '24/7 Booking & Support Hotline')}
                        </p>
                        <p className="text-sm font-black text-navy-950 dark:text-white">1900 1100 / 024 38320320</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800">
                      <Mail className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-[11px] text-slate-400">
                          {isVi ? 'Email Hỗ trợ Hành khách' : (isKm ? 'អ៊ីមែលគាំទ្រអ្នកដំណើរ' : 'Passenger Support Email')}
                        </p>
                        <p className="text-xs font-bold text-navy-950 dark:text-white">support@aerosmart.vn</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 dark:bg-navy-950 px-6 py-4 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isVi ? 'Áp dụng theo quy định của Cục Hàng không Dân dụng & IATA' : (isKm ? 'អនុវត្តតាមបទប្បញ្ញត្តិរបស់អាជ្ញាធរអាកាសចរស៊ីវិល និង IATA' : 'Applicable per Civil Aviation Authority & IATA guidelines')}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="btn-primary py-2 px-5 text-xs font-bold"
            >
              {isVi ? 'Đã hiểu' : (isKm ? 'យល់ព្រម' : 'Got it')}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
