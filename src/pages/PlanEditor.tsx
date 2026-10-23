import type { Level, Plan, PlanItem } from '../types'
import { ArrowDown, ArrowLeft, ArrowUp, Plus, Save, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Duration, PageTitle } from '../components/ui'
import { categories, exerciseById, exercises, levels } from '../data/exercises'
import { defaultItem, presetPlans } from '../data/plans'
import { useStore } from '../store'
import { validPlan } from '../utils/backup'
import { weekdays } from '../utils/dates'

export function PlanEditor() {
  const [params] = useSearchParams()
  const { plans, savePlan } = useStore()
  const copy = [...presetPlans, ...plans].find(p => p.id === params.get('copy'))
  const initialExercise = params.get('exercise') || ''
  const [plan, setPlan] = useState<Plan>(() => ({ ...(copy ? JSON.parse(JSON.stringify(copy)) as Plan : { name: '我的羽毛球训练', level: '入门' as Level, weeks: 4, description: '按我的节奏，认真训练。', weekdays: [1, 4], days: [{ name: '训练 A', items: exerciseById[initialExercise] ? [defaultItem(initialExercise)] : [] }] }), id: `custom-${crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`, custom: true }))
  const [dayIndex, setDayIndex] = useState(0)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('全部')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const day = plan.days[dayIndex]
  const updateItems = (items: PlanItem[]) => setPlan({ ...plan, days: plan.days.map((d, i) => i === dayIndex ? { ...d, items } : d) })
  const updateItem = (id: string, field: keyof Omit<PlanItem, 'exerciseId'>, value: number) => updateItems(day.items.map(item => item.exerciseId === id ? { ...item, [field]: value } : item))
  const shown = exercises.filter(e => (category === '全部' || e.category === category) && `${e.name} ${e.english}`.toLowerCase().includes(query.toLowerCase()))
  const submit = () => {
    if (!validPlan(plan)) { setError('请填写名称、训练日，并确保每个训练模板至少包含一个动作且各数值有效。'); return }
    try { savePlan(plan); navigate(`/plans/${plan.id}`) }
    catch (e) { setError((e as Error).message) }
  }
  return (
    <>
      <Link className="back-link" to="/plans">
        <ArrowLeft size={16} />
        训练计划
      </Link>
      <PageTitle eyebrow="PLAN BUILDER / MAKE IT YOURS" title={copy ? '把计划，变成你的。' : '为自己设计一份训练。'} description="训练模板在选定周几依次循环。保存为新计划，已有计划和历史记录不会被修改。" />
      <form onSubmit={(e) => { e.preventDefault(); submit() }}>
        <div className="editor-layout">
          <div>
            <div className="panel detail-block">
              <h3>基本信息</h3>
              <label className="field">
                计划名称
<input value={plan.name} maxLength={80} required onChange={e => setPlan({ ...plan, name: e.target.value })} />
              </label>
              <div className="form-grid">
                <label className="field">
                  难度
<select value={plan.level} onChange={e => setPlan({ ...plan, level: e.target.value as Level })}>{levels.map(l => <option key={l}>{l}</option>)}</select>
                </label>
                <label className="field">
                  周期（周）<input type="number" min="1" max="52" required value={plan.weeks} onChange={e => setPlan({ ...plan, weeks: Number(e.target.value) })} />
                </label>
              </div>
              <label className="field">
                计划说明
<textarea maxLength={2000} rows={2} value={plan.description} onChange={e => setPlan({ ...plan, description: e.target.value })} />
              </label>
              <h4>每周训练日</h4>
              <div className="weekday-picker">{[1, 2, 3, 4, 5, 6, 0].map(n => <button type="button" key={n} aria-pressed={plan.weekdays.includes(n)} className={plan.weekdays.includes(n) ? 'active' : ''} onClick={() => setPlan({ ...plan, weekdays: plan.weekdays.includes(n) ? plan.weekdays.filter(v => v !== n) : [...plan.weekdays, n].sort() })}>{weekdays[n]}</button>)}</div>
            </div>
            <div className="panel detail-block">
              <div className="editor-day-tabs">
                <div className="segmented">{plan.days.map((d, i) => <button type="button" key={i} className={i === dayIndex ? 'active' : ''} onClick={() => setDayIndex(i)}>{d.name}</button>)}</div>
                <button type="button" className="icon-btn" disabled={plan.days.length >= 7} aria-label="添加训练模板" onClick={() => { setPlan({ ...plan, days: [...plan.days, { name: `训练 ${String.fromCharCode(65 + plan.days.length)}`, items: [] }] }); setDayIndex(plan.days.length) }}><Plus size={18} /></button>
                {plan.days.length > 1 && <button type="button" className="icon-btn" aria-label="删除此训练模板" onClick={() => { setPlan({ ...plan, days: plan.days.filter((_, i) => i !== dayIndex) }); setDayIndex(0) }}><Trash2 size={17} /></button>}
              </div>
              <p>从右侧动作库添加动作。次数为每组总次数，单侧动作两侧均分；计时为每组总秒数。</p>
              {!day.items.length && <div className="empty mini"><p>还没有动作，选择一个开始吧。</p></div>}
              {day.items.map((item, index) => (
                <div className="editor-item" key={item.exerciseId}>
                  <div className="editor-item-title">
                    <h4>
{index + 1}. 
{' '}
{exerciseById[item.exerciseId].name}
</h4>
<button type="button" className="icon-btn" aria-label={`上移${exerciseById[item.exerciseId].name}`} disabled={index === 0} onClick={() => { const items = [...day.items]; [items[index - 1], items[index]] = [items[index], items[index - 1]]; updateItems(items) }}><ArrowUp size={15} /></button>
                    <button type="button" className="icon-btn" aria-label={`下移${exerciseById[item.exerciseId].name}`} disabled={index === day.items.length - 1} onClick={() => { const items = [...day.items]; [items[index + 1], items[index]] = [items[index], items[index + 1]]; updateItems(items) }}><ArrowDown size={15} /></button>
<button type="button" className="icon-btn" aria-label={`移除${exerciseById[item.exerciseId].name}`} onClick={() => updateItems(day.items.filter(i => i.exerciseId !== item.exerciseId))}><Trash2 size={15} /></button>
</div>
                  <div className="item-fields">
{([['sets', '组数', 1, 20], [item.seconds ? 'seconds' : 'reps', item.seconds ? '每组秒数' : '每组次数', 1, item.seconds ? 3600 : 200], ['rest', '组间休息秒', 0, 600]] as const).map(([key, label, min, max]) => <label key={key}>
{label}<input type="number" required min={min} max={max} value={item[key]} onChange={e => updateItem(item.exerciseId, key, Number(e.target.value))} /></label>)}
</div>
                  <button type="button" className="text-link small" onClick={() => updateItems(day.items.map(i => i.exerciseId === item.exerciseId ? { ...i, seconds: i.seconds ? 0 : 30, reps: i.seconds ? 8 : 0 } : i))}>
                    切换为{item.seconds ? '次数' : '计时'}
                    模式
</button>
                </div>
              ))}
            </div>
          </div>
          <aside className="panel exercise-picker">
            <h3>选择训练动作</h3>
            <div className="filter-search">
              <Search size={16} />
              <input aria-label="搜索可添加的动作" value={query} onChange={e => setQuery(e.target.value)} placeholder="名称 / English" />
            </div>
            <select aria-label="动作分类" value={category} onChange={e => setCategory(e.target.value)}>{['全部', ...categories].map(c => <option key={c}>{c}</option>)}</select>
            <div className="picker-list">
              {shown.map(e => (
                <button type="button" key={e.id} disabled={day.items.some(i => i.exerciseId === e.id) || day.items.length >= 40} onClick={() => updateItems([...day.items, defaultItem(e.id, plan.level)])}>
                  <span>
                    {e.name}
<small>
{e.level} · 
{' '}
{e.equipment}
</small>
</span>
                  <Plus size={17} />
                </button>
              ))}
            </div>
          </aside>
        </div>
        <div className="save-bar">
          <div>
            <strong>
              预计
              <Duration plan={plan} />
              {' '}
              / 次
            </strong>
            <small>含 8 分钟热身冷身；不是严格计时处方</small>
          </div>
          {error && <p className="error" role="alert">{error}</p>}
          <button type="submit" className="btn primary">
            <Save size={17} />
            保存为新计划
          </button>
        </div>
      </form>
    </>
  )
}
