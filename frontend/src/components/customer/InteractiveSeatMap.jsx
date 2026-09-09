import { useMemo } from 'react'
import { Armchair, Sparkles, Shield, AlertCircle } from 'lucide-react'
import { formatVND } from '../../utils/format'
import { useCurrency } from '../../context/CurrencyContext'
import { useLanguage } from '../../context/LanguageContext'

export default function InteractiveSeatMap({
  seats = [],
  selectedSeat = null,
  onSelectSeat,
  disabled = false,
}) {
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()

  // Group seats by row number
  const { businessRows, economyRows } = useMemo(() => {
    const biz = {}
    const eco = {}

    seats.forEach((seat) => {
      const match = seat.seatNumber.match(/^(\d+)([A-Z])$/)
      if (!match) return
      const rowNum = parseInt(match[1], 10)
      const col = match[2]

      if (seat.seatClass === 'BUSINESS') {
        if (!biz[rowNum]) biz[rowNum] = {}
        biz[rowNum][col] = seat
      } else {
        if (!eco[rowNum]) eco[rowNum] = {}
        eco[rowNum][col] = seat
      }
    })

    return {
      businessRows: Object.entries(biz).sort(([a], [b]) => Number(a) - Number(b)),
      economyRows: Object.entries(eco).sort(([a], [b]) => Number(a) - Number(b)),
    }
  }, [seats])

  const getSeatColorClass = (seat) => {
    if (!seat) return 'invisible'
    const isSelected = selectedSeat?.id === seat.id

    if (isSelected) {
      return 'bg-cyan-500 text-navy-950 ring-4 ring-cyan-400/40 font-bold scale-110 shadow-lg'
    }
    if (seat.status === 'BOOKED') {
      return 'bg-rose-500/20 border-rose-400/40 text-rose-400 cursor-not-allowed opacity-60'
    }
    if (seat.status === 'HELD') {
      return 'bg-amber-500/25 border-amber-400/50 text-amber-400 cursor-not-allowed'
    }
    // Available
    return seat.seatClass === 'BUSINESS'
      ? 'bg-navy-800 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500 hover:text-navy-950 hover:scale-105'
      : 'bg-slate-700/80 border border-slate-600 text-slate-200 hover:bg-cyan-500 hover:text-navy-950 hover:scale-105'
  }

  const renderSeatButton = (seat) => {
    if (!seat) return <div className="h-10 w-10 sm:h-11 sm:w-11" />

    const isAvailable = seat.status === 'AVAILABLE'
    const isSelected = selectedSeat?.id === seat.id

    return (
      <button
        key={seat.seatNumber}
        type="button"
        disabled={disabled || (!isAvailable && !isSelected)}
        onClick={() => onSelectSeat?.(seat)}
        title={`Seat ${seat.seatNumber} (${seat.seatClass}) - ${seat.status === 'AVAILABLE' ? formatPrice(seat.price, 'VND') : seat.status}`}
        className={`relative flex h-10 w-10 sm:h-11 sm:w-11 flex-col items-center justify-center rounded-xl transition-all duration-150 text-[11px] font-semibold ${getSeatColorClass(
          seat
        )}`}
      >
        <span className="leading-none">{seat.seatNumber}</span>
      </button>
    )
  }

  return (
    <div className="w-full select-none">
      {/* Legend */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 rounded-2xl border border-navy-800 bg-navy-950/80 p-3.5 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-lg bg-slate-700 border border-slate-500" />
          <span>{t('seat.available')} ({t('seat.economy')})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-lg bg-navy-800 border border-cyan-500 text-cyan-300" />
          <span>{t('seat.available')} ({t('seat.business')})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-lg bg-cyan-500 ring-2 ring-cyan-400" />
          <span className="font-bold text-white">{t('seat.selected')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-lg bg-amber-500/40 border border-amber-500" />
          <span>{t('seat.held')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-lg bg-rose-500/40 border border-rose-500 opacity-60" />
          <span>{t('seat.booked')}</span>
        </div>
      </div>

      {/* Airplane Fuselage Container */}
      <div className="relative mx-auto max-w-lg rounded-[60px] border-2 border-navy-700 bg-navy-900/95 p-4 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Cockpit Nose Styling */}
        <div className="mx-auto mb-8 flex h-16 w-32 flex-col items-center justify-center rounded-t-full border-2 border-b-0 border-cyan-500/40 bg-gradient-to-b from-cyan-950/60 to-navy-900">
          <div className="h-3 w-12 rounded-full bg-cyan-400/40 blur-[1px]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 mt-1">
            {t('seat.cockpit')}
          </span>
        </div>

        {/* Business Cabin Header */}
        <div className="mb-4 flex items-center justify-between border-b border-navy-800 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              {t('seat.business')} (2 - 2 Layout)
            </span>
          </div>
          <span className="text-[10px] font-semibold text-cyan-300">Lie-flat · Priority</span>
        </div>

        {/* Business Cabin Rows (A C - Aisle - D F) */}
        <div className="space-y-3 mb-8">
          {businessRows.map(([rowNum, rowSeats]) => (
            <div key={rowNum} className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Left 2 seats: A, C */}
              <div className="flex gap-2 sm:gap-3">
                {renderSeatButton(rowSeats['A'])}
                {renderSeatButton(rowSeats['C'])}
              </div>

              {/* Aisle with Row Number */}
              <div className="flex h-10 w-8 items-center justify-center rounded-lg bg-navy-950/60 text-xs font-mono font-bold text-slate-500">
                {rowNum}
              </div>

              {/* Right 2 seats: D, F */}
              <div className="flex gap-2 sm:gap-3">
                {renderSeatButton(rowSeats['D'])}
                {renderSeatButton(rowSeats['F'])}
              </div>
            </div>
          ))}
        </div>

        {/* Galley & Bulkhead Partition */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="h-[1px] w-full bg-navy-800" />
          <span className="absolute bg-navy-900 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {t('seat.tail')}
          </span>
        </div>

        {/* Economy Cabin Header */}
        <div className="mb-4 flex items-center justify-between border-b border-navy-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            {t('seat.economy')} (3 - 3 Layout)
          </span>
          <span className="text-[10px] font-semibold text-slate-400">Standard Legroom</span>
        </div>

        {/* Economy Cabin Rows (A B C - Aisle - D E F) */}
        <div className="space-y-2.5">
          {economyRows.map(([rowNum, rowSeats]) => {
            const isExitRow = rowNum === '12'
            return (
              <div key={rowNum} className="relative">
                {isExitRow && (
                  <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-amber-400 px-2">
                    <span>◄ {t('seat.exitRow')}</span>
                    <span>Extra Legroom</span>
                    <span>{t('seat.exitRow')} ►</span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-1.5 sm:gap-3">
                  {/* Left 3 seats: A, B, C */}
                  <div className="flex gap-1 sm:gap-2">
                    {renderSeatButton(rowSeats['A'])}
                    {renderSeatButton(rowSeats['B'])}
                    {renderSeatButton(rowSeats['C'])}
                  </div>

                  {/* Aisle */}
                  <div className="flex h-10 w-7 items-center justify-center rounded bg-navy-950/60 text-xs font-mono font-bold text-slate-500">
                    {rowNum}
                  </div>

                  {/* Right 3 seats: D, E, F */}
                  <div className="flex gap-1 sm:gap-2">
                    {renderSeatButton(rowSeats['D'])}
                    {renderSeatButton(rowSeats['E'])}
                    {renderSeatButton(rowSeats['F'])}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
