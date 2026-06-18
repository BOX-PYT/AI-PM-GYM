import { useLocation, useNavigate } from 'react-router-dom'
import styles from './ReviewPage.module.css'

export default function ReviewPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const records = state?.records || []
  const conquerCount = records.filter(r => r.is_conquer).length

  return (
    <div className="page">
      <div className={styles.header}>
        <span className={styles.completeNum}>{records.length}</span>
        <p className={styles.completeLabel}>题完成</p>
        <p className={styles.subtitle}>{state?.direction} · {state?.level}</p>
        {conquerCount > 0 && (
          <p className={styles.conquerHint}>· {conquerCount} 题标记待攻克</p>
        )}
      </div>

      <div className={styles.recordList}>
        {records.map((r, i) => (
          <div key={i} className={styles.recordCard}>
            <div className={styles.recordTop}>
              <span className={styles.num}>Q{i + 1}</span>
              {r.is_conquer && <span className={styles.conquerTag}>待攻克</span>}
            </div>
            <p className={styles.question}>{r.question}</p>
            {r.ai_feedback && (
              <p className={styles.feedback}>{r.ai_feedback}</p>
            )}
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button className="btn-primary" onClick={() => navigate('/')}>
          返回首页
        </button>
        <button
          className="btn-ghost"
          onClick={() => navigate(`/train/${state?.direction || 'comprehensive'}`, {
            state: { level: state?.level }
          })}
        >
          再练一轮 →
        </button>
      </div>

      <div className={styles.colophon}>
        <span className={styles.colophonBrand}>AI PM GYM</span>
      </div>
    </div>
  )
}
