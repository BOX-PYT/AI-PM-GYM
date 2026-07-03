import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { supabase } from '../lib/supabase'
import { getDimension, resolveRecordDimension } from '../lib/dimensions'
import { Icons } from '../lib/icons'
import styles from './StatsDetailPage.module.css'

export default function StatsDetailPage() {
  const { direction: dimKey } = useParams()
  const dim = getDimension(dimKey)
  const navigate = useNavigate()
  const { user } = useUser()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (!user || !dim) return
    supabase
      .from('records')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data }) => {
        const filtered = (data || []).filter(r => resolveRecordDimension(r) === dim.key)
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        setRecords(filtered)
        setLoading(false)
      })
  }, [user, dim])

  function toggleExpand(id) {
    setExpanded(prev => prev === id ? null : id)
  }

  function formatDate(ts) {
    if (!ts) return ''
    const d = new Date(ts)
    return `${d.getMonth() + 1}月${d.getDate()}日`
  }

  if (!dim) {
    return (
      <div className="page">
        <button className={styles.back} onClick={() => navigate('/stats')}>{Icons.chevronLeft}统计</button>
        <p style={{ marginTop: 40, textAlign: 'center', color: 'var(--text-muted)' }}>未找到该能力维度</p>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/stats')}>
          {Icons.chevronLeft}
          统计
        </button>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{dim.label}</h1>
          <p className={styles.subtitle}>
            {loading ? '加载中...' : `共 ${records.length} 道题`}
          </p>
        </div>
      </header>

      <div className={styles.body}>
        {loading ? (
          <div className="loading-spinner">加载中...</div>
        ) : records.length === 0 ? (
          <div className={styles.empty}>
            <p>还没有这个维度的记录</p>
            <button
              className={styles.startBtn}
              onClick={() => navigate(`/train/${dim.key}`)}
            >
              开始训练
            </button>
          </div>
        ) : (
          <div className={styles.list}>
            {records.map(r => (
              <div key={r.id} className={styles.card}>
                <button
                  className={styles.cardHeader}
                  onClick={() => toggleExpand(r.id)}
                >
                  <div className={styles.cardMeta}>
                    <span className={styles.levelTag}>{r.level}</span>
                    {typeof r.score === 'number' && (
                      <span className={styles.levelTag} style={{ color: dim.color }}>{r.score} 分</span>
                    )}
                    {r.is_conquer && (
                      <span className={styles.conquerTag}>待攻克</span>
                    )}
                    <span className={styles.date}>{formatDate(r.created_at)}</span>
                  </div>
                  <p className={styles.question}>{r.question}</p>
                  <span className={`${styles.chevron} ${expanded === r.id ? styles.chevronOpen : ''}`}>
                    {Icons.chevronRight}
                  </span>
                </button>

                {expanded === r.id && (
                  <div className={styles.detail}>
                    {r.user_input && (
                      <div className={styles.block}>
                        <span className={styles.blockLabel}>我的作答</span>
                        <p className={styles.blockText}>{r.user_input}</p>
                      </div>
                    )}
                    {r.ai_feedback && (
                      <div className={styles.block}>
                        <span className={styles.blockLabel}>AI 点评</span>
                        <p className={styles.blockText}>{r.ai_feedback}</p>
                      </div>
                    )}
                    {r.answer && (
                      <div className={styles.block}>
                        <span className={styles.blockLabel}>参考答案</span>
                        <p className={`${styles.blockText} ${styles.answer}`}>{r.answer}</p>
                      </div>
                    )}
                    {r.follow_up_q && (
                      <div className={styles.block}>
                        <span className={styles.blockLabel}>追问：{r.follow_up_q}</span>
                        <p className={styles.blockText}>{r.follow_up_a}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
