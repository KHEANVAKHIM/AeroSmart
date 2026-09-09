package com.aerosmart.controller;

import com.aerosmart.dto.BookingDto;
import com.aerosmart.dto.ConfirmBookingRequest;
import com.aerosmart.dto.HoldSeatRequest;
import com.aerosmart.dto.HoldSeatResponse;
import com.aerosmart.security.UserPrincipal;
import com.aerosmart.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/hold-seat")
    public ResponseEntity<HoldSeatResponse> holdSeat(
            @Valid @RequestBody HoldSeatRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        HoldSeatResponse response = bookingService.holdSeats(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/confirm")
    public ResponseEntity<BookingDto> confirm(
            @Valid @RequestBody ConfirmBookingRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        BookingDto booking = bookingService.confirmBooking(request, currentUser);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingDto>> getMyBookings(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<BookingDto> bookings = bookingService.getMyBookings(currentUser);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{reference}")
    public ResponseEntity<BookingDto> getByReference(@PathVariable String reference) {
        BookingDto booking = bookingService.getByReference(reference);
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<BookingDto> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        BookingDto booking = bookingService.cancelBooking(id, currentUser);
        return ResponseEntity.ok(booking);
    }
}
