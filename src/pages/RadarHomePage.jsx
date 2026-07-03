import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { supabase } from '../lib/supabase'
import { DIMENSIONS, computeDimensionLevels } from '../lib/dimensions'
import { retrieveChunks } from '../lib/rag'
import { Icons } from '../lib/icons'
import styles from './RadarHomePage.module.css'

// 4 维度雷达坐标：product(上) → ai-tech(右) → narrative(下) → workflow(左)
const CX = 140, CY = 140, R = 100
function axisPoint(i, frac) {
  const angle = (-90 + i * 90) * (Math.PI / 180)
  return [CX + R * frac * Math.cos(angle), CY + R * frac * Math.sin(angle)]
}
function ring(frac) {
  return DIMENSIONS.map((_, i) => axisPoint(i, frac).join(',')).join(' ')
}

// 最薄弱维度：多个维度并列最低分时（如全部为初始 0 分）随机挑一个，
// 而不是每次都固定选数组里第一个，否则并列时会一直卡在同一个维度。
function pickWeakestDim(levels) {
  const minLevel = Math.min(...DIMENSIONS.map(d => levels[d.key] || 0))
  const tied = DIMENSIONS.filter(d => (levels[d.key] || 0) === minLevel)
  return tied[Math.floor(Math.random() * tied.length)]
}

export default function RadarHomePage() {
  const navigate = useNavigate()
  const { user, loading, error: userError } = useUser()
  const [levels, setLevels] = useState({ product: 0, 'ai-tech': 0, narrative: 0, workflow: 0 })
  const [copied, setCopied] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [showRestore, setShowRestore] = useState(false)
  const [restoreInput, setRestoreInput] = useState('')
  const [restoreError, setRestoreError] = useState('')
  const [suggestLoading, setSuggestLoading] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [retrieved, setRetrieved] = useState([])
  const [activeDim, setActiveDim] = useState(() => pickWeakestDim(levels))

  async function handleSuggest() {
    setSuggestLoading(true)
    setSuggestion('')
    setRetrieved([])
    const dim = pickWeakestDim(levels) // 并列最低分时每次重新随机挑一个，避免"换一条"总卡同一维度
    setActiveDim(dim)
    try {
      const chunks = await retrieveChunks(dim.key, { limit: 3 })
      setRetrieved(chunks)
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dimension_label: dim.label, chunks }),
      })
      if (!res.ok) throw new Error('suggest api unavailable')
      const data = await res.json()
      setSuggestion(data.suggestion)
    } catch {
      // 生成服务不可用（本地未接入 /api）时，降级展示检索到的知识库要点
    } finally {
      setSuggestLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    let cancelled = false
    ;(async () => {
      const { data } = await supabase
        .from('records')
        .select('dimension, direction, score, created_at')
        .eq('user_id', user.id)
      if (cancelled) return // effect 被重新触发（如 StrictMode 双调用）时，丢弃这次过期的结果
      const computed = computeDimensionLevels(data || [])
      setLevels(computed)
      setActiveDim(pickWeakestDim(computed)) // 真实数据到位后重新挑一次最薄弱维度
    })()
    return () => { cancelled = true }
  }, [user])

  async function copyId() {
    if (!user) return
    await navigator.clipboard.writeText(user.anonymousId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function copyRecoveryCode() {
    if (!user?.recoveryCode) return
    await navigator.clipboard.writeText(user.recoveryCode)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  async function handleRestore() {
    if (!restoreInput.trim()) return
    setRestoreError('')
    try {
      const { restoreAccountByCode } = await import('../lib/userId')
      await restoreAccountByCode(restoreInput)
      window.location.reload()
    } catch (e) {
      setRestoreError(e.message)
    }
  }

  const dataPolygon = DIMENSIONS
    .map((d, i) => axisPoint(i, Math.max(0.04, (levels[d.key] || 0) / 100)).join(','))
    .join(' ')

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.wordmark}>
            <em className={styles.ai}>AI</em>
            <span className={styles.pm}> PM </span>
            <span className={styles.gym}>能力雷达</span>
          </div>
          <div className={styles.idRow}>
            <span className={styles.idValue}>{loading ? '...' : user?.anonymousId}</span>
            <button className={styles.idCopyBtn} onClick={copyId} disabled={loading}>
              {copied ? '已复制' : '复制 ID'}
            </button>
            <button className={styles.idCopyBtn} onClick={copyRecoveryCode} disabled={loading || !user?.recoveryCode}>
              {codeCopied ? '已复制' : '复制恢复码'}
            </button>
          </div>
        </div>
        <p className={styles.tagline}>你的 AI 产品经理能力，随练习实时生长</p>
      </header>

      {userError && (
        <div style={{ margin: '12px 18px', padding: '10px 12px', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: 12, lineHeight: 1.6 }}>
          登录会话建立失败，数据无法保存：{userError.message || String(userError)}
        </div>
      )}

      <div className={styles.body}>
        {/* 能力雷达图 */}
        <div className={styles.radarWrap}>
          <svg viewBox="0 0 280 280" className={styles.radar}>
            {[0.25, 0.5, 0.75, 1].map(f => (
              <polygon key={f} points={ring(f)} className={styles.gridRing} />
            ))}
            {DIMENSIONS.map((d, i) => {
              const [x, y] = axisPoint(i, 1)
              return <line key={d.key} x1={CX} y1={CY} x2={x} y2={y} className={styles.axis} />
            })}
            <polygon points={dataPolygon} className={styles.dataArea} />
            {DIMENSIONS.map((d, i) => {
              const [x, y] = axisPoint(i, Math.max(0.04, (levels[d.key] || 0) / 100))
              return <circle key={d.key} cx={x} cy={y} r="3.5" fill={d.color} />
            })}
          </svg>
          {DIMENSIONS.map((d, i) => {
            const [x, y] = axisPoint(i, 1.28)
            return (
              <span
                key={d.key}
                className={styles.axisLabel}
                style={{ left: `${(x / 280) * 100}%`, top: `${(y / 280) * 100}%` }}
              >
                {d.label}
                <em className={styles.axisVal}>{levels[d.key] || 0}</em>
              </span>
            )
          })}
        </div>

        {/* 下一步建议（RAG：基于精选知识库检索） */}
        <div className={styles.suggestCard}>
          <div className={styles.suggestHead}>
            <span className={styles.suggestLabel}>下一步 · 最薄弱维度</span>
            <span className={styles.suggestDim} style={{ color: activeDim.color }}>{activeDim.label}</span>
          </div>

          {suggestion && <p className={styles.suggestText}>{suggestion}</p>}

          {!suggestion && retrieved.length > 0 && (
            <div className={styles.retrievedBox}>
              <span className={styles.retrievedLabel}>相关岗位知识要点（生成服务未接入时的降级展示）</span>
              {retrieved.map((c, i) => (
                <p key={i} className={styles.retrievedItem}>· {c}</p>
              ))}
            </div>
          )}

          {!suggestion && retrieved.length === 0 && (
            <p className={styles.suggestHint}>基于真实岗位要求给你一条可落地的下一步，而不是让大模型自由发挥。</p>
          )}

          <button className={styles.suggestBtn} onClick={handleSuggest} disabled={suggestLoading}>
            {suggestLoading ? '生成中...' : suggestion || retrieved.length ? '换一条建议' : '生成下一步建议'}
          </button>
        </div>

        {/* 4 维度入口 */}
        <div className={styles.dimList}>
          {DIMENSIONS.map(d => (
            <button key={d.key} className={styles.dimRow} onClick={() => navigate(`/dimension/${d.key}`)}>
              <span className={styles.stripe} style={{ background: d.color }} />
              <div className={styles.dimText}>
                <span className={styles.dimName}>
                  {d.label}
                  <span className={styles.dimLevel} style={{ color: d.color }}>Lv {levels[d.key] || 0}</span>
                </span>
                <span className={styles.dimWhy}>{d.why}</span>
              </div>
              <span className={styles.dimChevron}>{Icons.chevronRight}</span>
            </button>
          ))}
        </div>

        <button className={styles.restoreToggle} onClick={() => setShowRestore(v => !v)}>
          {showRestore ? '取消' : '换设备？输入恢复码找回'}
        </button>
        {showRestore && (
          <div className={styles.restoreRow}>
            <input
              className={styles.restoreInput}
              placeholder="输入恢复码 XXXX-XXXX-XXXX-XXXX"
              value={restoreInput}
              onChange={e => setRestoreInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRestore()}
              autoFocus
            />
            <button className={styles.restoreConfirm} onClick={handleRestore}>恢复</button>
            {restoreError && <p className={styles.restoreError}>{restoreError}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
