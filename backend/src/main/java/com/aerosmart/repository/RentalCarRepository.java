package com.aerosmart.repository;

import com.aerosmart.domain.RentalCar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RentalCarRepository extends JpaRepository<RentalCar, Long> {
    List<RentalCar> findByIsAvailableTrue();
    List<RentalCar> findByCategoryAndIsAvailableTrue(String category);
}
