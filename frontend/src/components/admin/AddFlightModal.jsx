import { useState, useEffect } from 'react'
import { X, Plane, Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react'
import { adminApi, flightApi, extractErrorMessage } from '../../api/client'

export default function AddFlightModal({ isOpen, onClose, onFlightCreated }) {
  const [flightNumber, setFlightNumber] = useState('')
  const [airline, setAirline] = useState('Vietnam Airlines')
  const [departureAirportCode, setDepartureAirportCode] = useState('HAN')
  const [arrivalAirportCode, setArrivalAirportCode] = useState('SGN')
  const [departureTime, setDepartureTime] = useState('')
  const [arrivalTime, setArrivalTime] = useState('')
  const [basePrice, setBasePrice] = useState(1200000)
  const [stops, setStops] = useState(0)
  const [generateSeats, setGenerateSeats] = useState(true)

  const [airports, setAirports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      flightApi.listAirports().then(setAirports).catch(() => {})
      // Default to tomorrow 08:00
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const datePart = tomorrow.toISOString().split('T')[0]
      setDepartureTime(`${datePart}T08:00`)
      setArrivalTime(`${datePart}T10:15`)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await adminApi.createFlight({
        flightNumber: flightNumber.trim().toUpperCase(),
        airline: airline.trim(),
        departureAirportCode,
        arrivalAirportCode,
        departureTime,
        arrivalTime,
        basePrice: Number(basePrice),
        stops: Number(stops),
        generateSeats,
      })
      onFlightCreated()
      onClose()
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to create flight.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
              <Plane className="h-5 w-5 -rotate-45" />
            </span>
            <h3 className="text-base font-bold text-navy-950">Schedule New Flight</h3>
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
                onChange={(e) => setStops(e.target.value)}
                className="input"
              >
                <option value={0}>0 (Non-stop)</option>
                <option value={1}>1 stop</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 p-3 cursor-pointer">
            <input
              type="checkbox"
              checked={generateSeats}
              onChange={(e) => setGenerateSeats(e.target.checked)}
              className="rounded text-cyan-600 focus:ring-cyan-500"
            />
            <span className="text-slate-700 font-medium">
              Auto-generate standard seat matrix (Rows 1-3 Business 2-2, Rows 4-20 Economy 3-3)
            </span>
          </label>

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
              {loading ? 'Creating Flight...' : 'Save & Deploy Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
