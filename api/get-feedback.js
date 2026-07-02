const SYSTEM_PROMPT = `你是 AI PM GYM 的训练教练，对用户作答给出简短点评和结构化评分。

要求：
1. feedback：2 句话以内。第一句认可答对的最核心的点；第二句只指出最重要的一个缺口（若答得很全则指一个更深入的方向）。不复述参考答案，只说最重要的 delta。
2. score：0-100 整数，衡量用户作答相对参考答案覆盖核心要点的程度与准确度。评分锚点——90+：覆盖全部核心要点且有洞察；70-89：覆盖主要要点、个别遗漏；50-69：抓到部分要点但有明显缺口；30-49：方向对但很浅；0-29：跑题或无意义。
3. hit_points：用户命中的关键点数组，0-3 条，每条简短。
4. missed：用户遗漏或答错的关键点数组，0-3 条，每条简短。
5. 若输入明显与题目无关（随机字符、无意义内容），score 给 0-15，feedback 固定为：这次先看看参考答案，下次试试用自己的话分析一遍。

严格只输出 JSON，格式：
{"feedback":"...","score":0,"hit_points":["..."],"missed":["..."]}
不要输出任何其他内容。`

function parseFeedback(text) {
  const match = text.match(/\{[\s\S]*\}/)
  if (match) {
    try {
      const obj = JSON.parse(match[0])
      return {
        feedback: (obj.feedback || '').trim(),
        score: typeof obj.score === 'number' ? Math.max(0, Math.min(100, Math.round(obj.score))) : null,
        hit_points: Array.isArray(obj.hit_points) ? obj.hit_points.slice(0, 3) : [],
        missed: Array.isArray(obj.missed) ? obj.missed.slice(0, 3) : [],
      }
    } catch {
      // 解析失败，降级为纯文本点评
    }
  }
  return { feedback: text.trim(), score: null, hit_points: [], missed: [] }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { question, answer, user_input } = req.body

  if (!question || !answer || !user_input) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const userPrompt = `题目：${question}
参考答案：${answer}
用户作答：${user_input}

请给出点评和评分。`

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 500,
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
    const parsed = parseFeedback(data.choices[0].message.content.trim())
    return res.status(200).json(parsed)
  } catch (e) {
    console.error('get-feedback error:', e)
    return res.status(500).json({ error: e.message })
  }
}
