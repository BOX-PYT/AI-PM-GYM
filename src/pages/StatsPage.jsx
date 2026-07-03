import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { supabase } from '../lib/supabase'
import { DIMENSIONS, computeDimensionLevels, resolveRecordDimension } from '../lib/dimensions'
import styles from './StatsPage.module.css'

export default function StatsPage() {
  const { user, loading: userLoading } = useUser()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    loadStats()
  }, [user])

  async function loadStats() {
    setLoading(true)
    try {
      const [userRes, recordsRes] = await Promise.all([
        supabase.from('users').select('total_completed, created_at').eq('id', user.id).single(),
        supabase.from('records').select('direction, dimension, score, is_conquer, created_at').eq('user_id', user.id),
      ])

      const userData = userRes.data || {}
      const records = recordsRes.data || []

      const byDim = {}
      records.forEach(r => {
        const dimKey = resolveRecordDimension(r)
        if (!dimKey) return
        byDim[dimKey] = (byDim[dimKey] || 0) + 1
      })

      const dates = [...new Set(records.map(r => r.created_at?.slice(0, 10)))].sort()
      let streak = 0
      if (dates.length > 0) {
        const today = new Date().toISOString().slice(0, 10)
        let d = new Date(today)
        for (let i = 0; i < 365; i++) {
          const ds = d.toISOString().slice(0, 10)
          if (dates.includes(ds)) {
            streak++
            d.setDate(d.getDate() - 1)
          } else {
            break
          }
        }
      }

      const conquerCount = records.filter(r => r.is_conquer).length
      const levels = computeDimensionLevels(records)

      setStats({
        totalCompleted: userData.total_completed || 0,
        streak,
        conquerCount,
        totalAnswered: records.length,
        byDim,
        levels,
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (userLoading || loading) {
    return <div className="page loading-spinner">加载中...</div>
  }

  const maxCount = Math.max(...Object.values(stats?.byDim || {}), 1)

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>训练统计</h1>
        <div className={styles.statsRow}>
          <div className={styles.statBlock}>
            <span className={styles.statNum}>{stats?.totalAnswered || 0}</span>
            <span className={styles.statLabel}>总题数</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBlock}>
            <span className={styles.statNum}>{stats?.streak || 0}</span>
            <span className={styles.statLabel}>连续天</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBlock}>
            <span className={styles.statNum}>{stats?.conquerCount || 0}</span>
            <span className={styles.statLabel}>待攻克</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBlock}>
            <span className={styles.statNum}>{stats?.totalCompleted || 0}</span>
            <span className={styles.statLabel}>完成轮次</span>
          </div>
        </div>
      </header>

      <div className={styles.body}>
        <h2 className={styles.sectionTitle}>各维度训练量</h2>
        <div className={styles.directionList}>
          {DIMENSIONS.map(d => {
            const count = stats?.byDim?.[d.key] || 0
            const level = stats?.levels?.[d.key] || 0
            return (
              <button
                key={d.key}
                className={styles.dirRow}
                onClick={() => navigate(`/stats/${d.key}`)}
              >
                <span className={styles.stripe} style={{ background: d.color }} />
                <div className={styles.dirInfo}>
                  <span className={styles.dirName}>
                    {d.label}
                    <span style={{ marginLeft: 8, fontSize: 11, color: d.color, fontWeight: 600 }}>Lv {level}</span>
                  </span>
                  <div className={styles.dirBarWrap}>
                    <div
                      className={styles.dirBar}
                      style={{ width: `${(count / maxCount) * 100}%`, background: d.color }}
                    />
                  </div>
                </div>
                <span className={styles.dirCount}>{count}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.dirChevron}>
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
