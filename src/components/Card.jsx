/**
 * Card — reusable glass-morphism card container.
 * CardHeader — standardised widget header with icon, title, and optional subtitle.
 */

// Glass card with optional gold-bordered elevated variant
export function Card({ children, className = '', elevated = false, style }) {
  return (
    <div
      className={`${elevated ? 'glass-card-elevated' : 'glass-card'} flex flex-col ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

// Section label used at the top of every widget
export function CardHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2.5 mb-3 flex-shrink-0">
      {icon && <span className="text-base leading-none">{icon}</span>}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] leading-none"
            style={{ color: 'rgba(200,169,110,0.8)' }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs mt-1 leading-none" style={{ color: '#7a5e42' }}>{subtitle}</p>
        )}
      </div>
    </div>
  )
}

// Thin horizontal divider with a gold centre fade
export function GoldDivider({ className = '' }) {
  return (
    <div
      className={`h-px flex-shrink-0 ${className}`}
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(200,169,110,0.4), transparent)',
      }}
    />
  )
}

// Skeleton shimmer block used as loading placeholder
export function Skeleton({ className = '' }) {
  return <div className={`skeleton rounded-md ${className}`} />
}
