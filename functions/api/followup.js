const SYSTEM_PROMPT = `你是一位资深 AI PM，正在给转型者答疑。用户刚做完一道训练题、看过参考答案和点评，现在对题目或答案里的某个概念有疑问，向你追问。

要求：
1. 只回答用户实际问的问题，不要重新点评他的原始作答。
2. 结合题目和参考答案的上下文来解释，不要跑题到无关内容。
3. 控制在 2-4 句话，讲清概念本身，必要时给一个简短例子，不要空泛。
4. 语气像资深同事随口解惑，不说"很好的问题"这类客套话。

只输出回答正文，不要输出任何前缀或 JSON。`

export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const body = await request.json()
    const { question, answer, user_input, ai_feedback, follow_up_question } = body
    if (!question || !answer || !follow_up_question) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const userPrompt = `题目：${question}
参考答案：${answer}
用户当时的作答：${user_input || '（无）'}
AI 点评：${ai_feedback || '（无）'}

用户追问：${follow_up_question}

请回答这个追问。`

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 400,
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
    const answer_text = data.choices[0].message.content.trim()
    return new Response(JSON.stringify({ answer: answer_text }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('followup error:', e)
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
