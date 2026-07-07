import { createClient } from '@supabase/supabase-js'

// 每用户每日调用上限。真实用户一天 4 轮训练也用不完；挡的是脚本刷 key。
const DAILY_LIMITS = {
  'generate-questions': 20,
  'get-feedback': 80,
  'followup': 30,
  'suggest': 20,
  'restore-account': 10,
}

export function adminClient() {
  return createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// 校验请求方是真实登录会话，并做每日限额。
// 通过：返回 { authUid, admin }；不通过：已写好 401/429 响应，返回 null。
// api_usage 表缺失时放行（迁移 SQL 未执行不应导致全站不可用），限额到顶时拒绝。
export async function requireUserWithinLimit(req, res, endpoint) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!token) {
    res.status(401).json({ error: '缺少登录会话，请刷新页面后重试' })
    return null
  }

  const admin = adminClient()
  const { data, error } = await admin.auth.getUser(token)
  if (error || !data?.user) {
    res.status(401).json({ error: '会话无效，请刷新页面后重试' })
    return null
  }
  const authUid = data.user.id

  const limit = DAILY_LIMITS[endpoint]
  if (limit) {
    const dayStart = new Date()
    dayStart.setHours(0, 0, 0, 0)
    const { count, error: cntErr } = await admin
      .from('api_usage')
      .select('id', { count: 'exact', head: true })
      .eq('auth_uid', authUid)
      .eq('endpoint', endpoint)
      .gte('created_at', dayStart.toISOString())

    if (cntErr) {
      console.error(`api_usage 查询失败（表未建？）: ${cntErr.message}`)
    } else if (count >= limit) {
      res.status(429).json({ error: '今日该功能的使用次数已达上限，明天再来吧' })
      return null
    } else {
      admin.from('api_usage').insert({ auth_uid: authUid, endpoint }).then(({ error: insErr }) => {
        if (insErr) console.error('api_usage 写入失败:', insErr.message)
      })
    }
  }

  return { authUid, admin }
}
