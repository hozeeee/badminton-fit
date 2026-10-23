import type { Checkin as CheckinRecord, Plan, PlanItem } from '../types'
import { ArrowRight, Check, CircleCheck, Pause, Play, RotateCcw, Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Empty, PageTitle } from '../components/ui'
import { exerciseById } from '../data/exercises'
import { presetPlans } from '../data/plans'
import { useStore } from '../store'
import { dateKey, dayMinutes, schedule } from '../utils/dates'

export function Checkin() {
  const { enrollment, plans, checkins } = useStore()
  const [date, setDate] = useState(dateKey())
  const plan = [...presetPlans, ...plans].find(p => p.id === enrollment?.planId)
  if (!plan || !enrollment) {
    return (
      <>
        <PageTitle eyebrow="TRAINING LOG / ONE SESSION AT A TIME" title="认真练过的每一天，都值得记录。" description="开始一个训练计划，逐个记录动作和实际完成量。" />
        <Empty title="你的训练故事，还没开始" description="从一个适合你的计划开始，选择训练日，再记录每一次努力。">
          <Link className="btn primary" to="/plans">
            选择训练计划
            <ArrowRight size={17} />
          </Link>
        </Empty>
      </>
    )
  }
  const sessions = schedule(plan, enrollment)
  const day = sessions.find(s => s.date === date)
  const existing = checkins.find(c => c.date === date && c.planId === plan.id)
  const past = sessions.filter(s => s.date <= dateKey())
  const next = sessions.find(s => s.date > dateKey())
  return (
    <>
      <PageTitle
        eyebrow="TRAINING LOG / EVERY EFFORT COUNTS"
        title="今天，为更好的下一拍。"
        description={`${plan.name} · ${enrollment.start} 开始 · 记录实际训练，不追求勾满。`}
        action={(
          <Link className="btn secondary" to="/stats">
            查看我的进步
            <ArrowRight size={16} />
          </Link>
        )}
      />
      <div className="filter-bar">
        <label className="date-select">
          训练日期
          <select aria-label="选择训练日期" value={date} onChange={e => setDate(e.target.value)}>
            {!past.some(s => s.date === dateKey()) && (
              <option value={dateKey()}>
                {dateKey()}
                {' '}
                ·
                {' '}
                {sessions.some(s => s.date > dateKey()) ? '恢复日' : '未安排'}
              </option>
            )}
            {[...past].reverse().map(s => (
              <option key={s.date} value={s.date}>
                {s.date}
                {' '}
                ·
                {' '}
                {plan.days[s.dayIndex].name}
                {checkins.some(c => c.date === s.date && c.planId === plan.id) ? ' · 已记录' : ''}
              </option>
            ))}
          </select>
        </label>
        <span className="muted">支持补记过去的计划训练日，不允许提前打卡</span>
      </div>
      {day && date <= dateKey() ? <SessionForm key={`${plan.id}-${date}-${day.dayIndex}`} plan={plan} date={date} dayIndex={day.dayIndex} existing={existing} /> : <Empty title={next ? '今天，让身体好好恢复。' : '本周期已完成或尚未开始'} description={next ? `下一次训练：${next.date} · ${plan.days[next.dayIndex].name}。恢复日不需要为了连续天数而加练。` : '可从日期选择中补记过去训练，或选择新的计划。'}><Link className="btn secondary" to={`/plans/${plan.id}`}>查看计划安排</Link></Empty>}
    </>
  )
}
function SessionForm({ plan, date, dayIndex, existing }: { plan: Plan, date: string, dayIndex: number, existing?: CheckinRecord }) {
  const day = plan.days[dayIndex]
  const [items, setItems] = useState<PlanItem[]>(day.items.map(i => ({ ...i, ...existing?.completed.find(c => c.exerciseId === i.exerciseId) })))
  const [completed, setCompleted] = useState(new Set(existing?.completed.map(i => i.exerciseId) || []))
  const [rpe, setRpe] = useState(existing?.rpe || 5)
  const [note, setNote] = useState(existing?.note || '')
  const [message, setMessage] = useState('')
  const save = useStore(s => s.saveCheckin)
  const percent = Math.round(completed.size / items.length * 100)
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      try { save({ date, planId: plan.id, dayIndex, completed: items.filter(i => completed.has(i.exerciseId)), rpe, note }); setMessage('已保存到此浏览器。今天的努力，已被记录。') }
      catch (error) { setMessage(`保存失败：${(error as Error).message}`) }
    }}
    >
      <div className="checkin-layout">
        <div>
          <div className="session-summary panel">
            <div>
              <span className="eyebrow">
                {date}
                {' '}
                /
                {' '}
                {day.name}
              </span>
              <h2>一组一组，稳稳完成。</h2>
              <p>
                预计
                {dayMinutes(day)}
                {' '}
                分钟 ·
                {items.length}
                {' '}
                个动作 · 含热身和冷身
              </p>
            </div>
            <div className="progress-ring" style={{ background: `conic-gradient(var(--accent) ${percent}%, var(--border) 0)` }}>
              <span>
                {percent}
                %
              </span>
            </div>
          </div>
          <div className="safety-note">
            <Check size={18} />
            <p>先热身 5 分钟，结束冷身 3 分钟。单侧动作次数为两侧合计；疼痛时停止，未做的动作不勾选。</p>
          </div>
          <div className="checkin-items">
            {items.map((item, i) => {
              const exercise = exerciseById[item.exerciseId]; return (
                <div className={`panel checkin-item ${completed.has(item.exerciseId) ? 'done' : ''}`} key={item.exerciseId}>
                  <div className="checkin-item-top">
                    <label className="check-label">
                      <input
                        type="checkbox"
                        checked={completed.has(item.exerciseId)}
                        onChange={() => {
 setMessage(''); setCompleted((prev) => {
 const next = new Set(prev); if (next.has(item.exerciseId)) 
next.delete(item.exerciseId); else next.add(item.exerciseId); return next 
}) 
}}
                      />
<span className="checkbox-art">{completed.has(item.exerciseId) ? <Check size={16} /> : i + 1}</span>
                      <strong>{exercise.name}</strong>
                    </label>
                    <Link className="text-link" to={`/exercises/${item.exerciseId}`}>
  动作说明<ArrowRight size={15} />
</Link>
                  </div>
                  <small>
                    计划：{day.items[i].sets}
                    {' '}
                    组 ×{day.items[i].seconds ? `${day.items[i].seconds} 秒` : `${day.items[i].reps} 次`}
                    {' '}
                    · 组间休息{item.rest}
                    {' '}
                    秒
</small>
                  <div className="item-fields">
                    {([['sets', '实际组数', 20], [item.seconds ? 'seconds' : 'reps', item.seconds ? '实际秒/组' : '实际次/组', item.seconds ? 3600 : 200]] as const).map(([key, label, max]) => (
<label key={key}>
{label}<input type="number" required={completed.has(item.exerciseId)} min="1" max={max} value={item[key]} onChange={(e) => { setMessage(''); setItems(items.map(it => it.exerciseId === item.exerciseId ? { ...it, [key]: Math.max(1, Number(e.target.value)) } : it)) }} /></label>
))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <aside>
          <RestTimer />
          <div className="panel detail-block">
            <h3>训练后的感受</h3>
            <label className="field">
              主观疲劳度 RPE：
              {rpe}
              {' '}
              / 10
              <input aria-label="主观疲劳度 RPE" type="range" min="1" max="10" value={rpe} onChange={(e) => { setMessage(''); setRpe(Number(e.target.value)) }} />
            </label>
            <div className="range-labels">
              <small>1 很轻松</small>
              <small>10 极限疲劳</small>
            </div>
            <label className="field">
              训练备注
              <textarea rows={4} maxLength={2000} placeholder="今天的状态、完成感受或需要调整的动作…" value={note} onChange={(e) => { setMessage(''); setNote(e.target.value) }} />
            </label>
            <button type="submit" className="btn primary w-full" disabled={!completed.size}>
              <CircleCheck size={18} />
              {existing ? '更新训练记录' : '保存训练记录'}
            </button>
            {message && <p className="save-message" role="status">{message}</p>}
            <small>
              勾选
              {completed.size}
              {' '}
              /
              {items.length}
              {' '}
              个动作。未完成全部也可以记录；同日同计划更新原记录，不重复累计。
            </small>
          </div>
        </aside>
      </div>
    </form>
  )
}
function RestTimer() {
  const [duration, setDuration] = useState(60)
  const [remaining, setRemaining] = useState(60)
  const [deadline, setDeadline] = useState<number | null>(null)
  useEffect(() => {
    if (deadline === null)
      return
    const tick = () => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000)); setRemaining(left); if (!left)
        setDeadline(null)
    }
    tick(); const timer = setInterval(tick, 250)
    return () => clearInterval(timer)
  }, [deadline])
  return (
    <div className="panel rest-timer">
      <span className="eyebrow">
        <Timer size={15} />
        REST & RECOVER
      </span>
      <h3>组间休息</h3>
      <div className="timer-digits" role="timer" aria-label={`剩余 ${remaining} 秒`}>
        {String(Math.floor(remaining / 60)).padStart(2, '0')}
        <span>:</span>
        {String(remaining % 60).padStart(2, '0')}
      </div>
      <div className="segmented">
        {[30, 60, 90, 120].map(n => (
          <button type="button" key={n} className={duration === n ? 'active' : ''} onClick={() => { setDuration(n); setRemaining(n); setDeadline(null) }}>
            {n}
            s
          </button>
        ))}
      </div>
      <div className="timer-actions">
        <button type="button" className="btn primary" disabled={!remaining} onClick={() => setDeadline(deadline ? null : Date.now() + remaining * 1000)}>
          {deadline ? <Pause size={16} /> : <Play size={16} />}
          {deadline ? '暂停' : '开始'}
        </button>
        <button type="button" className="icon-btn" aria-label="重置计时器" onClick={() => { setDeadline(null); setRemaining(duration) }}><RotateCcw size={18} /></button>
      </div>
      {remaining === 0 && <p role="status">休息结束，确认状态后继续。</p>}
      <small>高强度力量或跳跃动作可休息更久，以恢复状态为准。</small>
    </div>
  )
}
