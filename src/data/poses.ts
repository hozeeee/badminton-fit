export type Point = [number, number]
// 头、肩、髋、近侧膝、近侧踝、远侧膝、远侧踝、近侧肘、近侧手、远侧肘、远侧手。
export type Pose = [Point, Point, Point, Point, Point, Point, Point, Point, Point, Point, Point]
export type FigureFacing = 'left' | 'right' | 'front'
export type FigureView = 'side' | 'front'
export interface PosePair {
  start: Pose
  end: Pose
  prop?: 'bench' | 'wall' | 'box' | 'bar' | 'band' | 'weight'
  label: string
  facing: FigureFacing
  view: FigureView
  /** 起止帧中保持不动的接触点，例如深蹲的双脚或俯卧撑的双手。 */
  locked?: number[]
  /** 需要离地摆动的踝点及其中段抬起高度。 */
  lifts?: Partial<Record<4 | 6, number>>
}
const standing: Pose = [[145, 42], [145, 77], [145, 147], [126, 194], [120, 246], [161, 194], [170, 246], [121, 113], [109, 143], [170, 113], [182, 143]]
const squat: Pose = [[145, 65], [145, 100], [145, 169], [120, 198], [120, 246], [170, 198], [170, 246], [125, 126], [137, 143], [165, 126], [153, 143]]
const lunge: Pose = [[140, 66], [139, 101], [133, 168], [183, 194], [188, 246], [91, 204], [64, 246], [158, 132], [177, 144], [118, 133], [98, 151]]
const plank: Pose = [[71, 151], [99, 166], [167, 181], [206, 207], [246, 245], [198, 203], [239, 245], [97, 204], [106, 246], [110, 203], [121, 246]]
const seated: Pose = [[112, 88], [115, 121], [121, 186], [177, 191], [181, 244], [167, 199], [164, 244], [145, 155], [182, 155], [148, 159], [180, 159]]
const supine: Pose = [[57, 221], [85, 223], [160, 230], [187, 185], [226, 242], [184, 192], [218, 242], [112, 237], [145, 243], [115, 232], [143, 237]]
function change(pose: Pose, points: Partial<Record<number, Point>>): Pose {
  return pose.map((p, i) => points[i] || [...p]) as Pose
}
type PoseOptions = Pick<PosePair, 'facing' | 'view' | 'locked' | 'lifts'>
function pair(start: Pose, end: Pose, label: string, prop?: PosePair['prop'], options: Partial<PoseOptions> = {}): PosePair {
  return {
    start,
    end,
    label,
    prop,
    facing: options.facing ?? 'right',
    view: options.view ?? 'side',
    locked: options.locked,
    lifts: options.lifts,
  }
}
export const poses: Record<string, PosePair> = {
  'squat': pair(standing, squat, '双脚稳定 · 屈髋屈膝下蹲', 'weight', { facing: 'front', view: 'front', locked: [4, 6] }),
  'split': pair(change(standing, { 3: [170, 192], 4: [188, 246], 5: [104, 188], 6: [68, 202] }), change(lunge, { 4: [188, 246], 5: [84, 218], 6: [68, 202] }), '前脚全掌固定 · 后脚搭凳下沉', 'bench', { locked: [4, 6] }),
  'wall': pair(change(standing, { 0: [104, 52], 1: [104, 87], 2: [105, 154], 3: [148, 194], 4: [164, 246], 5: [132, 194], 6: [151, 246] }), change(squat, { 0: [103, 93], 1: [103, 126], 2: [104, 191], 3: [165, 194], 4: [164, 246], 5: [151, 201], 6: [151, 246] }), '背部沿墙下滑 · 双脚不移动', 'wall', { locked: [4, 6] }),
  'lunge': pair(change(standing, { 0: [137, 61], 1: [137, 96], 2: [132, 164], 3: [168, 190], 4: [188, 246], 5: [103, 191], 6: [64, 246] }), lunge, '分腿支撑固定 · 垂直下沉', undefined, { locked: [4, 6] }),
  'lateral': pair(standing, [[130, 69], [128, 104], [105, 170], [66, 199], [60, 246], [145, 195], [170, 246], [104, 132], [119, 150], [151, 132], [139, 151]], '一脚侧向迈出 · 另一脚稳定支撑', undefined, { facing: 'front', view: 'front', locked: [6], lifts: { 4: 18 } }),
  'step': pair(change(standing, { 2: [150, 160], 3: [176, 166], 4: [192, 204], 5: [145, 205], 6: [130, 246] }), change(standing, { 0: [186, 13], 1: [187, 48], 2: [187, 117], 3: [191, 163], 4: [192, 204], 5: [165, 151], 6: [151, 176] }), '上台脚全掌固定 · 支撑腿蹬伸', 'box', { locked: [4] }),
  'hinge': pair(standing, change(standing, { 0: [218, 103], 1: [189, 124], 2: [127, 163], 3: [150, 200], 5: [153, 201], 7: [191, 161], 8: [187, 200], 9: [179, 163], 10: [174, 202] }), '双脚稳定 · 臀部后移髋铰链', 'weight', { locked: [4, 6] }),
  'single-hinge': pair(change(standing, { 3: [132, 194], 4: [130, 246], 5: [173, 181], 6: [199, 216] }), change(standing, { 0: [225, 126], 1: [193, 145], 2: [131, 168], 3: [130, 208], 4: [130, 246], 5: [86, 156], 6: [42, 141], 7: [203, 184], 8: [205, 223], 9: [181, 186], 10: [180, 222] }), '支撑脚固定 · 躯干与后腿同步转动', undefined, { locked: [4] }),
  'bridge': pair(supine, change(supine, { 2: [154, 180], 3: [193, 195], 5: [190, 197] }), '双脚固定 · 抬髋至肩髋膝成线', undefined, { locked: [4, 6] }),
  'nordic': pair(change(standing, { 0: [140, 62], 1: [139, 94], 2: [139, 165], 3: [140, 226], 4: [83, 240], 5: [138, 225], 6: [88, 236] }), change(standing, { 0: [227, 134], 1: [202, 154], 2: [169, 188], 3: [139, 226], 4: [83, 240], 5: [137, 225], 6: [88, 236], 7: [220, 193], 8: [237, 226], 9: [206, 199], 10: [213, 236] }), '膝部支撑稳定 · 身体整体前倾', undefined, { locked: [4, 6] }),
  'calf': pair(standing, standing.map(([x, y]) => [x, y - 12]) as Pose, '前脚掌稳定 · 脚跟受控抬起', undefined, { facing: 'front', view: 'front' }),
  'seated': pair(seated, change(seated, { 4: [181, 233], 6: [164, 233] }), '前脚掌接触地面 · 脚跟抬起', 'bench'),
  'jump': pair(squat, change(standing, { 0: [147, 14], 1: [147, 49], 2: [147, 119], 3: [127, 164], 4: [119, 209], 5: [165, 167], 6: [173, 211], 7: [125, 60], 8: [114, 25], 9: [170, 62], 10: [181, 27] }), '屈髋屈膝蓄力 · 垂直蹬伸', undefined, { facing: 'front', view: 'front' }),
  'box': pair(squat, change(standing, { 0: [202, 10], 1: [200, 45], 2: [192, 111], 3: [214, 146], 4: [213, 204], 5: [179, 148], 6: [179, 204] }), '双脚起跳 · 完整落在低箱上', 'box'),
  'plank': pair(plank, plank, '肩、髋、踝保持一线 · 前臂支撑', undefined, { facing: 'left', locked: [4, 6, 8, 10] }),
  'side-plank': pair(change(plank, { 7: [103, 225], 8: [133, 244], 9: [144, 136], 10: [177, 102] }), change(plank, { 7: [103, 225], 8: [133, 244], 9: [144, 136], 10: [177, 102] }), '头、肩、髋与踝保持一线', undefined, { facing: 'left' }),
  'deadbug': pair(change(supine, { 3: [166, 177], 4: [207, 177], 5: [167, 183], 6: [209, 183], 7: [86, 181], 8: [86, 147], 9: [93, 185], 10: [93, 151] }), change(supine, { 3: [166, 177], 4: [207, 177], 5: [206, 227], 6: [249, 232], 7: [86, 181], 8: [86, 147], 9: [62, 221], 10: [27, 218] }), '对侧手脚伸远 · 躯干保持稳定'),
  'bird': pair(change(plank, { 2: [166, 173], 3: [173, 234], 4: [222, 240], 5: [163, 233], 6: [209, 240] }), change(plank, { 2: [166, 173], 3: [207, 168], 4: [253, 166], 5: [163, 233], 6: [209, 240], 7: [69, 162], 8: [34, 157] }), '对侧手脚伸远 · 躯干不旋转', undefined, { facing: 'left', locked: [6, 10] }),
  'twist': pair(seated, change(seated, { 7: [87, 148], 8: [63, 172], 9: [104, 156], 10: [70, 179] }), '胸椎带动手臂转向 · 骨盆稳定', undefined, { facing: 'front', view: 'front', locked: [4, 6] }),
  'press': pair(change(standing, { 7: [174, 103], 8: [156, 84], 9: [179, 104], 10: [162, 84] }), change(standing, { 7: [183, 83], 8: [218, 87], 9: [180, 89], 10: [214, 93] }), '双手向前推出 · 躯干不随带转动', 'band', { locked: [4, 6] }),
  'hang': pair(change(standing, { 7: [117, 52], 8: [107, 16], 9: [172, 52], 10: [185, 16] }), change(standing, { 0: [144, 25], 1: [144, 60], 2: [144, 128], 3: [124, 168], 4: [119, 215], 5: [162, 168], 6: [170, 215], 7: [109, 45], 8: [107, 16], 9: [183, 45], 10: [185, 16] }), '双手固定握杠 · 身体受控上移', 'bar', { facing: 'front', view: 'front', locked: [8, 10] }),
  'pushup': pair(plank, change(plank, { 0: [64, 196], 1: [95, 205], 2: [161, 215], 7: [74, 223], 8: [106, 246], 9: [88, 225], 10: [121, 246] }), '双手与脚尖固定 · 身体整体下降', undefined, { facing: 'left', locked: [4, 6, 8, 10] }),
  'row': pair(change(plank, { 0: [207, 89], 1: [181, 113], 2: [121, 159], 3: [132, 202], 4: [123, 246], 5: [87, 202], 6: [62, 246], 7: [188, 156], 8: [191, 194], 9: [170, 151], 10: [167, 190] }), change(plank, { 0: [207, 89], 1: [181, 113], 2: [121, 159], 3: [132, 202], 4: [123, 246], 5: [87, 202], 6: [62, 246], 7: [188, 156], 8: [191, 194], 9: [137, 109], 10: [144, 149] }), '支撑手与双脚稳定 · 肘拉向髋部', 'weight', { locked: [4, 6, 8] }),
  'overhead': pair(change(standing, { 7: [111, 84], 8: [111, 48], 9: [178, 84], 10: [178, 48] }), change(standing, { 7: [124, 42], 8: [128, 12], 9: [165, 42], 10: [163, 12] }), '双臂向上推举 · 躯干保持直立', 'weight', { facing: 'front', view: 'front', locked: [4, 6] }),
  'rotation': pair(change(standing, { 7: [122, 118], 8: [153, 117], 9: [170, 118], 10: [198, 118] }), change(standing, { 7: [122, 118], 8: [92, 111], 9: [170, 118], 10: [198, 118] }), '肘贴近躯干 · 前臂向外旋转', 'band', { facing: 'front', view: 'front', locked: [4, 6] }),
  'ytw': pair(change(supine, { 0: [55, 220], 1: [86, 222], 2: [154, 228], 7: [91, 188], 8: [69, 158], 9: [99, 189], 10: [121, 159] }), change(supine, { 0: [55, 220], 1: [86, 222], 2: [154, 228], 7: [105, 204], 8: [105, 169], 9: [105, 211], 10: [140, 211] }), '俯卧低幅抬臂 · Y 位转到 T / W 位', undefined, { facing: 'left' }),
  'wrist': pair(seated, change(seated, { 8: [182, 145], 10: [180, 149] }), '前臂保持支撑 · 手腕小幅控制', 'weight'),
  'run': pair(change(standing, { 3: [177, 179], 4: [172, 228], 5: [118, 198], 6: [75, 210], 7: [111, 109], 8: [84, 95], 9: [179, 108], 10: [171, 143] }), change(standing, { 5: [177, 179], 6: [172, 228], 3: [118, 198], 4: [75, 210], 9: [111, 109], 10: [84, 95], 7: [179, 108], 8: [171, 143] }), '对侧手脚交替 · 小步快速移动'),
  'burpee': pair(squat, plank, '双手撑地 · 双脚依次后撤至平板', undefined, { facing: 'left', lifts: { 4: 16, 6: 12 } }),
}
export function poseForExercise(id: string, base: string): PosePair {
  const p = poses[base]
  if (id === 'hip-thrust') {
    const start = change(supine, { 0: [55, 186], 1: [82, 202], 2: [151, 225], 3: [188, 198], 4: [220, 246], 5: [184, 201], 6: [211, 246] })
    const end = change(start, { 2: [154, 172], 3: [190, 193], 5: [187, 196] })
    return pair(start, end, '上背支撑训练凳 · 双脚固定抬髋', 'bench', { locked: [4, 6] })
  }
  if (id === 'hip-flexor') {
    const start = change(lunge, { 2: [127, 166], 5: [88, 214], 6: [68, 246] })
    return pair(start, change(start, { 0: [148, 65], 1: [145, 100], 2: [137, 168] }), '后膝着垫 · 轻收骨盆向前移动', undefined, { locked: [4, 6] })
  }
  if (id === 'calf-stretch') {
    const start = change(lunge, { 0: [122, 65], 1: [121, 100], 2: [126, 166], 3: [174, 191], 4: [188, 246], 5: [86, 192], 6: [52, 246], 7: [102, 126], 8: [83, 111], 9: [104, 135], 10: [83, 122] })
    return pair(start, change(start, { 0: [111, 68], 1: [110, 103], 2: [119, 169], 3: [170, 196] }), '后脚跟固定落地 · 身体轻向墙移动', 'wall', { facing: 'left', locked: [4, 6] })
  }
  if (id === 'ankle') {
    const start = change(lunge, { 0: [136, 67], 1: [134, 102], 2: [132, 168], 3: [166, 199], 4: [188, 246], 5: [108, 204], 6: [100, 246] })
    return pair(start, change(start, { 0: [128, 69], 1: [126, 104], 2: [126, 170], 5: [91, 199] }), '前脚跟固定 · 膝盖沿脚尖方向靠墙', 'wall', { facing: 'left', locked: [4, 6] })
  }
  if (id === 'world-stretch') {
    const start = change(lunge, { 0: [100, 127], 1: [120, 156], 2: [145, 220], 3: [188, 220], 4: [199, 246], 5: [103, 220], 6: [69, 246], 7: [145, 194], 8: [163, 238], 9: [124, 194], 10: [145, 233] })
    return pair(start, change(start, { 0: [119, 127], 1: [139, 145], 7: [116, 149], 8: [96, 114] }), '长弓步稳定 · 一侧手臂随胸椎打开', undefined, { facing: 'left', locked: [4, 6, 10] })
  }
  if (id === 'leg-raise')
    return pair(p.start, change(p.start, { 3: [193, 147], 4: [188, 196], 5: [185, 151], 6: [179, 198] }), '悬垂屈膝举腿 · 不摆动', 'bar')
  if (id === 'tib-raise')
    return pair(standing, change(standing, { 4: [120, 235], 6: [170, 235] }), '脚跟留地 · 前脚掌上抬', 'wall')
  if (id === 'thoracic')
    return pair(supine, change(supine, { 7: [60, 194], 8: [24, 168] }), '侧卧开书 · 膝保持叠放')
  if (id === 'hamstring-stretch')
    return pair(supine, change(supine, { 3: [168, 182], 4: [186, 134] }), '托住大腿 · 无痛伸膝')
  if (id === 'sleeper')
    return pair(supine, change(supine, { 7: [85, 188], 8: [119, 188] }), '侧卧肩内旋 · 勿用力压')
  if (id === 'face-pull')
    return pair(poses.press.end, change(standing, { 7: [103, 78], 8: [130, 49], 9: [185, 78], 10: [161, 49] }), '双手拉向脸旁 · 肩胛受控', 'band', { facing: 'front', view: 'front', locked: [4, 6] })
  if (id === 'tuck-jump') {
    const airborne = change(standing, { 0: [145, 18], 1: [145, 53], 2: [145, 122], 3: [118, 144], 4: [126, 187], 5: [172, 144], 6: [164, 187], 7: [120, 70], 8: [108, 38], 9: [170, 70], 10: [182, 38] })
    return pair(squat, airborne, '垂直起跳 · 空中适度屈髋抬膝', undefined, { facing: 'front', view: 'front' })
  }
  if (id === 'single-hop') {
    const start = change(standing, { 5: [168, 181], 6: [178, 213] })
    const end = change(start, { 0: [145, 24], 1: [145, 59], 2: [145, 128], 3: [125, 169], 4: [120, 215], 5: [169, 164], 6: [180, 196] })
    return pair(start, end, '单脚蹬地小幅起跳 · 同脚缓冲落地', undefined, { facing: 'front', view: 'front' })
  }
  if (id === 'split-step') {
    const ready = change(standing, { 0: [145, 49], 1: [145, 84], 2: [145, 153], 3: [128, 199], 4: [124, 246], 5: [162, 199], 6: [166, 246] })
    const land = change(squat, { 0: [145, 70], 1: [145, 105], 2: [145, 170], 3: [111, 204], 4: [96, 246], 5: [179, 204], 6: [194, 246] })
    return pair(ready, land, '低幅分腿落地 · 重心只小幅下降', undefined, { facing: 'front', view: 'front', lifts: { 4: 7, 6: 7 } })
  }
  if (id === 'rope') {
    const lowAir = standing.map(([x, y], index) => [x, y - (index === 4 || index === 6 ? 12 : 16)]) as Pose
    return pair(standing, lowAir, '前脚掌低幅离地 · 膝髋保持柔和', undefined, { facing: 'front', view: 'front' })
  }
  if (id === 'lateral-bound' || id === 'skater') {
    const left = change(standing, { 0: [112, 55], 1: [113, 90], 2: [108, 159], 3: [99, 202], 4: [91, 246], 5: [135, 187], 6: [161, 218] })
    const right = change(left, { 0: [178, 55], 1: [177, 90], 2: [182, 159], 3: [155, 187], 4: [129, 218], 5: [191, 202], 6: [199, 246] })
    return pair(left, right, '侧向蹬地转移 · 单脚落地后稳定', undefined, { facing: 'front', view: 'front', lifts: { 4: 18, 6: 18 } })
  }
  if (id === 'depth-jump') {
    const top = change(standing, { 0: [205, 9], 1: [205, 44], 2: [205, 113], 3: [188, 157], 4: [181, 204], 5: [221, 157], 6: [226, 204] })
    const land = change(squat, { 0: [125, 66], 1: [125, 101], 2: [125, 170], 3: [101, 201], 4: [96, 246], 5: [149, 201], 6: [154, 246] })
    return pair(top, land, '从低箱迈下 · 双脚屈髋屈膝缓冲', 'box', { facing: 'front', view: 'front' })
  }
  if (id === 'slam')
    return pair(poses.overhead.end, change(squat, { 7: [125, 134], 8: [139, 164], 9: [165, 134], 10: [151, 164] }), '球从头顶加速下砸 · 屈髋屈膝收势', 'weight', { facing: 'front', view: 'front', locked: [4, 6] })
  if (id === 'scap-pushup')
    return pair(plank, change(plank, { 0: [70, 155], 1: [101, 170], 2: [168, 184] }), '肘保持伸直 · 肩胛控制胸部小幅下沉', undefined, { facing: 'left', locked: [4, 6, 8, 10] })
  if (id === 'med-rotation' || id === 'woodchop') {
    const start = change(standing, { 7: [111, 108], 8: [91, 82], 9: [123, 112], 10: [101, 88] })
    const end = change(standing, { 0: [163, 44], 1: [160, 79], 2: [151, 147], 7: [166, 127], 8: [185, 153], 9: [155, 130], 10: [177, 158] })
    return pair(start, end, id === 'med-rotation' ? '腿髋带动躯干转向 · 双手随动' : '双手由肩侧斜向对侧髋部', id === 'woodchop' ? 'band' : 'weight', { facing: 'front', view: 'front', locked: [4, 6] })
  }
  if (id === 'split-jump')
    return pair(lunge, change(lunge, { 0: [134, 43], 1: [134, 76], 2: [133, 138], 3: [188, 158], 4: [188, 212], 5: [94, 187], 6: [64, 210] }), '分腿小幅起跳 → 稳定落地')
  if (id === 'copenhagen')
    return { ...poses['side-plank'], prop: 'bench', label: '上侧膝支撑 · 短杠杆侧桥' }
  return p
}
