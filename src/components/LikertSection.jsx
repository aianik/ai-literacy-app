import { useState } from 'react'
import { likertItems } from '../data/questions'
import { shuffle } from '../utils/shuffle'

export default function LikertSection({ onComplete }) {
  const [items]   = useState(() => shuffle(likertItems))
  const [answers, setAnswers] = useState({})

  const answered = Object.keys(answers).length
  const total = items.length
  const allAnswered = answered === total
  const progress = (answered / total) * 100

  const handleSelect = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  return (
    <>
      <div className="header">
        <span className="header-title">Part 1 of 2</span>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-label">{answered}/{total} answered</span>
      </div>

      <div className="container">
        <div className="card">
          <div className="section-header">
            <div className="section-badge">Self-Assessment</div>
            <h2 className="section-title">How well do you understand AI?</h2>
            <p className="section-description">
              Rate each statement on a scale from <strong>1 (Strongly Disagree)</strong> to{' '}
              <strong>7 (Strongly Agree)</strong> based on your honest confidence.
            </p>
          </div>

          {items.map((item, index) => (
            <div key={item.id} className="likert-item">
              <div className="likert-question">
                <span className="q-num">{index + 1}.</span>
                {item.text}
              </div>
              <div className="likert-labels-row">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
              <div className="likert-buttons">
                {[1, 2, 3, 4, 5, 6, 7].map(val => (
                  <button
                    key={val}
                    className={`likert-btn${answers[item.id] === val ? ' selected' : ''}`}
                    onClick={() => handleSelect(item.id, val)}
                    aria-label={`${val} out of 7`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="nav-row" style={{ marginTop: 32 }}>
            <span className="nav-hint">
              {allAnswered
                ? '✓ All questions answered'
                : `${total - answered} question${total - answered !== 1 ? 's' : ''} remaining`}
            </span>
            <button
              className="btn btn-primary"
              onClick={() => onComplete(answers)}
              disabled={!allAnswered}
            >
              Continue to Part 2 →
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
