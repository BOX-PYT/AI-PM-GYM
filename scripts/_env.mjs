// 手动解析 .env.local，避免额外引入 dotenv 依赖
import { readFileSync } from 'fs'

export function loadEnv(path = '.env.local') {
  const out = {}
  try {
    const raw = readFileSync(path, 'utf-8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
      if (m) out[m[1]] = m[2].trim()
    }
  } catch {
    // 文件不存在时返回空对象
  }
  return out
}
