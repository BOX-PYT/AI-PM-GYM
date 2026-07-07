import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { supabase } from '../lib/supabase'
import { apiPost } from '../lib/api'
import { retrieveChunks } from '../lib/rag'
import { getDimension } from '../lib/dimensions'
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

  const dim = getDimension(direction)
  const dirLabel = dim ? dim.label : (DIRECTION_LABEL[direction] || direction)

  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackDetail, setFeedbackDetail] = useState({ score: null, hit_points: [], missed: [] })
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [followUpInput, setFollowUpInput] = useState('')
  const [followUpQ, setFollowUpQ] = useState('')
  const [followUpA, setFollowUpA] = useState('')
  const [followUpLoading, setFollowUpLoading] = useState(false)
  const [isConquer, setIsConquer] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [sessionRecords, setSessionRecords] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [recordingTarget, setRecordingTarget] = useState(null) // null | 'answer' | 'followup'
  const usedTopics = useRef([])
  const recognitionRef = useRef(null)

  const voiceSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  useEffect(() => {
    return () => recognitionRef.current?.stop()
  }, [])

  useEffect(() => {
    if (showAnalysis && recordingTarget === 'answer') {
      recognitionRef.current?.stop()
      setRecordingTarget(null)
    }
  }, [showAnalysis])

  // target: 'answer' | 'followup'，setter 是对应文本框的 setState
  function toggleVoice(target, setter) {
    if (recordingTarget === target) {
      recognitionRef.current?.stop()
      setRecordingTarget(null)
      return
    }
    recognitionRef.current?.stop() // 切换输入框前先停掉正在跑的那个

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
      if (text) setter(prev => prev ? prev + text : text)
    }
    recognition.onerror = () => setRecordingTarget(null)
    recognition.onend = () => setRecordingTarget(null)
    recognitionRef.current = recognition
    recognition.start()
    setRecordingTarget(target)
  }

  // 预生成 5 题
  useEffect(() => {
    generateQuestions()
  }, [])

  async function generateQuestions() {
    setLoadingQuestions(true)
    try {
      // RAG：按维度从课件知识库随机采样知识点，作为出题依据（防幻觉 + 考点可溯源）
      const chunks = dim ? await retrieveChunks(dim.key, { limit: 3 }) : []
      const res = await apiPost('generate-questions', {
        direction: dim ? `${dim.label}（覆盖：${dim.topics}）` : (DIRECTION_LABEL[direction] || direction),
        level,
        used_topics: usedTopics.current,
        chunks,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || '生成题目失败')
      }
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
        direction: dirLabel,
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
      const res = await apiPost('get-feedback', {
        question: currentQ.question,
        answer: currentQ.answer,
        user_input: userInput,
        dimension: dim ? dim.key : null,
      })
      const data = await res.json()
      setFeedback(data.feedback)
      setFeedbackDetail({
        score: typeof data.score === 'number' ? data.score : null,
        hit_points: data.hit_points || [],
        missed: data.missed || [],
      })
    } catch {
      setFeedback('点评加载失败，请继续下一题。')
      setFeedbackDetail({ score: null, hit_points: [], missed: [] })
    } finally {
      setFeedbackLoading(false)
    }
  }

  async function handleAskFollowUp() {
    if (!followUpInput.trim() || followUpQ || !currentQ) return
    const q = followUpInput.trim()
    setFollowUpLoading(true)
    try {
      const res = await apiPost('followup', {
        question: currentQ.question,
        answer: currentQ.answer,
        user_input: userInput,
        ai_feedback: feedback,
        follow_up_question: q,
      })
      const data = await res.json()
      setFollowUpQ(q)
      setFollowUpA(data.answer || '回答生成失败，请稍后再试。')
    } catch {
      setFollowUpQ(q)
      setFollowUpA('回答生成失败，请稍后再试。')
    } finally {
      setFollowUpLoading(false)
    }
  }

  async function handleNext() {
    // 保存当前记录
    setSaveError('')
    let saved = false
    try {
      const sid = await ensureSession()
      if (user && sid && currentQ) {
        const legacyRecord = {
          user_id: user.id,
          session_id: sid,
          question: currentQ.question,
          answer: currentQ.answer,
          user_input: userInput,
          ai_feedback: feedback,
          direction: dirLabel,
          level,
          is_conquer: isConquer,
        }
        const record = {
          ...legacyRecord,
          dimension: dim ? dim.key : null,
          score: feedbackDetail.score,
          hit_points: feedbackDetail.hit_points,
          missed: feedbackDetail.missed,
          follow_up_q: followUpQ || null,
          follow_up_a: followUpA || null,
        }
        // 先按新 schema 写；若列不存在（DDL 未执行）则回退到旧字段，保证不丢记录
        const { error } = await supabase.from('records').insert(record)
        if (error) {
          const { error: legacyErr } = await supabase.from('records').insert(legacyRecord)
          if (legacyErr) throw legacyErr
        }
        saved = true
        setSessionRecords(prev => [...prev, { ...record }])
      }
    } catch (e) {
      console.error('保存记录失败', e)
      setSaveError(`这道题没保存成功：${e.message || e}，点"重试保存"再试一次，否则不会计入统计。`)
    }
    if (user && currentQ && !saved) {
      setSaveError(prev => prev || '这道题没保存成功，可能没有登录会话，点"重试保存"再试一次。')
      return // 保存失败就停在当前题，不跳下一题/不进回顾页，避免用户没发现就丢了这道题
    }

    if (currentIdx < 4) {
      recognitionRef.current?.stop()
      setRecordingTarget(null)
      setCurrentIdx(i => i + 1)
      setUserInput('')
      setShowAnalysis(false)
      setFeedback('')
      setFeedbackDetail({ score: null, hit_points: [], missed: [] })
      setIsConquer(false)
      setFollowUpInput('')
      setFollowUpQ('')
      setFollowUpA('')
    } else {
      // 5 题完成，原子自增 total_completed（数据库函数，避免先取再写的竞态），跳转回顾页
      if (user) {
        const { error: incErr } = await supabase.rpc('increment_completed', { p_user_id: user.id })
        if (incErr) console.error('更新完成计数失败', incErr)
      }
      navigate('/review', {
        state: {
          records: [...sessionRecords, {
            question: currentQ?.question,
            answer: currentQ?.answer,
            user_input: userInput,
            ai_feedback: feedback,
            direction: dirLabel,
            dimension: dim ? dim.key : null,
            score: feedbackDetail.score,
            follow_up_q: followUpQ || null,
            follow_up_a: followUpA || null,
            level,
            is_conquer: isConquer,
          }],
          direction: dirLabel,
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
            {dirLabel}
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
                className={`${styles.voiceBtn} ${recordingTarget === 'answer' ? styles.voiceBtnActive : ''}`}
                onClick={() => toggleVoice('answer', setUserInput)}
                title={recordingTarget === 'answer' ? '停止录音' : '语音输入'}
              >
                {recordingTarget === 'answer' ? (
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className={styles.analysisLabel}>AI 点评</h3>
              {!feedbackLoading && typeof feedbackDetail.score === 'number' && (
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
                  {feedbackDetail.score} 分{dim ? ` · ${dim.label}` : ''}
                </span>
              )}
            </div>
            {feedbackLoading ? (
              <p className={styles.loadingText}>点评生成中...</p>
            ) : (
              <>
                <p className={styles.feedbackText}>{feedback}</p>
                {(feedbackDetail.hit_points.length > 0 || feedbackDetail.missed.length > 0) && (
                  <div style={{ marginTop: 8, fontSize: 12, lineHeight: 1.7, color: 'var(--text-muted)' }}>
                    {feedbackDetail.hit_points.length > 0 && (
                      <div>✓ 命中：{feedbackDetail.hit_points.join('、')}</div>
                    )}
                    {feedbackDetail.missed.length > 0 && (
                      <div>△ 待补：{feedbackDetail.missed.join('、')}</div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className={styles.analysisBlock}>
            <h3 className={styles.analysisLabel}>参考答案</h3>
            <p className={styles.answerText}>{currentQ.answer}</p>
            {currentQ.source && (
              <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
                考点来源：{currentQ.source}
              </p>
            )}
          </div>

          <div className={styles.analysisBlock}>
            <h3 className={styles.analysisLabel}>追问（1 次机会）</h3>
            {followUpQ ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>你问：{followUpQ}</p>
                {followUpLoading ? (
                  <p className={styles.loadingText}>回答生成中...</p>
                ) : (
                  <p className={styles.feedbackText}>{followUpA}</p>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <textarea
                  className={styles.textarea}
                  style={{ minHeight: 40, flex: 1 }}
                  placeholder="对题目或答案里的概念有疑问？可以追问一次"
                  value={followUpInput}
                  onChange={e => setFollowUpInput(e.target.value)}
                  disabled={followUpLoading}
                />
                {voiceSupported && (
                  <button
                    className={`${styles.voiceBtn} ${recordingTarget === 'followup' ? styles.voiceBtnActive : ''}`}
                    onClick={() => toggleVoice('followup', setFollowUpInput)}
                    title={recordingTarget === 'followup' ? '停止录音' : '语音输入'}
                    type="button"
                  >
                    {recordingTarget === 'followup' ? (
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
                <button
                  className={styles.ctaBtn}
                  onClick={handleAskFollowUp}
                  disabled={!followUpInput.trim() || followUpLoading}
                >
                  {followUpLoading ? '生成中...' : '追问'}
                </button>
              </div>
            )}
          </div>

          {saveError && (
            <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--accent)', lineHeight: 1.6 }}>
              {saveError}
            </p>
          )}

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
              {saveError ? '重试保存' : (currentIdx < 4 ? '下一题' : '完成本轮')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
