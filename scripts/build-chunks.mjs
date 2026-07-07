// 把训练营课件笔记切成 course_chunks 种子 SQL。
// 用法: node scripts/build-chunks.mjs <docs目录> > course_chunks_seed_v3.sql
// 切块规则：按 ###（无则 ##）标题分节，超长节按段落再切；关键词 = 标题词 + 内容加粗术语。

import fs from 'node:fs'
import path from 'node:path'

const DOCS_DIR = process.argv[2]
if (!DOCS_DIR) {
  console.error('用法: node scripts/build-chunks.mjs <docs目录>')
  process.exit(1)
}

// 知识型文件 → 维度标签。题目类（100-questions 等）与仓库文档不入库。
const SOURCES = {
  'ai-exam-notes.md': ['ai-tech'],
  'ai-exam-qa.md': ['ai-tech', 'product'],
  'ai-pm-integrated-notes.md': ['product', 'workflow'],
  'ai-products-deep-dive.md': ['product'],
  'easily-confused-pairs.md': ['ai-tech'],
  'interview-concept-answers.md': ['narrative', 'ai-tech'],
  'interview-projects-deep-prep.md': ['narrative'],
  'mindmap-a-pm-basics.md': ['product'],
  'mindmap-b-ai-theory.md': ['ai-tech'],
  'mindmap-c-ai-product-build.md': ['workflow', 'product'],
  'mindmap-d-ai-coding.md': ['ai-tech'],
  'mindmap-e-agent.md': ['ai-tech'],
}

const MAX_LEN = 700 // 单 chunk 字符上限，超长按段落二切
const MIN_LEN = 40  // 过短的节（只有标题没内容）丢弃

function splitSections(md) {
  // 优先按 ### 切；文件里没有 ### 就按 ## 切
  const level = /^###\s/m.test(md) ? '###' : '##'
  const re = new RegExp(`^${level}\\s+(.+)$`, 'gm')
  const sections = []
  let match
  const marks = []
  while ((match = re.exec(md))) marks.push({ title: match[1].trim(), start: match.index, bodyStart: match.index + match[0].length })
  for (let i = 0; i < marks.length; i++) {
    const end = i + 1 < marks.length ? marks[i + 1].start : md.length
    sections.push({ title: marks[i].title, body: md.slice(marks[i].bodyStart, end).trim() })
  }
  return sections
}

function splitLong(title, body) {
  if (body.length <= MAX_LEN) return [{ title, body }]
  const paras = body.split(/\n{2,}/)
  const parts = []
  let cur = ''
  for (const p of paras) {
    if (cur && (cur.length + p.length) > MAX_LEN) {
      parts.push(cur.trim())
      cur = p
    } else {
      cur = cur ? cur + '\n\n' + p : p
    }
  }
  if (cur.trim()) parts.push(cur.trim())
  return parts.map((body, i) => ({ title: parts.length > 1 ? `${title}（${i + 1}）` : title, body }))
}

function extractKeywords(title, body) {
  const kws = new Set()
  // 标题词：去掉编号前缀（"1.3 " "一、"）
  const cleanTitle = title.replace(/^[\d.、一二三四五六七八九十\s]+/, '').trim()
  if (cleanTitle) kws.add(cleanTitle.slice(0, 20))
  // 内容里的加粗术语
  for (const m of body.matchAll(/\*\*([^*\n]{2,16})\*\*/g)) {
    const t = m[1].trim().replace(/[：:。，,]$/, '')
    if (t && !/^\d+$/.test(t)) kws.add(t)
  }
  // 常见技术名词兜底
  for (const term of ['RAG', 'Agent', 'Prompt', 'MCP', 'Token', 'Embedding', '微调', '幻觉', '召回', '北极星', '冷启动', '评测', '灰度', 'badcase', 'A/B']) {
    if (title.includes(term) || body.includes(term)) kws.add(term)
  }
  return [...kws].slice(0, 8)
}

function cleanBody(body) {
  return body
    .replace(/^>\s?.*$/gm, '')          // 引用行（多为文件级元信息）
    .replace(/^---+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const sqlEsc = s => s.replace(/'/g, "''")
const sqlArr = arr => `array[${arr.map(x => `'${sqlEsc(x)}'`).join(',')}]::text[]`

// mindmap 文件：ASCII 树在代码块里，按顶层分支（行首 ├─/└─）切块
function splitMindmap(md) {
  const title = (md.match(/^#\s+(.+)$/m)?.[1] || '').replace(/[《》]/g, '')
  const code = md.match(/```([\s\S]*?)```/)?.[1] || ''
  const lines = code.split('\n')
  const sections = []
  let cur = null
  for (const line of lines) {
    if (/^[├└]─ /.test(line)) {
      if (cur) sections.push(cur)
      cur = { title: `${title} · ${line.replace(/^[├└]─ /, '').trim().slice(0, 30)}`, body: line + '\n' }
    } else if (cur) {
      cur.body += line + '\n'
    }
  }
  if (cur) sections.push(cur)
  return sections.map(s => ({ ...s, body: s.body.trim() }))
}

const chunks = []
for (const [file, tags] of Object.entries(SOURCES)) {
  const fp = path.join(DOCS_DIR, file)
  if (!fs.existsSync(fp)) { console.error(`-- 跳过（不存在）: ${file}`); continue }
  const md = fs.readFileSync(fp, 'utf8')
  const sections = file.startsWith('mindmap-') ? splitMindmap(md) : splitSections(md)
  for (const sec of sections) {
    const body = cleanBody(sec.body)
    if (body.length < MIN_LEN) continue
    for (const part of splitLong(sec.title, body)) {
      chunks.push({
        content: `【${part.title}】\n${part.body}`,
        tags,
        keywords: extractKeywords(part.title, part.body),
        source: file,
      })
    }
  }
}

console.log('-- course_chunks 种子 v3：由训练营课件笔记自动切块生成')
console.log(`-- 生成时间: ${new Date().toISOString()} · 共 ${chunks.length} 条`)
console.log('-- 全量重建：先清空再插入（v1/v2 的内容已被课件原文覆盖）')
console.log('begin;')
console.log('truncate course_chunks;')
for (const c of chunks) {
  console.log(
    `insert into course_chunks (content, dimension_tags, keywords) values ('${sqlEsc(c.content)}', ${sqlArr(c.tags)}, ${sqlArr(c.keywords)});`
  )
}
console.log('commit;')
console.error(`共生成 ${chunks.length} 条 chunk`)
for (const [file] of Object.entries(SOURCES)) {
  const n = chunks.filter(c => c.source === file).length
  console.error(`  ${file}: ${n}`)
}
