import type { Level, Plan, PlanItem } from '../types'
import { exerciseById } from './exercises'

export function defaultItem(exerciseId: string, level: Level = '入门'): PlanItem {
  const e = exerciseById[exerciseId]
  const power = e.category === '爆发力' || ['slam', 'med-rotation'].includes(e.id)
  return { exerciseId, sets: level === '入门' ? 2 : 3, reps: power ? 5 : level === '入门' ? 8 : 12, seconds: e.timed ? 30 : 0, rest: power ? 120 : 60 }
}
const definitions: [string, string, Level, number, number[], string[][], string][] = [
  ['foundation', '从稳定开始', '入门', 4, [1, 4], [['wall-sit', 'bridge', 'calf', 'dead-bug'], ['reverse-lunge', 'soleus-raise', 'bird-dog', 'plank']], '建立下肢与核心的基础控制。每周两次，训练间隔至少一天，先掌握动作再增加负荷。'],
  ['home', '在家，也能变强', '入门', 4, [1, 3, 5], [['reverse-lunge', 'bridge', 'push-up', 'bird-dog', 'calf', 'grip'], ['wall-sit', 'side-plank', 'scap-pushup', 'tib-raise', 'dead-bug', 'ankle']], '徒手为主的全身训练。以退阶版本开始，不需要健身房，也不追求每次力竭。'],
  ['care', '15 分钟 · 关节控制', '入门', 4, [2, 5], [['external-rotation', 'scap-pushup', 'tib-raise'], ['bird-dog', 'soleus-raise', 'ankle']], '短时肩胛、核心与踝部控制，不是伤病治疗方案。有症状请先评估。'],
  ['footwork', '更快一步', '进阶', 8, [1, 3, 5], [['bulgarian', 'single-rdl', 'single-calf', 'pallof', 'split-step', 'shadow'], ['lateral-lunge', 'skater', 'bridge', 'side-plank', 'ladder', 't-drill']], '单腿力量与步法相结合。高质量短组训练，不在疲劳后继续极限跨步。'],
  ['power', '起跳与落地', '进阶', 8, [2, 5], [['squat-jump', 'box-jump', 'goblet', 'rdl', 'calf', 'dead-bug'], ['skater', 'step-up', 'single-rdl', 'pallof', 'soleus-raise', 'hip-flexor']], '先有受控落地，再增加起跳速度。增强式动作先做，充分休息，箱跳走下。'],
  ['shoulder-control', '挥拍的力量链', '进阶', 8, [1, 4], [['external-rotation', 'row', 'push-up', 'face-pull', 'pallof', 'pronation'], ['ytw', 'overhead', 'woodchop', 'reverse-wrist', 'wrist-curl', 'grip']], '从肩胛到前臂的力量与控制；体能训练不能替代握拍与击球时序训练。'],
  ['advanced', '全面体能 · 进阶挑战', '高阶', 8, [1, 3, 6], [['squat-jump', 'back-squat', 'rdl', 'bulgarian', 'single-calf', 'pallof', 'row', 'external-rotation'], ['skater', 'copenhagen', 'single-rdl', 'push-up', 'woodchop', 'shadow', 't-drill', 'calf']], '适合已具备力量基础的健康成人，杠铃动作需教练与安全保护。比赛周应减少负荷。'],
  ['competition', '专项体能与恢复', '高阶', 8, [2, 5], [['lateral-bound', 'split-jump', 'bulgarian', 'nordic', 'med-rotation', 'row', 'shadow', 'shuttle-run'], ['box-jump', 'single-hop', 'goblet', 'copenhagen', 'slam', 'pallof', 'external-rotation', 't-drill']], '面向已有系统训练经验者。冲击训练低量开始，状态不佳改退阶或休息。'],
]
export const presetPlans: Plan[] = definitions.map(([id, name, level, weeks, weekdays, days, description]) => ({
  id,
  name,
  level,
  weeks,
  weekdays,
  description,
  days: days.map((ids, index) => ({ name: `训练 ${String.fromCharCode(65 + index)}`, items: ids.map(id => defaultItem(id, level)) })),
}))
