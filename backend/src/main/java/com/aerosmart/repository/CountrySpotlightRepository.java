package com.aerosmart.repository;

import com.aerosmart.domain.CountrySpotlight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CountrySpotlightRepository extends JpaRepository<CountrySpotlight, Long> {

    List<CountrySpotlight> findByActiveTrueOrderByDisplayOrderAscCreatedAtDesc();

    List<CountrySpotlight> findAllByOrderByDisplayOrderAscCreatedAtDesc();
}
