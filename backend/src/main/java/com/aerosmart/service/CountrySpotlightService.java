package com.aerosmart.service;

import com.aerosmart.domain.CountrySpotlight;
import com.aerosmart.dto.CountrySpotlightDto;
import com.aerosmart.exception.ResourceNotFoundException;
import com.aerosmart.repository.CountrySpotlightRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CountrySpotlightService {

    private final CountrySpotlightRepository repository;

    @Transactional(readOnly = true)
    public List<CountrySpotlightDto> getActiveCountries() {
        return repository.findByActiveTrueOrderByDisplayOrderAscCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CountrySpotlightDto> getAllCountries() {
        return repository.findAllByOrderByDisplayOrderAscCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CountrySpotlightDto getCountryById(Long id) {
        CountrySpotlight country = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CountrySpotlight", "id", id));
        return toDto(country);
    }

    @Transactional
    public CountrySpotlightDto createCountry(CountrySpotlightDto dto) {
        CountrySpotlight country = CountrySpotlight.builder()
                .countryCode(dto.getCountryCode().trim().toLowerCase())
                .nameEn(dto.getNameEn().trim())
                .nameVi(dto.getNameVi() != null && !dto.getNameVi().isBlank() ? dto.getNameVi().trim() : dto.getNameEn().trim())
                .nameKm(dto.getNameKm() != null && !dto.getNameKm().isBlank() ? dto.getNameKm().trim() : dto.getNameEn().trim())
                .targetDestination(dto.getTargetDestination().trim().toUpperCase())
                .imageUrl(dto.getImageUrl().trim())
                .active(dto.isActive())
                .displayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0)
                .build();

        country = repository.save(country);
        log.info("Created country spotlight: {} ({})", country.getNameEn(), country.getCountryCode());
        return toDto(country);
    }

    @Transactional
    public CountrySpotlightDto updateCountry(Long id, CountrySpotlightDto dto) {
        CountrySpotlight country = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CountrySpotlight", "id", id));

        country.setCountryCode(dto.getCountryCode().trim().toLowerCase());
        country.setNameEn(dto.getNameEn().trim());
        if (dto.getNameVi() != null && !dto.getNameVi().isBlank()) country.setNameVi(dto.getNameVi().trim());
        if (dto.getNameKm() != null && !dto.getNameKm().isBlank()) country.setNameKm(dto.getNameKm().trim());
        country.setTargetDestination(dto.getTargetDestination().trim().toUpperCase());
        country.setImageUrl(dto.getImageUrl().trim());
        country.setActive(dto.isActive());
        if (dto.getDisplayOrder() != null) country.setDisplayOrder(dto.getDisplayOrder());

        country = repository.save(country);
        log.info("Updated country spotlight id: {}", id);
        return toDto(country);
    }

    @Transactional
    public CountrySpotlightDto toggleActive(Long id) {
        CountrySpotlight country = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CountrySpotlight", "id", id));
        country.setActive(!country.isActive());
        country = repository.save(country);
        return toDto(country);
    }

    @Transactional
    public void deleteCountry(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("CountrySpotlight", "id", id);
        }
        repository.deleteById(id);
        log.info("Deleted country spotlight id: {}", id);
    }

    public CountrySpotlightDto toDto(CountrySpotlight country) {
        return CountrySpotlightDto.builder()
                .id(country.getId())
                .countryCode(country.getCountryCode())
                .nameEn(country.getNameEn())
                .nameVi(country.getNameVi())
                .nameKm(country.getNameKm())
                .targetDestination(country.getTargetDestination())
                .imageUrl(country.getImageUrl())
                .active(country.isActive())
                .displayOrder(country.getDisplayOrder())
                .build();
    }
}
