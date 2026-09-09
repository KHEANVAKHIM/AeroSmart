package com.aerosmart.controller;

import com.aerosmart.dto.DestinationDealDto;
import com.aerosmart.service.DestinationDealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
@RequiredArgsConstructor
public class DestinationDealController {

    private final DestinationDealService dealService;
    private final com.aerosmart.service.CountrySpotlightService countrySpotlightService;

    @GetMapping("/deals")
    public ResponseEntity<List<DestinationDealDto>> getActiveDeals(
            @RequestParam(required = false) String category) {
        List<DestinationDealDto> deals = dealService.getActiveDeals(category);
        return ResponseEntity.ok(deals);
    }

    @GetMapping("/countries")
    public ResponseEntity<List<com.aerosmart.dto.CountrySpotlightDto>> getActiveCountries() {
        List<com.aerosmart.dto.CountrySpotlightDto> countries = countrySpotlightService.getActiveCountries();
        return ResponseEntity.ok(countries);
    }
}
