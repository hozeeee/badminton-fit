import type { View } from '../../types'
import type { BodyShape } from './shapes'
import { useId, useState } from 'react'
import { muscleById } from '../../data/muscles'
import { bodyShapes, figures } from './shapes'

interface Props {
  view?: View
  selected?: string[]
  secondary?: string[]
  onSelect?: (id: string) => void
  heat?: Record<string, number>
  muted?: boolean
}
const mirrorTransform = 'translate(300 0) scale(-1 1)'

export function BodyMap({ view = 'front', selected = [], secondary = [], onSelect, heat, muted }: Props) {
  const [hovered, setHovered] = useState('')
  const uid = useId().replace(/:/g, '')
  const maxHeat = Math.max(1, ...Object.values(heat || {}))
  const figure = figures[view]
  const renderShape = (shape: BodyShape) => {
    const isSelected = selected.includes(shape.id)
    const isHovered = hovered === shape.id
    const fill = heat?.[shape.id] && !isSelected && !isHovered ? `color-mix(in srgb, var(--accent) ${25 + 70 * heat[shape.id] / maxHeat}%, var(--muscle))` : undefined
    return [false, ...(shape.mirror ? [true] : [])].map(mirror => (
      <g key={`${shape.id}-${mirror}`} transform={mirror ? mirrorTransform : undefined}>
        <path
          d={shape.path}
          data-muscle={shape.id}
          className={`muscle-region ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${secondary.includes(shape.id) ? 'secondary' : ''}`}
          style={{ fill }}
          role={onSelect ? 'button' : undefined}
          tabIndex={onSelect ? 0 : undefined}
          aria-label={`${muscleById[shape.id].name}${shape.mirror ? mirror ? ' · 左侧' : ' · 右侧' : ''}`}
          aria-pressed={onSelect ? isSelected : undefined}
          onClick={() => onSelect?.(shape.id)}
          onMouseEnter={() => setHovered(shape.id)}
          onMouseLeave={() => setHovered('')}
          onFocus={() => setHovered(shape.id)}
          onBlur={() => setHovered('')}
          onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect?.(shape.id) } }}
        >
          <title>{muscleById[shape.id].name}</title>
        </path>
        <path d={shape.path} className="muscle-sheen" fill={`url(#${uid}-sheen)`} />
      </g>
    ))
  }
  const lines = (d: string, className: string) => d && (
    <>
      <path d={d} className={className} />
      {view !== 'side' && <path d={d} className={className} transform={mirrorTransform} />}
    </>
  )
  return (
    <div className={`body-map ${muted ? 'is-muted' : ''}`}>
      <svg viewBox="0 0 300 580" aria-label={`${{ front: '正面', back: '背面', side: '侧面' }[view]}肌肉示意图`}>
        <defs>
          <linearGradient id={`${uid}-skin`} x1="0" x2="1">
            <stop offset="0" style={{ stopColor: 'var(--silhouette-edge)' }} />
            <stop offset="0.5" style={{ stopColor: 'var(--silhouette)' }} />
            <stop offset="1" style={{ stopColor: 'var(--silhouette-edge)' }} />
          </linearGradient>
          <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.42" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#0b2a1c" stopOpacity="0.16" />
          </linearGradient>
          <radialGradient id={`${uid}-floor`}>
            <stop offset="0" style={{ stopColor: 'var(--text)', stopOpacity: 0.16 }} />
            <stop offset="1" style={{ stopColor: 'var(--text)', stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        <ellipse cx="150" cy="562" rx="74" ry="9" fill={`url(#${uid}-floor)`} />
        <path d={figure.body} className="body-silhouette" fill={`url(#${uid}-skin)`} />
        <path d={figure.head} className="body-silhouette" fill={`url(#${uid}-skin)`} />
        {bodyShapes[view].filter(s => !s.layer).map(renderShape)}
        {figure.arm && <path d={figure.arm} className="body-silhouette" fill={`url(#${uid}-skin)`} />}
        {bodyShapes[view].filter(s => s.layer === 'arm').map(renderShape)}
        {lines(figure.details, 'body-detail')}
        {lines(figure.seams, 'body-seam')}
      </svg>
      {hovered && (
        <div className="body-tooltip" role="status">
          {muscleById[hovered].name}
          <span>
            {muscleById[hovered].english}
            {' · '}
            {muscleById[hovered].region}
          </span>
        </div>
      )}
    </div>
  )
}

export function ViewSwitcher({ view, onChange }: { view: View, onChange: (view: View) => void }) {
  const views: View[] = ['front', 'side', 'back']
  return (
    <div
      className="segmented"
      role="group"
      aria-label="人体视角"
      onKeyDown={(event) => {
        if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); onChange(views[(views.indexOf(view) + (event.key === 'ArrowRight' ? 1 : 2)) % 3]) }
      }}
    >
      {views.map(v => <button key={v} type="button" aria-pressed={v === view} className={view === v ? 'active' : ''} onClick={() => onChange(v)}>{{ front: '正面', side: '侧面', back: '背面' }[v]}</button>)}
    </div>
  )
}
