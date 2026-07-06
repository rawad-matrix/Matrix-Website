'use client'
import { useState } from 'react'
import Image from 'next/image'

export function CaseStudyGallery({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState(0)

  if (images.length === 0) {
    return (
      <div
        className="w-full rounded-[2px]"
        style={{ aspectRatio: '16/10', background: 'linear-gradient(160deg, #2a4a70 0%, #1a2a44 90%)', border: '1px solid #E2E8F0' }}
      />
    )
  }

  return (
    <div>
      {/* Main image */}
      <div
        className="relative w-full rounded-[2px] overflow-hidden"
        style={{ aspectRatio: '16/10', border: '1px solid #E2E8F0', background: '#0A0A12' }}
      >
        <Image
          src={images[selected]}
          alt={title}
          fill
          style={{ objectFit: 'contain' }}
          priority
          sizes="(max-width: 900px) 100vw, 60vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              aria-label={`View photo ${i + 1}`}
              className="relative overflow-hidden rounded-[2px] flex-shrink-0 transition-all duration-150 cursor-pointer"
              style={{
                width: 96,
                height: 64,
                border: i === selected ? '2px solid #1B6FCC' : '2px solid #E2E8F0',
                opacity: i === selected ? 1 : 0.65,
              }}
            >
              <Image
                src={url}
                alt={`${title} photo ${i + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
