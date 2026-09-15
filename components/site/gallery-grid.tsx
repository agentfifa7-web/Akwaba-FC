'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

type ImageItem = { id: string; url: string; caption: string | null; category: string }

export function GalleryGrid({ images }: { images: ImageItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <>
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        {images.map((image, i) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="group block w-full overflow-hidden bg-secondary"
          >
            <img src={image.url} alt={image.caption ?? ''} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </button>
        ))}
      </div>

      {activeIndex !== null && images[activeIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setActiveIndex(null)}
            className="absolute right-5 top-5 text-white/70 hover:text-white"
          >
            <X className="h-7 w-7" />
          </button>
          <button
            type="button"
            aria-label="Image précédente"
            onClick={(e) => {
              e.stopPropagation()
              setActiveIndex((activeIndex - 1 + images.length) % images.length)
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white sm:left-8"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            type="button"
            aria-label="Image suivante"
            onClick={(e) => {
              e.stopPropagation()
              setActiveIndex((activeIndex + 1) % images.length)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white sm:right-8"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <img
            src={images[activeIndex].url}
            alt={images[activeIndex].caption ?? ''}
            className="max-h-[85vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
