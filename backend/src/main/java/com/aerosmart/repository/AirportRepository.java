package com.aerosmart.repository;

import com.aerosmart.domain.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AirportRepository extends JpaRepository<Airport, Long> {

    Optional<Airport> findByCode(String code);

    boolean existsByCode(String code);

    List<Airport> findAllByOrderByCodeAsc();
}
