package com.aerosmart.repository;

import com.aerosmart.domain.TaxiBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TaxiBookingRepository extends JpaRepository<TaxiBooking, Long> {
    Optional<TaxiBooking> findByReferenceCode(String referenceCode);
}
