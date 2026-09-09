package com.aerosmart.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * A single seat on a flight. A seat number is unique within its flight.
 */
@Entity
@Table(
        name = "seats",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_seat_flight_number",
                columnNames = {"flight_id", "seatNumber"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    /** Row + column, e.g. {@code 12C}. */
    @Column(nullable = false, length = 8)
    private String seatNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private SeatClass seatClass;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private SeatStatus status;

    /** Multiplier applied to {@link Flight#getBasePrice()} for this seat. */
    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal priceMultiplier;
}
