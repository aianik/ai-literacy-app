import { useState, useRef, useEffect } from 'react'
import { mcqItems } from '../data/questions'
import { shuffle } from '../utils/shuffle'

const LETTERS = ['A', 'B', 'C', 'D']
const PEEK = 40   // px of adjacent card visible on each side
const GAP  = 16   // px gap between cards

function prepareItems() {
  return shuffle(mcqItems).map(item => {
    const paired   = item.options.map((text, i) => ({ text, isCorrect: i === item.correct }))
    const shuffled = shuffle(paired)
    return {
      ...item,
      options: shuffled.map(o => o.text),
      correct: shuffled.findIndex(o => o.isCorrect),
    }
  })
}

export default function MCQSection({ onComplete }) {
  const [items]   = useState(prepareItems)
  const [current, setCurrent] = useState(0)

  // answers[id] = selected option TEXT (not index) so ResultsScreen can
  // compare against the original mcqItems regardless of shuffle order.
  const [answers, setAnswers] = useState({})

  const [skipped, setSkipped] = useState(new Set())   // Set of item IDs
  const [showPrompt, setShowPrompt]   = useState(false)
  const [reviewQueue, setReviewQueue] = useState(null) // null | number[]
  const [reviewIdx, setReviewIdx]     = useState(0)

  const outerRef = useRef(null)
  const [outerWidth, setOuterWidth] = useState(0)

  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setOuterWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const isReviewing  = reviewQueue !== null
  const item         = items[current]
  const total        = items.length
  const selected     = answers[item.id]              // option text or undefined
  const isLastNormal = !isReviewing && current === total - 1
  const isLastReview = isReviewing  && reviewIdx === reviewQueue.length - 1
  const isLast       = isLastNormal || isLastReview

  const progress = isReviewing
    ? (reviewIdx / reviewQueue.length) * 100
    : (current   / total)              * 100

  const cardWidth   = outerWidth > 0 ? outerWidth - PEEK * 2 : 0
  const trackOffset = cardWidth > 0 ? PEEK - current * (cardWidth + GAP) : 0

  // ── Selection ──────────────────────────────────────────────────────────────

  const handleSelect = (optionText) => {
    setAnswers(prev => ({ ...prev, [item.id]: optionText }))
    // Answering a previously-skipped question un-skips it
    setSkipped(prev => { const n = new Set(prev); n.delete(item.id); return n })
  }

  // ── Review-mode advance ────────────────────────────────────────────────────

  const advanceReview = (currentAnswers, currentSkipped) => {
    if (reviewIdx + 1 < reviewQueue.length) {
      setReviewIdx(r => r + 1)
      setCurrent(reviewQueue[reviewIdx + 1])
    } else {
      // End of this review pass — reset review state, then check again.
      // If questions were re-skipped, finalizeWith will show the prompt again.
      setReviewQueue(null)
      setReviewIdx(0)
      finalizeWith(currentSkipped, currentAnswers)
    }
  }

  // ── Finalize (end of normal quiz) ──────────────────────────────────────────

  const finalizeWith = (currentSkipped, currentAnswers) => {
    if (currentSkipped.size > 0) {
      setShowPrompt(true)
    } else {
      onComplete(currentAnswers)
    }
  }

  // ── Skip button ─────────────────────────────────────────────────────────────

  const handleSkip = () => {
    // Compute new state values synchronously so we can pass them to finalize/advance
    const newAnswers = Object.fromEntries(
      Object.entries(answers).filter(([k]) => k !== item.id)
    )
    const newSkipped = new Set([...skipped, item.id])
    setAnswers(newAnswers)
    setSkipped(newSkipped)

    if (isReviewing) {
      advanceReview(newAnswers, newSkipped)
    } else if (isLastNormal) {
      finalizeWith(newSkipped, newAnswers)
    } else {
      setCurrent(c => c + 1)
    }
  }

  // ── Next button ─────────────────────────────────────────────────────────────

  const handleNext = () => {
    if (isReviewing) {
      // skipped is current state: handleSelect already removed this item if answered
      advanceReview(answers, skipped)
    } else if (isLastNormal) {
      finalizeWith(skipped, answers)
    } else {
      setCurrent(c => c + 1)
    }
  }

  // ── Prompt actions ──────────────────────────────────────────────────────────

  const handleGoReview = () => {
    // By the time user clicks this, React state is up to date
    const idxs = items
      .map((q, i) => ({ q, i }))
      .filter(({ q }) => skipped.has(q.id))
      .map(({ i }) => i)
    setShowPrompt(false)
    setReviewQueue(idxs)
    setReviewIdx(0)
    setCurrent(idxs[0])
  }

  const handleSkipAll = () => {
    setShowPrompt(false)
    onComplete(answers)   // skipped IDs have no entry → score 0
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="header">
        <span className="header-title">
          {isReviewing ? 'Reviewing skipped' : 'Part 2 of 2'}
        </span>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-label">
          {isReviewing
            ? `${reviewIdx + 1} / ${reviewQueue.length}`
            : `${current + 1} / ${total}`}
        </span>
      </div>

      <div className="container">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="section-badge">
            {isReviewing
              ? `Revisiting skipped — ${reviewQueue.length - reviewIdx} left`
              : 'Knowledge Check'}
          </div>
        </div>

        {/* ── Carousel ── */}
        <div className="mcq-carousel-outer" ref={outerRef}>
          <div
            className="mcq-carousel-track"
            style={{ transform: `translateX(${trackOffset}px)`, gap: `${GAP}px` }}
          >
            {items.map((q, idx) => {
              const dist     = idx - current
              const isActive = dist === 0
              const isAdj    = Math.abs(dist) === 1
              const wasSkipped = skipped.has(q.id)

              let stateClass = 'far'
              if (isActive) stateClass = 'active'
              else if (isAdj) stateClass = 'adjacent'

              return (
                <div
                  key={q.id}
                  className={`mcq-slide-card ${stateClass}${wasSkipped ? ' was-skipped' : ''}`}
                  style={{ width: cardWidth > 0 ? cardWidth : undefined }}
                  onClick={() => { if (!isActive && !isReviewing) setCurrent(idx) }}
                  aria-hidden={!isActive && !isAdj}
                >
                  <div className="mcq-q-num">
                    Question {idx + 1} of {total}
                    {wasSkipped && !isActive && <span className="skip-tag">Skipped</span>}
                  </div>
                  <div className="mcq-q-text">{q.text}</div>

                  {isActive && (
                    <>
                      <div className="mcq-options">
                        {q.options.map((option, index) => (
                          <button
                            key={index}
                            className={`mcq-option${answers[q.id] === option ? ' selected' : ''}`}
                            onClick={e => { e.stopPropagation(); handleSelect(option) }}
                          >
                            <div className="opt-letter">{LETTERS[index]}</div>
                            <div className="opt-text">{option}</div>
                          </button>
                        ))}
                      </div>
                      <div className="mcq-skip-row">
                        <button className="btn-skip" onClick={handleSkip}>
                          Skip this question
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* ── Skip prompt overlay ── */}
          {showPrompt && (
            <div className="mcq-prompt-overlay">
              <div className="mcq-prompt-card">
                <div className="mcq-prompt-icon">⚑</div>
                <div className="mcq-prompt-title">
                  {skipped.size === 1
                    ? '1 question was skipped'
                    : `${skipped.size} questions were skipped`}
                </div>
                <p className="mcq-prompt-body">
                  Skipped questions count as incorrect. Would you like to go back and answer them?
                </p>
                <div className="mcq-prompt-actions">
                  <button className="btn btn-ghost" onClick={handleSkipAll}>
                    No, see results
                  </button>
                  <button className="btn btn-primary" onClick={handleGoReview}>
                    Yes, go back
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Nav ── */}
        <div className="nav-row" style={{ marginTop: 20 }}>
          <button
            className="btn btn-ghost"
            onClick={() => {
              if (isReviewing) {
                if (reviewIdx > 0) {
                  setReviewIdx(r => r - 1)
                  setCurrent(reviewQueue[reviewIdx - 1])
                }
              } else {
                setCurrent(c => c - 1)
              }
            }}
            disabled={isReviewing ? reviewIdx === 0 : current === 0}
          >
            ← Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={selected === undefined}
          >
            {isLast ? 'See Results →' : 'Next →'}
          </button>
        </div>
      </div>
    </>
  )
}
