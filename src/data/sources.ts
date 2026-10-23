import type { Source } from '../types'

export const sources: Source[] = [
  { id: 'shoulder', title: 'Shoulder muscles', publisher: 'Kenhub', url: 'https://www.kenhub.com/en/library/anatomy/shoulder-muscles', kind: '解剖', note: '肩部肌肉位置、附着与功能。' },
  { id: 'cuff', title: 'The rotator cuff', publisher: 'Kenhub', url: 'https://www.kenhub.com/en/library/anatomy/the-rotator-cuff', kind: '解剖', note: '四块肩袖肌肉协同维持盂肱关节稳定，并非只负责外旋。' },
  { id: 'arm', title: 'Arm muscles', publisher: 'Kenhub', url: 'https://www.kenhub.com/en/library/anatomy/arm-muscles', kind: '解剖', note: '肱二头肌、肱肌、肱三头肌等附着与功能。' },
  { id: 'forearm', title: 'Elbow and forearm', publisher: 'Kenhub', url: 'https://www.kenhub.com/en/library/anatomy/elbow-and-forearm', kind: '解剖', note: '前臂屈伸肌与旋转肌的分层解剖。' },
  { id: 'trunk', title: 'Muscles of the trunk', publisher: 'Kenhub', url: 'https://www.kenhub.com/en/library/anatomy/muscles-of-the-trunk', kind: '解剖', note: '胸、背与腹部肌肉，附着点为学习用简述。' },
  { id: 'glute', title: 'Muscles of the gluteal region', publisher: 'TeachMeAnatomy', url: 'https://teachmeanatomy.info/lower-limb/muscles/gluteal-region/', kind: '解剖', note: '浅层及深层臀肌。网页可能限制访问。' },
  { id: 'thigh', title: 'Muscles of the thigh', publisher: 'TeachMeAnatomy', url: 'https://teachmeanatomy.info/lower-limb/muscles/thigh/', kind: '解剖', note: '大腿前、内、后侧肌群。' },
  { id: 'leg', title: 'Lower limb muscles', publisher: 'TeachMeAnatomy', url: 'https://teachmeanatomy.info/lower-limb/muscles/', kind: '解剖', note: '下肢解剖目录，含小腿各分区。' },
  { id: 'ace', title: 'ACE Exercise Library', publisher: 'American Council on Exercise', url: 'https://www.acefitness.org/resources/everyone/exercise-library/', kind: '动作', note: '通用动作技术参考目录，不代表 ACE 为本站训练计划背书；变式需结合教练指导。' },
  { id: 'split', title: 'Bulgarian Split Squat', publisher: 'ACE', url: 'https://www.acefitness.org/resources/everyone/exercise-library/366/bulgarian-split-squat/', kind: '动作', note: '后脚抬高分腿蹲的起始姿态与执行方法。' },
  { id: 'rdl', title: 'Romanian Deadlift', publisher: 'ACE', url: 'https://www.acefitness.org/resources/everyone/exercise-library/317/romanian-deadlift/', kind: '动作', note: '髋铰链、膝微屈与保持背部姿态。' },
  { id: 'deadbug', title: 'Supine Dead Bug', publisher: 'ACE', url: 'https://www.acefitness.org/resources/everyone/exercise-library/147/supine-dead-bug/', kind: '动作', note: '仰卧核心控制练习。' },
  { id: 'bird', title: 'Bird Dog', publisher: 'ACE', url: 'https://www.acefitness.org/resources/everyone/exercise-library/14/bird-dog/', kind: '动作', note: '四点支撑的对侧伸展。' },
  { id: 'wrist-flex', title: 'Wrist Curl — Flexion', publisher: 'ACE', url: 'https://www.acefitness.org/resources/everyone/exercise-library/30/wrist-curl-flexion/', kind: '动作', note: '前臂支撑、掌心向上屈腕。' },
  { id: 'wrist-ext', title: 'Wrist Curl — Extension', publisher: 'ACE', url: 'https://www.acefitness.org/resources/everyone/exercise-library/29/wrist-curl-extension/', kind: '动作', note: '前臂支撑、掌心向下伸腕。' },
  { id: 'rotation', title: 'Wrist Supination and Pronation', publisher: 'ACE', url: 'https://www.acefitness.org/resources/everyone/exercise-library/31/wrist-supination-and-pronation/', kind: '动作', note: '旋转实际发生在前臂桡尺关节，并非单靠手腕甩动。' },
  { id: 'nsca', title: 'Plyometric Training', publisher: 'NSCA', url: 'https://www.nsca.com/education/articles/kinetic-select/plyometric-training/', kind: '动作', note: '伸缩循环与增强式训练原则；高冲击动作须先具备力量与落地控制。' },
  { id: 'depth', title: 'Exercise Technique: Depth Jump', publisher: 'NSCA', url: 'https://www.nsca.com/education/videos/exercise-technique-depth-jump/', kind: '动作', note: '深跳专项技术参考，不用于零基础或伤后自行训练。' },
  { id: 'bwf', title: 'Shuttle Time — Video Clips', publisher: 'Badminton World Federation', url: 'https://shuttletime.bwfbadminton.com/video-clips', kind: '专项', note: 'BWF 学校羽毛球教学视频与课时活动。' },
  { id: 'bwf-coach', title: 'Coach Education — Level 1', publisher: 'Badminton World Federation', url: 'https://development.bwfbadminton.com/coaches/level-1', kind: '专项', note: 'BWF 官方一级教练课程页面，提供免费教练手册。网站限制抓取，本站未逐条摘录手册内容。' },
  { id: 'lunge-study', title: 'Biomechanics of lower limb in badminton lunge: a systematic scoping review (2020)', publisher: 'Lam, Wong & Lee · PeerJ · doi:10.7717/peerj.10300', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7648456/', kind: '研究', note: '纳入 20 项跨步生物力学研究。高水平球员冲击衰减能力更强、膝踝策略更积极（关节力矩更高）、足底内侧负荷更高；鞋的设计会影响动作力学。不证明单一力量练习能直接提高比赛成绩。' },
  { id: 'emg', title: 'Characterization of Muscle Activation and Muscle Synergism in the ‘Forward Lunge’ (2025)', publisher: 'Jiang, Li & Xiu · Sensors · doi:10.3390/s25061644', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11944875/', kind: '研究', note: '24 名男性球员（国家二级以上 12 人、业余 12 人）前向跨步的右侧 12 块肌肉表面肌电。结果只适用于其受试者与实验条件。' },
  { id: 'smash-synergy', title: 'Muscle synergy analysis during badminton forehand overhead smash: integrating electromyography and musculoskeletal modeling (2025)', publisher: 'Tajik et al. · Frontiers in Sports and Active Living · doi:10.3389/fspor.2025.1596670', url: 'https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2025.1596670/full', kind: '研究', note: '20 名精英球员全力正手杀球，记录 15 块肩部肌肉的表面肌电并结合 OpenSim 建模，提取出 3 组肌肉协同。只测肩部，未测前臂与下肢。' },
  { id: 'smash-elite', title: 'Upper Limb Neuromuscular Activities and Synergies Comparison between Elite and Nonelite Athletics in Badminton Overhead Forehand Smash (2018)', publisher: 'Barnamehei et al. · Applied Bionics and Biomechanics · doi:10.1155/2018/6067807', url: 'https://pubmed.ncbi.nlm.nih.gov/30671132/', kind: '研究', note: '比较精英与非精英球员正手杀球的上肢肌电与协同。本站只核实了文献信息，未读取全文，因此不引用其具体数值。' },
  { id: 'training-meta', title: 'Effects of physical training programs on healthy badminton players’ performance: a systematic review and meta-analysis (2025)', publisher: 'BMC Sports Science, Medicine and Rehabilitation · doi:10.1186/s13102-025-01199-y', url: 'https://link.springer.com/article/10.1186/s13102-025-01199-y', kind: '研究', note: '15 项研究、370 名受试者，干预 4–10 周、每周 2–3 次。体能训练可改善最大摄氧量、敏捷与平衡，但多数研究样本小。' },
]

export const sourceById = Object.fromEntries(sources.map(s => [s.id, s]))
export const disclaimer = '内容用于健康成年人的运动学习，不构成医疗诊断或个体化处方。出现锐痛、眩晕或异常不适应立即停止；有伤病、孕期或慢性病请先咨询医疗人员。肌肉图与动作图是简化示意，不可替代现场教学。'
