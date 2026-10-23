import { describe, expect, it } from 'vitest'
import { bodyShapes, figures } from '../src/components/body/shapes'
import { interpolatePose, poseSegmentLengths } from '../src/components/figure/PoseFigure'
import { evidence } from '../src/data/evidence'
import { exerciseById, exercises } from '../src/data/exercises'
import { muscleById, muscles } from '../src/data/muscles'
import { presetPlans } from '../src/data/plans'
import { poseForExercise } from '../src/data/poses'
import { sourceById, sources } from '../src/data/sources'
import { techniqueById, techniques } from '../src/data/techniques'
import { planMinutes, schedule } from '../src/utils/dates'

function expectUnique(ids: string[]) {
  expect(new Set(ids).size).toBe(ids.length)
}

describe('内容数据完整性', () => {
  it('核心数据 ID 唯一且数量达到内容目标', () => {
    expectUnique(muscles.map(item => item.id))
    expectUnique(exercises.map(item => item.id))
    expectUnique(techniques.map(item => item.id))
    expectUnique(sources.map(item => item.id))
    expectUnique(presetPlans.map(item => item.id))
    expect(muscles.length).toBeGreaterThanOrEqual(30)
    expect(exercises.length).toBeGreaterThanOrEqual(60)
    expect(presetPlans).toHaveLength(8)
  })

  it('肌肉、技术与来源引用均可解析', () => {
    for (const muscle of muscles) {
      expect(muscle.name).not.toBe('')
      expect(muscle.attachment).not.toBe('')
      expect(muscle.action).not.toBe('')
      expect(muscle.techniqueIds.length).toBeGreaterThan(0)
      muscle.techniqueIds.forEach(id => expect(techniqueById[id], `${muscle.id} 引用了未知技术 ${id}`).toBeDefined())
      muscle.sources.forEach(id => expect(sourceById[id], `${muscle.id} 引用了未知来源 ${id}`).toBeDefined())
    }
    for (const technique of techniques) {
      technique.muscles.forEach(id => expect(muscleById[id], `${technique.id} 引用了未知肌肉 ${id}`).toBeDefined())
      technique.sources.forEach(id => expect(sourceById[id], `${technique.id} 引用了未知来源 ${id}`).toBeDefined())
    }
  })

  it('每个浅层肌肉都有 SVG 区块，深层肌肉明确保留在列表', () => {
    const shapeIds = new Set(Object.values(bodyShapes).flat().map(shape => shape.id))
    for (const muscle of muscles) {
      if (!muscle.deep)
        expect(shapeIds.has(muscle.id), `${muscle.id} 缺少 SVG 区块`).toBe(true)
    }
    for (const view of Object.keys(bodyShapes) as Array<keyof typeof bodyShapes>)
      expectUnique(bodyShapes[view].map(shape => shape.id))
  })

  it('每个动作都有可解析关联、说明、姿态与来源', () => {
    for (const exercise of exercises) {
      expect(exercise.steps.length, `${exercise.id} 缺少步骤`).toBeGreaterThan(0)
      expect(exercise.sources.length, `${exercise.id} 缺少来源`).toBeGreaterThan(0)
      expect(exercise.prescription.入门).not.toBe('')
      expect(exercise.prescription.进阶).not.toBe('')
      expect(exercise.prescription.高阶).not.toBe('')
      exercise.primaryMuscles.forEach(id => expect(muscleById[id], `${exercise.id} 引用了未知肌肉 ${id}`).toBeDefined())
      exercise.secondaryMuscles.forEach(id => expect(muscleById[id], `${exercise.id} 引用了未知肌肉 ${id}`).toBeDefined())
      exercise.techniqueIds.forEach(id => expect(techniqueById[id], `${exercise.id} 引用了未知技术 ${id}`).toBeDefined())
      exercise.sources.forEach(id => expect(sourceById[id], `${exercise.id} 引用了未知来源 ${id}`).toBeDefined())
      const pose = poseForExercise(exercise.id, exercise.pose)
      expect(pose, `${exercise.id} 引用了未知姿态 ${exercise.pose}`).toBeDefined()
      expect(pose.start).toHaveLength(11)
      expect(pose.end).toHaveLength(11)
    }
  })

  it('姿态插值保持人体比例并锁定支撑点', () => {
    for (const exercise of exercises) {
      const pair = poseForExercise(exercise.id, exercise.pose)
      const frames = [0, 0.25, 0.5, 0.75, 1].map(progress => interpolatePose(pair, progress))
      const referenceLengths = poseSegmentLengths(frames[0])
      for (const frame of frames) {
        poseSegmentLengths(frame).forEach((length, index) => expect(length, `${exercise.id} 第 ${index} 肢段长度发生变化`).toBeCloseTo(referenceLengths[index], 5))
      }
      for (const index of pair.locked ?? []) {
        if (![4, 6, 8, 10].includes(index))
          continue
        const anchor = frames[0][index]
        for (const frame of frames) {
          expect(frame[index][0], `${exercise.id} 支撑点 ${index} 横向滑动`).toBeCloseTo(anchor[0], 4)
          expect(frame[index][1], `${exercise.id} 支撑点 ${index} 纵向滑动`).toBeCloseTo(anchor[1], 4)
        }
      }
    }
  })

  it('预设计划引用有效动作并能生成完整日程', () => {
    for (const plan of presetPlans) {
      expect(plan.days.length).toBeGreaterThan(0)
      expect(plan.weekdays.length).toBeGreaterThan(0)
      for (const day of plan.days) {
        expect(day.items.length).toBeGreaterThan(0)
        day.items.forEach(item => expect(exerciseById[item.exerciseId], `${plan.id} 引用了未知动作 ${item.exerciseId}`).toBeDefined())
      }
      const [minimum, maximum] = planMinutes(plan)
      expect(minimum).toBeGreaterThanOrEqual(10)
      expect(maximum).toBeLessThanOrEqual(90)
      expect(schedule(plan, { planId: plan.id, start: '2025-01-06' })).toHaveLength(plan.weeks * plan.weekdays.length)
    }
  })

  it('参考资料使用可访问协议并提供说明', () => {
    for (const source of sources) {
      expect(source.url).toMatch(/^https:\/\//)
      expect(source.note).not.toBe('')
    }
  })

  it('研究证据引用可解析且只指向研究类来源', () => {
    expectUnique(evidence.map(item => item.id))
    for (const item of evidence) {
      expect(sourceById[item.sourceId], `${item.id} 引用了未知来源 ${item.sourceId}`).toBeDefined()
      expect(sourceById[item.sourceId].kind).toBe('研究')
      expect(item.finding).not.toBe('')
      expect(item.limit).not.toBe('')
      item.muscles.forEach(id => expect(muscleById[id], `${item.id} 引用了未知肌肉 ${id}`).toBeDefined())
      item.techniqueIds.forEach(id => expect(techniqueById[id], `${item.id} 引用了未知技术 ${id}`).toBeDefined())
    }
  })

  it('三个视角都有人体轮廓与头部路径', () => {
    for (const view of Object.keys(bodyShapes) as Array<keyof typeof bodyShapes>) {
      expect(figures[view].body).toMatch(/^M[\d\s.CLZ-]+$/)
      expect(figures[view].head).toMatch(/^M/)
    }
  })
})
