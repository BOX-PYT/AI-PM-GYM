// 一次性脚本：把飞书学习笔记切片、按能力维度打标，生成 course_chunks 的种子 SQL。
// 用法：node scripts/ingest-notes.mjs > course_chunks_seed_v2.sql
// 只读本地笔记文件、只写本地 SQL 文件，不直接连接生产数据库——
// 生成的 SQL 仍由用户手动在 Supabase SQL Editor 执行，保持人工确认这道关卡。

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const NOTES_DIR = 'D:/PYT/project/飞书文档同步/学习笔记'

// 文件 → 默认维度（可多维）。跳过的文件：Z-课代表立正(空)、0-AI PM 知识体系(仅目录)、
// Agent概念、架构与真实产品.md(是 E-Agent专项.md 的子集，避免重复内容)、
// 0611 Day1 总结(据 memory 记录为 GPT 代笔，非用户真实笔记，不适合当"我的课件"素材)。
const FILES = [
  { name: 'A-产品经理通识.md', dims: ['product', 'narrative'] },
  { name: 'B-AI技术理论.md', dims: ['ai-tech'] },
  { name: 'C-AI产品搭建.md', dims: ['product'] },
  { name: 'D-AI Coding.md', dims: ['ai-tech'] },
  { name: 'E-Agent专项.md', dims: ['ai-tech'] },
  { name: 'ai-exam-notes.md', dims: ['ai-tech'] },
  { name: 'ai-exam-qa.md', dims: ['ai-tech', 'narrative'] },
]

// 命中这些关键词的小节，额外打上 workflow 标签（跨文件零散分布，不适合整文件归类）
const WORKFLOW_HINTS = /协作|评审|迭代节奏|跨部门|上线|灰度|评测集|需求评审|流程重塑|PoC|降级方案/

// 维度关键词池：用于给每条 chunk 提取 keywords（简单包含匹配，MVP 够用）
const KEYWORD_POOL = [
  '北极星指标', '需求优先级', '成功指标', '冷启动', '商业价值', '用户体验', '技术实现',
  '可持续', 'PRD', '需求分析', '原型验证', 'PoC', '降级方案', '能力翻译',
  'RAG', 'Agent', 'Prompt', '微调', 'Token', 'Embedding', 'Agent Loop', '工具调用',
  '模型对比', '大模型', '幻觉', '评测', '召回',
  'STAR', '场景应用', '综合分析', '案例', '决策', 'tradeoff', '结构化表达',
  '协作', '评审', '迭代', '跨部门', '灰度', '评测集', '需求评审', '流程重塑',
]

function cleanText(raw) {
  return raw
    .replace(/!\[.*?\]\(.*?\)/g, '') // 图片链接（飞书内部图床，无文本价值）
    .replace(/<title[\s\S]*?<\/title>/gi, '') // 飞书导出的标题标签，和文件名重复
    .replace(/<cite[\s\S]*?<\/cite>/gi, '') // 文档引用标签
    .replace(/<\/?[a-zA-Z][^>]*>/g, '') // 其余零散 HTML 标签（table/tr/td/whiteboard 等），保留标签内文本
    .replace(/^-{3,}$/gm, '') // 分隔线
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function extractKeywords(text, heading) {
  const hay = heading + ' ' + text
  const hits = KEYWORD_POOL.filter(k => hay.includes(k))
  return hits.slice(0, 6)
}

function tagDims(heading, text, dims) {
  // 按最终 chunk 文本本身判断 workflow，而不是按整个大章节——避免一处命中、全章节被误标
  return WORKFLOW_HINTS.test(heading + text) ? [...new Set([...dims, 'workflow'])] : dims
}

function chunkSection(heading, body, dims) {
  const text = cleanText(body)
  if (!text) return []

  const MAX = 700
  if (text.length <= MAX) {
    return [{ heading, content: text, dims: tagDims(heading, text, dims) }]
  }
  // 超长小节按空行分段，贪心拼到接近 MAX；不设分段数上限，避免丢内容
  const paras = text.split(/\n\n+/).filter(Boolean)
  const chunks = []
  let buf = ''
  for (const p of paras) {
    if ((buf + '\n\n' + p).length > MAX && buf) {
      chunks.push(buf.trim())
      buf = p
    } else {
      buf = buf ? buf + '\n\n' + p : p
    }
  }
  if (buf) chunks.push(buf.trim())
  return chunks.map(c => ({ heading, content: c, dims: tagDims(heading, c, dims) }))
}

function splitByHeading(raw) {
  // 按 "## " 或 "### " 边界切分（取更细粒度），标题之前的内容归入首个匿名小节
  const lines = raw.split('\n')
  const sections = []
  let curHeading = ''
  let curBody = []
  for (const line of lines) {
    if (/^#{2,3} /.test(line)) {
      if (curBody.length) sections.push({ heading: curHeading, body: curBody.join('\n') })
      curHeading = line.replace(/^#{2,3} /, '').trim()
      curBody = []
    } else {
      curBody.push(line)
    }
  }
  if (curBody.length) sections.push({ heading: curHeading, body: curBody.join('\n') })
  return sections
}

function sqlEscape(s) {
  return s.replace(/'/g, "''")
}

const allChunks = []
for (const f of FILES) {
  const path = join(NOTES_DIR, f.name)
  let raw
  try {
    raw = readFileSync(path, 'utf-8')
  } catch (e) {
    console.error(`跳过（读取失败）: ${f.name}`, e.message)
    continue
  }
  const sections = splitByHeading(raw)
  for (const s of sections) {
    const chunks = chunkSection(s.heading || f.name, s.body, f.dims)
    for (const c of chunks) {
      if (c.content.length < 20) continue // 太短的碎片不值得当 chunk
      allChunks.push({
        content: c.content,
        dims: c.dims,
        keywords: extractKeywords(c.content, c.heading),
        source: f.name,
      })
    }
  }
}

console.error(`共生成 ${allChunks.length} 条候选 chunk，来源 ${FILES.length} 个文件`)

// 精选：按维度取质量分 top-N，控制公开发布的内容量（course_chunks 对 anon 公开可读）
const PER_DIM_TARGET = 14
function qualityScore(c) {
  const len = c.content.length
  const lenScore = len >= 150 && len <= 700 ? 2 : len > 700 ? 1 : 0.5 // 太短的片段信息量低
  const kwScore = c.keywords.length // 命中关键词多 = 概念更聚焦
  const headingScore = c.heading && c.heading.length > 2 ? 1 : 0 // 有明确小标题的更成体系
  return lenScore + kwScore + headingScore
}

const scored = allChunks.map(c => ({ ...c, score: qualityScore(c) }))
const selected = new Set()
for (const dim of ['product', 'ai-tech', 'narrative', 'workflow']) {
  const candidates = scored
    .filter(c => c.dims.includes(dim))
    .sort((a, b) => b.score - a.score)
    .slice(0, PER_DIM_TARGET)
  candidates.forEach(c => selected.add(c))
}
const curated = [...selected]

console.error(`精选后：${curated.length} 条`)
const byDimCurated = {}
for (const c of curated) for (const d of c.dims) byDimCurated[d] = (byDimCurated[d] || 0) + 1
console.error('精选后各维度分布：', byDimCurated)

const sqlLines = []
sqlLines.push('-- 真实课件种子 v2：来自飞书学习笔记（D:/PYT/project/飞书文档同步/学习笔记），已按质量精选')
sqlLines.push('-- 由 scripts/ingest-notes.mjs 生成，替换掉此前的占位 8 条示例内容')
sqlLines.push('delete from course_chunks;')
sqlLines.push('')
sqlLines.push('insert into course_chunks (content, dimension_tags, keywords) values')
const values = curated.map(c => {
  const dims = c.dims.map(d => `'${d}'`).join(',')
  const kws = c.keywords.map(k => `'${sqlEscape(k)}'`).join(',')
  return `('${sqlEscape(c.content)}', array[${dims}], array[${kws}])`
})
sqlLines.push(values.join(',\n') + ';')

writeFileSync('course_chunks_seed_v2.sql', sqlLines.join('\n'), 'utf-8')
console.error('已写入 course_chunks_seed_v2.sql')
