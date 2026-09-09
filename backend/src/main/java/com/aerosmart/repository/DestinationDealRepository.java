package com.aerosmart.repository;

import com.aerosmart.domain.DestinationDeal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationDealRepository extends JpaRepository<DestinationDeal, Long> {

    List<DestinationDeal> findByActiveTrueOrderByDisplayOrderAscCreatedAtDesc();

    List<DestinationDeal> findByActiveTrueAndCategoryOrderByDisplayOrderAscCreatedAtDesc(String category);

    List<DestinationDeal> findAllByOrderByDisplayOrderAscCreatedAtDesc();
}
