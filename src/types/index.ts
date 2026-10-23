export type View = 'front' | 'back' | 'side'
export type Level = '入门' | '进阶' | '高阶'
export interface Muscle {
  id: string
  name: string
  english: string
  latin: string
  region: string
  attachment: string
  action: string
  sport: string
  prevention: string
  deep: boolean
  views: View[]
  techniqueIds: string[]
  sources: string[]
}
export interface Technique {
  id: string
  name: string
  english: string
  description: string
  muscles: string[]
  evidence: string
  sources: string[]
}
export interface Source {
  id: string
  title: string
  publisher: string
  url: string
  kind: '解剖' | '动作' | '专项' | '研究'
  note: string
}
export type EvidenceLevel = '实测肌电' | '生物力学综述' | '系统综述与荟萃分析'
export interface Evidence {
  id: string
  sourceId: string
  level: EvidenceLevel
  techniqueIds: string[]
  muscles: string[]
  finding: string
  limit: string
}
export interface Exercise {
  id: string
  name: string
  english: string
  category: string
  level: Level
  equipment: string
  primaryMuscles: string[]
  secondaryMuscles: string[]
  techniqueIds: string[]
  steps: string[]
  tips: string
  mistakes: string
  regression: string
  progression: string
  prescription: Record<Level, string>
  pose: string
  seconds: number
  timed: boolean
  sources: string[]
  video?: { bv: string, title: string, author: string, note: string }
}
export interface PlanItem { exerciseId: string, sets: number, reps: number, seconds: number, rest: number }
export interface PlanDay { name: string, items: PlanItem[] }
export interface Plan {
  id: string
  name: string
  description: string
  level: Level
  weeks: number
  weekdays: number[]
  days: PlanDay[]
  custom?: boolean
}
export interface Enrollment { planId: string, start: string }
export interface Checkin {
  date: string
  planId: string
  dayIndex: number
  completed: PlanItem[]
  rpe: number
  note: string
}
export interface Backup {
  version: 1
  plans: Plan[]
  enrollment: Enrollment | null
  checkins: Checkin[]
}
