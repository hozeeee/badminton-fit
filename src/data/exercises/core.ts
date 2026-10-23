import { createExercises } from './shared'

export const core = createExercises('核心稳定', [
  ['plank', '平板支撑', 'Forearm plank', '入门', '瑜伽垫', 'transverse,rectus', 'serratus,glute-max', 'plank', '前臂撑地，肘在肩下，脚尖支撑。|抬髋至肩髋踝近似一线，腹部收紧。|正常呼吸，姿态改变前结束，不靠忍耐塌腰增加时间。', '保持颈部自然，不追求超长时长。', '塌腰、臀部抬太高、屏息或耸肩。', '膝盖着地平板', '短时间长杠杆平板', true],
  ['side-plank', '侧桥', 'Side plank', '入门', '瑜伽垫', 'external-oblique,internal-oblique', 'glute-med,serratus', 'side-plank', '侧卧，前臂撑地，肘放在肩下。|以膝或脚侧面为支点抬髋，身体保持一线。|保持骨盆不转，结束后换边。', '肩部不适时减小杠杆或停止。', '肩耸起、髋下沉、上侧身体转向地面。', '屈膝侧桥', '侧桥抬上侧腿', true],
  ['dead-bug', '死虫式', 'Dead bug', '入门', '瑜伽垫', 'transverse,rectus', 'iliopsoas', 'deadbug', '仰卧，双臂向上，髋膝屈约 90°。|呼气保持腰盆位置，慢慢伸出对侧手脚。|在腰背不拱起的范围收回，左右交替。', '越慢越需要控制；不是必须把脚放到地面。', '肋骨翻起、腰过度拱、伸展太快。', '仅做脚跟轻触地', '延长对侧手脚杠杆', false, 'deadbug'],
  ['bird-dog', '鸟狗式', 'Bird dog', '入门', '瑜伽垫', 'erectors,transverse', 'glute-max,deltoid', 'bird', '四点跪姿，手在肩下、膝在髋下。|伸出对侧手脚，保持骨盆水平和躯干稳定。|短暂停顿后收回，换侧重复。', '手脚向远处伸，不追求抬高。', '腰过伸、骨盆旋转、脖子上仰。', '仅伸一条腿', '伸展位增加短暂停顿', false, 'bird'],
  ['russian', '俄罗斯转体', 'Russian twist', '进阶', '瑜伽垫', 'external-oblique,internal-oblique', 'rectus', 'twist', '坐姿屈膝，脚保持地面，躯干轻微后倾。|双手在胸前，胸椎带动躯干小幅左右转动。|保持呼吸与骨盆稳定，避免负重追求极限转幅。', '腰部有症状不选此动作；先做无负重版本。', '腰椎反复大幅扭转、背弓起或脚离地后失控。', 'Pallof 抗旋推', '轻药球小幅转体'],
  ['pallof', 'Pallof 抗旋推', 'Pallof press', '入门', '弹力带', 'external-oblique,internal-oblique,transverse', 'glute-med', 'press', '弹力带固定在胸高，侧对固定点站立。|双手胸前握带，站稳后将手缓慢向前推。|抵抗身体被拉向固定点，收回后重复并换侧。', '这是抗旋转，不是主动转腰；固定点要可靠。', '身体跟着带转、耸肩或带子拉力过大。', '减小带张力并缩短推距', '分腿站姿抗旋推'],
  ['med-rotation', '药球旋转抛', 'Rotational medicine ball throw', '高阶', '药球', 'external-oblique,internal-oblique,glute-max', 'pectoralis', 'twist', '侧对可承受药球的墙，保持周围无人。|由腿髋带动躯干转动，把轻药球抛向墙。|让球落稳后再捡回，重新站稳再做，不急着抢接。', '先用轻球学习力量传递，不能用普通家居墙面。', '仅扭腰、球过重、接球区有人或落地不稳。', '无球慢速髋躯干转动', '教练指导下提高抛掷速度', false, 'nsca'],
  ['leg-raise', '悬垂屈膝举腿', 'Hanging knee raise', '进阶', '单杠', 'rectus,iliopsoas', 'flexors,latissimus', 'hang', '握稳单杠，先建立无摆动悬垂。|呼气收腹，屈膝缓慢抬起，不用甩动身体。|控制放下到稳定位置，再做下一次。', '肩部不耐受悬垂时改仰卧版本。', '借摆动、肩关节下坠失控、只靠甩腿。', '仰卧屈膝举腿', '受控直腿举腿'],
  ['woodchop', '弹力带伐木劈', 'Band wood chop', '进阶', '弹力带', 'external-oblique,internal-oblique', 'deltoid,glute-max', 'twist', '带子高位可靠固定，侧向分腿站立。|双手握带从肩侧向对侧髋部拉动，允许髋随动。|缓慢回到起点，控制反向张力，换边。', '由髋与躯干共同转动，不固定脚后硬拧腰。', '腰椎极限扭转、手臂猛拽、松手让带弹回。', '低张力半跪伐木劈', '在可控前提下增加带张力'],
])
