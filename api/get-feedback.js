import { requireUserWithinLimit } from '../server/guard.js'
import { scoreWithDeepseek } from '../server/feedback-prompt.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = await requireUserWithinLimit(req, res, 'get-feedback')
  if (!auth) return

  const { question, answer, user_input, dimension } = req.body

  if (!question || !answer || !user_input) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const parsed = await scoreWithDeepseek({
      question,
      answer,
      user_input,
      dimension,
      apiKey: process.env.DEEPSEEK_API_KEY,
    })
    return res.status(200).json(parsed)
  } catch (e) {
    console.error('get-feedback error:', e)
    return res.status(500).json({ error: e.message })
  }
}
