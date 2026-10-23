import type { Evidence } from '../types'

// 只收录已读到原文的研究结论；肌电幅值高低反映激活程度，不等于肌肉“更重要”或训练处方。
const lungeLimit = '受试者仅为 24 名右利手男性，只测右侧；属于横断面比较，不能说明练这些肌肉就能提高跨步表现。'
const smashLimit = '受试者为 20 名精英球员，只测肩部 15 块肌肉，未测前臂与下肢；协同描述的是协调模式，不是力量处方。'

export const evidence: Evidence[] = [
  { id: 'lunge-emg-both', sourceId: 'emg', level: '实测肌电', techniqueIds: ['lunge'], muscles: ['gastrocnemius', 'glute-max', 'external-oblique', 'latissimus'], finding: '前向跨步中，专业组的腓肠肌、臀大肌、腹外斜肌和背阔肌，在积分肌电（iEMG）和均方根振幅（RMS）两项指标上都显著高于业余组。', limit: lungeLimit },
  { id: 'lunge-emg-partial', sourceId: 'emg', level: '实测肌电', techniqueIds: ['lunge'], muscles: ['vastus-medialis', 'biceps-femoris'], finding: '股内侧肌只在 RMS 上显著高于业余组（p<0.01），股二头肌只在 iEMG 上显著更高（p<0.05），两项指标结论不一致。', limit: lungeLimit },
  { id: 'lunge-emg-ns', sourceId: 'emg', level: '实测肌电', techniqueIds: ['lunge'], muscles: ['tibialis', 'vastus-lateralis', 'soleus', 'deltoid', 'biceps'], finding: '胫骨前肌、股外侧肌、比目鱼肌、三角肌、肱二头肌和肱桡肌在两组之间差异不显著（p>0.05）。这不代表它们不参与跨步，只说明激活水平在两组间没有明显差别。', limit: lungeLimit },
  { id: 'smash-synergy-1', sourceId: 'smash-synergy', level: '实测肌电', techniqueIds: ['forehand'], muscles: ['trapezius'], finding: '正手杀球的第一组肌肉协同以斜方肌为主，上部胸大肌与前束三角肌也有贡献，主要在准备期和加速早期控制肩胛，为能量传递提供稳定平台。', limit: smashLimit },
  { id: 'smash-synergy-2', sourceId: 'smash-synergy', level: '实测肌电', techniqueIds: ['forehand'], muscles: ['pectoralis', 'deltoid', 'triceps'], finding: '第二组协同以胸大肌和前束三角肌为主并有肱三头肌参与，对应加速后期到击球时的屈肩、肩内旋与伸肘。', limit: smashLimit },
  { id: 'smash-synergy-3', sourceId: 'smash-synergy', level: '实测肌电', techniqueIds: ['forehand'], muscles: ['deltoid', 'infraspinatus', 'latissimus', 'serratus'], finding: '第三组协同包括中后束三角肌、冈下肌、背阔肌和前锯肌，主要负责随挥阶段的减速：外展、外旋肌群与主动肌共同收缩以稳定肩关节。', limit: smashLimit },
  { id: 'lunge-review', sourceId: 'lunge-study', level: '生物力学综述', techniqueIds: ['lunge', 'side-step'], muscles: [], finding: '综述纳入 20 项研究：高水平球员跨步时冲击衰减能力更强，膝、踝策略更积极（关节力矩更高），足底内侧负荷更高；鞋的设计会影响舒适感与动作力学，但与跨步表现的关系尚无定论。', limit: '不同研究的跨步方式与指令差异较大，运动学结论存在矛盾；多数实验并非真实比赛强度下的随机来球。' },
  { id: 'training-meta', sourceId: 'training-meta', level: '系统综述与荟萃分析', techniqueIds: [], muscles: [], finding: '15 项研究、370 名健康球员：体能训练组的最大摄氧量显著提升（SMD 1.27），力量结合增强式训练改善敏捷（SMD −0.61）；平衡类训练、普拉提和核心训练都改善平衡表现。干预多为 4–10 周、每周 2–3 次。', limit: '最大摄氧量只来自 2 项研究；敏捷的显著结果是剔除高异质性研究后得出的；多数研究每组只有 8–20 人。' },
]

export const evidenceForMuscle = (id: string) => evidence.filter(e => e.muscles.includes(id))
export const evidenceForTechnique = (id: string) => evidence.filter(e => e.techniqueIds.includes(id))
export const evidenceMuscles = [...new Set(evidence.flatMap(e => e.muscles))]
