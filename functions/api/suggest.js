const SYSTEM_PROMPT = `你是 AI PM 转型学习教练。用户给你一个当前最薄弱的能力维度，以及从训练营课件里检索到的相关片段。

要求：
1. 只依据提供的「课件片段」给建议，不要脱离片段自由发挥。片段没覆盖的内容不要编。
2. 给出一条具体、可今天就动手的下一步建议，格式："针对『维度』，建议你先 ___，因为 ___。"
3. 控制在 2-3 句话，动词开头，别说正确的废话（如"多学习、多练习"）。
4. 若课件片段为空或明显不相关，直说"课件里暂无这个维度的材料，先去练习积累"，不要硬编。

只输出建议正文，不要输出任何前缀或 JSON。`

export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const body = await request.json()
    const { dimension_label, chunks = [] } = body
    if (!dimension_label) {
      return new Response(JSON.stringify({ error: 'Missing dimension_label' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const ctx = chunks.length
      ? chunks.map((c, i) => `片段${i + 1}：${c}`).join('\n')
      : '（无相关课件片段）'

    const userPrompt = `当前最薄弱的能力维度：${dimension_label}

从训练营课件检索到的相关片段：
${ctx}

请给出一条基于以上片段的下一步建议。`

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
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
    return new Response(JSON.stringify({ suggestion }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('suggest error:', e)
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
