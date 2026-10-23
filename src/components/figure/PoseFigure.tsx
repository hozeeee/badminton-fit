import type { Pose, PosePair } from '../../data/poses'
import type { Exercise } from '../../types'
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { useEffect, useState } from 'react'
import { muscleById } from '../../data/muscles'
import { poseForExercise } from '../../data/poses'

const BODY_LENGTHS = { head: 35, torso: 69, upperArm: 42, forearm: 41, thigh: 55, shank: 55 } as const
const segments: [number, number, string, number, boolean][] = [
  [2, 5, 'thigh', 18, true],
  [5, 6, 'calf', 13, true],
  [1, 9, 'arm', 12, true],
  [9, 10, 'forearm', 9, true],
  [1, 2, 'torso', 26, false],
  [2, 3, 'thigh', 18, false],
  [3, 4, 'calf', 13, false],
  [1, 7, 'arm', 12, false],
  [7, 8, 'forearm', 9, false],
]
const limbSegments = [[0, 1, BODY_LENGTHS.head], [1, 2, BODY_LENGTHS.torso], [1, 7, BODY_LENGTHS.upperArm], [7, 8, BODY_LENGTHS.forearm], [1, 9, BODY_LENGTHS.upperArm], [9, 10, BODY_LENGTHS.forearm], [2, 3, BODY_LENGTHS.thigh], [3, 4, BODY_LENGTHS.shank], [2, 5, BODY_LENGTHS.thigh], [5, 6, BODY_LENGTHS.shank]] as const

function lerp(a: number, b: number, progress: number) {
  return a + (b - a) * progress
}
function angle(a: Pose[number], b: Pose[number]) {
  return Math.atan2(b[1] - a[1], b[0] - a[0])
}
function angleAt(pose: Pose, from: number, to: number) {
  return angle(pose[from], pose[to])
}
function angleLerp(start: number, end: number, progress: number) {
  const turn = Math.atan2(Math.sin(end - start), Math.cos(end - start))
  return start + turn * progress
}
function from(origin: Pose[number], direction: number, length: number): Pose[number] {
  return [origin[0] + Math.cos(direction) * length, origin[1] + Math.sin(direction) * length]
}
function rawPoint(pair: PosePair, index: number, progress: number): Pose[number] {
  if (pair.locked?.includes(index))
    return [...pair.start[index]]
  const start = pair.start[index]
  const end = pair.end[index]
  const lift = index === 4 || index === 6 ? (pair.lifts?.[index] ?? 0) * 4 * progress * (1 - progress) : 0
  return [lerp(start[0], end[0], progress), lerp(start[1], end[1], progress) - lift]
}
function solveLimb(root: Pose[number], target: Pose[number], guide: Pose[number], first: number, second: number): [Pose[number], Pose[number]] {
  const dx = target[0] - root[0]
  const dy = target[1] - root[1]
  const rawDistance = Math.hypot(dx, dy)
  const distance = Math.min(first + second - 0.01, Math.max(Math.abs(first - second) + 0.01, rawDistance))
  const ux = rawDistance ? dx / rawDistance : 1
  const uy = rawDistance ? dy / rawDistance : 0
  const end: Pose[number] = [root[0] + ux * distance, root[1] + uy * distance]
  const along = (first ** 2 - second ** 2 + distance ** 2) / (2 * distance)
  const across = Math.sqrt(Math.max(0, first ** 2 - along ** 2))
  const base: Pose[number] = [root[0] + ux * along, root[1] + uy * along]
  const candidates: [Pose[number], Pose[number]] = [
    [base[0] - uy * across, base[1] + ux * across],
    [base[0] + uy * across, base[1] - ux * across],
  ]
  const knee = Math.hypot(candidates[0][0] - guide[0], candidates[0][1] - guide[1]) <= Math.hypot(candidates[1][0] - guide[0], candidates[1][1] - guide[1]) ? candidates[0] : candidates[1]
  return [knee, end]
}

/**
 * 以固定人体肢段长度插值。腿部用两段式逆运动学求膝点，避免旋转时肢体缩短，
 * locked 接触点在完整动作周期内保持原位，迈步脚则沿抬脚弧线移动。
 */
export function interpolatePose(pair: PosePair, value: number): Pose {
  const progress = Math.min(1, Math.max(0, value))
  const points = Array.from({ length: 11 }, () => [0, 0] as Pose[number]) as unknown as Pose
  points[2] = rawPoint(pair, 2, progress)
  points[1] = from(points[2], angleLerp(angleAt(pair.start, 2, 1), angleAt(pair.end, 2, 1), progress), BODY_LENGTHS.torso)
  points[0] = from(points[1], angleLerp(angleAt(pair.start, 1, 0), angleAt(pair.end, 1, 0), progress), BODY_LENGTHS.head)
  for (const [elbow, hand] of [[7, 8], [9, 10]] as const) {
    if (pair.locked?.includes(hand)) {
      ;[points[elbow], points[hand]] = solveLimb(points[1], rawPoint(pair, hand, progress), rawPoint(pair, elbow, progress), BODY_LENGTHS.upperArm, BODY_LENGTHS.forearm)
    }
    else {
      points[elbow] = from(points[1], angleLerp(angleAt(pair.start, 1, elbow), angleAt(pair.end, 1, elbow), progress), BODY_LENGTHS.upperArm)
      points[hand] = from(points[elbow], angleLerp(angleAt(pair.start, elbow, hand), angleAt(pair.end, elbow, hand), progress), BODY_LENGTHS.forearm)
    }
  }
  for (const [knee, ankle] of [[3, 4], [5, 6]] as const) {
    const guide = rawPoint(pair, knee, progress)
    ;[points[knee], points[ankle]] = solveLimb(points[2], rawPoint(pair, ankle, progress), guide, BODY_LENGTHS.thigh, BODY_LENGTHS.shank)
  }
  return points
}

export function poseSegmentLengths(pose: Pose) {
  return limbSegments.map(([a, b]) => Math.hypot(pose[a][0] - pose[b][0], pose[a][1] - pose[b][1]))
}

function Face({ points, facing }: { points: Pose, facing: PosePair['facing'] }) {
  const head = points[0]
  const rotation = (angle(points[1], head) + Math.PI / 2) * 180 / Math.PI
  const sign = facing === 'left' ? -1 : 1
  return (
    <g transform={`rotate(${rotation} ${head[0]} ${head[1]})`}>
      <circle cx={head[0]} cy={head[1]} r="15" fill="var(--figure-skin)" stroke="var(--figure-outline)" strokeWidth="2" />
      <path d={`M${head[0] - 13} ${head[1] - 7}Q${head[0]} ${head[1] - 20} ${head[0] + 13} ${head[1] - 7}`} stroke="var(--figure-outline)" strokeWidth="5" fill="none" strokeLinecap="round" />
      {facing === 'front'
        ? (
            <>
              <circle cx={head[0] - 5} cy={head[1] - 1} r="1.7" fill="var(--figure-outline)" />
              <circle cx={head[0] + 5} cy={head[1] - 1} r="1.7" fill="var(--figure-outline)" />
              <path d={`M${head[0] - 4} ${head[1] + 7}Q${head[0]} ${head[1] + 10} ${head[0] + 4} ${head[1] + 7}`} stroke="var(--figure-outline)" strokeWidth="1.5" fill="none" />
            </>
          )
        : (
            <>
              <circle cx={head[0] + sign * 5} cy={head[1] - 2} r="1.8" fill="var(--figure-outline)" />
              <path d={`M${head[0] + sign * 12} ${head[1] - 1}l${sign * 5} 4-5 2`} stroke="var(--figure-outline)" strokeWidth="1.8" fill="var(--figure-skin)" strokeLinejoin="round" />
              <circle cx={head[0] - sign * 11} cy={head[1] + 1} r="2.6" fill="none" stroke="var(--figure-outline)" strokeWidth="1.4" />
            </>
          )}
    </g>
  )
}

export function PoseFigure({ pair, progress = 1, exercise }: { pair: PosePair, progress?: number, exercise?: Exercise }) {
  const points = interpolatePose(pair, progress)
  const targets = new Set(exercise?.primaryMuscles.map(id => muscleById[id].region))
  const active = (part: string) => part === 'torso' ? targets.has('核心') || targets.has('胸背') : part === 'thigh' ? targets.has('大腿') || targets.has('臀髋') : part === 'calf' ? targets.has('小腿') : part === 'arm' ? targets.has('肩部') || targets.has('上臂') : targets.has('前臂')
  const footStart = pair.facing === 'left' ? -14 : pair.facing === 'right' ? -5 : -10
  const footEnd = pair.facing === 'left' ? 5 : pair.facing === 'right' ? 14 : 10
  return (
    <svg className="pose-figure" viewBox="0 0 300 280" role="img" aria-label={`${exercise?.name || '训练'}动作简化示意：${pair.label}`}>
      <path d="M30 253H270" stroke="var(--border)" strokeWidth="2" />
      <text x="270" y="22" textAnchor="end" fill="var(--muted)" fontSize="10" fontWeight="700" letterSpacing="1.2">{pair.view === 'front' ? '正面' : pair.facing === 'left' ? '侧面  ←' : '侧面  →'}</text>
      {pair.prop === 'bench' && (
        <g fill="var(--border)">
          <rect x={exercise?.id === 'copenhagen' ? 195 : 35} y="202" width="56" height="9" rx="3" />
          <path d="M40 211V251M85 211V251" stroke="var(--border)" strokeWidth="5" />
        </g>
      )}
      {pair.prop === 'wall' && <path d="M82 30V253" stroke="var(--border)" strokeWidth="6" />}
      {pair.prop === 'box' && <rect x="165" y="206" width="84" height="46" rx="3" fill="var(--border)" />}
      {pair.prop === 'bar' && <path d="M70 16H216M76 16V255M210 16V255" stroke="var(--border)" strokeWidth="5" />}
      {pair.prop === 'band' && <path d={`M35 116L${points[8].join(' ')}`} stroke="var(--amber)" strokeWidth="3" />}
      {segments.map(([a, b, part, width, far]) => (
        <g key={`${a}-${b}`} opacity={far ? 0.48 : 1}>
          <line x1={points[a][0]} y1={points[a][1]} x2={points[b][0]} y2={points[b][1]} stroke="var(--figure-outline)" strokeWidth={width + 3} strokeLinecap="round" />
          <line x1={points[a][0]} y1={points[a][1]} x2={points[b][0]} y2={points[b][1]} stroke={active(part) ? 'var(--accent)' : part === 'torso' ? 'var(--figure-shirt)' : 'var(--figure-skin)'} strokeWidth={width} strokeLinecap="round" />
        </g>
      ))}
      <line x1={points[0][0]} y1={points[0][1]} x2={points[1][0]} y2={points[1][1]} stroke="var(--figure-outline)" strokeWidth="12" strokeLinecap="round" />
      <line x1={points[0][0]} y1={points[0][1]} x2={points[1][0]} y2={points[1][1]} stroke="var(--figure-skin)" strokeWidth="9" strokeLinecap="round" />
      <Face points={points} facing={pair.facing} />
      {[4, 6].map(i => <path key={i} d={`M${points[i][0] + footStart} ${points[i][1]}H${points[i][0] + footEnd}`} stroke="var(--figure-outline)" strokeWidth="9" strokeLinecap="round" />)}
      {pair.prop === 'weight' && <g transform={`translate(${points[8][0]} ${points[8][1]})`} stroke="var(--figure-outline)" strokeWidth="5"><path d="M-9 0H9M-10-6V6M10-6V6" /></g>}
    </svg>
  )
}
export function PoseAnimator({ exercise }: { exercise: Exercise }) {
  const pair = poseForExercise(exercise.id, exercise.pose)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!playing)
      return
    const start = performance.now()
    let frame: number
    const animate = (now: number) => { setProgress((1 - Math.cos((now - start) / 1600 * Math.PI)) / 2); frame = requestAnimationFrame(animate) }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [playing])
  return (
    <div className="animation-panel">
      <div className="figure-caption">
        <span className="eyebrow">MOVEMENT STUDY</span>
        <span className="tag">
          <i className="dot" />
          目标部位示意
        </span>
      </div>
      <PoseFigure pair={pair} progress={progress} exercise={exercise} />
      <p className="text-center">{pair.label}</p>
      <div className="animation-controls">
        <button className="icon-btn" aria-label="起始姿态" onClick={() => { setPlaying(false); setProgress(0) }}><SkipBack size={17} /></button>
        <button className="play-btn" aria-label={playing ? '暂停动画' : '播放示意动画'} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={19} /> : <Play size={19} />}</button>
        <button className="icon-btn" aria-label="结束姿态" onClick={() => { setPlaying(false); setProgress(1) }}><SkipForward size={17} /></button>
        <input type="range" min="0" max="1" step="0.01" value={progress} aria-label="动作阶段" onChange={(e) => { setPlaying(false); setProgress(Number(e.target.value)) }} />
      </div>
      <small>简化姿态插值，不代表真实三维轨迹或训练节奏。以文字、来源教学和现场指导为准。</small>
    </div>
  )
}
