import { supabase } from './supabase'

// 统一的后端调用：自动带上当前登录会话的 access token。
// 服务端 guard 会校验 token 并做每日限额（401/429 时 body 里有中文 error 可直接展示）。
export async function apiPost(path, body) {
  const { data: { session } } = await supabase.auth.getSession()
  return fetch(`/api/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify(body),
  })
}
