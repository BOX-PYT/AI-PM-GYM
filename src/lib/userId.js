import { supabase } from './supabase'

// 生成格式：AIPK-XXXX-XXXX（大写十六进制）
function generateAnonymousId() {
  const hex = () => Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')
  return `AIPK-${hex()}-${hex()}`
}

export async function getOrCreateUser() {
  const stored = localStorage.getItem('aipk_user')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      localStorage.removeItem('aipk_user')
    }
  }

  const anonymousId = generateAnonymousId()

  const { data, error } = await supabase
    .from('users')
    .insert({ anonymous_id: anonymousId, total_completed: 0 })
    .select()
    .single()

  if (error) throw error

  const user = { id: data.id, anonymousId: data.anonymous_id }
  localStorage.setItem('aipk_user', JSON.stringify(user))
  return user
}

// 换设备时用 ID 恢复
export async function restoreUserById(anonymousId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('anonymous_id', anonymousId.trim().toUpperCase())
    .single()

  if (error || !data) throw new Error('未找到该 ID 对应的账户')

  const user = { id: data.id, anonymousId: data.anonymous_id }
  localStorage.setItem('aipk_user', JSON.stringify(user))
  return user
}
