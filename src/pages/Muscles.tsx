import type { Muscle, View } from '../types'
import { ArrowLeft, ArrowRight, Hand, Search, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BodyMap, ViewSwitcher } from '../components/body/BodyMap'
import { bodyShapes } from '../components/body/shapes'
import { Empty, EvidenceList, ExerciseCard, Modal, PageTitle, SourceLinks } from '../components/ui'
import { evidenceForMuscle, evidenceMuscles } from '../data/evidence'
import { exercisesForMuscle } from '../data/exercises'
import { muscleById, muscles, regions } from '../data/muscles'
import { techniques } from '../data/techniques'

export function MuscleContent({ muscle, compact }: { muscle: Muscle, compact?: boolean }) {
  const related = exercisesForMuscle(muscle.id)
  const technical = techniques.filter(t => t.muscles.includes(muscle.id))
  const studies = evidenceForMuscle(muscle.id)
  return (
    <div className="muscle-content">
      <div className="muscle-heading">
        <span className="tag">
          {muscle.region}
          {muscle.deep ? ' · 深层' : ''}
        </span>
        <h2>{muscle.name}</h2>
        <p>{muscle.english}</p>
        <small>{muscle.latin}</small>
      </div>
      <div className="detail-block">
        <h3>起止点 · 简述</h3>
        <p>{muscle.attachment}</p>
      </div>
      <div className="detail-block">
        <h3>主要功能</h3>
        <p>{muscle.action}</p>
      </div>
      <div className="sport-note">
        <span className="eyebrow">ON THE COURT</span>
        <h3>在羽毛球中，它做什么？</h3>
        <p>{muscle.sport}</p>
        <small>{studies.length ? '这段为解剖功能解释；下方“研究证据”列出了羽毛球实测研究中与它有关的结论。' : '基于解剖功能的关联解释，暂无本站收录的羽毛球实测研究，不是肌肉活动强度排名。'}</small>
      </div>
      <div className="tags">
        {technical.map(t => (
          <Link to={`/techniques/${t.id}`} key={t.id} className="tag">
            {t.name}
            <ArrowRight size={13} />
          </Link>
        ))}
      </div>
      {studies.length > 0 && (
        <div className="detail-block">
          <h3>
            研究证据
            <span className="count">{studies.length}</span>
          </h3>
          <EvidenceList items={studies} />
        </div>
      )}
      <div className="detail-block">
        <h3>
          如何训练它
          <span className="count">{related.length}</span>
        </h3>
        {compact
          ? (
              <div className="related-list">
                {related.slice(0, 6).map(e => (
                  <Link key={e.id} to={`/exercises/${e.id}`}>
                    <span>
                      {e.name}
                      <small>{e.primaryMuscles.includes(muscle.id) ? '主要目标' : '辅助稳定'}</small>
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                ))}
                {related.length > 6 && (
                  <Link to={`/exercises?muscle=${muscle.id}`}>
                    查看全部相关动作
<ArrowRight size={16} />
                  </Link>
                )}
              </div>
            )
          : <div className="exercise-grid">{related.map((e, i) => <ExerciseCard key={e.id} exercise={e} index={i} />)}</div>}
        {!related.length && <p>当前动作库没有单独针对它的动作。它常在复合动作中协同工作，不必追求逐肌孤立训练。</p>}
      </div>
      <div className="safety-note">
        <ShieldCheck size={19} />
        <p>{muscle.prevention}</p>
      </div>
      <div className="detail-block">
        <h3>参考资料</h3>
        <SourceLinks ids={muscle.sources} />
      </div>
    </div>
  )
}
export function Muscles() {
  const [params] = useSearchParams()
  const initial = params.get('highlight') || ''
  const [view, setView] = useState<View>('front')
  const [selected, setSelected] = useState(initial)
  const [dialog, setDialog] = useState(false)
  const [region, setRegion] = useState('全部')
  const [query, setQuery] = useState('')
  const [showEvidence, setShowEvidence] = useState(false)
  const navigate = useNavigate()
  const visible = muscles.filter(m => (region === '全部' || m.region === region) && `${m.name} ${m.english}`.toLowerCase().includes(query.toLowerCase()))
  const select = (id: string) => { setSelected(id); setDialog(true) }
  const shapeIds = new Set(bodyShapes[view].map(s => s.id))
  const evidenceHeat = showEvidence ? Object.fromEntries(evidenceMuscles.map(id => [id, 0.5])) : undefined
  return (
    <>
      <PageTitle eyebrow="ANATOMY / THE POWER BEHIND EVERY SHOT" title="身体，是你的第一副球拍。" description="从肌肉出发，理解功能、击球力量链与训练方法。三视角为浅层位置示意，深层肌肉可从列表查看。" />
      <div className="anatomy-layout">
        <aside className="panel anatomy-sidebar">
          <h3>探索身体部位</h3>
          <div className="filter-search">
            <Search size={16} />
            <input aria-label="搜索肌肉" placeholder="名称 / English" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div className="region-list">
            {['全部', ...regions].map(r => (
              <button key={r} className={r === region ? 'active' : ''} onClick={() => setRegion(r)}>
                {r}
                <span>{r === '全部' ? muscles.length : muscles.filter(m => m.region === r).length}</span>
              </button>
            ))}
          </div>
          <small>使用 Tab 聚焦肌肉，Enter 查看。视角切换支持左右方向键。</small>
        </aside>
        <div className="panel anatomy-stage">
          <div className="stage-top">
            <span className="eyebrow">HUMAN MUSCLE MAP</span>
            <label className="evidence-toggle">
              <input type="checkbox" checked={showEvidence} onChange={e => setShowEvidence(e.target.checked)} />
              标出有实测研究的肌肉
            </label>
            <ViewSwitcher view={view} onChange={setView} />
          </div>
          <div className="anatomy-canvas">
            <div className="anatomy-grid" />
            <BodyMap view={view} heat={evidenceHeat} selected={selected ? [selected] : region === '全部' ? [] : visible.map(m => m.id)} onSelect={select} />
            <div className="stage-instruction">
              <Hand size={16} />
              点击肌肉，打开它的训练地图
            </div>
            <div className="stage-scale">
              2D ANATOMY
              <br />
              <span>示意 · 非医学绘图</span>
            </div>
          </div>
        </div>
        <aside className="panel muscle-browser">
          <h3>
            {region === '全部' ? '肌肉索引' : region}
            <span className="count">{visible.length}</span>
          </h3>
          <div className="muscle-index">
            {visible.map(m => (
              <button key={m.id} className={m.id === selected ? 'active' : ''} onClick={() => select(m.id)}>
                <span>
                  {m.name}
                  <small>{m.english}</small>
                </span>
                <span className="index-indicator">{m.deep ? '深层' : shapeIds.has(m.id) ? '●' : '列表'}</span>
              </button>
            ))}
          </div>
          {!visible.length && <p>没有匹配肌肉。</p>}
        </aside>
      </div>
      <div className="evidence-banner">
        <ShieldCheck size={24} />
        <p>“在羽毛球中做什么”默认是基于解剖功能的解释。跨步与正手杀球另有羽毛球实测肌电研究（Sensors 2025、Frontiers 2025），会在对应肌肉下以“研究证据”单独列出并注明局限。深层肌肉不会在浅层图上伪装成可见结构。</p>
        <Link className="text-link" to="/about">
          来源说明
          <ArrowRight size={15} />
        </Link>
      </div>
      {dialog && muscleById[selected] && (
        <Modal title="肌肉详情" onClose={() => setDialog(false)} className="drawer">
          <MuscleContent muscle={muscleById[selected]} compact />
          <button className="btn primary w-full" onClick={() => { setDialog(false); navigate(`/muscles/${selected}`) }}>
            打开完整肌肉页面
            <ArrowRight size={16} />
          </button>
        </Modal>
      )}
    </>
  )
}
export function MuscleDetail() {
  const { id = '' } = useParams()
  const muscle = muscleById[id]
  const navigate = useNavigate()
  if (!muscle)
    return <Empty title="没有找到这块肌肉"><Link to="/muscles" className="btn primary">返回图解</Link></Empty>
  const view: View = bodyShapes.front.some(s => s.id === id) ? 'front' : bodyShapes.back.some(s => s.id === id) ? 'back' : 'side'
  return (
    <>
      <Link to="/muscles" className="back-link">
        <ArrowLeft size={16} />
        肌肉图解
      </Link>
      <div className="detail-layout">
        <aside className="panel sticky-detail">
          <BodyMap view={view} selected={[id]} onSelect={next => navigate(`/muscles/${next}`)} />
          <small>{muscle.deep ? '深层肌肉无法在此浅层图中直接显示，请参考文字与来源。' : '点击图中其他肌肉继续探索'}</small>
        </aside>
        <MuscleContent muscle={muscle} />
      </div>
    </>
  )
}
