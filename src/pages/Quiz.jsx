import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import QuestionCard from '../components/QuestionCard'
import ProgressBar from '../components/ProgressBar'

export default function Quiz() {
  const nav = useNavigate()
  const { status, questions, current, answers, score, timer, locked, select, next, skip, finish } = useQuiz()

  useEffect(() => {
    if (status === 'idle') nav('/')
    if (status === 'finished') nav('/results')
  }, [status])

  if (status === 'loading') return <div className="card"><p>Loading questions…</p></div>
  if (status === 'error') return <div className="card"><p>Using local questions. You can start again from Home.</p></div>
  if (status !== 'ready') return null

  const q = questions[current]
  const selected = answers[current]?.selected ?? null

  const onSubmit = () => {
    if (!locked && !selected) return
    if (current + 1 === questions.length) finish()
    else next()
  }

  return (
    <div style={{ width: '100%' }}>
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="label">Time left: <strong>{timer}s</strong></div>
          <div className="label">Score: <strong>{score}</strong></div>
        </div>
        <div className="space"></div>
        <ProgressBar value={current} max={questions.length - 1} />
      </div>

      <div className="space"></div>

      <QuestionCard
        q={q}
        index={current}
        total={questions.length}
        locked={locked}
        selected={selected}
        onSelect={select}
      />

      <div className="space"></div>

      <div className="row" style={{ justifyContent: 'space-between' }}>
        <button className="btn secondary" onClick={skip} aria-label="Skip question">Skip</button>
        <button
          className={`btn ${current + 1 === questions.length ? 'success' : 'primary'}`}
          onClick={onSubmit}
          disabled={!locked && selected === null}
          aria-label={current + 1 === questions.length ? 'Finish quiz' : 'Next question'}
        >
          {current + 1 === questions.length ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  )
}
