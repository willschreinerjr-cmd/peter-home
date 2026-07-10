/**
 * DynamicBackground
 *
 * Renders a fullscreen background with:
 *  - Ken Burns slow-zoom animation on the active photo
 *  - Smooth 3-second cross-dissolve when the URL changes
 *    (new image preloads silently, then fades in; old fades out simultaneously)
 *  - Color/dimness overlays that also transition
 *
 * All transitions use only `opacity` (GPU composited) on the photo layers.
 * The overlay `background` transition is the only non-composited change,
 * which fires at most a few times per day.
 */

import { useState, useEffect, useRef, useCallback } from 'react'

const FADE_DURATION_MS = 3000

export function DynamicBackground({ url, overlay, dimness }) {
  const [base,    setBase]    = useState(url)   // Layer A – ken burns
  const [next,    setNext]    = useState(null)  // Layer B – incoming
  const [fadeOut, setFadeOut] = useState(false) // Layer A opacity direction
  const [fadeIn,  setFadeIn]  = useState(false) // Layer B opacity direction
  const timerRef  = useRef(null)
  const prevUrl   = useRef(url)

  const doTransition = useCallback((newUrl) => {
    clearTimeout(timerRef.current)

    const img = new Image()

    img.onload = () => {
      // Put layer B in DOM at opacity 0 first
      setNext(newUrl)
      setFadeIn(false)
      setFadeOut(false)

      // Wait for the browser to paint layer B (2 rAFs) then start the dissolve
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setFadeOut(true)
        setFadeIn(true)

        timerRef.current = setTimeout(() => {
          // Swap: layer A gets the new photo (instant, both show same image)
          setBase(newUrl)
          setFadeOut(false) // layer A snaps back to opacity 1 with new photo
          setNext(null)     // layer B removed from DOM
          setFadeIn(false)
        }, FADE_DURATION_MS + 200) // tiny buffer past the CSS transition end
      }))
    }

    img.onerror = () => {
      // Fall back to instant swap if image fails to load
      setBase(newUrl)
      setNext(null)
      setFadeOut(false)
      setFadeIn(false)
    }

    img.src = newUrl
  }, [])

  useEffect(() => {
    if (url !== prevUrl.current) {
      prevUrl.current = url
      doTransition(url)
    }
  }, [url, doTransition])

  // Cleanup on unmount
  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <>
      {/* ── Layer A: Ken Burns animated base ─────────────────────────────── */}
      <div
        className="ken-burns-bg"
        style={{
          position:           'absolute',
          inset:              '-8%',
          backgroundImage:    `url(${base})`,
          backgroundSize:     'cover',
          backgroundPosition: 'center',
          backgroundRepeat:   'no-repeat',
          zIndex:             0,
          opacity:            fadeOut ? 0 : 1,
          // Only use transition when we're actively fading out;
          // snapping back to 1 must be instant to avoid a re-fade
          transition:         fadeOut ? `opacity ${FADE_DURATION_MS}ms ease-in-out` : 'none',
          willChange:         'transform, opacity',
          pointerEvents:      'none',
        }}
      />

      {/* ── Layer B: incoming photo, dissolves in on top ──────────────────── */}
      {next && (
        <div
          style={{
            position:           'absolute',
            inset:              '-8%',
            backgroundImage:    `url(${next})`,
            backgroundSize:     'cover',
            backgroundPosition: 'center',
            backgroundRepeat:   'no-repeat',
            zIndex:             1,
            opacity:            fadeIn ? 1 : 0,
            transition:         `opacity ${FADE_DURATION_MS}ms ease-in-out`,
            willChange:         'opacity',
            pointerEvents:      'none',
          }}
        />
      )}

      {/* ── Color tint: warm amber shift per time-of-day / weather ─────────── */}
      <div
        aria-hidden="true"
        style={{
          position:      'absolute',
          inset:         0,
          zIndex:        2,
          background:    overlay,
          transition:    `background ${FADE_DURATION_MS}ms ease-in-out`,
          pointerEvents: 'none',
        }}
      />

      {/* ── Dimming overlay ────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position:      'absolute',
          inset:         0,
          zIndex:        2,
          background:    `rgba(0,0,0,${dimness})`,
          transition:    `background ${FADE_DURATION_MS}ms ease-in-out`,
          pointerEvents: 'none',
        }}
      />
    </>
  )
}
