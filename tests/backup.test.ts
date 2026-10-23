import type { Backup, Plan } from '../src/types'
import { describe, expect, it } from 'vitest'
import { mergeBackups, validateBackup } from '../src/utils/backup'

const plan: Plan = {
  id: 'custom-test',
  name: '测试计划',
  description: '用于验证备份格式。',
  level: '入门',
  weeks: 4,
  weekdays: [1, 4],
  days: [{ name: '训练 A', items: [{ exerciseId: 'wall-sit', sets: 2, reps: 0, seconds: 30, rest: 60 }] }],
  custom: true,
}

function backup(date = '2025-01-06'): Backup {
  return {
    version: 1,
    plans: [structuredClone(plan)],
    enrollment: { planId: plan.id, start: '2025-01-06' },
    checkins: [{ date, planId: plan.id, dayIndex: 0, completed: [{ exerciseId: 'wall-sit', sets: 2, reps: 0, seconds: 30, rest: 60 }], rpe: 5, note: '完成' }],
  }
}

describe('备份校验与合并', () => {
  it('接受合法备份并强制标记自定义计划', () => {
    const input = backup()
    delete input.plans[0].custom
    const parsed = validateBackup(input)
    expect(parsed.plans[0].custom).toBe(true)
    expect(parsed).not.toBe(input)
  })

  it('拒绝未知动作与无效日期', () => {
    const unknown = backup()
    unknown.plans[0].days[0].items[0].exerciseId = 'unknown'
    expect(() => validateBackup(unknown)).toThrow('自定义计划格式')

    const invalidDate = backup()
    invalidDate.checkins[0].date = '2025-02-30'
    expect(() => validateBackup(invalidDate)).toThrow('打卡日期')
  })

  it('拒绝同日同计划的重复打卡', () => {
    const input = backup()
    input.checkins.push(structuredClone(input.checkins[0]))
    expect(() => validateBackup(input)).toThrow('重复打卡')
  })

  it('合并时使用导入打卡并保留现有 enrollment', () => {
    const current = backup('2025-01-06')
    const incoming = backup('2025-01-06')
    current.enrollment = { planId: 'foundation', start: '2025-01-01' }
    incoming.checkins[0].rpe = 8
    const merged = mergeBackups(current, incoming)
    expect(merged.checkins).toHaveLength(1)
    expect(merged.checkins[0].rpe).toBe(8)
    expect(merged.enrollment).toEqual(current.enrollment)
  })

  it('拒绝同 ID 不同内容的计划合并', () => {
    const current = backup()
    const incoming = backup()
    incoming.plans[0].name = '冲突计划'
    expect(() => mergeBackups(current, incoming)).toThrow('同 ID')
  })
})
