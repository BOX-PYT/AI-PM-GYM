import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { supabase } from '../lib/supabase'
import { DIMENSIONS, computeDimensionLevels } from '../lib/dimensions'
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

export default function RadarHomePage() {
  const navigate = useNavigate()
  const { user, loading } = useUser()
  const [levels, setLevels] = useState({ product: 0, 'ai-tech': 0, narrative: 0, workflow: 0 })
  const [copied, setCopied] = useState(false)
  const [showRestore, setShowRestore] = useState(false)
  const [restoreInput, setRestoreInput] = useState('')
  const [restoreError, setRestoreError] = useState('')

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const { data } = await supabase
        .from('records')
        .select('dimension, direction, score, created_at')
        .eq('user_id', user.id)
      setLevels(computeDimensionLevels(data || []))
    })()
  }, [user])

  async function copyId() {
    if (!user) return
    await navigator.clipboard.writeText(user.anonymousId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleRestore() {
    if (!restoreInput.trim()) return
    setRestoreError('')
    try {
      const { restoreUserById } = await import('../lib/userId')
      await restoreUserById(restoreInput)
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
          </div>
        </div>
        <p className={styles.tagline}>你的 AI 产品经理能力，随练习实时生长</p>
      </header>

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
          {showRestore ? '取消' : '换设备？输入 ID 恢复'}
        </button>
        {showRestore && (
          <div className={styles.restoreRow}>
            <input
              className={styles.restoreInput}
              placeholder="输入 AIPK-XXXX-XXXX"
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
