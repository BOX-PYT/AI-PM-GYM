import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { supabase } from '../lib/supabase'
import styles from './TrainPage.module.css'

const DIRECTION_LABEL = {
  comprehensive: '综合训练',
  'ai-thinking': 'AI 产品思维',
  tech: '技术理解力',
  expression: '结构化表达',
  insight: '行业洞察',
}

const LEVEL_COLOR = {
  入门: '#4ade80',
  进阶: '#f6ad55',
  挑战: '#fc8181',
}

const MIN_CHARS = 20

export default function TrainPage() {
  const { direction } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user } = useUser()
  const level = state?.level || '进阶'

  const [questions, setQuestions] = useState([]) // 缓存的 5 题
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [isConquer, setIsConquer] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [sessionRecords, setSessionRecords] = useState([]) // 本轮完成的记录
  const [sessionId, setSessionId] = useState(null)
  const usedTopics = useRef([])

  // 预生成 5 题
  useEffect(() => {
    generateQuestions()
  }, [])

  async function generateQuestions() {
    setLoadingQuestions(true)
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direction: DIRECTION_LABEL[direction] || direction,
          level,
          used_topics: usedTopics.current,
        }),
      })
      if (!res.ok) throw new Error('生成题目失败')
      const data = await res.json()
      setQuestions(data.questions)
      data.questions.forEach(q => {
        if (q.topic_keyword) usedTopics.current.push(q.topic_keyword)
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingQuestions(false)
    }
  }

  // 创建 session（第一次回答时）
  async function ensureSession() {
    if (sessionId || !user) return sessionId
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        direction: DIRECTION_LABEL[direction] || direction,
        level,
      })
      .select()
      .single()
    if (error) throw error
    setSessionId(data.id)
    return data.id
  }

  const currentQ = questions[currentIdx]
  const charCount = userInput.length
  const unlocked = charCount >= MIN_CHARS

  async function handleViewAnalysis() {
    if (!unlocked || !currentQ) return
    setFeedbackLoading(true)
    setShowAnalysis(true)
    try {
      const res = await fetch('/api/get-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          answer: currentQ.answer,
          user_input: userInput,
        }),
      })
      const data = await res.json()
      setFeedback(data.feedback)
    } catch {
      setFeedback('点评加载失败，请继续下一题。')
    } finally {
      setFeedbackLoading(false)
    }
  }

  async function handleNext() {
    // 保存当前记录
    try {
      const sid = await ensureSession()
      if (user && sid && currentQ) {
        const record = {
          user_id: user.id,
          session_id: sid,
          question: currentQ.question,
          answer: currentQ.answer,
          user_input: userInput,
          ai_feedback: feedback,
          direction: currentQ.direction || DIRECTION_LABEL[direction] || direction,
          level,
          is_conquer: isConquer,
        }
        await supabase.from('records').insert(record)
        setSessionRecords(prev => [...prev, { ...record, is_conquer: isConquer }])
      }
    } catch (e) {
      console.error('保存记录失败', e)
    }

    if (currentIdx < 4) {
      setCurrentIdx(i => i + 1)
      setUserInput('')
      setShowAnalysis(false)
      setFeedback('')
      setIsConquer(false)
    } else {
      // 5 题完成，更新 total_completed，跳转回顾页
      if (user) {
        await supabase
          .from('users')
          .update({ total_completed: supabase.rpc ? undefined : undefined }) // 用 rpc increment
          .eq('id', user.id)
        // 简单自增：先取再加
        const { data } = await supabase
          .from('users')
          .select('total_completed')
          .eq('id', user.id)
          .single()
        if (data) {
          await supabase
            .from('users')
            .update({ total_completed: (data.total_completed || 0) + 1 })
            .eq('id', user.id)
        }
      }
      navigate('/review', {
        state: {
          records: [...sessionRecords, {
            question: currentQ?.question,
            answer: currentQ?.answer,
            user_input: userInput,
            ai_feedback: feedback,
            direction: DIRECTION_LABEL[direction] || direction,
            level,
            is_conquer: isConquer,
          }],
          direction: DIRECTION_LABEL[direction] || direction,
          level,
        },
      })
    }
  }

  if (loadingQuestions) {
    return (
      <div className="page">
        <div className={styles.loadingWrap}>
          <div className={styles.loadingDots}>
            <span /><span /><span />
          </div>
          <p>正在生成 5 道训练题，请稍候...</p>
        </div>
      </div>
    )
  }

  if (!currentQ) {
    return (
      <div className="page">
        <p style={{ color: 'var(--danger)', marginTop: 40, textAlign: 'center' }}>
          题目加载失败，请返回重试。
        </p>
        <button className="btn-ghost" onClick={() => navigate(-1)} style={{ marginTop: 16 }}>
          返回
        </button>
      </div>
    )
  }

  return (
    <div className="page">
      {/* 顶部进度 */}
      <div className={styles.topBar}>
        <div className={styles.topRow}>
          <div className={styles.badges}>
            <span className="badge" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
              {DIRECTION_LABEL[direction] || direction}
            </span>
            <span className="badge" style={{ background: 'var(--surface2)', color: LEVEL_COLOR[level], border: `1px solid ${LEVEL_COLOR[level]}30` }}>
              {level}
            </span>
          </div>
          <button className={styles.closeBtn} onClick={() => navigate('/')}>退出</button>
        </div>
        <div className={styles.progressInfo}>
          <span className={styles.progressText}>{currentIdx + 1} / 5</span>
          <div className="progress-bar" style={{ flex: 1 }}>
            <div className="progress-bar-fill" style={{ width: `${(currentIdx + 1) / 5 * 100}%` }} />
          </div>
        </div>
      </div>

      {/* 题目卡片 */}
      <div className={`card ${styles.questionCard}`}>
        <p className={styles.questionText}>{currentQ.question}</p>
      </div>

      {/* 输入区 */}
      {!showAnalysis && (
        <div className={styles.inputSection}>
          <textarea
            className={styles.textarea}
            placeholder="写下你的判断或分析..."
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            rows={5}
          />
          <div className={styles.inputFooter}>
            <div className={`${styles.charBar} ${unlocked ? styles.charBarDone : ''}`}>
              <div className={styles.charFill} style={{ width: `${Math.min(charCount / MIN_CHARS * 100, 100)}%` }} />
            </div>
            <span className={styles.charCount}>
              {charCount < MIN_CHARS ? `还需 ${MIN_CHARS - charCount} 字` : '✓ 可查看分析'}
            </span>
          </div>
          <button
            className="btn-primary"
            disabled={!unlocked}
            onClick={handleViewAnalysis}
            style={{ marginTop: 12 }}
          >
            查看分析
          </button>
        </div>
      )}

      {/* 分析展示 */}
      {showAnalysis && (
        <div className={styles.analysisSection}>
          <div className={styles.analysisBlock}>
            <h3 className={styles.analysisLabel}>AI 点评</h3>
            {feedbackLoading ? (
              <p className={styles.loadingText}>点评生成中...</p>
            ) : (
              <p className={styles.feedbackText}>{feedback}</p>
            )}
          </div>

          <div className={styles.analysisBlock}>
            <h3 className={styles.analysisLabel}>参考答案</h3>
            <p className={styles.answerText}>{currentQ.answer}</p>
          </div>

          <div className={styles.actionRow}>
            <button
              className={`${styles.conquerBtn} ${isConquer ? styles.conquerActive : ''}`}
              onClick={() => setIsConquer(v => !v)}
            >
              {isConquer ? '已标记待攻克' : '标记待攻克'}
            </button>
            <button
              className={`btn-primary ${styles.nextBtn}`}
              onClick={handleNext}
              disabled={feedbackLoading}
            >
              {currentIdx < 4 ? '下一题' : '完成本轮'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
