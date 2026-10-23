import { Download, Info, ShieldCheck, Smartphone, Trash2, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { EvidenceList, PageTitle, SourceLinks } from '../components/ui'
import { evidence } from '../data/evidence'
import { disclaimer, sources } from '../data/sources'
import { exportData, storageWarning, useStore } from '../store'
import { dateKey } from '../utils/dates'

interface InstallPrompt extends Event { prompt: () => Promise<void>, userChoice: Promise<{ outcome: string }> }
export function About() {
  const { importData, clear, theme, setTheme } = useStore()
  const [merge, setMerge] = useState(true)
  const [message, setMessage] = useState('')
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setPrompt(e as InstallPrompt) }
    const installed = () => setPrompt(null)
    window.addEventListener('beforeinstallprompt', handler); window.addEventListener('appinstalled', installed)
    return () => { window.removeEventListener('beforeinstallprompt', handler); window.removeEventListener('appinstalled', installed) }
  }, [])
  const download = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(exportData(), null, 2)], { type: 'application/json' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `badminton-fit-${dateKey()}.json`; anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage('备份已发起下载，请确认文件保存成功。')
  }
  return (
    <>
      <PageTitle eyebrow="SOURCES & SETTINGS / EVIDENCE MATTERS" title="让训练有依据，让数据属于你。" description="羽练是纯前端工具，没有账号，也不上传你的训练记录。外链资料和视频由第三方服务提供。" />
      <div className="settings-layout">
        <div className="panel detail-block">
          <h3>
            <ShieldCheck size={21} />
            使用边界与内容说明
          </h3>
          <p>{disclaimer}</p>
          <p>资料按解剖、通用动作、专项教学与研究区分。功能和附着点是自主整理的学习简述。“羽毛球作用”与动作关联分三档：跨步和正手杀球的肩部肌肉有羽毛球实测肌电研究；跨步负荷有生物力学综述；其余均为基于解剖功能的推导，不是临床或训练效果证明。肌电幅值高只代表激活更强，不等于这块肌肉“更重要”。</p>
          <p>训练量与 8 套计划为本站一般模板，并非 ACE、NSCA 或 BWF 官方处方。动作库覆盖常见训练类别，不能声称穷尽所有动作及变式。SVG 是原创风格化图，不应按其像素判断解剖边界；动作动画仅做姿态示意，不能替代真实示范。</p>
          <p>B 站只为能核对标题和 BV 的教学条目提供播放器，非官方搬运会明确标注；未核实的视频不编造链接。部分网站限制抓取，其公开目录用于一般技术参考，具体动作应继续查阅来源或咨询教练。</p>
          <span className="tag">
            <Info size={14} />
            来源核对与本站概括，不代表来源机构背书
          </span>
        </div>
        <div>
          <div className="panel detail-block">
            <h3>我的数据</h3>
            <p>保存在当前浏览器的 localStorage。清理浏览器、隐私模式或移动单 HTML 文件可能使数据不可用，请定期导出。</p>
            {storageWarning && <p className="error">{storageWarning}</p>}
            <div className="backup-actions">
              <button className="btn primary" onClick={download}>
                <Download size={17} />
                导出 JSON 备份
              </button>
              <button className="btn secondary" onClick={() => input.current?.click()}>
                <Upload size={17} />
                导入备份
              </button>
            </div>
            <label className="check-label">
              <input type="checkbox" checked={merge} onChange={e => setMerge(e.target.checked)} />
              合并现有数据（取消勾选则覆盖）
            </label>
            <small>合并时同日同计划的打卡使用导入值；计划 ID 相同但内容不同会拒绝合并，以免破坏历史。</small>
            <input
              ref={input}
              type="file"
              accept=".json,application/json"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0]; e.target.value = ''
                if (!file)
                  return
                if (file.size > 20 * 1024 * 1024) { setMessage('文件过大，最多支持 20 MB。'); return }
                try {
                  const data: unknown = JSON.parse(await file.text())
                  if (!merge && !window.confirm('覆盖会替换全部计划和打卡，建议先导出。确定继续？'))
                    return
                  importData(data, merge); setMessage('备份已校验并导入。')
                }
                catch (error) { setMessage(`导入失败：${(error as Error).message}`) }
              }}
            />
            {message && <p className="save-message" role="status">{message}</p>}
            <button className="text-link danger" onClick={() => { if (window.confirm('清空全部自定义计划和打卡？此操作不可撤销，请先导出备份。')) { clear(); setMessage('本地训练数据已清空。') } }}>
              <Trash2 size={16} />
              清空训练数据
            </button>
          </div>
          <div className="panel detail-block">
            <h3>外观与离线</h3>
            <label className="field">
              主题
              <select value={theme} onChange={e => setTheme(e.target.value as typeof theme)}>
                <option value="system">跟随系统</option>
                <option value="light">明亮</option>
                <option value="dark">暗黑</option>
</select>
            </label>
            <p>多文件版在 HTTPS 或 localhost 下首次打开后可缓存离线，支持安装（取决于浏览器）。单 HTML 可直接离线打开，外链与视频除外。</p>
            {prompt
              ? (
                  <button className="btn secondary" onClick={async () => { await prompt.prompt(); await prompt.userChoice; setPrompt(null) }}>
                    <Smartphone size={17} />
                    安装羽练
                  </button>
                )
              : <small>如浏览器支持，可从地址栏安装；iOS 使用 Safari → 分享 → 添加到主屏幕。</small>}
          </div>
        </div>
      </div>
      <div className="section-title">
        <h2>
          关键研究发现
          <span className="count">{evidence.length}</span>
        </h2>
        <small>只收录已读到原文的结论，并注明局限</small>
      </div>
      <EvidenceList items={evidence} />
      <div className="section-title">
        <h2>
          参考资料目录
          <span className="count">{sources.length}</span>
        </h2>
      </div>
      {['解剖', '动作', '专项', '研究'].map(kind => (
        <section className="source-section" key={kind}>
          <h3>
            {kind}
            资料
          </h3>
          <SourceLinks ids={sources.filter(s => s.kind === kind).map(s => s.id)} />
        </section>
      ))}
    </>
  )
}
