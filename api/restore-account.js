import { randomBytes } from 'node:crypto'
import { requireUserWithinLimit } from '../server/guard.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // guard 负责：验证 token 真实有效（不信任客户端传 uid）+ 每日限次防恢复码爆破
  const auth = await requireUserWithinLimit(req, res, 'restore-account')
  if (!auth) return
  const { authUid: newAuthUid, admin } = auth

  const { recovery_code } = req.body
  if (!recovery_code) {
    return res.status(400).json({ error: 'Missing recovery_code' })
  }

  try {

    const { data: target, error: findErr } = await admin
      .from('users')
      .select('id, anonymous_id')
      .eq('recovery_code', recovery_code)
      .maybeSingle()

    if (findErr) throw findErr
    if (!target) {
      return res.status(404).json({ error: '恢复码无效，请检查是否输入正确' })
    }

    // 恢复码一次性：绑定成功后立刻轮换，防止同一个码被重复使用/泄露后长期有效
    const newCode = generateRecoveryCode()

    const { data: updated, error: updateErr } = await admin
      .from('users')
      .update({ auth_uid: newAuthUid, recovery_code: newCode })
      .eq('id', target.id)
      .select('id, anonymous_id, recovery_code')
      .single()

    if (updateErr) throw updateErr

    return res.status(200).json(updated)
  } catch (e) {
    console.error('restore-account error:', e)
    return res.status(500).json({ error: e.message })
  }
}

function generateRecoveryCode() {
  const hex = randomBytes(16).toString('hex').toUpperCase()
  return hex.match(/.{1,4}/g).join('-')
}
