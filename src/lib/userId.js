import { supabase } from './supabase'

// 生成格式：AIPK-XXXX-XXXX（大写十六进制）——公开可见的昵称，不作安全凭据
function generateAnonymousId() {
  const hex = () => Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')
  return `AIPK-${hex()}-${hex()}`
}

// 恢复码：单独生成的长随机串，不从昵称派生，作为换设备恢复的真实凭据
function generateRecoveryCode() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
  return hex.match(/.{1,4}/g).join('-') // XXXX-XXXX-...-XXXX
}

// 确保当前浏览器有一个真实的匿名登录会话（Supabase Anonymous Auth）。
// 会话由 supabase-js 自动持久化在 localStorage，同一浏览器下次访问会复用。
async function ensureAuthSession() {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) return session

  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return data.session
}

export async function getOrCreateUser() {
  const session = await ensureAuthSession()
  const authUid = session.user.id

  const { data: existing, error: selectErr } = await supabase
    .from('users')
    .select('id, anonymous_id, recovery_code')
    .eq('auth_uid', authUid)
    .maybeSingle()

  if (selectErr) throw selectErr

  if (existing) {
    const user = { id: existing.id, anonymousId: existing.anonymous_id, recoveryCode: existing.recovery_code }
    localStorage.setItem('aipk_user', JSON.stringify(user))
    return user
  }

  const anonymousId = generateAnonymousId()
  const recoveryCode = generateRecoveryCode()

  const { data, error } = await supabase
    .from('users')
    .insert({ anonymous_id: anonymousId, auth_uid: authUid, recovery_code: recoveryCode, total_completed: 0 })
    .select()
    .single()

  if (error) throw error

  const user = { id: data.id, anonymousId: data.anonymous_id, recoveryCode: data.recovery_code }
  localStorage.setItem('aipk_user', JSON.stringify(user))
  return user
}

// 换设备恢复：需要真正的恢复码（不是公开昵称），由服务端用 service_role
// 校验后把当前设备的登录会话重新绑定到目标账号。
export async function restoreAccountByCode(recoveryCode) {
  const session = await ensureAuthSession()

  const res = await fetch('/api/restore-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ recovery_code: recoveryCode.trim().toUpperCase() }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || '恢复失败，请检查恢复码是否正确')

  const user = { id: data.id, anonymousId: data.anonymous_id, recoveryCode: data.recovery_code }
  localStorage.setItem('aipk_user', JSON.stringify(user))
  return user
}
