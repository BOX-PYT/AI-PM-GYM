const SYSTEM_PROMPT = `你是 AI PM GYM 的训练教练，负责对用户的作答给出简短精准的点评。

点评原则：
1. 严格控制在 2 句话以内
2. 第一句认可用户答对的最核心的点
3. 第二句只指出最重要的一个缺口，或如果用户答得很全，指出一个可以更深入的方向
4. 不复述参考答案，只说用户答案和参考答案之间最重要的 delta
5. 如果用户输入明显和题目无关（随机字符、无意义内容），只回复：这次先看看参考答案，下次试试用自己的话分析一遍。

语气简洁直接，像一个资深 AI PM 在给你快速反馈。`

export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const body = await request.json()
    const { question, answer, user_input } = body

    if (!question || !answer || !user_input) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const userPrompt = `题目：${question}
参考答案：${answer}
用户作答：${user_input}

请给出点评。`

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
    const feedback = data.choices[0].message.content.trim()
    return new Response(JSON.stringify({ feedback }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('get-feedback error:', e)
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
