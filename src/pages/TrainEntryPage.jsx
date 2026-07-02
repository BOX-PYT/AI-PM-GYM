import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Icons, DIR_COLORS } from '../lib/icons'
import { getDimension } from '../lib/dimensions'
import styles from './TrainEntryPage.module.css'

const DIRECTION_META = {
  comprehensive:  { label: '综合训练',  category: '综合训练' },
  'ai-thinking':  { label: 'AI 产品思维', category: '专项训练' },
  tech:           { label: '技术理解力',  category: '专项训练' },
  expression:     { label: '结构化表达',  category: '专项训练' },
  insight:        { label: '行业洞察',    category: '专项训练' },
}

const LEVELS = [
  { key: '入门',  desc: '单一概念在具体场景中的应用判断' },
  { key: '进阶',  desc: '多因素权衡或方案选择，需说明理由' },
  { key: '挑战',  desc: '复杂场景下的批判性思考，识别陷阱' },
]

export default function TrainEntryPage() {
  const { direction } = useParams()
  const navigate = useNavigate()
  const dim = getDimension(direction)
  const meta = DIRECTION_META[direction] || (dim ? { label: dim.label, category: '能力训练' } : { label: direction })
  const color = dim ? dim.color : (DIR_COLORS[direction] || '#6366f1')
  const [level, setLevel] = useState('进阶')

  function start() {
    navigate(`/train/${direction}/session`, { state: { level } })
  }

  return (
    <div className="page">
      <button className={styles.back} onClick={() => navigate('/')}>
        {Icons.chevronLeft}
        返回
      </button>

      <div className={styles.dirHeader}>
        <p className={styles.category}>{meta.category}</p>
        <h1 className={styles.dirTitle}>{meta.label}</h1>
      </div>

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
        <button className="btn-primary" onClick={start}>
          开始训练（5 组）
        </button>
        <p className={styles.tip}>每次训练包含 5 道题，完成后可查看本轮回顾</p>
      </div>
    </div>
  )
}
