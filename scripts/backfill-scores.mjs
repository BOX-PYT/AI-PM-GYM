// 一次性回填脚本：给重构前答的、没有 dimension/score 的旧记录补齐结构化打分。
// 用法：node scripts/backfill-scores.mjs
// 读取生产 Supabase（anon key，records 表 RLS 允许 anon 读写）+ 调用已部署的
// /api/get-feedback 接口重新评分，写回 dimension/score/hit_points/missed。

import { loadEnv } from './_env.mjs'
import { createClient } from '@supabase/supabase-js'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const API_BASE = 'https://ai-pm-gym-delta.vercel.app'

// 该环境里 Node 自带的 fetch 连 Vercel 域名会连接超时（但连 Supabase 正常），
// 用 curl 子进程绕过，Supabase 读写仍走 supabase-js。
async function curlPostJson(url, body) {
  const { stdout } = await execFileAsync('curl', [
    '-s', '-X', 'POST', url,
    '-H', 'Content-Type: application/json',
    '-d', JSON.stringify(body),
  ])
  return JSON.parse(stdout)
}

// 旧中文方向标签 → 新能力维度 key（与 src/lib/dimensions.js 的
// LEGACY_DIRECTION_TO_DIMENSION 保持一致，只是这里键是中文标签）
const LABEL_TO_DIM = {
  'AI 产品思维': 'product',
  技术理解力: 'ai-tech',
  结构化表达: 'narrative',
  行业洞察: 'product',
  综合训练: 'product',
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function main() {
  const env = loadEnv()
  const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)

  const { data: records, error } = await supabase
    .from('records')
    .select('id, question, answer, user_input, direction, score')
    .is('score', null)

  if (error) {
    console.error('查询失败:', error)
    process.exit(1)
  }

  console.log(`待回填 ${records.length} 条`)

  let ok = 0, skipped = 0, failed = 0
  for (const r of records) {
    const dimKey = LABEL_TO_DIM[r.direction]
    if (!dimKey) {
      console.log(`跳过（未知方向 "${r.direction}"）: ${r.id}`)
      skipped++
      continue
    }
    if (!r.question || !r.answer || !r.user_input) {
      console.log(`跳过（缺字段）: ${r.id}`)
      skipped++
      continue
    }

    try {
      const data = await curlPostJson(`${API_BASE}/api/get-feedback`, {
        question: r.question, answer: r.answer, user_input: r.user_input,
      })
      if (typeof data.score !== 'number') throw new Error('未返回有效 score: ' + JSON.stringify(data))

      const { error: updateErr } = await supabase
        .from('records')
        .update({
          dimension: dimKey,
          score: data.score,
          hit_points: data.hit_points || [],
          missed: data.missed || [],
        })
        .eq('id', r.id)

      if (updateErr) throw updateErr

      console.log(`回填成功: ${r.id} → ${dimKey}, score=${data.score}`)
      ok++
    } catch (e) {
      console.error(`失败: ${r.id}`, e.message)
      failed++
    }
    await sleep(500) // 简单限速，避免打满 DeepSeek 速率
  }

  console.log(`\n完成：成功 ${ok}，跳过 ${skipped}，失败 ${failed}`)
}

main()
