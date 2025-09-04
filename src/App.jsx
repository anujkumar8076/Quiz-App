import { Routes, Route, Navigate } from 'react-router-dom'
import { QuizProvider } from './context/QuizContext'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Results from './pages/Results'

export default function App() {
  return (
    <QuizProvider>
      <div className="container">
        <header className="app-header" role="banner">
          <h1 tabIndex="0">React Quiz App</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="app-footer" role="contentinfo">
          <small>Built with React • Accessible • Responsive</small>
        </footer>
      </div>
    </QuizProvider>
  )
}
