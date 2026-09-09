package com.aerosmart.config;

import com.aerosmart.domain.Airport;
import com.aerosmart.domain.Booking;
import com.aerosmart.domain.BookingStatus;
import com.aerosmart.domain.Flight;
import com.aerosmart.domain.FlightStatus;
import com.aerosmart.domain.Passenger;
import com.aerosmart.domain.Role;
import com.aerosmart.domain.Seat;
import com.aerosmart.domain.SeatStatus;
import com.aerosmart.domain.User;
import com.aerosmart.repository.AirportRepository;
import com.aerosmart.repository.BookingRepository;
import com.aerosmart.repository.FlightRepository;
import com.aerosmart.repository.SeatRepository;
import com.aerosmart.repository.UserRepository;
import com.aerosmart.service.FlightService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AirportRepository airportRepository;
    private final FlightRepository flightRepository;
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;
    private final FlightService flightService;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Initializing AeroSmart demo data...");
        seedUsers();
        seedAirports();
        seedFlightsAndSeats();
        seedSampleBookings();
        seedDestinationDeals();
        seedCountries();
        log.info("AeroSmart demo data initialized successfully.");
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@aerosmart.com")) {
            User admin = User.builder()
                    .email("admin@aerosmart.com")
                    .fullName("AeroSmart Operations Director")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ROLE_ADMIN)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);
            log.info("Seeded Admin: admin@aerosmart.com / admin123");
        }

        if (!userRepository.existsByEmail("passenger@aerosmart.com")) {
            User passenger = User.builder()
                    .email("passenger@aerosmart.com")
                    .fullName("Alex Nguyen")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.ROLE_USER)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(passenger);
            log.info("Seeded Passenger: passenger@aerosmart.com / user123");
        }
    }

    private void seedAirports() {
        List<Airport> airports = List.of(
                // National / Domestic Vietnam
                Airport.builder().code("HAN").name("Noi Bai International Airport").city("Hanoi").country("Vietnam").build(),
                Airport.builder().code("SGN").name("Tan Son Nhat International Airport").city("Ho Chi Minh City").country("Vietnam").build(),
                Airport.builder().code("DAD").name("Da Nang International Airport").city("Da Nang").country("Vietnam").build(),
                Airport.builder().code("PQC").name("Phu Quoc International Airport").city("Phu Quoc").country("Vietnam").build(),
                Airport.builder().code("CXR").name("Cam Ranh International Airport").city("Nha Trang").country("Vietnam").build(),
                Airport.builder().code("DLI").name("Lien Khuong Airport").city("Da Lat").country("Vietnam").build(),
                Airport.builder().code("HPH").name("Cat Bi International Airport").city("Hai Phong").country("Vietnam").build(),
                Airport.builder().code("HUI").name("Phu Bai International Airport").city("Hue").country("Vietnam").build(),
                Airport.builder().code("VCA").name("Can Tho International Airport").city("Can Tho").country("Vietnam").build(),
                Airport.builder().code("VDO").name("Van Don International Airport").city("Quang Ninh").country("Vietnam").build(),
                // International Destinations
                Airport.builder().code("SAI").name("Siem Reap Angkor International Airport").city("Siem Reap").country("Cambodia").build(),
                Airport.builder().code("PNH").name("Phnom Penh International Airport").city("Phnom Penh").country("Cambodia").build(),
                Airport.builder().code("BKK").name("Suvarnabhumi Airport").city("Bangkok").country("Thailand").build(),
                Airport.builder().code("SIN").name("Singapore Changi Airport").city("Singapore").country("Singapore").build(),
                Airport.builder().code("NRT").name("Narita International Airport").city("Tokyo").country("Japan").build(),
                Airport.builder().code("ICN").name("Incheon International Airport").city("Seoul").country("South Korea").build(),
                Airport.builder().code("CDG").name("Paris Charles de Gaulle Airport").city("Paris").country("France").build(),
                Airport.builder().code("LHR").name("London Heathrow Airport").city("London").country("United Kingdom").build()
        );

        for (Airport a : airports) {
            if (airportRepository.findByCode(a.getCode()).isEmpty()) {
                airportRepository.save(a);
            }
        }
        log.info("Seeded/Verified national and international airport hubs.");
    }

    private void seedFlightsAndSeats() {
        Airport han = airportRepository.findByCode("HAN").orElse(null);
        Airport sgn = airportRepository.findByCode("SGN").orElse(null);
        Airport dad = airportRepository.findByCode("DAD").orElse(null);
        Airport pqc = airportRepository.findByCode("PQC").orElse(null);
        Airport cxr = airportRepository.findByCode("CXR").orElse(null);
        Airport dli = airportRepository.findByCode("DLI").orElse(null);
        Airport hui = airportRepository.findByCode("HUI").orElse(null);
        Airport vca = airportRepository.findByCode("VCA").orElse(null);

        Airport sai = airportRepository.findByCode("SAI").orElse(null);
        Airport pnh = airportRepository.findByCode("PNH").orElse(null);
        Airport bkk = airportRepository.findByCode("BKK").orElse(null);
        Airport sin = airportRepository.findByCode("SIN").orElse(null);
        Airport nrt = airportRepository.findByCode("NRT").orElse(null);
        Airport icn = airportRepository.findByCode("ICN").orElse(null);
        Airport cdg = airportRepository.findByCode("CDG").orElse(null);
        Airport lhr = airportRepository.findByCode("LHR").orElse(null);

        if (han == null || sgn == null || dad == null) {
            log.warn("Core airports not fully initialized yet.");
            return;
        }

        LocalDate today = LocalDate.now();

        record RouteTemplate(String flightNumber, String airline, Airport dep, Airport arr,
                             LocalTime depTime, LocalTime arrTime, BigDecimal price, int stops) {}

        List<RouteTemplate> routes = new ArrayList<>(List.of(
                // ==================== NATIONAL / DOMESTIC FLIGHTS ====================
                // Hanoi <-> Ho Chi Minh City
                new RouteTemplate("AS-101", "Vietnam Airlines", han, sgn, LocalTime.of(8, 30), LocalTime.of(10, 45), BigDecimal.valueOf(1450000), 0),
                new RouteTemplate("AS-102", "Bamboo Airways", sgn, han, LocalTime.of(13, 0), LocalTime.of(15, 15), BigDecimal.valueOf(1390000), 0),
                new RouteTemplate("AS-103", "Vietjet Air", han, sgn, LocalTime.of(16, 45), LocalTime.of(19, 0), BigDecimal.valueOf(1150000), 0),
                new RouteTemplate("AS-104", "Vietnam Airlines", sgn, han, LocalTime.of(20, 0), LocalTime.of(22, 15), BigDecimal.valueOf(1420000), 0),

                // Hanoi <-> Da Nang
                new RouteTemplate("AS-201", "Vietnam Airlines", han, dad, LocalTime.of(7, 15), LocalTime.of(8, 35), BigDecimal.valueOf(890000), 0),
                new RouteTemplate("AS-202", "Vietravel Airlines", dad, han, LocalTime.of(18, 30), LocalTime.of(19, 50), BigDecimal.valueOf(820000), 0),
                new RouteTemplate("AS-203", "Bamboo Airways", han, dad, LocalTime.of(12, 10), LocalTime.of(13, 30), BigDecimal.valueOf(920000), 0),

                // Da Nang <-> Ho Chi Minh City
                new RouteTemplate("AS-501", "Bamboo Airways", sgn, dad, LocalTime.of(14, 0), LocalTime.of(15, 25), BigDecimal.valueOf(870000), 0),
                new RouteTemplate("AS-502", "Vietjet Air", dad, sgn, LocalTime.of(10, 15), LocalTime.of(11, 40), BigDecimal.valueOf(850000), 0),
                new RouteTemplate("AS-503", "Vietnam Airlines", sgn, dad, LocalTime.of(19, 30), LocalTime.of(20, 55), BigDecimal.valueOf(950000), 0)
        ));

        // Phu Quoc & Nha Trang
        if (pqc != null) {
            routes.add(new RouteTemplate("AS-301", "Bamboo Airways", sgn, pqc, LocalTime.of(9, 40), LocalTime.of(10, 40), BigDecimal.valueOf(980000), 0));
            routes.add(new RouteTemplate("AS-302", "Vietjet Air", pqc, sgn, LocalTime.of(16, 20), LocalTime.of(17, 20), BigDecimal.valueOf(910000), 0));
            routes.add(new RouteTemplate("AS-303", "Vietnam Airlines", han, pqc, LocalTime.of(7, 0), LocalTime.of(9, 15), BigDecimal.valueOf(1650000), 0));
            routes.add(new RouteTemplate("AS-304", "Vietnam Airlines", pqc, han, LocalTime.of(17, 30), LocalTime.of(19, 45), BigDecimal.valueOf(1650000), 0));
        }
        if (cxr != null) {
            routes.add(new RouteTemplate("AS-401", "Vietnam Airlines", han, cxr, LocalTime.of(11, 15), LocalTime.of(13, 10), BigDecimal.valueOf(1280000), 0));
            routes.add(new RouteTemplate("AS-402", "Bamboo Airways", cxr, han, LocalTime.of(15, 0), LocalTime.of(16, 55), BigDecimal.valueOf(1250000), 0));
            routes.add(new RouteTemplate("AS-403", "Vietjet Air", sgn, cxr, LocalTime.of(8, 0), LocalTime.of(9, 0), BigDecimal.valueOf(790000), 0));
        }
        if (dli != null) {
            routes.add(new RouteTemplate("AS-351", "Bamboo Airways", han, dli, LocalTime.of(6, 45), LocalTime.of(8, 40), BigDecimal.valueOf(1120000), 0));
            routes.add(new RouteTemplate("AS-352", "Vietjet Air", sgn, dli, LocalTime.of(11, 10), LocalTime.of(12, 0), BigDecimal.valueOf(650000), 0));
        }
        if (hui != null) {
            routes.add(new RouteTemplate("AS-251", "Vietnam Airlines", han, hui, LocalTime.of(9, 15), LocalTime.of(10, 30), BigDecimal.valueOf(890000), 0));
        }
        if (vca != null) {
            routes.add(new RouteTemplate("AS-151", "Bamboo Airways", han, vca, LocalTime.of(13, 15), LocalTime.of(15, 25), BigDecimal.valueOf(1350000), 0));
        }

        // ==================== INTERNATIONAL FLIGHTS ====================
        // Singapore (SIN)
        if (sin != null) {
            routes.add(new RouteTemplate("AS-601", "Singapore Airlines", han, sin, LocalTime.of(10, 30), LocalTime.of(14, 50), BigDecimal.valueOf(3200000), 0));
            routes.add(new RouteTemplate("AS-602", "Singapore Airlines", sin, han, LocalTime.of(15, 45), LocalTime.of(18, 15), BigDecimal.valueOf(3200000), 0));
            routes.add(new RouteTemplate("AS-603", "Scoot", sgn, sin, LocalTime.of(9, 10), LocalTime.of(12, 15), BigDecimal.valueOf(2100000), 0));
            routes.add(new RouteTemplate("AS-604", "Scoot", sin, sgn, LocalTime.of(16, 0), LocalTime.of(17, 10), BigDecimal.valueOf(2100000), 0));
            routes.add(new RouteTemplate("AS-605", "Singapore Airlines", dad, sin, LocalTime.of(11, 55), LocalTime.of(15, 45), BigDecimal.valueOf(2890000), 0));
        }

        // Thailand - Bangkok (BKK)
        if (bkk != null) {
            routes.add(new RouteTemplate("AS-701", "Thai Airways", sgn, bkk, LocalTime.of(11, 45), LocalTime.of(13, 15), BigDecimal.valueOf(2750000), 0));
            routes.add(new RouteTemplate("AS-702", "Thai Airways", bkk, sgn, LocalTime.of(15, 0), LocalTime.of(16, 30), BigDecimal.valueOf(2750000), 0));
            routes.add(new RouteTemplate("AS-703", "Vietjet Air", han, bkk, LocalTime.of(12, 15), LocalTime.of(14, 15), BigDecimal.valueOf(1850000), 0));
            routes.add(new RouteTemplate("AS-704", "AirAsia", dad, bkk, LocalTime.of(9, 30), LocalTime.of(11, 15), BigDecimal.valueOf(1950000), 0));
        }

        // Cambodia - Siem Reap & Phnom Penh (SAI / PNH)
        if (sai != null) {
            routes.add(new RouteTemplate("AS-801", "Cambodia Angkor Air", han, sai, LocalTime.of(14, 20), LocalTime.of(16, 15), BigDecimal.valueOf(2450000), 0));
            routes.add(new RouteTemplate("AS-802", "Cambodia Angkor Air", sai, han, LocalTime.of(17, 15), LocalTime.of(19, 05), BigDecimal.valueOf(2450000), 0));
            routes.add(new RouteTemplate("AS-803", "Vietnam Airlines", sgn, sai, LocalTime.of(8, 15), LocalTime.of(9, 30), BigDecimal.valueOf(2150000), 0));
            routes.add(new RouteTemplate("AS-804", "Vietnam Airlines", sai, sgn, LocalTime.of(10, 30), LocalTime.of(11, 45), BigDecimal.valueOf(2150000), 0));
            if (bkk != null) {
                routes.add(new RouteTemplate("AS-811", "Cambodia Angkor Air", sai, bkk, LocalTime.of(10, 0), LocalTime.of(11, 10), BigDecimal.valueOf(2100000), 0));
                routes.add(new RouteTemplate("AS-812", "Bangkok Airways", bkk, sai, LocalTime.of(13, 30), LocalTime.of(14, 40), BigDecimal.valueOf(2100000), 0));
            }
            if (sin != null) {
                routes.add(new RouteTemplate("AS-813", "Singapore Airlines", sai, sin, LocalTime.of(12, 15), LocalTime.of(15, 30), BigDecimal.valueOf(2650000), 0));
                routes.add(new RouteTemplate("AS-814", "Singapore Airlines", sin, sai, LocalTime.of(8, 45), LocalTime.of(10, 0), BigDecimal.valueOf(2650000), 0));
            }
            if (nrt != null) {
                routes.add(new RouteTemplate("AS-815", "Japan Airlines", sai, nrt, LocalTime.of(22, 30), LocalTime.of(6, 15), BigDecimal.valueOf(7350000), 0));
                routes.add(new RouteTemplate("AS-816", "Japan Airlines", nrt, sai, LocalTime.of(10, 0), LocalTime.of(15, 45), BigDecimal.valueOf(7350000), 0));
            }
        }
        if (pnh != null) {
            routes.add(new RouteTemplate("AS-805", "Cambodia Angkor Air", sgn, pnh, LocalTime.of(11, 0), LocalTime.of(11, 50), BigDecimal.valueOf(1750000), 0));
            routes.add(new RouteTemplate("AS-806", "Cambodia Angkor Air", pnh, sgn, LocalTime.of(14, 0), LocalTime.of(14, 55), BigDecimal.valueOf(1750000), 0));
            routes.add(new RouteTemplate("AS-807", "Vietnam Airlines", han, pnh, LocalTime.of(9, 30), LocalTime.of(11, 40), BigDecimal.valueOf(2350000), 0));
            routes.add(new RouteTemplate("AS-808", "Vietnam Airlines", pnh, han, LocalTime.of(13, 15), LocalTime.of(15, 25), BigDecimal.valueOf(2350000), 0));
            if (bkk != null) {
                routes.add(new RouteTemplate("AS-821", "Cambodia Angkor Air", pnh, bkk, LocalTime.of(8, 30), LocalTime.of(9, 45), BigDecimal.valueOf(1950000), 0));
                routes.add(new RouteTemplate("AS-822", "Bangkok Airways", bkk, pnh, LocalTime.of(15, 20), LocalTime.of(16, 35), BigDecimal.valueOf(1950000), 0));
            }
            if (sin != null) {
                routes.add(new RouteTemplate("AS-823", "Singapore Airlines", pnh, sin, LocalTime.of(10, 45), LocalTime.of(13, 50), BigDecimal.valueOf(2450000), 0));
                routes.add(new RouteTemplate("AS-824", "Singapore Airlines", sin, pnh, LocalTime.of(16, 0), LocalTime.of(17, 05), BigDecimal.valueOf(2450000), 0));
            }
            if (nrt != null) {
                routes.add(new RouteTemplate("AS-825", "Cambodia Angkor Air", pnh, nrt, LocalTime.of(23, 0), LocalTime.of(6, 45), BigDecimal.valueOf(7450000), 0));
                routes.add(new RouteTemplate("AS-826", "Japan Airlines", nrt, pnh, LocalTime.of(11, 15), LocalTime.of(16, 30), BigDecimal.valueOf(7450000), 0));
            }
            if (icn != null) {
                routes.add(new RouteTemplate("AS-827", "Korean Air", pnh, icn, LocalTime.of(23, 40), LocalTime.of(7, 05), BigDecimal.valueOf(5600000), 0));
                routes.add(new RouteTemplate("AS-828", "Korean Air", icn, pnh, LocalTime.of(18, 30), LocalTime.of(22, 10), BigDecimal.valueOf(5600000), 0));
            }
        }

        // Japan - Tokyo Narita (NRT)
        if (nrt != null) {
            routes.add(new RouteTemplate("AS-901", "Japan Airlines", han, nrt, LocalTime.of(23, 20), LocalTime.of(6, 40), BigDecimal.valueOf(7850000), 0));
            routes.add(new RouteTemplate("AS-902", "Japan Airlines", nrt, han, LocalTime.of(9, 30), LocalTime.of(13, 40), BigDecimal.valueOf(7850000), 0));
            routes.add(new RouteTemplate("AS-903", "Vietnam Airlines", sgn, nrt, LocalTime.of(0, 30), LocalTime.of(7, 50), BigDecimal.valueOf(7500000), 0));
        }

        // South Korea - Seoul Incheon (ICN)
        if (icn != null) {
            routes.add(new RouteTemplate("AS-911", "Korean Air", han, icn, LocalTime.of(12, 10), LocalTime.of(18, 30), BigDecimal.valueOf(5600000), 0));
            routes.add(new RouteTemplate("AS-912", "Korean Air", icn, han, LocalTime.of(8, 05), LocalTime.of(10, 45), BigDecimal.valueOf(5600000), 0));
            routes.add(new RouteTemplate("AS-913", "Vietjet Air", dad, icn, LocalTime.of(23, 45), LocalTime.of(6, 0), BigDecimal.valueOf(3250000), 0));
        }

        // France - Paris Charles de Gaulle (CDG)
        if (cdg != null) {
            routes.add(new RouteTemplate("AS-921", "Air France", han, cdg, LocalTime.of(23, 50), LocalTime.of(7, 10), BigDecimal.valueOf(14200000), 0));
            routes.add(new RouteTemplate("AS-922", "Air France", cdg, han, LocalTime.of(13, 40), LocalTime.of(6, 20), BigDecimal.valueOf(14200000), 0));
        }

        // United Kingdom - London Heathrow (LHR)
        if (lhr != null) {
            routes.add(new RouteTemplate("AS-931", "British Airways", sgn, lhr, LocalTime.of(1, 15), LocalTime.of(8, 45), BigDecimal.valueOf(15600000), 0));
            routes.add(new RouteTemplate("AS-932", "British Airways", lhr, sgn, LocalTime.of(11, 20), LocalTime.of(5, 30), BigDecimal.valueOf(15600000), 0));
        }

        // Seed across multiple days (today, +1, +2, +3, +4)
        for (int dayOffset = 0; dayOffset <= 4; dayOffset++) {
            LocalDate flightDate = today.plusDays(dayOffset);

            for (RouteTemplate r : routes) {
                String flightNo = dayOffset == 0 ? r.flightNumber() : r.flightNumber() + "-D" + dayOffset;
                if (flightRepository.findByFlightNumber(flightNo).isPresent()) {
                    continue;
                }

                Flight flight = Flight.builder()
                        .flightNumber(flightNo)
                        .airline(r.airline())
                        .departureAirport(r.dep())
                        .arrivalAirport(r.arr())
                        .departureTime(LocalDateTime.of(flightDate, r.depTime()))
                        .arrivalTime(LocalDateTime.of(flightDate, r.arrTime()))
                        .basePrice(r.price())
                        .status(FlightStatus.SCHEDULED)
                        .stops(r.stops())
                        .seats(new ArrayList<>())
                        .build();

                Flight saved = flightRepository.save(flight);
                flightService.generateSeatMatrix(saved);
            }
        }
        log.info("Seeded initial national and international scheduled flights and seat matrices.");
    }

    private void seedSampleBookings() {
        if (bookingRepository.count() > 0) return;

        User passenger = userRepository.findByEmail("passenger@aerosmart.com").orElse(null);
        if (passenger == null) return;

        Flight flight = flightRepository.findByFlightNumber("AS-101").orElse(null);
        if (flight == null) return;

        List<Seat> seats = seatRepository.findByFlightIdOrderBySeatNumberAsc(flight.getId());
        if (seats.size() < 4) return;

        // Seat 1A (Business) booked
        Seat seat1 = seats.get(0); // 1A
        seat1.setStatus(SeatStatus.BOOKED);
        seatRepository.save(seat1);

        // Seat 4A (Economy) booked
        Seat seat2 = seats.stream().filter(s -> "4A".equals(s.getSeatNumber())).findFirst().orElse(seats.get(12));
        seat2.setStatus(SeatStatus.BOOKED);
        seatRepository.save(seat2);

        // Seat 4B (Economy) held
        Seat seat3 = seats.stream().filter(s -> "4B".equals(s.getSeatNumber())).findFirst().orElse(seats.get(13));
        seat3.setStatus(SeatStatus.HELD);
        seatRepository.save(seat3);

        // Sample confirmed booking for passenger
        BigDecimal total = flight.getBasePrice().multiply(BigDecimal.valueOf(2.2));
        Booking booking = Booking.builder()
                .bookingReference("AS7F3K21")
                .user(passenger)
                .flight(flight)
                .totalAmount(total)
                .status(BookingStatus.CONFIRMED)
                .createdAt(LocalDateTime.now().minusDays(1))
                .paymentMethod("VNPAY")
                .transactionId("VNP_20260828_984321")
                .passengers(new ArrayList<>())
                .build();

        Passenger p = Passenger.builder()
                .booking(booking)
                .fullName(passenger.getFullName())
                .passportNumber("B9823412")
                .seat(seat1)
                .build();
        booking.getPassengers().add(p);

        bookingRepository.save(booking);
        log.info("Seeded demo booking AS7F3K21 for passenger@aerosmart.com");
    }

    private final com.aerosmart.repository.DestinationDealRepository destinationDealRepository;

    private void seedDestinationDeals() {
        destinationDealRepository.deleteAll();

        List<com.aerosmart.domain.DestinationDeal> deals = List.of(
            // --- CAMBODIA PROMOTIONAL DEALS ---
            com.aerosmart.domain.DestinationDeal.builder()
                .origin("HAN").destination("SAI")
                .titleEn("Siem Reap (Angkor Wat)").titleVi("Siem Reap (Quần thể Angkor)").titleKm("សៀមរាប (ប្រាសាទអង្គរវត្ត)")
                .category("INTERNATIONAL")
                .imageUrl("https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=700&q=80")
                .price(new BigDecimal("1990000"))
                .datesEn("Sep 13 - Sep 16 · Round-trip").datesVi("13 Th9 - 16 Th9 · Khứ hồi").datesKm("13 កញ្ញា - 16 កញ្ញា · ទៅមក")
                .active(true).displayOrder(1)
                .build(),
            com.aerosmart.domain.DestinationDeal.builder()
                .origin("SGN").destination("PNH")
                .titleEn("Phnom Penh (Royal Palace)").titleVi("Phnom Penh (Hoàng cung)").titleKm("រាជធានីភ្នំពេញ (ព្រះបរមរាជវាំង)")
                .category("INTERNATIONAL")
                .imageUrl("https://images.unsplash.com/photo-1583252927237-772b16644fcf?auto=format&fit=crop&w=700&q=80")
                .price(new BigDecimal("1650000"))
                .datesEn("Sep 12 - Sep 15 · Round-trip").datesVi("12 Th9 - 15 Th9 · Khứ hồi").datesKm("12 កញ្ញា - 15 កញ្ញា · ទៅមក")
                .active(true).displayOrder(2)
                .build(),
            com.aerosmart.domain.DestinationDeal.builder()
                .origin("PNH").destination("SGN")
                .titleEn("Phnom Penh to Ho Chi Minh City").titleVi("Phnom Penh đến TP. Hồ Chí Minh").titleKm("ភ្នំពេញ ទៅ ទីក្រុងហូជីមិញ")
                .category("INTERNATIONAL")
                .imageUrl("https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=700&q=80")
                .price(new BigDecimal("1650000"))
                .datesEn("Sep 10 - Sep 13 · Round-trip").datesVi("10 Th9 - 13 Th9 · Khứ hồi").datesKm("10 កញ្ញា - 13 កញ្ញា · ទៅមក")
                .active(true).displayOrder(3)
                .build(),
            com.aerosmart.domain.DestinationDeal.builder()
                .origin("SAI").destination("HAN")
                .titleEn("Siem Reap to Hanoi").titleVi("Siem Reap đến Hà Nội").titleKm("សៀមរាប ទៅ ហាណូយ")
                .category("INTERNATIONAL")
                .imageUrl("https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=80")
                .price(new BigDecimal("1990000"))
                .datesEn("Sep 12 - Sep 15 · Round-trip").datesVi("12 Th9 - 15 Th9 · Khứ hồi").datesKm("12 កញ្ញា - 15 កញ្ញា · ទៅមក")
                .active(true).displayOrder(4)
                .build(),
            com.aerosmart.domain.DestinationDeal.builder()
                .origin("PNH").destination("SIN")
                .titleEn("Phnom Penh to Singapore").titleVi("Phnom Penh đến Singapore").titleKm("ភ្នំពេញ ទៅ សិង្ហបុរី")
                .category("INTERNATIONAL")
                .imageUrl("https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=700&q=80")
                .price(new BigDecimal("2150000"))
                .datesEn("Sep 15 - Sep 18 · Round-trip").datesVi("15 Th9 - 18 Th9 · Khứ hồi").datesKm("15 កញ្ញា - 18 កញ្ញា · ទៅមក")
                .active(true).displayOrder(5)
                .build(),
            com.aerosmart.domain.DestinationDeal.builder()
                .origin("SAI").destination("BKK")
                .titleEn("Siem Reap to Bangkok").titleVi("Siem Reap đến Bangkok").titleKm("សៀមរាប ទៅ បាងកក")
                .category("INTERNATIONAL")
                .imageUrl("https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=700&q=80")
                .price(new BigDecimal("1850000"))
                .datesEn("Sep 14 - Sep 17 · Round-trip").datesVi("14 Th9 - 17 Th9 · Khứ hồi").datesKm("14 កញ្ញា - 17 កញ្ញា · ទៅមក")
                .active(true).displayOrder(6)
                .build(),

            // --- OTHER INTERNATIONAL DEALS ---
            com.aerosmart.domain.DestinationDeal.builder()
                .origin("HAN").destination("BKK")
                .titleEn("Bangkok").titleVi("Bangkok").titleKm("បាងកក")
                .category("INTERNATIONAL")
                .imageUrl("https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=700&q=80")
                .price(new BigDecimal("1890000"))
                .datesEn("Sep 11 - Sep 13 · Round-trip").datesVi("11 Th9 - 13 Th9 · Khứ hồi").datesKm("11 កញ្ញា - 13 កញ្ញា · ទៅមក")
                .active(true).displayOrder(7)
                .build(),
            com.aerosmart.domain.DestinationDeal.builder()
                .origin("HAN").destination("NRT")
                .titleEn("Tokyo (Narita)").titleVi("Tokyo (Narita)").titleKm("តូក្យូ (ណារីតា)")
                .category("INTERNATIONAL")
                .imageUrl("https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=700&q=80")
                .price(new BigDecimal("4890000"))
                .datesEn("Sep 9 - Sep 11 · Round-trip").datesVi("09 Th9 - 11 Th9 · Khứ hồi").datesKm("09 កញ្ញា - 11 កញ្ញា · ទៅមក")
                .active(true).displayOrder(8)
                .build(),
            com.aerosmart.domain.DestinationDeal.builder()
                .origin("DAD").destination("ICN")
                .titleEn("Seoul (Incheon)").titleVi("Seoul (Incheon)").titleKm("សេអ៊ូល (អ៊ិនឈុន)")
                .category("INTERNATIONAL")
                .imageUrl("https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=700&q=80")
                .price(new BigDecimal("3250000"))
                .datesEn("Sep 16 - Sep 20 · Round-trip").datesVi("16 Th9 - 20 Th9 · Khứ hồi").datesKm("16 កញ្ញា - 20 កញ្ញា · ទៅមក")
                .active(true).displayOrder(9)
                .build(),

            // --- DOMESTIC DEALS ---
            com.aerosmart.domain.DestinationDeal.builder()
                .origin("SGN").destination("DAD")
                .titleEn("Da Nang").titleVi("Đà Nẵng").titleKm("ដាណាំង")
                .category("DOMESTIC")
                .imageUrl("https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=700&q=80")
                .price(new BigDecimal("890000"))
                .datesEn("Sep 11 - Sep 14 · Round-trip").datesVi("11 Th9 - 14 Th9 · Khứ hồi").datesKm("11 កញ្ញា - 14 កញ្ញា · ទៅមក")
                .active(true).displayOrder(10)
                .build(),
            com.aerosmart.domain.DestinationDeal.builder()
                .origin("SGN").destination("PQC")
                .titleEn("Phu Quoc Island").titleVi("Đảo Phú Quốc").titleKm("កោះត្រល់ (ភូកុក)")
                .category("DOMESTIC")
                .imageUrl("https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80")
                .price(new BigDecimal("990000"))
                .datesEn("Sep 12 - Sep 15 · Round-trip").datesVi("12 Th9 - 15 Th9 · Khứ hồi").datesKm("12 កញ្ញា - 15 កញ្ញា · ទៅមក")
                .active(true).displayOrder(11)
                .build(),
            com.aerosmart.domain.DestinationDeal.builder()
                .origin("HAN").destination("SGN")
                .titleEn("Ho Chi Minh City").titleVi("TP. Hồ Chí Minh").titleKm("ទីក្រុងហូជីមិញ")
                .category("DOMESTIC")
                .imageUrl("https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=700&q=80")
                .price(new BigDecimal("1290000"))
                .datesEn("Sep 10 - Sep 12 · Round-trip").datesVi("10 Th9 - 12 Th9 · Khứ hồi").datesKm("10 កញ្ញា - 12 កញ្ញា · ទៅមក")
                .active(true).displayOrder(12)
                .build()
        );
        destinationDealRepository.saveAll(deals);
        log.info("Seeded/Refreshed Cambodia & International destination deals.");
    }

    private final com.aerosmart.repository.CountrySpotlightRepository countrySpotlightRepository;

    private void seedCountries() {
        countrySpotlightRepository.deleteAll();

        List<com.aerosmart.domain.CountrySpotlight> countries = List.of(
            // --- CAMBODIA FEATURED #1 ---
            com.aerosmart.domain.CountrySpotlight.builder()
                .countryCode("kh").nameEn("Cambodia").nameVi("Campuchia").nameKm("កម្ពុជា")
                .targetDestination("SAI")
                .imageUrl("https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=700&q=80")
                .active(true).displayOrder(1)
                .build(),
            com.aerosmart.domain.CountrySpotlight.builder()
                .countryCode("vn").nameEn("Vietnam").nameVi("Việt Nam").nameKm("វៀតណាម")
                .targetDestination("DAD")
                .imageUrl("https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=700&q=80")
                .active(true).displayOrder(2)
                .build(),
            com.aerosmart.domain.CountrySpotlight.builder()
                .countryCode("th").nameEn("Thailand").nameVi("Thái Lan").nameKm("ថៃ")
                .targetDestination("BKK")
                .imageUrl("https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=700&q=80")
                .active(true).displayOrder(3)
                .build(),
            com.aerosmart.domain.CountrySpotlight.builder()
                .countryCode("sg").nameEn("Singapore").nameVi("Singapore").nameKm("សិង្ហបុរី")
                .targetDestination("SIN")
                .imageUrl("https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=700&q=80")
                .active(true).displayOrder(4)
                .build(),
            com.aerosmart.domain.CountrySpotlight.builder()
                .countryCode("jp").nameEn("Japan").nameVi("Nhật Bản").nameKm("ជប៉ុន")
                .targetDestination("NRT")
                .imageUrl("https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=700&q=80")
                .active(true).displayOrder(5)
                .build(),
            com.aerosmart.domain.CountrySpotlight.builder()
                .countryCode("kr").nameEn("South Korea").nameVi("Hàn Quốc").nameKm("កូរ៉េខាងត្បូង")
                .targetDestination("ICN")
                .imageUrl("https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=700&q=80")
                .active(true).displayOrder(6)
                .build(),
            com.aerosmart.domain.CountrySpotlight.builder()
                .countryCode("fr").nameEn("France").nameVi("Pháp").nameKm("បារាំង")
                .targetDestination("CDG")
                .imageUrl("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=80")
                .active(true).displayOrder(7)
                .build(),
            com.aerosmart.domain.CountrySpotlight.builder()
                .countryCode("gb").nameEn("United Kingdom").nameVi("Vương Quốc Anh").nameKm("ចក្រភពអង់គ្លេស")
                .targetDestination("LHR")
                .imageUrl("https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80")
                .active(true).displayOrder(8)
                .build()
        );
        countrySpotlightRepository.saveAll(countries);
        log.info("Seeded initial country spotlights with Cambodia featured first.");
    }
}
