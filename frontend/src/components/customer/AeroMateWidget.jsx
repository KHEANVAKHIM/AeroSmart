import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Plane,
  ChevronRight,
  Clock,
  Shield,
  Zap,
  Bot,
} from 'lucide-react'
import { aiApi } from '../../api/client'
import { formatVND, formatTime } from '../../utils/format'
import { useBooking } from '../../context/BookingContext'
import { useLanguage } from '../../context/LanguageContext'
import { useCurrency } from '../../context/CurrencyContext'

export default function AeroMateWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()
  const { formatPrice } = useCurrency()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()
  const { setSelectedFlight } = useBooking()

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: t('aeromate.greeting'),
        suggestions: [t('aeromate.q1'), t('aeromate.q2'), t('aeromate.q3')],
        toolCalls: [],
        flights: [],
      },
    ])
  }, [t])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim()
    if (!text || loading) return

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await aiApi.chat({ message: text })
      const aiReply = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: res.reply,
        suggestions: res.suggestions || [],
        toolCalls: res.toolCalls || [],
        flights: res.flights || [],
      }
      setMessages((prev) => [...prev, aiReply])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: "I'm having trouble connecting to AeroSmart flight intelligence right now. Please try again or explore our scheduled routes directly.",
          suggestions: [t('aeromate.q1'), t('aeromate.q2')],
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectFlightFromAi = (flight) => {
    setSelectedFlight(flight)
    setIsOpen(false)
    navigate(`/flights/${flight.id}/seats`)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="mb-4 flex h-[580px] w-[380px] sm:w-[420px] flex-col overflow-hidden rounded-3xl border border-navy-700 bg-navy-950 shadow-2xl ring-1 ring-cyan-500/20 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-navy-800 bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-accent-400 text-navy-950 shadow-lg shadow-cyan-500/30 font-bold">
                  <Bot className="h-5 w-5" />
                </span>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-navy-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white">{t('aeromate.title')}</h3>
                  <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-cyan-300">
                    {t('aeromate.badge')}
                  </span>
                </div>
                <p className="text-[11px] text-cyan-200/70">{t('brand.tagline')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-navy-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-thin">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                {/* Tool call indicator badge */}
                {m.toolCalls && m.toolCalls.length > 0 && (
                  <div className="mb-1.5 flex items-center gap-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 text-[11px] font-mono text-cyan-300">
                    <Zap className="h-3 w-3 text-cyan-400 animate-pulse" />
                    <span>Called: {m.toolCalls.map((t) => `${t.tool}()`).join(', ')}</span>
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-accent-600 text-navy-950 font-medium shadow-md shadow-cyan-500/15'
                      : 'bg-navy-900/90 border border-navy-800 text-slate-200 shadow-sm'
                  }`}
                >
                  {m.text}
                </div>

                {/* Embedded Flight Cards */}
                {m.flights && m.flights.length > 0 && (
                  <div className="mt-2.5 w-full space-y-2">
                    {m.flights.map((f) => (
                      <div
                        key={f.id}
                        className="group flex items-center justify-between rounded-xl border border-navy-800 bg-navy-900/90 p-3 hover:border-cyan-500/60 hover:bg-navy-850 transition-all"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{f.flightNumber}</span>
                            <span className="text-[10px] text-cyan-400 font-semibold">{f.airline}</span>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-300">
                            <span>{f.departureAirport?.code} {formatTime(f.departureTime)}</span>
                            <span>→</span>
                            <span>{f.arrivalAirport?.code} {formatTime(f.arrivalTime)}</span>
                          </div>
                          <div className="mt-1 text-[11px] font-semibold text-emerald-400">
                            {formatPrice(f.basePrice, 'VND')}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectFlightFromAi(f)}
                          className="shrink-0 rounded-lg bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500 hover:text-navy-950 transition-all flex items-center gap-1"
                        >
                          <span>{t('seat.selectSeat')}</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Prompt Suggestions */}
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {m.suggestions.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(chip)}
                        className="rounded-full border border-navy-700 bg-navy-900/60 px-3 py-1 text-[11px] font-medium text-cyan-300 hover:border-cyan-400 hover:bg-navy-800 transition-all"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 rounded-2xl bg-navy-900/80 border border-navy-800 px-4 py-3 text-xs text-cyan-300">
                <Sparkles className="h-4 w-4 animate-spin text-cyan-400" />
                <span>AeroMate is checking real-time flight telemetry...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="border-t border-navy-800 bg-navy-900/90 p-3"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('aeromate.placeholder')}
                className="w-full rounded-xl border border-navy-700 bg-navy-950 py-2.5 pl-3.5 pr-10 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 rounded-lg p-1.5 text-cyan-400 hover:bg-navy-800 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-[10px] text-center text-slate-500">
              Powered by AeroSmart Intelligent Travel Agent
            </p>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 rounded-full bg-gradient-to-r from-navy-900 via-navy-950 to-cyan-700 px-5 py-3.5 text-white shadow-2xl ring-2 ring-cyan-400/40 hover:scale-105 hover:ring-cyan-400 transition-all duration-200"
        >
          <div className="relative">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-accent-500 text-navy-950 font-bold shadow-md">
              <Sparkles className="h-4 w-4 animate-spin-slow" />
            </span>
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-navy-950 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold leading-tight text-white flex items-center gap-1.5">
              <span>AeroSmart Support</span>
              <span className="rounded bg-cyan-400/20 px-1 py-0.2 text-[9px] text-cyan-300">24/7</span>
            </p>
            <p className="text-[10px] text-cyan-200/70">{t('badge.concierge247')}</p>
          </div>
        </button>
      )}
    </div>
  )
}
