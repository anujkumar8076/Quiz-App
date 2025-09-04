import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'

export default function Home() {
  const nav = useNavigate()
  const { start, status, error, highs } = useQuiz()

  const onStart = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const difficulty = fd.get('difficulty')
    const amount = Number(fd.get('amount'))
    await start({ difficulty, amount })
    nav('/quiz')
  }

  return (
    <div className="card" role="region" aria-label="Start Quiz">
      <h2 style={{ marginTop: 0 }}>Start Quiz</h2>
      <form onSubmit={onStart} className="row" aria-describedby="desc">
        <div id="desc" className="label">Choose difficulty and number of questions.</div>
        <select className="select" name="difficulty" defaultValue="easy" aria-label="Select difficulty">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select className="select" name="amount" defaultValue="10" aria-label="Number of questions">
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
        <button type="submit" className="btn primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Loading…' : 'Start Quiz'}
        </button>
      </form>

      {status === 'error' && (
        <p role="alert" style={{ color: 'salmon' }}>Error: {error} — falling back to local questions.</p>
      )}

      <div className="space"></div>

      <section>
        <h3 style={{ margin: '0 0 .5rem' }}>High Scores</h3>
        {highs.length === 0 ? (
          <p className="label">No high scores yet. Your best results will appear here.</p>
        ) : (
          <table className="table" aria-label="High scores">
            <thead>
              <tr><th>Date</th><th>Score</th><th>Difficulty</th></tr>
            </thead>
            <tbody>
              {highs.map((h, i) => (
                <tr key={i}>
                  <td>{new Date(h.date).toLocaleString()}</td>
                  <td>{h.score}/{h.total} ({Math.round((h.score/h.total)*100)}%)</td>
                  <td><span className="badge">{h.difficulty}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <p className="label" style={{ marginTop: '.8rem' }}>
        Tips: Use <span className="kbd">Tab</span>/<span className="kbd">Enter</span> to navigate/select. You can also Skip.
      </p>
    </div>
  )
}
