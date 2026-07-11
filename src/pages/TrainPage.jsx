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
  jd: 'JD 定制训练',
}

const MIN_CHARS = 20

function MicIcon({ recording }) {
  return recording ? (
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
  )
}

export default function TrainPage() {
  const { direction } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user } = useUser()
  const level = state?.level || '进阶'
  const jd = state?.jd || '' // JD 定制训练：粘贴的岗位描述，出题时贴合它
  const isPlacement = !!state?.isPlacement // 新手摸底测：完成后回顾页展示评估结果

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
  // 面试官追问模式：AI 基于用户作答反向追问 2 轮
  const [ivRounds, setIvRounds] = useState([]) // [{challenge, reply, verdict}]
  const [ivChallenge, setIvChallenge] = useState('') // 当前待回答的追问
  const [ivReply, setIvReply] = useState('')
  const [ivActive, setIvActive] = useState(false)
  const [ivLoading, setIvLoading] = useState(false)
  const [ivDone, setIvDone] = useState(false)
  const [ivSummary, setIvSummary] = useState('')
  const [isConquer, setIsConquer] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [sessionRecords, setSessionRecords] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [recordingTarget, setRecordingTarget] = useState(null) // null | 'answer' | 'followup' | 'ivreply'
  const [sourceChunks, setSourceChunks] = useState([]) // 本轮出题采样的知识点原文，供考点溯源展开查看
  const [showSource, setShowSource] = useState(false)
  const usedTopics = useRef([])
  const recognitionRef = useRef(null)

  const voiceSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  useEffect(() => {
    return () => recognitionRef.current?.stop()
  }, [])

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

  // 预生成 5 题。所有 setState 都在首个 await 之后（loadingQuestions 初始即为 true）
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        // RAG：按维度从课件知识库随机采样知识点，作为出题依据（防幻觉 + 考点可溯源）
        const chunks = await (dim ? retrieveChunks(dim.key, { limit: 3 }) : Promise.resolve([]))
        if (cancelled) return
        if (chunks.length) setSourceChunks(chunks)
        const res = await apiPost('generate-questions', {
          direction: dim ? `${dim.label}（覆盖：${dim.topics}）` : (DIRECTION_LABEL[direction] || direction),
          level,
          used_topics: usedTopics.current,
          chunks,
          jd,
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error || '生成题目失败')
        }
        const data = await res.json()
        if (cancelled) return
        setQuestions(data.questions)
        data.questions.forEach(q => {
          if (q.topic_keyword) usedTopics.current.push(q.topic_keyword)
        })
      } catch (e) {
        console.error(e)
      } finally {
        if (!cancelled) setLoadingQuestions(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

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

  // 分析视图里底部统一语音入口的目标输入框：优先面试官追问回复框，其次概念追问框（已用掉则无目标）
  const analysisVoice = ivActive && !ivDone && ivChallenge
    ? { target: 'ivreply', setter: setIvReply, hint: '语音回答面试官追问', short: '面试官' }
    : (!followUpQ ? { target: 'followup', setter: setFollowUpInput, hint: '语音输入追问', short: '追问' } : null)

  async function handleViewAnalysis() {
    if (!unlocked || !currentQ) return
    if (recordingTarget === 'answer') {
      // 进入分析视图后回答框即隐藏，先停掉还在跑的语音识别
      recognitionRef.current?.stop()
      setRecordingTarget(null)
    }
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
    recognitionRef.current?.stop() // 提交后输入框会锁定，停掉还在跑的语音识别
    setRecordingTarget(null)
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

  async function startInterviewer() {
    if (!currentQ) return
    setIvActive(true)
    setIvLoading(true)
    try {
      const res = await apiPost('interviewer', {
        question: currentQ.question,
        answer: currentQ.answer,
        user_input: userInput,
        history: [],
      })
      const data = await res.json()
      setIvChallenge(data.challenge || '')
      if (data.done) { setIvDone(true); setIvSummary(data.verdict || '') }
    } catch {
      setIvChallenge('面试官暂时走神了，稍后再试。')
    } finally {
      setIvLoading(false)
    }
  }

  async function submitIvReply() {
    if (!ivReply.trim() || ivLoading || !currentQ) return
    recognitionRef.current?.stop() // 提交即清空回复框，避免识别结果落进下一轮
    setRecordingTarget(null)
    const reply = ivReply.trim()
    const history = ivRounds.map(r => ({ challenge: r.challenge, reply: r.reply }))
    history.push({ challenge: ivChallenge, reply })
    setIvLoading(true)
    try {
      const res = await apiPost('interviewer', {
        question: currentQ.question,
        answer: currentQ.answer,
        user_input: userInput,
        history,
      })
      const data = await res.json()
      if (data.done) {
        // 收尾轮：本轮不单列点评，verdict 作为整场总评
        setIvRounds(prev => [...prev, { challenge: ivChallenge, reply, verdict: '' }])
        setIvDone(true)
        setIvSummary(data.verdict || '')
        setIvChallenge('')
      } else {
        setIvRounds(prev => [...prev, { challenge: ivChallenge, reply, verdict: data.verdict || '' }])
        setIvChallenge(data.challenge || '')
      }
      setIvReply('')
    } catch {
      // 保持当前追问，用户可重试
    } finally {
      setIvLoading(false)
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
      setShowSource(false)
      setFeedback('')
      setFeedbackDetail({ score: null, hit_points: [], missed: [] })
      setIsConquer(false)
      setFollowUpInput('')
      setFollowUpQ('')
      setFollowUpA('')
      setIvRounds([])
      setIvChallenge('')
      setIvReply('')
      setIvActive(false)
      setIvDone(false)
      setIvSummary('')
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
            hit_points: feedbackDetail.hit_points,
            missed: feedbackDetail.missed,
            follow_up_q: followUpQ || null,
            follow_up_a: followUpA || null,
            level,
            is_conquer: isConquer,
          }],
          direction: dirLabel,
          level,
          isPlacement,
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
          {/* footer: 字数提示 | 查看分析 | mic —— 语音入口统一放在底部最右 */}
          <div className={styles.inputFooter}>
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
            {voiceSupported && (
              <button
                className={`${styles.voiceBtn} ${recordingTarget === 'answer' ? styles.voiceBtnActive : ''}`}
                onClick={() => toggleVoice('answer', setUserInput)}
                title={recordingTarget === 'answer' ? '停止录音' : '语音输入'}
              >
                <MicIcon recording={recordingTarget === 'answer'} />
              </button>
            )}
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
              <div style={{ marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => setShowSource(v => !v)}
                  style={{
                    background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                    fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font)', textAlign: 'left',
                  }}
                >
                  考点来源：{currentQ.source}
                  <span style={{ color: 'var(--accent)', marginLeft: 6 }}>
                    {showSource ? '收起原文 ▾' : '查看原文 ▸'}
                  </span>
                </button>
                {showSource && (
                  <p style={{
                    margin: '6px 0 0', padding: '8px 10px', border: '1px solid var(--border-solid)',
                    fontSize: 12, lineHeight: 1.7, color: 'var(--text-muted)', whiteSpace: 'pre-wrap',
                  }}>
                    {sourceChunks.find(c => c.includes(currentQ.source))
                      || (jd
                        ? '本题依据你粘贴的目标岗位 JD 出题，来源点为 JD 中的该项能力要求。'
                        : '本题基于本轮采样的知识点综合出题，未能定位到单条原文。')}
                  </p>
                )}
              </div>
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
                  style={{
                    minHeight: 40, flex: 1,
                    boxShadow: recordingTarget === 'followup' ? 'inset 0 0 0 1px var(--accent)' : 'none',
                  }}
                  placeholder={recordingTarget === 'followup' ? '正在听，说出你的追问...' : '对题目或答案里的概念有疑问？可以追问一次'}
                  value={followUpInput}
                  onChange={e => setFollowUpInput(e.target.value)}
                  disabled={followUpLoading}
                />
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

          {/* 面试官追问模式：模拟压力面，基于作答反向深挖 */}
          {!feedbackLoading && (
            <div className={styles.analysisBlock}>
              <h3 className={styles.analysisLabel}>面试官追问（模拟压力面）</h3>
              {ivRounds.map((r, i) => (
                <div key={i} style={{ marginBottom: 8, fontSize: 13, lineHeight: 1.6 }}>
                  <p style={{ fontWeight: 600, margin: '0 0 2px' }}>追问 {i + 1}：{r.challenge}</p>
                  <p style={{ color: 'var(--text-muted)', margin: '0 0 2px' }}>你：{r.reply}</p>
                  {r.verdict && <p style={{ color: 'var(--accent)', margin: 0 }}>点评：{r.verdict}</p>}
                </div>
              ))}

              {!ivActive && (
                <button className={styles.conquerBtn} onClick={startInterviewer} disabled={ivLoading}>
                  🎤 让面试官追问我
                </button>
              )}

              {ivActive && !ivDone && ivChallenge && (
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: '4px 0' }}>追问 {ivRounds.length + 1}：{ivChallenge}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <textarea
                      className={styles.textarea}
                      style={{
                        minHeight: 40, flex: 1,
                        boxShadow: recordingTarget === 'ivreply' ? 'inset 0 0 0 1px var(--accent)' : 'none',
                      }}
                      placeholder={recordingTarget === 'ivreply' ? '正在听，说出你的回答...' : '回答面试官的追问'}
                      value={ivReply}
                      onChange={e => setIvReply(e.target.value)}
                      disabled={ivLoading}
                    />
                    <button className={styles.ctaBtn} onClick={submitIvReply} disabled={!ivReply.trim() || ivLoading}>
                      {ivLoading ? '...' : '回答'}
                    </button>
                  </div>
                </div>
              )}

              {ivActive && ivLoading && !ivChallenge && !ivDone && (
                <p className={styles.loadingText}>面试官思考中...</p>
              )}

              {ivDone && ivSummary && (
                <p style={{ fontSize: 13, color: 'var(--accent)', marginTop: 4, lineHeight: 1.6 }}>
                  面试官总评：{ivSummary}
                </p>
              )}
            </div>
          )}

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
            {/* 统一语音入口：底部最右，下一题按钮右边，带目标提示（语音进哪个输入框） */}
            {voiceSupported && analysisVoice && (
              <button
                className={`${styles.voiceBtn} ${styles.voiceBtnLabeled} ${recordingTarget === analysisVoice.target ? styles.voiceBtnActive : ''}`}
                onClick={() => toggleVoice(analysisVoice.target, analysisVoice.setter)}
                title={recordingTarget === analysisVoice.target ? '停止录音' : analysisVoice.hint}
                type="button"
              >
                <MicIcon recording={recordingTarget === analysisVoice.target} />
                <span>{analysisVoice.short}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
