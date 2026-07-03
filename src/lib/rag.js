import { supabase } from './supabase'
import { getDimension } from './dimensions'

// MVP 知识源：训练营课件的最小切片。
// 生产环境这些 chunk 存在 Supabase 的 course_chunks 表；本地/演示用此内置兜底，
// 保证 RAG 检索在未灌库时也能跑通。检索优先读 DB，为空时回退到这里。
export const FALLBACK_CHUNKS = [
  {
    content: '北极星指标是唯一能代表产品核心价值的指标，选取标准是"用户获得价值时一定会触发它"。AI 产品尤其要区分"调用量"（虚荣指标）和"用户真正采纳 AI 结果的比例"（价值指标）。',
    dimension_tags: ['product'],
    keywords: ['北极星指标', '成功指标', '价值指标', '采纳率'],
  },
  {
    content: 'AI 产品冷启动无历史数据时的三条路：一是用规则/专家经验兜底先上线跑数据，二是借公开数据集或竞品公开信息做初始化，三是用小样本 + 人工标注滚动积累。切忌等数据齐了再上线。',
    dimension_tags: ['product'],
    keywords: ['冷启动', '数据来源', '规则兜底', '标注'],
  },
  {
    content: 'RAG（检索增强生成）适用于知识频繁更新、需要可溯源、且知识量超出上下文窗口的场景。相比微调，RAG 更新成本低、可解释；但答案质量受限于检索召回，召回不到就答不对。',
    dimension_tags: ['ai-tech'],
    keywords: ['RAG', '检索增强', '微调', '召回', '可溯源'],
  },
  {
    content: 'Agent 与单次 LLM 调用的区别在于"多步 + 工具调用 + 反思"。何时用 Agent：任务需要拆解、调外部工具、且中间结果不确定。代价是延迟高、成本高、可控性差，简单任务不要上 Agent。',
    dimension_tags: ['ai-tech'],
    keywords: ['Agent', '工具调用', '多步', '成本', '延迟'],
  },
  {
    content: '讲项目用 STAR 或"问题→决策→结果"结构：先说要解决的真实问题和约束，再说你做了哪些关键决策和取舍（为什么不选另一个方案），最后用数字说结果。面试官最想听的是"决策和取舍"，不是功能罗列。',
    dimension_tags: ['narrative'],
    keywords: ['STAR', '项目叙事', '问题决策结果', 'tradeoff', '量化'],
  },
  {
    content: '金字塔原理：结论先行，再给 3 个左右并列的支撑论据，每个论据下再展开。汇报 AI 项目时先抛结论（做了什么、带来什么价值），再展开技术选型和数据，避免从背景讲起把人绕晕。',
    dimension_tags: ['narrative'],
    keywords: ['金字塔', '结论先行', '结构化表达', '汇报'],
  },
  {
    content: 'AI PM 与算法团队协作的关键交付物是"评测集"和"验收标准"：PM 负责定义什么算好（badcase 集、准确率/召回底线），算法负责实现。没有评测集的需求，算法无法交付，也无法验收。',
    dimension_tags: ['workflow'],
    keywords: ['协作', '评测集', '验收标准', '算法团队', 'badcase'],
  },
  {
    content: 'AI 项目推进节奏不同于传统需求：先小样本验证可行性（PoC）再定方案，上线后要留灰度和回滚，并建立持续评测与迭代循环。数据标注、模型评测、上线灰度是 AI PM 日常绕不开的三件事。',
    dimension_tags: ['workflow'],
    keywords: ['项目推进', 'PoC', '灰度', '评测', '迭代', '标注'],
  },
]

// 关键词检索 top-k：按 dimension_tags 命中 + 关键词与该维度主题词的重叠打分。
// MVP 不上向量库，纯关键词匹配即可证明"用课件约束 LLM"这个概念。
export async function retrieveChunks(dimKey, { limit = 3 } = {}) {
  let chunks = []
  try {
    // 检索不应阻塞 UI：DB 查询设 2s 超时，超时/失败/空表均回退内置课件
    const query = supabase.from('course_chunks').select('content, dimension_tags, keywords')
    const timeout = new Promise(resolve => setTimeout(() => resolve({ data: null }), 2000))
    const { data } = await Promise.race([query, timeout])
    if (data && data.length) chunks = data
  } catch {
    // 表不存在或查询失败 → 用内置兜底
  }
  if (!chunks.length) chunks = FALLBACK_CHUNKS

  const dim = getDimension(dimKey)
  const queryTerms = dim
    ? `${dim.topics} ${dim.label}`.split(/[·\s]+/).filter(Boolean)
    : []

  const scored = chunks.map(c => {
    const tags = c.dimension_tags || []
    const kws = c.keywords || []
    const tagScore = tags.includes(dimKey) ? 2 : 0
    const kwScore = kws.filter(k => queryTerms.some(t => t.includes(k) || k.includes(t))).length
    return { content: c.content, score: tagScore + kwScore }
  })

  scored.sort((a, b) => b.score - a.score)
  const hits = scored.filter(x => x.score > 0)
  return (hits.length ? hits : scored).slice(0, limit).map(x => x.content)
}
