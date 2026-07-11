import { useLocation, useNavigate } from 'react-router-dom'
import styles from './ReviewPage.module.css'

// 摸底评级阈值对齐评分 rubric 锚点（server/feedback-prompt.js）：
// 70+ = 覆盖主要要点，50-69 = 抓到部分要点但有缺口，50 以下 = 方向对但很浅
function placementGrade(avg) {
  if (avg >= 70) return { label: '基础扎实', advice: '可以直接练进阶 / 挑战难度，重点打磨表达深度和 tradeoff 论证。' }
  if (avg >= 50) return { label: '有基础，有缺口', advice: '主要要点能抓到但有明显缺口，建议从最薄弱维度的进阶题练起。' }
  return { label: '入门阶段', advice: '先按维度从入门题系统过一遍，把概念落到具体场景里再提难度。' }
}

export default function ReviewPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const records = state?.records || []
  const conquerCount = records.filter(r => r.is_conquer).length

  // 摸底测试：用本轮 5 题的评分给出能力评估结果
  const isPlacement = !!state?.isPlacement
  const scores = records.map(r => r.score).filter(s => typeof s === 'number')
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
  const grade = avgScore !== null ? placementGrade(avgScore) : null
  const weakPoints = [...new Set(records.flatMap(r => r.missed || []))].slice(0, 4)

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

      {isPlacement && (
        <div className={styles.assessCard}>
          <span className={styles.assessLabel}>摸底评估结果</span>
          {avgScore !== null ? (
            <>
              <div className={styles.assessScoreRow}>
                <span className={styles.assessScore}>{avgScore}</span>
                <span className={styles.assessGrade}>{grade.label}</span>
              </div>
              <p className={styles.assessAdvice}>{grade.advice}</p>
              {weakPoints.length > 0 && (
                <p className={styles.assessWeak}>待补要点：{weakPoints.join('、')}</p>
              )}
              <p className={styles.assessHint}>能力雷达已按本次作答更新，回首页可查看四维画像。</p>
            </>
          ) : (
            <p className={styles.assessAdvice}>本次未获得有效评分（点评服务异常），建议回首页再练一轮生成能力画像。</p>
          )}
        </div>
      )}

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
