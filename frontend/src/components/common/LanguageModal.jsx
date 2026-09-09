import React from 'react'
import { createPortal } from 'react-dom'
import { X, Check } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import CountryFlag from './CountryFlag'

export default function LanguageModal({ isOpen, onClose }) {
  const { language, setLanguage, supportedLanguages } = useLanguage()

  if (!isOpen) return null

  const handleSelectLanguage = (code) => {
    setLanguage(code)
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 flex flex-col w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Select your language
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Main Languages List */}
        <div className="p-5 space-y-2.5">
          {supportedLanguages.map((l) => {
            const isSelected = l.code === language.code
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => handleSelectLanguage(l.code)}
                className={`flex w-full items-center justify-between p-3.5 rounded-xl text-left transition-all group ${
                  isSelected
                    ? 'bg-[#ebf3ff] text-[#003580] font-bold ring-2 ring-[#006ce4]'
                    : 'text-slate-800 hover:bg-slate-50 border border-slate-200/80 font-medium'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <CountryFlag countryCode={l.countryCode || l.code} size="lg" />
                  <div>
                    <p className="text-base font-bold text-slate-900 leading-tight">
                      {l.nativeName || l.label}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {l.country}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#006ce4] text-white">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>,
    document.body
  )
}
