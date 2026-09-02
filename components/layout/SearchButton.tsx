'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { SearchItem } from '@/lib/search'

const TYPE_COLORS: Record<string, string> = {
  Page: 'bg-primary-blue',
  News: 'bg-primary-red',
  Event: 'bg-primary-red',
  'Party Organ': 'bg-primary-blue',
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

export default function SearchButton({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((v) => !v)
      } else if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        .then((res) => res.json())
        .then((data) => setResults(data.results ?? []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(timeout)
  }, [query])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Search the site"
        className={className ?? 'p-2 text-gray-700 hover:text-primary-red transition flex-shrink-0'}
      >
        <SearchIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
            aria-hidden
          />
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search news, events, party organs, leadership…"
                className="flex-1 outline-none text-base text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close search"
                className="text-gray-400 hover:text-gray-700 transition flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {loading && (
                <div className="px-5 py-8 text-center text-sm text-gray-400">Searching…</div>
              )}

              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-gray-400">
                  No results for &ldquo;{query}&rdquo;.
                </div>
              )}

              {!loading && query.trim().length < 2 && (
                <div className="px-5 py-8 text-center text-sm text-gray-400">
                  Type at least 2 characters to search.
                </div>
              )}

              {!loading && results.length > 0 && (
                <ul className="py-2">
                  {results.map((r, i) => (
                    <li key={`${r.url}-${i}`}>
                      <Link
                        href={r.url}
                        onClick={() => setIsOpen(false)}
                        className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50 transition"
                      >
                        <span
                          className={`mt-1.5 flex-shrink-0 inline-block text-[10px] font-extrabold text-white ${TYPE_COLORS[r.type] ?? 'bg-gray-400'} px-2 py-0.5 rounded-full uppercase tracking-wide`}
                        >
                          {r.type}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-bold text-[14.5px] text-gray-900 truncate">{r.title}</span>
                          <span className="block text-[13px] text-gray-500 line-clamp-1">{r.description}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
