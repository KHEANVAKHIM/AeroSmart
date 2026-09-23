package com.aerosmart.repository;

import com.aerosmart.domain.AirportTaxi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AirportTaxiRepository extends JpaRepository<AirportTaxi, Long> {
    List<AirportTaxi> findByIsAvailableTrue();
}
