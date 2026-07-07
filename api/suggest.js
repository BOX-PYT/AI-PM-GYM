import { requireUserWithinLimit } from '../server/guard.js'

const SYSTEM_PROMPT = `你是一位资深 AI PM，在给转型者做一对一指导。系统会提供一批背景知识供你参考。

要求：
1. 只依据提供的背景知识给建议，不要脱离它自由发挥；背景知识没覆盖的内容不要编。
2. 给出一条具体、可今天就动手的下一步建议，格式："针对『维度』，建议你先 ___，因为 ___。"
3. 控制在 2-3 句话，动词开头，别说正确的废话（如"多学习、多练习"）。
4. 若背景知识为空或明显不相关，直说"这个维度暂时没有可参考的材料，先去练习积累"，不要硬编。
5. 编号（如"1""2"）只是给你内部对齐来源用的，绝对不能出现在输出里，也不要写"片段X说""根据X"这类指代。
6. 最关键的一条：绝对不能出现"课件""教材""训练营""参考资料""检索到的内容""里面提到""其中写道"等任何暴露信息来源、听起来像在背书本的词句。把背景知识当作你自己本就掌握的 AI PM 岗位经验，用"AI PM 岗位要求""实际工作中""这类场景通常需要你..."这样的口吻自然表达，像真人导师凭经验给建议，而不是在转述资料。

只输出建议正文，不要输出任何前缀或 JSON。`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = await requireUserWithinLimit(req, res, 'suggest')
  if (!auth) return

  const { dimension_label, chunks = [] } = req.body
  if (!dimension_label) {
    return res.status(400).json({ error: 'Missing dimension_label' })
  }

  try {
    const context = chunks.length
      ? chunks.map((c, i) => `${i + 1}. ${c}`).join('\n')
      : '（暂无相关背景知识）'

    const userPrompt = `当前最薄弱的能力维度：${dimension_label}

背景知识（内化后转述，不要提及来源或说"资料里提到"）：
${context}

请给出一条下一步建议。`

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
    const suggestion = data.choices[0].message.content.trim()
    return res.status(200).json({ suggestion })
  } catch (e) {
    console.error('suggest error:', e)
    return res.status(500).json({ error: e.message })
  }
}
