package com.aerosmart.service;

import com.aerosmart.domain.Airport;
import com.aerosmart.domain.Flight;
import com.aerosmart.domain.FlightStatus;
import com.aerosmart.domain.Seat;
import com.aerosmart.domain.SeatClass;
import com.aerosmart.domain.SeatStatus;
import com.aerosmart.dto.AirportDto;
import com.aerosmart.dto.CreateFlightRequest;
import com.aerosmart.dto.FlightDto;
import com.aerosmart.dto.FlightSearchCriteria;
import com.aerosmart.dto.FlightSeatMapDto;
import com.aerosmart.dto.SeatDto;
import com.aerosmart.exception.ApiException;
import com.aerosmart.exception.ResourceNotFoundException;
import com.aerosmart.repository.AirportRepository;
import com.aerosmart.repository.FlightRepository;
import com.aerosmart.repository.SeatRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
public class FlightService {

    private final FlightRepository flightRepository;
    private final AirportRepository airportRepository;
    private final SeatRepository seatRepository;

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;

    public FlightService(FlightRepository flightRepository,
                         AirportRepository airportRepository,
                         SeatRepository seatRepository) {
        this.flightRepository = flightRepository;
        this.airportRepository = airportRepository;
        this.seatRepository = seatRepository;
    }

    @Transactional
    public List<FlightDto> searchFlights(FlightSearchCriteria criteria) {
        String cacheKey = "flight:search:" + criteria.getOrigin() + ":" + criteria.getDestination() + ":"
                + criteria.getDepartureDate() + ":" + criteria.getAirline() + ":" + criteria.getSortBy();

        if (redisTemplate != null) {
            try {
                Object cached = redisTemplate.opsForValue().get(cacheKey);
                if (cached instanceof List<?>) {
                    log.debug("Returning cached flight search results for key {}", cacheKey);
                    // Type safe conversion
                    @SuppressWarnings("unchecked")
                    List<FlightDto> cachedList = (List<FlightDto>) cached;
                    return cachedList;
                }
            } catch (Exception e) {
                log.debug("Redis cache miss or read error: {}", e.getMessage());
            }
        }

        List<Flight> flights = new ArrayList<>();
        boolean hasOrigin = criteria.getOrigin() != null && !criteria.getOrigin().trim().isBlank();
        boolean hasDest = criteria.getDestination() != null && !criteria.getDestination().trim().isBlank();

        if (hasOrigin && hasDest) {
            String orig = criteria.getOrigin().trim().toUpperCase(Locale.ROOT);
            String dest = criteria.getDestination().trim().toUpperCase(Locale.ROOT);
            LocalDate depDate = criteria.getDepartureDate();

            if (depDate != null) {
                LocalDateTime start = depDate.atStartOfDay();
                LocalDateTime end = depDate.atTime(LocalTime.MAX);
                flights = flightRepository.search(orig, dest, start, end);
            } else {
                flights = flightRepository.findByRoute(orig, dest);
            }

            // If no flights found on that date or route, auto-generate schedule for valid airport pair
            if (flights.isEmpty()) {
                Airport depAirport = airportRepository.findByCode(orig).orElse(null);
                Airport arrAirport = airportRepository.findByCode(dest).orElse(null);
                if (depAirport != null && arrAirport != null) {
                    flights = generateSchedulesForRoute(depAirport, arrAirport, depDate != null ? depDate : LocalDate.now());
                }
            }

            // If still empty (e.g. invalid airport code), check if any flights match the route without date
            if (flights.isEmpty()) {
                flights = flightRepository.findByRoute(orig, dest);
            }
        } else if (hasOrigin) {
            String orig = criteria.getOrigin().trim().toUpperCase(Locale.ROOT);
            flights = flightRepository.findAll().stream()
                    .filter(f -> f.getDepartureAirport() != null && orig.equalsIgnoreCase(f.getDepartureAirport().getCode()))
                    .toList();
        } else if (hasDest) {
            String dest = criteria.getDestination().trim().toUpperCase(Locale.ROOT);
            flights = flightRepository.findAll().stream()
                    .filter(f -> f.getArrivalAirport() != null && dest.equalsIgnoreCase(f.getArrivalAirport().getCode()))
                    .toList();
        } else {
            flights = flightRepository.findAll();
        }

        List<FlightDto> results = flights.stream()
                .filter(f -> criteria.getAirline() == null || criteria.getAirline().isBlank()
                        || f.getAirline().equalsIgnoreCase(criteria.getAirline().trim()))
                .filter(f -> criteria.getMaxStops() == null || f.getStops() <= criteria.getMaxStops())
                .filter(f -> criteria.getMaxPrice() == null || f.getBasePrice().compareTo(criteria.getMaxPrice()) <= 0)
                .map(this::toFlightDto)
                .collect(Collectors.toList());

        // Sorting
        if ("PRICE_ASC".equalsIgnoreCase(criteria.getSortBy())) {
            results.sort(Comparator.comparing(FlightDto::getBasePrice));
        } else if ("PRICE_DESC".equalsIgnoreCase(criteria.getSortBy())) {
            results.sort(Comparator.comparing(FlightDto::getBasePrice).reversed());
        } else if ("DURATION_ASC".equalsIgnoreCase(criteria.getSortBy())) {
            results.sort(Comparator.comparingLong(FlightDto::getDurationMinutes));
        } else if ("DEPARTURE_DESC".equalsIgnoreCase(criteria.getSortBy())) {
            results.sort(Comparator.comparing(FlightDto::getDepartureTime).reversed());
        } else {
            results.sort(Comparator.comparing(FlightDto::getDepartureTime));
        }

        if (redisTemplate != null) {
            try {
                redisTemplate.opsForValue().set(cacheKey, results, 60, TimeUnit.SECONDS);
            } catch (Exception e) {
                log.debug("Unable to cache flight search in Redis: {}", e.getMessage());
            }
        }

        return results;
    }

    @Transactional(readOnly = true)
    public FlightDto getFlightById(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight", "id", id));
        return toFlightDto(flight);
    }

    @Transactional(readOnly = true)
    public FlightSeatMapDto getFlightSeats(Long flightId) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight", "id", flightId));

        List<Seat> seats = seatRepository.findByFlightIdOrderBySeatNumberAsc(flightId);

        List<SeatDto> seatDtos = seats.stream().map(s -> {
            BigDecimal multiplier = s.getPriceMultiplier() != null ? s.getPriceMultiplier() : BigDecimal.ONE;
            BigDecimal price = flight.getBasePrice().multiply(multiplier).setScale(0, RoundingMode.HALF_UP);
            return SeatDto.builder()
                    .id(s.getId())
                    .seatNumber(s.getSeatNumber())
                    .seatClass(s.getSeatClass().name())
                    .status(s.getStatus().name())
                    .price(price)
                    .build();
        }).collect(Collectors.toList());

        return FlightSeatMapDto.builder()
                .flightId(flight.getId())
                .flightNumber(flight.getFlightNumber())
                .seats(seatDtos)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AirportDto> listAirports() {
        return airportRepository.findAllByOrderByCodeAsc().stream()
                .map(this::toAirportDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public FlightDto createFlight(CreateFlightRequest request) {
        if (flightRepository.existsByFlightNumber(request.getFlightNumber())) {
            throw new ApiException(HttpStatus.CONFLICT, "Flight number " + request.getFlightNumber() + " already exists.");
        }

        Airport dep = airportRepository.findByCode(request.getDepartureAirportCode().trim().toUpperCase(Locale.ROOT))
                .orElseThrow(() -> new ResourceNotFoundException("Airport", "code", request.getDepartureAirportCode()));

        Airport arr = airportRepository.findByCode(request.getArrivalAirportCode().trim().toUpperCase(Locale.ROOT))
                .orElseThrow(() -> new ResourceNotFoundException("Airport", "code", request.getArrivalAirportCode()));

        if (dep.getCode().equalsIgnoreCase(arr.getCode())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Departure and arrival airports cannot be identical.");
        }

        Flight flight = Flight.builder()
                .flightNumber(request.getFlightNumber().trim().toUpperCase(Locale.ROOT))
                .airline(request.getAirline().trim())
                .departureAirport(dep)
                .arrivalAirport(arr)
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .basePrice(request.getBasePrice())
                .status(FlightStatus.SCHEDULED)
                .stops(request.getStops())
                .seats(new ArrayList<>())
                .build();

        Flight saved = flightRepository.save(flight);

        if (request.isGenerateSeats()) {
            generateSeatMatrix(saved);
        }

        log.info("Created flight {} from {} to {}", saved.getFlightNumber(), dep.getCode(), arr.getCode());
        return toFlightDto(saved);
    }

    @Transactional
    public FlightDto updateFlight(Long id, CreateFlightRequest request) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight", "id", id));

        Airport dep = airportRepository.findByCode(request.getDepartureAirportCode())
                .orElseThrow(() -> new ResourceNotFoundException("Airport", "code", request.getDepartureAirportCode()));
        Airport arr = airportRepository.findByCode(request.getArrivalAirportCode())
                .orElseThrow(() -> new ResourceNotFoundException("Airport", "code", request.getArrivalAirportCode()));

        flight.setFlightNumber(request.getFlightNumber().trim().toUpperCase(Locale.ROOT));
        flight.setAirline(request.getAirline().trim());
        flight.setDepartureAirport(dep);
        flight.setArrivalAirport(arr);
        flight.setDepartureTime(request.getDepartureTime());
        flight.setArrivalTime(request.getArrivalTime());
        flight.setBasePrice(request.getBasePrice());
        flight.setStops(request.getStops());

        Flight updated = flightRepository.save(flight);
        log.info("Updated flight id={} ({})", id, updated.getFlightNumber());
        return toFlightDto(updated);
    }

    @Transactional
    public FlightDto updateFlightStatus(Long id, String statusStr) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight", "id", id));

        FlightStatus status;
        try {
            status = FlightStatus.valueOf(statusStr.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid flight status: " + statusStr);
        }

        flight.setStatus(status);
        Flight updated = flightRepository.save(flight);
        log.info("Updated flight {} status to {}", flight.getFlightNumber(), status);
        return toFlightDto(updated);
    }

    @Transactional
    public void deleteFlight(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight", "id", id));
        flightRepository.delete(flight);
        log.info("Deleted flight id={}", id);
    }

    @Transactional
    public AirportDto createAirport(AirportDto dto) {
        String code = dto.getCode().trim().toUpperCase(Locale.ROOT);
        if (airportRepository.findByCode(code).isPresent()) {
            throw new ApiException(HttpStatus.CONFLICT, "Airport with code " + code + " already exists.");
        }
        Airport airport = Airport.builder()
                .code(code)
                .name(dto.getName().trim())
                .city(dto.getCity().trim())
                .country(dto.getCountry().trim())
                .build();
        Airport saved = airportRepository.save(airport);
        return toAirportDto(saved);
    }

    @Transactional
    public AirportDto updateAirport(String code, AirportDto dto) {
        Airport airport = airportRepository.findByCode(code.trim().toUpperCase(Locale.ROOT))
                .orElseThrow(() -> new ResourceNotFoundException("Airport", "code", code));

        airport.setName(dto.getName().trim());
        airport.setCity(dto.getCity().trim());
        airport.setCountry(dto.getCountry().trim());
        Airport saved = airportRepository.save(airport);
        return toAirportDto(saved);
    }

    @Transactional
    public void deleteAirport(String code) {
        Airport airport = airportRepository.findByCode(code.trim().toUpperCase(Locale.ROOT))
                .orElseThrow(() -> new ResourceNotFoundException("Airport", "code", code));
        airportRepository.delete(airport);
    }

    public void generateSeatMatrix(Flight flight) {
        List<Seat> seats = new ArrayList<>();

        // Business rows 1-3 (2-2 configuration: A, C, D, F)
        String[] bizCols = {"A", "C", "D", "F"};
        for (int r = 1; r <= 3; r++) {
            for (String col : bizCols) {
                seats.add(Seat.builder()
                        .flight(flight)
                        .seatNumber(r + col)
                        .seatClass(SeatClass.BUSINESS)
                        .status(SeatStatus.AVAILABLE)
                        .priceMultiplier(BigDecimal.valueOf(2.2))
                        .build());
            }
        }

        // Economy rows 4-20 (3-3 configuration: A, B, C, D, E, F)
        String[] ecoCols = {"A", "B", "C", "D", "E", "F"};
        for (int r = 4; r <= 20; r++) {
            for (String col : ecoCols) {
                // Exit row 12 or front rows with extra legroom
                BigDecimal multiplier = (r == 4 || r == 12) ? BigDecimal.valueOf(1.2) : BigDecimal.ONE;
                seats.add(Seat.builder()
                        .flight(flight)
                        .seatNumber(r + col)
                        .seatClass(SeatClass.ECONOMY)
                        .status(SeatStatus.AVAILABLE)
                        .priceMultiplier(multiplier)
                        .build());
            }
        }

        seatRepository.saveAll(seats);
        log.info("Generated {} seats for flight {}", seats.size(), flight.getFlightNumber());
    }

    @Transactional
    public List<Flight> generateSchedulesForRoute(Airport dep, Airport arr, LocalDate date) {
        List<Flight> generated = new ArrayList<>();
        String depCode = dep.getCode();
        String arrCode = arr.getCode();

        String airline1 = "Vietnam Airlines";
        String airline2 = "Vietjet Air";
        String flightPrefix = "AS";
        BigDecimal basePrice = BigDecimal.valueOf(1850000);
        int baseDurationMinutes = 120;

        boolean isCambodiaRoute = "PNH".equalsIgnoreCase(depCode) || "PNH".equalsIgnoreCase(arrCode)
                || "SAI".equalsIgnoreCase(depCode) || "SAI".equalsIgnoreCase(arrCode);
        boolean isJapanRoute = "NRT".equalsIgnoreCase(depCode) || "NRT".equalsIgnoreCase(arrCode);
        boolean isKoreaRoute = "ICN".equalsIgnoreCase(depCode) || "ICN".equalsIgnoreCase(arrCode);
        boolean isSingaporeRoute = "SIN".equalsIgnoreCase(depCode) || "SIN".equalsIgnoreCase(arrCode);
        boolean isThaiRoute = "BKK".equalsIgnoreCase(depCode) || "BKK".equalsIgnoreCase(arrCode);
        boolean isFranceRoute = "CDG".equalsIgnoreCase(depCode) || "CDG".equalsIgnoreCase(arrCode);
        boolean isUkRoute = "LHR".equalsIgnoreCase(depCode) || "LHR".equalsIgnoreCase(arrCode);

        if (isCambodiaRoute) {
            airline1 = "Cambodia Angkor Air";
            flightPrefix = "K6";
            if (isJapanRoute) {
                airline2 = "Japan Airlines";
                basePrice = BigDecimal.valueOf(7450000);
                baseDurationMinutes = 330;
            } else if (isKoreaRoute) {
                airline2 = "Korean Air";
                basePrice = BigDecimal.valueOf(5600000);
                baseDurationMinutes = 310;
            } else if (isSingaporeRoute) {
                airline2 = "Singapore Airlines";
                basePrice = BigDecimal.valueOf(2350000);
                baseDurationMinutes = 115;
            } else if (isThaiRoute) {
                airline2 = "Bangkok Airways";
                basePrice = BigDecimal.valueOf(2100000);
                baseDurationMinutes = 75;
            } else if (isFranceRoute) {
                airline2 = "Air France";
                basePrice = BigDecimal.valueOf(14200000);
                baseDurationMinutes = 780;
            } else if (isUkRoute) {
                airline2 = "British Airways";
                basePrice = BigDecimal.valueOf(15600000);
                baseDurationMinutes = 810;
            } else {
                airline2 = "Vietnam Airlines";
                basePrice = BigDecimal.valueOf(1950000);
                baseDurationMinutes = 75;
            }
        } else if (isJapanRoute) {
            airline1 = "Japan Airlines";
            airline2 = "Vietnam Airlines";
            flightPrefix = "JL";
            basePrice = BigDecimal.valueOf(7850000);
            baseDurationMinutes = 320;
        } else if (isKoreaRoute) {
            airline1 = "Korean Air";
            airline2 = "Vietjet Air";
            flightPrefix = "KE";
            basePrice = BigDecimal.valueOf(5200000);
            baseDurationMinutes = 290;
        } else if (isSingaporeRoute) {
            airline1 = "Singapore Airlines";
            airline2 = "Scoot";
            flightPrefix = "SQ";
            basePrice = BigDecimal.valueOf(2890000);
            baseDurationMinutes = 180;
        } else if (isThaiRoute) {
            airline1 = "Thai Airways";
            airline2 = "Vietjet Air";
            flightPrefix = "TG";
            basePrice = BigDecimal.valueOf(2450000);
            baseDurationMinutes = 110;
        } else if (isFranceRoute) {
            airline1 = "Air France";
            airline2 = "Vietnam Airlines";
            flightPrefix = "AF";
            basePrice = BigDecimal.valueOf(14500000);
            baseDurationMinutes = 750;
        } else if (isUkRoute) {
            airline1 = "British Airways";
            airline2 = "Vietnam Airlines";
            flightPrefix = "BA";
            basePrice = BigDecimal.valueOf(15800000);
            baseDurationMinutes = 780;
        } else {
            airline1 = "Vietnam Airlines";
            airline2 = "Bamboo Airways";
            flightPrefix = "VN";
            basePrice = BigDecimal.valueOf(1250000);
            baseDurationMinutes = 90;
        }

        String dateSuffix = String.format("%02d%02d", date.getMonthValue(), date.getDayOfMonth());
        String codePart = depCode.substring(0, Math.min(2, depCode.length())) + arrCode.substring(0, Math.min(2, arrCode.length()));

        // Morning Flight (08:30)
        String fn1 = flightPrefix + "-" + codePart + "1-" + dateSuffix;
        if (flightRepository.findByFlightNumber(fn1).isEmpty()) {
            LocalDateTime depTime1 = LocalDateTime.of(date, LocalTime.of(8, 30));
            LocalDateTime arrTime1 = depTime1.plusMinutes(baseDurationMinutes);
            Flight f1 = Flight.builder()
                    .flightNumber(fn1)
                    .airline(airline1)
                    .departureAirport(dep)
                    .arrivalAirport(arr)
                    .departureTime(depTime1)
                    .arrivalTime(arrTime1)
                    .basePrice(basePrice)
                    .status(FlightStatus.SCHEDULED)
                    .stops(0)
                    .seats(new ArrayList<>())
                    .build();
            Flight saved1 = flightRepository.save(f1);
            generateSeatMatrix(saved1);
            generated.add(saved1);
        }

        // Afternoon Flight (14:15)
        String fn2 = flightPrefix + "-" + codePart + "2-" + dateSuffix;
        if (flightRepository.findByFlightNumber(fn2).isEmpty()) {
            LocalDateTime depTime2 = LocalDateTime.of(date, LocalTime.of(14, 15));
            LocalDateTime arrTime2 = depTime2.plusMinutes(baseDurationMinutes);
            BigDecimal price2 = basePrice.multiply(BigDecimal.valueOf(1.08)).setScale(0, RoundingMode.HALF_UP);
            Flight f2 = Flight.builder()
                    .flightNumber(fn2)
                    .airline(airline2)
                    .departureAirport(dep)
                    .arrivalAirport(arr)
                    .departureTime(depTime2)
                    .arrivalTime(arrTime2)
                    .basePrice(price2)
                    .status(FlightStatus.SCHEDULED)
                    .stops(0)
                    .seats(new ArrayList<>())
                    .build();
            Flight saved2 = flightRepository.save(f2);
            generateSeatMatrix(saved2);
            generated.add(saved2);
        }

        // Evening Flight (19:40)
        String fn3 = flightPrefix + "-" + codePart + "3-" + dateSuffix;
        if (flightRepository.findByFlightNumber(fn3).isEmpty()) {
            LocalDateTime depTime3 = LocalDateTime.of(date, LocalTime.of(19, 40));
            LocalDateTime arrTime3 = depTime3.plusMinutes(baseDurationMinutes);
            BigDecimal price3 = basePrice.multiply(BigDecimal.valueOf(0.92)).setScale(0, RoundingMode.HALF_UP);
            Flight f3 = Flight.builder()
                    .flightNumber(fn3)
                    .airline(airline1)
                    .departureAirport(dep)
                    .arrivalAirport(arr)
                    .departureTime(depTime3)
                    .arrivalTime(arrTime3)
                    .basePrice(price3)
                    .status(FlightStatus.SCHEDULED)
                    .stops(0)
                    .seats(new ArrayList<>())
                    .build();
            Flight saved3 = flightRepository.save(f3);
            generateSeatMatrix(saved3);
            generated.add(saved3);
        }

        return generated;
    }

    public FlightDto toFlightDto(Flight flight) {
        long duration = 0;
        if (flight.getDepartureTime() != null && flight.getArrivalTime() != null) {
            duration = ChronoUnit.MINUTES.between(flight.getDepartureTime(), flight.getArrivalTime());
        }

        long availableSeats = seatRepository.countByFlightIdAndStatus(flight.getId(), SeatStatus.AVAILABLE);

        return FlightDto.builder()
                .id(flight.getId())
                .flightNumber(flight.getFlightNumber())
                .airline(flight.getAirline())
                .status(flight.getStatus() != null ? flight.getStatus().name() : "SCHEDULED")
                .departureTime(flight.getDepartureTime())
                .arrivalTime(flight.getArrivalTime())
                .durationMinutes(duration)
                .basePrice(flight.getBasePrice())
                .availableSeats(availableSeats)
                .stops(flight.getStops())
                .departureAirport(toAirportDto(flight.getDepartureAirport()))
                .arrivalAirport(toAirportDto(flight.getArrivalAirport()))
                .build();
    }

    public AirportDto toAirportDto(Airport airport) {
        if (airport == null) return null;
        return AirportDto.builder()
                .code(airport.getCode())
                .name(airport.getName())
                .city(airport.getCity())
                .country(airport.getCountry())
                .build();
    }
}
