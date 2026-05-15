'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const FOOTNOTE = 'pmkenya.ke'

export default function QRGeneratorPage() {
  const [text, setText] = useState('')
  const [generated, setGenerated] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const fullText = text.trim() ? `${text.trim()}\n${FOOTNOTE}` : ''

  const generateQR = useCallback(async () => {
    if (!fullText) return
    const QRCode = (await import('qrcode')).default
    const canvas = canvasRef.current
    if (!canvas) return
    await QRCode.toCanvas(canvas, fullText, {
      width: 320,
      margin: 3,
      color: { dark: '#001f5b', light: '#ffffff' },
    })
    setGenerated(true)
  }, [fullText])

  useEffect(() => {
    if (!text.trim()) {
      setGenerated(false)
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [text])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `pmkenya-qr-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#001f5b] py-12 px-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">QR Code Generator</h1>
        <p className="text-blue-200 text-sm max-w-md mx-auto">
          Generate a QR code for any link or text. All codes are automatically tagged with{' '}
          <span className="font-semibold text-white">pmkenya.ke</span>.
        </p>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-lg p-6 sm:p-8">
          {/* Input */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter text or URL
            </label>
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setGenerated(false) }}
              rows={4}
              placeholder="e.g. https://pmkenya.ke/join or any text…"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#001f5b] focus:border-transparent resize-none"
            />
            {text.trim() && (
              <p className="mt-1.5 text-[11px] text-gray-400 flex items-center gap-1">
                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                QR will encode your text + <span className="font-medium text-gray-600">{FOOTNOTE}</span>
              </p>
            )}
          </div>

          <button
            onClick={generateQR}
            disabled={!text.trim()}
            className="w-full bg-[#001f5b] hover:bg-[#002f7a] text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate QR Code
          </button>

          {/* Canvas preview */}
          <div className={`mt-8 flex flex-col items-center gap-5 transition-opacity duration-300 ${generated ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 inline-block">
              <canvas ref={canvasRef} className="block rounded-lg" />
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-400 mb-4">
                Scan with any QR reader — encoded with <span className="font-medium text-gray-600">{FOOTNOTE}</span>
              </p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
