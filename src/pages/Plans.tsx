import { ArrowLeft, ArrowRight, CalendarDays, Copy, Plus, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Duration, Empty, PageTitle, PlanCard } from '../components/ui'
import { exerciseById, levels } from '../data/exercises'
import { presetPlans } from '../data/plans'
import { useStore } from '../store'
import { dateKey, planMinutes, schedule, weekdays } from '../utils/dates'

export function Plans() {
  const custom = useStore(s => s.plans)
  const enrollment = useStore(s => s.enrollment)
  const [level, setLevel] = useState('全部')
  const [time, setTime] = useState('全部')
  const all = [...presetPlans, ...custom]
  const shown = all.filter(p => (level === '全部' || p.level === level) && (time === '全部' || time === '短时' && planMinutes(p)[1] <= 25 || time === '中时' && planMinutes(p)[1] > 25 && planMinutes(p)[1] <= 45 || time === '长时' && planMinutes(p)[1] > 45))
  const current = all.find(p => p.id === enrollment?.planId)
  return (
    <>
      <PageTitle
        eyebrow="TRAINING PLANS / CONSISTENCY OVER INTENSITY"
        title="找到节奏，把进步交给时间。"
        description="选择适合你的起点，或创建自己的安排。预设计划是一般训练模板，不是伤病处方。"
        action={(
          <Link className="btn primary" to="/plans/new">
            <Plus size={17} />
            自定义计划
          </Link>
        )}
      />
      {current && (
        <div className="active-plan-banner">
          <CalendarDays size={26} />
          <div>
            <span className="eyebrow">当前计划</span>
            <h3>{current.name}</h3>
            <p>
              开始于
              {enrollment!.start}
              {' '}
              · 每周
              {current.weekdays.length}
              {' '}
              次
            </p>
          </div>
          <Link className="btn primary" to="/checkin">
            查看训练打卡
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
      <div className="filter-bar">
        <div className="segmented">{['全部', ...levels].map(l => <button key={l} className={l === level ? 'active' : ''} onClick={() => setLevel(l)}>{l}</button>)}</div>
        <select aria-label="计划时长筛选" value={time} onChange={e => setTime(e.target.value)}>
          <option>全部</option>
          <option value="短时">短时 · 25 分钟以内</option>
          <option value="中时">中时 · 26–45 分钟</option>
          <option value="长时">长时 · 45 分钟以上</option>
        </select>
        <span className="muted">
          {shown.length}
          {' '}
          套计划
        </span>
      </div>
      {shown.length ? <div className="plan-grid">{shown.map((p, i) => <PlanCard key={p.id} plan={p} index={i} />)}</div> : <Empty />}
      <div className="safety-note">
        <ShieldCheck size={20} />
        <p>首次选择较低难度，强度逐步增加。训练前热身 5 分钟、结束后冷身 3 分钟；时长含热身、冷身及约 30 秒动作切换。比赛周按状态减量。</p>
      </div>
    </>
  )
}
export function PlanDetail() {
  const { id = '' } = useParams()
  const { plans, enrollment, enroll } = useStore()
  const plan = [...presetPlans, ...plans].find(p => p.id === id)
  const [start, setStart] = useState(dateKey())
  const [dayIndex, setDayIndex] = useState(0)
  const navigate = useNavigate()
  if (!plan)
    return <Empty title="没有找到这个计划"><Link to="/plans">返回计划库</Link></Empty>
  const day = plan.days[Math.min(dayIndex, plan.days.length - 1)]
  const begin = () => {
    if (enrollment && !window.confirm('开始此计划会替换当前日程，历史打卡保留。确定继续？'))
      return
    enroll({ planId: id, start }); navigate('/checkin')
  }
  return (
    <>
      <Link className="back-link" to="/plans">
        <ArrowLeft size={16} />
        训练计划
      </Link>
      <PageTitle
        eyebrow={`${plan.level} / ${plan.weeks} WEEK PROGRAM`}
        title={plan.name}
        description={plan.description}
        action={(
          <Link to={`/plans/new?copy=${id}`} className="btn secondary">
            <Copy size={17} />
            复制并自定义
          </Link>
        )}
      />
      <div className="plan-detail-layout">
        <div>
          <div className="plan-meta panel">
            <div>
              <span>单次时长</span>
              <strong><Duration plan={plan} /></strong>
            </div>
            <div>
              <span>训练周期</span>
              <strong>
                {plan.weeks}
                {' '}
                周
              </strong>
            </div>
            <div>
              <span>每周频率</span>
              <strong>
                {plan.weekdays.length}
                {' '}
                次
              </strong>
            </div>
          </div>
          <div className="panel detail-block">
            <h3>每周训练日</h3>
            <div className="week-preview">
              {[1, 2, 3, 4, 5, 6, 0].map(n => (
                <span key={n} className={plan.weekdays.includes(n) ? 'on' : ''}>
                  {weekdays[n]}
                  <i>{plan.weekdays.includes(n) ? '训练' : '恢复'}</i>
                </span>
              ))}
            </div>
            <p>按照以下训练日循环执行。单侧次数为两侧合计，左右均分；计时单侧动作请在组内平均分配两侧时间。</p>
          </div>
          <div className="panel detail-block">
            <div className="segmented">{plan.days.map((d, i) => <button key={d.name} className={dayIndex === i ? 'active' : ''} onClick={() => setDayIndex(i)}>{d.name}</button>)}</div>
            <div className="plan-item-list">
              {day.items.map((item, i) => (
                <Link key={item.exerciseId} to={`/exercises/${item.exerciseId}`}>
                  <span className="item-number">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h4>{exerciseById[item.exerciseId].name}</h4>
<small>
{item.sets} 组 × 
{' '}
{item.seconds ? `${item.seconds} 秒` : `${item.reps} 次`} · 组间休息 
{' '}
{item.rest} 秒</small>
</div>
                  <ArrowRight size={17} />
                </Link>
              ))}
            </div>
          </div>
          <div className="safety-note">
            <ShieldCheck size={20} />
            <p>第 1 周先熟悉动作；在动作稳定、无痛且恢复良好时才逐步加量。每 4 周评估状态，疲劳时減量或休息。高阶负重与冲击动作需要专业指导。</p>
          </div>
        </div>
        <aside className="panel start-plan sticky-detail">
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h2>从一次训练开始。</h2>
          <p>选择开始日期，自动生成训练日程。数据保存在此浏览器，可以导出备份。</p>
          <label className="field">
            开始日期
            <input type="date" required value={start} onChange={e => setStart(e.target.value)} />
          </label>
          <p>{start && `首个训练日：${schedule(plan, { planId: id, start })[0]?.date}`}</p>
          <button className="btn primary w-full" disabled={!start} onClick={begin}>
            {enrollment?.planId === id ? '重新开始此计划' : '开始此计划'}
            <ArrowRight size={17} />
          </button>
          <small>重新开始会保留历史记录。同一天同一计划只保存一条打卡。</small>
        </aside>
      </div>
    </>
  )
}
