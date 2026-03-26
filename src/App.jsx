import { useState, useEffect } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import LikertSection from './components/LikertSection'
import MCQSection from './components/MCQSection'
import ResultsScreen from './components/ResultsScreen'

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [likertAnswers, setLikertAnswers] = useState({})
  const [mcqAnswers, setMcqAnswers] = useState({})

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  const handleLikertComplete = (answers) => {
    setLikertAnswers(answers)
    setScreen('mcq')
  }

  const handleMCQComplete = (answers) => {
    setMcqAnswers(answers)
    setScreen('results')
  }

  const handleRestart = () => {
    setLikertAnswers({})
    setMcqAnswers({})
    setScreen('welcome')
  }

  return (
    <div className="app">
      {screen === 'welcome' && (
        <WelcomeScreen onStart={() => setScreen('likert')} />
      )}
      {screen === 'likert' && (
        <LikertSection onComplete={handleLikertComplete} />
      )}
      {screen === 'mcq' && (
        <MCQSection onComplete={handleMCQComplete} />
      )}
      {screen === 'results' && (
        <ResultsScreen
          likertAnswers={likertAnswers}
          mcqAnswers={mcqAnswers}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}
