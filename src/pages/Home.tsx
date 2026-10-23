import { ArrowRight, Check, ChevronRight, ShieldCheck, Sparkles, Target, Timer } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ShuttleIcon } from '../app/Layout'
import { BodyMap } from '../components/body/BodyMap'
import { ExerciseCard, PlanCard, SectionTitle } from '../components/ui'
import { exercises } from '../data/exercises'
import { muscles } from '../data/muscles'
import { presetPlans } from '../data/plans'
import { useStore } from '../store'
import { dateKey, schedule } from '../utils/dates'

function CourtArt() {
  return (
    <svg className="court-art" viewBox="0 0 500 420" role="img" aria-label="羽毛球运动员在球场挥拍的原创插画">
      <defs>
        <linearGradient id="courtBg" x2="0.8" y2="1">
          <stop stopColor="#d7e5c0" />
          <stop offset="1" stopColor="#a7c7a5" />
        </linearGradient>
        <pattern id="courtGrain" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.55" fill="#31664e" opacity="0.12" /></pattern>
      </defs>
      <rect width="500" height="420" fill="url(#courtBg)" />
      <rect width="500" height="420" fill="url(#courtGrain)" />
      <circle cx="291" cy="113" r="110" fill="#f6f9da" opacity="0.4" />
      <g fill="none" stroke="#fbffe9" strokeWidth="2" opacity="0.7">
        <path d="M-60 329L308 139L571 273L224 476Z M-16 352L333 173M33 377L383 199M89 405L432 225M70 262L351 409M169 211L448 362 M-60 329L203 464" />
        <path d="M70 262L371 97M371 97L374 212" strokeDasharray="4 4" />
      </g>
      <ellipse cx="263" cy="331" rx="90" ry="15" fill="#366249" opacity="0.2" />
      <g stroke="#244a3b" strokeLinecap="round" strokeLinejoin="round">
        <path d="M224 226L186 278L142 299M247 229L286 265L324 306" fill="none" strokeWidth="23" />
        <path d="M184 278L145 299M285 266L324 305" stroke="#d6a77d" strokeWidth="17" />
        <path d="M137 300l-17 9 27 9 15-9M323 305l-3 12 34 7 2-8" strokeWidth="7" fill="#fff9de" />
        <path d="M225 128Q206 150 209 184L216 229L251 237L261 185L256 146Z" fill="#1b654c" strokeWidth="3" />
        <path d="M221 179L240 169L255 158" stroke="#c4dc8f" strokeWidth="4" fill="none" />
        <path d="M228 132L194 171L165 156" strokeWidth="15" fill="none" stroke="#d6a77d" />
        <path d="M251 142L280 110L276 66" strokeWidth="15" fill="none" stroke="#d6a77d" />
        <path d="M238 122L243 107" stroke="#d6a77d" strokeWidth="15" />
        <path d="M226 88Q231 72 250 77Q268 81 267 98L259 111L239 115L229 107Z" fill="#d6a77d" strokeWidth="2" />
        <path d="M226 93Q218 77 239 70Q260 68 268 84L255 89L245 84L239 99Z" fill="#244a3b" strokeWidth="2" />
        <path d="M276 65L291 34" strokeWidth="5" />
        <ellipse cx="307" cy="10" rx="17" ry="26" transform="rotate(28 307 10)" fill="none" strokeWidth="4" />
        <path d="M288 6L320 18M292-2L325 11M298-10L325 1M299-13L285 14M309-15L292 24M318-10L301 29" strokeWidth="0.8" opacity="0.5" />
      </g>
      <g transform="translate(382 83) rotate(-35)" fill="none" stroke="#fbffe9" strokeWidth="2">
        <path d="M0 20L-9-3L0 1L5-10L12 0L24-2L14 24Z" />
        <path d="M0 20Q-10 32 2 37Q12 39 14 24Z" />
        <path d="M0 1L3 20M12 0L9 22" />
      </g>
      <path d="M356 143Q319 156 298 187" stroke="#fbffe9" strokeWidth="1.5" fill="none" strokeDasharray="4 7" />
      <text x="34" y="386" fill="#244a3b" fontSize="11" letterSpacing="4">MOVE WITH PURPOSE.</text>
    </svg>
  )
}
export function Home() {
  const { enrollment, plans, checkins } = useStore()
  const current = [...presetPlans, ...plans].find(p => p.id === enrollment?.planId)
  const today = dateKey()
  const due = current && enrollment ? schedule(current, enrollment).find(s => s.date >= today) : null
  return (
    <>
      <div className="home-intro">
        <span>
          <i className="dot" />
          {' '}
          YOUR NEXT LEVEL STARTS HERE
        </span>
        <Link to="/about">
          <ShieldCheck size={15} />
          循证内容，科学训练
          <ChevronRight size={14} />
        </Link>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-label">
            <ShuttleIcon />
            <span>不止打球，更懂训练</span>
          </div>
          <h1>
            练好每一块肌肉，
            <br />
            打好
            <span className="hero-emphasis">每一拍。</span>
          </h1>
          <p>
            从身体的力量链，到球场上的每一次移动。
            <br />
            理解肌肉，找到方法，让进步有迹可循。
          </p>
          <div className="hero-actions">
            <Link to="/muscles" className="btn primary">
              探索肌肉图解
              <ArrowRight size={18} />
            </Link>
            <Link to="/plans" className="btn secondary">找到我的计划</Link>
          </div>
          <div className="hero-facts">
            <span>
              <Check size={14} />
              三视角互动图解
            </span>
            <span>
              <Check size={14} />
              专业资料参考
            </span>
            <span>
              <Check size={14} />
              本地训练打卡
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <CourtArt />
          <div className="floating-note">
            <span className="note-icon"><ActivityMark /></span>
            <div>
              <strong>好技术，从好身体开始</strong>
              <small>STRENGTH → MOVEMENT → PERFORMANCE</small>
            </div>
          </div>
          <span className="hero-corner">01 / TRAIN SMART</span>
        </div>
      </section>
      <div className="overview-strip">
        <div>
          <strong>
            {muscles.length}
            <span>组</span>
          </strong>
          <p>肌肉与功能图解</p>
        </div>
        <div>
          <strong>
            {exercises.length}
            <span>种</span>
          </strong>
          <p>体能训练动作</p>
        </div>
        <div>
          <strong>
            {presetPlans.length}
            <span>套</span>
          </strong>
          <p>不同阶段训练计划</p>
        </div>
        <div className="strip-quote">
          <Target size={25} />
          <span>
            不盲练，不蛮练。
            <br />
            <strong>每一次训练，都有方向。</strong>
          </span>
        </div>
      </div>
      <section className="home-discover">
        <div className="muscle-feature">
          <div className="feature-copy">
            <span className="eyebrow">01 / KNOW YOUR BODY</span>
            <h2>
              你的每一拍，
              <br />
              都不只靠手腕。
            </h2>
            <p>肩部、核心、下肢协同发力。点击肌肉，了解它的功能、专项作用与训练方法。</p>
            <div className="tags">
              <span className="tag">正面</span>
              <span className="tag">侧面</span>
              <span className="tag">背面</span>
            </div>
            <Link to="/muscles" className="text-link">
              打开身体的力量地图
              <ArrowRight size={17} />
            </Link>
          </div>
          <Link to="/muscles" className="feature-body" aria-label="探索肌肉地图"><BodyMap selected={['deltoid', 'pectoralis', 'rectus-femoris']} /></Link>
          <span className="muscle-label label-shoulder">
            三角肌
            <i />
          </span>
          <span className="muscle-label label-thigh">
            股四头肌
            <i />
          </span>
        </div>
        <div className="today-feature">
          <div className="feature-icon"><CalendarIcon /></div>
          <span className="eyebrow">02 / SHOW UP FOR YOURSELF</span>
          <h2>{current ? '你的计划，正在进行' : '让下一次进步，\n从今天开始。'}</h2>
          <p>{current ? `${current.name} · ${due ? `下一次：${due.date}` : '本周期日程已结束'}` : '选择适合你的计划，用小而持续的训练，积累球场上的大改变。'}</p>
          <div className="week-preview">
            {['一', '二', '三', '四', '五', '六', '日'].map((day, i) => (
              <span key={day} className={(current?.weekdays || [1, 4]).includes((i + 1) % 7) ? 'on' : ''}>
                {day}
                <i>{(current?.weekdays || [1, 4]).includes((i + 1) % 7) ? <Check size={13} /> : '·'}</i>
              </span>
            ))}
          </div>
          <small>{current ? `已记录 ${checkins.filter(c => c.planId === current.id).length} 次训练` : '示例安排 · 训练与恢复同样重要'}</small>
          <Link to={current ? '/checkin' : '/plans'} className="btn primary">
            {current ? '查看训练与打卡' : '选择训练计划'}
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <section>
        <SectionTitle title="从一个动作，开始变强" subtitle="打稳基础，让力量真正服务于羽毛球。" to="/exercises" />
        <div className="exercise-grid home-exercises">{['bulgarian', 'wall-sit', 'dead-bug', 'external-rotation'].map((id, i) => <ExerciseCard key={id} exercise={exercises.find(e => e.id === id)!} index={i} />)}</div>
      </section>
      <section>
        <SectionTitle title="找到你的训练节奏" subtitle="从入门到进阶，不同时间，同样认真。" to="/plans" />
        <div className="plan-grid">{[presetPlans[0], presetPlans[3], presetPlans[6]].map((p, i) => <PlanCard key={p.id} plan={p} index={i} />)}</div>
      </section>
      <div className="evidence-banner">
        <span className="evidence-icon"><ShieldCheck size={27} /></span>
        <div>
          <h3>有依据，才有底气。</h3>
          <p>参考 Kenhub、ACE、NSCA、BWF 与公开学术文献。训练关联不等于疗效承诺。</p>
        </div>
        <Link to="/about" className="text-link">
          查看参考资料
          <ArrowRight size={16} />
        </Link>
      </div>
    </>
  )
}
function ActivityMark() { return <Sparkles size={22} /> }
function CalendarIcon() { return <Timer size={24} /> }
