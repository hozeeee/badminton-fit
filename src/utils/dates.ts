import type { Enrollment, Plan, PlanDay, PlanItem } from '../types'

export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
export function parseDate(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d, 12)
}
export function validDate(key: unknown): key is string {
  return typeof key === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(key) && dateKey(parseDate(key)) === key
}
export function addDays(key: string, n: number) {
  const date = parseDate(key)
  date.setDate(date.getDate() + n)
  return dateKey(date)
}
export function daysBetween(a: string, b: string) {
  const utc = (s: string) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d) }
  return Math.round((utc(b) - utc(a)) / 86400000)
}
export function schedule(plan: Plan, enrollment: Enrollment) {
  const result: { date: string, dayIndex: number }[] = []
  for (let i = 0; i < plan.weeks * 7; i++) {
    const date = addDays(enrollment.start, i)
    if (plan.weekdays.includes(parseDate(date).getDay()))
      result.push({ date, dayIndex: result.length % plan.days.length })
  }
  return result
}
export function itemSeconds(item: PlanItem) {
  // 次数动作按每次约 4 秒估算；单侧动作的 reps 是每组双侧合计。
  return item.sets * (item.seconds || item.reps * 4) + Math.max(0, item.sets - 1) * item.rest
}
export function dayMinutes(day: PlanDay) {
  return Math.round((day.items.reduce((sum, i) => sum + itemSeconds(i) + 30, 0) + 480) / 60)
}
export function planMinutes(plan: Plan) {
  const durations = plan.days.map(dayMinutes)
  return [Math.min(...durations), Math.max(...durations)]
}
export function streak(dates: string[], today = dateKey()) {
  const keys = new Set(dates)
  let cursor = keys.has(today) ? today : addDays(today, -1)
  let count = 0
  while (keys.has(cursor)) { count++; cursor = addDays(cursor, -1) }
  return count
}
export const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
