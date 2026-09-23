package com.aerosmart.repository;

import com.aerosmart.domain.CarBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CarBookingRepository extends JpaRepository<CarBooking, Long> {
    Optional<CarBooking> findByReferenceCode(String referenceCode);
}
