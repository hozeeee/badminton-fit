# 羽练 · Badminton Fit

纯前端羽毛球体能训练网站：用三视角肌肉图理解身体，通过动作库建立训练计划，并在本地完成打卡与统计。

## 功能

- 正面、侧面、背面可交互肌肉 SVG，含深层肌肉索引
- 训练动作库、参数化动作示意、目标肌肉与专项技术关联
- 8 套预设计划及自定义计划编辑器
- 今日训练、休息计时、RPE、月历与肌肉训练分布
- `Ctrl/⌘ + K` 全局搜索、响应式布局和暗黑模式
- localStorage 持久化、JSON 导入导出，不上传训练数据
- 常规 PWA 与可离线打开的单 HTML 两种构建产物

## 本地开发

需要 Node.js 22 和 pnpm 10。

```bash
pnpm install
pnpm dev
```

质量检查：

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## 构建

常规 PWA 构建输出到 `dist/`：

```bash
pnpm build
pnpm preview
```

单 HTML 构建输出到 `dist-single/index.html`：

```bash
pnpm build:single
```

单 HTML 使用 Hash Router，可直接以 `file://` 打开。图解、计划、打卡与本地数据离线可用；B 站播放器和外部参考链接仍需要网络。常规构建使用相对 `base`，可部署到 GitHub Pages 子路径。

## 数据与隐私

训练计划、当前日程和打卡记录仅保存在当前浏览器的 localStorage。清理浏览器数据、隐私模式或更换文件位置可能导致数据不可用，请在“资料来源与数据设置”中定期导出 JSON 备份。

## 内容来源与边界

解剖资料主要参考 Kenhub 与 TeachMeAnatomy，动作规范参考 ACE Exercise Library 与 NSCA，羽毛球专项内容参考 BWF Shuttle Time，跨步相关说明参考 NCBI PMC 收录的公开研究。完整链接和逐条说明位于网站“资料来源与数据设置”页面及 `src/data/sources.ts`。

本站内容用于健康成年人的运动学习，不构成医疗诊断或个体化处方。SVG 为原创风格化示意，不可替代医学解剖图、现场教练或医疗评估。专项训练关联不等于疗效或比赛表现承诺。

## 自动化

- `ci.yml`：lint、类型检查、测试及双构建
- `deploy.yml`：`main` 分支部署 GitHub Pages，并上传单 HTML artifact
- `release.yml`：`v*` tag 构建 GitHub Release 并附加单 HTML

## License

代码以 [MIT License](LICENSE) 发布。站内第三方资料与外链内容的版权归各自权利人所有。
