import type { Muscle, View } from '../types'

// 群组名称明确标注“肌群”；附着点为解剖学习简述，不逐列每条肌束。
type Row = [string, string, string, string, string, string, string, string, boolean?]
const rows: Row[] = [
  ['deltoid', '三角肌', 'Deltoid', '肩部', '锁骨外侧、肩峰与肩胛冈 → 肱骨三角肌粗隆', '肩外展；前束辅助屈曲、后束辅助伸展。', '支持高远球和杀球时的抬臂与位置控制。', 'shoulder'],
  ['supraspinatus', '冈上肌', 'Supraspinatus', '肩部', '肩胛骨冈上窝 → 肱骨大结节', '辅助肩外展并稳定肱骨头。', '过头击球时参与肩关节稳定。', 'cuff', true],
  ['infraspinatus', '冈下肌', 'Infraspinatus', '肩部', '肩胛骨冈下窝 → 肱骨大结节', '肩外旋，维持盂肱关节稳定。', '支持引拍外旋及随挥控制。', 'cuff'],
  ['teres-minor', '小圆肌', 'Teres minor', '肩部', '肩胛骨外侧缘 → 肱骨大结节', '肩外旋并辅助内收。', '与冈下肌共同支持肩部旋转控制。', 'cuff', true],
  ['subscapularis', '肩胛下肌', 'Subscapularis', '肩部', '肩胛下窝 → 肱骨小结节', '肩内旋与肱骨头稳定。', '参与过头击球中的肩内旋与稳定。', 'cuff', true],
  ['biceps', '肱二头肌', 'Biceps brachii', '上臂', '肩胛骨盂上结节与喙突 → 桡骨粗隆', '屈肘与前臂旋后。', '支持反手准备及握拍时肘部控制。', 'arm'],
  ['brachialis', '肱肌', 'Brachialis', '上臂', '肱骨前面 → 尺骨粗隆与冠突', '屈肘，不依赖前臂旋转方向。', '维持接球准备姿态中的屈肘位置。', 'arm', true],
  ['triceps', '肱三头肌', 'Triceps brachii', '上臂', '肩胛骨盂下结节及肱骨后面 → 尺骨鹰嘴', '伸肘；长头还辅助肩伸展。', '参与过头击球加速阶段的伸肘。', 'arm'],
  ['flexors', '前臂屈肌群', 'Forearm flexors', '前臂', '多起自肱骨内上髁、尺桡骨 → 腕骨、掌骨及指骨（各肌不同）', '屈腕与屈指；部分肌肉辅助腕偏移。', '握拍与击球瞬间的手指收紧。', 'forearm'],
  ['extensors', '前臂伸肌群', 'Forearm extensors', '前臂', '多起自肱骨外上髁及尺桡骨 → 掌骨、指骨（各肌不同）', '伸腕、伸指并稳定手腕。', '维持拍面角度；避免把反手简化成甩腕。', 'forearm'],
  ['pronator', '旋前肌群', 'Pronators', '前臂', '旋前圆肌：内上髁/尺骨冠突 → 桡骨外侧；旋前方肌：远端尺骨 → 桡骨', '使前臂旋前。', '参与正手击球的前臂旋转。', 'forearm', true],
  ['supinator', '旋后肌', 'Supinator', '前臂', '肱骨外上髁、尺骨近端等 → 近端桡骨', '使前臂旋后。', '辅助反手击球的前臂旋转。', 'forearm', true],
  ['pectoralis', '胸大肌', 'Pectoralis major', '胸背', '锁骨内侧、胸骨及肋软骨 → 肱骨结节间沟外侧唇', '肩内收、内旋；锁骨部辅助屈肩。', '参与正手过头击球的上肢加速。', 'trunk'],
  ['serratus', '前锯肌', 'Serratus anterior', '胸背', '第 1–8/9 肋骨 → 肩胛骨内侧缘前面', '肩胛前伸与上回旋，贴附胸壁。', '支持过头击球时的肩胛上回旋。', 'trunk'],
  ['trapezius', '斜方肌', 'Trapezius', '胸背', '枕骨、项韧带及胸椎棘突 → 锁骨外侧、肩峰与肩胛冈', '分束负责肩胛上提、后缩、下压和上回旋。', '协同前锯肌建立稳定的过头抬臂轨迹。', 'trunk'],
  ['rhomboids', '菱形肌群', 'Rhomboids', '胸背', '下颈椎与上胸椎棘突 → 肩胛骨内侧缘', '肩胛后缩与下回旋。', '引拍时的肩胛位置控制。', 'trunk', true],
  ['latissimus', '背阔肌', 'Latissimus dorsi', '胸背', '下胸椎、胸腰筋膜、髂嵴及下位肋骨 → 肱骨结节间沟底', '肩伸展、内收及内旋。', '参与击球加速和上肢力量传递。', 'trunk'],
  ['erectors', '竖脊肌群', 'Erector spinae', '核心', '骨盆、骶骨与椎骨 → 肋骨、椎骨及颅骨（各肌不同）', '脊柱伸展及姿态维持。', '移动与后场击球时维持躯干稳定。', 'trunk'],
  ['rectus', '腹直肌', 'Rectus abdominis', '核心', '耻骨 → 第 5–7 肋软骨与剑突', '躯干屈曲，协助控制骨盆。', '跳杀与落地时帮助控制躯干。', 'trunk'],
  ['external-oblique', '腹外斜肌', 'External oblique', '核心', '第 5–12 肋骨 → 腹白线、髂嵴及耻骨', '躯干屈曲、侧屈与对侧旋转。', '转体挥拍与侧向移动时传递力量。', 'trunk'],
  ['internal-oblique', '腹内斜肌', 'Internal oblique', '核心', '胸腰筋膜、髂嵴及腹股沟韧带 → 下位肋骨、腹白线及耻骨', '同侧旋转、侧屈与腹压调节。', '与腹外斜肌协同控制转体。', 'trunk', true],
  ['transverse', '腹横肌', 'Transversus abdominis', '核心', '肋软骨、胸腰筋膜、髂嵴等 → 腹白线与耻骨', '压缩腹部，辅助躯干稳定。', '急停与变向时帮助维持躯干控制。', 'trunk', true],
  ['iliopsoas', '髂腰肌', 'Iliopsoas', '臀髋', '腰椎（腰大肌）及髂窝（髂肌） → 股骨小转子', '髋屈曲。', '回位与跨步后收腿。', 'leg', true],
  ['glute-max', '臀大肌', 'Gluteus maximus', '臀髋', '髂骨后部、骶骨及尾骨 → 髂胫束与股骨臀肌粗隆', '髋伸展、外旋。', '起跳、蹬地与跨步回位的重要动力肌。', 'glute'],
  ['glute-med', '臀中肌', 'Gluteus medius', '臀髋', '髂骨外面 → 股骨大转子', '髋外展，单腿支撑时稳定骨盆。', '单腿跨步、侧向变向时控制骨盆。', 'glute'],
  ['glute-min', '臀小肌', 'Gluteus minimus', '臀髋', '髂骨外面 → 股骨大转子前面', '髋外展、内旋及骨盆稳定。', '辅助侧向移动时的单腿控制。', 'glute', true],
  ['tfl', '阔筋膜张肌', 'Tensor fasciae latae', '臀髋', '髂前上棘附近 → 髂胫束', '髋屈曲、外展与内旋。', '协助侧向移动与下肢稳定；不应把外侧膝痛简单归咎于它。', 'glute'],
  ['rectus-femoris', '股直肌', 'Rectus femoris', '大腿', '髂前下棘等 → 髌骨，经髌韧带至胫骨粗隆', '伸膝、屈髋（跨越两关节）。', '跨步制动、起跳与收腿。', 'thigh'],
  ['vastus-lateralis', '股外侧肌', 'Vastus lateralis', '大腿', '股骨大转子与粗线等 → 髌骨及胫骨粗隆', '伸膝。', '跨步制动与蹬伸。', 'thigh'],
  ['vastus-medialis', '股内侧肌', 'Vastus medialis', '大腿', '股骨粗线等 → 髌骨及胫骨粗隆', '伸膝，参与髌骨轨迹控制。', '上网跨步、落地与回位中的膝部控制。', 'thigh'],
  ['vastus-intermedius', '股中间肌', 'Vastus intermedius', '大腿', '股骨前外侧面 → 髌骨及胫骨粗隆', '伸膝。', '与其他股四头肌协同完成蹬伸。', 'thigh', true],
  ['adductors', '髋内收肌群', 'Hip adductors', '大腿', '耻骨与坐骨 → 股骨粗线等；股薄肌止于胫骨内侧', '髋内收；部分肌束参与屈伸髋。', '宽跨步与侧向变向时控制下肢。', 'thigh'],
  ['biceps-femoris', '股二头肌', 'Biceps femoris', '大腿', '坐骨结节（长头）及股骨（短头） → 腓骨头', '屈膝、屈膝时小腿外旋；长头还伸髋。', '急停、落地与髋伸展时的后链控制。', 'thigh'],
  ['semitendinosus', '半腱肌 / 半膜肌', 'Semitendinosus & semimembranosus', '大腿', '坐骨结节 → 胫骨近端内侧（不同止点）', '屈膝、伸髋与屈膝时小腿内旋。', '跨步与变向中的后侧稳定。', 'thigh'],
  ['sartorius', '缝匠肌', 'Sartorius', '大腿', '髂前上棘 → 胫骨近端内侧', '屈髋、外展、外旋并屈膝。', '协助多方向移动时下肢姿态调整。', 'thigh'],
  ['gastrocnemius', '腓肠肌', 'Gastrocnemius', '小腿', '股骨内外侧髁 → 经跟腱止于跟骨', '踝跖屈，辅助屈膝。', '分腿启动、蹬地与起跳。', 'leg'],
  ['soleus', '比目鱼肌', 'Soleus', '小腿', '胫骨比目鱼肌线、腓骨头等 → 经跟腱止于跟骨', '踝跖屈，单关节姿态肌。', '屈膝状态下蹬地与持续步法耐力。', 'leg'],
  ['tibialis', '胫骨前肌', 'Tibialis anterior', '小腿', '胫骨外侧面 → 内侧楔骨及第一跖骨底', '踝背屈与足内翻。', '迈步抬脚及脚跟着地时的足部控制。', 'leg'],
  ['fibularis', '腓骨肌群', 'Fibularis longus & brevis', '小腿', '腓骨外侧 → 第一跖骨/内侧楔骨（长肌）、第五跖骨（短肌）', '足外翻并辅助跖屈。', '侧向移动时的踝部动态稳定。', 'leg'],
]

const front = new Set(['deltoid', 'biceps', 'flexors', 'pectoralis', 'serratus', 'rectus', 'external-oblique', 'tfl', 'rectus-femoris', 'vastus-lateralis', 'vastus-medialis', 'adductors', 'sartorius', 'tibialis', 'fibularis'])
const back = new Set(['deltoid', 'triceps', 'extensors', 'trapezius', 'infraspinatus', 'latissimus', 'erectors', 'glute-max', 'glute-med', 'biceps-femoris', 'semitendinosus', 'gastrocnemius', 'soleus', 'fibularis'])
export const muscles: Muscle[] = rows.map(([id, name, english, region, attachment, action, sport, source, deep]) => ({
  id,
  name,
  english,
  latin: english.includes(' & ') || english.includes(' ') && ['flexors', 'extensors', 'pronator', 'adductors', 'rhomboids', 'erectors'].includes(id) ? '肌群，详见来源' : `Musculus ${english.toLowerCase()}`,
  region,
  attachment,
  action,
  sport,
  deep: !!deep,
  views: [...(front.has(id) ? ['front' as View] : []), ...(back.has(id) ? ['back' as View] : []), 'side'],
  techniqueIds: region === '大腿' || region === '臀髋' || region === '小腿' ? ['lunge', 'split-step', 'jump', 'side-step'] : region === '前臂' ? ['forehand', 'backhand', 'net'] : ['forehand', 'backhand', 'jump'],
  prevention: ['肩部', '胸背', '上臂', '前臂'].includes(region) ? '循序增加挥拍与力量训练量，保持肩胛及前臂控制。疼痛不应靠反复强拉或继续挥拍解决。' : '增加负荷前先建立单腿与落地控制，避免疲劳下反复极限跨步。训练后留足恢复时间；持续疼痛应就医评估。',
  sources: [source],
}))
export const muscleById = Object.fromEntries(muscles.map(m => [m.id, m]))
export const regions = [...new Set(muscles.map(m => m.region))]
