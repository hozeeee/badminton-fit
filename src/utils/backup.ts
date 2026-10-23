import type { Backup, Checkin, Plan, PlanItem } from '../types'
import { exerciseById } from '../data/exercises'
import { presetPlans } from '../data/plans'
import { validDate } from './dates'

function record(value: unknown): value is Record<string, unknown> { return !!value && typeof value === 'object' && !Array.isArray(value) }
function integer(n: unknown, min: number, max: number): n is number { return Number.isInteger(n) && Number(n) >= min && Number(n) <= max }
function text(s: unknown, max: number): s is string { return typeof s === 'string' && s.length <= max }
function validItem(i: unknown): i is PlanItem {
  return record(i) && typeof i.exerciseId === 'string' && !!exerciseById[i.exerciseId] && integer(i.sets, 1, 20) && integer(i.reps, 0, 200) && integer(i.seconds, 0, 3600) && integer(i.rest, 0, 600) && (Number(i.reps) > 0 || Number(i.seconds) > 0)
}
export function validPlan(p: unknown): p is Plan {
  return record(p) && text(p.id, 100) && /^custom-[\w-]+$/.test(p.id) && text(p.name, 80) && !!p.name.trim() && text(p.description, 2000) && ['入门', '进阶', '高阶'].includes(String(p.level)) && integer(p.weeks, 1, 52)
    && Array.isArray(p.weekdays) && p.weekdays.length > 0 && p.weekdays.length <= 7 && p.weekdays.every(n => integer(n, 0, 6)) && new Set(p.weekdays).size === p.weekdays.length
    && Array.isArray(p.days) && p.days.length > 0 && p.days.length <= 7 && p.days.every(d => record(d) && text(d.name, 80) && Array.isArray(d.items) && d.items.length > 0 && d.items.length <= 40 && d.items.every(validItem) && new Set(d.items.map((i: PlanItem) => i.exerciseId)).size === d.items.length)
}
export function validateBackup(value: unknown): Backup {
  if (!record(value) || value.version !== 1)
    throw new Error('不支持的备份版本，请导入本站导出的 JSON。')
  if (!Array.isArray(value.plans) || value.plans.length > 100 || !value.plans.every(validPlan) || new Set(value.plans.map(p => p.id)).size !== value.plans.length)
    throw new Error('自定义计划格式、动作引用或数量无效。')
  const plans = [...presetPlans, ...value.plans]
  const planById = Object.fromEntries(plans.map(p => [p.id, p]))
  if (value.enrollment !== null && (!record(value.enrollment) || typeof value.enrollment.planId !== 'string' || !planById[value.enrollment.planId] || !validDate(value.enrollment.start)))
    throw new Error('当前计划或开始日期无效。')
  if (!Array.isArray(value.checkins) || value.checkins.length > 20000)
    throw new Error('打卡记录格式无效或数量过多。')
  for (const c of value.checkins) {
    if (!record(c) || !validDate(c.date) || typeof c.planId !== 'string' || !planById[c.planId] || !integer(c.dayIndex, 0, planById[c.planId].days.length - 1) || !integer(c.rpe, 1, 10) || !text(c.note, 2000) || !Array.isArray(c.completed) || !c.completed.length || !c.completed.every(validItem))
      throw new Error('打卡日期、计划引用、疲劳度或动作记录无效。')
    const ids = planById[c.planId].days[Number(c.dayIndex)].items.map(i => i.exerciseId)
    if (!c.completed.every((i: PlanItem) => ids.includes(i.exerciseId)) || new Set(c.completed.map((i: PlanItem) => i.exerciseId)).size !== c.completed.length)
      throw new Error('打卡动作不属于对应训练日或存在重复动作。')
  }
  const checkins = value.checkins as Checkin[]
  if (new Set(checkins.map(c => `${c.date}:${c.planId}`)).size !== checkins.length)
    throw new Error('备份包含重复打卡记录。')
  // 通过 JSON 往返去掉原型，只接收已校验的数据。
  return JSON.parse(JSON.stringify({ version: 1, plans: value.plans.map(p => ({ ...p, custom: true })), enrollment: value.enrollment, checkins })) as Backup
}
export function mergeBackups(current: Backup, incoming: Backup): Backup {
  const plans = new Map(current.plans.map(p => [p.id, p]))
  for (const p of incoming.plans) {
    if (plans.has(p.id) && JSON.stringify(plans.get(p.id)) !== JSON.stringify(p))
      throw new Error('存在同 ID 但内容不同的计划，请选择覆盖或先备份后手动调整。')
    plans.set(p.id, p)
  }
  const checkins = new Map(current.checkins.map(c => [`${c.date}:${c.planId}`, c]))
  incoming.checkins.forEach(c => checkins.set(`${c.date}:${c.planId}`, c))
  return validateBackup({ version: 1, plans: [...plans.values()], enrollment: current.enrollment || incoming.enrollment, checkins: [...checkins.values()] })
}
