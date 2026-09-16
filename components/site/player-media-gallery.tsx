'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react'
import { toEmbedUrl, isVideoFile } from '@/lib/format'

type MediaItem = { id: string; type: string; url: string; caption: string | null }

function VideoEmbed({ url, caption }: { url: string; caption: string | null }) {
  const embed = toEmbedUrl(url)
  if (embed) {
    return (
      <div className="aspect-video overflow-hidden rounded-2xl">
        <iframe
          src={embed}
          title={caption ?? 'Vidéo joueur'}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }
  if (isVideoFile(url)) {
    return (
      <video controls preload="metadata" className="aspect-video w-full rounded-2xl bg-black object-cover">
        <source src={url} />
      </video>
    )
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="card-elevated card-elevated-hover flex aspect-video items-center justify-center gap-2 rounded-2xl text-sm font-bold text-muted-foreground"
    >
      <PlayCircle className="h-5 w-5" /> Voir la vidéo
    </a>
  )
}

export function PlayerMediaGallery({ media, color }: { media: MediaItem[]; color: string }) {
  const photos = media.filter((m) => m.type === 'PHOTO')
  const videos = media.filter((m) => m.type === 'VIDEO')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <div className="space-y-10">
      {photos.length > 0 && (
        <div>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[.22em] text-muted-foreground">Photos</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                className="group aspect-square overflow-hidden rounded-2xl shadow-sm ring-1 ring-inset ring-black/5 transition-transform duration-500 hover:-translate-y-1 hover:shadow-lg"
                style={{ outlineColor: color }}
              >
                <img src={photo.url} alt={photo.caption ?? ''} className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
              </button>
            ))}
          </div>
        </div>
      )}

      {videos.length > 0 && (
        <div>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[.22em] text-muted-foreground">Vidéos</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {videos.map((video) => (
              <div key={video.id}>
                <VideoEmbed url={video.url} caption={video.caption} />
                {video.caption && <p className="mt-2 text-xs font-semibold text-muted-foreground">{video.caption}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeIndex !== null && photos[activeIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveIndex(null)}
        >
          <button type="button" aria-label="Fermer" onClick={() => setActiveIndex(null)} className="absolute right-5 top-5 text-white/70 hover:text-white">
            <X className="h-7 w-7" />
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Photo précédente"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((activeIndex - 1 + photos.length) % photos.length)
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white sm:left-8"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                type="button"
                aria-label="Photo suivante"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((activeIndex + 1) % photos.length)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white sm:right-8"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}
          <img
            src={photos[activeIndex].url}
            alt={photos[activeIndex].caption ?? ''}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
