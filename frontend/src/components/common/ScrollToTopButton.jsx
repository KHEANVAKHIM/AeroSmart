import { useState, useEffect } from 'react'
import { ArrowUp, ChevronUp } from 'lucide-react'

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight

      // Calculate progress 0 - 100
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScrollY / totalHeight) * 100))
        setScrollProgress(progress)
      }

      // Show button when scrolled down > 200px
      if (currentScrollY > 200) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // Circle dimensions
  const size = 46
  const strokeWidth = 3
  const center = size / 2
  const radius = center - strokeWidth
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference

  return (
    <div
      className={`fixed bottom-24 right-7 z-40 transition-all duration-300 ${isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
        }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        title="Quay lại đầu trang (Back to top)"
        aria-label="Scroll to top"
        className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-navy-900 shadow-xl ring-1 ring-slate-200/80 hover:bg-slate-50 hover:shadow-cyan-500/20 hover:scale-110 active:scale-95 transition-all dark:bg-navy-900 dark:text-white dark:ring-navy-700 dark:hover:bg-navy-850"
      >
        {/* Circular Scroll Progress Ring */}
        <svg
          className="absolute inset-0 -rotate-90 pointer-events-none"
          width={size}
          height={size}
        >
          {/* Background track circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-100 dark:text-navy-800"
          />
          {/* Dynamic animated progress circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#006ce4"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-150 dark:stroke-cyan-400"
          />
        </svg>

        {/* Arrow Icon */}
        <ChevronUp className="h-5 w-5 text-[#006ce4] dark:text-cyan-400 transition-transform group-hover:-translate-y-0.5" />

        {/* Hover Tooltip */}

      </button>
    </div>
  )
}
