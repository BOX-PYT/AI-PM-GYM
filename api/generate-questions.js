import { requireUserWithinLimit } from '../server/guard.js'

const SYSTEM_PROMPT = `你是 AI PM GYM 的出题引擎，负责生成帮助用户训练 AI 产品经理能力的题目。

出题原则：
1. 题目必须包含具体场景或限定条件，禁止出现"谈谈你对X的理解""请介绍X是什么"这类泛问
2. 题目必须要求用户输出判断、决策或分析，不能是背定义或填空
3. 难度匹配传入的等级：
   - 入门：单一概念在具体场景中的应用判断
   - 进阶：多个因素权衡或方案选择，需说明理由
   - 挑战：复杂场景下的批判性思考，需识别陷阱或反常识结论
4. 题目长度控制在 50 字以内，表达清晰不绕弯
5. 参考答案覆盖 2-3 个核心要点，控制在 100 字以内
6. 避免和 used_topics 中的关键词重复
7. 行业洞察方向：必须基于真实存在的 AI 事件或产品动态，禁止捏造公司名、产品名或数据，如不确定则选择更宏观的趋势类题目
8. 若提供了「知识点素材」：至少 4 题必须直接考察素材中的知识点（在素材知识上设计应用场景，不是照抄原文），
   每题的 source 字段填所依据知识点的小标题（素材里【】内的文字）；未依据素材的题 source 填空字符串。
   禁止考察素材之外自己编造的框架或数据。

输出严格为 JSON 对象，包含 questions 数组（恰好 5 个对象），格式如下：
{
  "questions": [
    {
      "id": 1,
      "direction": "训练方向",
      "level": "难度等级",
      "question": "题目内容",
      "answer": "参考答案（100字以内）",
      "topic_keyword": "该题核心关键词（用于防重复）",
      "source": "所依据知识点的小标题，没有则为空字符串"
    }
  ]
}
只输出 JSON，不要输出任何其他内容。`

// 每题必须有非空 question/answer，且恰好 5 题（前端训练流程按 5 题写死）
function validateQuestions(raw) {
  const arr = Array.isArray(raw) ? raw : raw?.questions
  if (!Array.isArray(arr) || arr.length !== 5) return null
  const cleaned = arr.map((q, i) => ({
    id: i + 1,
    direction: typeof q.direction === 'string' ? q.direction : '',
    level: typeof q.level === 'string' ? q.level : '',
    question: typeof q.question === 'string' ? q.question.trim() : '',
    answer: typeof q.answer === 'string' ? q.answer.trim() : '',
    topic_keyword: typeof q.topic_keyword === 'string' ? q.topic_keyword.trim() : '',
    source: typeof q.source === 'string' ? q.source.trim() : '',
  }))
  if (cleaned.some(q => !q.question || !q.answer)) return null
  return cleaned
}

async function callModel(userPrompt) {
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: 2000,
      response_format: { type: 'json_object' },
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
  return data.choices[0].message.content.trim()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = await requireUserWithinLimit(req, res, 'generate-questions')
  if (!auth) return

  const { direction, level, used_topics = [], chunks = [] } = req.body

  if (!direction || !level) {
    return res.status(400).json({ error: 'Missing direction or level' })
  }

  const material = Array.isArray(chunks) && chunks.length
    ? `\n知识点素材（出题依据）：\n${chunks.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n`
    : ''

  const userPrompt = `训练方向：${direction}
难度等级：${level}
已出过的关键词：${used_topics.join('、') || '（无）'}
${material}
请生成 5 道训练题。`

  try {
    // 字段校验不过（缺题/空题）重试一次，两次都失败才报错
    let questions = null
    for (let attempt = 0; attempt < 2 && !questions; attempt++) {
      const text = await callModel(userPrompt)
      try {
        questions = validateQuestions(JSON.parse(text))
      } catch {
        questions = null
      }
    }
    if (!questions) throw new Error('模型两次返回的题目格式均不合格')
    return res.status(200).json({ questions })
  } catch (e) {
    console.error('generate-questions error:', e)
    return res.status(500).json({ error: e.message })
  }
}
