import { createContext, useContext, useState } from 'react'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [searchCriteria, setSearchCriteria] = useState({
    origin: 'HAN',
    destination: 'SGN',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'ONE_WAY',
  })

  const [selectedFlight, setSelectedFlight] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([]) // Array of SeatDto
  const [passengers, setPassengers] = useState([
    { fullName: '', passportNumber: '', seatNumber: '' },
  ])
  const [heldBooking, setHeldBooking] = useState(null) // HoldSeatResponse

  const updateSearchCriteria = (updates) => {
    setSearchCriteria((prev) => ({ ...prev, ...updates }))
  }

  const selectSeat = (seat) => {
    setSelectedSeats([seat])
    setPassengers((prev) => {
      const copy = [...prev]
      if (copy.length === 0) {
        copy.push({ fullName: '', passportNumber: '', seatNumber: seat.seatNumber })
      } else {
        copy[0] = { ...copy[0], seatNumber: seat.seatNumber }
      }
      return copy
    })
  }

  const clearBooking = () => {
    setSelectedFlight(null)
    setSelectedSeats([])
    setPassengers([{ fullName: '', passportNumber: '', seatNumber: '' }])
    setHeldBooking(null)
  }

  return (
    <BookingContext.Provider
      value={{
        searchCriteria,
        updateSearchCriteria,
        selectedFlight,
        setSelectedFlight,
        selectedSeats,
        selectSeat,
        passengers,
        setPassengers,
        heldBooking,
        setHeldBooking,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}
