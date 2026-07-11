import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { supabase } from '../lib/supabase'
import { DIMENSIONS, computeDimensionLevels } from '../lib/dimensions'
import { retrieveChunks } from '../lib/rag'
import { apiPost } from '../lib/api'
import { createShareCardDataURL } from '../lib/shareCard'
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

// 连续训练天数：从今天（或昨天，若今天没练）往前数连续有记录的天数
function computeStreak(records) {
  const key = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  const days = new Set((records || []).map(r => key(new Date(r.created_at))))
  const today = new Date()
  const todayDone = days.has(key(today))
  const cursor = new Date()
  if (!todayDone) cursor.setDate(cursor.getDate() - 1) // 今天没练不算断，从昨天起数
  let streak = 0
  while (days.has(key(cursor))) { streak++; cursor.setDate(cursor.getDate() - 1) }
  return { streak, todayDone }
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
  const [shareUrl, setShareUrl] = useState('')
  const [streak, setStreak] = useState(0)
  const [todayDone, setTodayDone] = useState(false)

  async function handleSuggest() {
    setSuggestLoading(true)
    setSuggestion('')
    setRetrieved([])
    const dim = pickWeakestDim(levels) // 并列最低分时每次重新随机挑一个，避免"换一条"总卡同一维度
    setActiveDim(dim)
    try {
      const chunks = await retrieveChunks(dim.key, { limit: 3 })
      setRetrieved(chunks)
      const res = await apiPost('suggest', { dimension_label: dim.label, chunks })
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
      const s = computeStreak(data || [])
      setStreak(s.streak)
      setTodayDone(s.todayDone)
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

  const hasData = DIMENSIONS.some(d => (levels[d.key] || 0) > 0)

  function handleShare() {
    setShareUrl(createShareCardDataURL(levels, user?.anonymousId || ''))
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
        {streak > 0 && (
          <button
            onClick={() => navigate('/train/comprehensive/session', { state: { level: '进阶' } })}
            style={{
              marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 999, border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text)', fontSize: 13, cursor: 'pointer',
            }}
          >
            🔥 连续 {streak} 天 · {todayDone ? '今天已练' : '今天来一题 →'}
          </button>
        )}
      </header>

      {userError && (
        <div style={{ margin: '12px 18px', padding: '10px 12px', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: 12, lineHeight: 1.6 }}>
          登录会话建立失败，数据无法保存：{userError.message || String(userError)}
        </div>
      )}

      <div className={styles.body}>
        {/* 新用户摸底引导（无数据时） */}
        {!hasData && (
          <div className={styles.suggestCard}>
            <div className={styles.suggestHead}>
              <span className={styles.suggestLabel}>新手引导</span>
            </div>
            <p className={styles.suggestText}>还没有能力数据。花 2 分钟做个摸底，先测出你的 AI PM 能力画像，再看该补哪一维。</p>
            <button
              className={styles.suggestBtn}
              onClick={() => { localStorage.setItem('aipk_onboarded', '1'); navigate('/train/comprehensive/session', { state: { level: '入门', isPlacement: true } }) }}
            >
              开始 2 分钟摸底测
            </button>
          </div>
        )}

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

        {/* 能力体检分享卡（有数据时） */}
        {hasData && (
          <div className={styles.suggestCard}>
            <div className={styles.suggestHead}>
              <span className={styles.suggestLabel}>能力体检卡</span>
            </div>
            {shareUrl ? (
              <>
                <img src={shareUrl} alt="能力卡片" style={{ width: '100%', borderRadius: 8, display: 'block', marginBottom: 8 }} />
                <p className={styles.suggestHint}>长按图片保存到相册，或点下方下载</p>
                <a
                  className={styles.suggestBtn}
                  href={shareUrl}
                  download="ai-pm-能力卡片.png"
                  style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
                >
                  下载卡片
                </a>
              </>
            ) : (
              <>
                <p className={styles.suggestHint}>生成一张能力雷达卡片，晒进度、发小红书。</p>
                <button className={styles.suggestBtn} onClick={handleShare}>生成能力卡片</button>
              </>
            )}
          </div>
        )}

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

        {/* JD 定制训练入口 */}
        <button className={styles.dimRow} onClick={() => navigate('/jd')} style={{ marginTop: 4 }}>
          <span className={styles.stripe} style={{ background: '#ec4899' }} />
          <div className={styles.dimText}>
            <span className={styles.dimName}>
              JD 定制训练
              <span className={styles.dimLevel} style={{ color: '#ec4899' }}>NEW</span>
            </span>
            <span className={styles.dimWhy}>粘贴目标岗位 JD，练贴合这个岗位的题</span>
          </div>
          <span className={styles.dimChevron}>{Icons.chevronRight}</span>
        </button>

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
