# AeroSmart

**Smart Booking, Seamless Journey**

Intelligent Flight Booking & Operations Platform with **AeroMate** — your 24/7 intelligent flight concierge.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router DOM, Lucide Icons, Axios |
| Backend | Java 17, Spring Boot 3, Spring Security + JWT (jjwt), Spring Data JPA, Spring Data Redis, Redisson, Maven |
| Data | PostgreSQL 16, Redis 7 |

## Repository layout

```
AeroSmart/
├── docker-compose.yml     # PostgreSQL 16 + Redis 7
├── backend/               # Spring Boot 3 API
└── frontend/              # React 18 + Vite SPA
```

## Quick start

### 1. Infrastructure

```bash
docker compose up -d
```

Brings up `aerosmart-postgres` (`localhost:5432`, db `aerosmart_db`, `postgres`/`postgres`) and
`aerosmart-redis` (`localhost:6379`). Redis backs distributed seat locks and flight-search caching.

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run       # or: mvn spring-boot:run
```

API listens on `http://localhost:8080`. Schema is created by JPA on boot and `DataInitializer`
seeds airports, flight routes, seat matrices and the two demo accounts.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`. Vite proxies `/api` to the backend, so no CORS setup is needed
in development.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@aerosmart.com` | `admin123` |
| Passenger | `passenger@aerosmart.com` | `user123` |

## Core flows

**Booking with distributed seat hold.** Selecting a seat calls `POST /api/bookings/hold-seat`,
which acquires a Redis key `seat:lock:{flightId}:{seatNumber}` with a 15-minute TTL via Redisson.
The seat moves to `HELD`, the checkout screen counts down against the same window, and
`POST /api/bookings/confirm` promotes the booking to `CONFIRMED`. Expired holds release the seat
back to `AVAILABLE`, so two passengers can never book the same seat.

**Design patterns.** Booking status transitions are governed by a State pattern
(`Pending → SeatHeld → Confirmed | Cancelled`) that rejects illegal skips. Payments are pluggable
Strategy implementations (VNPay, MoMo simulations). Flight search criteria and e-ticket payloads are
assembled with Builders. Confirmation publishes a `BookingConfirmedEvent` consumed by observers that
dispatch the mock email and issue the ticket.

**AeroMate.** `POST /api/ai/chat` answers travel questions and exposes LLM function-calling tools
(`searchFlights`, `checkFlightStatus`). It runs against a deterministic mock by default; set an LLM
API key in `backend/src/main/resources/application.yml` to switch to a live provider.

## API surface

| Access | Endpoints |
|---|---|
| Public | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/flights/search`, `GET /api/flights/{id}/seats` |
| Passenger | `GET /api/auth/me`, `POST /api/bookings/hold-seat`, `POST /api/bookings/confirm`, `GET /api/bookings/my-bookings`, `POST /api/ai/chat` |
| Admin | `GET /api/admin/dashboard/stats`, `/api/admin/flights` (CRUD), `GET /api/admin/bookings` |

Admin routes require `ROLE_ADMIN` and are enforced with `@PreAuthorize("hasRole('ADMIN')")`.
All non-public routes expect `Authorization: Bearer <jwt>`.

## Notes

Credentials in this repository are development defaults and are safe only for local use. Replace the
JWT secret, database password and any LLM API key before deploying anywhere shared.
