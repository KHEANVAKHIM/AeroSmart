import { useState, useEffect } from 'react'
import { X, Plane, Calendar, DollarSign, AlertCircle, CheckCircle, Edit3 } from 'lucide-react'
import { adminApi, flightApi, extractErrorMessage } from '../../api/client'

export default function EditFlightModal({ flight, isOpen, onClose, onFlightUpdated }) {
  const [flightNumber, setFlightNumber] = useState('')
  const [airline, setAirline] = useState('Vietnam Airlines')
  const [departureAirportCode, setDepartureAirportCode] = useState('HAN')
  const [arrivalAirportCode, setArrivalAirportCode] = useState('SGN')
  const [departureTime, setDepartureTime] = useState('')
  const [arrivalTime, setArrivalTime] = useState('')
  const [basePrice, setBasePrice] = useState(1200000)
  const [stops, setStops] = useState(0)

  const [airports, setAirports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && flight) {
      flightApi.listAirports().then(setAirports).catch(() => {})
      setFlightNumber(flight.flightNumber || '')
      setAirline(flight.airline || 'Vietnam Airlines')
      setDepartureAirportCode(flight.departureAirport?.code || 'HAN')
      setArrivalAirportCode(flight.arrivalAirport?.code || 'SGN')
      
      // Convert to datetime-local format (YYYY-MM-DDTHH:mm)
      const dep = flight.departureTime ? flight.departureTime.slice(0, 16) : ''
      const arr = flight.arrivalTime ? flight.arrivalTime.slice(0, 16) : ''
      setDepartureTime(dep)
      setArrivalTime(arr)
      setBasePrice(flight.basePrice || 1200000)
      setStops(flight.stops ?? 0)
      setError(null)
    }
  }, [isOpen, flight])

  if (!isOpen || !flight) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await adminApi.updateFlight(flight.id, {
        flightNumber: flightNumber.trim().toUpperCase(),
        airline: airline.trim(),
        departureAirportCode,
        arrivalAirportCode,
        departureTime,
        arrivalTime,
        basePrice: Number(basePrice),
        stops: Number(stops),
        generateSeats: false,
      })
      onFlightUpdated()
      onClose()
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to update flight.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Edit3 className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-navy-950">
                Edit Flight {flight.flightNumber}
              </h3>
              <p className="text-xs text-slate-500">
                Modify departure schedule, route hubs, or base ticket fare
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Flight Number</label>
              <input
                type="text"
                required
                placeholder="e.g. AS-801"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                className="input uppercase font-mono font-bold"
              />
            </div>

            <div>
              <label className="label">Airline</label>
              <select
                value={airline}
                onChange={(e) => setAirline(e.target.value)}
                className="input font-semibold"
              >
                <option value="Vietnam Airlines">Vietnam Airlines</option>
                <option value="Vietjet Air">Vietjet Air</option>
                <option value="Bamboo Airways">Bamboo Airways</option>
                <option value="Vietravel Airlines">Vietravel Airlines</option>
                <option value="Singapore Airlines">Singapore Airlines</option>
                <option value="Thai Airways">Thai Airways</option>
                <option value="AirAsia">AirAsia</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Origin Airport</label>
              <select
                value={departureAirportCode}
                onChange={(e) => setDepartureAirportCode(e.target.value)}
                className="input font-bold"
              >
                {airports.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.code} — {a.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Destination Airport</label>
              <select
                value={arrivalAirportCode}
                onChange={(e) => setArrivalAirportCode(e.target.value)}
                className="input font-bold"
              >
                {airports.map((a) => (
                  <option key={a.code} value={a.code} disabled={a.code === departureAirportCode}>
                    {a.code} — {a.city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Departure Time</label>
              <input
                type="datetime-local"
                required
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">Arrival Time</label>
              <input
                type="datetime-local"
                required
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Economy Base Fare (VND)</label>
              <input
                type="number"
                required
                min={100000}
                step={50000}
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="input font-semibold"
              />
            </div>

            <div>
              <label className="label">Stops</label>
              <select
                value={stops}
                onChange={(e) => setStops(Number(e.target.value))}
                className="input"
              >
                <option value={0}>0 (Non-stop)</option>
                <option value={1}>1 stop</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost py-2.5 px-4 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-2.5 px-6 text-xs font-bold"
            >
              {loading ? 'Saving Changes...' : 'Update Flight Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
