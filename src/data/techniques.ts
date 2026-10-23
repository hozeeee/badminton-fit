import type { Technique } from '../types'

export const techniques: Technique[] = [
  { id: 'forehand', name: '正手高远球 / 杀球', english: 'Forehand overhead', description: '腿部蹬地、躯干转动、肩内旋、伸肘与前臂旋前协同完成击球，不是孤立的手腕动作。力量训练只是基础，拍面、击球点与时序仍需专项练习。', muscles: ['pectoralis', 'latissimus', 'subscapularis', 'triceps', 'pronator', 'external-oblique', 'serratus', 'deltoid', 'trapezius', 'infraspinatus'], evidence: '肩部肌肉（斜方肌、胸大肌、三角肌、肱三头肌、冈下肌、背阔肌、前锯肌）的分工有精英球员杀球肌电研究支持；腿、躯干与前臂的关联仍是基于解剖功能的运动链解释，不是逐肌激活排名。', sources: ['smash-synergy', 'smash-elite', 'bwf', 'cuff', 'forearm'] },
  { id: 'backhand', name: '反手击球', english: 'Backhand stroke', description: '根据球位调整拇指握法、肘部位置与前臂旋转；保持肩胛控制，避免用极端腕角度代偿。', muscles: ['supinator', 'biceps', 'extensors', 'triceps', 'deltoid'], evidence: '教学与解剖功能关联；不同反手技术的肌肉活动并不相同。', sources: ['bwf', 'forearm', 'arm'] },
  { id: 'net', name: '网前搓放 / 扑球', english: 'Net play', description: '在稳定跨步基础上，通过手指握力与小幅前臂调整控制拍面，减少多余的大臂动作。', muscles: ['flexors', 'extensors', 'pronator', 'supinator'], evidence: '基于解剖功能的控制训练关联。', sources: ['bwf', 'forearm'] },
  { id: 'lunge', name: '跨步上网与回位', english: 'Badminton lunge', description: '前腿吸收制动负荷，髋膝踝协同稳定后再蹬地回位。跨距、方向及疲劳会改变膝踝负荷，勿在疲劳下无限加大跨步。', muscles: ['vastus-lateralis', 'vastus-medialis', 'rectus-femoris', 'glute-max', 'biceps-femoris', 'gastrocnemius', 'tibialis'], evidence: '有跨步生物力学综述和专业/业余球员对比的肌电研究支持；研究结论描述的是动作特征，不是对本站训练计划的疗效证明。', sources: ['lunge-study', 'emg'] },
  { id: 'split-step', name: '分腿启动步', english: 'Split step', description: '与对手击球时机配合，小幅分腿落地后向来球方向启动。目的是及时反应，而非刻意跳得很高。', muscles: ['gastrocnemius', 'soleus', 'glute-max', 'vastus-lateralis'], evidence: 'BWF 教学活动与肌肉功能关联。', sources: ['bwf', 'leg'] },
  { id: 'jump', name: '后场起跳 / 跳杀', english: 'Jump smash', description: '下肢蹬伸建立高度，核心控制空中姿态，落地屈髋屈膝吸收冲击。先掌握落地，再增加跳跃强度。', muscles: ['glute-max', 'rectus-femoris', 'gastrocnemius', 'soleus', 'rectus', 'erectors'], evidence: '增强式训练原则及解剖关联；跳跃训练不替代击球技术。', sources: ['bwf', 'nsca'] },
  { id: 'side-step', name: '侧向蹬转 / 变向', english: 'Lateral movement', description: '侧向蹬地时维持骨盆与膝踝控制，回中心后再次准备。先在可控速度下练习，再加入随机来球。', muscles: ['glute-med', 'glute-min', 'adductors', 'fibularis', 'external-oblique'], evidence: '基于肌肉功能的训练关联；跨步方向会影响下肢负荷（见跨步综述），但侧向移动的逐肌激活尚无本站收录的研究。', sources: ['bwf', 'lunge-study', 'glute'] },
]
export const techniqueById = Object.fromEntries(techniques.map(t => [t.id, t]))
