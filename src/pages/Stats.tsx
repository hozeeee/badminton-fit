import type { View } from '../types'
import { ArrowRight, CalendarCheck, ChevronLeft, ChevronRight, Flame, Target, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BodyMap, ViewSwitcher } from '../components/body/BodyMap'
import { Modal, PageTitle } from '../components/ui'
import { exerciseById } from '../data/exercises'
import { muscleById } from '../data/muscles'
import { presetPlans } from '../data/plans'
import { useStore } from '../store'
import { addDays, dateKey, parseDate, streak, weekdays } from '../utils/dates'
import { completionRate, muscleSets } from '../utils/stats'

export function Stats() {
  const { checkins, plans, enrollment } = useStore()
  const [month, setMonth] = useState(dateKey().slice(0, 7))
  const [view, setView] = useState<View>('front')
  const [selectedDate, setSelectedDate] = useState('')
  const navigate = useNavigate()
  const today = dateKey()
  const weekly = checkins.filter(c => c.date >= addDays(today, -6) && c.date <= today)
  const heat = muscleSets(weekly)
  const muscleRanks = Object.entries(heat).sort((a, b) => b[1] - a[1])
  const allPlans = [...presetPlans, ...plans]
  const current = allPlans.find(p => p.id === enrollment?.planId)
  const rate = current && enrollment ? completionRate(current, enrollment, checkins, today) : 0
  const first = parseDate(`${month}-01`)
  const offset = (first.getDay() + 6) % 7
  const count = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const changeMonth = (amount: number) => { const d = parseDate(`${month}-01`); d.setMonth(d.getMonth() + amount); setMonth(dateKey(d).slice(0, 7)) }
  const monthRecords = checkins.filter(c => c.date.startsWith(month))
  const selectedRecords = checkins.filter(c => c.date === selectedDate)
  const cards = [
    { icon: CalendarCheck, value: new Set(checkins.map(c => c.date)).size, unit: '天', label: '累计训练天数' },
    { icon: Flame, value: streak(checkins.map(c => c.date)), unit: '天', label: '连续自然日打卡' },
    { icon: Target, value: rate, unit: '%', label: '当前计划 · 到期动作完成率' },
    { icon: TrendingUp, value: weekly.length, unit: '次', label: '近 7 天训练记录' },
  ]
  return (
    <>
      <PageTitle
        eyebrow="YOUR PROGRESS / SMALL STEPS, REAL CHANGE"
        title="每一份努力，都在积累。"
        description="不和别人比，只看自己的成长。连续天数不代表训练质量，请给恢复日留出位置。"
        action={(
          <Link className="btn primary" to="/checkin">
            记录一次训练
            <ArrowRight size={16} />
          </Link>
        )}
      />
      <div className="stat-grid">
        {cards.map(c => (
          <div key={c.label} className="panel stat-card">
            <c.icon size={20} />
            <strong>
              {c.value}
              <span>{c.unit}</span>
            </strong>
            <p>{c.label}</p>
          </div>
        ))}
      </div>
      <div className="stats-layout">
        <div className="panel calendar-panel">
          <div className="section-title">
            <div>
              <h2>训练日历</h2>
              <p>
                {monthRecords.length}
                {' '}
                次记录 ·
                {' '}
                {new Set(monthRecords.map(c => c.date)).size}
                {' '}
                个训练日
              </p>
            </div>
            <div className="calendar-nav">
              <button className="icon-btn" aria-label="上个月" onClick={() => changeMonth(-1)}><ChevronLeft size={18} /></button>
              <strong>{month.replace('-', ' / ')}</strong>
              <button className="icon-btn" aria-label="下个月" onClick={() => changeMonth(1)}><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className="calendar-grid">
            {[1, 2, 3, 4, 5, 6, 0].map(n => <span className="calendar-weekday" key={n}>{weekdays[n]}</span>)}
            {Array.from({ length: offset }, (_, i) => <span key={`empty-${i}`} />)}
            {Array.from({ length: count }, (_, i) => {
              const date = `${month}-${String(i + 1).padStart(2, '0')}`
              const entries = checkins.filter(c => c.date === date)
              const sets = entries.reduce((sum, c) => sum + c.completed.reduce((s, item) => s + item.sets, 0), 0)
              return (
                <button key={date} className={`calendar-day ${entries.length ? 'trained' : ''} ${date === today ? 'today' : ''}`} style={entries.length ? { background: `color-mix(in srgb, var(--accent) ${Math.min(80, 18 + sets * 3)}%, var(--panel))` } : undefined} aria-label={`${date}，${entries.length ? `${entries.length} 次训练、${sets} 组` : '没有训练记录'}`} onClick={() => setSelectedDate(date)}>
                  <span>{i + 1}</span>
                  {entries.length
                    ? (
                        <small>
                          {sets}
{' '}
组
</small>
                      )
: <i>·</i>}
                </button>
              )
            })}
          </div>
          <div className="calendar-legend">
            <span>点击日期查看记录</span>
            <span>
              少
              <i />
              <i />
              <i />
              多
            </span>
          </div>
          <small>热度为记录的总组数，不是训练负荷或能力评估。</small>
        </div>
        <div className="panel muscle-heat">
          <div className="section-title">
            <div>
              <h2>身体的训练地图</h2>
              <p>近 7 天 · 主要目标肌肉组数</p>
            </div>
            <ViewSwitcher view={view} onChange={setView} />
          </div>
          <div className="heat-content">
            <BodyMap view={view} heat={heat} onSelect={id => navigate(`/muscles/${id}`)} />
            <div className="muscle-bars">
              {muscleRanks.slice(0, 8).map(([id, sets]) => (
                <div key={id}>
                  <Link to={`/muscles/${id}`}>
                    {muscleById[id].name}
<span>
{sets} 组</span>
</Link>
                  <div className="bar-track"><i style={{ width: `${sets / (muscleRanks[0]?.[1] || 1) * 100}%` }} /></div>
                </div>
              ))}
              {!muscleRanks.length && <p className="muted">记录训练后，这里会出现你的肌肉训练分布。</p>}
            </div>
          </div>
          <small>同一动作可涉及多个肌肉，分别累计组数；不含拉伸，不记录外加重量，不代表各肌肉真实受力。</small>
        </div>
      </div>
      <div className="panel detail-block">
        <h3>最近的训练</h3>
        <div className="recent-records">
          {[...checkins].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10).map(c => (
            <button key={`${c.planId}-${c.date}`} onClick={() => setSelectedDate(c.date)}>
              <span className="record-date">{c.date}</span>
              <span>
                <strong>{allPlans.find(p => p.id === c.planId)?.name}</strong>
                <small>
                  {c.completed.length}
                  {' '}
                  个动作 · RPE 
{' '}
                  {c.rpe}
                  /10
</small>
              </span>
              <ArrowRight size={16} />
            </button>
          ))}
          {!checkins.length && <p>还没有训练记录。第一次完成后，日历就会点亮。</p>}
        </div>
      </div>
      {selectedDate && (
        <Modal title={`${selectedDate} 的训练`} onClose={() => setSelectedDate('')}>
          {selectedRecords.length
            ? selectedRecords.map(c => (
                <div className="detail-block" key={c.planId}>
                  <h3>{allPlans.find(p => p.id === c.planId)?.name}</h3>
                  <p>
                    主观疲劳度：
{c.rpe}
                    {' '}
                    / 10
                  </p>
                  <div className="related-list">
                    {c.completed.map(i => (
                      <Link to={`/exercises/${i.exerciseId}`} key={i.exerciseId} onClick={() => setSelectedDate('')}>
                        <span>
{exerciseById[i.exerciseId].name}<small>
{i.sets} 组 × 
{' '}
{i.seconds ? `${i.seconds} 秒` : `${i.reps} 次`}
</small></span>
<ArrowRight size={15} />
</Link>
                    ))}
                  </div>
                  <p>{c.note || '没有备注'}</p>
                </div>
              ))
            : <p>这一天没有训练记录。恢复也是训练的一部分。</p>}
        </Modal>
      )}
    </>
  )
}
