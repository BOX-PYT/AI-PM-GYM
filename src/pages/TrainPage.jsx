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

  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [isConquer, setIsConquer] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [sessionRecords, setSessionRecords] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const usedTopics = useRef([])
  const recognitionRef = useRef(null)

  const voiceSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  useEffect(() => {
    return () => recognitionRef.current?.stop()
  }, [])

  useEffect(() => {
    if (showAnalysis && isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
    }
  }, [showAnalysis])

  function toggleVoice() {
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SR()
    recognition.lang = 'zh-CN'
    recognition.continuous = true
    recognition.interimResults = false
    recognition.onresult = (e) => {
      const text = Array.from(e.results)
        .slice(e.resultIndex)
        .filter(r => r.isFinal)
        .map(r => r[0].transcript)
        .join('')
      if (text) setUserInput(prev => prev ? prev + text : text)
    }
    recognition.onerror = () => setIsRecording(false)
    recognition.onend = () => setIsRecording(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }

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
          <span className={styles.topMeta}>
            {DIRECTION_LABEL[direction] || direction}
            <span className={styles.topMetaLevel}> · {level}</span>
          </span>
          <button className={styles.closeBtn} onClick={() => navigate('/')}>退出</button>
        </div>
        <div className={styles.progressInfo}>
          <span className={styles.progressText}>{currentIdx + 1} / 5</span>
          <div className="progress-bar" style={{ flex: 1 }}>
            <div className="progress-bar-fill" style={{ width: `${(currentIdx + 1) / 5 * 100}%` }} />
          </div>
        </div>
      </div>

      {/* 题目 */}
      <div className={styles.questionCard}>
        <span className={styles.questionLabel}>Q</span>
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
          />
          {/* charBar 作为 textarea 与 footer 之间的进度分隔线 */}
          <div className={`${styles.charBar} ${unlocked ? styles.charBarDone : ''}`}>
            <div className={styles.charFill} style={{ width: `${Math.min(charCount / MIN_CHARS * 100, 100)}%` }} />
          </div>
          {/* footer: mic | 字数提示 | 查看分析 */}
          <div className={styles.inputFooter}>
            {voiceSupported && (
              <button
                className={`${styles.voiceBtn} ${isRecording ? styles.voiceBtnActive : ''}`}
                onClick={toggleVoice}
                title={isRecording ? '停止录音' : '语音输入'}
              >
                {isRecording ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="22"/>
                    <line x1="9" y1="22" x2="15" y2="22"/>
                  </svg>
                )}
              </button>
            )}
            <span className={styles.charCount}>
              {charCount < MIN_CHARS ? `还需 ${MIN_CHARS - charCount} 字` : '✓'}
            </span>
            <button
              className={styles.ctaBtn}
              disabled={!unlocked}
              onClick={handleViewAnalysis}
            >
              查看分析 →
            </button>
          </div>
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
