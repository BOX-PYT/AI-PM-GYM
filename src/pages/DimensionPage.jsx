import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { supabase } from '../lib/supabase'
import { getDimension, dimensionLevel } from '../lib/dimensions'
import { Icons } from '../lib/icons'
import styles from './DimensionPage.module.css'

export default function DimensionPage() {
  const { key } = useParams()
  const navigate = useNavigate()
  const { user } = useUser()
  const dim = getDimension(key)

  const [level, setLevel] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [conquerItems, setConquerItems] = useState([])

  useEffect(() => {
    if (!user || !dim) return
    ;(async () => {
      const { data } = await supabase
        .from('records')
        .select('score, is_conquer, question, created_at, dimension')
        .eq('user_id', user.id)
        .eq('dimension', dim.key)
        .order('created_at', { ascending: true })
      const rows = data || []
      const scores = rows.filter(r => typeof r.score === 'number').map(r => r.score)
      setLevel(dimensionLevel(scores))
      setAnswered(rows.length)
      setConquerItems(rows.filter(r => r.is_conquer).reverse())
    })()
  }, [user, dim])

  if (!dim) {
    return (
      <div className="page">
        <button className={styles.back} onClick={() => navigate('/')}>{Icons.chevronLeft}返回</button>
        <p style={{ marginTop: 40, textAlign: 'center', color: 'var(--text-muted)' }}>未找到该能力维度</p>
      </div>
    )
  }

  return (
    <div className="page">
      <button className={styles.back} onClick={() => navigate('/')}>{Icons.chevronLeft}能力雷达</button>

      <div className={styles.dimHeader}>
        <span className={styles.dot} style={{ background: dim.color }} />
        <div>
          <p className={styles.category}>能力维度</p>
          <h1 className={styles.title}>{dim.label}</h1>
        </div>
        <span className={styles.level} style={{ color: dim.color }}>Lv {level}</span>
      </div>

      <p className={styles.why}>{dim.why}</p>

      {/* 成功指标达标线 */}
      <div className={styles.metricCard} style={{ borderLeftColor: dim.color }}>
        <span className={styles.metricLabel}>成功指标 · 达标线</span>
        <p className={styles.metricText}>{dim.metric}</p>
        <span className={styles.metricMeta}>已答 {answered} 题 · 水平值 = 近 10 题均分 × 熟练度</span>
      </div>

      {/* 覆盖知识点 */}
      <div className={styles.topics}>
        <span className={styles.sectionLabel}>覆盖</span>
        <p className={styles.topicsText}>{dim.topics}</p>
      </div>

      {/* 待攻克 */}
      {conquerItems.length > 0 && (
        <div className={styles.conquerBlock}>
          <span className={styles.sectionLabel}>本维度待攻克 · {conquerItems.length}</span>
          {conquerItems.slice(0, 5).map((r, i) => (
            <p key={i} className={styles.conquerItem}>{r.question}</p>
          ))}
        </div>
      )}

      <div className={styles.startWrap}>
        <button className="btn-primary" onClick={() => navigate(`/train/${dim.key}`)}>
          练这个维度（5 组）
        </button>
        <p className={styles.tip}>答题后本维度水平值实时更新</p>
      </div>
    </div>
  )
}
