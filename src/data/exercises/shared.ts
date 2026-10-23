import type { Exercise, Level } from '../../types'

export type ExerciseRow = [id: string, name: string, english: string, level: Level, equipment: string, primary: string, secondary: string, pose: string, steps: string, tips: string, mistakes: string, regression: string, progression: string, timed?: boolean, source?: string]
export function createExercises(category: string, rows: ExerciseRow[]): Exercise[] {
  return rows.map(([id, name, english, level, equipment, primary, secondary, pose, steps, tips, mistakes, regression, progression, timed, source]) => {
    const explosive = category === '爆发力'
    const mobility = category === '灵活性'
    const endurance = ['步法敏捷', '体能'].includes(category)
    return {
      id,
      name,
      english,
      category,
      level,
      equipment,
      primaryMuscles: primary.split(','),
      secondaryMuscles: secondary ? secondary.split(',') : [],
      techniqueIds: ['下肢力量', '爆发力', '步法敏捷', '体能'].includes(category) ? ['lunge', 'split-step', 'side-step', 'jump'] : category === '前臂手腕' ? ['forehand', 'backhand', 'net'] : ['forehand', 'jump'],
      steps: steps.split('|'),
      tips,
      mistakes,
      regression,
      progression,
      pose,
      timed: !!timed,
      seconds: mobility ? 30 : endurance ? 30 : 35,
      prescription: explosive
        ? { 入门: '先练低幅度落地；不做高阶跳跃', 进阶: '2–3 组 × 4–6 次；组间休息 90–120 秒', 高阶: '3–4 组 × 4–6 次；每次保证质量，不练到力竭' }
        : mobility
          ? { 入门: '1–2 组 × 20 秒/侧，无痛范围', 进阶: '2 组 × 30 秒/侧，不弹震', 高阶: '2 组 × 30 秒/侧，不追求痛感' }
          : timed
            ? { 入门: '2 组 × 20 秒；休息 60 秒', 进阶: '3 组 × 30 秒；休息 60–90 秒', 高阶: '3 组 × 40 秒；保持动作质量' }
            : { 入门: '2 组 × 6–8 次；休息 60–90 秒', 进阶: '3 组 × 8–12 次；休息 60–90 秒', 高阶: '3–4 组 × 6–12 次；按负荷调整，留 2 次余力' },
      sources: [source || (explosive ? 'nsca' : endurance ? 'bwf' : 'ace')],
    }
  })
}
