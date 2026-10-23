import Fuse from 'fuse.js'
import { Activity, ArrowRight, BookOpen, CalendarCheck, ChartNoAxesColumnIncreasing, Dumbbell, House, Monitor, Moon, Search, Sun } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Modal } from '../components/ui'
import { exercises } from '../data/exercises'
import { muscles } from '../data/muscles'
import { presetPlans } from '../data/plans'
import { techniques } from '../data/techniques'
import { storageWarning, useStore } from '../store'

export function ShuttleIcon() {
  return <svg viewBox="0 0 48 48" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m17 29-7-17 10 3 4-10 6 8 9-4-6 24Z M20 15l-2 12m12-14-5 16M17 29c-7 11 6 16 11 6Z" /></svg>
}
const nav = [{ to: '/', label: '概览', icon: House }, { to: '/muscles', label: '肌肉图解', icon: Activity }, { to: '/exercises', label: '训练动作', icon: Dumbbell }, { to: '/plans', label: '训练计划', icon: BookOpen }, { to: '/checkin', label: '训练打卡', icon: CalendarCheck }, { to: '/stats', label: '我的进步', icon: ChartNoAxesColumnIncreasing }]
export function Layout() {
  const { theme, setTheme } = useStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [online, setOnline] = useState(navigator.onLine)
  const location = useLocation()
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)')
    const update = () => document.documentElement.classList.toggle('dark', theme === 'dark' || theme === 'system' && media.matches)
    update(); media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [theme])
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(v => !v) } }
    const connected = () => setOnline(navigator.onLine)
    window.addEventListener('keydown', handler); window.addEventListener('online', connected); window.addEventListener('offline', connected)
    return () => { window.removeEventListener('keydown', handler); window.removeEventListener('online', connected); window.removeEventListener('offline', connected) }
  }, [])
  useEffect(() => { window.scrollTo(0, 0); setSearchOpen(false) }, [location.pathname])
  const ThemeIcon = theme === 'system' ? Monitor : theme === 'light' ? Sun : Moon
  return (
    <>
      <a href="#main" className="skip-link">跳到主内容</a>
      <header className="header">
        <div className="header-inner">
          <Link className="brand" to="/">
            <span className="brand-icon"><ShuttleIcon /></span>
            <span>
              羽练
              <small>BADMINTON FIT</small>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="主导航">{nav.slice(0, 5).map(n => <NavLink key={n.to} to={n.to} end={n.to === '/'}>{n.label}</NavLink>)}</nav>
          <div className="header-actions">
            <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="全局搜索">
              <Search size={17} />
              <span>搜索</span>
              <kbd>⌘ K</kbd>
            </button>
            <button className="icon-btn" title={`主题：${{ system: '跟随系统', light: '明亮', dark: '暗黑' }[theme]}`} aria-label="切换主题" onClick={() => setTheme(theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system')}><ThemeIcon size={19} /></button>
            <Link to="/stats" className="avatar" aria-label="我的进步">羽</Link>
          </div>
        </div>
      </header>
      {!online && <div className="offline-banner">离线模式 · 图解与打卡仍可用，外链和视频需要网络。</div>}
      {storageWarning && (
        <div className="offline-banner warning" role="alert">
          {storageWarning}
          {' '}
          <Link to="/about">备份数据</Link>
        </div>
      )}
      <main id="main" className="main"><Outlet /></main>
      <footer className="footer">
        <Link className="footer-brand" to="/">
          <ShuttleIcon />
          羽练 · 为每一次进步
        </Link>
        <span>理解身体，科学训练。</span>
        <Link to="/about">
          资料来源与数据设置
          <ArrowRight size={14} />
        </Link>
        <small>非医疗建议 · 数据仅保存在此浏览器</small>
      </footer>
      <nav className="mobile-nav" aria-label="移动端导航">
        {nav.map(n => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'}>
            <n.icon size={20} />
            <span>{n.label === '肌肉图解' ? '肌肉' : n.label === '训练动作' ? '动作' : n.label === '训练计划' ? '计划' : n.label === '训练打卡' ? '打卡' : n.label === '我的进步' ? '进步' : n.label}</span>
          </NavLink>
        ))}
      </nav>
      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
    </>
  )
}
function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const custom = useStore(s => s.plans)
  const navigate = useNavigate()
  const entries = useMemo(() => [
    ...muscles.map(m => ({ name: m.name, english: m.english, category: '肌肉', path: `/muscles/${m.id}` })),
    ...exercises.map(e => ({ name: e.name, english: e.english, category: e.category, path: `/exercises/${e.id}` })),
    ...[...presetPlans, ...custom].map(p => ({ name: p.name, english: '', category: '计划', path: `/plans/${p.id}` })),
    ...techniques.map(t => ({ name: t.name, english: t.english, category: '技术', path: `/techniques/${t.id}` })),
  ], [custom])
  const fuse = useMemo(() => new Fuse(entries, { keys: ['name', 'english', 'category'], threshold: 0.35 }), [entries])
  const results = query.trim() ? fuse.search(query.trim()).slice(0, 12).map(r => r.item) : entries.filter(e => ['保加利亚分腿蹲', '靠墙静蹲', '臀大肌', '三角肌'].includes(e.name))
  return (
    <Modal title="探索你的训练" onClose={onClose} className="search-modal">
      <div className="search-input">
        <Search size={20} />
        <input
          autoFocus
          placeholder="搜索肌肉、动作、计划或技术…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(0) }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setActive((active + (e.key === 'ArrowDown' ? 1 : Math.max(results.length - 1, 0))) % Math.max(results.length, 1)) }
            if (e.key === 'Enter' && results[active]) { onClose(); navigate(results[active].path) }
          }}
        />
      </div>
      <span className="eyebrow">{query ? `${results.length} 个搜索结果` : '推荐探索'}</span>
      <div className="search-results">
        {results.map((r, i) => (
          <button key={r.path} className={i === active ? 'active' : ''} onClick={() => { onClose(); navigate(r.path) }}>
            <span>
              <strong>{r.name}</strong>
              <small>{r.english || r.category}</small>
            </span>
            <span className="tag">{r.category}</span>
            <ArrowRight size={16} />
          </button>
        ))}
        {!results.length && <p className="muted">未找到匹配内容，可尝试英文名称或更短的关键词。</p>}
      </div>
      <small>↑ ↓ 选择 · Enter 打开 · Esc 关闭</small>
    </Modal>
  )
}
