package com.aerosmart.service.booking;

import com.aerosmart.exception.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * Distributed Concurrency Control for seat reservations.
 * Uses Redisson distributed locks with 15-minute TTL to strictly prevent double bookings.
 * Includes resilient fallback to an in-memory TTL lock registry if Redis is not connected.
 */
@Slf4j
@Service
public class DistributedSeatLockService {

    private final RedissonClient redissonClient;

    @Value("${aerosmart.seat-hold.duration-minutes:15}")
    private long holdDurationMinutes;

    private final Map<String, Instant> inMemoryLockRegistry = new ConcurrentHashMap<>();

    public DistributedSeatLockService(RedissonClient redissonClient) {
        this.redissonClient = redissonClient;
    }

    private String getLockKey(Long flightId, String seatNumber) {
        return "seat:lock:" + flightId + ":" + seatNumber.trim().toUpperCase();
    }

    /**
     * Attempts to acquire a 15-minute distributed lock for the specified seat.
     * Throws 409 Conflict if already locked.
     */
    public boolean acquireHold(Long flightId, String seatNumber) {
        String key = getLockKey(flightId, seatNumber);
        try {
            RLock lock = redissonClient.getLock(key);
            boolean acquired = lock.tryLock(0, holdDurationMinutes, TimeUnit.MINUTES);
            if (!acquired) {
                log.warn("Distributed seat lock failed for key: {} (already held in Redis)", key);
                throw new ApiException(HttpStatus.CONFLICT, "Seat " + seatNumber + " is currently locked by another customer. Please choose a different seat.");
            }
            log.info("Distributed Redisson lock acquired for key: {} with TTL {}m", key, holdDurationMinutes);
            return true;
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            log.warn("Redis distributed lock check encountered an issue ({}); checking in-memory fallback lock.", e.getMessage());
            return acquireInMemoryFallback(key, seatNumber);
        }
    }

    /**
     * Releases the seat lock upon confirmation or cancellation.
     */
    public void releaseHold(Long flightId, String seatNumber) {
        String key = getLockKey(flightId, seatNumber);
        inMemoryLockRegistry.remove(key);
        try {
            RLock lock = redissonClient.getLock(key);
            if (lock.isHeldByCurrentThread() || lock.isLocked()) {
                lock.forceUnlock();
                log.info("Released distributed seat lock: {}", key);
            }
        } catch (Exception e) {
            log.debug("Notice on releasing Redisson lock {}: {}", key, e.getMessage());
        }
    }

    private synchronized boolean acquireInMemoryFallback(String key, String seatNumber) {
        Instant now = Instant.now();
        Instant expiry = inMemoryLockRegistry.get(key);
        if (expiry != null && expiry.isAfter(now)) {
            throw new ApiException(HttpStatus.CONFLICT, "Seat " + seatNumber + " is currently locked by another customer. Please choose a different seat.");
        }
        inMemoryLockRegistry.put(key, now.plusSeconds(holdDurationMinutes * 60));
        log.info("Acquired in-memory fallback seat lock for key: {}", key);
        return true;
    }
}
