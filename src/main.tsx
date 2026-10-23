import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Link, Route, Routes } from 'react-router-dom'
import { Layout } from './app/Layout'
import { About } from './pages/About'
import { Checkin } from './pages/Checkin'
import { ExerciseDetail, Exercises, TechniqueDetail } from './pages/Exercises'
import { Home } from './pages/Home'
import { MuscleDetail, Muscles } from './pages/Muscles'
import { PlanEditor } from './pages/PlanEditor'
import { PlanDetail, Plans } from './pages/Plans'
import { Stats } from './pages/Stats'
import './app/styles.css'

function NotFound() {
  return (
    <div className="empty panel">
      <h1>页面走丢了</h1>
      <p>这个地址不存在，回到首页继续训练。</p>
      <Link className="btn primary" to="/">返回首页</Link>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="muscles" element={<Muscles />} />
          <Route path="muscles/:id" element={<MuscleDetail />} />
          <Route path="exercises" element={<Exercises />} />
          <Route path="exercises/:id" element={<ExerciseDetail />} />
          <Route path="techniques/:id" element={<TechniqueDetail />} />
          <Route path="plans" element={<Plans />} />
          <Route path="plans/new" element={<PlanEditor />} />
          <Route path="plans/:id" element={<PlanDetail />} />
          <Route path="checkin" element={<Checkin />} />
          <Route path="stats" element={<Stats />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
)
