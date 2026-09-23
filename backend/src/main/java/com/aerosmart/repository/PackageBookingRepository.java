package com.aerosmart.repository;

import com.aerosmart.domain.PackageBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PackageBookingRepository extends JpaRepository<PackageBooking, Long> {
    Optional<PackageBooking> findByReferenceCode(String referenceCode);
}
