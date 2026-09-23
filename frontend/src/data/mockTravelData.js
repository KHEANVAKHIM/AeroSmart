export const CAR_FLEET = [
  {
    id: 'car-sedan-camry',
    name: 'Toyota Camry 2.5Q Premium',
    category: 'SEDAN',
    categoryLabel: 'Sedan 4-5 Chỗ Hạng Sang',
    seats: 5,
    doors: 4,
    bags: 3,
    transmission: 'Tự động (Auto)',
    fuel: 'Xăng / Hybrid tiết kiệm (6.2L/100km)',
    pricePerDay: 1350000,
    originalPrice: 1650000,
    rating: 4.9,
    reviews: 184,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=80'
    ],
    tags: ['Nội thất da cao cấp', 'Cửa sổ trời', 'Giao xe tại sân bay miễn phí'],
    type: 'SELF_DRIVE',
    deposit: 15000000,
    features: [
      'Điều hòa tự động 3 vùng độc lập',
      'Màn hình giải trí 9 inch Apple CarPlay / Android Auto',
      'Hệ thống âm thanh 9 loa JBL',
      'Camera 360 & Cảm biến xung quanh',
      'Phanh tay điện tử & Auto Hold',
      'Hệ thống an toàn Toyota Safety Sense 2.0'
    ],
    insurance: {
      included: 'Bảo hiểm trách nhiệm dân sự + Bảo hiểm thân vỏ cơ bản (Khấu trừ tối đa 2.000.000đ)',
      upgradePrice: 150000,
      upgradeTitle: 'Gói Bảo Hiểm Toàn Diện Super Collision Waiver (Miễn trừ 100% trách nhiệm)'
    },
    pickupLocations: [
      'Sân bay Quốc tế Nội Bài (Sảnh đến T1/T2)',
      'Sân bay Quốc tế Tân Sơn Nhất (Ga quốc nội/quốc tế)',
      'Sân bay Quốc tế Đà Nẵng',
      'Giao xe tận nơi tại Khách sạn (Nội thành)'
    ],
    policies: [
      'Yêu cầu GPLX B1/B2 còn hạn tối thiểu 1 năm và CCCD/Hộ chiếu gốc.',
      'Giao nhận xe bình xăng đầy - Trả xe bình xăng đầy.',
      'Miễn phí hủy xe trước 24 giờ nhận xe.',
      'Không giới hạn số km di chuyển trong ngày.'
    ],
    provider: {
      name: 'AeroSmart Premium Car Rental & Chauffeur',
      rating: 4.95,
      completedTrips: 3420
    }
  },
  {
    id: 'car-suv-everest',
    name: 'Ford Everest Titanium 4x4',
    category: 'SUV',
    categoryLabel: 'SUV 7 Chỗ Gầm Cao',
    seats: 7,
    doors: 5,
    bags: 5,
    transmission: 'Tự động 10 cấp điện tử',
    fuel: 'Dầu Diesel Bi-Turbo (7.5L/100km)',
    pricePerDay: 1750000,
    originalPrice: 2100000,
    rating: 4.9,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&auto=format&fit=crop&q=80'
    ],
    tags: ['Chống lật & 7 túi khí', 'Cốp điện thông minh', 'Thích hợp địa hình du lịch'],
    type: 'SELF_DRIVE',
    deposit: 20000000,
    features: [
      'Dẫn động 2 cầu 4WD thông minh kiểm soát địa hình',
      'Màn hình cảm ứng 12 inch SYNC 4A',
      'Cửa sổ trời toàn cảnh Panorama',
      'Hàng ghế thứ 3 gập điện tiện lợi',
      'Camera 360 độ siêu nét có vạch định hướng',
      'Kiểm soát hành trình thích ứng (Adaptive Cruise Control)'
    ],
    insurance: {
      included: 'Bảo hiểm thân vỏ cơ bản và vật chất xe',
      upgradePrice: 180000,
      upgradeTitle: 'Bảo hiểm Full Coverage không bù phí tai nạn'
    },
    pickupLocations: [
      'Sân bay Nội Bài, Tân Sơn Nhất, Đà Nẵng, Phú Quốc, Cam Ranh',
      'Giao xe tận nơi nội thành miễn phí bán kính 10km'
    ],
    policies: [
      'Cần có CCCD/Hộ chiếu và Bằng lái xe B2.',
      'Hỗ trợ cứu hộ 24/7 toàn quốc.',
      'Miễn phí hủy chuyến trước 24h.'
    ],
    provider: {
      name: 'AeroSmart Everest Fleet',
      rating: 4.92,
      completedTrips: 2890
    }
  },
  {
    id: 'car-limo-dcar',
    name: 'DCar President VIP Limousine',
    category: 'LIMOUSINE',
    categoryLabel: 'Limousine Thương Gia 9 Chỗ',
    seats: 9,
    doors: 4,
    bags: 8,
    transmission: 'Tự động + Có tài xế riêng',
    fuel: 'Xăng / Diesel (Đã gồm chi phí xăng)',
    pricePerDay: 2950000,
    originalPrice: 3800000,
    rating: 5.0,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&auto=format&fit=crop&q=80'
    ],
    tags: ['Ghế massage thư giãn', 'TV Smart 32 inch + Wifi 5G', 'Bao gồm tài xế chuyên nghiệp'],
    type: 'WITH_DRIVER',
    deposit: 0,
    features: [
      'Ghế cơ trưởng bọc da Nappa tích hợp massage đa điểm & sưởi/làm mát',
      'Màn hình TV Smart 32 inch kết nối Youtube, Netflix',
      'Hệ thống âm thanh Sony rạp hát di động',
      'Tủ lạnh mini bar 10L, cổng sạc Type-C/USB từng ghế',
      'Bầu trời sao LED đổi màu phong cách Rolls-Royce',
      'Tài xế mặc vest lịch sự, thông thạo tiếng Anh/tiếng Việt'
    ],
    insurance: {
      included: 'Bảo hiểm hành khách cao cấp lên đến 1 tỷ đồng/người',
      upgradePrice: 0,
      upgradeTitle: 'Đã bao gồm trọn gói dịch vụ bảo hiểm VIP'
    },
    pickupLocations: [
      'Đón tận sảnh VIP ga đến sân bay (cầm biển tên)',
      'Đón tại mọi khách sạn/resort'
    ],
    policies: [
      'Giá đã bao gồm tài xế, xăng dầu, phí cầu đường cao tốc.',
      'Thời gian phục vụ tiêu chuẩn: 10 tiếng/ngày hoặc 100km/ngày.',
      'Miễn phí nước suối khoáng & khăn lạnh suốt hành trình.'
    ],
    provider: {
      name: 'AeroSmart VIP Chauffeur Service',
      rating: 5.0,
      completedTrips: 4150
    }
  },
  {
    id: 'car-merc-glc',
    name: 'Mercedes-Benz GLC 300 4MATIC',
    category: 'SUV',
    categoryLabel: 'Luxury SUV 5 Chỗ',
    seats: 5,
    doors: 5,
    bags: 4,
    transmission: 'Tự động 9G-TRONIC',
    fuel: 'Xăng cao cấp A95 (8.0L/100km)',
    pricePerDay: 3200000,
    originalPrice: 4000000,
    rating: 4.95,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&auto=format&fit=crop&q=80'
    ],
    tags: ['Âm thanh vòm Burmester', 'Cửa sổ trời Panorama', 'Đẳng cấp doanh nhân'],
    type: 'SELF_DRIVE',
    deposit: 30000000,
    features: [
      'Động cơ 2.0L Turbo Mild-Hybrid 258 mã lực',
      'Âm thanh 15 loa Burmester Surround',
      'Đèn pha thông minh Digital Light',
      'Màn hình trung tâm 11.9 inch độ phân giải cao',
      'Gói hỗ trợ lái xe Driving Assistance Plus'
    ],
    insurance: {
      included: 'Bảo hiểm vật chất Mercedes chính hãng',
      upgradePrice: 250000,
      upgradeTitle: 'Bảo hiểm Platinum không khấu trừ'
    },
    pickupLocations: [
      'Giao xe tận nơi hoặc tại sân bay Nội Bài / Tân Sơn Nhất'
    ],
    policies: [
      'Yêu cầu giấy tờ hợp lệ và đặt cọc bằng thẻ tín dụng hoặc chuyển khoản.',
      'Miễn phí giao xe trong bán kính 15km.'
    ],
    provider: {
      name: 'AeroSmart Luxury Fleet',
      rating: 4.97,
      completedTrips: 1120
    }
  },
  {
    id: 'car-van-solati',
    name: 'Hyundai Solati VIP 16 Chỗ',
    category: 'VAN',
    categoryLabel: 'Minivan Du Lịch Đoàn',
    seats: 16,
    doors: 4,
    bags: 12,
    transmission: 'Số sàn / Tự động (Có tài xế)',
    fuel: 'Dầu Diesel tiết kiệm',
    pricePerDay: 2600000,
    originalPrice: 3200000,
    rating: 4.85,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&auto=format&fit=crop&q=80'
    ],
    tags: ['Trần cao thoáng mát', 'Khoang hành lý siêu rộng', 'Bao gồm tài xế & xăng dầu'],
    type: 'WITH_DRIVER',
    deposit: 0,
    features: [
      'Ghế ngả cao cấp bọc da êm ái',
      'Khoang hành lý chứa đến 15 vali lớn',
      'Điều hòa nóc phân bổ đều từng vị trí ngồi',
      'Hệ thống âm thanh micro phục vụ hướng dẫn viên'
    ],
    insurance: {
      included: 'Bảo hiểm hành khách đầy đủ theo quy định vận tải',
      upgradePrice: 0,
      upgradeTitle: 'Đã bao gồm'
    },
    pickupLocations: [
      'Đón tại sân bay hoặc điểm hẹn theo yêu cầu của đoàn'
    ],
    policies: [
      'Bao gồm xăng, tài xế và phí cầu đường.',
      'Thích hợp tour gia đình đông người, công ty teambuilding.'
    ],
    provider: {
      name: 'AeroSmart Group Transport',
      rating: 4.88,
      completedTrips: 1980
    }
  }
]

export const LUXURY_HOTELS = [
  {
    id: 'hotel-pq-vinpearl',
    name: 'Vinpearl Resort & Spa Phú Quốc',
    nameEn: 'Vinpearl Resort & Spa Phu Quoc',
    nameKm: 'រីសត & ស្ប៉ា Vinpearl កោះត្រល់',
    location: 'Bãi Dài, Gành Dầu, Phú Quốc, Kiên Giang',
    city: 'Phú Quốc',
    country: 'Vietnam',
    stars: 5,
    rating: 4.9,
    reviews: 2450,
    pricePerNight: 2850000,
    originalPrice: 3500000,
    propertyType: 'RESORT',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=80'
    ],
    amenities: ['Bãi biển riêng Bãi Dài', 'Bể bơi vô cực 5.000m²', 'Akoya Spa trên mặt hồ', 'Buffet sáng quốc tế', 'Đưa đón sân bay miễn phí'],
    rooms: [
      { id: 'r1', name: 'Deluxe King Hướng Vườn', size: '46m²', bed: '1 Giường King siêu lớn', price: 2850000, perks: ['Ăn sáng buffet', 'Miễn phí hủy phòng trước 3 ngày', 'Trà chiều chào đón'] },
      { id: 'r2', name: 'Deluxe Ocean View Hướng Biển', size: '46m²', bed: '1 Giường King hoặc 2 Giường đơn', price: 3450000, perks: ['Ăn sáng buffet', 'Ban công view hoàng hôn', 'Đưa đón sân bay'] },
      { id: 'r3', name: 'Executive Suite Biển Ngọc', size: '92m²', bed: '1 King Bed + Phòng khách riêng biệt', price: 5800000, perks: ['VIP Check-in', 'Ăn sáng tại phòng', 'Miễn phí vé VinWonders'] },
      { id: 'r4', name: 'Presidential Oceanfront Villa 3PN', size: '340m²', bed: '3 Phòng ngủ + Hồ bơi riêng', price: 12500000, perks: ['Quản gia riêng 24/7', 'Xe đưa đón Limousine', 'BBQ hải sản tại villa'] }
    ],
    description: 'Nằm trọn bên bãi biển Bãi Dài hoang sơ tuyệt đẹp phía Bắc đảo ngọc Phú Quốc, Vinpearl Resort & Spa nổi bật với lối kiến trúc Đông Dương trang nhã, hồ bơi ngoài trời khổng lồ 5.000m² và quần thể giải trí VinWonders & Safari liền kề.',
    highlights: [
      'Bãi cát trắng riêng tư dài hơn 1km ngắm hoàng hôn đẹp nhất đảo',
      'Cách VinWonders & Safari chỉ 5 phút đi xe điện miễn phí',
      'Nhà hàng ẩm thực Á - Âu phục vụ hải sản tươi sống đánh bắt trong ngày',
      'Khu vui chơi trẻ em Kid Club rộng lớn có nhân viên trông giữ'
    ],
    policies: {
      checkIn: '14:00',
      checkOut: '12:00',
      cancellation: 'Miễn phí hủy phòng trước 72 giờ nhận phòng.',
      children: 'Trẻ em dưới 4 tuổi miễn phí ngủ chung giường với bố mẹ.'
    }
  },
  {
    id: 'hotel-dn-intercon',
    name: 'InterContinental Danang Sun Peninsula Resort',
    nameEn: 'InterContinental Danang Sun Peninsula Resort',
    nameKm: 'រីសត InterContinental ដាណាំង',
    location: 'Bán đảo Sơn Trà, Đà Nẵng',
    city: 'Đà Nẵng',
    country: 'Vietnam',
    stars: 5,
    rating: 5.0,
    reviews: 3120,
    pricePerNight: 8900000,
    originalPrice: 10500000,
    propertyType: 'LUXURY_VILLA',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80'
    ],
    amenities: ['Cáp treo Nam Tram riêng', 'Nhà hàng La Maison 1888 Michelin', 'Bãi biển riêng tư Sơn Trà', 'HARNN Heritage Spa', 'Hồ bơi L-shape đỉnh núi'],
    rooms: [
      { id: 'r1', name: 'Classic Ocean View Room', size: '70m²', bed: '1 King Bed', price: 8900000, perks: ['Bao gồm bữa sáng Citron', 'Bồn tắm đá cẩm thạch view vịnh'] },
      { id: 'r2', name: 'Terrace Suite Vịnh Bán Đảo', size: '84m²', bed: '1 King Bed + Ban công lơ lửng', price: 11200000, perks: ['Club InterContinental Lounge', 'Trà chiều & Cocktail miễn phí'] },
      { id: 'r3', name: 'Seaside Villa on the Rocks Hồ bơi riêng', size: '145m²', bed: '1 King Bed + Bể bơi vô cực riêng', price: 21500000, perks: ['Quản gia riêng', 'Xe buggy đưa đón 24/7'] }
    ],
    description: 'Kiệt tác nghỉ dưỡng hàng đầu thế giới được thiết kế bởi kiến trúc sư lừng danh Bill Bensley, tọa lạc giữa thiên nhiên hùng vĩ của bán đảo Sơn Trà.',
    highlights: [
      'Được vinh danh Resort sang trọng bậc nhất thế giới nhiều năm liên tiếp',
      'Nhà hàng La Maison 1888 đạt sao Michelin danh giá',
      'Hệ thống cáp treo độc bản Nam Tram nối 4 tầng: Heaven, Sky, Earth, Sea'
    ],
    policies: {
      checkIn: '15:00',
      checkOut: '12:00',
      cancellation: 'Hủy trước 7 ngày để được hoàn tiền 100%.'
    }
  },
  {
    id: 'hotel-siemreap-raffles',
    name: 'Raffles Grand Hotel d’Angkor',
    nameEn: 'Raffles Grand Hotel d’Angkor',
    nameKm: 'សណ្ឋាគារ Raffles Grand Angkor សៀមរាប',
    location: '1 Vithei Charles de Gaulle, Khum Svay Dangkum, Siem Reap',
    city: 'Siem Reap',
    country: 'Cambodia',
    stars: 5,
    rating: 4.9,
    reviews: 1890,
    pricePerNight: 5400000,
    originalPrice: 6500000,
    propertyType: 'HERITAGE_HOTEL',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80'
    ],
    amenities: ['Hồ bơi phong cách hoàng gia', 'Thang máy cổ 1932 nguyên bản', 'Vườn nhiệt đới 15ha', 'Raffles Spa & Trà chiều di sản'],
    rooms: [
      { id: 'r1', name: 'State Room Garden View', size: '42m²', bed: '1 King Bed', price: 5400000, perks: ['Ăn sáng hoàng gia', 'Dịch vụ quản gia Raffles'] },
      { id: 'r2', name: 'Colonial Suite', size: '68m²', bed: '1 King Bed + Ban công nhìn ra hồ bơi', price: 7800000, perks: ['Rượu vang đón chào', 'Tour xe đạp khám phá Siem Reap'] }
    ],
    description: 'Biểu tượng khách sạn di sản Đông Dương từ năm 1932, nơi từng đón tiếp nhiều vị vua chúa, chính khách và người nổi tiếng thế giới khi đến thăm kỳ quan Angkor Wat.',
    highlights: [
      'Vị trí đắc địa cách cổng đền Angkor Wat chỉ 10 phút lái xe',
      'Hồ bơi lớn nhất Siem Reap thiết kế theo kiến trúc hồ bơi hoàng cung Campuchia'
    ],
    policies: {
      checkIn: '14:00',
      checkOut: '12:00',
      cancellation: 'Miễn phí hủy phòng trước 48 giờ.'
    }
  }
]

export const COMBO_PACKAGES = [
  {
    id: 'combo-pq-vinpearl',
    title: 'Combo Phú Quốc Thiên Đường 3N2Đ',
    titleEn: 'Phu Quoc Island Paradise Combo 3D2N',
    origin: 'Hà Nội (HAN)',
    destination: 'Phú Quốc (PQC)',
    flightRoute: 'HAN ⇄ PQC (Khứ hồi Vietnam Airlines)',
    hotelName: 'Vinpearl Resort & Spa Phú Quốc 5 Sao',
    roomType: 'Deluxe King Hướng Biển',
    duration: '3 Ngày 2 Đêm',
    rating: 4.9,
    reviews: 1420,
    pricePerPerson: 4250000,
    originalPrice: 5800000,
    savings: 'Tiết kiệm 28%',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&auto=format&fit=crop&q=80'
    ],
    tags: ['Vé máy bay khứ hồi gồm 23kg ký gửi', 'Phòng resort 5 sao kèm buffet sáng', 'Xe đón tiễn sân bay 2 chiều'],
    itinerary: [
      { day: 1, title: 'Bay đến Phú Quốc - Nhận phòng Vinpearl & Ngắm hoàng hôn Bãi Dài' },
      { day: 2, title: 'Khám phá VinWonders & Safari bán hoang dã hoặc Tour 4 đảo lặn ngắm san hô' },
      { day: 3, title: 'Thưởng thức buffet sáng, tắm biển & Xe tiễn sân bay Phú Quốc về Hà Nội' }
    ],
    inclusions: [
      'Vé máy bay khứ hồi HAN ⇄ PQC (Đã bao gồm 12kg xách tay + 23kg ký gửi).',
      '02 đêm nghỉ tại phòng Deluxe Ocean View tại Vinpearl Resort 5 sao.',
      '02 bữa buffet sáng tiêu chuẩn quốc tế.',
      'Xe riêng đón tiễn sân bay Phú Quốc về khách sạn 2 chiều.',
      'Bảo hiểm du lịch nội địa trị giá 50.000.000đ/vụ.'
    ]
  },
  {
    id: 'combo-danang-bana',
    title: 'Combo Đà Nẵng - Cầu Vàng Bà Nà Hills 4N3Đ',
    titleEn: 'Da Nang & Golden Bridge Ba Na Hills 4D3N',
    origin: 'TP. Hồ Chí Minh (SGN)',
    destination: 'Đà Nẵng (DAD)',
    flightRoute: 'SGN ⇄ DAD (Khứ hồi Bamboo Airways)',
    hotelName: 'TMS Hotel Da Nang Beach 5 Sao Mỹ Khê',
    roomType: 'Premier Ocean View',
    duration: '4 Ngày 3 Đêm',
    rating: 4.85,
    reviews: 980,
    pricePerPerson: 3890000,
    originalPrice: 5200000,
    savings: 'Tiết kiệm 25%',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&auto=format&fit=crop&q=80'
    ],
    tags: ['Vé máy bay khứ hồi giờ đẹp', 'Khách sạn view biển Mỹ Khê', 'Tặng vé cáp treo Bà Nà Hills'],
    itinerary: [
      { day: 1, title: 'Bay đến Đà Nẵng - Tắm biển Mỹ Khê & Khám phá cầu Rồng phun lửa' },
      { day: 2, title: 'Khám phá Sun World Ba Na Hills - Check-in Cầu Vàng bàn tay khổng lồ' },
      { day: 3, title: 'Tham quan phố cổ Hội An & Thả đèn hoa đăng sông Hoài' },
      { day: 4, title: 'Mua sắm đặc sản chợ Cồn & Bay về TP. Hồ Chí Minh' }
    ],
    inclusions: [
      'Vé máy bay khứ hồi SGN ⇄ DAD đầy đủ hành lý.',
      '03 đêm khách sạn 5 sao mặt biển Mỹ Khê có hồ bơi vô cực tầng thượng.',
      'Vé cáp treo Bà Nà Hills và Cầu Vàng.',
      'Ăn sáng buffet hàng ngày.'
    ]
  }
]

export const ATTRACTIONS = [
  {
    id: 'attr-bana-danang',
    title: 'Vé VIP Cáp Treo & Cầu Vàng Sun World Ba Na Hills',
    titleEn: 'Sun World Ba Na Hills Cable Car & Golden Bridge VIP Pass',
    titleKm: 'សំបុត្រទស្សនាស្ពានមាស Ba Na Hills ដាណាំង',
    city: 'Đà Nẵng',
    country: 'Vietnam',
    rating: 4.9,
    reviews: 5820,
    duration: 'Cả ngày (08:00 - 18:00)',
    price: 950000,
    originalPrice: 1200000,
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&auto=format&fit=crop&q=80'
    ],
    tags: ['Cầu Vàng bàn tay khổng lồ', 'Làng Pháp cổ kính', 'Cáp treo kỷ lục Guinness', 'Buffet trưa Á-Âu'],
    category: 'THEME_PARK',
    categoryLabel: 'Công viên giải trí',
    highlights: [
      'Check-in biểu tượng Cầu Vàng nâng đỡ bởi đôi bàn tay khổng lồ giữa biển mây',
      'Trải nghiệm tuyến cáp treo đạt nhiều kỷ lục Guinness thế giới',
      'Khám phá Làng Pháp với kiến trúc Châu Âu trung cổ và Lâu đài Mặt Trăng',
      'Thưởng thức hơn 100 món ngon tại Buffet trưa quốc tế'
    ],
    ticketOptions: [
      { id: 't1', name: 'Vé Cáp Treo Vào Cổng Tiêu Chuẩn', price: 950000, desc: 'Bao gồm cáp treo khứ hồi, Cầu Vàng, Làng Pháp, Fantasy Park (trừ tượng sáp)' },
      { id: 't2', name: 'Combo Vé Cáp Treo + Buffet Trưa Quốc Tế', price: 1250000, desc: 'Bao gồm cáp treo + Ăn trưa buffet Á-Âu không giới hạn' },
      { id: 't3', name: 'Vé VIP Fast-Track Lối Đi Ưu Tiên', price: 1650000, desc: 'Lối đi VIP không xếp hàng tại các ga cáp treo + Tặng quà lưu niệm' }
    ],
    howToRedeem: [
      'Nhận mã QR điện tử ngay sau khi thanh toán thành công.',
      'Quét trực tiếp mã QR tại cổng kiểm soát vé tự động (không cần đổi vé giấy).',
      'Vé có giá trị sử dụng trong ngày đã chọn.'
    ]
  },
  {
    id: 'attr-angkor-sunrise',
    title: 'Tour Đón Bình Minh Huyền Ảo & Khám Phá Quần Thể Angkor Wat',
    titleEn: 'Angkor Wat Sunrise Guided Heritage Tour & Angkor Thom',
    titleKm: 'ដំណើរកម្សាន្តទស្សនាថ្ងៃរះនៅប្រាសាទអង្គរវត្ត',
    city: 'Siem Reap',
    country: 'Cambodia',
    rating: 5.0,
    reviews: 4120,
    duration: '8 giờ (04:30 - 13:00)',
    price: 890000,
    originalPrice: 1150000,
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&auto=format&fit=crop&q=80'
    ],
    tags: ['Hướng dẫn viên tiếng Việt/Anh', 'Xe đưa đón tận khách sạn', 'Bữa sáng picnic trước Angkor'],
    category: 'CULTURAL_TOUR',
    categoryLabel: 'Tour văn hóa & di sản',
    highlights: [
      'Chiêm ngưỡng khung cảnh bình minh huyền ảo phản chiếu trên hồ sen trước đền Angkor Wat',
      'Khám phá đền Bayon với những gương mặt đá nụ cười bí ẩn',
      'Thăm đền Ta Prohm cổ kính được rễ cây đại thụ ôm trọn (nơi quay phim Tomb Raider)',
      'Xe du lịch máy lạnh đưa đón tận sảnh khách sạn'
    ],
    ticketOptions: [
      { id: 't1', name: 'Tour Ghép Đoàn Đón Bình Minh (Bao gồm xe + HDV)', price: 890000, desc: 'Đón tại khách sạn 04:30 sáng, xe máy lạnh, HDV tiếng Việt/Anh, nước suối' },
      { id: 't2', name: 'Tour Riêng Private VIP Cho Gia Đình', price: 1950000, desc: 'Xe riêng, hướng dẫn viên riêng, linh hoạt thời gian theo ý muốn' }
    ],
    howToRedeem: [
      'Hướng dẫn viên sẽ liên hệ qua số điện thoại/WhatsApp trước 1 ngày để xác nhận giờ đón.',
      'Lưu ý: Quý khách cần tự chuẩn bị Angkor Pass (mua tại cổng hoặc online).'
    ]
  }
]
