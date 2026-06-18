import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { supabase } from '../lib/supabase'
import { Icons } from '../lib/icons'
import styles from './StatsDetailPage.module.css'

const DIR_KEY = {
  'AI 产品思维': 'ai-thinking',
  技术理解力:    'tech',
  结构化表达:    'expression',
  行业洞察:      'insight',
}

export default function StatsDetailPage() {
  const { direction } = useParams()
  const dirName = decodeURIComponent(direction)
  const navigate = useNavigate()
  const { user } = useUser()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (!user) return
    supabase
      .from('records')
      .select('*')
      .eq('user_id', user.id)
      .eq('direction', dirName)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRecords(data || [])
        setLoading(false)
      })
  }, [user, dirName])

  function toggleExpand(id) {
    setExpanded(prev => prev === id ? null : id)
  }

  function formatDate(ts) {
    if (!ts) return ''
    const d = new Date(ts)
    return `${d.getMonth() + 1}月${d.getDate()}日`
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/stats')}>
          {Icons.chevronLeft}
          统计
        </button>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{dirName}</h1>
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
            <p>还没有这个方向的记录</p>
            <button
              className={styles.startBtn}
              onClick={() => navigate(`/train/${DIR_KEY[dirName] || 'comprehensive'}`)}
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
