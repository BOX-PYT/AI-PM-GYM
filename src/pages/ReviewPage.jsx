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
        <div className={styles.trophy}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
            <path d="M4 22h16"/>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
          </svg>
        </div>
        <h1 className={styles.title}>本轮完成！</h1>
        <p className={styles.subtitle}>
          {state?.direction} · {state?.level} · 共 {records.length} 题
        </p>
        {conquerCount > 0 && (
          <p className={styles.conquerHint}>★ {conquerCount} 题已标记待攻克</p>
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
          style={{ marginTop: 10 }}
          onClick={() => navigate(`/train/${state?.direction || 'comprehensive'}`, {
            state: { level: state?.level }
          })}
        >
          再练一轮
        </button>
      </div>
    </div>
  )
}
