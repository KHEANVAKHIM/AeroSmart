import { useEffect, useMemo, useState } from 'react'
import { parseDate } from '../utils/format'

/**
 * Ticks once per second towards `target` (Date | ISO string).
 * Returns `{minutes, seconds, totalSeconds, expired}`.
 * When `target` is falsy the countdown is inert (expired === false).
 */
export default function useCountdown(target) {
  const targetMs = useMemo(() => {
    const date = parseDate(target)
    return date ? date.getTime() : null
  }, [target])

  const compute = () => {
    if (!targetMs) return 0
    return Math.max(0, Math.ceil((targetMs - Date.now()) / 1000))
  }

  const [totalSeconds, setTotalSeconds] = useState(compute)

  useEffect(() => {
    if (!targetMs) {
      setTotalSeconds(0)
      return undefined
    }
    setTotalSeconds(Math.max(0, Math.ceil((targetMs - Date.now()) / 1000)))

    const id = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((targetMs - Date.now()) / 1000))
      setTotalSeconds(remaining)
      if (remaining === 0) window.clearInterval(id)
    }, 1000)

    return () => window.clearInterval(id)
  }, [targetMs])

  return {
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
    expired: Boolean(targetMs) && totalSeconds === 0,
  }
}
