export default function WelcomeScreen({ onStart }) {
  return (
    <div className="container">
      <div className="card">
        <div className="welcome-icon">🤖</div>
        <h1 className="welcome-title">AI Literacy Scale</h1>
        <p className="welcome-subtitle">
          This assessment measures your AI literacy through two complementary lenses:
          how you <strong>perceive</strong> your own AI understanding, and how you{' '}
          <strong>demonstrate</strong> it through factual questions. Based on a
          psychometrically validated research instrument.
        </p>

        <div className="welcome-meta">
          <div className="meta-item">
            <span>📋</span>
            <span>37 questions total</span>
          </div>
          <div className="meta-item">
            <span>⏱</span>
            <span>~15 minutes</span>
          </div>
          <div className="meta-item">
            <span>🔒</span>
            <span>Stays in your browser</span>
          </div>
        </div>

        <div className="info-box" style={{ marginBottom: 32 }}>
          <div className="info-box-title">How it works</div>
          <div className="info-box-text">
            <strong>Part 1: Self-Assessment.</strong> Rate 19 statements about
            your AI knowledge on a 1 to 7 scale (Strongly Disagree to Strongly Agree).<br /><br />
            <strong>Part 2: Knowledge Check.</strong> Answer 18 multiple-choice
            questions about AI concepts.<br /><br />
            <strong>Results.</strong> See your scores across four dimensions of AI literacy.
          </div>
        </div>

        <button className="btn btn-primary btn-lg" onClick={onStart}>
          Start Assessment →
        </button>
      </div>
    </div>
  )
}
