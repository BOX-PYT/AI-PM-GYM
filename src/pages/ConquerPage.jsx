import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { supabase } from '../lib/supabase'
import styles from './ConquerPage.module.css'

const ALL_DIRECTIONS = ['综合训练', 'AI 产品思维', '技术理解力', '结构化表达', '行业洞察']

const DIR_KEY = {
  综合训练: 'comprehensive',
  'AI 产品思维': 'ai-thinking',
  技术理解力: 'tech',
  结构化表达: 'expression',
  行业洞察: 'insight',
}

export default function ConquerPage() {
  const { user, loading: userLoading } = useUser()
  const navigate = useNavigate()
  const [records, setRecords] = useState([])
  const [filter, setFilter] = useState('全部')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    loadRecords()
  }, [user])

  async function loadRecords() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('records')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_conquer', true)
        .order('created_at', { ascending: false })
      setRecords(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function unmark(recordId) {
    await supabase.from('records').update({ is_conquer: false }).eq('id', recordId)
    setRecords(prev => prev.filter(r => r.id !== recordId))
  }

  const filters = ['全部', ...ALL_DIRECTIONS]
  const filtered = filter === '全部' ? records : records.filter(r => r.direction === filter)

  function formatDate(ts) {
    if (!ts) return ''
    const d = new Date(ts)
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  function startConquerSession() {
    navigate('/train/comprehensive', { state: { level: '进阶', isConquerMode: true } })
  }

  if (userLoading || loading) {
    return <div className="page loading-spinner">加载中...</div>
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>待攻克</h1>
            <p className={styles.subtitle}>
              {records.length > 0 ? `${records.length} 道题待练` : '暂无标记题目'}
            </p>
          </div>
          {records.length > 0 && (
            <button className={styles.practiceBtn} onClick={startConquerSession}>
              专项训练 →
            </button>
          )}
        </div>
      </header>

      <div className={styles.body}>
        {records.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <p className={styles.emptyText}>还没有待攻克题目</p>
            <p className={styles.emptyHint}>在训练中标记题目后会出现在这里</p>
          </div>
        ) : (
          <>
            <div className={styles.filterRow}>
              {filters.map(f => (
                <button
                  key={f}
                  className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className={styles.list}>
              {filtered.map(r => (
                <div key={r.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className="badge" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                      {r.direction}
                    </span>
                    <span className={styles.date}>{formatDate(r.created_at)}</span>
                  </div>
                  <p className={styles.question}>{r.question}</p>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.retryBtn}
                      onClick={() => navigate(`/train/${DIR_KEY[r.direction] || 'comprehensive'}`)}
                    >
                      重练
                    </button>
                    <button className={styles.unmarkBtn} onClick={() => unmark(r.id)}>
                      取消标记
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
