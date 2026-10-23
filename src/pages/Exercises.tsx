import type { View } from '../types'
import { ArrowLeft, ArrowRight, Plus, Search, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BodyMap, ViewSwitcher } from '../components/body/BodyMap'
import { PoseAnimator } from '../components/figure/PoseFigure'
import { Empty, EvidenceList, ExerciseCard, MuscleTags, PageTitle, SourceLinks } from '../components/ui'
import { BiliPlayer } from '../components/video/BiliPlayer'
import { evidenceForTechnique } from '../data/evidence'
import { categories, equipmentList, exerciseById, exercises, levels } from '../data/exercises'
import { muscles } from '../data/muscles'
import { techniqueById, techniques } from '../data/techniques'

export function Exercises() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('全部')
  const [level, setLevel] = useState('全部')
  const [equipment, setEquipment] = useState('全部')
  const muscle = params.get('muscle') || ''
  const shown = exercises.filter(e => (category === '全部' || e.category === category) && (level === '全部' || e.level === level) && (equipment === '全部' || e.equipment === equipment) && (!muscle || e.primaryMuscles.includes(muscle) || e.secondaryMuscles.includes(muscle)) && `${e.name} ${e.english}`.toLowerCase().includes(query.toLowerCase()))
  return (
    <>
      <PageTitle eyebrow="EXERCISE LIBRARY / TRAIN WITH PURPOSE" title="每个动作，都有它的方向。" description={`${exercises.length} 个力量、稳定、爆发与灵活性动作。从目标肌肉出发，找到适合你的练法。`} />
      <div className="category-tabs">{['全部', ...categories].map(c => <button key={c} className={c === category ? 'active' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div>
      <div className="filter-bar">
        <div className="filter-search">
          <Search size={17} />
          <input aria-label="搜索训练动作" placeholder="搜索动作名称 / English" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <select aria-label="难度筛选" value={level} onChange={e => setLevel(e.target.value)}>
          <option value="全部">所有难度</option>
          {levels.map(l => <option key={l}>{l}</option>)}
        </select>
        <select aria-label="器械筛选" value={equipment} onChange={e => setEquipment(e.target.value)}>
          <option value="全部">所有器械</option>
          {equipmentList.map(e => <option key={e}>{e}</option>)}
        </select>
        <select aria-label="目标肌肉筛选" value={muscle} onChange={e => setParams(e.target.value ? { muscle: e.target.value } : {})}>
          <option value="">所有肌肉</option>
          {muscles.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <span className="muted">
          {shown.length}
          {' '}
          个动作
        </span>
      </div>
      {shown.length ? <div className="exercise-grid">{shown.map((e, i) => <ExerciseCard key={e.id} exercise={e} index={i} />)}</div> : <Empty><button className="btn secondary" onClick={() => { setQuery(''); setCategory('全部'); setLevel('全部'); setEquipment('全部'); setParams({}) }}>重置筛选</button></Empty>}
    </>
  )
}
export function ExerciseDetail() {
  const { id = '' } = useParams()
  const exercise = exerciseById[id]
  const [view, setView] = useState<View>('front')
  const [level, setLevel] = useState<(typeof levels)[number]>('入门')
  const navigate = useNavigate()
  if (!exercise)
    return <Empty title="没有找到这个动作"><Link className="btn primary" to="/exercises">返回动作库</Link></Empty>
  return (
    <>
      <Link className="back-link" to="/exercises">
        <ArrowLeft size={16} />
        训练动作库
      </Link>
      <PageTitle
        eyebrow={`${exercise.category} / ${exercise.english.toUpperCase()}`}
        title={exercise.name}
        description={`${exercise.level} · ${exercise.equipment} · ${exercise.timed ? '计时训练' : '次数训练'}`}
        action={(
          <Link className="btn primary" to={`/plans/new?exercise=${exercise.id}`}>
            <Plus size={18} />
            加入我的计划
          </Link>
        )}
      />
      <div className="exercise-detail-layout">
        <div>
          <PoseAnimator key={id} exercise={exercise} />
          <div className="panel detail-block">
            <h3>它训练哪些肌肉？</h3>
            <div className="mini-anatomy">
              <BodyMap view={view} selected={exercise.primaryMuscles} secondary={exercise.secondaryMuscles} onSelect={next => navigate(`/muscles/${next}`)} />
              <div>
                <ViewSwitcher view={view} onChange={setView} />
                <h4>
                  <i className="dot" />
                  主要目标
</h4>
                <MuscleTags ids={exercise.primaryMuscles} />
                <h4>
                  <i className="dot amber" />
                  辅助 / 稳定
</h4>
                <MuscleTags ids={exercise.secondaryMuscles} />
                <small>浅层图无法直接显示全部深层肌肉；点击名称查看。力量动作与拉伸动作的目标含义不同。</small>
              </div>
            </div>
          </div>
          <BiliPlayer key={id} exercise={exercise} />
        </div>
        <div className="instruction-column">
          <div className="panel detail-block">
            <h3>动作步骤</h3>
            <ol className="steps">
              {exercise.steps.map((step, i) => (
                <li key={step}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
            <div className="tip">
              <ShieldCheck size={19} />
              <p>{exercise.tips}</p>
            </div>
          </div>
          <div className="panel detail-block">
            <h3>常见错误</h3>
            <p>{exercise.mistakes}</p>
            <div className="variant-grid">
              <div>
                <span className="eyebrow">EASIER / 退阶</span>
                <p>{exercise.regression}</p>
              </div>
              <div>
                <span className="eyebrow">HARDER / 进阶</span>
                <p>{exercise.progression}</p>
              </div>
            </div>
          </div>
          <div className="sport-note">
            <span className="eyebrow">TRANSFER TO BADMINTON</span>
            <h3>如何服务于球场？</h3>
            <p>{exercise.category === '灵活性' ? '用于无痛活动范围的探索与保持，不是最大力量训练。' : '建立相关肌群的力量、控制或耐力基础；改善击球或移动仍需要专项练习与适当恢复。'}</p>
            <div className="tags">
              {exercise.techniqueIds.map(t => (
                <Link className="tag" key={t} to={`/techniques/${t}`}>
                  {techniqueById[t].name}
                  <ArrowRight size={13} />
                </Link>
              ))}
            </div>
            <small>专项收益为基于功能的训练关联，不承诺单一动作提升比赛成绩。</small>
          </div>
          <div className="panel detail-block">
            <h3>训练量参考</h3>
            <div className="segmented">{levels.map(l => <button key={l} aria-pressed={level === l} className={level === l ? 'active' : ''} onClick={() => setLevel(l)}>{l}</button>)}</div>
            <p className="prescription">{exercise.prescription[level]}</p>
            <small>本站提供的保守起点，不是引用机构的标准处方。单侧动作分别练两边；强度与伤病由专业人员评估。</small>
          </div>
          <div className="detail-block">
            <h3>资料来源</h3>
            <SourceLinks ids={exercise.sources} />
          </div>
        </div>
      </div>
    </>
  )
}
export function TechniqueDetail() {
  const { id = '' } = useParams()
  const technical = techniques.find(t => t.id === id)
  if (!technical)
    return <Empty title="未找到该技术" />
  const related = exercises.filter(e => e.techniqueIds.includes(id))
  const studies = evidenceForTechnique(id)
  return (
    <>
      <Link className="back-link" to="/muscles">
        <ArrowLeft size={16} />
        肌肉图解
      </Link>
      <PageTitle eyebrow={technical.english.toUpperCase()} title={technical.name} description={technical.description} />
      <div className="panel detail-block">
        <h3>相关肌肉 · 非孤立发力</h3>
        <MuscleTags ids={technical.muscles} />
        <p>{technical.evidence}</p>
        {studies.length > 0 && (
          <>
            <h3>
              研究证据
              <span className="count">{studies.length}</span>
            </h3>
            <EvidenceList items={studies} />
          </>
        )}
        <SourceLinks ids={technical.sources} />
      </div>
      <div className="section-title">
        <h2>相关基础训练</h2>
        <small>体能训练不替代专项技术练习</small>
      </div>
      <div className="exercise-grid">{related.map((e, i) => <ExerciseCard key={e.id} exercise={e} index={i} />)}</div>
    </>
  )
}
