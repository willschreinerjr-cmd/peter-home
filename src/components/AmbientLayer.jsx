/**
 * AmbientLayer
 *
 * Absolutely-positioned overlay that adds two purely-CSS ambient effects:
 *   · 22 floating ember particles — tiny glowing sparks that drift upward
 *     like embers from a cabin fireplace.
 *   · 3 slow-drifting light orbs — large, heavily-blurred radial gradients
 *     that wander across the background, simulating shifting lamplight.
 *
 * All motion is driven by CSS @keyframes.  No requestAnimationFrame, no
 * setInterval — perfectly smooth and zero JS overhead on long display days.
 */

import { useMemo } from 'react'

// Deterministic pseudo-random so positions are stable across re-renders.
function sr(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

export function AmbientLayer() {
  const embers = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      left:     `${3 + sr(i)       * 94}%`,
      size:     `${1.5 + sr(i+50)  * 2.8}px`,
      duration: `${9  + sr(i+100)  * 18}s`,
      delay:    `${-sr(i+150)      * 24}s`,
      opacity:   0.18 + sr(i+200)  * 0.52,
      drift:    `${(sr(i+250)-0.5) * 110}px`,
    })), [])

  return (
    <div
      aria-hidden="true"
      style={{
        position:      'absolute',
        inset:          0,
        overflow:      'hidden',
        pointerEvents: 'none',
        zIndex:         2,
      }}
    >
      {/* Floating ember sparks */}
      {embers.map((e, i) => (
        <span
          key={i}
          className="ember"
          style={{
            left:      e.left,
            width:     e.size,
            height:    e.size,
            '--dur':   e.duration,
            '--del':   e.delay,
            '--mo':    e.opacity,
            '--drift': e.drift,
          }}
        />
      ))}

      {/* Slow ambient orbs */}
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
    </div>
  )
}
