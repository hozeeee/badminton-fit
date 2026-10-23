import type { Checkin, Enrollment, Plan } from '../types'
import { exerciseById } from '../data/exercises'
import { schedule } from './dates'

export function muscleSets(checkins: Checkin[]) {
  const heat: Record<string, number> = {}
  for (const c of checkins) {
    for (const item of c.completed) {
      const exercise = exerciseById[item.exerciseId]
      if (exercise.category === '灵活性')
        continue
      for (const id of exercise.primaryMuscles) heat[id] = (heat[id] || 0) + item.sets
    }
  }
  return heat
}
export function completionRate(plan: Plan, enrollment: Enrollment, checkins: Checkin[], today: string) {
  const due = schedule(plan, enrollment).filter(s => s.date <= today)
  let total = 0
  let done = 0
  for (const session of due) {
    const ids = plan.days[session.dayIndex].items.map(i => i.exerciseId)
    total += ids.length
    const checkin = checkins.find(c => c.planId === plan.id && c.date === session.date && c.dayIndex === session.dayIndex)
    done += checkin?.completed.filter(i => ids.includes(i.exerciseId)).length || 0
  }
  return total ? Math.round(done / total * 100) : 0
}
