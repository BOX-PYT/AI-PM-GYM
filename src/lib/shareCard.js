import { DIMENSIONS } from './dimensions'

// 生成能力体检分享卡（1080×1440，适合小红书竖图），返回 PNG dataURL。
// 内容：雷达图 + 4 维分数 + 一句锐评 + 产品水印。纯前端 canvas，无需后端。
export function createShareCardDataURL(levels, nickname = '') {
  const W = 1080, H = 1440
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // 背景渐变
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#0f172a')
  g.addColorStop(1, '#1e293b')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  ctx.textAlign = 'center'

  // 标题
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 58px sans-serif'
  ctx.fillText('我的 AI PM 能力雷达', W / 2, 128)
  if (nickname) {
    ctx.fillStyle = '#94a3b8'
    ctx.font = '30px sans-serif'
    ctx.fillText(nickname, W / 2, 180)
  }

  // 雷达
  const cx = W / 2, cy = 660, R = 280
  const n = DIMENSIONS.length
  const pt = (i, frac) => {
    const a = (-90 + i * (360 / n)) * Math.PI / 180
    return [cx + R * frac * Math.cos(a), cy + R * frac * Math.sin(a)]
  }

  // 网格环
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 2
  for (const f of [0.25, 0.5, 0.75, 1]) {
    ctx.beginPath()
    DIMENSIONS.forEach((_, i) => { const [x, y] = pt(i, f); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y) })
    ctx.closePath()
    ctx.stroke()
  }
  // 轴线
  DIMENSIONS.forEach((_, i) => {
    const [x, y] = pt(i, 1)
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke()
  })

  // 数据多边形
  ctx.beginPath()
  DIMENSIONS.forEach((d, i) => {
    const v = Math.max(0.04, (levels[d.key] || 0) / 100)
    const [x, y] = pt(i, v); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
  })
  ctx.closePath()
  ctx.fillStyle = 'rgba(129,140,248,0.35)'
  ctx.fill()
  ctx.strokeStyle = '#818cf8'
  ctx.lineWidth = 3
  ctx.stroke()

  // 顶点 + 维度标签 + 分数
  DIMENSIONS.forEach((d, i) => {
    const v = Math.max(0.04, (levels[d.key] || 0) / 100)
    const [x, y] = pt(i, v)
    ctx.fillStyle = d.color
    ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill()
    const [lx, ly] = pt(i, 1.2)
    ctx.fillStyle = '#e2e8f0'
    ctx.font = 'bold 32px sans-serif'
    ctx.fillText(d.label, lx, ly)
    ctx.fillStyle = d.color
    ctx.font = 'bold 36px sans-serif'
    ctx.fillText(String(levels[d.key] || 0), lx, ly + 42)
  })

  // 锐评（本地生成，不耗 API）
  const sorted = [...DIMENSIONS].sort((a, b) => (levels[b.key] || 0) - (levels[a.key] || 0))
  const top = sorted[0], low = sorted[sorted.length - 1]
  ctx.fillStyle = '#cbd5e1'
  ctx.font = '32px sans-serif'
  ctx.fillText(`最强【${top.label}】${levels[top.key] || 0}   短板【${low.label}】${levels[low.key] || 0}`, W / 2, 1150)
  ctx.fillStyle = '#64748b'
  ctx.font = '28px sans-serif'
  ctx.fillText('补齐短板，就能上一个台阶', W / 2, 1200)

  // 水印
  ctx.fillStyle = '#818cf8'
  ctx.font = 'bold 42px sans-serif'
  ctx.fillText('AI PM GYM', W / 2, 1330)
  ctx.fillStyle = '#475569'
  ctx.font = '26px sans-serif'
  ctx.fillText('AI 产品经理能力，练出来的', W / 2, 1372)

  return canvas.toDataURL('image/png')
}
