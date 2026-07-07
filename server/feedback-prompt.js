// 评分 prompt 的唯一真源：api/get-feedback.js 与 scripts/judge-calibration.mjs 共用，
// 保证"线上评分"和"校准验证"用的是同一套标准，改 prompt 后必须重跑校准。

// 每维度评分 rubric（权重合计 100）。没有维度信息（旧路由）时用通用锚点。
const RUBRICS = {
  product: `评分 rubric（产品认知，权重合计 100）：
- 判断与理由（40）：给出明确结论，理由紧扣题目场景而非泛泛而谈
- 方法运用（30）：正确使用相关框架/概念（北极星指标、需求优先级、冷启动策略、价值指标 vs 虚荣指标等）
- 量级与验证意识（30）：考虑数据量级差异对方案的影响，说明如何验证判断`,
  'ai-tech': `评分 rubric（AI 技术理解，权重合计 100）：
- 概念准确（40）：对 LLM/RAG/Agent/微调等概念的理解无错误
- 边界与代价（30）：说清技术能做什么不能做什么，以及成本/时延/幻觉等代价
- 场景判断（30）：能判断该场景下该不该用这个技术，有替代方案意识`,
  narrative: `评分 rubric（项目叙事，权重合计 100）：
- 结构（40）：结论先行，按"问题→决策→结果"或金字塔组织，不从背景绕起
- 量化（30）：有具体数字/量级支撑，不是纯定性描述
- 取舍（30）：讲出关键决策的 tradeoff（为什么不选另一个方案）`,
  workflow: `评分 rubric（真实工作流认知，权重合计 100）：
- 角色与交付物（40）：清楚 PM 在协作中的关键交付物（评测集、验收标准、badcase 集等）
- 流程节奏（30）：理解 AI 项目的推进方式（PoC 先行、灰度、回滚、持续评测迭代）
- 协作边界（30）：分得清 PM 和算法/研发各自负责什么`,
}

const GENERIC_ANCHOR = `评分锚点——90+：覆盖全部核心要点且有洞察；70-89：覆盖主要要点、个别遗漏；50-69：抓到部分要点但有明显缺口；30-49：方向对但很浅；0-29：跑题或无意义。`

export function buildSystemPrompt(dimension) {
  const rubric = RUBRICS[dimension]
  return `你是 AI PM GYM 的训练教练，对用户作答给出简短点评和结构化评分。

要求：
1. feedback：2 句话以内。第一句认可答对的最核心的点；第二句只指出最重要的一个缺口（若答得很全则指一个更深入的方向）。不复述参考答案，只说最重要的 delta。
2. score：0-100 整数。${rubric ? `按下面的 rubric 逐项给分后加总：\n${rubric}\n参考答案用于判断要点覆盖，但 rubric 是评分依据。` : GENERIC_ANCHOR}
3. 实质性判罚（重要，防给分虚高）：只有针对本题场景的具体分析、判断和理由才算得分点。以下情况即使方向不算错，score 也不得高于 30：只复述概念定义、只喊口号或泛泛而谈（如"准确率很重要""要重视北极星指标"）、只表态而不给分析（如"态度真诚最重要""先做个 MVP 试试"）、正确但过于笼统没有落到本题的具体决策。宁可从严，不要因为关键词沾边就给及格分。
4. hit_points：用户命中的关键点数组，0-3 条，每条简短。
5. missed：用户遗漏或答错的关键点数组，0-3 条，每条简短。
6. 若输入明显与题目无关（随机字符、无意义内容），score 给 0-15，feedback 固定为：这次先看看参考答案，下次试试用自己的话分析一遍。

严格只输出 JSON，格式：
{"feedback":"...","score":0,"hit_points":["..."],"missed":["..."]}
不要输出任何其他内容。`
}

export function parseFeedback(text) {
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

export async function scoreWithDeepseek({ question, answer, user_input, dimension, apiKey }) {
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: 500,
      messages: [
        { role: 'system', content: buildSystemPrompt(dimension) },
        { role: 'user', content: `题目：${question}\n参考答案：${answer}\n用户作答：${user_input}\n\n请给出点评和评分。` },
      ],
    }),
  })
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`DeepSeek API error: ${err}`)
  }
  const data = await response.json()
  return parseFeedback(data.choices[0].message.content.trim())
}
