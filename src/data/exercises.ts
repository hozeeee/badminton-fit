import { core } from './exercises/core'
import { lower } from './exercises/lower'
import { mobility } from './exercises/mobility'
import { agility, cardio, power } from './exercises/power'
import { upper, wrist } from './exercises/upper'

export const exercises = [...lower, ...power, ...core, ...upper, ...wrist, ...agility, ...cardio, ...mobility]
const split = exercises.find(e => e.id === 'bulgarian')!
split.video = { bv: 'BV1C14y1B7uA', title: '保加利亚分腿蹲最常见的 3 个错误', author: '戴夫健身 · Squat University 搬运', note: '非官方账号；公开检索确认标题与 BV，播放器可能受 B 站权限限制。' }
export const exerciseById = Object.fromEntries(exercises.map(e => [e.id, e]))
export const categories = [...new Set(exercises.map(e => e.category))]
export const levels = ['入门', '进阶', '高阶'] as const
export const equipmentList = [...new Set(exercises.map(e => e.equipment))]
export function exercisesForMuscle(id: string) {
  return exercises.filter(e => e.primaryMuscles.includes(id) || e.secondaryMuscles.includes(id))
}
