import { createClient } from '@supabase/supabase-js'

function generateRecoveryCode() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
  return hex.match(/.{1,4}/g).join('-')
}

export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const authHeader = request.headers.get('authorization') || ''
    const token = authHeader.replace(/^Bearer\s+/i, '')
    const body = await request.json()
    const { recovery_code } = body

    if (!token || !recovery_code) {
      return new Response(JSON.stringify({ error: 'Missing token or recovery_code' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const admin = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

    const { data: authData, error: authErr } = await admin.auth.getUser(token)
    if (authErr || !authData?.user) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const newAuthUid = authData.user.id

    const { data: target, error: findErr } = await admin
      .from('users')
      .select('id, anonymous_id')
      .eq('recovery_code', recovery_code)
      .maybeSingle()

    if (findErr) throw findErr
    if (!target) {
      return new Response(JSON.stringify({ error: '恢复码无效，请检查是否输入正确' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const newCode = generateRecoveryCode()

    const { data: updated, error: updateErr } = await admin
      .from('users')
      .update({ auth_uid: newAuthUid, recovery_code: newCode })
      .eq('id', target.id)
      .select('id, anonymous_id, recovery_code')
      .single()

    if (updateErr) throw updateErr

    return new Response(JSON.stringify(updated), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('restore-account error:', e)
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
