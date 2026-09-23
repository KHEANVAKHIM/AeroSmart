package com.aerosmart.controller;

import com.aerosmart.dto.BookingDto;
import com.aerosmart.dto.checkin.CheckInLookupRequest;
import com.aerosmart.dto.checkin.CheckInResponse;
import com.aerosmart.dto.checkin.CheckInSubmitRequest;
import com.aerosmart.service.CheckInService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/checkin")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService checkInService;

    @PostMapping("/lookup")
    public ResponseEntity<BookingDto> lookupBooking(@Valid @RequestBody CheckInLookupRequest request) {
        return ResponseEntity.ok(checkInService.lookupBooking(request));
    }

    @PostMapping("/complete")
    public ResponseEntity<CheckInResponse> completeCheckIn(@Valid @RequestBody CheckInSubmitRequest request) {
        return ResponseEntity.ok(checkInService.completeCheckIn(request));
    }
}
