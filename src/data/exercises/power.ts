import { createExercises } from './shared'

export const power = createExercises('爆发力', [
  ['squat-jump', '深蹲跳', 'Squat jump', '进阶', '徒手', 'glute-max,vastus-lateralis,rectus-femoris,gastrocnemius', 'transverse', 'jump', '双脚髋宽，先屈髋屈膝至浅蹲位。|双腿快速蹬伸，向上小幅跳起。|屈髋屈膝柔和落地并站稳，每次重置姿态。', '先练落地；高度不是首要目标，组间充分恢复。', '硬腿落地、膝内扣、连续疲劳跳。', '提踵加快速蹬伸不离地', '少量提高起跳速度'],
  ['box-jump', '箱跳', 'Box jump', '进阶', '跳箱', 'glute-max,vastus-lateralis,gastrocnemius', 'rectus', 'box', '面对防滑稳定低箱，先确认高度与空间。|屈髋摆臂向上跳，双脚完整落在箱上。|站稳后逐脚走下箱，不直接跳下。', '从低箱开始，不用抬膝高度冒充起跳能力。', '箱面太小、追求过高箱子、直接跳下增加冲击。', '低台登阶', '同高度提高质量而非盲目加高'],
  ['split-jump', '分腿跳', 'Split squat jump', '高阶', '徒手', 'glute-max,rectus-femoris,gastrocnemius', 'glute-med', 'split', '从可控分腿浅蹲开始，双脚有横向间距。|小幅跳起，可先不换腿。|同姿态柔和落地并重置，掌握后再尝试空中换腿。', '需要良好单腿稳定，不作为膝痛康复动作。', '空中失衡、落地膝内扣、后膝撞地。', '普通分腿蹲', '教练指导的交替分腿跳'],
  ['lateral-bound', '侧向跨跳', 'Lateral bound', '高阶', '徒手', 'glute-med,glute-max,adductors', 'fibularis,gastrocnemius', 'lateral', '单腿站稳，屈髋屈膝蓄力。|向侧面小距离跳到另一只脚。|落地保持骨盆与膝踝控制，稳定后再反向跳。', '先练小距离“跳—定住”，不追求连续速度。', '落地脚向内塌、身体急倒、距离超过控制能力。', '侧向跨步定住', '适度增加跨跳距离'],
  ['skater', '滑冰跳', 'Skater hop', '进阶', '徒手', 'glute-med,glute-max', 'adductors,fibularis', 'lateral', '双脚站立，向一侧轻跳落在同侧脚。|另一腿在身后轻摆但不大幅交叉。|落地稳住后向另一侧重复。', '保持胸部朝前与膝朝脚尖，先慢后快。', '过度交叉腿、躯干剧烈扭转或脚踝塌陷。', '左右侧向迈步', '连续小幅滑冰跳'],
  ['tuck-jump', '团身跳', 'Tuck jump', '高阶', '徒手', 'glute-max,rectus-femoris,iliopsoas', 'gastrocnemius,rectus', 'jump', '站稳后浅蹲蓄力，向上跳。|空中适度抬膝，不强拉膝撞胸。|提前伸腿准备落地，屈髋屈膝缓冲并站稳。', '高冲击，只有熟练落地且无伤病时少量练习。', '落地膝僵直、连续追求次数、疲劳下动作崩坏。', '小幅深蹲跳', '低量高质量团身跳'],
  ['single-hop', '单腿小跳', 'Single-leg hop', '高阶', '徒手', 'gastrocnemius,soleus,glute-max', 'glute-med,fibularis', 'jump', '单腿站稳，支撑膝微屈。|小幅向上跳，双臂帮助平衡。|落在同侧脚并稳定，每次重置；两侧分别练习。', '从非常小的幅度开始，脚踝疼痛时停止。', '连续弹到失控、踝外翻、膝盖内扣。', '单腿站立与提踵', '低量多方向单腿小跳'],
  ['depth-jump', '深跳', 'Depth jump', '高阶', '跳箱', 'glute-max,vastus-lateralis,gastrocnemius,soleus', 'transverse', 'box', '在教练指导下站到很低的箱上，确认落地区空旷。|迈出箱沿自然下落，而非主动向上跳下。|接触地面后迅速受控蹬伸起跳，再缓冲落地。', '先有力量及落地基础；不是新手动作，不因箱高增加而自动更有效。', '箱过高、跳下而非迈下、疲劳时反复高冲击。', '低台下落后定住不反跳', '教练评估后调整高度', false, 'depth'],
])

export const agility = createExercises('步法敏捷', [
  ['shadow', '六点影子步法', 'Six-corner shadow footwork', '进阶', '球拍', 'glute-max,vastus-lateralis,gastrocnemius', 'adductors,glute-med', 'lunge', '以场地中心为起点，确定前中后左右六个触点。|分腿启动后向一个点移动并模拟击球。|受控回中心，每次重置，再去下一个点。', '先练时序与回位；小跨距，避免疲劳极限跨步。', '只顾速度、不回中心、跨步后膝踝失控。', '两点慢速影子', '教练随机指令六点步法', true, 'bwf'],
  ['split-step', '分腿启动步练习', 'Split-step drill', '入门', '徒手', 'gastrocnemius,soleus,vastus-lateralis', 'glute-med', 'jump', '在准备位，双脚略宽于髋，膝微屈。|配合模拟对手击球时机，小幅分腿落地。|落地立即小步启动，随后回到准备位。', '重点是时机而非跳高，不能只机械原地跳。', '跳太高、落地过晚、身体重心升降过大。', '不离地的分腿重心转移', '加方向反应指令', true, 'bwf'],
  ['ladder', '绳梯步频', 'Agility ladder', '入门', '绳梯', 'gastrocnemius,soleus,tibialis', 'glute-med', 'run', '将绳梯平放防滑地面，先学习一格两步。|小步快速进格，保持膝微屈与上身稳定。|走回起点充分休息后换一种步型。', '绳梯练协调与步频，不等于真实来球决策能力。', '踩绳梯、只低头看脚或速度快到失控。', '地面画线慢步', '横向双脚进出格', true],
  ['shuttle-run', '短距离折返跑', 'Shuttle run', '进阶', '标志桶', 'glute-max,vastus-lateralis,gastrocnemius', 'biceps-femoris', 'run', '放置两标志点，相距约 5 米，保证防滑。|加速至标志点前主动减速，屈髋屈膝变向。|回跑到起点，短组练习后充分休息。', '先掌握减速，勿把全速急停作为入门方法。', '挺直膝盖急刹、滑地转身或疲劳下拼次数。', '慢速往返快走', '逐步加快但保持变向控制', true],
  ['t-drill', 'T 字 / 米字移动', 'T-drill / star drill', '进阶', '标志桶', 'glute-med,adductors,vastus-lateralis', 'fibularis,transverse', 'lateral', '摆出 T 字或米字标志点，距离从短开始。|向前、侧向与后退移动，每个点先减速再转向。|回中心恢复姿态，按教练指令变换方向。', '后退区域空旷；技术熟练后才增加随机反应。', '交叉脚失衡、后退撞人、急停时膝内扣。', '短距离四向走步', '随机方向反应移动', true],
])

export const cardio = createExercises('体能', [
  ['rope', '跳绳', 'Jump rope', '入门', '跳绳', 'gastrocnemius,soleus', 'tibialis,flexors', 'jump', '调整绳长，在防滑有缓冲的地面站稳。|手腕小幅转绳，双脚低幅度轻跳。|短间歇进行，呼吸能恢复后再开始下一组。', '低跳、轻落地；跟腱或小腿痛时停止。', '跳太高、硬地长时间练、肩部大幅甩绳。', '无绳低幅度踏步', '低量交替脚跳', true, 'nsca'],
  ['sprint', '间歇加速跑', 'Interval run', '进阶', '徒手', 'glute-max,biceps-femoris,gastrocnemius', 'iliopsoas', 'run', '热身后选空旷平整场地，从次最大速度开始。|短时间加速跑，提前留足减速区。|步行恢复直到呼吸可控，再做下一组。', '初学不是全力冲刺；疲劳与疼痛时停止。', '未热身全力跑、没有减速空间、恢复不足。', '快走与慢跑交替', '教练安排的短冲刺间歇', true, 'nsca'],
  ['burpee', '波比跳', 'Burpee', '进阶', '徒手', 'rectus-femoris,glute-max,pectoralis', 'transverse,triceps', 'burpee', '站姿屈髋屈膝，双手撑地。|双脚逐步后撤到高平板，保持腰盆稳定。|双脚收回站起；熟练后再加轻跳，不必须做俯卧撑。', '这是全身代谢训练，动作质量比速度重要。', '塌腰扑地、落地失控、为追心率忽视姿态。', '不跳跃、逐脚后撤波比', '受控增加顶部小跳', true, 'ace'],
])
