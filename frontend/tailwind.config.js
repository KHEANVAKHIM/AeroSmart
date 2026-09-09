/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        booking: {
          navy: '#003580',
          blue: '#006ce4',
          hover: '#0057b8',
          light: '#ebf3ff',
          yellow: '#febb02',
          yellowHover: '#f0b000',
        },
        navy: {
          50: '#ebf3ff',
          100: '#d6e7ff',
          200: '#adcaff',
          300: '#70a3ff',
          400: '#3b7fff',
          500: '#006ce4',
          600: '#0057b8',
          700: '#00438f',
          800: '#003580',
          900: '#00224f',
          950: '#001738',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#febb02',
          600: '#f0b000',
          700: '#d97706',
          800: '#b45309',
          900: '#78350f',
          950: '#451a03',
        },
        seat: {
          available: '#94a3b8',
          held: '#f59e0b',
          booked: '#ef4444',
          selected: '#006ce4',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'Kantumruy Pro',
          'Battambang',
          'Noto Sans Khmer',
          'Siemreap',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Arial',
          'sans-serif',
        ],
        khmer: ['Kantumruy Pro', 'Battambang', 'Noto Sans Khmer', 'Siemreap', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 3px rgba(34, 211, 238, 0.35)',
        card: '0 10px 30px -18px rgba(11, 31, 58, 0.35)',
      },
      backgroundImage: {
        'sky-navy': 'linear-gradient(135deg, #06121f 0%, #0B1F3A 40%, #0f2b4d 70%, #0891b2 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out both',
        'slide-up': 'slide-up 0.4s ease-out both',
        'pulse-soft': 'pulse-soft 1.6s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
