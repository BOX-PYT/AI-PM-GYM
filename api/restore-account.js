import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'node:crypto'

// service_role key 只能在服务端用，绝不能出现在前端 bundle 里。
// 用它做两件普通 anon key 做不到的事：验证任意用户的 access token、
// 绕过 RLS 按恢复码查到目标账号并重新绑定 auth_uid。
function adminClient() {
  return createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  const { recovery_code } = req.body

  if (!token || !recovery_code) {
    return res.status(400).json({ error: 'Missing token or recovery_code' })
  }

  try {
    const admin = adminClient()

    // 用 service_role 验证这个 token 真实有效，拿到调用方自己的 auth_uid，
    // 不信任客户端直接传一个 uid 过来。
    const { data: authData, error: authErr } = await admin.auth.getUser(token)
    if (authErr || !authData?.user) {
      return res.status(401).json({ error: 'Invalid session' })
    }
    const newAuthUid = authData.user.id

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
