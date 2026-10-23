import type { ReactNode } from 'react'
import type { Evidence, Exercise, Plan } from '../../types'
import { ArrowRight, ExternalLink, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { muscleById } from '../../data/muscles'
import { poseForExercise } from '../../data/poses'
import { sourceById } from '../../data/sources'
import { planMinutes } from '../../utils/dates'
import { PoseFigure } from '../figure/PoseFigure'

export function PageTitle({ eyebrow, title, description, action }: { eyebrow: string, title: string, description: string, action?: ReactNode }) {
  return (
    <div className="page-title">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}
export function SectionTitle({ title, subtitle, to }: { title: string, subtitle?: string, to?: string }) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {to && (
        <Link to={to} className="text-link">
          查看全部
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  )
}
export function Modal({ title, children, onClose, className = '' }: { title: string, children: ReactNode, onClose: () => void, className?: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current!
    dialog.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { dialog.close(); document.body.style.overflow = overflow }
  }, [])
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-label={title}
      onCancel={(e) => { e.preventDefault(); onClose() }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
            onClose()
        }
      }}
    >
      <div className="modal-header">
        <h2>{title}</h2>
        <button className="icon-btn" aria-label="关闭弹窗" onClick={onClose}><X size={20} /></button>
      </div>
      <div className="modal-content">{children}</div>
    </dialog>
  )
}
export function SourceLinks({ ids }: { ids: string[] }) {
  return (
    <div className="sources-list">
      {ids.map((id) => {
        const s = sourceById[id]; return (
          <a key={id} href={s.url} target="_blank" rel="noreferrer">
            <span>
              <strong>{s.publisher}</strong>
              {' '}
              ·
              {' '}
              {s.title}
              <small>{s.note}</small>
            </span>
            <ExternalLink size={15} />
          </a>
        )
      })}
    </div>
  )
}
export function EvidenceList({ items }: { items: Evidence[] }) {
  return (
    <div className="evidence-list">
      {items.map((item) => {
        const s = sourceById[item.sourceId]
        return (
          <article key={item.id} className="evidence-card">
            <span className={`evidence-level ${item.level === '实测肌电' ? 'emg' : 'review'}`}>{item.level}</span>
            <p>{item.finding}</p>
            <small>
              局限：
              {item.limit}
            </small>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.publisher}
              <ExternalLink size={12} />
            </a>
          </article>
        )
      })}
    </div>
  )
}
export function MuscleTags({ ids }: { ids: string[] }) {
  return <div className="tags">{ids.map(id => <Link className="tag" key={id} to={`/muscles/${id}`}>{muscleById[id].name}</Link>)}</div>
}
export function ExerciseCard({ exercise, index = 0 }: { exercise: Exercise, index?: number }) {
  return (
    <Link className={`exercise-card tone-${index % 4}`} to={`/exercises/${exercise.id}`}>
      <div className="exercise-art">
        <span className="tag level-tag">{exercise.level}</span>
        <PoseFigure pair={poseForExercise(exercise.id, exercise.pose)} exercise={exercise} />
        <span className="art-index">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="exercise-card-body">
        <span className="eyebrow">
          {exercise.category}
          {' '}
          ·
          {' '}
          {exercise.equipment}
        </span>
        <h3>
          {exercise.name}
          <ArrowRight size={18} />
        </h3>
        <p>{exercise.english}</p>
        <div className="card-muscles">
          {exercise.primaryMuscles.slice(0, 2).map(id => muscleById[id].name).join(' / ')}
          {exercise.primaryMuscles.length > 2 && ' 等'}
        </div>
      </div>
    </Link>
  )
}
export function Duration({ plan }: { plan: Plan }) {
  const [min, max] = planMinutes(plan); return (
    <>
      {min === max ? min : `${min}–${max}`}
      {' '}
      分钟
    </>
  )
}
export function PlanCard({ plan, index = 0 }: { plan: Plan, index?: number }) {
  return (
    <Link className={`plan-card plan-tone-${index % 3}`} to={`/plans/${plan.id}`}>
      <div className="plan-topline">
        <span className="tag">
          {plan.level}
          {' '}
          ·
          {' '}
          {plan.weeks}
          {' '}
          周
        </span>
        <span className="plan-number">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3>{plan.name}</h3>
      <p>{plan.description}</p>
      <div className="plan-bottom">
        <span>
          <Duration plan={plan} />
          {' '}
          / 次 · 每周
          {' '}
          {plan.weekdays.length}
          {' '}
          次
        </span>
        <span className="circle-arrow"><ArrowRight size={18} /></span>
      </div>
    </Link>
  )
}
export function Empty({ title = '暂时没有内容', description = '试试调整筛选条件，或从一个小目标开始。', children }: { title?: string, description?: string, children?: ReactNode }) {
  return (
    <div className="empty">
      <div className="empty-mark">↗</div>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  )
}
