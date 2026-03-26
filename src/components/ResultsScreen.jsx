import { useState, useEffect } from 'react'
import { likertItems, mcqItems } from '../data/questions'

// ── Scoring ───────────────────────────────────────────────────────────────────

function computeLikertScores(answers) {
  const f1 = likertItems.filter(i => i.factor === 1)
  const f2 = likertItems.filter(i => i.factor === 2)
  const mean = (items) => items.reduce((s, i) => s + (answers[i.id] ?? 0), 0) / items.length
  const f1Mean = mean(f1)
  const f2Mean = mean(f2)
  const overall = (f1Mean * f1.length + f2Mean * f2.length) / likertItems.length
  return { f1Mean, f2Mean, overall }
}

function computeFactualScore(answers) {
  // answers[id] stores the selected option TEXT; compare to the correct option text
  // so the score is independent of shuffle order.
  return mcqItems.reduce((sum, item) =>
    sum + (answers[item.id] === item.options[item.correct] ? 1 : 0), 0)
}

// ── Calibration ───────────────────────────────────────────────────────────────

const SELF_MEAN    = 4.40;  const SELF_SD    = 1.24
const FACTUAL_MEAN = 11.97; const FACTUAL_SD = 3.88

function computeCalibration(selfScore, factualScore) {
  const zSelf    = (selfScore    - SELF_MEAN)    / SELF_SD
  const zFactual = (factualScore - FACTUAL_MEAN) / FACTUAL_SD
  return zSelf - zFactual
}

function calibrationCategory(score) {
  if (score >  0.5) return {
    label:  'Overestimating',
    color:  'var(--cal-over)',
    bg:     'var(--cal-over-bg)',
    border: 'var(--cal-over)',
    desc:   'Your confidence in your AI knowledge is notably higher than your factual score suggests. This pattern is common among people with more AI exposure and is consistent with the reverse Dunning-Kruger effect found in the paper.',
  }
  if (score < -0.5) return {
    label:  'Underestimating',
    color:  'var(--cal-under)',
    bg:     'var(--cal-under-bg)',
    border: 'var(--cal-under)',
    desc:   'Your factual score is higher than your self-confidence suggests. People newer to AI often undervalue knowledge they already have, possibly because they perceive the domain as more complex than it is.',
  }
  return {
    label:  'Well-calibrated',
    color:  'var(--cal-good)',
    bg:     'var(--cal-good-bg)',
    border: 'var(--cal-good)',
    desc:   'Your self-perceived and demonstrated AI literacy are closely aligned. Your confidence is a reliable signal of your actual knowledge.',
  }
}

// ── Dimension definitions ─────────────────────────────────────────────────────

const DIMENSIONS = {
  factual: {
    title:    'What you actually know about AI',
    subtitle: 'Demonstrated through 18 objective questions, independent of your confidence.',
    tiers: {
      novice:     'You\'re still building your foundational knowledge of AI. Exploring how AI systems learn, decide, and where they fall short will help you engage with AI tools more critically.',
      developing: 'You have a basic grasp of AI concepts. Strengthening your understanding of machine learning and AI limitations will give you a more reliable foundation.',
      proficient: 'You have a solid factual understanding of AI. You can reason accurately about how AI systems work and recognize their real-world strengths and weaknesses.',
      advanced:   'You have a strong command of AI knowledge. Your understanding enables you to engage confidently and critically with complex AI topics and systems.',
    },
  },
  f1: {
    title:    'Understanding how AI works',
    subtitle: 'Do you know how AI is built, trained, and makes decisions?',
    tiers: {
      novice:     'Building a stronger technical foundation will help you evaluate AI tools more confidently and avoid being misled by marketing claims or black-box outputs.',
      developing: 'You have a starting point. Deepening your grasp of training processes, data, and decision-making will help you reason about why AI systems behave the way they do.',
      proficient: 'You understand the mechanics behind AI well enough to critically assess systems, ask the right questions, and catch common pitfalls in AI-driven products.',
      advanced:   'You have a strong technical command of AI. You\'re well-placed to evaluate, guide, or contribute to AI systems in meaningful ways.',
    },
  },
  f2: {
    title:    'Navigating AI responsibly',
    subtitle: 'Are you aware of AI\'s ethical, societal, and regulatory implications?',
    tiers: {
      novice:     'Developing awareness of AI bias, fairness, and regulation will help you recognize when AI systems may be causing harm and advocate for more responsible use.',
      developing: 'You\'re beginning to appreciate AI\'s broader impact. Growing this awareness will help you make more informed decisions about when and how to trust or challenge AI.',
      proficient: 'You have a solid awareness of how AI shapes society, including its risks, biases, and governance. You can engage thoughtfully with its ethical dimensions.',
      advanced:   'You have a nuanced understanding of AI\'s societal role. You\'re well-equipped to advocate for responsible, equitable, and transparent AI practices.',
    },
  },
}

// ── Tier helpers ──────────────────────────────────────────────────────────────

function factualTierKey(score) {
  if (score <= 5)  return 'novice'
  if (score <= 10) return 'developing'
  if (score <= 14) return 'proficient'
  return 'advanced'
}

function selfTierKey(score) {
  if (score <= 2.5) return 'novice'
  if (score <= 4.0) return 'developing'
  if (score <= 5.5) return 'proficient'
  return 'advanced'
}

const TIER_BADGE = {
  novice:     { label: 'Novice',     css: 'tier-novice' },
  developing: { label: 'Developing', css: 'tier-developing' },
  proficient: { label: 'Proficient', css: 'tier-proficient' },
  advanced:   { label: 'Advanced',   css: 'tier-advanced' },
}

// ── Animation helpers ─────────────────────────────────────────────────────────

function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    function tick(now) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - t) * (1 - t) * (1 - t)  // ease-out cubic
      setVal(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return val
}

// ── Fun-stats helpers ─────────────────────────────────────────────────────────

function normPercentile(z) {
  const t = 1 / (1 + 0.3275911 * Math.abs(z))
  const p = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))))
  const erf = 1 - p * Math.exp(-z * z)
  return z >= 0 ? (1 + erf) / 2 : (1 - erf) / 2
}

function schoolGrade(score) {
  const pct = score / 18
  if (pct >= 0.90) return { grade: 'A', css: 'grade-a' }
  if (pct >= 0.80) return { grade: 'B', css: 'grade-b' }
  if (pct >= 0.70) return { grade: 'C', css: 'grade-c' }
  if (pct >= 0.60) return { grade: 'D', css: 'grade-d' }
  return { grade: 'F', css: 'grade-f' }
}

// ── Canvas card download (no external deps) ───────────────────────────────────

function downloadResultCard({ factual, overall, calibration, cal, factualKey, grade }) {
  const W = 1200, H = 630
  const canvas = document.createElement('canvas')
  canvas.width  = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0,    '#1E1B4B')
  bg.addColorStop(0.55, '#312E81')
  bg.addColorStop(1,    '#4C1D95')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Decorative orbs
  ctx.beginPath()
  ctx.arc(W / 2, -60, 320, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(99,102,241,0.11)'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(90, H - 80, 175, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(167,139,250,0.10)'
  ctx.fill()

  // Header
  ctx.font = '600 22px system-ui,sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.38)'
  ctx.fillText('AI LITERACY SCALE', 60, 58)

  const gradeClr = { A:'#6EE7B7', B:'#93C5FD', C:'#FCD34D', D:'#FCA5A5', F:'#F87171' }

  // ── Three-score row: self-assessed | knowledge | grade ────────────────────
  // Left: self-assessed
  const selfStr = overall.toFixed(1)
  ctx.font = '900 148px system-ui,sans-serif'
  ctx.fillStyle = '#A5B4FC'
  ctx.textAlign = 'left'
  ctx.fillText(selfStr, 60, 258)
  const selfW = ctx.measureText(selfStr).width
  ctx.font = '600 44px system-ui,sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.32)'
  ctx.fillText('/7', 60 + selfW + 10, 238)
  ctx.font = '600 18px system-ui,sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.42)'
  ctx.fillText('SELF-ASSESSED', 60, 282)

  // Center: knowledge score — measure total width and center it
  const scoreStr = String(factual)
  ctx.font = '900 148px system-ui,sans-serif'
  const scoreNumW = ctx.measureText(scoreStr).width
  ctx.font = '600 44px system-ui,sans-serif'
  const denomStr = '/18'
  const denomW   = ctx.measureText(denomStr).width
  const totalW   = scoreNumW + 10 + denomW
  const scoreX   = W / 2 - totalW / 2

  ctx.font = '900 148px system-ui,sans-serif'
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'left'
  ctx.fillText(scoreStr, scoreX, 258)
  ctx.font = '600 44px system-ui,sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.32)'
  ctx.fillText(denomStr, scoreX + scoreNumW + 10, 238)
  ctx.font = '600 18px system-ui,sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.42)'
  ctx.textAlign = 'center'
  ctx.fillText('KNOWLEDGE', W / 2, 282)

  // Right: grade
  ctx.font = '900 170px system-ui,sans-serif'
  ctx.fillStyle = gradeClr[grade] ?? '#A5B4FC'
  ctx.textAlign = 'right'
  ctx.fillText(grade, W - 60, 268)
  ctx.font = '600 18px system-ui,sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.38)'
  ctx.fillText(`${Math.round((factual / 18) * 100)}% CORRECT`, W - 60, 290)
  ctx.textAlign = 'left'

  // Progress bar
  const bx = 60, by = 320, bw = W - 120, bh = 12
  ctx.fillStyle = 'rgba(255,255,255,0.11)'
  ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 6); ctx.fill()
  const fill = ctx.createLinearGradient(bx, 0, bx + bw, 0)
  fill.addColorStop(0, '#818CF8'); fill.addColorStop(1, '#A78BFA')
  ctx.fillStyle = fill
  ctx.beginPath(); ctx.roundRect(bx, by, bw * (factual / 18), bh, 6); ctx.fill()

  // Divider
  ctx.fillStyle = 'rgba(255,255,255,0.07)'
  ctx.fillRect(60, 358, W - 120, 1)

  // Bottom stats — tier + calibration only
  const calColors = {
    Overestimating:   '#C4B5FD',
    Underestimating:  '#FCD34D',
    'Well-calibrated':'#6EE7B7',
  }
  const stats = [
    { l: 'TIER',        v: TIER_BADGE[factualKey].label },
    { l: 'CALIBRATION', v: cal.label, c: calColors[cal.label] },
  ]
  const cw = (W - 120) / 2
  stats.forEach(({ l, v, c }, i) => {
    const x = 60 + i * cw
    ctx.font = '600 18px system-ui,sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.32)'
    ctx.textAlign = 'left'
    ctx.fillText(l, x, 404)
    ctx.font = '800 42px system-ui,sans-serif'
    ctx.fillStyle = c ?? '#FFFFFF'
    ctx.fillText(v, x, 452)
  })

  // Footer
  ctx.font = '400 17px system-ui,sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.18)'
  ctx.textAlign = 'right'
  ctx.fillText('Based on peer-reviewed research · N = 476', W - 60, H - 30)

  // Trigger download
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob)
    const a   = document.createElement('a')
    a.href     = url
    a.download = 'ai-literacy-results.png'
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Bar({ value, max, delay = 0 }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 120 + delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div className="bar-bg">
      <div
        className="bar-fill"
        style={{ width: ready ? `${Math.min((value / max) * 100, 100)}%` : '0%' }}
      />
    </div>
  )
}

function DimensionBlock({ dim, value, max, tierKey, wide, barDelay }) {
  const tier = TIER_BADGE[tierKey]
  const implication = dim.tiers[tierKey]

  return (
    <div className={`score-block${wide ? ' wide' : ''}`}>
      <div className="sb-label">{dim.title}</div>
      <div className="sb-subtitle">{dim.subtitle}</div>

      <div className="sb-score-row">
        <div className="sb-value">
          {max === 18 ? value : value.toFixed(2)}
          <span className="sb-max">/{max}</span>
        </div>
        <span className={`tier-badge ${tier.css}`}>{tier.label}</span>
      </div>

      <Bar value={value} max={max} delay={barDelay} />

      <p className="sb-implication">{implication}</p>
    </div>
  )
}

function CalcDetails({ calibration }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="calc-details">
      <button className="calc-toggle" onClick={() => setOpen(o => !o)}>
        <span>How is this calculated?</span>
        <span className={`calc-chevron${open ? ' open' : ''}`}>›</span>
      </button>
      {open && (
        <div className="calc-body">
          <p>
            Your two scores live on different scales (1 to 7 vs. 0 to 18), so they need to
            be put on the same footing before comparing them. We do this by converting each
            score into a <strong>z-score</strong>, which simply tells you how far above or
            below the average that score is, measured in standard deviations.
          </p>
          <p>
            The averages come from the research study behind this scale, which surveyed
            476 people:
          </p>
          <ul>
            <li>Self-assessed average: <strong>4.40 out of 7</strong> (SD 1.24)</li>
            <li>Factual average: <strong>11.97 out of 18</strong> (SD 3.88)</li>
          </ul>
          <p>
            Your calibration score is then just the difference between the two z-scores.
            A score close to 0 means your confidence and your knowledge are in sync.
            The cutoff of ±0.5 is based on the gap the study found between people who
            rated themselves highly (+0.69 average) and those who rated themselves
            lower (-0.73 average).
          </p>
          <p className="calc-your-score">
            Your score: {calibration > 0 ? '+' : ''}{calibration.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  )
}

function CalibrationMeter({ score }) {
  const RANGE = 3
  const clamped = Math.max(-RANGE, Math.min(RANGE, score))
  const pct = ((clamped + RANGE) / (RANGE * 2)) * 100

  return (
    <div className="cal-meter">
      <div className="cal-track">
        <div className="cal-track-under" />
        <div className="cal-track-good"  />
        <div className="cal-track-over"  />
        <div className="cal-center-line" />
        <div className="cal-needle" style={{ left: `${pct}%` }} />
      </div>
      <div className="cal-axis-labels">
        <span>Underestimating</span>
        <span>Calibrated</span>
        <span>Overestimating</span>
      </div>
    </div>
  )
}

function FunStats({ factual, f1Mean, f2Mean, calibration }) {
  const factualZ   = (factual - FACTUAL_MEAN) / FACTUAL_SD
  const factualPct = Math.round(normPercentile(factualZ) * 100)
  const factualGap = factual - FACTUAL_MEAN
  const grade      = schoolGrade(factual)

  const calInQs      = Math.abs(calibration) * FACTUAL_SD
  const calDirection = calibration > 0.1
    ? 'ahead in confidence'
    : calibration < -0.1
    ? 'ahead in knowledge'
    : null

  const f1Wins  = f1Mean >= f2Mean
  const dimLabel = f1Wins ? 'AI mechanics' : 'AI & society'
  const dimGap   = Math.abs(f1Mean - f2Mean)

  return (
    <div className="fun-stats-section">
      <div className="fun-stats-heading">By the numbers</div>
      <div className="fun-stats-grid">

        <div className="fun-tile">
          <div className="fun-tile-value" style={{ color: 'var(--primary)' }}>
            ~{factualPct}th
          </div>
          <div className="fun-tile-label">Percentile (factual)</div>
          <div className="fun-tile-sub">
            {factualPct >= 50
              ? `You outscored ~${factualPct}% of the 476 study participants`
              : `About ${100 - factualPct}% of the 476 study participants scored higher`}
          </div>
        </div>

        <div className="fun-tile">
          <div className={`fun-tile-value fun-grade ${grade.css}`}>{grade.grade}</div>
          <div className="fun-tile-label">School-grade equivalent</div>
          <div className="fun-tile-sub">
            {factual}/18 correct · {Math.round((factual / 18) * 100)}%
          </div>
        </div>

        <div className="fun-tile">
          <div
            className="fun-tile-value"
            style={{ color: factualGap >= 0 ? 'var(--cal-good)' : 'var(--cal-under)' }}
          >
            {factualGap >= 0 ? '+' : ''}{factualGap.toFixed(1)}
          </div>
          <div className="fun-tile-label">
            {factualGap >= 0 ? 'Above' : 'Below'} the study average
          </div>
          <div className="fun-tile-sub">Points vs. the average of 11.97 / 18</div>
        </div>

        <div className="fun-tile">
          <div className="fun-tile-value fun-tile-text" style={{ color: '#7C3AED' }}>
            {dimGap < 0.15 ? 'Even split' : dimLabel}
          </div>
          <div className="fun-tile-label">Sharper self-awareness in</div>
          <div className="fun-tile-sub">
            {dimGap < 0.15
              ? `Both dimensions within ${dimGap.toFixed(2)} pts of each other`
              : `${dimGap.toFixed(1)} pt lead · mechanics ${f1Mean.toFixed(1)} vs. society ${f2Mean.toFixed(1)}`}
          </div>
        </div>

        {calDirection && (
          <div className="fun-tile fun-tile-wide">
            <div
              className="fun-tile-value"
              style={{ color: calibration > 0 ? 'var(--cal-over)' : 'var(--cal-good)' }}
            >
              ~{calInQs.toFixed(1)} questions
            </div>
            <div className="fun-tile-label">{calDirection}</div>
            <div className="fun-tile-sub">
              The gap between your confidence and your factual score, translated into the
              number of extra correct answers it would take to close it.
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ── Result hero card (page preview + save target) ─────────────────────────────

function ResultHeroCard({ factual, overall, cal, factualKey, calibration }) {
  const animScore = useCountUp(factual, 900)
  const grade     = schoolGrade(factual)
  const pct       = Math.round((factual / 18) * 100)

  const [barReady, setBarReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setBarReady(true), 120)
    return () => clearTimeout(t)
  }, [])

  const [saving, setSaving] = useState(false)
  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      downloadResultCard({ factual, overall, calibration, cal, factualKey, grade: grade.grade })
      setSaving(false)
    }, 60)
  }

  return (
    <div className="rpc">
      <div className="rpc-eyebrow">AI Literacy Scale</div>

      <div className="rpc-body">
        {/* Self-assessed — left */}
        <div className="rpc-score-col">
          <div className="rpc-score-num">
            <span className="rpc-num rpc-num-self">{overall.toFixed(1)}</span>
            <span className="rpc-denom">/7</span>
          </div>
          <div className="rpc-score-label">Self-assessed</div>
        </div>

        {/* Knowledge score — middle */}
        <div className="rpc-score-col rpc-mid-col">
          <div className="rpc-score-num">
            <span className="rpc-num">{animScore}</span>
            <span className="rpc-denom">/18</span>
          </div>
          <div className="rpc-score-label">Knowledge</div>
        </div>

        {/* Grade — right */}
        <div className="rpc-grade-col">
          <div className={`rpc-grade-letter ${grade.css}`}>{grade.grade}</div>
          <div className="rpc-grade-label">{pct}% correct</div>
        </div>
      </div>

      <div className="rpc-bar">
        <div className="rpc-bar-fill" style={{ width: barReady ? `${pct}%` : '0%' }} />
      </div>

      <button className="rpc-save-btn" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : '↓ Save as image'}
      </button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ResultsScreen({ likertAnswers, mcqAnswers, onRestart }) {
  const { f1Mean, f2Mean, overall } = computeLikertScores(likertAnswers)
  const factual     = computeFactualScore(mcqAnswers)
  const calibration = computeCalibration(overall, factual)
  const cal         = calibrationCategory(calibration)

  const factualKey = factualTierKey(factual)
  const overallKey = selfTierKey(overall)
  const f1Key      = selfTierKey(f1Mean)
  const f2Key      = selfTierKey(f2Mean)

  return (
    <div className="container">
      <div className="card">

        {/* ── Hero card ── */}
        <ResultHeroCard
          factual={factual}
          overall={overall}
          cal={cal}
          factualKey={factualKey}
          calibration={calibration}
        />

        {/* ── What you actually know ── */}
        <div className="section-group" style={{ animationDelay: '0.08s' }}>
          <div className="group-heading">Demonstrated knowledge</div>
          <DimensionBlock
            dim={DIMENSIONS.factual}
            value={factual}
            max={18}
            tierKey={factualKey}
            wide
            barDelay={120}
          />
        </div>

        {/* ── How you see yourself ── */}
        <div className="section-group" style={{ animationDelay: '0.16s' }}>
          <div className="group-heading">How you see yourself</div>

          <div className="score-block wide score-block-condensed">
            <div className="sb-label">Your overall AI confidence</div>
            <div className="sb-subtitle">Mean across all 19 self-assessment items</div>
            <div className="sb-score-row">
              <div className="sb-value">
                {overall.toFixed(2)}
                <span className="sb-max">/7</span>
              </div>
              <span className={`tier-badge ${TIER_BADGE[overallKey].css}`}>
                {TIER_BADGE[overallKey].label}
              </span>
            </div>
            <Bar value={overall} max={7} delay={200} />
          </div>

          <div className="score-grid" style={{ marginTop: 14 }}>
            <DimensionBlock
              dim={DIMENSIONS.f1}
              value={f1Mean}
              max={7}
              tierKey={f1Key}
              barDelay={250}
            />
            <DimensionBlock
              dim={DIMENSIONS.f2}
              value={f2Mean}
              max={7}
              tierKey={f2Key}
              barDelay={300}
            />
          </div>
        </div>

        {/* ── Calibration ── */}
        <div className="section-group" style={{ animationDelay: '0.24s' }}>
          <div className="group-heading">Calibration: confidence vs. knowledge</div>

          <div
            className="cal-card"
            style={{ borderColor: cal.border, background: cal.bg }}
          >
            <div className="cal-header">
              <div>
                <div className="cal-label" style={{ color: cal.color }}>{cal.label}</div>
                <div className="cal-score-line">
                  Score:{' '}
                  <strong style={{ color: cal.color }}>
                    {calibration > 0 ? '+' : ''}{calibration.toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>

            <CalibrationMeter score={calibration} />
            <p className="cal-desc">{cal.desc}</p>
          </div>

          <CalcDetails calibration={calibration} />
          <FunStats
            factual={factual}
            f1Mean={f1Mean}
            f2Mean={f2Mean}
            calibration={calibration}
          />
        </div>

        {/* ── Tier key ── */}
        <div className="divider" />
        <div style={{ marginBottom: 24 }}>
          <div className="sb-label" style={{ marginBottom: 10 }}>Score tiers</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.values(TIER_BADGE).map(t => (
              <span key={t.css} className={`tier-badge ${t.css}`}>{t.label}</span>
            ))}
          </div>
        </div>

        <button className="btn btn-ghost" onClick={onRestart}>
          ↺ Retake Assessment
        </button>

      </div>
    </div>
  )
}
