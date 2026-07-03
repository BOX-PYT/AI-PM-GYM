// AI PM 能力维度模型 —— 产品主轴（取代旧的 5 阶段/5 方向）
// 4 个并列能力条，每个维度有一个可增长、无上限的水平值。
// 维度直接对应真实用户卡点（见 DECISIONS.md）。

export const DIMENSIONS = [
  {
    key: 'product',
    label: '产品认知',
    color: '#8b5cf6',
    why: '懂需求、优先级、成功指标、生命周期——AI PM 的地基。',
    metric: '能对一个 AI 功能说清需求、优先级和成功指标',
    topics: '北极星指标 · 需求优先级 · 冷启动 · 幻觉治理 · 成功指标定义',
  },
  {
    key: 'ai-tech',
    label: 'AI 技术理解',
    color: '#0ea5e9',
    why: '知道 LLM/RAG/Agent 能做什么、边界在哪、成本多少。',
    metric: '能讲清 LLM/RAG/Agent 各自能做什么、边界、成本',
    topics: 'RAG · Agent · Token · Embedding · 微调 vs 提示 · 推理成本',
  },
  {
    key: 'narrative',
    label: '项目叙事',
    color: '#10b981',
    why: '能把一个 AI 项目讲成"问题→决策→结果"的故事。',
    metric: '3 分钟内用"问题→决策→结果"讲清一个项目',
    topics: 'STAR 结构 · 金字塔表达 · 量化成果 · tradeoff 讲解 · 竞品对比',
  },
  {
    key: 'workflow',
    label: '真实工作流认知',
    color: '#f59e0b',
    why: '知道 AI PM 每天干嘛、怎么和算法/研发/设计协作推进。',
    metric: '能说清 AI PM 怎么和算法/研发/设计协作推进一个项目',
    topics: '需求评审 · 与算法团队协作 · 数据与标注 · 评测上线 · 迭代节奏',
  },
]

export const DIMENSION_MAP = Object.fromEntries(DIMENSIONS.map(d => [d.key, d]))

// 旧训练方向（英文路由 key）→ 新能力维度（旧路由回退用，如 /train/ai-thinking）
export const LEGACY_DIRECTION_TO_DIMENSION = {
  'ai-thinking': 'product',
  tech: 'ai-tech',
  expression: 'narrative',
  insight: 'product',
  comprehensive: 'product',
}

// 旧训练方向（records.direction 存的中文标签）→ 新能力维度
// 用于重构前、还没被回填脚本补上 dimension 字段的历史记录
export const LEGACY_LABEL_TO_DIMENSION = {
  'AI 产品思维': 'product',
  技术理解力: 'ai-tech',
  结构化表达: 'narrative',
  行业洞察: 'product',
  综合训练: 'product',
}

export function getDimension(key) {
  return DIMENSION_MAP[key] || DIMENSION_MAP[LEGACY_DIRECTION_TO_DIMENSION[key]] || null
}

// 统一解析一条 record 归属的维度 key：优先用新字段 dimension，
// 缺失时按旧中文 direction 标签兜底。
export function resolveRecordDimension(record) {
  return record.dimension || LEGACY_LABEL_TO_DIMENSION[record.direction] || null
}

// 单维度水平值：Q（近 k 题平均分）× M（答题量边际递减）
// scores 按时间升序传入（旧→新）。
export function dimensionLevel(scores, { k = 10, N = 15 } = {}) {
  const valid = (scores || []).filter(s => typeof s === 'number')
  const n = valid.length
  if (n === 0) return 0
  const recent = valid.slice(-k)
  const Q = recent.reduce((a, b) => a + b, 0) / recent.length
  const M = 1 - Math.exp(-n / N)
  return Math.round(Q * M)
}

// 从 records 计算 4 维度水平值。records 需含 dimension(或旧 direction) + score + created_at。
export function computeDimensionLevels(records) {
  const byDim = { product: [], 'ai-tech': [], narrative: [], workflow: [] }
  const sorted = [...(records || [])].sort(
    (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0)
  )
  for (const r of sorted) {
    const dimKey = resolveRecordDimension(r)
    if (!byDim[dimKey]) continue
    if (typeof r.score === 'number') byDim[dimKey].push(r.score)
  }
  const out = {}
  for (const key of Object.keys(byDim)) out[key] = dimensionLevel(byDim[key])
  return out
}
