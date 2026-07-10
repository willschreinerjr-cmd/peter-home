/**
 * AutoScroll
 *
 * Drop-in replacement for scrollable list containers in kiosk mode.
 * If the content is taller than the container, it slowly and
 * continuously scrolls upward in an infinite loop — no user
 * interaction required.
 *
 * Usage:
 *   <AutoScroll className="flex-1 min-h-0">
 *     <div className="flex flex-col gap-2">
 *       {items}
 *     </div>
 *   </AutoScroll>
 *
 * The outer div handles overflow:hidden + position:relative.
 * A hidden "probe" div measures the natural content height so
 * the loop timing is always consistent regardless of item count.
 * Content is duplicated inside the animation track for a seamless
 * infinite loop (translateY(-50%) = exactly one content length).
 */

import { useState, useEffect, useRef } from 'react'

const PX_PER_SECOND = 22  // scroll speed — lower = slower / more ambient

export function AutoScroll({ children, className = '', style = {} }) {
  const outerRef = useRef(null)
  const probeRef = useRef(null)
  const [scrolling, setScrolling] = useState(false)
  const [duration,  setDuration]  = useState(20)

  useEffect(() => {
    function measure() {
      const outer = outerRef.current
      const probe = probeRef.current
      if (!outer || !probe) return
      const contentH   = probe.offsetHeight
      const containerH = outer.clientHeight
      const overflows  = contentH > containerH + 8   // 8px threshold avoids hair-trigger
      setScrolling(overflows)
      // Duration = time to scroll one full content length at PX_PER_SECOND
      // Capped at minimum 8 s so it never feels frantic
      setDuration(overflows ? Math.max(contentH / PX_PER_SECOND, 8) : 20)
    }

    measure()
    const ro = new ResizeObserver(measure)
    if (outerRef.current) ro.observe(outerRef.current)
    if (probeRef.current) ro.observe(probeRef.current)
    return () => ro.disconnect()
  }, [children])

  return (
    <div
      ref={outerRef}
      className={className}
      style={{ ...style, overflow: 'hidden', position: 'relative' }}
    >
      {/* Hidden probe: measures natural content height out of flow */}
      <div
        ref={probeRef}
        aria-hidden="true"
        style={{
          position:      'absolute',
          top:           0, left: 0, right: 0,
          visibility:    'hidden',
          pointerEvents: 'none',
          zIndex:        -1,
        }}
      >
        {children}
      </div>

      {/* Animation track: content + duplicate for seamless loop */}
      <div
        style={scrolling ? {
          animation:  `autoScrollUp ${duration}s linear infinite`,
          willChange: 'transform',
        } : undefined}
      >
        {children}
        {/* Duplicate renders seamlessly after the original; aria-hidden keeps
            screen readers from reading content twice */}
        {scrolling && <div aria-hidden="true">{children}</div>}
      </div>
    </div>
  )
}
