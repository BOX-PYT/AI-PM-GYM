import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icons } from '../lib/icons'
import styles from './TrainEntryPage.module.css'

const LEVELS = [
  { key: '入门', desc: '单一概念在具体场景中的应用判断' },
  { key: '进阶', desc: '多因素权衡或方案选择，需说明理由' },
  { key: '挑战', desc: '复杂场景下的批判性思考，识别陷阱' },
]

export default function JdEntryPage() {
  const navigate = useNavigate()
  const [jd, setJd] = useState('')
  const [level, setLevel] = useState('进阶')

  function start() {
    if (!jd.trim()) return
    navigate('/train/jd/session', { state: { level, jd: jd.trim() } })
  }

  return (
    <div className="page">
      <button className={styles.back} onClick={() => navigate('/')}>
        {Icons.chevronLeft}
        返回
      </button>

      <div className={styles.dirHeader}>
        <p className={styles.category}>定向训练</p>
        <h1 className={styles.dirTitle}>JD 定制训练</h1>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 12px' }}>
        粘贴目标岗位的 JD，AI 会出贴合这个岗位能力要求和业务场景的题目，帮你针对性备面。
      </p>

      <textarea
        value={jd}
        onChange={e => setJd(e.target.value)}
        placeholder="把目标岗位的职位描述（JD）粘贴到这里……"
        style={{
          width: '100%', minHeight: 140, padding: 12, fontSize: 14, lineHeight: 1.6,
          border: '1px solid var(--border)', borderRadius: 8, resize: 'vertical',
          boxSizing: 'border-box', fontFamily: 'inherit', background: 'var(--card-bg, #fff)',
        }}
      />

      <h2 className={styles.sectionLabel}>选择难度</h2>
      <div className={styles.levelList}>
        {LEVELS.map(l => (
          <button
            key={l.key}
            className={`${styles.levelCard} ${level === l.key ? styles.selected : ''}`}
            onClick={() => setLevel(l.key)}
          >
            <div className={styles.levelTop}>
              <span className={styles.levelKey}>{l.key}</span>
              {level === l.key && Icons.check}
            </div>
            <p className={styles.levelDesc}>{l.desc}</p>
          </button>
        ))}
      </div>

      <div className={styles.startWrap}>
        <button className="btn-primary" onClick={start} disabled={!jd.trim()}>
          开始定制训练（5 题）
        </button>
        <p className={styles.tip}>题目会紧扣你粘贴的 JD，越具体的岗位描述效果越好</p>
      </div>
    </div>
  )
}
