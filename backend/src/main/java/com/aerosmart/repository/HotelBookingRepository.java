package com.aerosmart.repository;

import com.aerosmart.domain.HotelBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface HotelBookingRepository extends JpaRepository<HotelBooking, Long> {
    Optional<HotelBooking> findByReferenceCode(String referenceCode);
}
