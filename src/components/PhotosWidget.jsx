/**
 * PhotosWidget — Photo Slideshow
 *
 * Rotates through photos configured in src/config/settings.js → photos.
 * Add personal photos by dropping image files in the /public/ folder
 * and referencing them as './your-photo.jpg', or use any https:// URL.
 *
 * Click the dot indicators to jump to any photo.
 */

import { useState, useEffect, useCallback } from 'react'
import { settings } from '../config/settings'

export function PhotosWidget() {
  const photos   = settings.photos ?? []
  const interval = (settings.photoIntervalSeconds ?? 12) * 1000

  const [idx,  setIdx]  = useState(0)
  const [fade, setFade] = useState(true)

  const goTo = useCallback((i) => {
    setFade(false)
    setTimeout(() => {
      setIdx(i)
      setFade(true)
    }, 400)
  }, [])

  // Auto-advance
  useEffect(() => {
    if (photos.length < 2) return
    const id = setInterval(() => {
      setIdx(prev => {
        const next = (prev + 1) % photos.length
        setFade(false)
        setTimeout(() => setFade(true), 400)
        return next
      })
    }, interval)
    return () => clearInterval(id)
  }, [photos.length, interval])

  if (!photos.length) {
    return (
      <div
        className="h-full w-full flex items-center justify-center rounded-xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="text-center px-6">
          <div className="text-4xl mb-3">🖼️</div>
          <p className="text-sm font-medium" style={{ color: '#7a5e42' }}>No photos yet</p>
          <p className="text-xs mt-1" style={{ color: '#5a3e28' }}>
            Add photo URLs to <code style={{ color: '#c8a96e' }}>settings.js → photos</code>
          </p>
        </div>
      </div>
    )
  }

  const photo = photos[idx]

  return (
    <div
      className="h-full w-full relative overflow-hidden"
      style={{ borderRadius: '12px' }}
    >
      {/* Background photo */}
      <div
        style={{
          position:           'absolute',
          inset:              0,
          backgroundImage:    `url(${photo.url})`,
          backgroundSize:     'cover',
          backgroundPosition: 'center',
          opacity:            fade ? 1 : 0,
          transition:         'opacity 0.4s ease',
        }}
      />

      {/* Dark gradient overlay for text legibility */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 45%, transparent 100%)',
        }}
      />

      {/* Caption */}
      {(photo.title || photo.caption) && (
        <div
          style={{
            position: 'absolute',
            bottom:   0,
            left:     0,
            right:    0,
            padding:  '16px 18px',
          }}
        >
          {photo.title && (
            <p
              style={{
                margin:     0,
                color:      '#fff',
                fontWeight: '600',
                fontSize:   'clamp(0.8rem, 1.1vw, 1rem)',
                lineHeight: 1.3,
              }}
            >
              {photo.title}
            </p>
          )}
          {photo.caption && (
            <p
              style={{
                margin:    '4px 0 0',
                color:     'rgba(255,255,255,0.6)',
                fontSize:  'clamp(0.65rem, 0.85vw, 0.78rem)',
                lineHeight: 1.4,
              }}
            >
              {photo.caption}
            </p>
          )}
        </div>
      )}

      {/* Counter label top-left */}
      {photos.length > 1 && (
        <div
          style={{
            position:    'absolute',
            top:         '10px',
            left:        '12px',
            fontSize:    '0.6rem',
            color:       'rgba(255,255,255,0.45)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {idx + 1} / {photos.length}
        </div>
      )}

      {/* Dot navigation */}
      {photos.length > 1 && (
        <div
          style={{
            position:   'absolute',
            top:        '10px',
            right:      '12px',
            display:    'flex',
            gap:        '5px',
            alignItems: 'center',
          }}
        >
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width:        i === idx ? '18px' : '6px',
                height:       '6px',
                borderRadius: '999px',
                background:   i === idx ? 'rgba(200,169,110,0.95)' : 'rgba(255,255,255,0.3)',
                border:       'none',
                cursor:       'pointer',
                padding:      0,
                transition:   'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
