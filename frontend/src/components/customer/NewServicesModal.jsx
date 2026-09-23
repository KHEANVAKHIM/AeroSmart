import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  X,
  Armchair,
  Car,
  Utensils,
  ShieldCheck,
  Zap,
  Hotel,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Star,
  QrCode,
  Copy,
  Check,
  Calendar,
  MapPin,
  User,
  Ticket,
  ChevronLeft,
  BadgeCheck,
  Award,
  Eye,
  Camera,
  ThumbsUp,
  Clock,
  Plane,
  Info,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useCurrency } from '../../context/CurrencyContext'

const LOCAL_STORAGE_KEY = 'aerosmart_booked_services'

export default function NewServicesModal({ isOpen, onClose, initialService = null, initialMode = 'EXPLORE' }) {
  const navigate = useNavigate()
  const { language, t } = useLanguage()
  const { formatPrice } = useCurrency()

  const isVi = language?.code === 'vi'
  const isKm = language?.code === 'km'

  const [activeTab, setActiveTab] = useState('EXPLORE') // 'EXPLORE' | 'MY_VOUCHERS'
  const [selectedService, setSelectedService] = useState(null)
  const [previewService, setPreviewService] = useState(null) // Photo & Details Gallery preview
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [activeVoucher, setActiveVoucher] = useState(null)
  const [bookedServices, setBookedServices] = useState([])
  const [copiedCode, setCopiedCode] = useState(false)

  // Customization Form States
  const [guestCount, setGuestCount] = useState(1)
  const [selectedAirport, setSelectedAirport] = useState('HAN')
  const [bookingDate, setBookingDate] = useState('2026-09-25')
  const [destinationHotel, setDestinationHotel] = useState('Khách sạn Trung Tâm TP (Downtown Hotel)')
  const [vehicleType, setVehicleType] = useState('SEDAN') // 'SEDAN' | 'SEDONA' | 'VAN'
  const [flightNumber, setFlightNumber] = useState('VN-HASG1-0921')
  const [selectedMeal, setSelectedMeal] = useState('PHO_BO')
  const [insuranceTier, setInsuranceTier] = useState('COMPREHENSIVE') // 'BASIC' | 'COMPREHENSIVE' | 'VIP'
  const [passengerName, setPassengerName] = useState('NGUYEN VAN AN')
  const [hotelNights, setHotelNights] = useState(2)

  // Handle initialService & initialMode when opened
  useEffect(() => {
    if (isOpen) {
      if (initialService) {
        if (initialMode === 'PREVIEW') {
          const serviceWithGallery = {
            ...initialService,
            gallery: initialService.gallery || [
              { url: initialService.coverImg, label: initialService.title },
            ],
            highlights: initialService.highlights || [
              isVi ? 'Dịch vụ đạt tiêu chuẩn chất lượng hàng không 5 sao' : '5-star airline standard certified service',
              isVi ? 'Được phục vụ bởi đội ngũ nhân sự chuyên nghiệp' : 'Dedicated professional assistance staff',
              isVi ? 'Hỗ trợ đổi ngày hoặc hoàn tiền khi chuyến bay bị hoãn/hủy' : 'Flexible date change or full refund if flight cancelled',
            ],
            included: initialService.included || [
              isVi ? 'Toàn bộ dịch vụ tiêu chuẩn theo gói' : 'All standard package inclusions',
              isVi ? 'Bảo hiểm trách nhiệm dịch vụ hành khách' : 'Complete passenger service insurance',
            ],
            testimonial: initialService.testimonial || {
              author: 'Hành khách AeroSmart',
              comment: isVi ? 'Dịch vụ rất tốt, đúng giờ và tiện lợi!' : 'Superb service, punctual and highly convenient!',
            },
          }
          setPreviewService(serviceWithGallery)
          setSelectedService(null)
          setActiveGalleryIndex(0)
        } else if (initialMode === 'CUSTOMIZE') {
          setSelectedService(initialService)
          setPreviewService(null)
        }
      } else {
        setSelectedService(null)
        setPreviewService(null)
        setActiveTab('EXPLORE')
      }
    }
  }, [isOpen, initialService, initialMode])

  // Load booked services from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        setBookedServices(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Error loading services', e)
    }
  }, [isOpen])

  if (!isOpen) return null

  const services = [
    {
      id: 'lounge',
      icon: Armchair,
      coverImg: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
      gallery: [
        { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80', label: isVi ? 'Không gian Thương gia VIP' : 'Luxury Lounge Interior' },
        { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', label: isVi ? 'Buffet Ẩm thực Á - Âu' : 'Gourmet Hot Buffet' },
        { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80', label: isVi ? 'Ghế massage & Thư giãn' : 'Relaxation Massage Pods' },
        { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80', label: isVi ? 'Khu làm việc & Wi-Fi tốc độ cao' : 'High-speed Work Suite' },
      ],
      rating: '4.9',
      reviewCount: 1420,
      badge: isVi ? 'HOT · THƯƠNG GIA' : (isKm ? 'ពេញនិយម · VIP' : 'POPULAR · VIP'),
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200',
      title: isVi ? 'Phòng chờ Thương gia VIP (Lotus / SkyLounge)' : (isKm ? 'បន្ទប់ទទួលភ្ញៀវ VIP (Lotus / SkyLounge)' : 'VIP Airport Lounge Pass (Lotus / SkyLounge)'),
      desc: isVi
        ? 'Thưởng thức buffet ẩm thực Á-Âu, ghế massage thư giãn, wifi tốc độ cao và phòng tắm riêng trước giờ bay.'
        : (isKm
          ? 'រីករាយជាមួយអាហារប៊ូហ្វេ កៅអីម៉ាស្សា និងបន្ទប់សម្រាកពិសេសមុនពេលហោះហើរ។'
          : 'Enjoy gourmet hot buffet, relaxing massage chairs, high-speed Wi-Fi and private shower suites before flight.'),
      price: 350000,
      unit: isVi ? '/ khách' : (isKm ? '/ នាក់' : '/ pax'),
      popular: true,
      color: 'amber',
      highlights: isVi
        ? ['Buffet không giới hạn món nóng, tráng miệng & rượu vang cao cấp', 'Khu nghỉ ngơi yên tĩnh có ghế massage tự động', 'Phòng tắm tiện nghi với đồ vệ sinh cá nhân cao cấp', 'Khu vực làm việc riêng tư với Wi-Fi tốc độ 100Mbps']
        : ['Unlimited hot gourmet buffet, snacks & wine', 'Quiet relaxation area with auto-massage chairs', 'Private shower suites with luxury amenities', 'Private business workstation with 100Mbps Wi-Fi'],
      included: isVi
        ? ['Thời gian sử dụng lên đến 3 tiếng trước giờ bay', 'Toàn bộ đồ ăn & thức uống trong thực đơn buffet', 'Khu vực tắm nóng lạnh & khăn tắm miễn phí']
        : ['Up to 3 hours lounge stay before departure', 'All buffet foods, juices, coffee & selected alcoholic drinks', 'Free shower amenities & clean towels'],
      excluded: isVi
        ? ['Dịch vụ xe đưa đón ra cửa máy bay (cần mua gói Fast-Track)', 'Đồ uống có cồn nhập khẩu cao cấp ngoài menu tiêu chuẩn']
        : ['Tarmac buggy transport (available in Fast-Track package)', 'Ultra-premium imported spirits outside standard menu'],
      testimonial: {
        author: 'Nguyễn Thanh Tùng · Doanh nhân',
        comment: isVi ? 'Phòng chờ cực kỳ sang trọng, đồ ăn nóng ngon miệng và có chỗ tắm sạch sẽ giúp tôi hồi phục sức khỏe trước chuyến bay dài.' : 'Superb lounge with delicious hot food and clean shower suites. Highly recommended!',
      },
    },
    {
      id: 'transfer',
      icon: Car,
      coverImg: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
      gallery: [
        { url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80', label: isVi ? 'Xe Sedan Hạng Sang (Camry / Mercedes)' : 'Luxury Executive Sedan' },
        { url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80', label: isVi ? 'VIP Limousine 7 Chỗ (Kia Carnival / Sedona)' : 'VIP 7-Seater Carnival Limousine' },
        { url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80', label: isVi ? 'Tài xế đón tiếp cầm bảng tên tại sảnh' : 'Chauffeur with Name Board Welcome' },
      ],
      rating: '4.8',
      reviewCount: 980,
      badge: isVi ? 'MỚI 2026' : (isKm ? 'ថ្មី ២០២៦' : 'NEW 2026'),
      badgeColor: 'bg-sky-100 text-[#003580] border-sky-300 dark:bg-sky-950 dark:text-sky-200',
      title: isVi ? 'Xe đưa đón Sân bay Cao cấp (Airport Limousine)' : (isKm ? 'សេវារថយន្តទំនើបជូនដំណើរ' : 'Airport Limousine & Fast Transfer'),
      desc: isVi
        ? 'Đưa đón tận nơi từ sân bay về khách sạn/nhà riêng bằng dòng xe Sedan & Sedona cao cấp với tài xế chuyên nghiệp.'
        : (isKm
          ? 'សេវាកម្មរថយន្តទំនើបជូនដំណើរពីព្រលានយន្តហោះទៅកាន់សណ្ឋាគារ ឬគេហដ្ឋានរបស់អ្នក។'
          : 'Door-to-door premium airport transfer with luxury Sedans & Vans, tracking your flight schedule in real-time.'),
      price: 280000,
      unit: isVi ? '/ chuyến' : (isKm ? '/ ជើង' : '/ trip'),
      color: 'sky',
      highlights: isVi
        ? ['Tự động theo dõi số hiệu chuyến bay, miễn phí chờ khi chuyến bay bị hoãn', 'Tài xế lịch sự, hỗ trợ bốc xếp toàn bộ hành lý', 'Nước suối lạnh, khăn ướt và sạc điện thoại trên xe', 'Đón đúng giờ tại làn xe ưu tiên trước sảnh đến']
        : ['Real-time flight tracking, 60-minute free wait time if flight delayed', 'Courteous chauffeur with complete luggage assistance', 'Complimentary bottled water, chilled towels & USB chargers', 'Priority pick-up lane right outside arrival terminal'],
      included: isVi
        ? ['Phí cầu đường sân bay & xăng dầu trọn gói', 'Bảo hiểm hành khách trên suốt hành trình']
        : ['All toll fees, airport surcharges & fuel included', 'Full passenger insurance during the trip'],
      excluded: isVi
        ? ['Phát sinh thêm điểm dừng đỗ ngoài lộ trình đăng ký']
        : ['Additional stops outside the booked direct route'],
      testimonial: {
        author: 'Trần Minh Anh · Du khách',
        comment: isVi ? 'Chuyến bay của mình bị trễ 45 phút nhưng bác tài vẫn chờ chu đáo ở cửa sảnh đến với biển tên. Xe thơm tho, êm ái.' : 'Flight was delayed by 45 mins, but the driver waited at arrival hall with my name sign. Car was clean and comfortable!',
      },
    },
    {
      id: 'dining',
      icon: Utensils,
      coverImg: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80',
      gallery: [
        { url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80', label: isVi ? 'Phở Bò Thăng Long Truyền Thống' : 'Thang Long Beef Pho' },
        { url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80', label: isVi ? 'Cơm Gà Hải Nam Hoàng Gia' : 'Royal Hainanese Chicken Rice' },
        { url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80', label: isVi ? 'Bò Sốt Vang Bánh Mì Kiểu Pháp' : 'French Beef Bourguignon' },
        { url: 'https://images.unsplash.com/photo-1558857563-b37cf5a5c0b7?w=800&auto=format&fit=crop&q=80', label: isVi ? 'Combo Trà Sữa Trân Châu + Bánh Mousse' : 'Signature Boba Tea & Cake' },
      ],
      rating: '4.9',
      reviewCount: 2150,
      badge: isVi ? 'ƯU ĐÃI ĐẶT TRƯỚC' : (isKm ? 'បញ្ចុះតម្លៃ ២៥%' : 'PRE-ORDER SAVE 25%'),
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-200',
      title: isVi ? 'Ẩm thực Nóng & Trà sữa Trên Mây (Sky Dining)' : (isKm ? 'អាហារក្តៅ & ភេសជ្ជៈលើអាកាស' : 'Gourmet In-Flight Hot Meals & Drinks'),
      desc: isVi
        ? 'Chọn trước các món ăn đặc sắc như Phở Bò Thăng Long, Cơm gà Hải Nam, Bò sốt vang và Trà sữa trân châu.'
        : (isKm
          ? 'ជ្រើសរើសអាហារក្តៅៗឈ្ងុយឆ្ងាញ់ដូចជា បាយមាន់ គុយទាវ និងភេសជ្ជៈពិសេស។'
          : 'Pre-order hot in-flight gourmet meals like Roasted Chicken, Beef Stew, and Signature Boba Milk Tea.'),
      price: 95000,
      unit: isVi ? '/ phần' : (isKm ? '/ ឈុត' : '/ set'),
      color: 'rose',
      highlights: isVi
        ? ['Chế biến nóng hổi ngay khi máy bay đạt độ cao ổn định', 'Nguyên liệu tươi ngon chuẩn bếp hàng không quốc tế', 'Phục vụ kèm nước khoáng thiên nhiên và khăn ướt', 'Tiết kiệm 25% chi phí so với mua trực tiếp trên máy bay']
        : ['Freshly heated once cruising altitude reached', 'Premium ingredients certified by international airline caterers', 'Served with natural mineral water & refreshment wipes', 'Save 25% compared to purchasing on board'],
      included: isVi
        ? ['1 Suất ăn nóng theo món đã chọn', '1 Chai nước suối thiên nhiên', 'Bộ dao nĩa & khăn giấy cao cấp']
        : ['1 Gourmet hot dish of choice', '1 Natural bottled water', 'Eco cutlery & napkin set'],
      excluded: isVi
        ? ['Các loại rượu vang & bia lon (mua thêm trên máy bay)']
        : ['Alcoholic beers & wines (available for purchase on board)'],
      testimonial: {
        author: 'Lê Hoàng Yến · Food Blogger',
        comment: isVi ? 'Phở bò trên mây thơm nức mũi, nước dùng đậm đà không thua kém gì quán phở truyền thống ở Hà Nội.' : 'The beef pho served warm at 30,000 feet was outstanding. Fresh aroma and flavorful broth!',
      },
    },
    {
      id: 'fasttrack',
      icon: Zap,
      coverImg: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80',
      gallery: [
        { url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80', label: isVi ? 'Làn soi chiếu an ninh ưu tiên' : 'Priority Security Screening Lane' },
        { url: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&auto=format&fit=crop&q=80', label: isVi ? 'Nhân viên hỗ trợ đón tại sảnh' : 'Dedicated VIP Concierge Staff' },
      ],
      rating: '4.9',
      reviewCount: 760,
      badge: isVi ? 'TIẾT KIỆM 45 PHÚT' : (isKm ? 'រហ័ស ៤៥ នាទី' : 'FAST-TRACK 45M'),
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200',
      title: isVi ? 'Lối đi Ưu tiên & Soát vé Nhanh (Fast-Track Priority)' : (isKm ? 'ច្រកទ្វារអាទិភាព & សន្តិសុខរហ័ស' : 'Fast-Track Priority Security & Boarding'),
      desc: isVi
        ? 'Bỏ qua xếp hàng tại cổng soi chiếu an ninh và quầy làm thủ tục. Hướng dẫn viên đón tiếp hỗ trợ từ sảnh.'
        : (isKm
          ? 'មិនបាច់តម្រង់ជួរយូរនៅច្រកត្រួតពិនិត្យសុវត្ថិភាព។ ទទួលបានការស្វាគមន៍ពិសេស។'
          : 'Skip long queues at security checkpoints and boarding gates with dedicated priority escort staff.'),
      price: 180000,
      unit: isVi ? '/ khách' : (isKm ? '/ នាក់' : '/ pax'),
      color: 'emerald',
      highlights: isVi
        ? ['Không phải xếp hàng chờ đợi tại khu soi chiếu an ninh sân bay', 'Nhân viên lễ tân đón tại cửa sảnh và dẫn qua lối đi VIP', 'Gắn thẻ hành lý ưu tiên (Priority Baggage Tag)', 'Lên máy bay bằng cửa ưu tiên (Priority Boarding Gate)']
        : ['Skip 45-minute queues at security screening gates', 'Airport staff greets at entrance & escorts through VIP lane', 'Priority baggage tags for fastest luggage claim', 'Priority boarding lane straight to aircraft'],
      included: isVi
        ? ['Lối đi riêng tại an ninh sân bay', 'Hỗ trợ hành lý xách tay qua cổng kiểm tra']
        : ['Dedicated fast lane at security checkpoint', 'Escort assistance for carry-on luggage'],
      excluded: isVi
        ? ['Phòng chờ thương gia VIP (cần mua gói VIP Lounge riêng)']
        : ['VIP Lounge access (available separately)'],
      testimonial: {
        author: 'David Harrison · Chuyên gia quốc tế',
        comment: isVi ? 'Dịch vụ giúp tôi tiết kiệm gần 1 tiếng đồng hồ xếp hàng an ninh vào khung giờ cao điểm tại Nội Bài. Cực kỳ tiện lợi!' : 'Saved nearly an hour during rush hour at Hanoi airport. Flawless experience!',
      },
    },
    {
      id: 'insurance',
      icon: ShieldCheck,
      coverImg: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
      gallery: [
        { url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80', label: isVi ? 'Quyền lợi bồi thường tự động 24/7' : '24/7 Instant Claim Guarantee' },
        { url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80', label: isVi ? 'An tâm trọn vẹn cùng gia đình' : 'Worry-free Family Protection' },
      ],
      rating: '5.0',
      reviewCount: 3890,
      badge: isVi ? 'AN TÂM 100%' : (isKm ? 'សុវត្ថិភាព ១០០%' : '100% COVERAGE'),
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-200',
      title: isVi ? 'Bảo hiểm Du lịch Toàn diện AeroCare 24/7' : (isKm ? 'ការធានារ៉ាប់រងការធ្វើដំណើរ AeroCare' : 'Comprehensive AeroCare Travel Insurance'),
      desc: isVi
        ? 'Bồi thường trễ chuyến bay từ 2 tiếng, đền bù thất lạc hành lý và viện phí y tế khẩn cấp lên đến 1 tỷ VNĐ.'
        : (isKm
          ? 'សំណងការពន្យារពេលជើងហោះហើរ បាត់បង់ឥវ៉ាន់ និងការចំណាយលើការព្យាបាលបន្ទាន់។'
          : 'Instant compensation for flight delays over 2h, lost baggage recovery, and emergency medical care.'),
      price: 65000,
      unit: isVi ? '/ chặng' : (isKm ? '/ ជើង' : '/ leg'),
      color: 'indigo',
      highlights: isVi
        ? ['Bồi thường tự động 1.000.000đ khi chuyến bay trễ từ 2 tiếng', 'Bồi thường mất mát hoặc hư hại hành lý lên đến 20.000.000đ', 'Chi trả chi phí y tế & cấp cứu tai nạn lên đến 1.000.000.000đ', 'Hotline hỗ trợ y tế toàn cầu 24/7 bằng tiếng Việt & tiếng Anh']
        : ['Auto-compensation $50 for flight delay > 2 hours', 'Up to $1,000 luggage damage & loss protection', 'Emergency medical & hospital coverage up to $50,000', '24/7 Global SOS medical hotline in VI/EN'],
      included: isVi
        ? ['Hợp đồng bảo hiểm điện tử gửi trực tiếp qua SMS & Email', 'Thủ tục yêu cầu bồi thường online 100% qua app trong 15 phút']
        : ['Digital insurance certificate sent instantly via email', '100% paperless fast-claim via app within 15 minutes'],
      excluded: isVi
        ? ['Các bệnh lý có sẵn từ trước khi tham gia bảo hiểm']
        : ['Pre-existing medical conditions diagnosed prior to departure'],
      testimonial: {
        author: 'Phạm Thị Lan · Hà Nội',
        comment: isVi ? 'Hành lý bị thất lạc khi bay transit, mình gửi hóa đơn bồi thường qua app và được chi trả chỉ sau 2 tiếng. Rất chuyên nghiệp!' : 'My luggage was delayed during transit, submitted claim on mobile and received payout within 2 hours!',
      },
    },
    {
      id: 'hotel',
      icon: Hotel,
      coverImg: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      gallery: [
        { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80', label: isVi ? 'Resort Nghỉ Dưỡng Biển 5 Sao' : '5-Star Beachfront Luxury Resort' },
        { url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80', label: isVi ? 'Phòng Ocean View Ban Công Riêng' : 'Deluxe Ocean View Balcony Suite' },
        { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80', label: isVi ? 'Hồ bơi vô cực & Spa thư giãn' : 'Infinity Pool & Sunset Spa' },
      ],
      rating: '4.9',
      reviewCount: 1650,
      badge: isVi ? 'GIẢM TỚI 30%' : (isKm ? 'បញ្ចុះតម្លៃ ៣០%' : 'SAVE UP TO 30%'),
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-200',
      title: isVi ? 'Combo Vé Bay + Khách sạn 4-5 Sao Nghỉ Dưỡng' : (isKm ? 'កញ្ចប់សំបុត្រ + សណ្ឋាគារ ៤-៥ ផ្កាយ' : 'Flight + 4-5 Star Luxury Hotel Packages'),
      desc: isVi
        ? 'Đặt vé kèm phòng tại Đà Nẵng, Phú Quốc, Nha Trang, Siem Reap, Bangkok nhận voucher ăn sáng và spa miễn phí.'
        : (isKm
          ? 'កក់សំបុត្រយន្តហោះរួមជាមួយសណ្ឋាគារលំដាប់ផ្កាយ ៤-៥ ជាមួយការបញ្ចុះតម្លៃពិសេស។'
          : 'Bundle flight with top-rated beachfront resorts and boutique luxury hotels worldwide.'),
      price: 1200000,
      unit: isVi ? '/ đêm' : (isKm ? '/ យប់' : '/ night'),
      color: 'purple',
      highlights: isVi
        ? ['Tiết kiệm đến 30% so với đặt phòng khách sạn và vé máy bay riêng lẻ', 'Miễn phí bữa sáng buffet quốc tế hàng ngày cho 2 người', 'Tặng voucher liệu trình Spa thư giãn 30 phút tại resort', 'Miễn phí hủy phòng hoặc đổi ngày trước 48 giờ']
        : ['Save up to 30% compared to booking flights & hotels separately', 'Complimentary daily international buffet breakfast for 2', 'Free 30-min spa wellness voucher at resort', 'Free cancellation or date change up to 48 hours prior'],
      included: isVi
        ? ['Phòng Deluxe Ocean/City View tại khách sạn 4-5 sao', 'Bữa sáng buffet thịnh soạn', 'Sử dụng hồ bơi vô cực & phòng gym']
        : ['Deluxe Ocean/City View Room in 4-5 star property', 'Daily gourmet breakfast buffet', 'Unlimited access to infinity pool & fitness gym'],
      excluded: isVi
        ? ['Chi phí sử dụng minibar & giặt ủi tại phòng']
        : ['Minibar consumptions & express laundry services'],
      testimonial: {
        author: 'Hoàng Nam & Mai Chi · Cặp đôi nghỉ dưỡng',
        comment: isVi ? 'Gói combo Phú Quốc cực hời, phòng hướng biển tuyệt đẹp và được tặng voucher spa massage thư thái.' : 'Amazing combo deal for Phu Quoc trip! Beautiful ocean view suite and lovely complimentary spa.',
      },
    },
  ]

  // Calculate customized price
  const calculateTotal = (service) => {
    if (!service) return 0
    if (service.id === 'lounge' || service.id === 'fasttrack') {
      return service.price * guestCount
    }
    if (service.id === 'transfer') {
      const extra = vehicleType === 'SEDONA' ? 50000 : vehicleType === 'VAN' ? 100000 : 0
      return service.price + extra
    }
    if (service.id === 'insurance') {
      const mult = insuranceTier === 'VIP' ? 3.5 : insuranceTier === 'COMPREHENSIVE' ? 1.8 : 1
      return Math.round(service.price * mult)
    }
    if (service.id === 'hotel') {
      return service.price * hotelNights
    }
    return service.price
  }

  // Handle Confirmed Booking of a Service
  const handleConfirmServiceBooking = (service) => {
    const totalAmount = calculateTotal(service)
    const voucherId = `SRV-${service.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    const newVoucher = {
      voucherId,
      serviceId: service.id,
      title: service.title,
      iconName: service.id,
      coverImg: service.coverImg,
      date: bookingDate,
      totalAmount,
      guestCount,
      passengerName,
      airport: selectedAirport,
      details:
        service.id === 'lounge'
          ? `Lounge Pass at Airport ${selectedAirport} (${guestCount} Guest${guestCount > 1 ? 's' : ''})`
          : service.id === 'transfer'
          ? `Airport Limousine (${vehicleType}) to ${destinationHotel}`
          : service.id === 'dining'
          ? `Sky Dining Meal Set (${selectedMeal})`
          : service.id === 'fasttrack'
          ? `VIP Fast-Track Security & Boarding at ${selectedAirport}`
          : service.id === 'insurance'
          ? `AeroCare Insurance Plan (${insuranceTier})`
          : `Luxury Hotel Resort Package (${hotelNights} Nights)`,
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED',
    }

    const updated = [newVoucher, ...bookedServices]
    setBookedServices(updated)
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }

    setActiveVoucher(newVoucher)
    setSelectedService(null)
    setPreviewService(null)
  }

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  // Dynamic image preview for customization step
  const getCustomizationImage = (service) => {
    if (!service) return ''
    if (service.id === 'dining') {
      if (selectedMeal === 'PHO_BO') return 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80'
      if (selectedMeal === 'COM_GA') return 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80'
      if (selectedMeal === 'BO_SOT_VANG') return 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'
      if (selectedMeal === 'TRA_SUA') return 'https://images.unsplash.com/photo-1558857563-b37cf5a5c0b7?w=800&auto=format&fit=crop&q=80'
      return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80'
    }
    if (service.id === 'transfer') {
      if (vehicleType === 'SEDONA') return 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80'
      if (vehicleType === 'VAN') return 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800&auto=format&fit=crop&q=80'
      return 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'
    }
    return service.coverImg
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-navy-950/80 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 relative z-10">
        <div
          className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 dark:bg-navy-900 dark:border-navy-700 my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00205B] via-[#003580] to-[#0A4B9C] px-6 py-5 text-white flex items-center justify-between border-b border-blue-900">
            <div className="flex items-center gap-3.5">
              {previewService || selectedService || activeVoucher ? (
                <button
                  type="button"
                  onClick={() => {
                    if (selectedService) {
                      setSelectedService(null)
                    } else if (previewService) {
                      setPreviewService(null)
                    } else if (activeVoucher) {
                      setActiveVoucher(null)
                    }
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white hover:bg-white/25 transition-all shadow"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-md shadow-md border border-white/20">
                  <Sparkles className="h-6 w-6 text-amber-300" />
                </div>
              )}
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider mb-0.5">
                  <span>
                    {isVi ? '★ ĐẶC QUYỀN HÀNG KHÔNG AEROSMART' : (isKm ? '★ សេវាកម្មផ្តាច់មុខ AEROSMART' : '★ AEROSMART EXCLUSIVE ANCILLARIES')}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {previewService
                    ? (isVi ? `Ảnh & Chi Tiết: ${previewService.title}` : `Photos & Details: ${previewService.title}`)
                    : selectedService
                    ? (isVi ? 'Tùy chỉnh & Kích hoạt Dịch vụ' : (isKm ? 'កំណត់សេវាកម្ម' : 'Customize & Activate Service'))
                    : activeVoucher
                    ? (isVi ? 'Voucher Điện Tử Đã Kích Hoạt' : (isKm ? 'ប័ណ្ណសេវាកម្ម' : 'Service E-Voucher Issued'))
                    : (isVi ? 'Dịch vụ & Tiện ích Hàng không Mới' : (isKm ? 'សេវាកម្ម & បទពិសោធន៍ថ្មី' : 'New Airline Services & Travel Extras'))}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs (Only shown on top-level explore) */}
          {!previewService && !selectedService && !activeVoucher && (
            <div className="flex border-b border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 px-6 pt-3 gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('EXPLORE')}
                className={`pb-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 ${
                  activeTab === 'EXPLORE'
                    ? 'border-[#003580] text-[#003580] dark:border-sky-400 dark:text-sky-300'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>{isVi ? 'Khám phá 6 Dịch vụ Mới' : (isKm ? 'ស្វែងរកសេវាកម្ម' : 'Explore 6 New Services')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('MY_VOUCHERS')}
                className={`pb-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 ${
                  activeTab === 'MY_VOUCHERS'
                    ? 'border-[#003580] text-[#003580] dark:border-sky-400 dark:text-sky-300'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                <Ticket className="h-4 w-4" />
                <span>{isVi ? 'Dịch vụ đã đăng ký' : (isKm ? 'សេវាកម្មរបស់ខ្ញុំ' : 'My Active Services')} ({bookedServices.length})</span>
              </button>
            </div>
          )}

          {/* Body Content */}
          <div className="p-6 sm:p-8 max-h-[78vh] overflow-y-auto space-y-6">

            {/* VIEW 0: PREVIEW GALLERY & DETAILS MODAL */}
            {previewService && (
              <div className="space-y-6 animate-fadeIn">
                {/* Photo Carousel & Info Top Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Photo Viewer Left */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-900 border border-slate-200 dark:border-navy-800 shadow-md group">
                      <img
                        src={previewService.gallery[activeGalleryIndex]?.url || previewService.coverImg}
                        alt="Service Preview"
                        className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                      
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                        <span className="text-xs font-semibold backdrop-blur-md bg-black/40 px-3 py-1 rounded-full border border-white/20">
                          📷 {previewService.gallery[activeGalleryIndex]?.label}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-black/50 px-2.5 py-1 rounded-full border border-amber-400/30">
                          <Star className="h-3.5 w-3.5 fill-amber-400" />
                          <span>{previewService.rating} / 5.0 ({previewService.reviewCount}+)</span>
                        </div>
                      </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-2">
                      {previewService.gallery.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveGalleryIndex(idx)}
                          className={`relative aspect-[16/10] overflow-hidden rounded-xl border-2 transition-all ${
                            activeGalleryIndex === idx
                              ? 'border-[#003580] ring-2 ring-[#003580]/30 scale-105'
                              : 'border-slate-200 dark:border-navy-800 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img.url} alt={img.label} className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary & Price Right */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border inline-block ${previewService.badgeColor}`}>
                        {previewService.badge}
                      </span>
                      <h3 className="text-xl font-black text-navy-950 dark:text-white leading-tight">
                        {previewService.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {previewService.desc}
                      </p>

                      <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs">
                        <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 mb-1">
                          <Award className="h-4 w-4" />
                          <span>{isVi ? 'Đặc quyền cam kết dịch vụ' : 'AeroSmart Quality Guarantee'}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                          {isVi ? 'Đảm bảo hoàn tiền 100% nếu chuyến bay bị hủy hoặc dịch vụ không đúng tiêu chuẩn chất lượng.' : '100% full refund guarantee if flight cancelled or service standards unmet.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">{isVi ? 'Giá từ' : 'Price From'}</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-[#003580] dark:text-sky-300">
                            {formatPrice(previewService.price, 'VND')}
                          </span>
                          <span className="text-xs text-slate-400">{previewService.unit}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedService(previewService)
                          setPreviewService(null)
                        }}
                        className="btn-primary py-3 px-6 text-xs font-bold shadow-lg flex items-center gap-2"
                      >
                        <span>{isVi ? 'Đặt dịch vụ này ngay' : 'Book This Service'}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Highlights, Included & Excluded Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {/* Highlights */}
                  <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 space-y-2">
                    <h5 className="text-xs font-black text-[#003580] dark:text-sky-300 flex items-center gap-1.5 uppercase">
                      <Sparkles className="h-4 w-4" />
                      <span>{isVi ? 'Điểm Nổi Bật Dịch Vụ' : 'Service Highlights'}</span>
                    </h5>
                    <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                      {previewService.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Included */}
                  <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                    <h5 className="text-xs font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 uppercase">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{isVi ? 'Đã Bao Gồm Trong Giá' : 'Included In Price'}</span>
                    </h5>
                    <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                      {previewService.included.map((inc, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">●</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Customer Review */}
                  <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 space-y-2 flex flex-col justify-between">
                    <div>
                      <h5 className="text-xs font-black text-purple-900 dark:text-purple-300 flex items-center gap-1.5 uppercase mb-2">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{isVi ? 'Đánh Giá Từ Khách Hàng' : 'Verified Passenger Review'}</span>
                      </h5>
                      <p className="text-[11px] italic text-slate-600 dark:text-slate-300">
                        "{previewService.testimonial.comment}"
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 block pt-2 border-t border-purple-200 dark:border-purple-900/40">
                      — {previewService.testimonial.author}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 1: Service Customization & Activation Form */}
            {selectedService && (
              <div className="space-y-6 animate-fadeIn">
                {/* Visual Header with Selected Option Live Preview Image */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 dark:from-navy-950 dark:to-navy-900 border border-sky-200 dark:border-navy-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={getCustomizationImage(selectedService)}
                      alt="Customization Preview"
                      className="h-16 w-24 object-cover rounded-xl shadow-md border border-white/50"
                    />
                    <div>
                      <h4 className="text-base font-black text-navy-950 dark:text-white">{selectedService.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{selectedService.desc}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">{isVi ? 'Đơn giá từ' : 'Base Price'}</span>
                    <span className="text-base font-black text-[#003580] dark:text-sky-300">{formatPrice(selectedService.price, 'VND')}</span>
                  </div>
                </div>

                {/* Form Fields according to service type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label text-xs font-bold text-slate-700 dark:text-slate-200">
                      {isVi ? 'Họ và tên hành khách' : (isKm ? 'ឈ្មោះអ្នកដំណើរ' : 'Passenger Full Name')}
                    </label>
                    <input
                      type="text"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="input uppercase text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="label text-xs font-bold text-slate-700 dark:text-slate-200">
                      {isVi ? 'Ngày sử dụng dịch vụ' : (isKm ? 'កាលបរិច្ឆេទ' : 'Service Date')}
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="input text-xs"
                      required
                    />
                  </div>

                  {/* 1. LOUNGE SELECTION CARDS */}
                  {selectedService.id === 'lounge' && (
                    <div className="sm:col-span-2 space-y-2">
                      <label className="label text-xs font-bold text-slate-700 dark:text-slate-200">
                        {isVi ? 'Chọn phòng chờ thương gia VIP' : (isKm ? 'ជ្រើសរើសបន្ទប់ទទួលភ្ញៀវ' : 'Select Airport VIP Lounge')}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { code: 'HAN', name: isVi ? 'Lotus Lounge - Sân bay Nội Bài (Hà Nội)' : 'Lotus Lounge - Hanoi (HAN)', price: 350000, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&auto=format&fit=crop&q=80' },
                          { code: 'SGN', name: isVi ? 'Le Saigonnais Lounge - Tân Sơn Nhất (TP.HCM)' : 'Le Saigonnais - Tan Son Nhat (SGN)', price: 380000, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&auto=format&fit=crop&q=80' },
                          { code: 'DAD', name: isVi ? 'SkyLounge VIP - Sân bay Quốc tế Đà Nẵng' : 'SkyLounge VIP - Da Nang (DAD)', price: 320000, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80' },
                          { code: 'BKK', name: isVi ? 'Miracle Business Lounge - Bangkok (BKK)' : 'Miracle Lounge - Bangkok (BKK)', price: 450000, img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop&q=80' },
                        ].map((l) => (
                          <div
                            key={l.code}
                            onClick={() => setSelectedAirport(l.code)}
                            className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                              selectedAirport === l.code
                                ? 'border-[#003580] bg-sky-50/60 dark:bg-navy-950 dark:border-sky-400 ring-2 ring-[#003580]/20'
                                : 'border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 hover:border-slate-300'
                            }`}
                          >
                            <img src={l.img} alt={l.name} className="h-14 w-14 rounded-xl object-cover" />
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-bold text-navy-950 dark:text-white truncate">{l.name}</h5>
                              <span className="text-xs font-black text-[#003580] dark:text-sky-300 mt-1 block">
                                {formatPrice(l.price, 'VND')} <span className="text-[10px] text-slate-400 font-normal">/ khách</span>
                              </span>
                            </div>
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedAirport === l.code ? 'border-[#003580] bg-[#003580] text-white' : 'border-slate-300'}`}>
                              {selectedAirport === l.code && <Check className="h-3 w-3" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. VEHICLE SELECTION CARDS (TRANSFER) */}
                  {selectedService.id === 'transfer' && (
                    <div className="sm:col-span-2 space-y-3">
                      <label className="label text-xs font-bold text-slate-700 dark:text-slate-200">
                        {isVi ? 'Chọn dòng xe đưa đón sân bay' : (isKm ? 'ជ្រើសរើសប្រភេទរថយន្ត' : 'Select Airport Vehicle Type')}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'SEDAN', name: isVi ? 'Sedan 4 Chỗ Hạng Sang' : 'Luxury 4-Seat Sedan', model: 'Camry / Mercedes', price: 280000, img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=80' },
                          { id: 'SEDONA', name: isVi ? 'VIP Limousine 7 Chỗ' : 'VIP 7-Seat Limousine', model: 'Kia Carnival / Sedona', price: 330000, img: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&auto=format&fit=crop&q=80' },
                          { id: 'VAN', name: isVi ? 'President Luxury Van 9 Chỗ' : 'President 9-Seat Van', model: 'Ford Tourneo President', price: 380000, img: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=400&auto=format&fit=crop&q=80' },
                        ].map((v) => (
                          <div
                            key={v.id}
                            onClick={() => setVehicleType(v.id)}
                            className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                              vehicleType === v.id
                                ? 'border-[#003580] bg-sky-50/60 dark:bg-navy-950 dark:border-sky-400 ring-2 ring-[#003580]/20'
                                : 'border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 hover:border-slate-300'
                            }`}
                          >
                            <img src={v.img} alt={v.name} className="h-20 w-full rounded-xl object-cover" />
                            <div>
                              <h5 className="text-xs font-bold text-navy-950 dark:text-white">{v.name}</h5>
                              <p className="text-[10px] text-slate-500">{v.model}</p>
                            </div>
                            <span className="text-xs font-black text-[#003580] dark:text-sky-300">
                              {formatPrice(v.price, 'VND')}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="label text-xs font-bold text-slate-700 dark:text-slate-200">
                          {isVi ? 'Địa chỉ đón / trả (Khách sạn / Nhà riêng)' : 'Drop-off / Pick-up Address'}
                        </label>
                        <input
                          type="text"
                          value={destinationHotel}
                          onChange={(e) => setDestinationHotel(e.target.value)}
                          className="input text-xs"
                          placeholder="e.g. Khách sạn Melia Hanoi, 44 Lý Thường Kiệt..."
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* 3. SKY DINING MEAL SELECTION CARDS */}
                  {selectedService.id === 'dining' && (
                    <div className="sm:col-span-2 space-y-2">
                      <label className="label text-xs font-bold text-slate-700 dark:text-slate-200">
                        {isVi ? 'Chọn thực đơn nóng trên mây' : (isKm ? 'ជ្រើសរើសមុខម្ហូប' : 'Select In-Flight Meal Set')}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { id: 'PHO_BO', name: isVi ? 'Phở Bò Thăng Long Truyền Thống' : 'Thang Long Beef Pho', price: 95000, img: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&auto=format&fit=crop&q=80' },
                          { id: 'COM_GA', name: isVi ? 'Cơm Gà Hải Nam Hoàng Gia' : 'Royal Hainan Chicken Rice', price: 95000, img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&auto=format&fit=crop&q=80' },
                          { id: 'BO_SOT_VANG', name: isVi ? 'Bò Sốt Vang Bánh Mì Pháp' : 'French Beef Stew Baguette', price: 110000, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80' },
                          { id: 'TRA_SUA', name: isVi ? 'Trà Sữa Trân Châu + Bánh Mousse' : 'Signature Boba Tea & Cake', price: 75000, img: 'https://images.unsplash.com/photo-1558857563-b37cf5a5c0b7?w=400&auto=format&fit=crop&q=80' },
                          { id: 'CHAY', name: isVi ? 'Suất Ăn Chay Organic Thanh Đạm' : 'Organic Vegan Platter', price: 85000, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80' },
                        ].map((m) => (
                          <div
                            key={m.id}
                            onClick={() => setSelectedMeal(m.id)}
                            className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                              selectedMeal === m.id
                                ? 'border-[#003580] bg-sky-50/60 dark:bg-navy-950 dark:border-sky-400 ring-2 ring-[#003580]/20'
                                : 'border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 hover:border-slate-300'
                            }`}
                          >
                            <img src={m.img} alt={m.name} className="h-12 w-12 rounded-xl object-cover shrink-0" />
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-bold text-navy-950 dark:text-white truncate">{m.name}</h5>
                              <span className="text-xs font-black text-rose-600 dark:text-rose-400 mt-0.5 block">
                                {formatPrice(m.price, 'VND')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. FAST-TRACK OPTIONS */}
                  {selectedService.id === 'fasttrack' && (
                    <div className="sm:col-span-2 space-y-2">
                      <label className="label text-xs font-bold text-slate-700 dark:text-slate-200">
                        {isVi ? 'Gói dịch vụ ưu tiên tại sân bay' : 'Fast-Track Priority Package'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { id: 'SECURITY', name: isVi ? 'Lối Đi An Ninh Soát Vé Nhanh VIP' : 'VIP Security Fast-Track', price: 180000, desc: isVi ? 'Bỏ qua xếp hàng an ninh, nhân viên đón tại sảnh' : 'Skip lines with dedicated staff escort', img: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=400&auto=format&fit=crop&q=80' },
                          { id: 'BUGGY', name: isVi ? 'Xe Điện Buggy Đưa Đón Tận Cửa Tàu Bay' : 'Tarmac Buggy Gate Escort', price: 220000, desc: isVi ? 'Xe điện đưa đón xuyên suốt nhà ga đến cửa tàu bay' : 'Electric cart straight to boarding gate', img: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=400&auto=format&fit=crop&q=80' },
                        ].map((ft) => (
                          <div
                            key={ft.id}
                            className="p-3.5 rounded-2xl border border-[#003580] bg-sky-50/50 dark:bg-navy-950 flex items-center gap-3"
                          >
                            <img src={ft.img} alt={ft.name} className="h-14 w-14 rounded-xl object-cover" />
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-bold text-navy-950 dark:text-white">{ft.name}</h5>
                              <p className="text-[11px] text-slate-500">{ft.desc}</p>
                              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                                {formatPrice(ft.price, 'VND')} / khách
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. GUESTS COUNT FOR LOUNGE & FASTTRACK */}
                  {(selectedService.id === 'lounge' || selectedService.id === 'fasttrack') && (
                    <div>
                      <label className="label text-xs font-bold text-slate-700 dark:text-slate-200">
                        {isVi ? 'Số lượng khách' : (isKm ? 'ចំនួនភ្ញៀវ' : 'Number of Guests')}
                      </label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="input text-xs"
                      >
                        <option value={1}>1 {isVi ? 'Khách' : (isKm ? 'នាក់' : 'Guest')}</option>
                        <option value={2}>2 {isVi ? 'Khách' : (isKm ? 'នាក់' : 'Guests')}</option>
                        <option value={3}>3 {isVi ? 'Khách' : (isKm ? 'នាក់' : 'Guests')}</option>
                        <option value={4}>4 {isVi ? 'Khách' : (isKm ? 'នាក់' : 'Guests')}</option>
                      </select>
                    </div>
                  )}

                  {/* 6. INSURANCE TIERS */}
                  {selectedService.id === 'insurance' && (
                    <div className="sm:col-span-2 space-y-2">
                      <label className="label text-xs font-bold text-slate-700 dark:text-slate-200">
                        {isVi ? 'Gói bảo hiểm du lịch AeroCare' : (isKm ? 'កញ្ចប់ធានារ៉ាប់រង' : 'Insurance Plan')}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setInsuranceTier('BASIC')}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            insuranceTier === 'BASIC'
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 font-bold text-indigo-900 dark:text-indigo-200'
                              : 'border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950'
                          }`}
                        >
                          <p className="font-bold">{isVi ? 'Gói Tiêu Chuẩn' : 'Standard'}</p>
                          <p className="text-[11px] text-slate-500">{isVi ? 'Quyền lợi 500tr VNĐ' : '$20,000 limit'}</p>
                          <p className="text-indigo-600 font-bold mt-1">{formatPrice(65000, 'VND')}</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setInsuranceTier('COMPREHENSIVE')}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            insuranceTier === 'COMPREHENSIVE'
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 font-bold text-indigo-900 dark:text-indigo-200 shadow-sm'
                              : 'border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950'
                          }`}
                        >
                          <p className="font-bold">{isVi ? 'Gói Toàn Diện (Khuyên dùng)' : 'Comprehensive'}</p>
                          <p className="text-[11px] text-slate-500">{isVi ? 'Quyền lợi 1 Tỷ VNĐ' : '$50,000 limit'}</p>
                          <p className="text-indigo-600 font-bold mt-1">{formatPrice(120000, 'VND')}</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setInsuranceTier('VIP')}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            insuranceTier === 'VIP'
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 font-bold text-indigo-900 dark:text-indigo-200'
                              : 'border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950'
                          }`}
                        >
                          <p className="font-bold">{isVi ? 'Gói Thượng Hạng VIP' : 'VIP Global'}</p>
                          <p className="text-[11px] text-slate-500">{isVi ? 'Quyền lợi 2 Tỷ VNĐ' : '$100,000 limit'}</p>
                          <p className="text-indigo-600 font-bold mt-1">{formatPrice(230000, 'VND')}</p>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 7. HOTEL RESORT SELECTION CARDS */}
                  {selectedService.id === 'hotel' && (
                    <div className="sm:col-span-2 space-y-3">
                      <label className="label text-xs font-bold text-slate-700 dark:text-slate-200">
                        {isVi ? 'Chọn Resort / Khách sạn 5 Sao Nghỉ Dưỡng' : 'Select 5-Star Luxury Resort Package'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { name: 'Vinpearl Resort Nha Trang', loc: 'Nha Trang (Đảo Hòn Tre)', price: 1200000, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop&q=80' },
                          { name: 'Premier Village Phu Quoc', loc: 'Phú Quốc (Mũi Ông Đội)', price: 1650000, img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&auto=format&fit=crop&q=80' },
                          { name: 'Angkor Palace Resort', loc: 'Siem Reap (Campuchia)', price: 1100000, img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&auto=format&fit=crop&q=80' },
                        ].map((h, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-2xl border border-purple-300 dark:border-navy-800 bg-white dark:bg-navy-900 flex flex-col justify-between space-y-2"
                          >
                            <img src={h.img} alt={h.name} className="h-20 w-full rounded-xl object-cover" />
                            <div>
                              <h5 className="text-xs font-bold text-navy-950 dark:text-white">{h.name}</h5>
                              <p className="text-[10px] text-slate-500">{h.loc}</p>
                            </div>
                            <span className="text-xs font-black text-purple-600 dark:text-purple-400">
                              {formatPrice(h.price, 'VND')} / đêm
                            </span>
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="label text-xs font-bold text-slate-700 dark:text-slate-200">
                          {isVi ? 'Số đêm nghỉ dưỡng' : (isKm ? 'ចំនួនយប់' : 'Number of Nights')}
                        </label>
                        <select
                          value={hotelNights}
                          onChange={(e) => setHotelNights(Number(e.target.value))}
                          className="input text-xs"
                        >
                          <option value={1}>1 {isVi ? 'Đêm' : 'Night'}</option>
                          <option value={2}>2 {isVi ? 'Đêm' : 'Nights'}</option>
                          <option value={3}>3 {isVi ? 'Đêm' : 'Nights'}</option>
                          <option value={4}>4 {isVi ? 'Đêm' : 'Nights'}</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Total & Action Buttons */}
                <div className="pt-4 border-t border-slate-200 dark:border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">{isVi ? 'Tổng chi phí dịch vụ:' : 'Total Payable:'}</span>
                    <p className="text-2xl font-black text-[#003580] dark:text-sky-300">
                      {formatPrice(calculateTotal(selectedService), 'VND')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedService(null)}
                      className="btn-outline flex-1 sm:flex-initial py-2.5 px-5 text-xs font-bold"
                    >
                      {isVi ? 'Quay lại' : (isKm ? 'ថយក្រោយ' : 'Back')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConfirmServiceBooking(selectedService)}
                      className="btn-primary flex-1 sm:flex-initial py-2.5 px-7 text-xs font-bold shadow-lg flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{isVi ? 'Xác nhận & Kích hoạt Voucher' : (isKm ? 'បញ្ជាក់ & ទទួលប័ណ្ណ' : 'Confirm & Issue E-Voucher')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: Issued E-Voucher Detail */}
            {activeVoucher && (
              <div className="space-y-6 animate-fadeIn">
                <div className="rounded-3xl border-2 border-emerald-500 bg-gradient-to-br from-white to-emerald-50/40 dark:from-navy-900 dark:to-emerald-950/20 p-6 sm:p-8 shadow-xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-navy-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg">
                        <BadgeCheck className="h-7 w-7" />
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-black uppercase mb-1">
                          ● {isVi ? 'VOUCHER ĐÃ KÍCH HOẠT THÀNH CÔNG' : (isKm ? 'បានបើកដំណើរការជោគជ័យ' : 'ACTIVATED & READY TO USE')}
                        </div>
                        <h4 className="text-lg font-black text-navy-950 dark:text-white">{activeVoucher.title}</h4>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{isVi ? 'Mã đặt dịch vụ' : 'Voucher Code'}</span>
                      <span className="font-mono text-xl font-black text-[#003580] dark:text-sky-300">{activeVoucher.voucherId}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-6">
                    {/* QR Code */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 shadow-sm text-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                          `AEROSMART-VOUCHER:${activeVoucher.voucherId}:${activeVoucher.passengerName}:${activeVoucher.totalAmount}`
                        )}`}
                        alt="Service QR Code"
                        className="h-36 w-36 object-contain rounded-lg"
                      />
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        {isVi ? 'Quét mã tại quầy lễ tân / tài xế' : 'Present QR to staff / chauffeur'}
                      </p>
                    </div>

                    {/* Voucher Details */}
                    <div className="md:col-span-8 space-y-2.5 text-xs">
                      <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
                        <span className="text-slate-400">{isVi ? 'Hành khách:' : 'Passenger:'}</span>
                        <span className="font-bold text-navy-950 dark:text-white uppercase">{activeVoucher.passengerName}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
                        <span className="text-slate-400">{isVi ? 'Ngày áp dụng:' : 'Valid Date:'}</span>
                        <span className="font-bold text-navy-950 dark:text-white font-mono">{activeVoucher.date}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
                        <span className="text-slate-400">{isVi ? 'Chi tiết gói:' : 'Details:'}</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{activeVoucher.details}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                        <span className="font-bold">{isVi ? 'Giá trị thanh toán:' : 'Total Value:'}</span>
                        <span className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-300">
                          {formatPrice(activeVoucher.totalAmount, 'VND')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleCopy(activeVoucher.voucherId)}
                      className="btn-outline py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 w-full sm:w-auto"
                    >
                      {copiedCode ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                      <span>{copiedCode ? (isVi ? 'Đã sao chép mã' : 'Copied') : (isVi ? 'Sao chép mã voucher' : 'Copy Voucher Code')}</span>
                    </button>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveVoucher(null)
                          setSelectedService(null)
                        }}
                        className="btn-outline py-2.5 px-4 text-xs font-bold"
                      >
                        {isVi ? 'Xem dịch vụ khác' : 'Explore More'}
                      </button>
                      <Link
                        to="/flights"
                        onClick={onClose}
                        className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-1.5 shadow-md"
                      >
                        <Plane className="h-4 w-4" />
                        <span>{isVi ? 'Đặt vé máy bay cùng dịch vụ này' : (isKm ? 'កក់សំបុត្រយន្តហោះ' : 'Book Flights with this Extra')}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: Main 6 Cards Grid (EXPLORE TAB) with Visual Photography & Detail Buttons */}
            {!previewService && !selectedService && !activeVoucher && activeTab === 'EXPLORE' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((s) => {
                  const IconComponent = s.icon
                  return (
                    <div
                      key={s.id}
                      className="rounded-2xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 hover:border-[#003580] hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden group"
                    >
                      {/* Card Cover Image with Badge & Rating */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-navy-900 cursor-pointer" onClick={() => { setActiveGalleryIndex(0); setPreviewService(s); }}>
                        <img
                          src={s.coverImg}
                          alt={s.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                        <div className="absolute top-2.5 left-2.5">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm ${s.badgeColor}`}>
                            {s.badge}
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5">
                          <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/20">
                            <Star className="h-3 w-3 fill-amber-300" />
                            <span>{s.rating}</span>
                          </span>
                        </div>

                        {/* Quick View Button on Image */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-navy-950/40 backdrop-blur-[2px]">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveGalleryIndex(0)
                              setPreviewService(s)
                            }}
                            className="bg-white/90 hover:bg-white text-navy-950 text-xs font-black py-2 px-4 rounded-xl shadow-lg flex items-center gap-1.5 transition-all transform scale-95 group-hover:scale-100"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#003580]" />
                            <span>{isVi ? 'Xem ảnh & chi tiết' : 'View Photos & Specs'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <h4 className="text-sm font-black text-navy-950 dark:text-white group-hover:text-[#003580] dark:group-hover:text-sky-300 transition-colors line-clamp-1">
                            {s.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {s.desc}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-navy-800 space-y-2">
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 font-medium block">
                                {isVi ? 'Giá từ' : (isKm ? 'តម្លៃចាប់ពី' : 'From')}
                              </span>
                              <span className="text-base font-black text-[#003580] dark:text-sky-300">
                                {formatPrice(s.price, 'VND')}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-normal">
                              {s.unit}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveGalleryIndex(0)
                                setPreviewService(s)
                              }}
                              className="btn-outline py-2 px-2 text-[11px] font-bold flex items-center justify-center gap-1 hover:border-[#003580]"
                            >
                              <Camera className="h-3 w-3 text-[#006ce4]" />
                              <span>{isVi ? 'Xem Ảnh' : 'Photos'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedService(s)}
                              className="btn-primary py-2 px-2 text-[11px] font-bold shadow-sm flex items-center justify-center gap-1"
                            >
                              <span>{isVi ? 'Đặt ngay' : (isKm ? 'កក់' : 'Book')}</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* VIEW 4: MY BOOKED VOUCHERS LIST */}
            {!previewService && !selectedService && !activeVoucher && activeTab === 'MY_VOUCHERS' && (
              <div className="space-y-4">
                {bookedServices.length === 0 ? (
                  <div className="text-center py-12 space-y-3 bg-slate-50 dark:bg-navy-950 rounded-2xl border border-slate-200 dark:border-navy-800 p-8">
                    <Ticket className="h-10 w-10 text-slate-400 mx-auto" />
                    <h4 className="text-base font-bold text-navy-950 dark:text-white">
                      {isVi ? 'Bạn chưa đăng ký dịch vụ nào' : (isKm ? 'មិនទាន់មានសេវាកម្មទេ' : 'No Active Services Found')}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      {isVi ? 'Hãy khám phá 6 gói dịch vụ độc quyền phía trên và chọn dịch vụ phù hợp cho chuyến bay của bạn!' : 'Select from 6 premium airline services to enhance your travel experience!'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('EXPLORE')}
                      className="btn-primary py-2 px-5 text-xs font-bold mt-2"
                    >
                      {isVi ? 'Khám phá dịch vụ ngay' : 'Explore Services Now'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookedServices.map((v) => (
                      <div
                        key={v.voucherId}
                        onClick={() => setActiveVoucher(v)}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 hover:border-[#003580] hover:shadow-md cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <QrCode className="h-6 w-6" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold text-[#003580] dark:text-sky-300 block">
                              {v.voucherId} · {v.date}
                            </span>
                            <h5 className="text-sm font-bold text-navy-950 dark:text-white">{v.title}</h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{v.details}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-navy-800">
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                            {formatPrice(v.totalAmount, 'VND')}
                          </span>
                          <span className="btn-outline py-1.5 px-3 text-xs font-bold flex items-center gap-1">
                            <span>{isVi ? 'Xem Voucher' : 'View Pass'}</span>
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 dark:bg-navy-950 px-6 py-4 border-t border-slate-200 dark:border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <PhoneCall className="h-4 w-4 text-[#006ce4]" />
              <span>
                {isVi ? 'Tư vấn đặt dịch vụ bổ trợ 24/7: 1900 1100' : (isKm ? 'ទូរស័ព្ទប្រឹក្សាសេវាកម្ម ២៤/៧: 1900 1100' : '24/7 Service Hotline: 1900 1100')}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="btn-outline py-2 px-6 text-xs font-bold"
            >
              {isVi ? 'Đóng cửa sổ' : (isKm ? 'បិទ' : 'Close')}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
