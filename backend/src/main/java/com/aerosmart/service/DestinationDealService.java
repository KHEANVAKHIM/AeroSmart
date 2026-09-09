package com.aerosmart.service;

import com.aerosmart.domain.DestinationDeal;
import com.aerosmart.dto.DestinationDealDto;
import com.aerosmart.exception.ResourceNotFoundException;
import com.aerosmart.repository.DestinationDealRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DestinationDealService {

    private final DestinationDealRepository repository;

    @Transactional(readOnly = true)
    public List<DestinationDealDto> getActiveDeals(String category) {
        List<DestinationDeal> list;
        if (category != null && !category.isBlank()) {
            list = repository.findByActiveTrueAndCategoryOrderByDisplayOrderAscCreatedAtDesc(category.toUpperCase());
        } else {
            list = repository.findByActiveTrueOrderByDisplayOrderAscCreatedAtDesc();
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DestinationDealDto> getAllDeals() {
        return repository.findAllByOrderByDisplayOrderAscCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DestinationDealDto getDealById(Long id) {
        DestinationDeal deal = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DestinationDeal", "id", id));
        return toDto(deal);
    }

    @Transactional
    public DestinationDealDto createDeal(DestinationDealDto dto) {
        DestinationDeal deal = DestinationDeal.builder()
                .origin(dto.getOrigin().trim().toUpperCase())
                .destination(dto.getDestination().trim().toUpperCase())
                .titleEn(dto.getTitleEn())
                .titleVi(dto.getTitleVi() != null && !dto.getTitleVi().isBlank() ? dto.getTitleVi() : dto.getTitleEn())
                .titleKm(dto.getTitleKm() != null && !dto.getTitleKm().isBlank() ? dto.getTitleKm() : dto.getTitleEn())
                .category(dto.getCategory().trim().toUpperCase())
                .imageUrl(dto.getImageUrl().trim())
                .price(dto.getPrice())
                .datesEn(dto.getDatesEn())
                .datesVi(dto.getDatesVi())
                .datesKm(dto.getDatesKm())
                .active(dto.isActive())
                .displayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0)
                .build();

        deal = repository.save(deal);
        log.info("Created new destination deal: {} -> {}", deal.getOrigin(), deal.getDestination());
        return toDto(deal);
    }

    @Transactional
    public DestinationDealDto updateDeal(Long id, DestinationDealDto dto) {
        DestinationDeal deal = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DestinationDeal", "id", id));

        deal.setOrigin(dto.getOrigin().trim().toUpperCase());
        deal.setDestination(dto.getDestination().trim().toUpperCase());
        deal.setTitleEn(dto.getTitleEn());
        if (dto.getTitleVi() != null && !dto.getTitleVi().isBlank()) deal.setTitleVi(dto.getTitleVi());
        if (dto.getTitleKm() != null && !dto.getTitleKm().isBlank()) deal.setTitleKm(dto.getTitleKm());
        deal.setCategory(dto.getCategory().trim().toUpperCase());
        deal.setImageUrl(dto.getImageUrl().trim());
        deal.setPrice(dto.getPrice());
        deal.setDatesEn(dto.getDatesEn());
        deal.setDatesVi(dto.getDatesVi());
        deal.setDatesKm(dto.getDatesKm());
        deal.setActive(dto.isActive());
        if (dto.getDisplayOrder() != null) deal.setDisplayOrder(dto.getDisplayOrder());

        deal = repository.save(deal);
        log.info("Updated destination deal id: {}", id);
        return toDto(deal);
    }

    @Transactional
    public DestinationDealDto toggleActive(Long id) {
        DestinationDeal deal = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DestinationDeal", "id", id));
        deal.setActive(!deal.isActive());
        deal = repository.save(deal);
        return toDto(deal);
    }

    @Transactional
    public void deleteDeal(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("DestinationDeal", "id", id);
        }
        repository.deleteById(id);
        log.info("Deleted destination deal id: {}", id);
    }

    public DestinationDealDto toDto(DestinationDeal deal) {
        return DestinationDealDto.builder()
                .id(deal.getId())
                .origin(deal.getOrigin())
                .destination(deal.getDestination())
                .titleEn(deal.getTitleEn())
                .titleVi(deal.getTitleVi())
                .titleKm(deal.getTitleKm())
                .category(deal.getCategory())
                .imageUrl(deal.getImageUrl())
                .price(deal.getPrice())
                .datesEn(deal.getDatesEn())
                .datesVi(deal.getDatesVi())
                .datesKm(deal.getDatesKm())
                .active(deal.isActive())
                .displayOrder(deal.getDisplayOrder())
                .build();
    }
}
