'use client'

import { useState } from 'react'

export default function YoutubeEmbed({ videoId, title, thumbnail }: { videoId: string; title: string; thumbnail?: string | null }) {
  const [playing, setPlaying] = useState(false)
  const thumbSrc = thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  return (
    <div className="w-full aspect-video bg-black cursor-pointer" onClick={() => setPlaying(true)}>
      {playing ? (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <div className="relative w-full h-full group">
          <img
            src={thumbSrc}
            alt={title}
            className="w-full h-full object-cover"
          />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-black/70 flex items-center justify-center group-hover:bg-primary-red transition-colors duration-200">
              <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
