import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'

export default function Results() {
  const nav = useNavigate()
  const { status, questions, answers, score, restart } = useQuiz()

  useEffect(() => {
    if (status !== 'finished') nav('/')
  }, [status])

  if (status !== 'finished') return null

  const total = questions.length

  return (
    <section className="card" aria-label="Results">
      <h2 style={{ marginTop: 0 }}>Results</h2>
      <p className="label">You scored <strong>{score}</strong> out of <strong>{total}</strong> ({Math.round((score/total)*100)}%)</p>

      <table className="table" aria-label="Answer breakdown">
        <thead>
          <tr>
            <th>#</th>
            <th>Question</th>
            <th>Your Answer</th>
            <th>Correct Answer</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, i) => {
            const a = answers[i]
            const ok = a?.isCorrect
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{q.question}</td>
                <td>{a?.selected ?? <em>Skipped/Timeout</em>}</td>
                <td>{q.correct}</td>
                <td>
                  <span className={`badge ${ok ? 'ok' : 'err'}`}>{ok ? 'Correct' : 'Incorrect'}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="space"></div>

      <div className="row" style={{ justifyContent: 'space-between' }}>
        <button className="btn secondary" onClick={() => nav('/')}>Back to Home</button>
        <button className="btn primary" onClick={restart}>Restart Quiz</button>
      </div>
    </section>
  )
}
