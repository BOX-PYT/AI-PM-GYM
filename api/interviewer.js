import { requireUserWithinLimit } from '../server/guard.js'

const SYSTEM_PROMPT = `你是一位资深 AI 产品经理面试官，正在对候选人做压力面试。候选人刚回答了一道训练题，你要像真实面试一样步步深挖，逼他暴露理解的真实深度。

规则：
1. 若还没有追问历史：针对候选人的作答，挑他最薄弱、最想当然、或最含糊的一点，提出第一个更深入犀利的追问。verdict 留空字符串。
2. 若已有追问历史：先用一句话点评他上一个回答（是否答到点上、哪里还在打太极），再基于他的回答提出下一个更深的追问。
3. 最多追问 2 轮。当追问历史已有 2 轮时，done 置为 true、challenge 留空，verdict 给出对整场追问的一句总结（他这道题理解到了什么程度）。
4. 追问要具体、扣着候选人自己说的话，不要泛泛问"还有呢"。语气专业、略带压迫感，但不羞辱。
5. challenge 和 verdict 都控制在 40 字以内。

严格只输出 JSON，格式：
{"verdict":"（对上一轮的点评，首轮为空）","challenge":"（下一个追问，done 时为空）","done":false}
不要输出任何其他内容。`

function parse(text) {
  const m = text.match(/\{[\s\S]*\}/)
  if (m) {
    try {
      const o = JSON.parse(m[0])
      return {
        verdict: (o.verdict || '').trim(),
        challenge: (o.challenge || '').trim(),
        done: !!o.done,
      }
    } catch {
      // 落到兜底
    }
  }
  return { verdict: '', challenge: text.trim().slice(0, 60), done: false }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = await requireUserWithinLimit(req, res, 'interviewer')
  if (!auth) return

  const { question, answer, user_input, history = [] } = req.body
  if (!question || !user_input) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const historyText = Array.isArray(history) && history.length
    ? history.map((h, i) => `第${i + 1}轮追问：${h.challenge}\n候选人回答：${h.reply}`).join('\n')
    : '（暂无，这是第一次追问）'

  const userPrompt = `题目：${question}
参考答案：${answer || '（无）'}
候选人的原始作答：${user_input}

追问历史：
${historyText}

请给出你的点评和下一个追问。`

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 300,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      }),
    })
    if (!response.ok) {
      const err = await response.text()
      throw new Error(`DeepSeek API error: ${err}`)
    }
    const data = await response.json()
    // 已追问满 2 轮，强制收尾，避免模型不肯停
    const result = parse(data.choices[0].message.content.trim())
    if (Array.isArray(history) && history.length >= 2) result.done = true
    if (result.done) result.challenge = ''
    return res.status(200).json(result)
  } catch (e) {
    console.error('interviewer error:', e)
    return res.status(500).json({ error: e.message })
  }
}
