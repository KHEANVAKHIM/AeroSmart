package com.aerosmart.service;

import com.aerosmart.domain.Flight;
import com.aerosmart.dto.AiChatRequest;
import com.aerosmart.dto.AiChatResponse;
import com.aerosmart.dto.FlightDto;
import com.aerosmart.dto.FlightSearchCriteria;
import com.aerosmart.dto.ToolCallDto;
import com.aerosmart.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * AeroMate AI Concierge Service.
 * Implements deterministic intent parsing and simulated LLM function calling
 * (searchFlights, checkFlightStatus, baggagePolicy, bookingAssistance).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiConciergeService {

    private final FlightService flightService;
    private final FlightRepository flightRepository;

    // Airport matching mappings
    private static final Map<String, String> CITY_TO_CODE = new HashMap<>();
    static {
        CITY_TO_CODE.put("hanoi", "HAN");
        CITY_TO_CODE.put("ha noi", "HAN");
        CITY_TO_CODE.put("han", "HAN");
        CITY_TO_CODE.put("saigon", "SGN");
        CITY_TO_CODE.put("sai gon", "SGN");
        CITY_TO_CODE.put("ho chi minh", "SGN");
        CITY_TO_CODE.put("hcm", "SGN");
        CITY_TO_CODE.put("sgn", "SGN");
        CITY_TO_CODE.put("danang", "DAD");
        CITY_TO_CODE.put("da nang", "DAD");
        CITY_TO_CODE.put("dad", "DAD");
        CITY_TO_CODE.put("phu quoc", "PQC");
        CITY_TO_CODE.put("phuquoc", "PQC");
        CITY_TO_CODE.put("pqc", "PQC");
        CITY_TO_CODE.put("nha trang", "CXR");
        CITY_TO_CODE.put("cam ranh", "CXR");
        CITY_TO_CODE.put("cxr", "CXR");
        CITY_TO_CODE.put("singapore", "SIN");
        CITY_TO_CODE.put("sin", "SIN");
        CITY_TO_CODE.put("bangkok", "BKK");
        CITY_TO_CODE.put("bkk", "BKK");
    }

    public AiChatResponse chat(AiChatRequest request) {
        String msg = request.getMessage() != null ? request.getMessage().trim().toLowerCase(Locale.ROOT) : "";
        String convId = request.getConversationId() != null ? request.getConversationId() : UUID.randomUUID().toString();

        List<ToolCallDto> toolCalls = new ArrayList<>();
        List<FlightDto> flights = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();
        StringBuilder reply = new StringBuilder();

        // 1. Flight Status Check pattern (e.g., AS-101, AS102, status of AS-201)
        Pattern flightNoPattern = Pattern.compile("\\b(as-?\\d{3,4})\\b", Pattern.CASE_INSENSITIVE);
        Matcher flightMatcher = flightNoPattern.matcher(msg);

        if (flightMatcher.find() || msg.contains("status") || msg.contains("check flight")) {
            String flightNo = flightMatcher.find(0) ? flightMatcher.group(1).toUpperCase().replace(" ", "") : "AS-101";
            if (!flightNo.contains("-")) {
                flightNo = flightNo.substring(0, 2) + "-" + flightNo.substring(2);
            }

            Map<String, String> args = new HashMap<>();
            args.put("flightNumber", flightNo);
            toolCalls.add(ToolCallDto.builder().tool("checkFlightStatus").arguments(args).build());

            Optional<Flight> opt = flightRepository.findByFlightNumber(flightNo);
            if (opt.isPresent()) {
                Flight f = opt.get();
                FlightDto dto = flightService.toFlightDto(f);
                flights.add(dto);

                reply.append("✈️ **Flight ").append(flightNo).append("** is currently **").append(f.getStatus()).append("**.\n\n")
                        .append("• **Route:** ").append(f.getDepartureAirport().getCode()).append(" (")
                        .append(f.getDepartureAirport().getCity()).append(") → ")
                        .append(f.getArrivalAirport().getCode()).append(" (")
                        .append(f.getArrivalAirport().getCity()).append(")\n")
                        .append("• **Departure:** ").append(f.getDepartureTime().format(DateTimeFormatter.ofPattern("dd MMM, HH:mm"))).append("\n")
                        .append("• **Arrival:** ").append(f.getArrivalTime().format(DateTimeFormatter.ofPattern("dd MMM, HH:mm"))).append("\n")
                        .append("• **Available Seats:** ").append(dto.getAvailableSeats()).append(" seats remaining.");

                suggestions.add("View seat map for " + flightNo);
                suggestions.add("Baggage allowance for " + f.getAirline());
                suggestions.add("Find flights tomorrow");
            } else {
                reply.append("I looked up **").append(flightNo).append("**, but could not locate an active flight with that number. Please ensure the format is like `AS-101` or check available departures.");
                suggestions.add("Find flights from Hanoi to Saigon");
                suggestions.add("Show popular routes");
            }
        }
        // 2. Flight Search pattern (e.g. "from ... to ...", "hanoi to danang", "flight to phu quoc")
        else if (msg.contains("flight") || msg.contains("find") || msg.contains("fly") || msg.contains("ticket") || msg.contains("book") || msg.contains("to")) {
            String originCode = detectAirport(msg, "from", "HAN");
            String destCode = detectAirport(msg, "to", "SGN");

            if (originCode.equalsIgnoreCase(destCode)) {
                destCode = originCode.equalsIgnoreCase("HAN") ? "SGN" : "HAN";
            }

            Map<String, String> args = new HashMap<>();
            args.put("origin", originCode);
            args.put("destination", destCode);
            args.put("departureDate", LocalDate.now().toString());
            toolCalls.add(ToolCallDto.builder().tool("searchFlights").arguments(args).build());

            FlightSearchCriteria criteria = FlightSearchCriteria.builder()
                    .origin(originCode)
                    .destination(destCode)
                    .departureDate(LocalDate.now())
                    .build();

            flights = flightService.searchFlights(criteria);
            if (flights.size() > 4) {
                flights = flights.subList(0, 4);
            }

            if (!flights.isEmpty()) {
                reply.append("I found **").append(flights.size()).append(" flight options** from **")
                        .append(originCode).append("** to **").append(destCode).append("**:\n\n")
                        .append("You can select your preferred seat directly on the interactive cabin map.");

                suggestions.add("Cheapest flight first");
                suggestions.add("Show Business Class seats");
                suggestions.add("Return trip options");
            } else {
                reply.append("I searched for direct flights between **").append(originCode)
                        .append("** and **").append(destCode).append("**, but no open schedules were found for today. Let me recommend flights on our most popular routes:");

                // Fallback popular flights
                flights = flightService.searchFlights(FlightSearchCriteria.builder().build());
                if (flights.size() > 3) flights = flights.subList(0, 3);

                suggestions.add("Hanoi to Da Nang");
                suggestions.add("Saigon to Phu Quoc");
            }
        }
        // 3. Baggage Policy pattern
        else if (msg.contains("baggage") || msg.contains("luggage") || msg.contains("carry on") || msg.contains("weight")) {
            Map<String, String> args = new HashMap<>();
            args.put("airline", "AeroSmart Standard");
            toolCalls.add(ToolCallDto.builder().tool("getBaggagePolicy").arguments(args).build());

            reply.append("🧳 **AeroSmart Baggage Policy Overview:**\n\n")
                    .append("• **Cabin Baggage (Free):** 1 personal item + 1 carry-on suitcase (max 7kg, 56 × 36 × 23 cm).\n")
                    .append("• **Economy Class:** Standard checked baggage up to 20kg included.\n")
                    .append("• **Business Class:** Premium checked allowance up to 2 × 32kg + priority baggage delivery.\n")
                    .append("• **Special Equipment:** Sports gear & musical instruments require advance notice during checkout.");

            suggestions.add("Find flights from Hanoi to Saigon");
            suggestions.add("Book a Business Class seat");
            suggestions.add("Check flight AS-101");
        }
        // 4. Seat Hold & Booking assistance pattern
        else if (msg.contains("seat") || msg.contains("hold") || msg.contains("lock") || msg.contains("pay") || msg.contains("vnpay") || msg.contains("momo")) {
            reply.append("💺 **Seat Reservation & Hold System:**\n\n")
                    .append("• When you pick an available seat on our interactive cabin map, AeroSmart places a **15-minute distributed hold** via Redis.\n")
                    .append("• No other customer can take your selected seat while your hold timer runs.\n")
                    .append("• You can finalize payment seamlessly using **VNPay (QR/Bank)** or **MoMo Wallet**.\n\n")
                    .append("Would you like me to find a flight for you?");

            suggestions.add("Find flights from Hanoi to Da Nang");
            suggestions.add("Find flights from Saigon to Phu Quoc");
            suggestions.add("Check my booking status");
        }
        // 5. Default greeting & fallback
        else {
            reply.append("👋 Hello! I am **AeroMate**, your 24/7 intelligent flight concierge for **AeroSmart**.\n\n")
                    .append("I can assist you with:\n")
                    .append("• ✈️ **Real-time flight discovery** and best fares\n")
                    .append("• 🕒 **Live flight status** and schedule updates\n")
                    .append("• 💺 **Interactive seat selection** with 15-minute seat locking\n")
                    .append("• 🧳 **Baggage allowances** and travel guidelines\n\n")
                    .append("How may I help with your journey today?");

            suggestions.add("Find flights from Hanoi to Da Nang");
            suggestions.add("Check status of flight AS-101");
            suggestions.add("What is the baggage allowance?");
            suggestions.add("Show flights to Phu Quoc");
        }

        return AiChatResponse.builder()
                .reply(reply.toString())
                .conversationId(convId)
                .toolCalls(toolCalls)
                .flights(flights)
                .suggestions(suggestions)
                .build();
    }

    private String detectAirport(String msg, String keyword, String defaultCode) {
        int idx = msg.indexOf(keyword);
        String slice = idx >= 0 ? msg.substring(idx + keyword.length()) : msg;

        for (Map.Entry<String, String> entry : CITY_TO_CODE.entrySet()) {
            if (slice.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        for (Map.Entry<String, String> entry : CITY_TO_CODE.entrySet()) {
            if (msg.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        return defaultCode;
    }
}
