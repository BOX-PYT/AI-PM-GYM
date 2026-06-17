import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { Icons, DIR_COLORS } from '../lib/icons'
import { supabase } from '../lib/supabase'
import styles from './HomePage.module.css'

const SPECIALIZATIONS = [
  { key: 'ai-thinking',  label: 'AI 产品思维', desc: '北极星指标 · 冷启动 · 幻觉处理'   },
  { key: 'tech',         label: '技术理解力',  desc: 'RAG · Agent · Token · Embedding'  },
  { key: 'expression',   label: '结构化表达',  desc: 'MECE · 金字塔汇报 · 竞品分析框架' },
  { key: 'insight',      label: '行业洞察',    desc: '真实 AI 热点 · 快速建立判断'       },
]

const COMPREHENSIVE = { key: 'comprehensive', label: '综合训练', desc: '四个方向随机混合，每方向至少 1 题' }

export default function HomePage() {
  const navigate = useNavigate()
  const { user, loading } = useUser()
  const [copied, setCopied] = useState(false)
  const [showRestore, setShowRestore] = useState(false)
  const [restoreInput, setRestoreInput] = useState('')
  const [restoreError, setRestoreError] = useState('')
  const [headerStats, setHeaderStats] = useState({ streak: 0, weekCount: 0, conquerCount: 0 })

  useEffect(() => {
    if (!user) return
    loadHeaderStats()
  }, [user])

  async function loadHeaderStats() {
    const { data: records } = await supabase
      .from('records')
      .select('created_at, is_conquer')
      .eq('user_id', user.id)
    if (!records) return

    const conquerCount = records.filter(r => r.is_conquer).length

    // 连续天数
    const dates = [...new Set(records.map(r => r.created_at?.slice(0, 10)))].sort()
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      if (dates.includes(d.toISOString().slice(0, 10))) streak++
      else break
    }

    // 本周题数
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)
    const weekCount = records.filter(r => new Date(r.created_at) >= weekStart).length

    setHeaderStats({ streak, weekCount, conquerCount })
  }

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

  return (
    <div className={styles.root}>
      {/* 深色 Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.wordmark}>
            <em className={styles.ai}>AI</em>
            <span className={styles.pm}> PM </span>
            <span className={styles.gym}>GYM</span>
          </div>
          <div className={styles.idRow}>
            <span className={styles.idValue}>
              {loading ? '...' : user?.anonymousId}
            </span>
            <button className={styles.idCopyBtn} onClick={copyId} disabled={loading}>
              {copied ? '已复制' : '复制 ID'}
            </button>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statBlock}>
            <span className={styles.statNum}>{headerStats.streak}</span>
            <span className={styles.statLabel}>连续天</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBlock}>
            <span className={styles.statNum}>{headerStats.weekCount}</span>
            <span className={styles.statLabel}>本周题</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBlock}>
            <span className={styles.statNum}>{headerStats.conquerCount}</span>
            <span className={styles.statLabel}>待攻克</span>
          </div>
        </div>

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

        <button
          className={styles.restoreToggle}
          onClick={() => setShowRestore(v => !v)}
        >
          {showRestore ? '取消' : '换设备？输入 ID 恢复'}
        </button>
      </header>

      {/* 训练方向 */}
      <div className={styles.body}>
        <p className={styles.sectionLabel}>专项训练</p>
        <div className={styles.dirList}>
          {SPECIALIZATIONS.map(dir => (
            <button
              key={dir.key}
              className={styles.dirRow}
              onClick={() => navigate(`/train/${dir.key}`)}
            >
              <span className={styles.stripe} style={{ background: DIR_COLORS[dir.key] }} />
              <div className={styles.dirText}>
                <span className={styles.dirName}>{dir.label}</span>
                <span className={styles.dirDesc}>{dir.desc}</span>
              </div>
              <span className={styles.dirChevron}>{Icons.chevronRight}</span>
            </button>
          ))}
        </div>

        <div className={styles.divider} />

        <button
          className={`${styles.dirRow} ${styles.dirRowMixed}`}
          onClick={() => navigate(`/train/${COMPREHENSIVE.key}`)}
        >
          <span className={styles.stripe} style={{ background: DIR_COLORS[COMPREHENSIVE.key] }} />
          <div className={styles.dirText}>
            <span className={styles.dirName}>{COMPREHENSIVE.label}</span>
            <span className={styles.dirDesc}>{COMPREHENSIVE.desc}</span>
          </div>
          <span className={styles.dirChevron}>{Icons.chevronRight}</span>
        </button>
      </div>
    </div>
  )
}
