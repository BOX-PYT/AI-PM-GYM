// LLM-as-judge 评分一致性校准
//
// 用法:
//   node scripts/judge-calibration.mjs --dry-run          # 只校验校准集格式，不调模型
//   DEEPSEEK_API_KEY=sk-xxx node scripts/judge-calibration.mjs   # 正式跑（约 25 次调用）
//
// 通过线: |LLM分 - 人工分| <= 10 的占比 >= 80%。
// 规则: 每次修改 server/feedback-prompt.js 的评分 prompt/rubric 后必须重跑本脚本，
//       未通过不允许部署评分改动。

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { scoreWithDeepseek } from '../server/feedback-prompt.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SET_FILE = path.join(__dirname, 'calibration-set.json')
const TOLERANCE = 10
const PASS_RATE = 0.8

const dryRun = process.argv.includes('--dry-run')
const spec = JSON.parse(fs.readFileSync(SET_FILE, 'utf8'))
const cases = spec.cases

// ---- 格式校验 ----
const problems = []
const seen = new Set()
for (const c of cases) {
  if (!c.id || seen.has(c.id)) problems.push(`id 缺失或重复: ${c.id}`)
  seen.add(c.id)
  for (const f of ['question', 'answer', 'user_input']) {
    if (typeof c[f] !== 'string' || !c[f].trim()) problems.push(`${c.id}: 缺 ${f}`)
  }
  if (typeof c.human_score !== 'number' || c.human_score < 0 || c.human_score > 100) {
    problems.push(`${c.id}: human_score 非法`)
  }
}
const unconfirmed = cases.filter(c => !c.confirmed).length
if (problems.length) {
  console.error('校准集格式问题:')
  problems.forEach(p => console.error('  - ' + p))
  process.exit(1)
}
console.log(`校准集: ${cases.length} 条，格式合法`)
if (unconfirmed) {
  console.warn(`⚠️  ${unconfirmed} 条 human_score 尚未人工复核（confirmed=false）——结果仅供预跑参考，正式校准前请逐条复核`)
}
if (dryRun) {
  console.log('dry-run 结束（未调用模型）')
  process.exit(0)
}

// ---- 正式校准 ----
const apiKey = process.env.DEEPSEEK_API_KEY
if (!apiKey) {
  console.error('缺少 DEEPSEEK_API_KEY 环境变量')
  process.exit(1)
}

const results = []
for (const c of cases) {
  try {
    const r = await scoreWithDeepseek({
      question: c.question,
      answer: c.answer,
      user_input: c.user_input,
      dimension: c.dimension,
      apiKey,
    })
    const diff = r.score === null ? null : Math.abs(r.score - c.human_score)
    results.push({ ...c, llm_score: r.score, diff })
    const mark = diff === null ? '⚠️ 无分' : diff <= TOLERANCE ? '✅' : '❌'
    console.log(`${mark} ${c.id} [${c.dimension}/${c.tier}] 人工=${c.human_score} LLM=${r.score} 差=${diff}`)
  } catch (e) {
    results.push({ ...c, llm_score: null, diff: null, error: e.message })
    console.log(`⚠️ ${c.id} 调用失败: ${e.message}`)
  }
}

// ---- 报告 ----
const scored = results.filter(r => r.diff !== null)
const agreed = scored.filter(r => r.diff <= TOLERANCE)
const rate = scored.length ? agreed.length / scored.length : 0

console.log('\n========== 校准报告 ==========')
console.log(`一致率: ${agreed.length}/${scored.length} = ${(rate * 100).toFixed(0)}%（阈值 ${PASS_RATE * 100}%，容差 ±${TOLERANCE} 分）`)

const byDim = {}
for (const r of scored) {
  ;(byDim[r.dimension] ||= []).push(r)
}
for (const [d, rs] of Object.entries(byDim)) {
  const ok = rs.filter(r => r.diff <= TOLERANCE).length
  const avgDiff = (rs.reduce((a, r) => a + r.diff, 0) / rs.length).toFixed(1)
  console.log(`  ${d}: ${ok}/${rs.length} 平均偏差 ${avgDiff} 分`)
}

const worst = [...scored].sort((a, b) => b.diff - a.diff).slice(0, 3)
if (worst.length && worst[0].diff > TOLERANCE) {
  console.log('偏差最大的 case（优先分析这些来改 rubric）:')
  worst.forEach(r => console.log(`  ${r.id} 人工=${r.human_score} LLM=${r.llm_score}: ${r.question.slice(0, 30)}...`))
}

// 结果存档，便于对比历次校准
const outFile = path.join(__dirname, `calibration-result-${new Date().toISOString().slice(0, 10)}.json`)
fs.writeFileSync(outFile, JSON.stringify({ ran_at: new Date().toISOString(), rate, results }, null, 2))
console.log(`结果已存: ${path.basename(outFile)}`)

console.log(rate >= PASS_RATE ? '\n✅ 校准通过，评分 prompt 可部署' : '\n❌ 校准未通过，先改 rubric 再重跑，不要部署评分改动')
process.exit(rate >= PASS_RATE ? 0 : 1)
