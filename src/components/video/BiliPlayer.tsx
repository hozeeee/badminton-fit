/* eslint-disable react-dom/no-missing-iframe-sandbox -- B 站官方播放器无法在受限 sandbox 中正常运行，且地址固定为 B 站官方跨域域名。 */
import type { Exercise } from '../../types'
import { ExternalLink, Play, WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'

export function BiliPlayer({ exercise }: { exercise: Exercise }) {
  const [loaded, setLoaded] = useState(false)
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    window.addEventListener('online', update); window.addEventListener('offline', update)
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update) }
  }, [])
  const video = exercise.video
  const href = video ? `https://www.bilibili.com/video/${video.bv}/` : `https://search.bilibili.com/all?keyword=${encodeURIComponent(`${exercise.name} 教学`)}`
  return (
    <div className="video-block">
      <h3>视频教学</h3>
      {video && online && loaded
        ? <iframe title={video.title} src={`https://player.bilibili.com/player.html?bvid=${video.bv}&poster=1&autoplay=0&danmaku=0`} allow="fullscreen; picture-in-picture" allowFullScreen loading="lazy" referrerPolicy="no-referrer" />
        : (
            <div className="video-placeholder">
              {online ? <Play size={30} /> : <WifiOff size={30} />}
              <strong>{!online ? '离线时无法加载视频' : video ? video.title : '此动作暂未收录可靠的 B 站视频'}</strong>
              <p>{video ? video.author : '可参考原始资料，或自行搜索并核对教练资质。搜索结果不等于本站推荐。'}</p>
              {video && online && <button className="btn secondary" onClick={() => setLoaded(true)}>加载 B 站播放器</button>}
            </div>
          )}
      <a className="text-link" href={href} target="_blank" rel="noreferrer">
        {video ? '在 B 站打开视频' : '在 B 站搜索该动作'}
        <ExternalLink size={15} />
      </a>
      <small>
        {video?.note || '为保证可核实性，不编造视频 BV 号。'}
        {' '}
        播放器会连接第三方服务，可能包含 B 站广告、登录提示或隐私追踪。
      </small>
    </div>
  )
}
