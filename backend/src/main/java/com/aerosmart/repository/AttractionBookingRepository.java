package com.aerosmart.repository;

import com.aerosmart.domain.AttractionBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AttractionBookingRepository extends JpaRepository<AttractionBooking, Long> {
    Optional<AttractionBooking> findByReferenceCode(String referenceCode);
}
