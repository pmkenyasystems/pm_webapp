'use client'

import { useState } from 'react'
import Link from 'next/link'
import SocialShare from '@/components/sharing/SocialShare'
import YoutubeEmbed from '@/components/home/YoutubeEmbed'

type Article = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  imageUrl: string | null
  createdAt: Date
}

function extractYouTubeId(content: string): string | null {
  const match = content.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/)
  return match ? match[1] : null
}

const VISIBLE_DESKTOP = 3

export default function NewsCarousel({ articles }: { articles: Article[] }) {
  const [index, setIndex] = useState(0)

  const totalPages = Math.ceil(articles.length / VISIBLE_DESKTOP)
  const mobileTotal = articles.length

  function prevDesktop() { setIndex((i) => Math.max(0, i - 1)) }
  function nextDesktop() { setIndex((i) => Math.min(totalPages - 1, i + 1)) }

  const visibleArticles = articles.slice(index * VISIBLE_DESKTOP, index * VISIBLE_DESKTOP + VISIBLE_DESKTOP)

  return (
    <div>
      {/* Desktop carousel */}
      <div className="hidden md:block relative">
        {/* Prev arrow */}
        <button
          onClick={prevDesktop}
          disabled={index === 0}
          aria-label="Previous"
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:text-primary-blue hover:border-primary-blue transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-4">
          {visibleArticles.map((article) => {
            const youtubeId = extractYouTubeId(article.content || '')
            return <ArticleCard key={article.id} article={article} youtubeId={youtubeId} />
          })}
        </div>

        {/* Next arrow */}
        <button
          onClick={nextDesktop}
          disabled={index >= totalPages - 1}
          aria-label="Next"
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:text-primary-blue hover:border-primary-blue transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-6 h-2.5 bg-primary-blue'
                    : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile carousel — 1 card at a time */}
      <MobileCarousel articles={articles} />
    </div>
  )
}

function MobileCarousel({ articles }: { articles: Article[] }) {
  const [idx, setIdx] = useState(0)
  const article = articles[idx]
  const youtubeId = extractYouTubeId(article.content || '')

  return (
    <div className="md:hidden">
      <div className="relative">
        <ArticleCard article={article} youtubeId={youtubeId} />

        {/* Mobile arrows overlay */}
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          aria-label="Previous"
          className="absolute left-2 top-1/3 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-600 hover:text-primary-blue disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setIdx((i) => Math.min(articles.length - 1, i + 1))}
          disabled={idx === articles.length - 1}
          aria-label="Next"
          className="absolute right-2 top-1/3 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-600 hover:text-primary-blue disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {articles.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Go to article ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === idx
                ? 'w-6 h-2.5 bg-primary-blue'
                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function ArticleCard({ article, youtubeId }: { article: Article; youtubeId: string | null }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col">
      {youtubeId ? (
        <YoutubeEmbed videoId={youtubeId} title={article.title} thumbnail={article.imageUrl} />
      ) : (
        <Link href={`/articles/${article.slug}`}>
          <div className="relative h-48 bg-gray-200">
            {article.imageUrl && (
              <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
            )}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-red via-primary-blue to-white" />
          </div>
        </Link>
      )}
      <div className="p-6 flex flex-col flex-1">
        <Link href={`/articles/${article.slug}`}>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 hover:text-primary-blue transition">
            {article.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.excerpt || (article.content || '').replace(/<[^>]*>/g, '').substring(0, 120)}...
        </p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <Link
            href={`/articles/${article.slug}`}
            className="inline-flex items-center gap-1 text-primary-blue font-medium text-sm hover:underline"
          >
            Read more
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="px-6 pb-4">
        <SocialShare
          url={`/articles/${article.slug}`}
          title={article.title}
          description={article.excerpt || (article.content || '').substring(0, 100)}
        />
      </div>
    </div>
  )
}
